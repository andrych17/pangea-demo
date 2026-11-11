"""Browser smoke test against a running production build.

    python3 scripts/smoke.py http://127.0.0.1:3299     (npm run check does this for you)

Fails on: uncaught page errors, console errors (hydration error #418 included), horizontal overflow
at 390px, a preloader that does not clear, and a broken flow on whichever flow routes exist: the add
form on /dashboard, sending a message on /assistant, the print layout on /report. Delete a flow folder
and its check is skipped. The browser runs in Asia/Jakarta while the server renders in UTC, so unpinned
date formatting fails here, not on Vercel.
"""
import json
import re
import sys
import time
from pathlib import Path

from playwright.sync_api import Page, sync_playwright

ROOT = Path(__file__).resolve().parent.parent
BASE = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://127.0.0.1:3299"
SLUG = re.search(r'slug:\s*"([^"]+)"', (ROOT / "site.config.ts").read_text()).group(1)
INTRO_KEY = f"{SLUG}-intro"
SKIP = re.compile(r"^/(_|icon|apple-icon|opengraph-image|twitter-image|manifest|robots|sitemap)|\.")

manifest = json.loads((ROOT / ".next" / "prerender-manifest.json").read_text())
routes = sorted(r for r in manifest["routes"] if not SKIP.search(r))
failures: list[str] = []


def watch(page: Page, bucket: list[str]) -> None:
    page.on("pageerror", lambda e: bucket.append(f"pageerror: {e}"))
    page.on("console", lambda m: m.type == "error" and bucket.append(f"console: {m.text[:300]}"))


def scroll_through(page: Page) -> None:
    height = page.evaluate("document.documentElement.scrollHeight")
    for y in range(0, height, 600):
        page.evaluate(f"window.scrollTo(0, {y})")
        time.sleep(0.12)
    page.evaluate("window.scrollTo(0, 0)")


with sync_playwright() as p:
    browser = p.chromium.launch()

    # Desktop pass: one tab, so the preloader plays on the first route and is skipped afterwards.
    ctx = browser.new_context(viewport={"width": 1440, "height": 900}, timezone_id="Asia/Jakarta", locale="en-GB")
    page = ctx.new_page()
    for i, route in enumerate(routes):
        errors: list[str] = []
        watch(page, errors)
        page.goto(BASE + route, wait_until="networkidle")
        if i == 0:
            try:
                page.wait_for_function("document.documentElement.dataset.intro === 'done'", timeout=8000)
                page.wait_for_selector(".ct-preloader", state="hidden", timeout=3000)
            except Exception:
                failures.append(f"{route}: preloader did not clear within ~8s")
        scroll_through(page)
        if route == "/" and page.locator("[data-badge]").count():
            # Where each character of the hero badge really sits on the ring (arc length from the start).
            # They must run in order (no wrap-around overlap) and the last one must end at the start (no gap).
            page.evaluate("document.fonts.ready.then(() => true)")
            time.sleep(0.5)
            ring = page.evaluate(
                """() => {
                  const t = document.querySelector('[data-badge]');
                  const arc = (p) => { let d = Math.atan2(p.y - 100, p.x - 100) - Math.PI; while (d < 0) d += 2 * Math.PI; return d * 74; };
                  const pos = [...Array(t.getNumberOfChars()).keys()].slice(1, -1).map((i) => arc(t.getStartPositionOfChar(i))); // skip the first char and the trailing zero-width space
                  return { ordered: pos.every((v, i) => i === 0 || v > pos[i - 1]), last: Math.round(pos[pos.length - 1]) };
                }"""
            )
            if not ring["ordered"] or not 440 <= ring["last"] <= 465:
                failures.append(f"/: hero badge text does not fit its ring (in order: {ring['ordered']}, last char at {ring['last']} of 465)")
        if route == "/dashboard":
            before = page.locator("main ul > li").count()
            page.locator("form button[type=submit]").click()
            if not page.locator("form [role=alert]").is_visible():
                failures.append("/dashboard: empty submit showed no validation message")
            page.fill("form input[name=title]", "Smoke test item")
            page.fill("form input[name=meta]", "Smoke Co")
            page.locator("form button[type=submit]").click()
            time.sleep(0.6)
            if page.locator("main ul > li").count() != before + 1:
                failures.append("/dashboard: adding an item did not add a row")
            page.evaluate("localStorage.clear()")
        if route == "/assistant":
            before = page.locator("[data-msg=assistant]").count()
            page.locator("form button[type=submit]").click()
            if not page.locator("form [role=alert]").is_visible():
                failures.append("/assistant: empty message showed no validation message")
            page.fill("form input[name=message]", page.locator("[data-suggestion]").first.inner_text())
            page.locator("form button[type=submit]").click()
            try:
                page.wait_for_function(f"document.querySelectorAll('[data-msg=assistant]').length > {before}", timeout=3000)
                page.wait_for_function("!document.querySelector('[data-done=false]')", timeout=10000)
            except Exception:
                failures.append("/assistant: no streamed reply after sending a suggestion")
        if route == "/report":
            page.emulate_media(media="print")
            chrome_hidden = page.evaluate("[...document.querySelectorAll('[data-noprint]')].every((e) => getComputedStyle(e).display === 'none')")
            if not chrome_hidden or not page.locator("[data-doc]").is_visible():
                failures.append("/report: print layout still shows site chrome or hides the document")
            page.emulate_media(media="screen")
        failures += [f"{route} (desktop): {e}" for e in dict.fromkeys(errors)]
        page.close()
        page = ctx.new_page()
        page.add_init_script(f"try{{sessionStorage.setItem('{INTRO_KEY}','1')}}catch(e){{}}")
    ctx.close()

    # Mobile pass: horizontal overflow is the most common layout bug on phones.
    ctx = browser.new_context(viewport={"width": 390, "height": 844}, timezone_id="Asia/Jakarta", is_mobile=True, has_touch=True)
    ctx.add_init_script(f"try{{sessionStorage.setItem('{INTRO_KEY}','1')}}catch(e){{}}")
    for route in routes:
        page = ctx.new_page()
        errors = []
        watch(page, errors)
        page.goto(BASE + route, wait_until="networkidle")
        scroll_through(page)
        # Report the first element that sticks out (its parent fits), ignoring fixed layers like the header.
        overflow = page.evaluate(
            """() => {
              const w = document.documentElement.clientWidth;
              if (document.documentElement.scrollWidth <= w + 1) return [];
              const out = (el) => el.getBoundingClientRect().right > w + 1;
              const inFixed = (el) => {
                for (let n = el; n && n !== document.body; n = n.parentElement) if (getComputedStyle(n).position === 'fixed') return true;
                return false;
              };
              return [...document.querySelectorAll('body *')]
                .filter((el) => out(el) && !inFixed(el) && !(el.parentElement && out(el.parentElement)))
                .slice(0, 5)
                .map((el) => el.tagName.toLowerCase() + '.' + (el.getAttribute('class') || '').split(' ').slice(0, 4).join('.'));
            }"""
        )
        if overflow:
            failures.append(f"{route} (390px): horizontal overflow from {overflow}")
        failures += [f"{route} (mobile): {e}" for e in dict.fromkeys(errors)]
        page.close()
    browser.close()

print(f"routes: {', '.join(routes)}")
if failures:
    print("FAIL")
    for f in failures:
        print(" -", f)
    sys.exit(1)
print("OK: no page errors, no console errors, no overflow at 390px, preloader clears")

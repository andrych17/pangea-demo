"""Screenshot helper for visual checks and for the proposal.

    python3 scripts/shot.py <path> <width> <name> [--full] [--intro]

Scrolls slowly so in-view animations fire, then saves local/shots/<name>.png (local/ is gitignored).
--intro also saves <name>-intro.png mid-preloader. BASE env overrides http://127.0.0.1:3299.
Downscale before reading big shots: convert local/shots/x.png -resize 1280x local/shots/x-sm.png
"""
import os
import re
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
BASE = os.environ.get("BASE", "http://127.0.0.1:3299")
SLUG = re.search(r'slug:\s*"([^"]+)"', (ROOT / "site.config.ts").read_text()).group(1)
path, width, name = sys.argv[1], int(sys.argv[2]), sys.argv[3]
full = "--full" in sys.argv
intro = "--intro" in sys.argv
out = ROOT / "local" / "shots"
out.mkdir(parents=True, exist_ok=True)

errors: list[str] = []
with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={"width": width, "height": 900}, device_scale_factor=1, timezone_id="Asia/Jakarta")
    if not intro:
        ctx.add_init_script(f"try{{sessionStorage.setItem('{SLUG}-intro','1')}}catch(e){{}}")
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: m.type == "error" and errors.append(m.text[:300]))
    page.goto(BASE + path, wait_until="networkidle")
    if intro:
        time.sleep(1.1)
        page.screenshot(path=str(out / f"{name}-intro.png"))
        time.sleep(2.8)
    else:
        time.sleep(1.2)
    # Scroll even for a viewport shot: once-in-view pieces near the fold (CountUp stats) otherwise stay at 0.
    height = page.evaluate("document.documentElement.scrollHeight") if full else 1500
    for y in range(0, height, 500):
        page.evaluate(f"window.scrollTo(0,{y})")
        time.sleep(0.25)
    page.evaluate("window.scrollTo(0,0)")
    time.sleep(1.0)
    page.screenshot(path=str(out / f"{name}.png"), full_page=full)
    print("saved", out / f"{name}.png", "| errors:", errors[:5])
    browser.close()

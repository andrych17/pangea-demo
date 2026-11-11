"""Fetch CC0 / public-domain photos from Openverse for a demo.

    python3 -I scripts/photos.py "restaurant table food" 6
    python3 -I scripts/photos.py "clinic reception" 4 --prefix clinic

Saves JPEGs (max 1280px wide) to public/photos/<prefix>-<n>.jpg, strips metadata with clean-media,
and records title, creator, licence and source in public/photos/credits.json for the README.
Downloads land in a fresh temp folder first and are re-encoded by Pillow, never executed.
Look at every photo before using it: search results can be off-topic or show identifiable people.
Each preset lists good queries in `photoQueries`.
"""
import json
import shutil
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "photos"
CREDITS = OUT / "credits.json"
API = "https://api.openverse.org/v1/images/"
UA = {"User-Agent": "demo-starter-photo-fetch/1.0"}
MAX_BYTES = 15 * 1024 * 1024


PAGE_SIZE = 20  # Openverse answers 401 above 20 per page without an API key.


def search(query: str, count: int) -> list[dict]:
    """About three candidates per photo wanted (many are too small or fail to download), up to three pages."""
    results: list[dict] = []
    for page in range(1, 4):
        params = urllib.parse.urlencode({"q": query, "license": "cc0,pdm", "page_size": PAGE_SIZE, "page": page, "size": "large", "mature": "false"})
        try:
            with urllib.request.urlopen(urllib.request.Request(f"{API}?{params}", headers=UA), timeout=20) as r:
                batch = json.load(r).get("results", [])
        except urllib.error.HTTPError as e:
            if results:
                break  # keep what the earlier pages gave
            sys.exit(f"Openverse search failed: HTTP {e.code}. Anonymous requests allow page_size <= 20 and a few per minute; wait and retry.")
        results += batch
        if len(results) >= count * 3 or len(batch) < PAGE_SIZE:
            break
    return results


def download(url: str, dest: Path) -> bool:
    if urllib.parse.urlparse(url).scheme != "https":
        return False
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
            if not r.headers.get("Content-Type", "").startswith("image/"):
                return False
            data = r.read(MAX_BYTES + 1)
    except Exception as e:  # noqa: BLE001 - one bad source should not stop the batch
        print(f"  skip ({e.__class__.__name__})")
        return False
    if len(data) > MAX_BYTES:
        return False
    dest.write_bytes(data)
    return True


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        sys.exit(__doc__)
    query, count = args[0], int(args[1]) if len(args) > 1 else 4
    prefix = sys.argv[sys.argv.index("--prefix") + 1] if "--prefix" in sys.argv else query.split()[0].lower()
    OUT.mkdir(parents=True, exist_ok=True)
    credits = json.loads(CREDITS.read_text()) if CREDITS.exists() else []
    saved = 0

    with tempfile.TemporaryDirectory(prefix="photos-") as tmp:
        for hit in search(query, count):
            if saved >= count:
                break
            if (hit.get("width") or 0) < 900:
                continue
            raw = Path(tmp) / f"raw-{saved}"
            print(f"- {hit.get('title') or 'untitled'} ({hit.get('license')}, {hit.get('provider')})")
            if not download(hit["url"], raw):
                continue
            try:
                with Image.open(raw) as im:
                    im = im.convert("RGB")
                    if im.width > 1280:
                        im = im.resize((1280, round(im.height * 1280 / im.width)), Image.LANCZOS)
                    name = f"{prefix}-{saved + 1}.jpg"
                    im.save(OUT / name, "JPEG", quality=82, optimize=True, progressive=True)
            except Exception as e:  # noqa: BLE001 - corrupt or unsupported file
                print(f"  skip (not an image: {e.__class__.__name__})")
                continue
            if shutil.which("clean-media"):
                subprocess.run(["clean-media", "--in-place", str(OUT / name)], check=False, capture_output=True)
                (OUT / f"{name}.bak").unlink(missing_ok=True)  # clean-media keeps the original (with metadata) as .bak
            credits = [c for c in credits if c.get("file") != name]
            credits.append({
                "file": name,
                "title": hit.get("title"),
                "creator": hit.get("creator"),
                "license": hit.get("license"),
                "source": hit.get("foreign_landing_url"),
                "provider": hit.get("provider"),
            })
            saved += 1
            print(f"  saved public/photos/{name}")

    CREDITS.write_text(json.dumps(credits, indent=2, ensure_ascii=False) + "\n")
    print(f"{saved} photo(s) saved. Credits: public/photos/credits.json. Use them as `photo: \"/photos/<file>\"` in the preset.")


if __name__ == "__main__":
    main()

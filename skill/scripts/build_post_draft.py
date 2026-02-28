#!/usr/bin/env python3
import json
import urllib.parse
import urllib.request

BASE = "http://127.0.0.1:8765"


def get_json(url):
    with urllib.request.urlopen(url, timeout=10) as r:
        return json.loads(r.read().decode("utf-8"))


def main():
    q = urllib.parse.urlencode({"status": "shortlisted", "limit": 1})
    data = get_json(f"{BASE}/materials?{q}")
    items = data.get("items") or []
    if not items:
        print(json.dumps({"ok": False, "error": "no_shortlisted_material"}, ensure_ascii=False))
        return

    m = items[0]
    src = m.get("tweet_url")
    text = (m.get("text") or "").replace("\n", " ").strip()
    text = text[:180]

    draft = f"Signal from today's AI feed: {text}\n\nWhat stands out is execution quality over hype.\n\n(source inspiration: {src})"
    out = {
        "ok": True,
        "material_tweet_url": src,
        "draft": draft[:280],
        "image_url": (m.get("image_urls") or [None])[0],
    }
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

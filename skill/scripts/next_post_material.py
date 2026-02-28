#!/usr/bin/env python3
import json
import urllib.parse
import urllib.request

BASE = "http://127.0.0.1:8765"


def get_json(url):
    with urllib.request.urlopen(url, timeout=10) as r:
        return json.loads(r.read().decode("utf-8"))


def main():
    # 优先取 shortlisted，其次取 new
    q1 = urllib.parse.urlencode({"status": "shortlisted", "limit": 1})
    d1 = get_json(f"{BASE}/materials?{q1}")
    items = d1.get("items") or []

    source = "shortlisted"
    if not items:
        q2 = urllib.parse.urlencode({"status": "new", "limit": 1})
        d2 = get_json(f"{BASE}/materials?{q2}")
        items = d2.get("items") or []
        source = "new"

    if not items:
        print(json.dumps({"ok": False, "error": "no_material"}, ensure_ascii=False))
        return

    row = items[0]
    payload = {
        "ok": True,
        "source": source,
        "material": {
            "tweet_url": row.get("tweet_url"),
            "author": row.get("author"),
            "text": row.get("text"),
            "image_url": (row.get("image_urls") or [None])[0],
            "status": row.get("status", "new"),
            "score": row.get("score", 0),
        }
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

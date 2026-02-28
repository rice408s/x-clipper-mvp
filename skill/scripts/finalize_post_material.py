#!/usr/bin/env python3
import argparse
import json
import urllib.request
import urllib.error

BASE = "http://127.0.0.1:8765"


def post(path, payload):
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode("utf-8")
            return {"ok": False, "http": e.code, "error": json.loads(body)}
        except Exception:
            return {"ok": False, "http": e.code, "error": str(e)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tweet-url", required=True, help="source material tweet url")
    ap.add_argument("--x-post-url", required=True, help="published X post url")
    ap.add_argument("--note", default="", help="optional note")
    args = ap.parse_args()

    res = post("/material/update", {
        "tweet_url": args.tweet_url,
        "patch": {
            "status": "used",
            "posted_x_url": args.x_post_url,
            "posted_at": __import__('time').strftime("%Y-%m-%dT%H:%M:%SZ", __import__('time').gmtime()),
            "post_note": args.note,
        }
    })
    print(json.dumps(res, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

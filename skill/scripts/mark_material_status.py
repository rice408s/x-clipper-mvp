#!/usr/bin/env python3
import argparse
import json
import urllib.request

BASE = "http://127.0.0.1:8765"


def post(path, payload):
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read().decode("utf-8"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tweet-url", required=True)
    ap.add_argument("--status", required=True, choices=["new", "shortlisted", "used"])
    args = ap.parse_args()
    res = post("/material/status", {"tweet_url": args.tweet_url, "status": args.status})
    print(json.dumps(res, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
import argparse
import json
import urllib.parse
import urllib.request

BASE = "http://127.0.0.1:8765"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--status", default="shortlisted", choices=["all", "new", "shortlisted", "used"])
    ap.add_argument("--limit", type=int, default=10)
    ap.add_argument("--q", default="")
    args = ap.parse_args()

    query = urllib.parse.urlencode({"status": args.status, "limit": args.limit, "q": args.q})
    with urllib.request.urlopen(f"{BASE}/materials?{query}", timeout=10) as r:
        data = json.loads(r.read().decode("utf-8"))
    print(json.dumps(data, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

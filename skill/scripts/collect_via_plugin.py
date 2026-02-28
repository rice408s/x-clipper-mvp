#!/usr/bin/env python3
import argparse
import json
import time
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


def get(path):
    with urllib.request.urlopen(BASE + path, timeout=10) as r:
        return json.loads(r.read().decode("utf-8"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--keywords", default="ai", help="space-separated")
    ap.add_argument("--max-save", type=int, default=3)
    ap.add_argument("--wait-seconds", type=int, default=20)
    args = ap.parse_args()

    payload = {
        "action": "collect_once",
        "payload": {
            "keywords": args.keywords.split(),
            "maxSave": args.max_save,
            "needImage": True,
            "minScore": 5,
        },
    }
    queued = post("/command", payload)
    cmd_id = queued.get("queued", {}).get("id")
    print(f"queued_command_id={cmd_id}")

    deadline = time.time() + args.wait_seconds
    while time.time() < deadline:
        data = get("/results")
        for item in reversed(data.get("results", [])):
            if item.get("command_id") == cmd_id:
                print(json.dumps(item, ensure_ascii=False, indent=2))
                return
        time.sleep(1.5)

    print("timeout_waiting_result")


if __name__ == "__main__":
    main()

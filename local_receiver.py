#!/usr/bin/env python3
import json
import os
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

DATA_PATH = os.path.expanduser("/Users/arlo/.openclaw/workspace/x-clipper-mvp/data/x-materials.jsonl")
os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)


def load_existing_urls(path):
    urls = set()
    if not os.path.exists(path):
        return urls
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            try:
                row = json.loads(line)
                u = row.get("tweet_url")
                if u:
                    urls.add(u)
            except Exception:
                continue
    return urls


EXISTING = load_existing_urls(DATA_PATH)
COMMANDS = []
RESULTS = []
LAST_ID = 0


def next_id():
    global LAST_ID
    LAST_ID += 1
    return LAST_ID


class Handler(BaseHTTPRequestHandler):
    def _json(self, code, data):
        b = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(b)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(b)

    def _read_json(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length)
            return json.loads(raw.decode("utf-8"))
        except Exception as e:
            raise ValueError(f"bad json: {e}")

    def do_OPTIONS(self):
        self._json(200, {"ok": True})

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/health":
            return self._json(200, {
                "ok": True,
                "data_path": DATA_PATH,
                "queued_commands": len(COMMANDS),
                "results": len(RESULTS),
            })

        if path == "/command/next":
            if COMMANDS:
                cmd = COMMANDS.pop(0)
                return self._json(200, {"ok": True, "command": cmd})
            return self._json(200, {"ok": True, "command": None})

        if path == "/results":
            return self._json(200, {"ok": True, "results": RESULTS[-20:]})

        self._json(404, {"ok": False, "error": "not found"})

    def do_POST(self):
        path = urlparse(self.path).path

        if path == "/clip":
            try:
                row = self._read_json()
            except ValueError as e:
                return self._json(400, {"ok": False, "error": str(e)})

            tweet_url = row.get("tweet_url")
            if not tweet_url:
                return self._json(400, {"ok": False, "error": "tweet_url required"})

            if tweet_url in EXISTING:
                return self._json(200, {"ok": True, "saved": False, "reason": "duplicate"})

            with open(DATA_PATH, "a", encoding="utf-8") as f:
                f.write(json.dumps(row, ensure_ascii=False) + "\n")
            EXISTING.add(tweet_url)
            return self._json(200, {"ok": True, "saved": True})

        if path == "/command":
            try:
                payload = self._read_json()
            except ValueError as e:
                return self._json(400, {"ok": False, "error": str(e)})
            action = payload.get("action")
            if not action:
                return self._json(400, {"ok": False, "error": "action required"})
            cmd = {
                "id": next_id(),
                "action": action,
                "payload": payload.get("payload", {}),
                "created_at": time.time(),
            }
            COMMANDS.append(cmd)
            return self._json(200, {"ok": True, "queued": cmd})

        if path == "/command/result":
            try:
                payload = self._read_json()
            except ValueError as e:
                return self._json(400, {"ok": False, "error": str(e)})
            payload["received_at"] = time.time()
            RESULTS.append(payload)
            if len(RESULTS) > 200:
                del RESULTS[:100]
            return self._json(200, {"ok": True})

        self._json(404, {"ok": False, "error": "not found"})


def main():
    host = "127.0.0.1"
    port = 8765
    print(f"X Clipper receiver listening on http://{host}:{port}")
    print(f"Data file: {DATA_PATH}")
    HTTPServer((host, port), Handler).serve_forever()


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
import json
import urllib.request

with urllib.request.urlopen("http://127.0.0.1:8765/stats", timeout=10) as r:
    data = json.loads(r.read().decode("utf-8"))
print(json.dumps(data, ensure_ascii=False, indent=2))

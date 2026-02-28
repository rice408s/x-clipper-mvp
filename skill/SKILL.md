---
name: x-materials-local
description: Search and pick local X-clipped material records from JSONL for drafting Twitter/X posts. Use when user asks to reuse saved X素材/剪藏内容 for publishing.
---

# X Materials Local Skill

Use local JSONL clips as a material source before drafting/posting to X.

## Data file

Default file path:
- `/Users/arlo/.openclaw/workspace/x-clipper-mvp/data/x-materials.jsonl`

Each line should be one JSON object:
- `tweet_url`
- `author`
- `text`
- `image_urls` (array)
- `tags` (array)
- `clipped_at`

## Search

Run:

```bash
python3 scripts/search_materials.py \
  --file /Users/arlo/.openclaw/workspace/x-clipper-mvp/data/x-materials.jsonl \
  --query "AIGC 美女" --limit 5
```

## Collect via plugin (two-way)

Queue one collect task to the browser plugin:

```bash
python3 scripts/collect_via_plugin.py \
  --keywords "aigc ai image prompt" \
  --max-save 3 --wait-seconds 25
```

Requirements:
- X page is open in browser
- extension is loaded
- local receiver is running (`python3 /Users/arlo/.openclaw/workspace/x-clipper-mvp/local_receiver.py`)

## Pick for posting

Prefer records with:
1) non-empty `image_urls`
2) recent `clipped_at`
3) text relevance to requested topic

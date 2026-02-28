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

Get one best next material (prefer shortlisted):

```bash
python3 scripts/next_post_material.py
```

Build an X draft from shortlisted material:

```bash
python3 scripts/build_post_draft.py
```

Or query list by status/search:

```bash
python3 scripts/pick_materials.py --status shortlisted --limit 10
python3 scripts/pick_materials.py --status all --q "ai prompt" --limit 10
```

Mark status manually:

```bash
python3 scripts/mark_material_status.py \
  --tweet-url "https://x.com/xxx/status/123" \
  --status used
```

Finalize after posting (write back posted URL + mark used):

```bash
python3 scripts/finalize_post_material.py \
  --tweet-url "https://x.com/source/status/111" \
  --x-post-url "https://x.com/you/status/222"
```

Get dataset stats:

```bash
python3 scripts/materials_stats.py
```

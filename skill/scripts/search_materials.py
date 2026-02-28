#!/usr/bin/env python3
import argparse, json, os


def load_jsonl(path):
    if not os.path.exists(path):
        return []
    rows = []
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                rows.append(json.loads(line))
            except Exception:
                pass
    return rows


def score(row, q):
    text = (row.get('text') or '').lower()
    author = (row.get('author') or '').lower()
    tags = ' '.join(row.get('tags') or []).lower()
    s = 0
    for token in q.lower().split():
        if token in text:
            s += 3
        if token in tags:
            s += 2
        if token in author:
            s += 1
    if row.get('image_urls'):
        s += 1
    return s


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--file', required=True)
    ap.add_argument('--query', default='')
    ap.add_argument('--limit', type=int, default=5)
    args = ap.parse_args()

    rows = load_jsonl(args.file)
    if args.query:
        rows = sorted(rows, key=lambda r: score(r, args.query), reverse=True)
    else:
        rows = sorted(rows, key=lambda r: r.get('clipped_at', ''), reverse=True)

    out = rows[:args.limit]
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()

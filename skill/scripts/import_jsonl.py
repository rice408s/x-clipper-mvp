#!/usr/bin/env python3
import argparse, os, json

def iter_rows(path):
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line=line.strip()
            if not line or line.startswith('#'):
                continue
            try:
                yield json.loads(line)
            except Exception:
                continue


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--src', required=True)
    ap.add_argument('--dst', required=True)
    args=ap.parse_args()

    os.makedirs(os.path.dirname(args.dst), exist_ok=True)
    existing=set()
    if os.path.exists(args.dst):
        for r in iter_rows(args.dst):
            existing.add(r.get('tweet_url'))

    added=0
    with open(args.dst, 'a', encoding='utf-8') as out:
        for r in iter_rows(args.src):
            k=r.get('tweet_url')
            if not k or k in existing:
                continue
            out.write(json.dumps(r, ensure_ascii=False) + '\n')
            existing.add(k)
            added += 1
    print(f'added={added}')

if __name__=='__main__':
    main()

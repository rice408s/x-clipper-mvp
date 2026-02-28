# X Ops Studio (Plasmo Refactor)

这是 `X Ops Studio` 的 Plasmo 重构版第一阶段骨架。

## 技术栈
- Plasmo + TypeScript
- React
- Zod
- Zustand

## 已迁移（v0.1）
- `contents/x.ts`：X 页面注入（悬浮按钮、快速剪藏、下发运营任务）
- `lib/api/localReceiver.ts`：本地 127.0.0.1:8765 API 封装
- `popup/index.tsx`：运行状态 + 一键运营任务
- `options/index.tsx`：设置页骨架
- `lib/ops/scoring.ts`：候选打分函数

## 运行
```bash
pnpm install
pnpm dev
```

## 迁移清单（下一步）
1. 把旧版 content.js 的完整剪藏列表/缩略图/草稿逻辑迁移到 `contents/x.ts`
2. 把 ops_round 真正执行逻辑迁入 Plasmo（目前仍依赖本地服务）
3. options 持久化（chrome.storage.local）
4. popup 增加材料查询与一键 shortlists

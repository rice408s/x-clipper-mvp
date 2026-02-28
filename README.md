# X Ops Studio

X 运营工作台插件：剪藏 + 互动运营 + 本地素材库 + Skill 双向桥接。

## 功能

- 在 `x.com` 页面悬浮球剪藏推文（文本、作者、链接、图片）
- 自动写入本地素材库（无需下载文件）
- 本地服务支持双向通信：Skill 下发采集指令，插件执行并回传结果

## 目录

- `extension/` Chrome 扩展（Manifest V3）
- `local_receiver.py` 本地桥接服务（HTTP）
- `skill/` 素材检索与采集脚本
- `data/x-materials.jsonl` 本地素材库（默认）

## 1) 安装扩展

1. 打开 `chrome://extensions`
2. 开启**开发者模式**
3. 点击**加载已解压的扩展程序**
4. 选择 `extension/` 目录

## 2) 启动本地服务

```bash
python3 local_receiver.py
```

健康检查：

```bash
curl http://127.0.0.1:8765/health
```

## 3) 使用插件

在 X 页面右下角会出现悬浮球（✂️），hover 自动展开菜单：

- 选择帖子并剪藏
- 快速剪藏首条
- 查看剪藏列表
- 生成发帖草稿（基于 shortlisted/new 素材自动填充到发帖框，不自动发布）
- 运营一轮(10条)（4赞+3转发+3英文评论）

剪藏列表支持：
- 状态筛选（new / shortlisted / used）
- 关键词搜索（author/text）
- 图片缩略图预览（点击可打开原图）
- 单条操作（shortlist / used / 用于发帖）
- 批量操作（Top5 shortlists / 清理 used）

剪藏结果会写入：`data/x-materials.jsonl`

## 4) Skill 脚本

### 检索本地素材

```bash
python3 skill/scripts/search_materials.py \
  --file data/x-materials.jsonl \
  --query "ai aigc" --limit 5
```

### 触发插件自动采集（双向）

> 要求：X 页面已打开且扩展已加载，本地服务在运行。

```bash
python3 skill/scripts/collect_via_plugin.py \
  --keywords "ai" \
  --max-save 3 \
  --wait-seconds 30
```

### 获取下一个发帖素材（优先 shortlisted）

```bash
python3 skill/scripts/next_post_material.py
```

### 生成发帖草稿（基于 shortlisted）

```bash
python3 skill/scripts/build_post_draft.py
```

### 更新素材状态

```bash
python3 skill/scripts/mark_material_status.py \
  --tweet-url "https://x.com/xxx/status/123" \
  --status used
```

### 发帖后回写闭环（标记 used + 记录你的帖子链接）

```bash
python3 skill/scripts/finalize_post_material.py \
  --tweet-url "https://x.com/source/status/111" \
  --x-post-url "https://x.com/you/status/222"
```

### 素材库统计

```bash
python3 skill/scripts/materials_stats.py
```

### 导入外部 JSONL 并去重

```bash
python3 skill/scripts/import_jsonl.py \
  --src /path/to/exported.jsonl \
  --dst data/x-materials.jsonl
```

## 数据格式（JSONL）

每行一个 JSON 对象，核心字段：

- `tweet_url`
- `author`
- `text`
- `image_urls`（数组）
- `tags`（数组）
- `clipped_at`

## 常见问题

### 1. 插件不回传结果

- 刷新扩展：`chrome://extensions`
- 刷新 X 页面（建议强刷）
- 确认本地服务可访问：`/health`

### 2. 采集超时

通常是 content script 未激活。保持 `x.com` 标签页前台 5-10 秒后重试。

## 安全说明

- 仓库默认忽略 `data/*.jsonl`，避免误提交本地素材。
- 本地服务默认监听 `127.0.0.1:8765`，不对外网暴露。

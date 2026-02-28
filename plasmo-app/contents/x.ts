import type { PlasmoCSConfig } from "plasmo"
import { saveClip, enqueueCommand } from "~lib/api/localReceiver"
import { decideCandidateScore } from "~lib/ops/scoring"
import type { MaterialItem } from "~lib/materials/types"
import { loadOpsSettings } from "~lib/ops/settings"

export const config: PlasmoCSConfig = {
  matches: ["https://x.com/*"],
  run_at: "document_idle"
}

const CLIPS_KEY = "x_clips"

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function getClips(): Promise<MaterialItem[]> {
  const data = await chrome.storage.local.get([CLIPS_KEY])
  return (data[CLIPS_KEY] || []) as MaterialItem[]
}

async function setClips(items: MaterialItem[]) {
  await chrome.storage.local.set({ [CLIPS_KEY]: items })
}

function extractFromArticle(article: HTMLElement): MaterialItem {
  const textNode = article.querySelector('[data-testid="tweetText"]') as HTMLElement | null
  const text = textNode?.innerText?.trim() || ""

  const authorLink = article.querySelector('a[href^="/"][role="link"]') as HTMLAnchorElement | null
  const author = authorLink?.getAttribute("href")?.split("/")?.[1] || ""

  const tweetLinkEl = [...article.querySelectorAll('a[href*="/status/"]')].find((a) => {
    const h = (a as HTMLAnchorElement).getAttribute("href") || ""
    return h.includes("/status/") && !h.includes("/analytics") && !h.includes("/photo/")
  }) as HTMLAnchorElement | undefined

  const tweetUrl = tweetLinkEl ? `https://x.com${tweetLinkEl.getAttribute("href")}` : ""

  const imageUrls = [...article.querySelectorAll('img[src*="pbs.twimg.com/media"]')]
    .map((img) => (img as HTMLImageElement).src.replace(/&name=\w+/, "&name=orig"))

  const row: MaterialItem = {
    id: crypto.randomUUID(),
    source: "x",
    tweet_url: tweetUrl,
    author,
    text,
    image_urls: [...new Set(imageUrls)],
    tags: ["AI"],
    lang: /[\u4e00-\u9fff]/.test(text) ? "zh" : "en",
    status: "new",
    clipped_at: new Date().toISOString()
  }

  row.score = decideCandidateScore(row)
  return row
}

function toast(text: string) {
  const el = document.createElement("div")
  el.textContent = text
  Object.assign(el.style, {
    position: "fixed",
    right: "24px",
    bottom: "120px",
    zIndex: "2147483647",
    background: "rgba(0,0,0,0.82)",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "10px",
    fontSize: "12px"
  })
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 1800)
}

async function clipTop() {
  const article = document.querySelector("article") as HTMLElement | null
  if (!article) return toast("没找到帖子")

  const row = extractFromArticle(article)
  if (!row.tweet_url) return toast("未识别到推文链接")

  const items = await getClips()
  items.unshift(row)
  await setClips(items)
  await saveClip(row)
  toast(`已剪藏 @${row.author || "unknown"}`)
}

async function runOpsRound() {
  const s = await loadOpsSettings()
  const rs = await enqueueCommand("ops_round", {
    total: s.roundTotal,
    minDelaySec: s.minDelaySec,
    maxDelaySec: s.maxDelaySec
  })
  toast(`已下发运营任务 #${rs?.queued?.id || "?"}（${s.roundTotal}条）`)
}

function pickDraftMaterial(items: MaterialItem[]) {
  const shortlisted = items.filter((x) => (x.status || "new") === "shortlisted")
  const pool = shortlisted.length ? shortlisted : items
  if (!pool.length) return null
  return pool.slice().sort((a, b) => (b.score || 0) - (a.score || 0))[0]
}

function draftTextFromMaterial(m: MaterialItem) {
  const core = (m.text || "").replace(/\s+/g, " ").trim().slice(0, 160)
  return `Signal from my AI feed today:\n${core}\n\nPractical workflows > hype.\n\nSource inspo: ${m.tweet_url}\n#AI #AIGC #BuildInPublic`
}

function getComposerBox() {
  return (document.querySelector('[data-testid="tweetTextarea_0"] [contenteditable="true"]') ||
    document.querySelector('div[contenteditable="true"][role="textbox"]')) as HTMLElement | null
}

async function typeSlow(box: HTMLElement, text: string) {
  box.focus()
  document.execCommand("selectAll", false)
  document.execCommand("delete", false)
  for (const ch of text) {
    document.execCommand("insertText", false, ch)
    await sleep(28)
  }
}

async function fillDraftNow() {
  const items = await getClips()
  const material = pickDraftMaterial(items)
  if (!material) return toast("没有可用素材，请先剪藏")

  if (!location.href.includes("/compose/post")) {
    location.href = "https://x.com/compose/post"
    await sleep(1200)
  }

  let box: HTMLElement | null = null
  for (let i = 0; i < 30; i++) {
    box = getComposerBox()
    if (box) break
    await sleep(250)
  }
  if (!box) return toast("未找到发帖输入框")

  await typeSlow(box, draftTextFromMaterial(material))
  toast("草稿已填充（未自动发布）")
}

async function showClipList() {
  const old = document.getElementById("x-ops-studio-list")
  if (old) old.remove()

  const items = (await getClips()).slice(0, 20)
  const modal = document.createElement("div")
  modal.id = "x-ops-studio-list"
  Object.assign(modal.style, {
    position: "fixed",
    right: "20px",
    bottom: "150px",
    width: "380px",
    maxHeight: "60vh",
    overflow: "auto",
    background: "#0f1419",
    border: "1px solid #2f3336",
    borderRadius: "12px",
    padding: "10px",
    zIndex: "2147483647",
    color: "#e7e9ea",
    fontSize: "12px"
  })

  const head = document.createElement("div")
  head.innerHTML = `<b>素材列表</b>（最近 ${items.length} 条）`
  modal.appendChild(head)

  for (const m of items) {
    const item = document.createElement("div")
    item.style.borderTop = "1px solid #2f3336"
    item.style.padding = "8px 0"

    const top = document.createElement("div")
    top.innerHTML = `@${m.author || "unknown"} · ${m.image_urls?.length || 0}图 · score ${m.score || 0}`

    const txt = document.createElement("div")
    txt.textContent = (m.text || "").slice(0, 80)
    txt.style.opacity = "0.85"

    if (m.image_urls?.[0]) {
      const img = document.createElement("img")
      img.src = m.image_urls[0]
      Object.assign(img.style, {
        width: "100%",
        maxHeight: "120px",
        objectFit: "cover",
        borderRadius: "8px",
        marginTop: "6px"
      })
      item.appendChild(img)
    }

    item.appendChild(top)
    item.appendChild(txt)
    modal.appendChild(item)
  }

  document.body.appendChild(modal)
}

function mountFab() {
  if (document.getElementById("x-ops-studio-fab")) return

  const fab = document.createElement("button")
  fab.id = "x-ops-studio-fab"
  fab.textContent = "⚙️"
  Object.assign(fab.style, {
    position: "fixed",
    right: "20px",
    bottom: "24px",
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    border: "none",
    background: "#1d9bf0",
    color: "#fff",
    fontSize: "24px",
    zIndex: "2147483647",
    cursor: "pointer"
  })

  const panel = document.createElement("div")
  panel.hidden = true
  Object.assign(panel.style, {
    position: "fixed",
    right: "20px",
    bottom: "84px",
    zIndex: "2147483647",
    background: "#0f1419",
    border: "1px solid #2f3336",
    borderRadius: "12px",
    padding: "8px",
    width: "210px"
  })

  const mkBtn = (txt: string, onClick: () => void) => {
    const b = document.createElement("button")
    b.textContent = txt
    Object.assign(b.style, {
      width: "100%",
      marginTop: "6px",
      border: "none",
      borderRadius: "8px",
      padding: "8px 10px",
      background: "#1d9bf0",
      color: "#fff",
      fontSize: "12px",
      cursor: "pointer"
    })
    b.onclick = onClick
    return b
  }

  panel.appendChild(mkBtn("快速剪藏首条", () => void clipTop()))
  panel.appendChild(mkBtn("查看素材列表", () => void showClipList()))
  panel.appendChild(mkBtn("生成发帖草稿", () => void fillDraftNow()))
  panel.appendChild(mkBtn("运营一轮(10条)", () => void runOpsRound()))

  fab.addEventListener("mouseenter", () => (panel.hidden = false))
  panel.addEventListener("mouseenter", () => (panel.hidden = false))
  fab.addEventListener("mouseleave", async () => {
    await sleep(100)
    if (!panel.matches(":hover") && !fab.matches(":hover")) panel.hidden = true
  })
  panel.addEventListener("mouseleave", async () => {
    await sleep(100)
    if (!panel.matches(":hover") && !fab.matches(":hover")) panel.hidden = true
  })

  document.body.appendChild(panel)
  document.body.appendChild(fab)
}

mountFab()

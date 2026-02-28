import type { PlasmoCSConfig } from "plasmo"
import { saveClip, enqueueCommand } from "~lib/api/localReceiver"
import { decideCandidateScore } from "~lib/ops/scoring"

export const config: PlasmoCSConfig = {
  matches: ["https://x.com/*"],
  run_at: "document_idle"
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function extractFromArticle(article: HTMLElement) {
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

  const row = {
    id: crypto.randomUUID(),
    source: "x" as const,
    tweet_url: tweetUrl,
    author,
    text,
    image_urls: [...new Set(imageUrls)],
    tags: ["AI"],
    lang: /[\u4e00-\u9fff]/.test(text) ? "zh" : "en",
    status: "new" as const,
    clipped_at: new Date().toISOString()
  }

  return { ...row, score: decideCandidateScore(row) }
}

function toast(text: string) {
  const el = document.createElement("div")
  el.textContent = text
  Object.assign(el.style, {
    position: "fixed",
    right: "24px",
    bottom: "120px",
    zIndex: "2147483647",
    background: "rgba(0,0,0,0.8)",
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
  await saveClip(row)
  toast(`已剪藏 @${row.author || "unknown"}`)
}

async function runOpsRound() {
  const rs = await enqueueCommand("ops_round", { total: 10 })
  toast(`已下发运营任务 #${rs?.queued?.id || "?"}`)
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
    width: "190px"
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

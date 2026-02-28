import type { MaterialItem } from "~lib/materials/types"

export function decideCandidateScore(row: MaterialItem) {
  const t = `${row.text || ""}`.toLowerCase()
  let score = 0

  if (["ai", "aigc", "llm", "midjourney", "workflow", "prompt", "model"].some((k) => t.includes(k))) score += 4
  if ((row.image_urls || []).length > 0) score += 2
  if ((row.lang || "en") === "en") score += 1
  if (["build", "tool", "demo", "agent", "generate", "image", "video", "automation"].some((k) => t.includes(k))) score += 1

  if (["airdrop", "casino", "bet", "nft mint", "follow me", "giveaway"].some((k) => t.includes(k))) score -= 4
  if ((row.text || "").trim().length < 20) score -= 1

  return score
}

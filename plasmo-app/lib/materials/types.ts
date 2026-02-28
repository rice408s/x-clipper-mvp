export type ClipStatus = "new" | "shortlisted" | "used"

export interface MaterialItem {
  id?: string
  source: "x"
  tweet_url: string
  author?: string
  text?: string
  image_urls?: string[]
  tags?: string[]
  lang?: string
  score?: number
  status?: ClipStatus
  clipped_at?: string
  updated_at?: string
}

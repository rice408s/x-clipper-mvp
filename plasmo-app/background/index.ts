import type { PlasmoBackground } from "plasmo"

const handler: PlasmoBackground = () => {
  // 预留：后续把 command polling / relay 等逻辑迁移到这里
  console.log("[X Ops Studio] background ready")
}

export default handler

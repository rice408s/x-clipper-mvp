import { useEffect, useState } from "react"
import { DEFAULT_OPS_SETTINGS, loadOpsSettings, saveOpsSettings } from "~lib/ops/settings"

function Options() {
  const [roundTotal, setRoundTotal] = useState(DEFAULT_OPS_SETTINGS.roundTotal)
  const [delayMin, setDelayMin] = useState(DEFAULT_OPS_SETTINGS.minDelaySec)
  const [delayMax, setDelayMax] = useState(DEFAULT_OPS_SETTINGS.maxDelaySec)
  const [saved, setSaved] = useState("")

  useEffect(() => {
    loadOpsSettings().then((s) => {
      setRoundTotal(s.roundTotal)
      setDelayMin(s.minDelaySec)
      setDelayMax(s.maxDelaySec)
    })
  }, [])

  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <h2>X Ops Studio Settings</h2>
      <p>每轮互动数</p>
      <input type="number" value={roundTotal} onChange={(e) => setRoundTotal(Number(e.target.value))} />

      <p style={{ marginTop: 12 }}>互动间隔（秒）</p>
      <div style={{ display: "flex", gap: 8 }}>
        <input type="number" value={delayMin} onChange={(e) => setDelayMin(Number(e.target.value))} />
        <input type="number" value={delayMax} onChange={(e) => setDelayMax(Number(e.target.value))} />
      </div>

      <button
        style={{ marginTop: 14, padding: "8px 12px" }}
        onClick={async () => {
          await saveOpsSettings({ roundTotal, minDelaySec: delayMin, maxDelaySec: delayMax })
          setSaved("已保存")
          setTimeout(() => setSaved(""), 1200)
        }}>
        保存设置
      </button>
      <span style={{ marginLeft: 8, fontSize: 12 }}>{saved}</span>
    </div>
  )
}

export default Options

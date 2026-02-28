import { useState } from "react"

function Options() {
  const [delayMin, setDelayMin] = useState(4)
  const [delayMax, setDelayMax] = useState(12)

  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <h2>X Ops Studio Settings</h2>
      <p>运营节奏（秒）</p>
      <div style={{ display: "flex", gap: 8 }}>
        <input type="number" value={delayMin} onChange={(e) => setDelayMin(Number(e.target.value))} />
        <input type="number" value={delayMax} onChange={(e) => setDelayMax(Number(e.target.value))} />
      </div>
      <p style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
        注：该页先做骨架，下一版会接入 storage 持久化。
      </p>
    </div>
  )
}

export default Options

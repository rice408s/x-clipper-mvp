import { useEffect, useState } from "react"
import { healthcheck, enqueueCommand, listResults } from "~lib/api/localReceiver"
import { loadOpsSettings } from "~lib/ops/settings"

function IndexPopup() {
  const [ok, setOk] = useState<boolean | null>(null)
  const [roundTotal, setRoundTotal] = useState(10)
  const [last, setLast] = useState<any>(null)

  const refresh = async () => {
    try {
      await healthcheck()
      setOk(true)
      const s = await loadOpsSettings()
      setRoundTotal(s.roundTotal)
      const rs = await listResults()
      const arr = rs?.results || []
      setLast(arr[arr.length - 1] || null)
    } catch {
      setOk(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  return (
    <div style={{ padding: 12, width: 300, fontFamily: "system-ui" }}>
      <h3 style={{ margin: 0 }}>X Ops Studio</h3>
      <p style={{ margin: "8px 0", fontSize: 12 }}>
        Local receiver: {ok === null ? "checking..." : ok ? "online" : "offline"}
      </p>
      <button
        style={{ width: "100%", padding: 8 }}
        onClick={async () => {
          await enqueueCommand("ops_round", { total: roundTotal })
          alert(`已下发运营任务（${roundTotal}条）`)
          setTimeout(() => void refresh(), 1200)
        }}>
        运行一轮运营({roundTotal}条)
      </button>
      <button style={{ width: "100%", padding: 8, marginTop: 8 }} onClick={() => void refresh()}>
        刷新状态
      </button>

      {last ? (
        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.9 }}>
          <b>最近任务：</b>
          <div>command_id: {last.command_id}</div>
          <div>action: {last?.result?.action || "-"}</div>
          <div>
            completed: {last?.result?.completed ?? "-"}/{last?.result?.total_requested ?? "-"}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default IndexPopup

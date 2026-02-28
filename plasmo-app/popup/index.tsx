import { useEffect, useState } from "react"
import { healthcheck, enqueueCommand } from "~lib/api/localReceiver"

function IndexPopup() {
  const [ok, setOk] = useState<boolean | null>(null)

  useEffect(() => {
    healthcheck()
      .then(() => setOk(true))
      .catch(() => setOk(false))
  }, [])

  return (
    <div style={{ padding: 12, width: 280, fontFamily: "system-ui" }}>
      <h3 style={{ margin: 0 }}>X Ops Studio</h3>
      <p style={{ margin: "8px 0", fontSize: 12 }}>
        Local receiver: {ok === null ? "checking..." : ok ? "online" : "offline"}
      </p>
      <button
        style={{ width: "100%", padding: 8 }}
        onClick={async () => {
          await enqueueCommand("ops_round", { total: 10 })
          alert("已下发运营任务（10条）")
        }}>
        运行一轮运营(10条)
      </button>
    </div>
  )
}

export default IndexPopup

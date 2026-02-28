export interface OpsSettings {
  roundTotal: number
  minDelaySec: number
  maxDelaySec: number
}

export const DEFAULT_OPS_SETTINGS: OpsSettings = {
  roundTotal: 10,
  minDelaySec: 4,
  maxDelaySec: 12
}

const KEY = "x_ops_settings"

export async function loadOpsSettings(): Promise<OpsSettings> {
  const data = await chrome.storage.sync.get([KEY])
  return {
    ...DEFAULT_OPS_SETTINGS,
    ...(data?.[KEY] || {})
  }
}

export async function saveOpsSettings(settings: OpsSettings) {
  await chrome.storage.sync.set({ [KEY]: settings })
}

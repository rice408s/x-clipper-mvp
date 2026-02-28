chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  await chrome.tabs.sendMessage(tab.id, { type: 'CLIP_ACTIVE_TWEET' });
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === 'SAVE_CLIP_LOCAL') {
    fetch('http://127.0.0.1:8765/clip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg.record || {})
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        sendResponse({ ok: r.ok, data });
      })
      .catch((err) => {
        sendResponse({ ok: false, error: String(err) });
      });
    return true;
  }

  if (msg?.type === 'EXPORT_JSONL') {
    // optional fallback export
    const dataUrl = `data:application/jsonl;charset=utf-8,${encodeURIComponent(msg.payload || '')}`;
    chrome.downloads.download({
      url: dataUrl,
      filename: msg.filename || 'x-materials-latest.jsonl',
      saveAs: !!msg.saveAs,
      conflictAction: 'overwrite'
    }, () => {
      sendResponse({ ok: true });
    });
    return true;
  }
});

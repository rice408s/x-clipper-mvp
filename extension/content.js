function pickActiveArticle() {
  return document.querySelector('article') || null;
}

function allArticles() {
  return [...document.querySelectorAll('article')];
}

function extractFromArticle(article) {
  const textNode = article.querySelector('[data-testid="tweetText"]');
  const text = textNode ? textNode.innerText.trim() : '';

  const authorLink = article.querySelector('a[href^="/"][role="link"]');
  const author = authorLink ? authorLink.getAttribute('href')?.split('/')[1] : '';

  const tweetLinkEl = [...article.querySelectorAll('a[href*="/status/"]')]
    .find((a) => {
      const h = a.getAttribute('href') || '';
      return h.includes('/status/') && !h.includes('/analytics') && !h.includes('/photo/');
    });
  const tweetUrl = tweetLinkEl ? `https://x.com${tweetLinkEl.getAttribute('href')}` : location.href;

  const imageUrls = [...article.querySelectorAll('img[src*="pbs.twimg.com/media"]')]
    .map((img) => img.src.replace(/&name=\w+/, '&name=orig'))
    .filter(Boolean);

  return {
    id: crypto.randomUUID(),
    source: 'x',
    tweet_url: tweetUrl,
    author,
    text,
    image_urls: [...new Set(imageUrls)],
    tags: ['AIGC'],
    clipped_at: new Date().toISOString()
  };
}

async function saveClip(record) {
  const key = 'x_clips';
  const stored = await chrome.storage.local.get([key]);
  const arr = stored[key] || [];
  arr.push(record);
  await chrome.storage.local.set({ [key]: arr });

  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'SAVE_CLIP_LOCAL', record }, (resp) => {
      if (resp?.ok && resp?.data?.saved) {
        toast(`已剪藏并落库：${record.author || 'unknown'} / 图片 ${record.image_urls.length} 张`);
      } else if (resp?.ok && resp?.data?.reason === 'duplicate') {
        toast('已存在，跳过重复素材');
      } else {
        toast('本地落库失败，已仅保存到插件本地存储');
      }
      resolve(resp || { ok: false });
    });
  });
}

function toast(text) {
  const el = document.createElement('div');
  el.textContent = text;
  Object.assign(el.style, {
    position: 'fixed', right: '24px', bottom: '120px', zIndex: '2147483647',
    background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '8px 12px',
    borderRadius: '10px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}

async function showClipList() {
  const key = 'x_clips';
  const stored = await chrome.storage.local.get([key]);
  const arr = (stored[key] || []).slice().reverse();

  const old = document.getElementById('x-clipper-list-modal');
  if (old) old.remove();

  const modal = document.createElement('div');
  modal.id = 'x-clipper-list-modal';
  Object.assign(modal.style, {
    position: 'fixed',
    right: '20px',
    bottom: '150px',
    width: '360px',
    maxHeight: '55vh',
    overflow: 'auto',
    background: '#0f1419',
    border: '1px solid #2f3336',
    borderRadius: '12px',
    padding: '10px',
    zIndex: '2147483647',
    boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
    color: '#e7e9ea',
    fontSize: '12px'
  });

  const head = document.createElement('div');
  head.innerHTML = `<b>剪藏列表</b>（最近 ${Math.min(arr.length, 20)} 条）`;
  head.style.marginBottom = '8px';

  const close = document.createElement('button');
  close.textContent = '关闭';
  Object.assign(close.style, {
    float: 'right', border: 'none', borderRadius: '6px', padding: '4px 8px',
    background: '#1d9bf0', color: '#fff', cursor: 'pointer', fontSize: '11px'
  });
  close.onclick = () => modal.remove();
  head.appendChild(close);
  modal.appendChild(head);

  if (arr.length === 0) {
    const empty = document.createElement('div');
    empty.textContent = '暂无剪藏内容';
    empty.style.opacity = '0.8';
    modal.appendChild(empty);
  } else {
    arr.slice(0, 20).forEach((r, i) => {
      const item = document.createElement('div');
      item.style.borderTop = i === 0 ? 'none' : '1px solid #2f3336';
      item.style.padding = '8px 0';

      const link = document.createElement('a');
      link.href = r.tweet_url || '#';
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = `${r.author || 'unknown'} · ${r.image_urls?.length || 0}图`;
      link.style.color = '#8ecdf8';
      link.style.textDecoration = 'none';

      const txt = document.createElement('div');
      txt.textContent = (r.text || '').slice(0, 80) || '(无文本)';
      txt.style.opacity = '0.9';
      txt.style.marginTop = '4px';

      item.appendChild(link);
      item.appendChild(txt);
      modal.appendChild(item);
    });
  }

  document.body.appendChild(modal);
}

let pickMode = false;
let hoverArticle = null;

function clearHover() {
  if (hoverArticle) hoverArticle.style.outline = '';
  hoverArticle = null;
}

function startPickMode() {
  if (pickMode) return;
  pickMode = true;
  toast('选择模式：鼠标点要剪藏的帖子（ESC 取消）');

  const onMove = (e) => {
    const a = e.target.closest('article');
    if (a === hoverArticle) return;
    clearHover();
    if (a) {
      hoverArticle = a;
      hoverArticle.style.outline = '2px solid #1d9bf0';
      hoverArticle.style.outlineOffset = '2px';
    }
  };

  const stop = () => {
    pickMode = false;
    clearHover();
    window.removeEventListener('mousemove', onMove, true);
    window.removeEventListener('click', onClick, true);
    window.removeEventListener('keydown', onKey, true);
  };

  const onClick = async (e) => {
    const a = e.target.closest('article');
    if (!a) return;
    e.preventDefault();
    e.stopPropagation();
    stop();
    const record = extractFromArticle(a);
    await saveClip(record);
  };

  const onKey = (e) => {
    if (e.key === 'Escape') {
      stop();
      toast('已取消选择模式');
    }
  };

  window.addEventListener('mousemove', onMove, true);
  window.addEventListener('click', onClick, true);
  window.addEventListener('keydown', onKey, true);
}

async function collectOnce({ keywords = ['ai'], maxSave = 3, needImage = true } = {}) {
  const arts = allArticles();
  let scanned = 0;
  let saved = 0;
  const savedUrls = [];

  for (const a of arts) {
    if (saved >= maxSave) break;
    const row = extractFromArticle(a);
    scanned += 1;
    if (!row.tweet_url || !row.text) continue;
    if (needImage && (!row.image_urls || row.image_urls.length === 0)) continue;

    const text = `${row.text} ${(row.tags || []).join(' ')}`.toLowerCase();
    const hit = keywords.length === 0 || keywords.some((k) => text.includes(String(k).toLowerCase()));
    if (!hit) continue;

    const resp = await saveClip(row);
    if (resp?.ok && resp?.data?.saved) {
      saved += 1;
      savedUrls.push(row.tweet_url);
    }
  }

  return { scanned, saved, saved_urls: savedUrls };
}

function findArticleByTweetUrl(url) {
  const idMatch = String(url || '').match(/\/status\/(\d+)/);
  if (!idMatch) return null;
  const id = idMatch[1];
  return allArticles().find((a) => {
    const link = a.querySelector(`a[href*="/status/${id}"]`);
    return !!link;
  }) || null;
}

async function executeCommand(cmd) {
  const action = cmd?.action;
  const payload = cmd?.payload || {};

  if (action === 'pick_mode') {
    startPickMode();
    return { ok: true, action };
  }

  if (action === 'clip_by_url') {
    const a = findArticleByTweetUrl(payload.tweet_url);
    if (!a) return { ok: false, action, error: 'tweet_not_found_in_viewport' };
    const row = extractFromArticle(a);
    const resp = await saveClip(row);
    return { ok: !!resp?.ok, action, tweet_url: row.tweet_url, saved: !!resp?.data?.saved };
  }

  if (action === 'collect_once') {
    const stats = await collectOnce(payload);
    return { ok: true, action, ...stats };
  }

  return { ok: false, action, error: 'unknown_action' };
}

async function pollCommandsLoop() {
  try {
    const r = await fetch('http://127.0.0.1:8765/command/next');
    const data = await r.json();
    const cmd = data?.command;
    if (cmd) {
      const result = await executeCommand(cmd);
      await fetch('http://127.0.0.1:8765/command/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command_id: cmd.id, result, at: new Date().toISOString() })
      });
    }
  } catch (_e) {
    // local receiver offline: ignore silently
  }
  setTimeout(pollCommandsLoop, 2500);
}

function createFloatingUI() {
  if (document.getElementById('x-clipper-fab')) return;

  const fab = document.createElement('button');
  fab.id = 'x-clipper-fab';
  fab.title = 'X Clipper';
  fab.textContent = '✂️';
  Object.assign(fab.style, {
    position: 'fixed', right: '20px', bottom: '24px', width: '52px', height: '52px',
    borderRadius: '50%', border: 'none', background: '#1d9bf0', color: '#fff',
    fontSize: '24px', cursor: 'pointer', zIndex: '2147483647',
    boxShadow: '0 8px 24px rgba(29,155,240,0.45)'
  });

  const panel = document.createElement('div');
  panel.id = 'x-clipper-panel';
  panel.hidden = true;
  Object.assign(panel.style, {
    position: 'fixed', right: '20px', bottom: '84px', zIndex: '2147483647',
    background: '#0f1419', border: '1px solid #2f3336', borderRadius: '12px',
    padding: '8px', width: '180px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
  });

  const title = document.createElement('div');
  title.textContent = 'X Clipper';
  Object.assign(title.style, { color: '#e7e9ea', fontSize: '12px', marginBottom: '6px', fontWeight: '600' });

  const btnClip = document.createElement('button');
  btnClip.textContent = '选择帖子并剪藏';
  const btnQuick = document.createElement('button');
  btnQuick.textContent = '快速剪藏首条';
  const btnList = document.createElement('button');
  btnList.textContent = '查看剪藏列表';
  for (const b of [btnClip, btnQuick, btnList]) {
    Object.assign(b.style, {
      width: '100%', marginTop: '6px', border: 'none', borderRadius: '8px',
      padding: '8px 10px', background: '#1d9bf0', color: '#fff', fontSize: '12px', cursor: 'pointer'
    });
  }

  btnClip.onclick = async () => startPickMode();
  btnQuick.onclick = async () => {
    const article = pickActiveArticle();
    if (!article) return toast('没找到帖子');
    const record = extractFromArticle(article);
    await saveClip(record);
  };
  btnList.onclick = async () => showClipList();

  const showPanel = () => { panel.hidden = false; };
  const hidePanel = () => { panel.hidden = true; };
  fab.addEventListener('mouseenter', showPanel);
  panel.addEventListener('mouseenter', showPanel);
  fab.addEventListener('mouseleave', () => setTimeout(() => {
    if (!panel.matches(':hover') && !fab.matches(':hover')) hidePanel();
  }, 120));
  panel.addEventListener('mouseleave', () => setTimeout(() => {
    if (!panel.matches(':hover') && !fab.matches(':hover')) hidePanel();
  }, 120));

  panel.appendChild(title);
  panel.appendChild(btnClip);
  panel.appendChild(btnQuick);
  panel.appendChild(btnList);
  document.body.appendChild(panel);
  document.body.appendChild(fab);
}

chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg?.type === 'CLIP_ACTIVE_TWEET') startPickMode();
});

window.addEventListener('keydown', async (e) => {
  if (e.altKey && e.key.toLowerCase() === 'x') startPickMode();
});

createFloatingUI();
pollCommandsLoop();

function pickActiveArticle() {
  return document.querySelector('article') || null;
}

function allArticles() {
  return [...document.querySelectorAll('article')];
}

function detectLang(text = '') {
  const zh = /[\u4e00-\u9fff]/.test(text);
  return zh ? 'zh' : 'en';
}

function scoreRecord(row) {
  const text = (row.text || '').toLowerCase();
  let s = 0;
  if (row.image_urls?.length) s += 3;
  if (text.includes('ai') || text.includes('aigc') || text.includes('midjourney') || text.includes('prompt')) s += 2;
  if ((row.text || '').length > 40) s += 1;
  if (row.author) s += 1;
  return s;
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

  const row = {
    id: crypto.randomUUID(),
    source: 'x',
    tweet_url: tweetUrl,
    author,
    text,
    image_urls: [...new Set(imageUrls)],
    tags: ['AI'],
    lang: detectLang(text),
    status: 'new', // new | shortlisted | used
    clipped_at: new Date().toISOString()
  };
  row.score = scoreRecord(row);
  return row;
}

async function getClips() {
  const key = 'x_clips';
  const stored = await chrome.storage.local.get([key]);
  return stored[key] || [];
}

async function setClips(arr) {
  await chrome.storage.local.set({ x_clips: arr });
}

async function updateClipById(id, patch) {
  const arr = await getClips();
  const idx = arr.findIndex((x) => x.id === id);
  if (idx < 0) return false;
  arr[idx] = { ...arr[idx], ...patch, updated_at: new Date().toISOString() };
  await setClips(arr);
  return true;
}

async function saveClip(record) {
  const arr = await getClips();
  arr.push(record);
  await setClips(arr);

  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'SAVE_CLIP_LOCAL', record }, (resp) => {
      if (resp?.ok && resp?.data?.saved) {
        toast(`已剪藏并落库：${record.author || 'unknown'} / score ${record.score}`);
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
    const row = extractFromArticle(a);
    await saveClip(row);
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

async function collectOnce({ keywords = ['ai'], maxSave = 3, needImage = true, minScore = 5 } = {}) {
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
    if ((row.score || 0) < minScore) continue;

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
  return allArticles().find((a) => a.querySelector(`a[href*="/status/${id}"]`)) || null;
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
  } catch (_e) {}
  setTimeout(pollCommandsLoop, 2500);
}

async function copyForPost(row) {
  const text = `素材参考\n作者: @${row.author || 'unknown'}\n链接: ${row.tweet_url}\n要点: ${(row.text || '').slice(0, 140)}`;
  try {
    await navigator.clipboard.writeText(text);
    toast('已复制“用于发帖”素材到剪贴板');
  } catch {
    toast('复制失败，请手动复制');
  }
}

async function showClipList() {
  const all = (await getClips()).slice().sort((a, b) => (b.clipped_at || '').localeCompare(a.clipped_at || ''));

  const old = document.getElementById('x-clipper-list-modal');
  if (old) old.remove();

  const modal = document.createElement('div');
  modal.id = 'x-clipper-list-modal';
  Object.assign(modal.style, {
    position: 'fixed', right: '20px', bottom: '150px', width: '390px', maxHeight: '62vh', overflow: 'auto',
    background: '#0f1419', border: '1px solid #2f3336', borderRadius: '12px', padding: '10px',
    zIndex: '2147483647', boxShadow: '0 10px 30px rgba(0,0,0,0.45)', color: '#e7e9ea', fontSize: '12px'
  });

  const head = document.createElement('div');
  head.style.marginBottom = '8px';

  const close = document.createElement('button');
  close.textContent = '关闭';
  Object.assign(close.style, {
    float: 'right', border: 'none', borderRadius: '6px', padding: '4px 8px',
    background: '#1d9bf0', color: '#fff', cursor: 'pointer', fontSize: '11px'
  });
  close.onclick = () => modal.remove();

  const stats = {
    total: all.length,
    new: all.filter(x => (x.status || 'new') === 'new').length,
    shortlisted: all.filter(x => x.status === 'shortlisted').length,
    used: all.filter(x => x.status === 'used').length,
  };

  const title = document.createElement('div');
  title.innerHTML = `<b>剪藏列表</b> · 总${stats.total} / new ${stats.new} / short ${stats.shortlisted} / used ${stats.used}`;

  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.gap = '6px';
  controls.style.marginTop = '8px';

  const statusSel = document.createElement('select');
  statusSel.innerHTML = `<option value="all">全部</option><option value="new">new</option><option value="shortlisted">shortlisted</option><option value="used">used</option>`;
  const qInput = document.createElement('input');
  qInput.placeholder = '搜索 author/text';
  Object.assign(qInput.style, { flex: '1', borderRadius: '6px', border: '1px solid #2f3336', background: '#15202b', color: '#fff', padding: '4px 6px' });

  controls.appendChild(statusSel);
  controls.appendChild(qInput);

  head.appendChild(close);
  head.appendChild(title);
  head.appendChild(controls);
  modal.appendChild(head);

  const listRoot = document.createElement('div');
  modal.appendChild(listRoot);

  const render = () => {
    const q = (qInput.value || '').toLowerCase().trim();
    const status = statusSel.value;
    const rows = all.filter((r) => {
      const okStatus = status === 'all' ? true : (r.status || 'new') === status;
      const hay = `${r.author || ''} ${(r.text || '').slice(0, 180)}`.toLowerCase();
      const okQ = !q || hay.includes(q);
      return okStatus && okQ;
    }).slice(0, 30);

    listRoot.innerHTML = '';
    if (rows.length === 0) {
      const empty = document.createElement('div');
      empty.textContent = '当前筛选下暂无内容';
      empty.style.opacity = '0.8';
      listRoot.appendChild(empty);
      return;
    }

    for (const r of rows) {
      const item = document.createElement('div');
      item.style.borderTop = '1px solid #2f3336';
      item.style.padding = '8px 0';

      const top = document.createElement('div');
      top.innerHTML = `<b>@${r.author || 'unknown'}</b> · ${r.image_urls?.length || 0}图 · score ${r.score || 0} · <span style="opacity:.8">${r.status || 'new'}</span>`;

      const link = document.createElement('a');
      link.href = r.tweet_url || '#';
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = r.tweet_url || '(no url)';
      link.style.color = '#8ecdf8';
      link.style.textDecoration = 'none';
      link.style.display = 'block';
      link.style.marginTop = '4px';

      const txt = document.createElement('div');
      txt.textContent = (r.text || '').slice(0, 100) || '(无文本)';
      txt.style.opacity = '0.9';
      txt.style.marginTop = '4px';

      const actions = document.createElement('div');
      actions.style.marginTop = '6px';
      actions.style.display = 'flex';
      actions.style.gap = '6px';

      const mkShort = document.createElement('button');
      mkShort.textContent = 'shortlist';
      const mkUsed = document.createElement('button');
      mkUsed.textContent = 'used';
      const forPost = document.createElement('button');
      forPost.textContent = '用于发帖';

      for (const b of [mkShort, mkUsed, forPost]) {
        Object.assign(b.style, {
          border: 'none', borderRadius: '6px', padding: '4px 8px', background: '#1d9bf0',
          color: '#fff', cursor: 'pointer', fontSize: '11px'
        });
      }

      mkShort.onclick = async () => { await updateClipById(r.id, { status: 'shortlisted' }); toast('已标记 shortlisted'); };
      mkUsed.onclick = async () => { await updateClipById(r.id, { status: 'used' }); toast('已标记 used'); };
      forPost.onclick = async () => { await updateClipById(r.id, { status: 'shortlisted' }); await copyForPost(r); };

      actions.appendChild(mkShort);
      actions.appendChild(mkUsed);
      actions.appendChild(forPost);

      item.appendChild(top);
      item.appendChild(link);
      item.appendChild(txt);
      item.appendChild(actions);
      listRoot.appendChild(item);
    }
  };

  statusSel.onchange = render;
  qInput.oninput = render;
  render();
  document.body.appendChild(modal);
}

function createFloatingUI() {
  if (document.getElementById('x-clipper-fab')) return;

  const fab = document.createElement('button');
  fab.id = 'x-clipper-fab';
  fab.title = 'X Clipper';
  fab.textContent = '✂️';
  const posRaw = localStorage.getItem('x_clipper_fab_pos');
  const pos = posRaw ? JSON.parse(posRaw) : { right: 20, bottom: 24 };
  Object.assign(fab.style, {
    position: 'fixed', right: `${pos.right}px`, bottom: `${pos.bottom}px`, width: '52px', height: '52px',
    borderRadius: '50%', border: 'none', background: '#1d9bf0', color: '#fff',
    fontSize: '24px', cursor: 'pointer', zIndex: '2147483647', boxShadow: '0 8px 24px rgba(29,155,240,0.45)'
  });

  const panel = document.createElement('div');
  panel.id = 'x-clipper-panel';
  panel.hidden = true;
  Object.assign(panel.style, {
    position: 'fixed', right: `${pos.right}px`, bottom: `${pos.bottom + 60}px`, zIndex: '2147483647',
    background: '#0f1419', border: '1px solid #2f3336', borderRadius: '12px',
    padding: '8px', width: '190px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
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
    const row = extractFromArticle(article);
    await saveClip(row);
  };
  btnList.onclick = async () => showClipList();

  // 拖拽悬浮球并记忆位置
  let dragging = false;
  let sx = 0, sy = 0, sr = 0, sb = 0;
  fab.addEventListener('mousedown', (e) => {
    dragging = true;
    sx = e.clientX; sy = e.clientY;
    sr = parseInt(fab.style.right, 10) || 20;
    sb = parseInt(fab.style.bottom, 10) || 24;
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    const nr = Math.max(8, sr - dx);
    const nb = Math.max(8, sb - dy);
    fab.style.right = `${nr}px`;
    fab.style.bottom = `${nb}px`;
    panel.style.right = `${nr}px`;
    panel.style.bottom = `${nb + 60}px`;
  });
  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    localStorage.setItem('x_clipper_fab_pos', JSON.stringify({
      right: parseInt(fab.style.right, 10) || 20,
      bottom: parseInt(fab.style.bottom, 10) || 24,
    }));
  });

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

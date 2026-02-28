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

async function bulkShortlistTopN(n = 5) {
  const arr = await getClips();
  const ranked = arr
    .map((x, i) => ({ i, x }))
    .filter(({ x }) => (x.status || 'new') !== 'used')
    .sort((a, b) => (b.x.score || 0) - (a.x.score || 0));

  const pick = ranked.slice(0, n);
  const now = new Date().toISOString();
  for (const { i } of pick) {
    arr[i] = { ...arr[i], status: 'shortlisted', updated_at: now };
  }
  await setClips(arr);
  return pick.length;
}

async function clearUsedItems() {
  const arr = await getClips();
  const next = arr.filter((x) => (x.status || 'new') !== 'used');
  await setClips(next);
  return arr.length - next.length;
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

function decideCandidateScore(row) {
  const t = `${row.text || ''}`.toLowerCase();
  let score = 0;

  // 强信号
  if (['ai', 'aigc', 'llm', 'midjourney', 'stable diffusion', 'workflow', 'prompt', 'model'].some(k => t.includes(k))) score += 4;
  if ((row.image_urls || []).length > 0) score += 2;
  if ((row.lang || 'en') === 'en') score += 1;

  // 中信号（创作/技术语境）
  if (['build', 'tool', 'demo', 'agent', 'generate', 'image', 'video', 'automation', 'ship'].some(k => t.includes(k))) score += 1;

  // 降权（低质量/噪音）
  if (['airdrop', 'casino', 'bet', 'nft mint', 'follow me', 'giveaway'].some(k => t.includes(k))) score -= 4;
  if ((row.text || '').trim().length < 20) score -= 1;

  return score;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function findBtn(article, keys = []) {
  return [...article.querySelectorAll('button')].find((b) => {
    const a = (b.getAttribute('aria-label') || '').toLowerCase();
    return keys.some((k) => a.includes(k));
  }) || null;
}

async function doLike(article) {
  const btn = findBtn(article, ['like']);
  if (!btn) return { ok: false, reason: 'no_like_btn' };
  const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
  if (aria.includes('liked')) return { ok: false, reason: 'already_liked' };
  btn.click();
  await sleep(220);
  return { ok: true };
}

async function doRepost(article) {
  const btn = findBtn(article, ['repost']);
  if (!btn) return { ok: false, reason: 'no_repost_btn' };
  const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
  if (aria.includes('reposted')) return { ok: false, reason: 'already_reposted' };
  btn.click();
  await sleep(250);
  const menuRepost = [...document.querySelectorAll('[role="menuitem"]')].find((x) => /repost/i.test((x.innerText || '').trim()));
  if (!menuRepost) return { ok: false, reason: 'repost_menu_missing' };
  menuRepost.click();
  await sleep(220);
  return { ok: true };
}

async function doComment(article, text) {
  const btn = findBtn(article, ['reply']);
  if (!btn) return { ok: false, reason: 'no_reply_btn' };
  btn.click();
  await sleep(280);

  const box = document.querySelector('div[role="dialog"] [data-testid="tweetTextarea_0"]')
    || document.querySelector('div[role="dialog"] div[contenteditable="true"]');
  if (!box) return { ok: false, reason: 'reply_box_missing' };

  box.focus();
  document.execCommand('selectAll', false);
  document.execCommand('insertText', false, text);
  await sleep(120);

  const sendBtn = document.querySelector('div[role="dialog"] [data-testid="tweetButton"]')
    || [...document.querySelectorAll('div[role="dialog"] button')].find((b) => /reply/i.test((b.innerText || '').trim()));
  if (!sendBtn) return { ok: false, reason: 'reply_send_missing' };
  sendBtn.click();
  await sleep(220);
  return { ok: true };
}

async function runOpsRound({ total = 10 } = {}) {
  const needed = ['like', 'like', 'like', 'like', 'repost', 'repost', 'repost', 'comment', 'comment', 'comment'].slice(0, total);
  const comments = [
    'Useful breakdown. The workflow clarity here is what makes AI output reproducible, not just flashy.',
    'Great post — this is the kind of practical AI content that helps builders ship faster.',
    'Love the concrete examples. More people should share setup + constraints + result, not just output.'
  ];

  const done = [];
  const usedUrls = new Set();
  let commentIdx = 0;

  const collectCandidates = () => {
    const arts = allArticles();
    return arts.map((a) => {
      const row = extractFromArticle(a);
      return { a, row, s: decideCandidateScore(row) };
    }).filter(({ row, s }) => {
      if (!row.tweet_url || usedUrls.has(row.tweet_url)) return false;
      if ((row.author || '').toLowerCase() === 'arlooooooo') return false;
      return s >= 2;
    }).sort((x, y) => y.s - x.s);
  };

  for (const action of needed) {
    let acted = false;

    // 自动滚动扩展候选池（最多 5 屏）
    for (let pass = 0; pass < 6 && !acted; pass++) {
      const candidates = collectCandidates();

      for (const { a, row, s } of candidates) {
        let r = { ok: false, reason: 'skip' };
        if (action === 'like') r = await doLike(a);
        if (action === 'repost') r = await doRepost(a);
        if (action === 'comment') r = await doComment(a, comments[commentIdx++ % comments.length]);

        if (r.ok) {
          usedUrls.add(row.tweet_url);
          done.push({ action, tweet_url: row.tweet_url, author: row.author, score: s, pass });
          acted = true;
          break;
        }
      }

      if (!acted) {
        window.scrollBy(0, Math.floor(window.innerHeight * 0.9));
        await sleep(420);
      }
    }

    if (!acted) done.push({ action, skipped: true });
    await sleep(180);
  }

  return { ok: true, total_requested: total, completed: done.filter(x => !x.skipped).length, details: done };
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

  if (action === 'ops_round') {
    const rs = await runOpsRound({ total: Number(payload.total || 10) });
    return { action, ...rs };
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

  const tools = document.createElement('div');
  tools.style.display = 'flex';
  tools.style.gap = '6px';
  tools.style.marginTop = '6px';

  const btnTop5 = document.createElement('button');
  btnTop5.textContent = 'Top5 shortlists';
  const btnClearUsed = document.createElement('button');
  btnClearUsed.textContent = '清理 used';
  for (const b of [btnTop5, btnClearUsed]) {
    Object.assign(b.style, {
      border: 'none', borderRadius: '6px', padding: '4px 8px', background: '#1d9bf0',
      color: '#fff', cursor: 'pointer', fontSize: '11px'
    });
  }

  controls.appendChild(statusSel);
  controls.appendChild(qInput);
  tools.appendChild(btnTop5);
  tools.appendChild(btnClearUsed);

  head.appendChild(close);
  head.appendChild(title);
  head.appendChild(controls);
  head.appendChild(tools);
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

      // 缩略图预览（首图）
      let thumbWrap = null;
      if (r.image_urls && r.image_urls.length > 0) {
        thumbWrap = document.createElement('div');
        thumbWrap.style.marginTop = '6px';

        const img = document.createElement('img');
        img.src = r.image_urls[0];
        img.alt = 'thumb';
        img.loading = 'lazy';
        Object.assign(img.style, {
          width: '100%',
          maxHeight: '140px',
          objectFit: 'cover',
          borderRadius: '8px',
          border: '1px solid #2f3336',
          cursor: 'pointer'
        });
        img.onclick = () => window.open(r.image_urls[0], '_blank', 'noopener,noreferrer');
        thumbWrap.appendChild(img);
      }

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
      if (thumbWrap) item.appendChild(thumbWrap);
      item.appendChild(actions);
      listRoot.appendChild(item);
    }
  };

  btnTop5.onclick = async () => {
    const c = await bulkShortlistTopN(5);
    toast(`已批量 shortlist ${c} 条`);
    await showClipList();
  };
  btnClearUsed.onclick = async () => {
    const c = await clearUsedItems();
    toast(`已清理 used ${c} 条`);
    await showClipList();
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
  const btnOps = document.createElement('button');
  btnOps.textContent = '运营一轮(10条)';

  for (const b of [btnClip, btnQuick, btnList, btnOps]) {
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
  btnOps.onclick = async () => {
    toast('开始执行运营一轮（10条）...');
    const rs = await runOpsRound({ total: 10 });
    toast(`运营完成：${rs.completed}/${rs.total_requested}`);
    console.log('[x-clipper ops]', rs);
  };

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
  panel.appendChild(btnOps);
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

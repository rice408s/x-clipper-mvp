(function(define){var __define; typeof define === "function" && (__define=define,define=null);
// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"eyk1u":[function(require,module,exports) {
var d = globalThis.process?.argv || [];
var y = ()=>globalThis.process?.env || {};
var H = new Set(d), _ = (e)=>H.has(e), G = d.filter((e)=>e.startsWith("--") && e.includes("=")).map((e)=>e.split("=")).reduce((e, [t, o])=>(e[t] = o, e), {});
var Z = _("--dry-run"), p = ()=>_("--verbose") || y().VERBOSE === "true", q = p();
var u = (e = "", ...t)=>console.log(e.padEnd(9), "|", ...t);
var x = (...e)=>console.error("\uD83D\uDD34 ERROR".padEnd(9), "|", ...e), v = (...e)=>u("\uD83D\uDD35 INFO", ...e), m = (...e)=>u("\uD83D\uDFE0 WARN", ...e), S = 0, c = (...e)=>p() && u(`\u{1F7E1} ${S++}`, ...e);
var n = {
    "isContentScript": true,
    "isBackground": false,
    "isReact": false,
    "runtimes": [
        "script-runtime"
    ],
    "host": "localhost",
    "port": 1815,
    "entryFilePath": "/Users/arlo/.openclaw/workspace/x-clipper-mvp/plasmo-app/contents/x.ts",
    "bundleId": "c8ba268027a6d6a6",
    "envHash": "e792fbbdaa78ee84",
    "verbose": "false",
    "secure": false,
    "serverPort": 51086
};
module.bundle.HMR_BUNDLE_ID = n.bundleId;
globalThis.process = {
    argv: [],
    env: {
        VERBOSE: n.verbose
    }
};
var D = module.bundle.Module;
function I(e) {
    D.call(this, e), this.hot = {
        data: module.bundle.hotData[e],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(t) {
            this._acceptCallbacks.push(t || function() {});
        },
        dispose: function(t) {
            this._disposeCallbacks.push(t);
        }
    }, module.bundle.hotData[e] = void 0;
}
module.bundle.Module = I;
module.bundle.hotData = {};
var l = globalThis.browser || globalThis.chrome || null;
function b() {
    return !n.host || n.host === "0.0.0.0" ? "localhost" : n.host;
}
function C() {
    return n.port || location.port;
}
var E = "__plasmo_runtime_script_";
function L(e, t) {
    let { modules: o } = e;
    return o ? !!o[t] : !1;
}
function O(e = C()) {
    let t = b();
    return `${n.secure || location.protocol === "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(t) ? "wss" : "ws"}://${t}:${e}/`;
}
function B(e) {
    typeof e.message == "string" && x("[plasmo/parcel-runtime]: " + e.message);
}
function P(e) {
    if (typeof globalThis.WebSocket > "u") return;
    let t = new WebSocket(O());
    return t.addEventListener("message", async function(o) {
        let r = JSON.parse(o.data);
        if (r.type === "update" && await e(r.assets), r.type === "error") for (let a of r.diagnostics.ansi){
            let w = a.codeframe || a.stack;
            m("[plasmo/parcel-runtime]: " + a.message + `
` + w + `

` + a.hints.join(`
`));
        }
    }), t.addEventListener("error", B), t.addEventListener("open", ()=>{
        v(`[plasmo/parcel-runtime]: Connected to HMR server for ${n.entryFilePath}`);
    }), t.addEventListener("close", ()=>{
        m(`[plasmo/parcel-runtime]: Connection to the HMR server is closed for ${n.entryFilePath}`);
    }), t;
}
var s = "__plasmo-loading__";
function $() {
    let e = globalThis.window?.trustedTypes;
    if (typeof e > "u") return;
    let t = document.querySelector('meta[name="trusted-types"]')?.content?.split(" "), o = t ? t[t?.length - 1].replace(/;/g, "") : void 0;
    return typeof e < "u" ? e.createPolicy(o || `trusted-html-${s}`, {
        createHTML: (a)=>a
    }) : void 0;
}
var T = $();
function g() {
    return document.getElementById(s);
}
function f() {
    return !g();
}
function F() {
    let e = document.createElement("div");
    e.id = s;
    let t = `
  <style>
    #${s} {
      background: #f3f3f3;
      color: #333;
      border: 1px solid #333;
      box-shadow: #333 4.7px 4.7px;
    }

    #${s}:hover {
      background: #e3e3e3;
      color: #444;
    }

    @keyframes plasmo-loading-animate-svg-fill {
      0% {
        fill: transparent;
      }
    
      100% {
        fill: #333;
      }
    }

    #${s} .svg-elem-1 {
      animation: plasmo-loading-animate-svg-fill 1.47s cubic-bezier(0.47, 0, 0.745, 0.715) 0.8s both infinite;
    }

    #${s} .svg-elem-2 {
      animation: plasmo-loading-animate-svg-fill 1.47s cubic-bezier(0.47, 0, 0.745, 0.715) 0.9s both infinite;
    }
    
    #${s} .svg-elem-3 {
      animation: plasmo-loading-animate-svg-fill 1.47s cubic-bezier(0.47, 0, 0.745, 0.715) 1s both infinite;
    }

    #${s} .hidden {
      display: none;
    }

  </style>
  
  <svg height="32" width="32" viewBox="0 0 264 354" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M139.221 282.243C154.252 282.243 166.903 294.849 161.338 308.812C159.489 313.454 157.15 317.913 154.347 322.109C146.464 333.909 135.26 343.107 122.151 348.538C109.043 353.969 94.6182 355.39 80.7022 352.621C66.7861 349.852 54.0034 343.018 43.9705 332.983C33.9375 322.947 27.105 310.162 24.3369 296.242C21.5689 282.323 22.9895 267.895 28.4193 254.783C33.8491 241.671 43.0441 230.464 54.8416 222.579C59.0353 219.777 63.4908 217.438 68.1295 215.588C82.0915 210.021 94.6978 222.671 94.6978 237.703L94.6978 255.027C94.6978 270.058 106.883 282.243 121.914 282.243H139.221Z" fill="#333" class="svg-elem-1" ></path>
    <path d="M192.261 142.028C192.261 126.996 204.867 114.346 218.829 119.913C223.468 121.763 227.923 124.102 232.117 126.904C243.915 134.789 253.11 145.996 258.539 159.108C263.969 172.22 265.39 186.648 262.622 200.567C259.854 214.487 253.021 227.272 242.988 237.308C232.955 247.343 220.173 254.177 206.256 256.946C192.34 259.715 177.916 258.294 164.807 252.863C151.699 247.432 140.495 238.234 132.612 226.434C129.808 222.238 127.47 217.779 125.62 213.137C120.056 199.174 132.707 186.568 147.738 186.568L165.044 186.568C180.076 186.568 192.261 174.383 192.261 159.352L192.261 142.028Z" fill="#333" class="svg-elem-2" ></path>
    <path d="M95.6522 164.135C95.6522 179.167 83.2279 191.725 68.8013 187.505C59.5145 184.788 50.6432 180.663 42.5106 175.227C26.7806 164.714 14.5206 149.772 7.28089 132.289C0.041183 114.807 -1.85305 95.5697 1.83772 77.0104C5.52849 58.4511 14.6385 41.4033 28.0157 28.0228C41.393 14.6423 58.4366 5.53006 76.9914 1.83839C95.5461 -1.85329 114.779 0.0414162 132.257 7.2829C149.735 14.5244 164.674 26.7874 175.184 42.5212C180.62 50.6576 184.744 59.5332 187.46 68.8245C191.678 83.2519 179.119 95.6759 164.088 95.6759L122.869 95.6759C107.837 95.6759 95.6522 107.861 95.6522 122.892L95.6522 164.135Z" fill="#333" class="svg-elem-3"></path>
  </svg>
  <span class="hidden">Context Invalidated, Press to Reload</span>
  `;
    return e.innerHTML = T ? T.createHTML(t) : t, e.style.pointerEvents = "none", e.style.position = "fixed", e.style.bottom = "14.7px", e.style.right = "14.7px", e.style.fontFamily = "sans-serif", e.style.display = "flex", e.style.justifyContent = "center", e.style.alignItems = "center", e.style.padding = "14.7px", e.style.gap = "14.7px", e.style.borderRadius = "4.7px", e.style.zIndex = "2147483647", e.style.opacity = "0", e.style.transition = "all 0.47s ease-in-out", e;
}
function N(e) {
    return new Promise((t)=>{
        document.documentElement ? (f() && (document.documentElement.appendChild(e), t()), t()) : globalThis.addEventListener("DOMContentLoaded", ()=>{
            f() && document.documentElement.appendChild(e), t();
        });
    });
}
var k = ()=>{
    let e;
    if (f()) {
        let t = F();
        e = N(t);
    }
    return {
        show: async ({ reloadButton: t = !1 } = {})=>{
            await e;
            let o = g();
            o.style.opacity = "1", t && (o.onclick = (r)=>{
                r.stopPropagation(), globalThis.location.reload();
            }, o.querySelector("span").classList.remove("hidden"), o.style.cursor = "pointer", o.style.pointerEvents = "all");
        },
        hide: async ()=>{
            await e;
            let t = g();
            t.style.opacity = "0";
        }
    };
};
var W = `${E}${module.id}__`, i, A = !1, M = k();
async function h() {
    c("Script Runtime - reloading"), A ? globalThis.location?.reload?.() : M.show({
        reloadButton: !0
    });
}
function R() {
    i?.disconnect(), i = l?.runtime.connect({
        name: W
    }), i.onDisconnect.addListener(()=>{
        h();
    }), i.onMessage.addListener((e)=>{
        e.__plasmo_cs_reload__ && h(), e.__plasmo_cs_active_tab__ && (A = !0);
    });
}
function j() {
    if (l?.runtime) try {
        R(), setInterval(R, 24e3);
    } catch  {
        return;
    }
}
j();
P(async (e)=>{
    c("Script runtime - on updated assets"), e.filter((o)=>o.envHash === n.envHash).some((o)=>L(module.bundle, o.id)) && (M.show(), l?.runtime ? i.postMessage({
        __plasmo_cs_changed__: !0
    }) : setTimeout(()=>{
        h();
    }, 4700));
});

},{}],"lqZBW":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "config", ()=>config);
var _localReceiver = require("~lib/api/localReceiver");
var _scoring = require("~lib/ops/scoring");
var _settings = require("~lib/ops/settings");
const config = {
    matches: [
        "https://x.com/*"
    ],
    run_at: "document_idle"
};
const CLIPS_KEY = "x_clips";
const sleep = (ms)=>new Promise((r)=>setTimeout(r, ms));
async function getClips() {
    const data = await chrome.storage.local.get([
        CLIPS_KEY
    ]);
    return data[CLIPS_KEY] || [];
}
async function setClips(items) {
    await chrome.storage.local.set({
        [CLIPS_KEY]: items
    });
}
function extractFromArticle(article) {
    const textNode = article.querySelector('[data-testid="tweetText"]');
    const text = textNode?.innerText?.trim() || "";
    const authorLink = article.querySelector('a[href^="/"][role="link"]');
    const author = authorLink?.getAttribute("href")?.split("/")?.[1] || "";
    const tweetLinkEl = [
        ...article.querySelectorAll('a[href*="/status/"]')
    ].find((a)=>{
        const h = a.getAttribute("href") || "";
        return h.includes("/status/") && !h.includes("/analytics") && !h.includes("/photo/");
    });
    const tweetUrl = tweetLinkEl ? `https://x.com${tweetLinkEl.getAttribute("href")}` : "";
    const imageUrls = [
        ...article.querySelectorAll('img[src*="pbs.twimg.com/media"]')
    ].map((img)=>img.src.replace(/&name=\w+/, "&name=orig"));
    const row = {
        id: crypto.randomUUID(),
        source: "x",
        tweet_url: tweetUrl,
        author,
        text,
        image_urls: [
            ...new Set(imageUrls)
        ],
        tags: [
            "AI"
        ],
        lang: /[\u4e00-\u9fff]/.test(text) ? "zh" : "en",
        status: "new",
        clipped_at: new Date().toISOString()
    };
    row.score = (0, _scoring.decideCandidateScore)(row);
    return row;
}
function toast(text) {
    const el = document.createElement("div");
    el.textContent = text;
    Object.assign(el.style, {
        position: "fixed",
        right: "24px",
        bottom: "120px",
        zIndex: "2147483647",
        background: "rgba(0,0,0,0.82)",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: "10px",
        fontSize: "12px"
    });
    document.body.appendChild(el);
    setTimeout(()=>el.remove(), 1800);
}
async function clipTop() {
    const article = document.querySelector("article");
    if (!article) return toast("\u6ca1\u627e\u5230\u5e16\u5b50");
    const row = extractFromArticle(article);
    if (!row.tweet_url) return toast("\u672a\u8bc6\u522b\u5230\u63a8\u6587\u94fe\u63a5");
    const items = await getClips();
    items.unshift(row);
    await setClips(items);
    await (0, _localReceiver.saveClip)(row);
    toast(`\u5df2\u526a\u85cf @${row.author || "unknown"}`);
}
async function runOpsRound() {
    const s = await (0, _settings.loadOpsSettings)();
    const rs = await (0, _localReceiver.enqueueCommand)("ops_round", {
        total: s.roundTotal,
        minDelaySec: s.minDelaySec,
        maxDelaySec: s.maxDelaySec
    });
    toast(`\u5df2\u4e0b\u53d1\u8fd0\u8425\u4efb\u52a1 #${rs?.queued?.id || "?"}\uff08${s.roundTotal}\u6761\uff09`);
}
function pickDraftMaterial(items) {
    const shortlisted = items.filter((x)=>(x.status || "new") === "shortlisted");
    const pool = shortlisted.length ? shortlisted : items;
    if (!pool.length) return null;
    return pool.slice().sort((a, b)=>(b.score || 0) - (a.score || 0))[0];
}
function draftTextFromMaterial(m) {
    const core = (m.text || "").replace(/\s+/g, " ").trim().slice(0, 160);
    return `Signal from my AI feed today:\n${core}\n\nPractical workflows > hype.\n\nSource inspo: ${m.tweet_url}\n#AI #AIGC #BuildInPublic`;
}
function getComposerBox() {
    return document.querySelector('[data-testid="tweetTextarea_0"] [contenteditable="true"]') || document.querySelector('div[contenteditable="true"][role="textbox"]');
}
async function typeSlow(box, text) {
    box.focus();
    document.execCommand("selectAll", false);
    document.execCommand("delete", false);
    for (const ch of text){
        document.execCommand("insertText", false, ch);
        await sleep(28);
    }
}
async function fillDraftNow() {
    const items = await getClips();
    const material = pickDraftMaterial(items);
    if (!material) return toast("\u6ca1\u6709\u53ef\u7528\u7d20\u6750\uff0c\u8bf7\u5148\u526a\u85cf");
    if (!location.href.includes("/compose/post")) {
        location.href = "https://x.com/compose/post";
        await sleep(1200);
    }
    let box = null;
    for(let i = 0; i < 30; i++){
        box = getComposerBox();
        if (box) break;
        await sleep(250);
    }
    if (!box) return toast("\u672a\u627e\u5230\u53d1\u5e16\u8f93\u5165\u6846");
    await typeSlow(box, draftTextFromMaterial(material));
    toast("\u8349\u7a3f\u5df2\u586b\u5145\uff08\u672a\u81ea\u52a8\u53d1\u5e03\uff09");
}
async function showClipList() {
    const old = document.getElementById("x-ops-studio-list");
    if (old) old.remove();
    const items = (await getClips()).slice(0, 20);
    const modal = document.createElement("div");
    modal.id = "x-ops-studio-list";
    Object.assign(modal.style, {
        position: "fixed",
        right: "20px",
        bottom: "150px",
        width: "380px",
        maxHeight: "60vh",
        overflow: "auto",
        background: "#0f1419",
        border: "1px solid #2f3336",
        borderRadius: "12px",
        padding: "10px",
        zIndex: "2147483647",
        color: "#e7e9ea",
        fontSize: "12px"
    });
    const head = document.createElement("div");
    head.innerHTML = `<b>\u7d20\u6750\u5217\u8868</b>\uff08\u6700\u8fd1 ${items.length} \u6761\uff09`;
    modal.appendChild(head);
    for (const m of items){
        const item = document.createElement("div");
        item.style.borderTop = "1px solid #2f3336";
        item.style.padding = "8px 0";
        const top = document.createElement("div");
        top.innerHTML = `@${m.author || "unknown"} \u00b7 ${m.image_urls?.length || 0}\u56fe \u00b7 score ${m.score || 0}`;
        const txt = document.createElement("div");
        txt.textContent = (m.text || "").slice(0, 80);
        txt.style.opacity = "0.85";
        if (m.image_urls?.[0]) {
            const img = document.createElement("img");
            img.src = m.image_urls[0];
            Object.assign(img.style, {
                width: "100%",
                maxHeight: "120px",
                objectFit: "cover",
                borderRadius: "8px",
                marginTop: "6px"
            });
            item.appendChild(img);
        }
        item.appendChild(top);
        item.appendChild(txt);
        modal.appendChild(item);
    }
    document.body.appendChild(modal);
}
function mountFab() {
    if (document.getElementById("x-ops-studio-fab")) return;
    const fab = document.createElement("button");
    fab.id = "x-ops-studio-fab";
    fab.textContent = "\u2699\ufe0f";
    Object.assign(fab.style, {
        position: "fixed",
        right: "20px",
        bottom: "24px",
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        border: "none",
        background: "#1d9bf0",
        color: "#fff",
        fontSize: "24px",
        zIndex: "2147483647",
        cursor: "pointer"
    });
    const panel = document.createElement("div");
    panel.hidden = true;
    Object.assign(panel.style, {
        position: "fixed",
        right: "20px",
        bottom: "84px",
        zIndex: "2147483647",
        background: "#0f1419",
        border: "1px solid #2f3336",
        borderRadius: "12px",
        padding: "8px",
        width: "210px"
    });
    const mkBtn = (txt, onClick)=>{
        const b = document.createElement("button");
        b.textContent = txt;
        Object.assign(b.style, {
            width: "100%",
            marginTop: "6px",
            border: "none",
            borderRadius: "8px",
            padding: "8px 10px",
            background: "#1d9bf0",
            color: "#fff",
            fontSize: "12px",
            cursor: "pointer"
        });
        b.onclick = onClick;
        return b;
    };
    panel.appendChild(mkBtn("\u5feb\u901f\u526a\u85cf\u9996\u6761", ()=>void clipTop()));
    panel.appendChild(mkBtn("\u67e5\u770b\u7d20\u6750\u5217\u8868", ()=>void showClipList()));
    panel.appendChild(mkBtn("\u751f\u6210\u53d1\u5e16\u8349\u7a3f", ()=>void fillDraftNow()));
    panel.appendChild(mkBtn("\u8fd0\u8425\u4e00\u8f6e(10\u6761)", ()=>void runOpsRound()));
    fab.addEventListener("mouseenter", ()=>panel.hidden = false);
    panel.addEventListener("mouseenter", ()=>panel.hidden = false);
    fab.addEventListener("mouseleave", async ()=>{
        await sleep(100);
        if (!panel.matches(":hover") && !fab.matches(":hover")) panel.hidden = true;
    });
    panel.addEventListener("mouseleave", async ()=>{
        await sleep(100);
        if (!panel.matches(":hover") && !fab.matches(":hover")) panel.hidden = true;
    });
    document.body.appendChild(panel);
    document.body.appendChild(fab);
}
mountFab();

},{"~lib/api/localReceiver":"97PW3","~lib/ops/scoring":"iYGh3","@parcel/transformer-js/src/esmodule-helpers.js":"6dfwG","~lib/ops/settings":"ceyum"}],"97PW3":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "healthcheck", ()=>healthcheck);
parcelHelpers.export(exports, "saveClip", ()=>saveClip);
parcelHelpers.export(exports, "enqueueCommand", ()=>enqueueCommand);
parcelHelpers.export(exports, "listMaterials", ()=>listMaterials);
parcelHelpers.export(exports, "listResults", ()=>listResults);
const BASE = "http://127.0.0.1:8765";
async function healthcheck() {
    const r = await fetch(`${BASE}/health`);
    const j = await r.json();
    if (!j || typeof j.ok !== "boolean") throw new Error("invalid health response");
    return j;
}
async function saveClip(record) {
    const r = await fetch(`${BASE}/clip`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(record)
    });
    return r.json();
}
async function enqueueCommand(action, payload = {}) {
    const r = await fetch(`${BASE}/command`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action,
            payload
        })
    });
    return r.json();
}
async function listMaterials(status = "all", limit = 20, q = "") {
    const u = new URL(`${BASE}/materials`);
    u.searchParams.set("status", status);
    u.searchParams.set("limit", String(limit));
    if (q) u.searchParams.set("q", q);
    const r = await fetch(u.toString());
    return r.json();
}
async function listResults() {
    const r = await fetch(`${BASE}/results`);
    return r.json();
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"6dfwG"}],"6dfwG":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"iYGh3":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "decideCandidateScore", ()=>decideCandidateScore);
function decideCandidateScore(row) {
    const t = `${row.text || ""}`.toLowerCase();
    let score = 0;
    if ([
        "ai",
        "aigc",
        "llm",
        "midjourney",
        "workflow",
        "prompt",
        "model"
    ].some((k)=>t.includes(k))) score += 4;
    if ((row.image_urls || []).length > 0) score += 2;
    if ((row.lang || "en") === "en") score += 1;
    if ([
        "build",
        "tool",
        "demo",
        "agent",
        "generate",
        "image",
        "video",
        "automation"
    ].some((k)=>t.includes(k))) score += 1;
    if ([
        "airdrop",
        "casino",
        "bet",
        "nft mint",
        "follow me",
        "giveaway"
    ].some((k)=>t.includes(k))) score -= 4;
    if ((row.text || "").trim().length < 20) score -= 1;
    return score;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"6dfwG"}],"ceyum":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "DEFAULT_OPS_SETTINGS", ()=>DEFAULT_OPS_SETTINGS);
parcelHelpers.export(exports, "loadOpsSettings", ()=>loadOpsSettings);
parcelHelpers.export(exports, "saveOpsSettings", ()=>saveOpsSettings);
const DEFAULT_OPS_SETTINGS = {
    roundTotal: 10,
    minDelaySec: 4,
    maxDelaySec: 12
};
const KEY = "x_ops_settings";
async function loadOpsSettings() {
    const data = await chrome.storage.sync.get([
        KEY
    ]);
    return {
        ...DEFAULT_OPS_SETTINGS,
        ...data?.[KEY] || {}
    };
}
async function saveOpsSettings(settings) {
    await chrome.storage.sync.set({
        [KEY]: settings
    });
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"6dfwG"}]},["eyk1u","lqZBW"], "lqZBW", "parcelRequireae5d")

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUksSUFBRSxXQUFXLFNBQVMsUUFBTSxFQUFFO0FBQUMsSUFBSSxJQUFFLElBQUksV0FBVyxTQUFTLE9BQUssQ0FBQztBQUFFLElBQUksSUFBRSxJQUFJLElBQUksSUFBRyxJQUFFLENBQUEsSUFBRyxFQUFFLElBQUksSUFBRyxJQUFFLEVBQUUsT0FBTyxDQUFBLElBQUcsRUFBRSxXQUFXLFNBQU8sRUFBRSxTQUFTLE1BQU0sSUFBSSxDQUFBLElBQUcsRUFBRSxNQUFNLE1BQU0sT0FBTyxDQUFDLEdBQUUsQ0FBQyxHQUFFLEVBQUUsR0FBSSxDQUFBLENBQUMsQ0FBQyxFQUFFLEdBQUMsR0FBRSxDQUFBLEdBQUcsQ0FBQztBQUFHLElBQUksSUFBRSxFQUFFLGNBQWEsSUFBRSxJQUFJLEVBQUUsZ0JBQWMsSUFBSSxZQUFVLFFBQU8sSUFBRTtBQUFJLElBQUksSUFBRSxDQUFDLElBQUUsRUFBRSxFQUFDLEdBQUcsSUFBSSxRQUFRLElBQUksRUFBRSxPQUFPLElBQUcsUUFBTztBQUFHLElBQUksSUFBRSxDQUFDLEdBQUcsSUFBSSxRQUFRLE1BQU0scUJBQWtCLE9BQU8sSUFBRyxRQUFPLElBQUcsSUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLHdCQUFvQixJQUFHLElBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSx3QkFBb0IsSUFBRyxJQUFFLEdBQUUsSUFBRSxDQUFDLEdBQUcsSUFBSSxPQUFLLEVBQUUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUk7QUFBRyxJQUFJLElBQUU7SUFBQyxtQkFBa0I7SUFBSyxnQkFBZTtJQUFNLFdBQVU7SUFBTSxZQUFXO1FBQUM7S0FBaUI7SUFBQyxRQUFPO0lBQVksUUFBTztJQUFLLGlCQUFnQjtJQUF5RSxZQUFXO0lBQW1CLFdBQVU7SUFBbUIsV0FBVTtJQUFRLFVBQVM7SUFBTSxjQUFhO0FBQUs7QUFBRSxPQUFPLE9BQU8sZ0JBQWMsRUFBRTtBQUFTLFdBQVcsVUFBUTtJQUFDLE1BQUssRUFBRTtJQUFDLEtBQUk7UUFBQyxTQUFRLEVBQUU7SUFBTztBQUFDO0FBQUUsSUFBSSxJQUFFLE9BQU8sT0FBTztBQUFPLFNBQVMsRUFBRSxDQUFDO0lBQUUsRUFBRSxLQUFLLElBQUksRUFBQyxJQUFHLElBQUksQ0FBQyxNQUFJO1FBQUMsTUFBSyxPQUFPLE9BQU8sT0FBTyxDQUFDLEVBQUU7UUFBQyxrQkFBaUIsRUFBRTtRQUFDLG1CQUFrQixFQUFFO1FBQUMsUUFBTyxTQUFTLENBQUM7WUFBRSxJQUFJLENBQUMsaUJBQWlCLEtBQUssS0FBRyxZQUFXO1FBQUU7UUFBRSxTQUFRLFNBQVMsQ0FBQztZQUFFLElBQUksQ0FBQyxrQkFBa0IsS0FBSztRQUFFO0lBQUMsR0FBRSxPQUFPLE9BQU8sT0FBTyxDQUFDLEVBQUUsR0FBQyxLQUFLO0FBQUM7QUFBQyxPQUFPLE9BQU8sU0FBTztBQUFFLE9BQU8sT0FBTyxVQUFRLENBQUM7QUFBRSxJQUFJLElBQUUsV0FBVyxXQUFTLFdBQVcsVUFBUTtBQUFLLFNBQVM7SUFBSSxPQUFNLENBQUMsRUFBRSxRQUFNLEVBQUUsU0FBTyxZQUFVLGNBQVksRUFBRTtBQUFJO0FBQUMsU0FBUztJQUFJLE9BQU8sRUFBRSxRQUFNLFNBQVM7QUFBSTtBQUFDLElBQUksSUFBRTtBQUEyQixTQUFTLEVBQUUsQ0FBQyxFQUFDLENBQUM7SUFBRSxJQUFHLEVBQUMsU0FBUSxDQUFDLEVBQUMsR0FBQztJQUFFLE9BQU8sSUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBQyxDQUFDO0FBQUM7QUFBQyxTQUFTLEVBQUUsSUFBRSxHQUFHO0lBQUUsSUFBSSxJQUFFO0lBQUksT0FBTSxDQUFDLEVBQUUsRUFBRSxVQUFRLFNBQVMsYUFBVyxZQUFVLENBQUMsOEJBQThCLEtBQUssS0FBRyxRQUFNLEtBQUssR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQUE7QUFBQyxTQUFTLEVBQUUsQ0FBQztJQUFFLE9BQU8sRUFBRSxXQUFTLFlBQVUsRUFBRSw4QkFBNEIsRUFBRTtBQUFRO0FBQUMsU0FBUyxFQUFFLENBQUM7SUFBRSxJQUFHLE9BQU8sV0FBVyxZQUFVLEtBQUk7SUFBTyxJQUFJLElBQUUsSUFBSSxVQUFVO0lBQUssT0FBTyxFQUFFLGlCQUFpQixXQUFVLGVBQWUsQ0FBQztRQUFFLElBQUksSUFBRSxLQUFLLE1BQU0sRUFBRTtRQUFNLElBQUcsRUFBRSxTQUFPLFlBQVUsTUFBTSxFQUFFLEVBQUUsU0FBUSxFQUFFLFNBQU8sU0FBUSxLQUFJLElBQUksS0FBSyxFQUFFLFlBQVksS0FBSztZQUFDLElBQUksSUFBRSxFQUFFLGFBQVcsRUFBRTtZQUFNLEVBQUUsOEJBQTRCLEVBQUUsVUFBUSxDQUFDO0FBQ3ZnRSxDQUFDLEdBQUMsSUFBRSxDQUFDOztBQUVMLENBQUMsR0FBQyxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQ2hCLENBQUM7UUFBRTtJQUFDLElBQUcsRUFBRSxpQkFBaUIsU0FBUSxJQUFHLEVBQUUsaUJBQWlCLFFBQU87UUFBSyxFQUFFLENBQUMscURBQXFELEVBQUUsRUFBRSxjQUFjLENBQUM7SUFBQyxJQUFHLEVBQUUsaUJBQWlCLFNBQVE7UUFBSyxFQUFFLENBQUMsb0VBQW9FLEVBQUUsRUFBRSxjQUFjLENBQUM7SUFBQyxJQUFHO0FBQUM7QUFBQyxJQUFJLElBQUU7QUFBcUIsU0FBUztJQUFJLElBQUksSUFBRSxXQUFXLFFBQVE7SUFBYSxJQUFHLE9BQU8sSUFBRSxLQUFJO0lBQU8sSUFBSSxJQUFFLFNBQVMsY0FBYywrQkFBK0IsU0FBUyxNQUFNLE1BQUssSUFBRSxJQUFFLENBQUMsQ0FBQyxHQUFHLFNBQU8sRUFBRSxDQUFDLFFBQVEsTUFBSyxNQUFJLEtBQUs7SUFBRSxPQUFPLE9BQU8sSUFBRSxNQUFJLEVBQUUsYUFBYSxLQUFHLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxFQUFDO1FBQUMsWUFBVyxDQUFBLElBQUc7SUFBQyxLQUFHLEtBQUs7QUFBQztBQUFDLElBQUksSUFBRTtBQUFJLFNBQVM7SUFBSSxPQUFPLFNBQVMsZUFBZTtBQUFFO0FBQUMsU0FBUztJQUFJLE9BQU0sQ0FBQztBQUFHO0FBQUMsU0FBUztJQUFJLElBQUksSUFBRSxTQUFTLGNBQWM7SUFBTyxFQUFFLEtBQUc7SUFBRSxJQUFJLElBQUUsQ0FBQzs7S0FFbHRCLEVBQUUsRUFBRTs7Ozs7OztLQU9KLEVBQUUsRUFBRTs7Ozs7Ozs7Ozs7Ozs7O0tBZUosRUFBRSxFQUFFOzs7O0tBSUosRUFBRSxFQUFFOzs7O0tBSUosRUFBRSxFQUFFOzs7O0tBSUosRUFBRSxFQUFFOzs7Ozs7Ozs7Ozs7RUFZUCxDQUFDO0lBQUMsT0FBTyxFQUFFLFlBQVUsSUFBRSxFQUFFLFdBQVcsS0FBRyxHQUFFLEVBQUUsTUFBTSxnQkFBYyxRQUFPLEVBQUUsTUFBTSxXQUFTLFNBQVEsRUFBRSxNQUFNLFNBQU8sVUFBUyxFQUFFLE1BQU0sUUFBTSxVQUFTLEVBQUUsTUFBTSxhQUFXLGNBQWEsRUFBRSxNQUFNLFVBQVEsUUFBTyxFQUFFLE1BQU0saUJBQWUsVUFBUyxFQUFFLE1BQU0sYUFBVyxVQUFTLEVBQUUsTUFBTSxVQUFRLFVBQVMsRUFBRSxNQUFNLE1BQUksVUFBUyxFQUFFLE1BQU0sZUFBYSxTQUFRLEVBQUUsTUFBTSxTQUFPLGNBQWEsRUFBRSxNQUFNLFVBQVEsS0FBSSxFQUFFLE1BQU0sYUFBVyx5QkFBd0I7QUFBQztBQUFDLFNBQVMsRUFBRSxDQUFDO0lBQUUsT0FBTyxJQUFJLFFBQVEsQ0FBQTtRQUFJLFNBQVMsa0JBQWlCLENBQUEsT0FBTSxDQUFBLFNBQVMsZ0JBQWdCLFlBQVksSUFBRyxHQUFFLEdBQUcsR0FBRSxJQUFHLFdBQVcsaUJBQWlCLG9CQUFtQjtZQUFLLE9BQUssU0FBUyxnQkFBZ0IsWUFBWSxJQUFHO1FBQUc7SUFBRTtBQUFFO0FBQUMsSUFBSSxJQUFFO0lBQUssSUFBSTtJQUFFLElBQUcsS0FBSTtRQUFDLElBQUksSUFBRTtRQUFJLElBQUUsRUFBRTtJQUFFO0lBQUMsT0FBTTtRQUFDLE1BQUssT0FBTSxFQUFDLGNBQWEsSUFBRSxDQUFDLENBQUMsRUFBQyxHQUFDLENBQUMsQ0FBQztZQUFJLE1BQU07WUFBRSxJQUFJLElBQUU7WUFBSSxFQUFFLE1BQU0sVUFBUSxLQUFJLEtBQUksQ0FBQSxFQUFFLFVBQVEsQ0FBQTtnQkFBSSxFQUFFLG1CQUFrQixXQUFXLFNBQVM7WUFBUSxHQUFFLEVBQUUsY0FBYyxRQUFRLFVBQVUsT0FBTyxXQUFVLEVBQUUsTUFBTSxTQUFPLFdBQVUsRUFBRSxNQUFNLGdCQUFjLEtBQUk7UUFBRTtRQUFFLE1BQUs7WUFBVSxNQUFNO1lBQUUsSUFBSSxJQUFFO1lBQUksRUFBRSxNQUFNLFVBQVE7UUFBRztJQUFDO0FBQUM7QUFBRSxJQUFJLElBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxPQUFPLEdBQUcsRUFBRSxDQUFDLEVBQUMsR0FBRSxJQUFFLENBQUMsR0FBRSxJQUFFO0FBQUksZUFBZTtJQUFJLEVBQUUsK0JBQThCLElBQUUsV0FBVyxVQUFVLGFBQVcsRUFBRSxLQUFLO1FBQUMsY0FBYSxDQUFDO0lBQUM7QUFBRTtBQUFDLFNBQVM7SUFBSSxHQUFHLGNBQWEsSUFBRSxHQUFHLFFBQVEsUUFBUTtRQUFDLE1BQUs7SUFBQyxJQUFHLEVBQUUsYUFBYSxZQUFZO1FBQUs7SUFBRyxJQUFHLEVBQUUsVUFBVSxZQUFZLENBQUE7UUFBSSxFQUFFLHdCQUFzQixLQUFJLEVBQUUsNEJBQTJCLENBQUEsSUFBRSxDQUFDLENBQUE7SUFBRTtBQUFFO0FBQUMsU0FBUztJQUFJLElBQUcsR0FBRyxTQUFRLElBQUc7UUFBQyxLQUFJLFlBQVksR0FBRTtJQUFLLEVBQUMsT0FBSztRQUFDO0lBQU07QUFBQztBQUFDO0FBQUksRUFBRSxPQUFNO0lBQUksRUFBRSx1Q0FBc0MsRUFBRSxPQUFPLENBQUEsSUFBRyxFQUFFLFlBQVUsRUFBRSxTQUFTLEtBQUssQ0FBQSxJQUFHLEVBQUUsT0FBTyxRQUFPLEVBQUUsUUFBTyxDQUFBLEVBQUUsUUFBTyxHQUFHLFVBQVEsRUFBRSxZQUFZO1FBQUMsdUJBQXNCLENBQUM7SUFBQyxLQUFHLFdBQVc7UUFBSztJQUFHLEdBQUUsS0FBSTtBQUFFOzs7Ozs0Q0M5Q2hsRDtBQUxiO0FBQ0E7QUFFQTtBQUVPLE1BQU0sU0FBeUI7SUFDcEMsU0FBUztRQUFDO0tBQWtCO0lBQzVCLFFBQVE7QUFDVjtBQUVBLE1BQU0sWUFBWTtBQUVsQixNQUFNLFFBQVEsQ0FBQyxLQUFlLElBQUksUUFBUSxDQUFDLElBQU0sV0FBVyxHQUFHO0FBRS9ELGVBQWU7SUFDYixNQUFNLE9BQU8sTUFBTSxPQUFPLFFBQVEsTUFBTSxJQUFJO1FBQUM7S0FBVTtJQUN2RCxPQUFRLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRTtBQUMvQjtBQUVBLGVBQWUsU0FBUyxLQUFxQjtJQUMzQyxNQUFNLE9BQU8sUUFBUSxNQUFNLElBQUk7UUFBRSxDQUFDLFVBQVUsRUFBRTtJQUFNO0FBQ3REO0FBRUEsU0FBUyxtQkFBbUIsT0FBb0I7SUFDOUMsTUFBTSxXQUFXLFFBQVEsY0FBYztJQUN2QyxNQUFNLE9BQU8sVUFBVSxXQUFXLFVBQVU7SUFFNUMsTUFBTSxhQUFhLFFBQVEsY0FBYztJQUN6QyxNQUFNLFNBQVMsWUFBWSxhQUFhLFNBQVMsTUFBTSxNQUFNLENBQUMsRUFBRSxJQUFJO0lBRXBFLE1BQU0sY0FBYztXQUFJLFFBQVEsaUJBQWlCO0tBQXVCLENBQUMsS0FBSyxDQUFDO1FBQzdFLE1BQU0sSUFBSSxBQUFDLEVBQXdCLGFBQWEsV0FBVztRQUMzRCxPQUFPLEVBQUUsU0FBUyxlQUFlLENBQUMsRUFBRSxTQUFTLGlCQUFpQixDQUFDLEVBQUUsU0FBUztJQUM1RTtJQUVBLE1BQU0sV0FBVyxjQUFjLENBQUMsYUFBYSxFQUFFLFlBQVksYUFBYSxRQUFRLENBQUMsR0FBRztJQUVwRixNQUFNLFlBQVk7V0FBSSxRQUFRLGlCQUFpQjtLQUFtQyxDQUMvRSxJQUFJLENBQUMsTUFBUSxBQUFDLElBQXlCLElBQUksUUFBUSxhQUFhO0lBRW5FLE1BQU0sTUFBb0I7UUFDeEIsSUFBSSxPQUFPO1FBQ1gsUUFBUTtRQUNSLFdBQVc7UUFDWDtRQUNBO1FBQ0EsWUFBWTtlQUFJLElBQUksSUFBSTtTQUFXO1FBQ25DLE1BQU07WUFBQztTQUFLO1FBQ1osTUFBTSxrQkFBa0IsS0FBSyxRQUFRLE9BQU87UUFDNUMsUUFBUTtRQUNSLFlBQVksSUFBSSxPQUFPO0lBQ3pCO0lBRUEsSUFBSSxRQUFRLENBQUEsR0FBQSw2QkFBbUIsRUFBRTtJQUNqQyxPQUFPO0FBQ1Q7QUFFQSxTQUFTLE1BQU0sSUFBWTtJQUN6QixNQUFNLEtBQUssU0FBUyxjQUFjO0lBQ2xDLEdBQUcsY0FBYztJQUNqQixPQUFPLE9BQU8sR0FBRyxPQUFPO1FBQ3RCLFVBQVU7UUFDVixPQUFPO1FBQ1AsUUFBUTtRQUNSLFFBQVE7UUFDUixZQUFZO1FBQ1osT0FBTztRQUNQLFNBQVM7UUFDVCxjQUFjO1FBQ2QsVUFBVTtJQUNaO0lBQ0EsU0FBUyxLQUFLLFlBQVk7SUFDMUIsV0FBVyxJQUFNLEdBQUcsVUFBVTtBQUNoQztBQUVBLGVBQWU7SUFDYixNQUFNLFVBQVUsU0FBUyxjQUFjO0lBQ3ZDLElBQUksQ0FBQyxTQUFTLE9BQU8sTUFBTTtJQUUzQixNQUFNLE1BQU0sbUJBQW1CO0lBQy9CLElBQUksQ0FBQyxJQUFJLFdBQVcsT0FBTyxNQUFNO0lBRWpDLE1BQU0sUUFBUSxNQUFNO0lBQ3BCLE1BQU0sUUFBUTtJQUNkLE1BQU0sU0FBUztJQUNmLE1BQU0sQ0FBQSxHQUFBLHVCQUFPLEVBQUU7SUFDZixNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksVUFBVSxVQUFVLENBQUM7QUFDekM7QUFFQSxlQUFlO0lBQ2IsTUFBTSxJQUFJLE1BQU0sQ0FBQSxHQUFBLHlCQUFjO0lBQzlCLE1BQU0sS0FBSyxNQUFNLENBQUEsR0FBQSw2QkFBYSxFQUFFLGFBQWE7UUFDM0MsT0FBTyxFQUFFO1FBQ1QsYUFBYSxFQUFFO1FBQ2YsYUFBYSxFQUFFO0lBQ2pCO0lBQ0EsTUFBTSxDQUFDLFNBQVMsRUFBRSxJQUFJLFFBQVEsTUFBTSxJQUFJLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDO0FBQzdEO0FBRUEsU0FBUyxrQkFBa0IsS0FBcUI7SUFDOUMsTUFBTSxjQUFjLE1BQU0sT0FBTyxDQUFDLElBQU0sQUFBQyxDQUFBLEVBQUUsVUFBVSxLQUFJLE1BQU87SUFDaEUsTUFBTSxPQUFPLFlBQVksU0FBUyxjQUFjO0lBQ2hELElBQUksQ0FBQyxLQUFLLFFBQVEsT0FBTztJQUN6QixPQUFPLEtBQUssUUFBUSxLQUFLLENBQUMsR0FBRyxJQUFNLEFBQUMsQ0FBQSxFQUFFLFNBQVMsQ0FBQSxJQUFNLENBQUEsRUFBRSxTQUFTLENBQUEsRUFBRyxDQUFDLEVBQUU7QUFDeEU7QUFFQSxTQUFTLHNCQUFzQixDQUFlO0lBQzVDLE1BQU0sT0FBTyxBQUFDLENBQUEsRUFBRSxRQUFRLEVBQUMsRUFBRyxRQUFRLFFBQVEsS0FBSyxPQUFPLE1BQU0sR0FBRztJQUNqRSxPQUFPLENBQUMsK0JBQStCLEVBQUUsS0FBSyxpREFBaUQsRUFBRSxFQUFFLFVBQVUsMEJBQTBCLENBQUM7QUFDMUk7QUFFQSxTQUFTO0lBQ1AsT0FBUSxTQUFTLGNBQWMsK0RBQzdCLFNBQVMsY0FBYztBQUMzQjtBQUVBLGVBQWUsU0FBUyxHQUFnQixFQUFFLElBQVk7SUFDcEQsSUFBSTtJQUNKLFNBQVMsWUFBWSxhQUFhO0lBQ2xDLFNBQVMsWUFBWSxVQUFVO0lBQy9CLEtBQUssTUFBTSxNQUFNLEtBQU07UUFDckIsU0FBUyxZQUFZLGNBQWMsT0FBTztRQUMxQyxNQUFNLE1BQU07SUFDZDtBQUNGO0FBRUEsZUFBZTtJQUNiLE1BQU0sUUFBUSxNQUFNO0lBQ3BCLE1BQU0sV0FBVyxrQkFBa0I7SUFDbkMsSUFBSSxDQUFDLFVBQVUsT0FBTyxNQUFNO0lBRTVCLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxrQkFBa0I7UUFDNUMsU0FBUyxPQUFPO1FBQ2hCLE1BQU0sTUFBTTtJQUNkO0lBRUEsSUFBSSxNQUEwQjtJQUM5QixJQUFLLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxJQUFLO1FBQzNCLE1BQU07UUFDTixJQUFJLEtBQUs7UUFDVCxNQUFNLE1BQU07SUFDZDtJQUNBLElBQUksQ0FBQyxLQUFLLE9BQU8sTUFBTTtJQUV2QixNQUFNLFNBQVMsS0FBSyxzQkFBc0I7SUFDMUMsTUFBTTtBQUNSO0FBRUEsZUFBZTtJQUNiLE1BQU0sTUFBTSxTQUFTLGVBQWU7SUFDcEMsSUFBSSxLQUFLLElBQUk7SUFFYixNQUFNLFFBQVEsQUFBQyxDQUFBLE1BQU0sVUFBUyxFQUFHLE1BQU0sR0FBRztJQUMxQyxNQUFNLFFBQVEsU0FBUyxjQUFjO0lBQ3JDLE1BQU0sS0FBSztJQUNYLE9BQU8sT0FBTyxNQUFNLE9BQU87UUFDekIsVUFBVTtRQUNWLE9BQU87UUFDUCxRQUFRO1FBQ1IsT0FBTztRQUNQLFdBQVc7UUFDWCxVQUFVO1FBQ1YsWUFBWTtRQUNaLFFBQVE7UUFDUixjQUFjO1FBQ2QsU0FBUztRQUNULFFBQVE7UUFDUixPQUFPO1FBQ1AsVUFBVTtJQUNaO0lBRUEsTUFBTSxPQUFPLFNBQVMsY0FBYztJQUNwQyxLQUFLLFlBQVksQ0FBQyxlQUFlLEVBQUUsTUFBTSxPQUFPLEdBQUcsQ0FBQztJQUNwRCxNQUFNLFlBQVk7SUFFbEIsS0FBSyxNQUFNLEtBQUssTUFBTztRQUNyQixNQUFNLE9BQU8sU0FBUyxjQUFjO1FBQ3BDLEtBQUssTUFBTSxZQUFZO1FBQ3ZCLEtBQUssTUFBTSxVQUFVO1FBRXJCLE1BQU0sTUFBTSxTQUFTLGNBQWM7UUFDbkMsSUFBSSxZQUFZLENBQUMsQ0FBQyxFQUFFLEVBQUUsVUFBVSxVQUFVLEdBQUcsRUFBRSxFQUFFLFlBQVksVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDO1FBRW5HLE1BQU0sTUFBTSxTQUFTLGNBQWM7UUFDbkMsSUFBSSxjQUFjLEFBQUMsQ0FBQSxFQUFFLFFBQVEsRUFBQyxFQUFHLE1BQU0sR0FBRztRQUMxQyxJQUFJLE1BQU0sVUFBVTtRQUVwQixJQUFJLEVBQUUsWUFBWSxDQUFDLEVBQUUsRUFBRTtZQUNyQixNQUFNLE1BQU0sU0FBUyxjQUFjO1lBQ25DLElBQUksTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQ3pCLE9BQU8sT0FBTyxJQUFJLE9BQU87Z0JBQ3ZCLE9BQU87Z0JBQ1AsV0FBVztnQkFDWCxXQUFXO2dCQUNYLGNBQWM7Z0JBQ2QsV0FBVztZQUNiO1lBQ0EsS0FBSyxZQUFZO1FBQ25CO1FBRUEsS0FBSyxZQUFZO1FBQ2pCLEtBQUssWUFBWTtRQUNqQixNQUFNLFlBQVk7SUFDcEI7SUFFQSxTQUFTLEtBQUssWUFBWTtBQUM1QjtBQUVBLFNBQVM7SUFDUCxJQUFJLFNBQVMsZUFBZSxxQkFBcUI7SUFFakQsTUFBTSxNQUFNLFNBQVMsY0FBYztJQUNuQyxJQUFJLEtBQUs7SUFDVCxJQUFJLGNBQWM7SUFDbEIsT0FBTyxPQUFPLElBQUksT0FBTztRQUN2QixVQUFVO1FBQ1YsT0FBTztRQUNQLFFBQVE7UUFDUixPQUFPO1FBQ1AsUUFBUTtRQUNSLGNBQWM7UUFDZCxRQUFRO1FBQ1IsWUFBWTtRQUNaLE9BQU87UUFDUCxVQUFVO1FBQ1YsUUFBUTtRQUNSLFFBQVE7SUFDVjtJQUVBLE1BQU0sUUFBUSxTQUFTLGNBQWM7SUFDckMsTUFBTSxTQUFTO0lBQ2YsT0FBTyxPQUFPLE1BQU0sT0FBTztRQUN6QixVQUFVO1FBQ1YsT0FBTztRQUNQLFFBQVE7UUFDUixRQUFRO1FBQ1IsWUFBWTtRQUNaLFFBQVE7UUFDUixjQUFjO1FBQ2QsU0FBUztRQUNULE9BQU87SUFDVDtJQUVBLE1BQU0sUUFBUSxDQUFDLEtBQWE7UUFDMUIsTUFBTSxJQUFJLFNBQVMsY0FBYztRQUNqQyxFQUFFLGNBQWM7UUFDaEIsT0FBTyxPQUFPLEVBQUUsT0FBTztZQUNyQixPQUFPO1lBQ1AsV0FBVztZQUNYLFFBQVE7WUFDUixjQUFjO1lBQ2QsU0FBUztZQUNULFlBQVk7WUFDWixPQUFPO1lBQ1AsVUFBVTtZQUNWLFFBQVE7UUFDVjtRQUNBLEVBQUUsVUFBVTtRQUNaLE9BQU87SUFDVDtJQUVBLE1BQU0sWUFBWSxNQUFNLFVBQVUsSUFBTSxLQUFLO0lBQzdDLE1BQU0sWUFBWSxNQUFNLFVBQVUsSUFBTSxLQUFLO0lBQzdDLE1BQU0sWUFBWSxNQUFNLFVBQVUsSUFBTSxLQUFLO0lBQzdDLE1BQU0sWUFBWSxNQUFNLGFBQWEsSUFBTSxLQUFLO0lBRWhELElBQUksaUJBQWlCLGNBQWMsSUFBTyxNQUFNLFNBQVM7SUFDekQsTUFBTSxpQkFBaUIsY0FBYyxJQUFPLE1BQU0sU0FBUztJQUMzRCxJQUFJLGlCQUFpQixjQUFjO1FBQ2pDLE1BQU0sTUFBTTtRQUNaLElBQUksQ0FBQyxNQUFNLFFBQVEsYUFBYSxDQUFDLElBQUksUUFBUSxXQUFXLE1BQU0sU0FBUztJQUN6RTtJQUNBLE1BQU0saUJBQWlCLGNBQWM7UUFDbkMsTUFBTSxNQUFNO1FBQ1osSUFBSSxDQUFDLE1BQU0sUUFBUSxhQUFhLENBQUMsSUFBSSxRQUFRLFdBQVcsTUFBTSxTQUFTO0lBQ3pFO0lBRUEsU0FBUyxLQUFLLFlBQVk7SUFDMUIsU0FBUyxLQUFLLFlBQVk7QUFDNUI7QUFFQTs7Ozs7QUN0UkEsaURBQXNCO0FBU3RCLDhDQUFzQjtBQVN0QixvREFBc0I7QUFTdEIsbURBQXNCO0FBU3RCLGlEQUFzQjtBQXRDdEIsTUFBTSxPQUFPO0FBRU4sZUFBZTtJQUNwQixNQUFNLElBQUksTUFBTSxNQUFNLENBQUMsRUFBRSxLQUFLLE9BQU8sQ0FBQztJQUN0QyxNQUFNLElBQUksTUFBTSxFQUFFO0lBQ2xCLElBQUksQ0FBQyxLQUFLLE9BQU8sRUFBRSxPQUFPLFdBQ3hCLE1BQU0sSUFBSSxNQUFNO0lBRWxCLE9BQU87QUFDVDtBQUVPLGVBQWUsU0FBUyxNQUFvQjtJQUNqRCxNQUFNLElBQUksTUFBTSxNQUFNLENBQUMsRUFBRSxLQUFLLEtBQUssQ0FBQyxFQUFFO1FBQ3BDLFFBQVE7UUFDUixTQUFTO1lBQUUsZ0JBQWdCO1FBQW1CO1FBQzlDLE1BQU0sS0FBSyxVQUFVO0lBQ3ZCO0lBQ0EsT0FBTyxFQUFFO0FBQ1g7QUFFTyxlQUFlLGVBQWUsTUFBYyxFQUFFLFVBQStCLENBQUMsQ0FBQztJQUNwRixNQUFNLElBQUksTUFBTSxNQUFNLENBQUMsRUFBRSxLQUFLLFFBQVEsQ0FBQyxFQUFFO1FBQ3ZDLFFBQVE7UUFDUixTQUFTO1lBQUUsZ0JBQWdCO1FBQW1CO1FBQzlDLE1BQU0sS0FBSyxVQUFVO1lBQUU7WUFBUTtRQUFRO0lBQ3pDO0lBQ0EsT0FBTyxFQUFFO0FBQ1g7QUFFTyxlQUFlLGNBQWMsU0FBUyxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFO0lBQ3BFLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssVUFBVSxDQUFDO0lBQ3JDLEVBQUUsYUFBYSxJQUFJLFVBQVU7SUFDN0IsRUFBRSxhQUFhLElBQUksU0FBUyxPQUFPO0lBQ25DLElBQUksR0FBRyxFQUFFLGFBQWEsSUFBSSxLQUFLO0lBQy9CLE1BQU0sSUFBSSxNQUFNLE1BQU0sRUFBRTtJQUN4QixPQUFPLEVBQUU7QUFDWDtBQUVPLGVBQWU7SUFDcEIsTUFBTSxJQUFJLE1BQU0sTUFBTSxDQUFDLEVBQUUsS0FBSyxRQUFRLENBQUM7SUFDdkMsT0FBTyxFQUFFO0FBQ1g7OztBQzNDQSxRQUFRLGlCQUFpQixTQUFVLENBQUM7SUFDbEMsT0FBTyxLQUFLLEVBQUUsYUFBYSxJQUFJO1FBQUMsU0FBUztJQUFDO0FBQzVDO0FBRUEsUUFBUSxvQkFBb0IsU0FBVSxDQUFDO0lBQ3JDLE9BQU8sZUFBZSxHQUFHLGNBQWM7UUFBQyxPQUFPO0lBQUk7QUFDckQ7QUFFQSxRQUFRLFlBQVksU0FBVSxNQUFNLEVBQUUsSUFBSTtJQUN4QyxPQUFPLEtBQUssUUFBUSxRQUFRLFNBQVUsR0FBRztRQUN2QyxJQUFJLFFBQVEsYUFBYSxRQUFRLGdCQUFnQixLQUFLLGVBQWUsTUFDbkU7UUFHRixPQUFPLGVBQWUsTUFBTSxLQUFLO1lBQy9CLFlBQVk7WUFDWixLQUFLO2dCQUNILE9BQU8sTUFBTSxDQUFDLElBQUk7WUFDcEI7UUFDRjtJQUNGO0lBRUEsT0FBTztBQUNUO0FBRUEsUUFBUSxTQUFTLFNBQVUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHO0lBQzVDLE9BQU8sZUFBZSxNQUFNLFVBQVU7UUFDcEMsWUFBWTtRQUNaLEtBQUs7SUFDUDtBQUNGOzs7OztBQzVCQSwwREFBZ0I7QUFBVCxTQUFTLHFCQUFxQixHQUFpQjtJQUNwRCxNQUFNLElBQUksQ0FBQyxFQUFFLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztJQUM5QixJQUFJLFFBQVE7SUFFWixJQUFJO1FBQUM7UUFBTTtRQUFRO1FBQU87UUFBYztRQUFZO1FBQVU7S0FBUSxDQUFDLEtBQUssQ0FBQyxJQUFNLEVBQUUsU0FBUyxLQUFLLFNBQVM7SUFDNUcsSUFBSSxBQUFDLENBQUEsSUFBSSxjQUFjLEVBQUUsQUFBRCxFQUFHLFNBQVMsR0FBRyxTQUFTO0lBQ2hELElBQUksQUFBQyxDQUFBLElBQUksUUFBUSxJQUFHLE1BQU8sTUFBTSxTQUFTO0lBQzFDLElBQUk7UUFBQztRQUFTO1FBQVE7UUFBUTtRQUFTO1FBQVk7UUFBUztRQUFTO0tBQWEsQ0FBQyxLQUFLLENBQUMsSUFBTSxFQUFFLFNBQVMsS0FBSyxTQUFTO0lBRXhILElBQUk7UUFBQztRQUFXO1FBQVU7UUFBTztRQUFZO1FBQWE7S0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFNLEVBQUUsU0FBUyxLQUFLLFNBQVM7SUFDM0csSUFBSSxBQUFDLENBQUEsSUFBSSxRQUFRLEVBQUMsRUFBRyxPQUFPLFNBQVMsSUFBSSxTQUFTO0lBRWxELE9BQU87QUFDVDs7Ozs7MERDVGE7QUFRYixxREFBc0I7QUFRdEIscURBQXNCO0FBaEJmLE1BQU0sdUJBQW9DO0lBQy9DLFlBQVk7SUFDWixhQUFhO0lBQ2IsYUFBYTtBQUNmO0FBRUEsTUFBTSxNQUFNO0FBRUwsZUFBZTtJQUNwQixNQUFNLE9BQU8sTUFBTSxPQUFPLFFBQVEsS0FBSyxJQUFJO1FBQUM7S0FBSTtJQUNoRCxPQUFPO1FBQ0wsR0FBRyxvQkFBb0I7UUFDdkIsR0FBSSxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztJQUN2QjtBQUNGO0FBRU8sZUFBZSxnQkFBZ0IsUUFBcUI7SUFDekQsTUFBTSxPQUFPLFFBQVEsS0FBSyxJQUFJO1FBQUUsQ0FBQyxJQUFJLEVBQUU7SUFBUztBQUNsRCIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzLy5wbnBtL0BwbGFzbW9ocStwYXJjZWwtcnVudGltZUAwLjI1LjIvbm9kZV9tb2R1bGVzL0BwbGFzbW9ocS9wYXJjZWwtcnVudGltZS9kaXN0L3J1bnRpbWUtNmI5NGRkNTgzZjAxMzlhOS5qcyIsImNvbnRlbnRzL3gudHMiLCJsaWIvYXBpL2xvY2FsUmVjZWl2ZXIudHMiLCJub2RlX21vZHVsZXMvLnBucG0vQHBhcmNlbCt0cmFuc2Zvcm1lci1qc0AyLjkuM19AcGFyY2VsK2NvcmVAMi45LjMvbm9kZV9tb2R1bGVzL0BwYXJjZWwvdHJhbnNmb3JtZXItanMvc3JjL2VzbW9kdWxlLWhlbHBlcnMuanMiLCJsaWIvb3BzL3Njb3JpbmcudHMiLCJsaWIvb3BzL3NldHRpbmdzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBkPWdsb2JhbFRoaXMucHJvY2Vzcz8uYXJndnx8W107dmFyIHk9KCk9Pmdsb2JhbFRoaXMucHJvY2Vzcz8uZW52fHx7fTt2YXIgSD1uZXcgU2V0KGQpLF89ZT0+SC5oYXMoZSksRz1kLmZpbHRlcihlPT5lLnN0YXJ0c1dpdGgoXCItLVwiKSYmZS5pbmNsdWRlcyhcIj1cIikpLm1hcChlPT5lLnNwbGl0KFwiPVwiKSkucmVkdWNlKChlLFt0LG9dKT0+KGVbdF09byxlKSx7fSk7dmFyIFo9XyhcIi0tZHJ5LXJ1blwiKSxwPSgpPT5fKFwiLS12ZXJib3NlXCIpfHx5KCkuVkVSQk9TRT09PVwidHJ1ZVwiLHE9cCgpO3ZhciB1PShlPVwiXCIsLi4udCk9PmNvbnNvbGUubG9nKGUucGFkRW5kKDkpLFwifFwiLC4uLnQpO3ZhciB4PSguLi5lKT0+Y29uc29sZS5lcnJvcihcIlxcdXsxRjUzNH0gRVJST1JcIi5wYWRFbmQoOSksXCJ8XCIsLi4uZSksdj0oLi4uZSk9PnUoXCJcXHV7MUY1MzV9IElORk9cIiwuLi5lKSxtPSguLi5lKT0+dShcIlxcdXsxRjdFMH0gV0FSTlwiLC4uLmUpLFM9MCxjPSguLi5lKT0+cCgpJiZ1KGBcXHV7MUY3RTF9ICR7UysrfWAsLi4uZSk7dmFyIG49e1wiaXNDb250ZW50U2NyaXB0XCI6dHJ1ZSxcImlzQmFja2dyb3VuZFwiOmZhbHNlLFwiaXNSZWFjdFwiOmZhbHNlLFwicnVudGltZXNcIjpbXCJzY3JpcHQtcnVudGltZVwiXSxcImhvc3RcIjpcImxvY2FsaG9zdFwiLFwicG9ydFwiOjE4MTUsXCJlbnRyeUZpbGVQYXRoXCI6XCIvVXNlcnMvYXJsby8ub3BlbmNsYXcvd29ya3NwYWNlL3gtY2xpcHBlci1tdnAvcGxhc21vLWFwcC9jb250ZW50cy94LnRzXCIsXCJidW5kbGVJZFwiOlwiYzhiYTI2ODAyN2E2ZDZhNlwiLFwiZW52SGFzaFwiOlwiZTc5MmZiYmRhYTc4ZWU4NFwiLFwidmVyYm9zZVwiOlwiZmFsc2VcIixcInNlY3VyZVwiOmZhbHNlLFwic2VydmVyUG9ydFwiOjUxMDg2fTttb2R1bGUuYnVuZGxlLkhNUl9CVU5ETEVfSUQ9bi5idW5kbGVJZDtnbG9iYWxUaGlzLnByb2Nlc3M9e2FyZ3Y6W10sZW52OntWRVJCT1NFOm4udmVyYm9zZX19O3ZhciBEPW1vZHVsZS5idW5kbGUuTW9kdWxlO2Z1bmN0aW9uIEkoZSl7RC5jYWxsKHRoaXMsZSksdGhpcy5ob3Q9e2RhdGE6bW9kdWxlLmJ1bmRsZS5ob3REYXRhW2VdLF9hY2NlcHRDYWxsYmFja3M6W10sX2Rpc3Bvc2VDYWxsYmFja3M6W10sYWNjZXB0OmZ1bmN0aW9uKHQpe3RoaXMuX2FjY2VwdENhbGxiYWNrcy5wdXNoKHR8fGZ1bmN0aW9uKCl7fSl9LGRpc3Bvc2U6ZnVuY3Rpb24odCl7dGhpcy5fZGlzcG9zZUNhbGxiYWNrcy5wdXNoKHQpfX0sbW9kdWxlLmJ1bmRsZS5ob3REYXRhW2VdPXZvaWQgMH1tb2R1bGUuYnVuZGxlLk1vZHVsZT1JO21vZHVsZS5idW5kbGUuaG90RGF0YT17fTt2YXIgbD1nbG9iYWxUaGlzLmJyb3dzZXJ8fGdsb2JhbFRoaXMuY2hyb21lfHxudWxsO2Z1bmN0aW9uIGIoKXtyZXR1cm4hbi5ob3N0fHxuLmhvc3Q9PT1cIjAuMC4wLjBcIj9cImxvY2FsaG9zdFwiOm4uaG9zdH1mdW5jdGlvbiBDKCl7cmV0dXJuIG4ucG9ydHx8bG9jYXRpb24ucG9ydH12YXIgRT1cIl9fcGxhc21vX3J1bnRpbWVfc2NyaXB0X1wiO2Z1bmN0aW9uIEwoZSx0KXtsZXR7bW9kdWxlczpvfT1lO3JldHVybiBvPyEhb1t0XTohMX1mdW5jdGlvbiBPKGU9QygpKXtsZXQgdD1iKCk7cmV0dXJuYCR7bi5zZWN1cmV8fGxvY2F0aW9uLnByb3RvY29sPT09XCJodHRwczpcIiYmIS9sb2NhbGhvc3R8MTI3LjAuMC4xfDAuMC4wLjAvLnRlc3QodCk/XCJ3c3NcIjpcIndzXCJ9Oi8vJHt0fToke2V9L2B9ZnVuY3Rpb24gQihlKXt0eXBlb2YgZS5tZXNzYWdlPT1cInN0cmluZ1wiJiZ4KFwiW3BsYXNtby9wYXJjZWwtcnVudGltZV06IFwiK2UubWVzc2FnZSl9ZnVuY3Rpb24gUChlKXtpZih0eXBlb2YgZ2xvYmFsVGhpcy5XZWJTb2NrZXQ+XCJ1XCIpcmV0dXJuO2xldCB0PW5ldyBXZWJTb2NrZXQoTygpKTtyZXR1cm4gdC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLGFzeW5jIGZ1bmN0aW9uKG8pe2xldCByPUpTT04ucGFyc2Uoby5kYXRhKTtpZihyLnR5cGU9PT1cInVwZGF0ZVwiJiZhd2FpdCBlKHIuYXNzZXRzKSxyLnR5cGU9PT1cImVycm9yXCIpZm9yKGxldCBhIG9mIHIuZGlhZ25vc3RpY3MuYW5zaSl7bGV0IHc9YS5jb2RlZnJhbWV8fGEuc3RhY2s7bShcIltwbGFzbW8vcGFyY2VsLXJ1bnRpbWVdOiBcIithLm1lc3NhZ2UrYFxuYCt3K2BcblxuYCthLmhpbnRzLmpvaW4oYFxuYCkpfX0pLHQuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsQiksdC5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCgpPT57dihgW3BsYXNtby9wYXJjZWwtcnVudGltZV06IENvbm5lY3RlZCB0byBITVIgc2VydmVyIGZvciAke24uZW50cnlGaWxlUGF0aH1gKX0pLHQuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsKCk9PnttKGBbcGxhc21vL3BhcmNlbC1ydW50aW1lXTogQ29ubmVjdGlvbiB0byB0aGUgSE1SIHNlcnZlciBpcyBjbG9zZWQgZm9yICR7bi5lbnRyeUZpbGVQYXRofWApfSksdH12YXIgcz1cIl9fcGxhc21vLWxvYWRpbmdfX1wiO2Z1bmN0aW9uICQoKXtsZXQgZT1nbG9iYWxUaGlzLndpbmRvdz8udHJ1c3RlZFR5cGVzO2lmKHR5cGVvZiBlPlwidVwiKXJldHVybjtsZXQgdD1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCJ0cnVzdGVkLXR5cGVzXCJdJyk/LmNvbnRlbnQ/LnNwbGl0KFwiIFwiKSxvPXQ/dFt0Py5sZW5ndGgtMV0ucmVwbGFjZSgvOy9nLFwiXCIpOnZvaWQgMDtyZXR1cm4gdHlwZW9mIGU8XCJ1XCI/ZS5jcmVhdGVQb2xpY3kob3x8YHRydXN0ZWQtaHRtbC0ke3N9YCx7Y3JlYXRlSFRNTDphPT5hfSk6dm9pZCAwfXZhciBUPSQoKTtmdW5jdGlvbiBnKCl7cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHMpfWZ1bmN0aW9uIGYoKXtyZXR1cm4hZygpfWZ1bmN0aW9uIEYoKXtsZXQgZT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2UuaWQ9cztsZXQgdD1gXG4gIDxzdHlsZT5cbiAgICAjJHtzfSB7XG4gICAgICBiYWNrZ3JvdW5kOiAjZjNmM2YzO1xuICAgICAgY29sb3I6ICMzMzM7XG4gICAgICBib3JkZXI6IDFweCBzb2xpZCAjMzMzO1xuICAgICAgYm94LXNoYWRvdzogIzMzMyA0LjdweCA0LjdweDtcbiAgICB9XG5cbiAgICAjJHtzfTpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kOiAjZTNlM2UzO1xuICAgICAgY29sb3I6ICM0NDQ7XG4gICAgfVxuXG4gICAgQGtleWZyYW1lcyBwbGFzbW8tbG9hZGluZy1hbmltYXRlLXN2Zy1maWxsIHtcbiAgICAgIDAlIHtcbiAgICAgICAgZmlsbDogdHJhbnNwYXJlbnQ7XG4gICAgICB9XG4gICAgXG4gICAgICAxMDAlIHtcbiAgICAgICAgZmlsbDogIzMzMztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAjJHtzfSAuc3ZnLWVsZW0tMSB7XG4gICAgICBhbmltYXRpb246IHBsYXNtby1sb2FkaW5nLWFuaW1hdGUtc3ZnLWZpbGwgMS40N3MgY3ViaWMtYmV6aWVyKDAuNDcsIDAsIDAuNzQ1LCAwLjcxNSkgMC44cyBib3RoIGluZmluaXRlO1xuICAgIH1cblxuICAgICMke3N9IC5zdmctZWxlbS0yIHtcbiAgICAgIGFuaW1hdGlvbjogcGxhc21vLWxvYWRpbmctYW5pbWF0ZS1zdmctZmlsbCAxLjQ3cyBjdWJpYy1iZXppZXIoMC40NywgMCwgMC43NDUsIDAuNzE1KSAwLjlzIGJvdGggaW5maW5pdGU7XG4gICAgfVxuICAgIFxuICAgICMke3N9IC5zdmctZWxlbS0zIHtcbiAgICAgIGFuaW1hdGlvbjogcGxhc21vLWxvYWRpbmctYW5pbWF0ZS1zdmctZmlsbCAxLjQ3cyBjdWJpYy1iZXppZXIoMC40NywgMCwgMC43NDUsIDAuNzE1KSAxcyBib3RoIGluZmluaXRlO1xuICAgIH1cblxuICAgICMke3N9IC5oaWRkZW4ge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG5cbiAgPC9zdHlsZT5cbiAgXG4gIDxzdmcgaGVpZ2h0PVwiMzJcIiB3aWR0aD1cIjMyXCIgdmlld0JveD1cIjAgMCAyNjQgMzU0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgPHBhdGggZD1cIk0xMzkuMjIxIDI4Mi4yNDNDMTU0LjI1MiAyODIuMjQzIDE2Ni45MDMgMjk0Ljg0OSAxNjEuMzM4IDMwOC44MTJDMTU5LjQ4OSAzMTMuNDU0IDE1Ny4xNSAzMTcuOTEzIDE1NC4zNDcgMzIyLjEwOUMxNDYuNDY0IDMzMy45MDkgMTM1LjI2IDM0My4xMDcgMTIyLjE1MSAzNDguNTM4QzEwOS4wNDMgMzUzLjk2OSA5NC42MTgyIDM1NS4zOSA4MC43MDIyIDM1Mi42MjFDNjYuNzg2MSAzNDkuODUyIDU0LjAwMzQgMzQzLjAxOCA0My45NzA1IDMzMi45ODNDMzMuOTM3NSAzMjIuOTQ3IDI3LjEwNSAzMTAuMTYyIDI0LjMzNjkgMjk2LjI0MkMyMS41Njg5IDI4Mi4zMjMgMjIuOTg5NSAyNjcuODk1IDI4LjQxOTMgMjU0Ljc4M0MzMy44NDkxIDI0MS42NzEgNDMuMDQ0MSAyMzAuNDY0IDU0Ljg0MTYgMjIyLjU3OUM1OS4wMzUzIDIxOS43NzcgNjMuNDkwOCAyMTcuNDM4IDY4LjEyOTUgMjE1LjU4OEM4Mi4wOTE1IDIxMC4wMjEgOTQuNjk3OCAyMjIuNjcxIDk0LjY5NzggMjM3LjcwM0w5NC42OTc4IDI1NS4wMjdDOTQuNjk3OCAyNzAuMDU4IDEwNi44ODMgMjgyLjI0MyAxMjEuOTE0IDI4Mi4yNDNIMTM5LjIyMVpcIiBmaWxsPVwiIzMzM1wiIGNsYXNzPVwic3ZnLWVsZW0tMVwiID48L3BhdGg+XG4gICAgPHBhdGggZD1cIk0xOTIuMjYxIDE0Mi4wMjhDMTkyLjI2MSAxMjYuOTk2IDIwNC44NjcgMTE0LjM0NiAyMTguODI5IDExOS45MTNDMjIzLjQ2OCAxMjEuNzYzIDIyNy45MjMgMTI0LjEwMiAyMzIuMTE3IDEyNi45MDRDMjQzLjkxNSAxMzQuNzg5IDI1My4xMSAxNDUuOTk2IDI1OC41MzkgMTU5LjEwOEMyNjMuOTY5IDE3Mi4yMiAyNjUuMzkgMTg2LjY0OCAyNjIuNjIyIDIwMC41NjdDMjU5Ljg1NCAyMTQuNDg3IDI1My4wMjEgMjI3LjI3MiAyNDIuOTg4IDIzNy4zMDhDMjMyLjk1NSAyNDcuMzQzIDIyMC4xNzMgMjU0LjE3NyAyMDYuMjU2IDI1Ni45NDZDMTkyLjM0IDI1OS43MTUgMTc3LjkxNiAyNTguMjk0IDE2NC44MDcgMjUyLjg2M0MxNTEuNjk5IDI0Ny40MzIgMTQwLjQ5NSAyMzguMjM0IDEzMi42MTIgMjI2LjQzNEMxMjkuODA4IDIyMi4yMzggMTI3LjQ3IDIxNy43NzkgMTI1LjYyIDIxMy4xMzdDMTIwLjA1NiAxOTkuMTc0IDEzMi43MDcgMTg2LjU2OCAxNDcuNzM4IDE4Ni41NjhMMTY1LjA0NCAxODYuNTY4QzE4MC4wNzYgMTg2LjU2OCAxOTIuMjYxIDE3NC4zODMgMTkyLjI2MSAxNTkuMzUyTDE5Mi4yNjEgMTQyLjAyOFpcIiBmaWxsPVwiIzMzM1wiIGNsYXNzPVwic3ZnLWVsZW0tMlwiID48L3BhdGg+XG4gICAgPHBhdGggZD1cIk05NS42NTIyIDE2NC4xMzVDOTUuNjUyMiAxNzkuMTY3IDgzLjIyNzkgMTkxLjcyNSA2OC44MDEzIDE4Ny41MDVDNTkuNTE0NSAxODQuNzg4IDUwLjY0MzIgMTgwLjY2MyA0Mi41MTA2IDE3NS4yMjdDMjYuNzgwNiAxNjQuNzE0IDE0LjUyMDYgMTQ5Ljc3MiA3LjI4MDg5IDEzMi4yODlDMC4wNDExODMgMTE0LjgwNyAtMS44NTMwNSA5NS41Njk3IDEuODM3NzIgNzcuMDEwNEM1LjUyODQ5IDU4LjQ1MTEgMTQuNjM4NSA0MS40MDMzIDI4LjAxNTcgMjguMDIyOEM0MS4zOTMgMTQuNjQyMyA1OC40MzY2IDUuNTMwMDYgNzYuOTkxNCAxLjgzODM5Qzk1LjU0NjEgLTEuODUzMjkgMTE0Ljc3OSAwLjA0MTQxNjIgMTMyLjI1NyA3LjI4MjlDMTQ5LjczNSAxNC41MjQ0IDE2NC42NzQgMjYuNzg3NCAxNzUuMTg0IDQyLjUyMTJDMTgwLjYyIDUwLjY1NzYgMTg0Ljc0NCA1OS41MzMyIDE4Ny40NiA2OC44MjQ1QzE5MS42NzggODMuMjUxOSAxNzkuMTE5IDk1LjY3NTkgMTY0LjA4OCA5NS42NzU5TDEyMi44NjkgOTUuNjc1OUMxMDcuODM3IDk1LjY3NTkgOTUuNjUyMiAxMDcuODYxIDk1LjY1MjIgMTIyLjg5Mkw5NS42NTIyIDE2NC4xMzVaXCIgZmlsbD1cIiMzMzNcIiBjbGFzcz1cInN2Zy1lbGVtLTNcIj48L3BhdGg+XG4gIDwvc3ZnPlxuICA8c3BhbiBjbGFzcz1cImhpZGRlblwiPkNvbnRleHQgSW52YWxpZGF0ZWQsIFByZXNzIHRvIFJlbG9hZDwvc3Bhbj5cbiAgYDtyZXR1cm4gZS5pbm5lckhUTUw9VD9ULmNyZWF0ZUhUTUwodCk6dCxlLnN0eWxlLnBvaW50ZXJFdmVudHM9XCJub25lXCIsZS5zdHlsZS5wb3NpdGlvbj1cImZpeGVkXCIsZS5zdHlsZS5ib3R0b209XCIxNC43cHhcIixlLnN0eWxlLnJpZ2h0PVwiMTQuN3B4XCIsZS5zdHlsZS5mb250RmFtaWx5PVwic2Fucy1zZXJpZlwiLGUuc3R5bGUuZGlzcGxheT1cImZsZXhcIixlLnN0eWxlLmp1c3RpZnlDb250ZW50PVwiY2VudGVyXCIsZS5zdHlsZS5hbGlnbkl0ZW1zPVwiY2VudGVyXCIsZS5zdHlsZS5wYWRkaW5nPVwiMTQuN3B4XCIsZS5zdHlsZS5nYXA9XCIxNC43cHhcIixlLnN0eWxlLmJvcmRlclJhZGl1cz1cIjQuN3B4XCIsZS5zdHlsZS56SW5kZXg9XCIyMTQ3NDgzNjQ3XCIsZS5zdHlsZS5vcGFjaXR5PVwiMFwiLGUuc3R5bGUudHJhbnNpdGlvbj1cImFsbCAwLjQ3cyBlYXNlLWluLW91dFwiLGV9ZnVuY3Rpb24gTihlKXtyZXR1cm4gbmV3IFByb21pc2UodD0+e2RvY3VtZW50LmRvY3VtZW50RWxlbWVudD8oZigpJiYoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKGUpLHQoKSksdCgpKTpnbG9iYWxUaGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsKCk9PntmKCkmJmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChlKSx0KCl9KX0pfXZhciBrPSgpPT57bGV0IGU7aWYoZigpKXtsZXQgdD1GKCk7ZT1OKHQpfXJldHVybntzaG93OmFzeW5jKHtyZWxvYWRCdXR0b246dD0hMX09e30pPT57YXdhaXQgZTtsZXQgbz1nKCk7by5zdHlsZS5vcGFjaXR5PVwiMVwiLHQmJihvLm9uY2xpY2s9cj0+e3Iuc3RvcFByb3BhZ2F0aW9uKCksZ2xvYmFsVGhpcy5sb2NhdGlvbi5yZWxvYWQoKX0sby5xdWVyeVNlbGVjdG9yKFwic3BhblwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpLG8uc3R5bGUuY3Vyc29yPVwicG9pbnRlclwiLG8uc3R5bGUucG9pbnRlckV2ZW50cz1cImFsbFwiKX0saGlkZTphc3luYygpPT57YXdhaXQgZTtsZXQgdD1nKCk7dC5zdHlsZS5vcGFjaXR5PVwiMFwifX19O3ZhciBXPWAke0V9JHttb2R1bGUuaWR9X19gLGksQT0hMSxNPWsoKTthc3luYyBmdW5jdGlvbiBoKCl7YyhcIlNjcmlwdCBSdW50aW1lIC0gcmVsb2FkaW5nXCIpLEE/Z2xvYmFsVGhpcy5sb2NhdGlvbj8ucmVsb2FkPy4oKTpNLnNob3coe3JlbG9hZEJ1dHRvbjohMH0pfWZ1bmN0aW9uIFIoKXtpPy5kaXNjb25uZWN0KCksaT1sPy5ydW50aW1lLmNvbm5lY3Qoe25hbWU6V30pLGkub25EaXNjb25uZWN0LmFkZExpc3RlbmVyKCgpPT57aCgpfSksaS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZT0+e2UuX19wbGFzbW9fY3NfcmVsb2FkX18mJmgoKSxlLl9fcGxhc21vX2NzX2FjdGl2ZV90YWJfXyYmKEE9ITApfSl9ZnVuY3Rpb24gaigpe2lmKGw/LnJ1bnRpbWUpdHJ5e1IoKSxzZXRJbnRlcnZhbChSLDI0ZTMpfWNhdGNoe3JldHVybn19aigpO1AoYXN5bmMgZT0+e2MoXCJTY3JpcHQgcnVudGltZSAtIG9uIHVwZGF0ZWQgYXNzZXRzXCIpLGUuZmlsdGVyKG89Pm8uZW52SGFzaD09PW4uZW52SGFzaCkuc29tZShvPT5MKG1vZHVsZS5idW5kbGUsby5pZCkpJiYoTS5zaG93KCksbD8ucnVudGltZT9pLnBvc3RNZXNzYWdlKHtfX3BsYXNtb19jc19jaGFuZ2VkX186ITB9KTpzZXRUaW1lb3V0KCgpPT57aCgpfSw0NzAwKSl9KTtcbiIsImltcG9ydCB0eXBlIHsgUGxhc21vQ1NDb25maWcgfSBmcm9tIFwicGxhc21vXCJcbmltcG9ydCB7IHNhdmVDbGlwLCBlbnF1ZXVlQ29tbWFuZCB9IGZyb20gXCJ+bGliL2FwaS9sb2NhbFJlY2VpdmVyXCJcbmltcG9ydCB7IGRlY2lkZUNhbmRpZGF0ZVNjb3JlIH0gZnJvbSBcIn5saWIvb3BzL3Njb3JpbmdcIlxuaW1wb3J0IHR5cGUgeyBNYXRlcmlhbEl0ZW0gfSBmcm9tIFwifmxpYi9tYXRlcmlhbHMvdHlwZXNcIlxuaW1wb3J0IHsgbG9hZE9wc1NldHRpbmdzIH0gZnJvbSBcIn5saWIvb3BzL3NldHRpbmdzXCJcblxuZXhwb3J0IGNvbnN0IGNvbmZpZzogUGxhc21vQ1NDb25maWcgPSB7XG4gIG1hdGNoZXM6IFtcImh0dHBzOi8veC5jb20vKlwiXSxcbiAgcnVuX2F0OiBcImRvY3VtZW50X2lkbGVcIlxufVxuXG5jb25zdCBDTElQU19LRVkgPSBcInhfY2xpcHNcIlxuXG5jb25zdCBzbGVlcCA9IChtczogbnVtYmVyKSA9PiBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBtcykpXG5cbmFzeW5jIGZ1bmN0aW9uIGdldENsaXBzKCk6IFByb21pc2U8TWF0ZXJpYWxJdGVtW10+IHtcbiAgY29uc3QgZGF0YSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbQ0xJUFNfS0VZXSlcbiAgcmV0dXJuIChkYXRhW0NMSVBTX0tFWV0gfHwgW10pIGFzIE1hdGVyaWFsSXRlbVtdXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNldENsaXBzKGl0ZW1zOiBNYXRlcmlhbEl0ZW1bXSkge1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBbQ0xJUFNfS0VZXTogaXRlbXMgfSlcbn1cblxuZnVuY3Rpb24gZXh0cmFjdEZyb21BcnRpY2xlKGFydGljbGU6IEhUTUxFbGVtZW50KTogTWF0ZXJpYWxJdGVtIHtcbiAgY29uc3QgdGV4dE5vZGUgPSBhcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRlc3RpZD1cInR3ZWV0VGV4dFwiXScpIGFzIEhUTUxFbGVtZW50IHwgbnVsbFxuICBjb25zdCB0ZXh0ID0gdGV4dE5vZGU/LmlubmVyVGV4dD8udHJpbSgpIHx8IFwiXCJcblxuICBjb25zdCBhdXRob3JMaW5rID0gYXJ0aWNsZS5xdWVyeVNlbGVjdG9yKCdhW2hyZWZePVwiL1wiXVtyb2xlPVwibGlua1wiXScpIGFzIEhUTUxBbmNob3JFbGVtZW50IHwgbnVsbFxuICBjb25zdCBhdXRob3IgPSBhdXRob3JMaW5rPy5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpPy5zcGxpdChcIi9cIik/LlsxXSB8fCBcIlwiXG5cbiAgY29uc3QgdHdlZXRMaW5rRWwgPSBbLi4uYXJ0aWNsZS5xdWVyeVNlbGVjdG9yQWxsKCdhW2hyZWYqPVwiL3N0YXR1cy9cIl0nKV0uZmluZCgoYSkgPT4ge1xuICAgIGNvbnN0IGggPSAoYSBhcyBIVE1MQW5jaG9yRWxlbWVudCkuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSB8fCBcIlwiXG4gICAgcmV0dXJuIGguaW5jbHVkZXMoXCIvc3RhdHVzL1wiKSAmJiAhaC5pbmNsdWRlcyhcIi9hbmFseXRpY3NcIikgJiYgIWguaW5jbHVkZXMoXCIvcGhvdG8vXCIpXG4gIH0pIGFzIEhUTUxBbmNob3JFbGVtZW50IHwgdW5kZWZpbmVkXG5cbiAgY29uc3QgdHdlZXRVcmwgPSB0d2VldExpbmtFbCA/IGBodHRwczovL3guY29tJHt0d2VldExpbmtFbC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpfWAgOiBcIlwiXG5cbiAgY29uc3QgaW1hZ2VVcmxzID0gWy4uLmFydGljbGUucXVlcnlTZWxlY3RvckFsbCgnaW1nW3NyYyo9XCJwYnMudHdpbWcuY29tL21lZGlhXCJdJyldXG4gICAgLm1hcCgoaW1nKSA9PiAoaW1nIGFzIEhUTUxJbWFnZUVsZW1lbnQpLnNyYy5yZXBsYWNlKC8mbmFtZT1cXHcrLywgXCImbmFtZT1vcmlnXCIpKVxuXG4gIGNvbnN0IHJvdzogTWF0ZXJpYWxJdGVtID0ge1xuICAgIGlkOiBjcnlwdG8ucmFuZG9tVVVJRCgpLFxuICAgIHNvdXJjZTogXCJ4XCIsXG4gICAgdHdlZXRfdXJsOiB0d2VldFVybCxcbiAgICBhdXRob3IsXG4gICAgdGV4dCxcbiAgICBpbWFnZV91cmxzOiBbLi4ubmV3IFNldChpbWFnZVVybHMpXSxcbiAgICB0YWdzOiBbXCJBSVwiXSxcbiAgICBsYW5nOiAvW1xcdTRlMDAtXFx1OWZmZl0vLnRlc3QodGV4dCkgPyBcInpoXCIgOiBcImVuXCIsXG4gICAgc3RhdHVzOiBcIm5ld1wiLFxuICAgIGNsaXBwZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICB9XG5cbiAgcm93LnNjb3JlID0gZGVjaWRlQ2FuZGlkYXRlU2NvcmUocm93KVxuICByZXR1cm4gcm93XG59XG5cbmZ1bmN0aW9uIHRvYXN0KHRleHQ6IHN0cmluZykge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgZWwudGV4dENvbnRlbnQgPSB0ZXh0XG4gIE9iamVjdC5hc3NpZ24oZWwuc3R5bGUsIHtcbiAgICBwb3NpdGlvbjogXCJmaXhlZFwiLFxuICAgIHJpZ2h0OiBcIjI0cHhcIixcbiAgICBib3R0b206IFwiMTIwcHhcIixcbiAgICB6SW5kZXg6IFwiMjE0NzQ4MzY0N1wiLFxuICAgIGJhY2tncm91bmQ6IFwicmdiYSgwLDAsMCwwLjgyKVwiLFxuICAgIGNvbG9yOiBcIiNmZmZcIixcbiAgICBwYWRkaW5nOiBcIjhweCAxMnB4XCIsXG4gICAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcbiAgICBmb250U2l6ZTogXCIxMnB4XCJcbiAgfSlcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbClcbiAgc2V0VGltZW91dCgoKSA9PiBlbC5yZW1vdmUoKSwgMTgwMClcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2xpcFRvcCgpIHtcbiAgY29uc3QgYXJ0aWNsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJhcnRpY2xlXCIpIGFzIEhUTUxFbGVtZW50IHwgbnVsbFxuICBpZiAoIWFydGljbGUpIHJldHVybiB0b2FzdChcIuayoeaJvuWIsOW4luWtkFwiKVxuXG4gIGNvbnN0IHJvdyA9IGV4dHJhY3RGcm9tQXJ0aWNsZShhcnRpY2xlKVxuICBpZiAoIXJvdy50d2VldF91cmwpIHJldHVybiB0b2FzdChcIuacquivhuWIq+WIsOaOqOaWh+mTvuaOpVwiKVxuXG4gIGNvbnN0IGl0ZW1zID0gYXdhaXQgZ2V0Q2xpcHMoKVxuICBpdGVtcy51bnNoaWZ0KHJvdylcbiAgYXdhaXQgc2V0Q2xpcHMoaXRlbXMpXG4gIGF3YWl0IHNhdmVDbGlwKHJvdylcbiAgdG9hc3QoYOW3suWJquiXjyBAJHtyb3cuYXV0aG9yIHx8IFwidW5rbm93blwifWApXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJ1bk9wc1JvdW5kKCkge1xuICBjb25zdCBzID0gYXdhaXQgbG9hZE9wc1NldHRpbmdzKClcbiAgY29uc3QgcnMgPSBhd2FpdCBlbnF1ZXVlQ29tbWFuZChcIm9wc19yb3VuZFwiLCB7XG4gICAgdG90YWw6IHMucm91bmRUb3RhbCxcbiAgICBtaW5EZWxheVNlYzogcy5taW5EZWxheVNlYyxcbiAgICBtYXhEZWxheVNlYzogcy5tYXhEZWxheVNlY1xuICB9KVxuICB0b2FzdChg5bey5LiL5Y+R6L+Q6JCl5Lu75YqhICMke3JzPy5xdWV1ZWQ/LmlkIHx8IFwiP1wife+8iCR7cy5yb3VuZFRvdGFsfeadoe+8iWApXG59XG5cbmZ1bmN0aW9uIHBpY2tEcmFmdE1hdGVyaWFsKGl0ZW1zOiBNYXRlcmlhbEl0ZW1bXSkge1xuICBjb25zdCBzaG9ydGxpc3RlZCA9IGl0ZW1zLmZpbHRlcigoeCkgPT4gKHguc3RhdHVzIHx8IFwibmV3XCIpID09PSBcInNob3J0bGlzdGVkXCIpXG4gIGNvbnN0IHBvb2wgPSBzaG9ydGxpc3RlZC5sZW5ndGggPyBzaG9ydGxpc3RlZCA6IGl0ZW1zXG4gIGlmICghcG9vbC5sZW5ndGgpIHJldHVybiBudWxsXG4gIHJldHVybiBwb29sLnNsaWNlKCkuc29ydCgoYSwgYikgPT4gKGIuc2NvcmUgfHwgMCkgLSAoYS5zY29yZSB8fCAwKSlbMF1cbn1cblxuZnVuY3Rpb24gZHJhZnRUZXh0RnJvbU1hdGVyaWFsKG06IE1hdGVyaWFsSXRlbSkge1xuICBjb25zdCBjb3JlID0gKG0udGV4dCB8fCBcIlwiKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCkuc2xpY2UoMCwgMTYwKVxuICByZXR1cm4gYFNpZ25hbCBmcm9tIG15IEFJIGZlZWQgdG9kYXk6XFxuJHtjb3JlfVxcblxcblByYWN0aWNhbCB3b3JrZmxvd3MgPiBoeXBlLlxcblxcblNvdXJjZSBpbnNwbzogJHttLnR3ZWV0X3VybH1cXG4jQUkgI0FJR0MgI0J1aWxkSW5QdWJsaWNgXG59XG5cbmZ1bmN0aW9uIGdldENvbXBvc2VyQm94KCkge1xuICByZXR1cm4gKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRlc3RpZD1cInR3ZWV0VGV4dGFyZWFfMFwiXSBbY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiXScpIHx8XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2W2NvbnRlbnRlZGl0YWJsZT1cInRydWVcIl1bcm9sZT1cInRleHRib3hcIl0nKSkgYXMgSFRNTEVsZW1lbnQgfCBudWxsXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHR5cGVTbG93KGJveDogSFRNTEVsZW1lbnQsIHRleHQ6IHN0cmluZykge1xuICBib3guZm9jdXMoKVxuICBkb2N1bWVudC5leGVjQ29tbWFuZChcInNlbGVjdEFsbFwiLCBmYWxzZSlcbiAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoXCJkZWxldGVcIiwgZmFsc2UpXG4gIGZvciAoY29uc3QgY2ggb2YgdGV4dCkge1xuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKFwiaW5zZXJ0VGV4dFwiLCBmYWxzZSwgY2gpXG4gICAgYXdhaXQgc2xlZXAoMjgpXG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZmlsbERyYWZ0Tm93KCkge1xuICBjb25zdCBpdGVtcyA9IGF3YWl0IGdldENsaXBzKClcbiAgY29uc3QgbWF0ZXJpYWwgPSBwaWNrRHJhZnRNYXRlcmlhbChpdGVtcylcbiAgaWYgKCFtYXRlcmlhbCkgcmV0dXJuIHRvYXN0KFwi5rKh5pyJ5Y+v55So57Sg5p2Q77yM6K+35YWI5Ymq6JePXCIpXG5cbiAgaWYgKCFsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiL2NvbXBvc2UvcG9zdFwiKSkge1xuICAgIGxvY2F0aW9uLmhyZWYgPSBcImh0dHBzOi8veC5jb20vY29tcG9zZS9wb3N0XCJcbiAgICBhd2FpdCBzbGVlcCgxMjAwKVxuICB9XG5cbiAgbGV0IGJveDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbFxuICBmb3IgKGxldCBpID0gMDsgaSA8IDMwOyBpKyspIHtcbiAgICBib3ggPSBnZXRDb21wb3NlckJveCgpXG4gICAgaWYgKGJveCkgYnJlYWtcbiAgICBhd2FpdCBzbGVlcCgyNTApXG4gIH1cbiAgaWYgKCFib3gpIHJldHVybiB0b2FzdChcIuacquaJvuWIsOWPkeW4lui+k+WFpeahhlwiKVxuXG4gIGF3YWl0IHR5cGVTbG93KGJveCwgZHJhZnRUZXh0RnJvbU1hdGVyaWFsKG1hdGVyaWFsKSlcbiAgdG9hc3QoXCLojYnnqL/lt7LloavlhYXvvIjmnKroh6rliqjlj5HluIPvvIlcIilcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2hvd0NsaXBMaXN0KCkge1xuICBjb25zdCBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIngtb3BzLXN0dWRpby1saXN0XCIpXG4gIGlmIChvbGQpIG9sZC5yZW1vdmUoKVxuXG4gIGNvbnN0IGl0ZW1zID0gKGF3YWl0IGdldENsaXBzKCkpLnNsaWNlKDAsIDIwKVxuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgbW9kYWwuaWQgPSBcIngtb3BzLXN0dWRpby1saXN0XCJcbiAgT2JqZWN0LmFzc2lnbihtb2RhbC5zdHlsZSwge1xuICAgIHBvc2l0aW9uOiBcImZpeGVkXCIsXG4gICAgcmlnaHQ6IFwiMjBweFwiLFxuICAgIGJvdHRvbTogXCIxNTBweFwiLFxuICAgIHdpZHRoOiBcIjM4MHB4XCIsXG4gICAgbWF4SGVpZ2h0OiBcIjYwdmhcIixcbiAgICBvdmVyZmxvdzogXCJhdXRvXCIsXG4gICAgYmFja2dyb3VuZDogXCIjMGYxNDE5XCIsXG4gICAgYm9yZGVyOiBcIjFweCBzb2xpZCAjMmYzMzM2XCIsXG4gICAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcbiAgICBwYWRkaW5nOiBcIjEwcHhcIixcbiAgICB6SW5kZXg6IFwiMjE0NzQ4MzY0N1wiLFxuICAgIGNvbG9yOiBcIiNlN2U5ZWFcIixcbiAgICBmb250U2l6ZTogXCIxMnB4XCJcbiAgfSlcblxuICBjb25zdCBoZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICBoZWFkLmlubmVySFRNTCA9IGA8Yj7ntKDmnZDliJfooag8L2I+77yI5pyA6L+RICR7aXRlbXMubGVuZ3RofSDmnaHvvIlgXG4gIG1vZGFsLmFwcGVuZENoaWxkKGhlYWQpXG5cbiAgZm9yIChjb25zdCBtIG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICBpdGVtLnN0eWxlLmJvcmRlclRvcCA9IFwiMXB4IHNvbGlkICMyZjMzMzZcIlxuICAgIGl0ZW0uc3R5bGUucGFkZGluZyA9IFwiOHB4IDBcIlxuXG4gICAgY29uc3QgdG9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgIHRvcC5pbm5lckhUTUwgPSBgQCR7bS5hdXRob3IgfHwgXCJ1bmtub3duXCJ9IMK3ICR7bS5pbWFnZV91cmxzPy5sZW5ndGggfHwgMH3lm74gwrcgc2NvcmUgJHttLnNjb3JlIHx8IDB9YFxuXG4gICAgY29uc3QgdHh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgIHR4dC50ZXh0Q29udGVudCA9IChtLnRleHQgfHwgXCJcIikuc2xpY2UoMCwgODApXG4gICAgdHh0LnN0eWxlLm9wYWNpdHkgPSBcIjAuODVcIlxuXG4gICAgaWYgKG0uaW1hZ2VfdXJscz8uWzBdKSB7XG4gICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpXG4gICAgICBpbWcuc3JjID0gbS5pbWFnZV91cmxzWzBdXG4gICAgICBPYmplY3QuYXNzaWduKGltZy5zdHlsZSwge1xuICAgICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgIG1heEhlaWdodDogXCIxMjBweFwiLFxuICAgICAgICBvYmplY3RGaXQ6IFwiY292ZXJcIixcbiAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjhweFwiLFxuICAgICAgICBtYXJnaW5Ub3A6IFwiNnB4XCJcbiAgICAgIH0pXG4gICAgICBpdGVtLmFwcGVuZENoaWxkKGltZylcbiAgICB9XG5cbiAgICBpdGVtLmFwcGVuZENoaWxkKHRvcClcbiAgICBpdGVtLmFwcGVuZENoaWxkKHR4dClcbiAgICBtb2RhbC5hcHBlbmRDaGlsZChpdGVtKVxuICB9XG5cbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2RhbClcbn1cblxuZnVuY3Rpb24gbW91bnRGYWIoKSB7XG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIngtb3BzLXN0dWRpby1mYWJcIikpIHJldHVyblxuXG4gIGNvbnN0IGZhYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIilcbiAgZmFiLmlkID0gXCJ4LW9wcy1zdHVkaW8tZmFiXCJcbiAgZmFiLnRleHRDb250ZW50ID0gXCLimpnvuI9cIlxuICBPYmplY3QuYXNzaWduKGZhYi5zdHlsZSwge1xuICAgIHBvc2l0aW9uOiBcImZpeGVkXCIsXG4gICAgcmlnaHQ6IFwiMjBweFwiLFxuICAgIGJvdHRvbTogXCIyNHB4XCIsXG4gICAgd2lkdGg6IFwiNTJweFwiLFxuICAgIGhlaWdodDogXCI1MnB4XCIsXG4gICAgYm9yZGVyUmFkaXVzOiBcIjUwJVwiLFxuICAgIGJvcmRlcjogXCJub25lXCIsXG4gICAgYmFja2dyb3VuZDogXCIjMWQ5YmYwXCIsXG4gICAgY29sb3I6IFwiI2ZmZlwiLFxuICAgIGZvbnRTaXplOiBcIjI0cHhcIixcbiAgICB6SW5kZXg6IFwiMjE0NzQ4MzY0N1wiLFxuICAgIGN1cnNvcjogXCJwb2ludGVyXCJcbiAgfSlcblxuICBjb25zdCBwYW5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgcGFuZWwuaGlkZGVuID0gdHJ1ZVxuICBPYmplY3QuYXNzaWduKHBhbmVsLnN0eWxlLCB7XG4gICAgcG9zaXRpb246IFwiZml4ZWRcIixcbiAgICByaWdodDogXCIyMHB4XCIsXG4gICAgYm90dG9tOiBcIjg0cHhcIixcbiAgICB6SW5kZXg6IFwiMjE0NzQ4MzY0N1wiLFxuICAgIGJhY2tncm91bmQ6IFwiIzBmMTQxOVwiLFxuICAgIGJvcmRlcjogXCIxcHggc29saWQgIzJmMzMzNlwiLFxuICAgIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXG4gICAgcGFkZGluZzogXCI4cHhcIixcbiAgICB3aWR0aDogXCIyMTBweFwiXG4gIH0pXG5cbiAgY29uc3QgbWtCdG4gPSAodHh0OiBzdHJpbmcsIG9uQ2xpY2s6ICgpID0+IHZvaWQpID0+IHtcbiAgICBjb25zdCBiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKVxuICAgIGIudGV4dENvbnRlbnQgPSB0eHRcbiAgICBPYmplY3QuYXNzaWduKGIuc3R5bGUsIHtcbiAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgIG1hcmdpblRvcDogXCI2cHhcIixcbiAgICAgIGJvcmRlcjogXCJub25lXCIsXG4gICAgICBib3JkZXJSYWRpdXM6IFwiOHB4XCIsXG4gICAgICBwYWRkaW5nOiBcIjhweCAxMHB4XCIsXG4gICAgICBiYWNrZ3JvdW5kOiBcIiMxZDliZjBcIixcbiAgICAgIGNvbG9yOiBcIiNmZmZcIixcbiAgICAgIGZvbnRTaXplOiBcIjEycHhcIixcbiAgICAgIGN1cnNvcjogXCJwb2ludGVyXCJcbiAgICB9KVxuICAgIGIub25jbGljayA9IG9uQ2xpY2tcbiAgICByZXR1cm4gYlxuICB9XG5cbiAgcGFuZWwuYXBwZW5kQ2hpbGQobWtCdG4oXCLlv6vpgJ/liarol4/pppbmnaFcIiwgKCkgPT4gdm9pZCBjbGlwVG9wKCkpKVxuICBwYW5lbC5hcHBlbmRDaGlsZChta0J0bihcIuafpeeci+e0oOadkOWIl+ihqFwiLCAoKSA9PiB2b2lkIHNob3dDbGlwTGlzdCgpKSlcbiAgcGFuZWwuYXBwZW5kQ2hpbGQobWtCdG4oXCLnlJ/miJDlj5HluJbojYnnqL9cIiwgKCkgPT4gdm9pZCBmaWxsRHJhZnROb3coKSkpXG4gIHBhbmVsLmFwcGVuZENoaWxkKG1rQnRuKFwi6L+Q6JCl5LiA6L2uKDEw5p2hKVwiLCAoKSA9PiB2b2lkIHJ1bk9wc1JvdW5kKCkpKVxuXG4gIGZhYi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiAocGFuZWwuaGlkZGVuID0gZmFsc2UpKVxuICBwYW5lbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiAocGFuZWwuaGlkZGVuID0gZmFsc2UpKVxuICBmYWIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IHNsZWVwKDEwMClcbiAgICBpZiAoIXBhbmVsLm1hdGNoZXMoXCI6aG92ZXJcIikgJiYgIWZhYi5tYXRjaGVzKFwiOmhvdmVyXCIpKSBwYW5lbC5oaWRkZW4gPSB0cnVlXG4gIH0pXG4gIHBhbmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsIGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBzbGVlcCgxMDApXG4gICAgaWYgKCFwYW5lbC5tYXRjaGVzKFwiOmhvdmVyXCIpICYmICFmYWIubWF0Y2hlcyhcIjpob3ZlclwiKSkgcGFuZWwuaGlkZGVuID0gdHJ1ZVxuICB9KVxuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocGFuZWwpXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZmFiKVxufVxuXG5tb3VudEZhYigpXG4iLCJpbXBvcnQgdHlwZSB7IE1hdGVyaWFsSXRlbSB9IGZyb20gXCJ+bGliL21hdGVyaWFscy90eXBlc1wiXG5cbmNvbnN0IEJBU0UgPSBcImh0dHA6Ly8xMjcuMC4wLjE6ODc2NVwiXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoZWFsdGhjaGVjaygpIHtcbiAgY29uc3QgciA9IGF3YWl0IGZldGNoKGAke0JBU0V9L2hlYWx0aGApXG4gIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKVxuICBpZiAoIWogfHwgdHlwZW9mIGoub2sgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBoZWFsdGggcmVzcG9uc2VcIilcbiAgfVxuICByZXR1cm4gaiBhcyB7IG9rOiBib29sZWFuIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVDbGlwKHJlY29yZDogTWF0ZXJpYWxJdGVtKSB7XG4gIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChgJHtCQVNFfS9jbGlwYCwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHJlY29yZClcbiAgfSlcbiAgcmV0dXJuIHIuanNvbigpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlbnF1ZXVlQ29tbWFuZChhY3Rpb246IHN0cmluZywgcGF5bG9hZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9KSB7XG4gIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChgJHtCQVNFfS9jb21tYW5kYCwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgYWN0aW9uLCBwYXlsb2FkIH0pXG4gIH0pXG4gIHJldHVybiByLmpzb24oKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbGlzdE1hdGVyaWFscyhzdGF0dXMgPSBcImFsbFwiLCBsaW1pdCA9IDIwLCBxID0gXCJcIikge1xuICBjb25zdCB1ID0gbmV3IFVSTChgJHtCQVNFfS9tYXRlcmlhbHNgKVxuICB1LnNlYXJjaFBhcmFtcy5zZXQoXCJzdGF0dXNcIiwgc3RhdHVzKVxuICB1LnNlYXJjaFBhcmFtcy5zZXQoXCJsaW1pdFwiLCBTdHJpbmcobGltaXQpKVxuICBpZiAocSkgdS5zZWFyY2hQYXJhbXMuc2V0KFwicVwiLCBxKVxuICBjb25zdCByID0gYXdhaXQgZmV0Y2godS50b1N0cmluZygpKVxuICByZXR1cm4gci5qc29uKClcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxpc3RSZXN1bHRzKCkge1xuICBjb25zdCByID0gYXdhaXQgZmV0Y2goYCR7QkFTRX0vcmVzdWx0c2ApXG4gIHJldHVybiByLmpzb24oKVxufVxuIiwiZXhwb3J0cy5pbnRlcm9wRGVmYXVsdCA9IGZ1bmN0aW9uIChhKSB7XG4gIHJldHVybiBhICYmIGEuX19lc01vZHVsZSA/IGEgOiB7ZGVmYXVsdDogYX07XG59O1xuXG5leHBvcnRzLmRlZmluZUludGVyb3BGbGFnID0gZnVuY3Rpb24gKGEpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGEsICdfX2VzTW9kdWxlJywge3ZhbHVlOiB0cnVlfSk7XG59O1xuXG5leHBvcnRzLmV4cG9ydEFsbCA9IGZ1bmN0aW9uIChzb3VyY2UsIGRlc3QpIHtcbiAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoa2V5ID09PSAnZGVmYXVsdCcgfHwga2V5ID09PSAnX19lc01vZHVsZScgfHwgZGVzdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlc3QsIGtleSwge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gc291cmNlW2tleV07XG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gZGVzdDtcbn07XG5cbmV4cG9ydHMuZXhwb3J0ID0gZnVuY3Rpb24gKGRlc3QsIGRlc3ROYW1lLCBnZXQpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlc3QsIGRlc3ROYW1lLCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGdldCxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHR5cGUgeyBNYXRlcmlhbEl0ZW0gfSBmcm9tIFwifmxpYi9tYXRlcmlhbHMvdHlwZXNcIlxuXG5leHBvcnQgZnVuY3Rpb24gZGVjaWRlQ2FuZGlkYXRlU2NvcmUocm93OiBNYXRlcmlhbEl0ZW0pIHtcbiAgY29uc3QgdCA9IGAke3Jvdy50ZXh0IHx8IFwiXCJ9YC50b0xvd2VyQ2FzZSgpXG4gIGxldCBzY29yZSA9IDBcblxuICBpZiAoW1wiYWlcIiwgXCJhaWdjXCIsIFwibGxtXCIsIFwibWlkam91cm5leVwiLCBcIndvcmtmbG93XCIsIFwicHJvbXB0XCIsIFwibW9kZWxcIl0uc29tZSgoaykgPT4gdC5pbmNsdWRlcyhrKSkpIHNjb3JlICs9IDRcbiAgaWYgKChyb3cuaW1hZ2VfdXJscyB8fCBbXSkubGVuZ3RoID4gMCkgc2NvcmUgKz0gMlxuICBpZiAoKHJvdy5sYW5nIHx8IFwiZW5cIikgPT09IFwiZW5cIikgc2NvcmUgKz0gMVxuICBpZiAoW1wiYnVpbGRcIiwgXCJ0b29sXCIsIFwiZGVtb1wiLCBcImFnZW50XCIsIFwiZ2VuZXJhdGVcIiwgXCJpbWFnZVwiLCBcInZpZGVvXCIsIFwiYXV0b21hdGlvblwiXS5zb21lKChrKSA9PiB0LmluY2x1ZGVzKGspKSkgc2NvcmUgKz0gMVxuXG4gIGlmIChbXCJhaXJkcm9wXCIsIFwiY2FzaW5vXCIsIFwiYmV0XCIsIFwibmZ0IG1pbnRcIiwgXCJmb2xsb3cgbWVcIiwgXCJnaXZlYXdheVwiXS5zb21lKChrKSA9PiB0LmluY2x1ZGVzKGspKSkgc2NvcmUgLT0gNFxuICBpZiAoKHJvdy50ZXh0IHx8IFwiXCIpLnRyaW0oKS5sZW5ndGggPCAyMCkgc2NvcmUgLT0gMVxuXG4gIHJldHVybiBzY29yZVxufVxuIiwiZXhwb3J0IGludGVyZmFjZSBPcHNTZXR0aW5ncyB7XG4gIHJvdW5kVG90YWw6IG51bWJlclxuICBtaW5EZWxheVNlYzogbnVtYmVyXG4gIG1heERlbGF5U2VjOiBudW1iZXJcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1BTX1NFVFRJTkdTOiBPcHNTZXR0aW5ncyA9IHtcbiAgcm91bmRUb3RhbDogMTAsXG4gIG1pbkRlbGF5U2VjOiA0LFxuICBtYXhEZWxheVNlYzogMTJcbn1cblxuY29uc3QgS0VZID0gXCJ4X29wc19zZXR0aW5nc1wiXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkT3BzU2V0dGluZ3MoKTogUHJvbWlzZTxPcHNTZXR0aW5ncz4ge1xuICBjb25zdCBkYXRhID0gYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoW0tFWV0pXG4gIHJldHVybiB7XG4gICAgLi4uREVGQVVMVF9PUFNfU0VUVElOR1MsXG4gICAgLi4uKGRhdGE/LltLRVldIHx8IHt9KVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlT3BzU2V0dGluZ3Moc2V0dGluZ3M6IE9wc1NldHRpbmdzKSB7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgW0tFWV06IHNldHRpbmdzIH0pXG59XG4iXSwibmFtZXMiOltdLCJ2ZXJzaW9uIjozLCJmaWxlIjoieC4yN2E2ZDZhNi5qcy5tYXAifQ==
 globalThis.define=__define;  })(globalThis.define);
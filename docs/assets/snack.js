/* "여기서 결과 보기": open the code's Snack right inside the page (Expo embed, web preview).
   The button sits next to a.run, whose href already carries code, dependencies and SDK version. */
(function () {
  const btns = document.querySelectorAll(".snack-embed");
  if (!btns.length) return;
  let loading = null;
  const loadEmbed = () => loading || (loading = new Promise((ok, bad) => {
    const s = document.createElement("script");
    s.src = "https://snack.expo.dev/embed.js"; s.async = true;
    s.onload = ok; s.onerror = () => { loading = null; bad(); };
    document.head.appendChild(s);
  }));
  btns.forEach((b) => {
    b.addEventListener("click", async () => {
      const p = b.closest("p"), a = p && p.querySelector("a.run");
      if (!a) return;
      const open = p.nextElementSibling && p.nextElementSibling.classList.contains("snack-frame") ? p.nextElementSibling : null;
      if (open) { open.remove(); b.textContent = "👀 여기서 결과 보기"; return; }
      const q = new URL(a.href).searchParams;
      const box = document.createElement("div");
      box.className = "snack-frame";
      const d = document.createElement("div");
      d.dataset.snackCode = q.get("code") || "";
      if (q.get("dependencies")) d.dataset.snackDependencies = q.get("dependencies");
      d.dataset.snackName = q.get("name") || "study-hub";
      d.dataset.snackPlatform = "web";
      d.dataset.snackPreview = "true";
      d.dataset.snackSdkversion = q.get("sdkVersion") || "54.0.0";
      d.dataset.snackTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
      box.appendChild(d);
      p.after(box);
      b.textContent = "결과 닫기";
      try {
        await loadEmbed();
        if (window.ExpoSnack) {
          window.ExpoSnack.append(d);
          if (!box.querySelector("iframe")) window.ExpoSnack.initialize();
        }
      } catch (e) {
        box.innerHTML = '<p class="snack-err">Snack을 불러오지 못했어요. 위의 "Snack에서 바로 실행하기"로 열어 보세요.</p>';
      }
    });
  });
})();

/* ============================================================
   QUADRO A QUADRO — app.js
   Progresso de leitura fica só neste browser (localStorage),
   não há contas nem sincronização. As séries/capítulos vêm de
   data.js (SERIES), que é estático e editado à mão.
   ============================================================ */

(function () {
  "use strict";

  const LS_PROGRESS = "qq_progress";     // { [seriesId]: { [chapterId]: timestampMs } }
  const LS_SEEN = "qq_series_seen";      // { [seriesId]: timestampMs } — quando a série foi vista pela 1ª vez neste dispositivo

  /* ---------------- progress storage ---------------- */
  function loadProgress() {
    try {
      const raw = localStorage.getItem(LS_PROGRESS);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveProgress() {
    localStorage.setItem(LS_PROGRESS, JSON.stringify(state.progress));
  }

  function bucketFor(seriesId) {
    if (!state.progress[seriesId]) state.progress[seriesId] = {};
    return state.progress[seriesId];
  }

  function isDone(seriesId, chapterId) {
    return !!bucketFor(seriesId)[chapterId];
  }

  // Momento (epoch ms) em que o capítulo mais recentemente lido dessa série
  // foi marcado como lido. 0 se ainda não há nenhum.
  function lastReadAt(seriesId) {
    const bucket = state.progress[seriesId];
    if (!bucket) return 0;
    const vals = Object.values(bucket).filter((v) => typeof v === "number");
    return vals.length ? Math.max(...vals) : 0;
  }

  /* ---------------- "vista pela 1ª vez" storage ---------------- */
  function loadSeen() {
    try {
      const raw = localStorage.getItem(LS_SEEN);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveSeen() {
    localStorage.setItem(LS_SEEN, JSON.stringify(state.seen));
  }

  // Séries novas em data.js (ainda não vistas neste dispositivo) recebem um
  // carimbo "agora" — o que as coloca automaticamente no topo da lista, já
  // que qualquer leitura antiga tem sempre um timestamp mais antigo. A ordem
  // relativa entre séries novas na mesma leva respeita a posição em SERIES
  // (a última do array fica com o carimbo mais recente).
  function ensureSeriesSeen() {
    const base = Date.now();
    let changed = false;
    SERIES.forEach((s, idx) => {
      if (!(s.id in state.seen)) {
        state.seen[s.id] = base + idx;
        changed = true;
      }
    });
    if (changed) saveSeen();
  }

  // Ordena por "atividade mais recente": o mais tardio entre o momento em
  // que a série foi vista pela 1ª vez e o momento do último capítulo
  // marcado como lido.
  function seriesSortKey(s) {
    return Math.max(state.seen[s.id] || 0, lastReadAt(s.id));
  }

  function sortedSeries() {
    return SERIES.slice().sort((a, b) => seriesSortKey(b) - seriesSortKey(a));
  }

  /* ---------------- palette fallback ---------------- */
  const PALETTE = ["#D7263D", "#14498C", "#128C7E", "#B4267A", "#D9821B", "#6B4C9A", "#1F9D66", "#8C1023"];
  function colorForSeries(s) {
    if (s.color) return s.color;
    let h = 0;
    for (let i = 0; i < s.id.length; i++) h = (h * 31 + s.id.charCodeAt(i)) >>> 0;
    return PALETTE[h % PALETTE.length];
  }

  /* ---------------- state ---------------- */
  const state = {
    progress: loadProgress(),
    seen: loadSeen(),
    screen: "home", // home | series
    currentSeriesId: null,
    view: "proximos", // proximos | historico | todos
  };

  /* ---------------- DOM refs ---------------- */
  const el = {
    homeScreen: document.getElementById("homeScreen"),
    seriesScreen: document.getElementById("seriesScreen"),
    seriesList: document.getElementById("seriesList"),
    homeEmptyState: document.getElementById("homeEmptyState"),
    homeStampCount: document.getElementById("homeStampCount"),
    homeProgressFill: document.getElementById("homeProgressFill"),
    exportBtn: document.getElementById("exportBtn"),
    importBtn: document.getElementById("importBtn"),
    importFile: document.getElementById("importFile"),
    backBtn: document.getElementById("backBtn"),
    seriesTitle: document.getElementById("seriesTitle"),
    segmented: document.getElementById("viewSegmented"),
    progressCount: document.getElementById("progressCount"),
    progressFill: document.getElementById("progressFill"),
    nextUpZone: document.getElementById("nextUpZone"),
    nextUpCard: document.getElementById("nextUpCard"),
    chapterList: document.getElementById("chapterList"),
    emptyState: document.getElementById("emptyState"),
  };

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function findSeries(id) {
    return SERIES.find((s) => s.id === id);
  }

  /* ---------------- HOME: lista de séries ---------------- */
  function renderHome() {
    ensureSeriesSeen();

    // Selo global: quantas séries estão 100% lidas (não quantos capítulos).
    const totalSeries = SERIES.length;
    const completeSeries = SERIES.filter((s) => s.chapters.length > 0 && s.chapters.every((c) => isDone(s.id, c.id))).length;
    el.homeStampCount.textContent = `${completeSeries}/${totalSeries}`;
    el.homeProgressFill.style.width = totalSeries ? `${Math.round((completeSeries / totalSeries) * 100)}%` : "0%";

    el.seriesList.innerHTML = "";

    if (SERIES.length === 0) {
      el.homeEmptyState.hidden = false;
      return;
    }
    el.homeEmptyState.hidden = true;

    sortedSeries().forEach((s) => {
      const total = s.chapters.length;
      const done = s.chapters.filter((c) => isDone(s.id, c.id)).length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      const color = colorForSeries(s);

      const card = document.createElement("button");
      card.type = "button";
      card.className = "series-card" + (done === total && total > 0 ? " is-complete" : "");
      card.innerHTML = `
        <div class="series-card-tag" style="background:${color}"></div>
        <div class="series-card-body">
          <p class="series-card-title">${escapeHtml(s.title)}</p>
          <div class="series-card-track" aria-hidden="true">
            <div class="series-card-fill" style="width:${pct}%; background:${color}"></div>
          </div>
          <p class="series-card-count">${done}/${total} lidos</p>
        </div>
        <span class="series-card-arrow" aria-hidden="true">›</span>
      `;
      card.addEventListener("click", () => openSeries(s.id));
      el.seriesList.appendChild(card);
    });
  }

  /* ---------------- SÉRIE: navegação ---------------- */
  function openSeries(id) {
    state.currentSeriesId = id;
    state.view = "proximos";
    state.screen = "series";
    renderAll();
  }

  function goHome() {
    state.screen = "home";
    state.currentSeriesId = null;
    renderAll();
  }

  /* ---------------- SÉRIE: render ---------------- */
  function renderSeriesScreen() {
    const s = findSeries(state.currentSeriesId);
    if (!s) { goHome(); return; }

    el.seriesTitle.textContent = s.title;

    el.segmented.querySelectorAll(".segment").forEach((btn) => {
      const active = btn.dataset.view === state.view;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });

    const total = s.chapters.length;
    const done = s.chapters.filter((c) => isDone(s.id, c.id)).length;
    el.progressCount.textContent = `${done}/${total}`;
    el.progressFill.style.width = total ? `${Math.round((done / total) * 100)}%` : "0%";

    // Próximo por ler
    const next = s.chapters.find((c) => !isDone(s.id, c.id));
    if (!next || state.view !== "proximos") {
      el.nextUpZone.hidden = true;
    } else {
      el.nextUpZone.hidden = false;
      const idx = s.chapters.indexOf(next) + 1;
      el.nextUpCard.innerHTML = `
        <div class="next-up-badge">#${idx}</div>
        <div class="next-up-body">
          <p class="next-up-edition">${escapeHtml(next.title)}${next.optional ? ` <span class="optional-badge">opcional</span>` : ""}</p>
          ${next.where ? `<p class="next-up-meta">${escapeHtml(next.where)}</p>` : ""}
        </div>
      `;
    }

    // Lista de capítulos conforme a vista escolhida
    let chapters;
    if (state.view === "proximos") chapters = s.chapters.filter((c) => !isDone(s.id, c.id));
    else if (state.view === "historico") chapters = s.chapters.filter((c) => isDone(s.id, c.id));
    else chapters = s.chapters.slice();

    el.chapterList.innerHTML = "";

    if (chapters.length === 0) {
      const msg = state.view === "proximos"
        ? "Já não há capítulos por ler nesta série. Boa leitura! 🎉"
        : state.view === "historico"
          ? "Ainda não marcaste nenhum capítulo como lido nesta série."
          : "Sem capítulos para mostrar.";
      el.emptyState.textContent = msg;
      el.emptyState.hidden = false;
      return;
    }
    el.emptyState.hidden = true;

    chapters.forEach((c) => {
      el.chapterList.appendChild(renderChapterCard(s, c));
    });
  }

  function renderChapterCard(s, c) {
    const done = isDone(s.id, c.id);
    const idx = s.chapters.indexOf(c) + 1;
    const card = document.createElement("article");
    card.className = "chapter-card" + (done ? " is-done" : "");

    const number = document.createElement("div");
    number.className = "chapter-number";
    number.textContent = "#" + idx;
    card.appendChild(number);

    const body = document.createElement("div");
    body.className = "chapter-body";
    body.innerHTML = `
      <p class="chapter-edition">${escapeHtml(c.title)}</p>
      <div class="chapter-meta">
        ${c.where ? `<span class="chapter-tag" style="background:${colorForSeries(s)}">${escapeHtml(c.where)}</span>` : `<span class="chapter-tag chapter-tag-muted">avulso</span>`}
        ${c.optional ? `<span class="chapter-tag chapter-tag-optional">opcional</span>` : ""}
      </div>
    `;
    card.appendChild(body);

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "lido-toggle" + (done ? " is-checked" : "");
    toggle.setAttribute("aria-pressed", String(done));
    toggle.setAttribute("aria-label", "Marcar como lido");
    toggle.textContent = done ? "LIDO" : "LER";
    toggle.addEventListener("click", () => toggleChapter(s.id, c.id));
    card.appendChild(toggle);

    return card;
  }

  function toggleChapter(seriesId, chapterId) {
    const bucket = bucketFor(seriesId);
    if (bucket[chapterId]) delete bucket[chapterId];
    else bucket[chapterId] = Date.now();
    saveProgress();
    renderSeriesScreen();
  }

  /* ---------------- importar / exportar ---------------- */
  function exportData() {
    const payload = {
      app: "quadro-a-quadro",
      exportedAt: new Date().toISOString(),
      progress: state.progress,
      seen: state.seen,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `quadro-a-quadro-progresso-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      let parsed;
      try {
        parsed = JSON.parse(reader.result);
      } catch (e) {
        alert("Este ficheiro não é um JSON válido.");
        return;
      }
      if (!parsed || typeof parsed !== "object" || typeof parsed.progress !== "object") {
        alert("Este ficheiro não parece ser uma exportação do Quadro a Quadro.");
        return;
      }
      const ok = confirm("Isto substitui o progresso guardado neste dispositivo pelo do ficheiro importado. Continuar?");
      if (!ok) return;
      state.progress = parsed.progress || {};
      state.seen = parsed.seen && typeof parsed.seen === "object" ? parsed.seen : {};
      saveProgress();
      saveSeen();
      renderAll();
    };
    reader.readAsText(file);
  }

  /* ---------------- render geral ---------------- */
  function renderAll() {
    el.homeScreen.hidden = state.screen !== "home";
    el.seriesScreen.hidden = state.screen !== "series";
    if (state.screen === "home") renderHome();
    else renderSeriesScreen();
  }

  /* ---------------- eventos ---------------- */
  el.backBtn.addEventListener("click", goHome);

  el.segmented.addEventListener("click", (e) => {
    const btn = e.target.closest(".segment");
    if (!btn) return;
    state.view = btn.dataset.view;
    renderSeriesScreen();
  });

  el.exportBtn.addEventListener("click", exportData);
  el.importBtn.addEventListener("click", () => el.importFile.click());
  el.importFile.addEventListener("change", () => {
    const file = el.importFile.files && el.importFile.files[0];
    if (file) importData(file);
    el.importFile.value = "";
  });

  /* ---------------- boot ---------------- */
  renderAll();
})();

(() => {
  "use strict";

  const STORAGE_KEY = "hyperhdr-led-layout-lab-v2";
  const LANGUAGE_KEY = "hyperhdr-led-layout-language-v1";
  let currentLanguage = "ru";
  try {
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
    if (["ru", "en"].includes(savedLanguage)) currentLanguage = savedLanguage;
  } catch (_) {
    // Language preference is optional when storage is unavailable.
  }

  const EN_BY_RU = Object.freeze({
    "активных": "active",
    "Вт max": "W max",
    "Импорт": "Import",
    "Копировать JSON": "Copy JSON",
    "Скачать JSON": "Download JSON",
    "Генератор": "Builder",
    "Расположение": "Layout",
    "Ленты": "Strips",
    "Настройка ленты": "Strip settings",
    "Лента не выбрана": "No strip selected",
    "Матрица": "Matrix",
    "Новая лента": "New strip",
    "добавится после последнего LED": "appended after the last LED",
    "Название": "Name",
    "Количество LED": "LED count",
    "Ориентация": "Orientation",
    "＋ Создать ленту": "＋ Create strip",
    "Ленты на холсте": "Strips on canvas",
    "Магнитизм": "Snapping",
    "Края, центр и соседние ленты": "Edges, center, and nearby strips",
    "Сила доводки": "Snap strength",
    "Выберите ленту в списке или прямо на экране. Тяните за рамку, чтобы двигать; за углы — чтобы менять размер.": "Select a strip in the list or directly on the screen. Drag the frame to move it; drag a corner to resize it.",
    "Столбцы": "Columns",
    "Строки": "Rows",
    "Проводка": "Wiring",
    "Змейка": "Snake",
    "Параллельно": "Parallel",
    "Первый LED": "First LED",
    "Матрица заполняет весь кадр. Порядок нумерации учитывает стартовый угол и способ проводки.": "The matrix fills the whole frame. LED numbering follows the selected start corner and wiring pattern.",
    "Конфигурация HyperHDR": "HyperHDR configuration",
    "Применить JSON": "Apply JSON",
    "Форматировать": "Format",
    "Можно вставить массив LED из HyperHDR. Неизвестные свойства сохраняются.": "Paste a HyperHDR LED array here. Unknown properties are preserved.",
    "Номера": "Numbers",
    "Зоны": "Zones",
    "Вписать": "Fit",
    "Перетаскивайте ленты целиком": "Drag entire strips",
    "рамка двигает · углы меняют размер · магнитизм доводит": "frame moves · corners resize · snapping aligns",
    "Конфигурация корректна": "Configuration is valid",
    "Лента редактируется как единый объект. Можно двигать и растягивать её на холсте, а отдельные LED сохраняют относительное положение.": "A strip is edited as one object. Move or resize it on the canvas while individual LEDs keep their relative positions.",
    "Начало диапазона": "Range start",
    "Конец диапазона": "Range end",
    "правая сторона": "right side",
    "Сейчас сверху → вниз": "Currently top → bottom",
    "⇥ Поджать края": "⇥ Pin outside LEDs",
    "↕ Отразить по вертикали": "↕ Flip vertically",
    "↔ Отразить по горизонтали": "↔ Flip horizontally",
    "⇅ Развернуть порядок зон": "⇅ Reverse zone order",
    "Удалить выбранную ленту": "Delete selected strip",
    "Поджать края:": "Pin outside LEDs:",
    "LED до указанного диапазона повторят его первый крайний LED, а LED после диапазона — последний. Поджатие действует только внутри выбранной ленты.": "LEDs before the selected range repeat its first endpoint; LEDs after it repeat the last endpoint. This affects only the selected strip.",
    "Группы": "Groups",
    "Отключены": "Disabled",
    "Ток @ 5V": "Current @ 5V",
    "Изменения сохраняются в этом браузере": "Changes are saved in this browser",
    "Язык интерфейса": "Interface language",
    "Локальный визуальный конструктор расположения светодиодов для HyperHDR": "Local visual LED layout editor for HyperHDR",
    "HyperHDR LED Layout — наверх": "HyperHDR LED Layout — back to top",
    "Параметры раскладки": "Layout settings",
    "Тип раскладки": "Layout type",
    "Например, Под столом": "For example, Under desk",
    "Визуальный редактор": "Visual editor",
    "Отменить (Ctrl/Cmd+Z)": "Undo (Ctrl/Cmd+Z)",
    "Отменить": "Undo",
    "Повторить (Ctrl/Cmd+Shift+Z)": "Redo (Ctrl/Cmd+Shift+Z)",
    "Повторить": "Redo",
    "Параметры выбранной ленты": "Selected strip settings",
    "Найденные ленты": "Detected strips",
    "Лента": "Strip"
  });

  const attributeSources = new WeakMap();
  const t = (ru, en) => currentLanguage === "en" ? en : ru;

  function applyLanguage() {
    document.documentElement.lang = currentLanguage;
    document.title = currentLanguage === "en" ? "HyperHDR LED Layout Editor" : "HyperHDR LED Layout";
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const trimmed = node.nodeValue.trim();
      if (!trimmed) continue;
      if (node.__i18nSource === undefined && EN_BY_RU[trimmed]) node.__i18nSource = trimmed;
      if (!node.__i18nSource) continue;
      const leading = node.nodeValue.match(/^\s*/)?.[0] || "";
      const trailing = node.nodeValue.match(/\s*$/)?.[0] || "";
      node.nodeValue = `${leading}${currentLanguage === "en" ? EN_BY_RU[node.__i18nSource] : node.__i18nSource}${trailing}`;
    }
    document.querySelectorAll("[placeholder], [title], [aria-label], meta[name=description]").forEach(element => {
      const names = ["placeholder", "title", "aria-label", "content"].filter(name => element.hasAttribute(name));
      let sources = attributeSources.get(element);
      if (!sources) {
        sources = {};
        attributeSources.set(element, sources);
      }
      names.forEach(name => {
        const value = element.getAttribute(name);
        if (!sources[name] && EN_BY_RU[value]) sources[name] = value;
        if (sources[name]) element.setAttribute(name, currentLanguage === "en" ? EN_BY_RU[sources[name]] : sources[name]);
      });
    });
    $$('[data-language]').forEach(button => {
      const active = button.dataset.language === currentLanguage;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function setLanguage(language) {
    if (!["ru", "en"].includes(language)) return;
    currentLanguage = language;
    try { localStorage.setItem(LANGUAGE_KEY, language); } catch (_) {}
    render();
  }
  const round = (value, precision = 4) => {
    const factor = 10 ** precision;
    return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
  };
  const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value)));
  const clone = value => JSON.parse(JSON.stringify(value));

  const defaultMatrix = {
    columns: 16,
    rows: 9,
    wiring: "snake",
    start: "top-left"
  };

  function createStarterLayout(count = 30) {
    const left = .15;
    const right = .85;
    const top = .88;
    const bottom = .96;
    const step = (right - left) / count;
    return Array.from({ length: count }, (_, index) => ({
      hmin: round(left + step * index),
      hmax: round(left + step * (index + 1)),
      vmin: top,
      vmax: bottom,
      group: 0
    }));
  }

  let state = {
    mode: "custom",
    matrix: clone(defaultMatrix),
    leds: [],
    selected: null,
    showNumbers: false,
    showZones: true,
    stripFrom: null,
    stripTo: null,
    strips: [],
    selectedStripId: null,
    snapEnabled: true,
    snapStrength: 1.5
  };
  let history = [];
  let future = [];
  let stripDragState = null;
  let toastTimer = null;

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  function createMatrixLayout(params) {
    const columns = clamp(Math.round(params.columns), 1, 256);
    const rows = clamp(Math.round(params.rows), 1, 256);
    const leds = [];
    const [verticalStart, horizontalStart] = params.start.split("-");
    const startX = horizontalStart === "right" ? columns - 1 : 0;
    const endX = startX === 0 ? columns - 1 : 0;
    const startY = verticalStart === "bottom" ? rows - 1 : 0;
    const endY = startY === 0 ? rows - 1 : 0;
    const down = startY < endY;
    let forward = startX < endX;
    let rowStartX = startX;
    let rowEndX = endX;
    const hBlock = 1 / columns;
    const vBlock = 1 / rows;

    for (let y = startY; down ? y <= endY : y >= endY; y += down ? 1 : -1) {
      for (let x = rowStartX; forward ? x <= rowEndX : x >= rowEndX; x += forward ? 1 : -1) {
        leds.push({
          hmax: round((x + 1) * hBlock),
          hmin: round(x * hBlock),
          vmax: round((y + 1) * vBlock),
          vmin: round(y * vBlock),
          group: 0
        });
      }
      if (params.wiring === "snake") {
        forward = !forward;
        [rowStartX, rowEndX] = [rowEndX, rowStartX];
      }
    }
    return leds;
  }

  function generatedLeds() {
    if (state.mode === "matrix") return createMatrixLayout(state.matrix);
    return state.leds;
  }

  function normalizeLed(led) {
    if (!led || typeof led !== "object") throw new Error(t("Каждый LED должен быть объектом", "Every LED must be an object"));
    const required = ["hmin", "hmax", "vmin", "vmax"];
    required.forEach(key => {
      if (!Number.isFinite(Number(led[key]))) throw new Error(t(`У LED отсутствует числовое поле ${key}`, `LED is missing the numeric ${key} field`));
    });
    return {
      ...led,
      hmax: round(Number(led.hmax)),
      hmin: round(Number(led.hmin)),
      vmax: round(Number(led.vmax)),
      vmin: round(Number(led.vmin)),
      group: Number.isFinite(Number(led.group)) ? Math.max(0, Math.round(Number(led.group))) : 0,
      ...(led.disabled === true ? { disabled: true } : {})
    };
  }

  function syncGeneratedLeds() {
    if (state.mode !== "custom") {
      state.leds = generatedLeds();
      state.strips = buildStripDefinitions(inferStripsFromLeds());
    }
    ensureStripDefinitions();
    if (state.selected !== null && state.selected >= state.leds.length) state.selected = null;
  }

  function snapshot() {
    return JSON.stringify({
      mode: state.mode,
      matrix: state.matrix,
      leds: state.leds,
      stripFrom: state.stripFrom,
      stripTo: state.stripTo,
      strips: state.strips,
      selectedStripId: state.selectedStripId,
      snapEnabled: state.snapEnabled,
      snapStrength: state.snapStrength
    });
  }

  function pushHistory(previous = snapshot()) {
    if (history.at(-1) !== previous) history.push(previous);
    if (history.length > 80) history.shift();
    future = [];
    updateHistoryButtons();
  }

  function restoreSnapshot(serialized) {
    const data = JSON.parse(serialized);
    state = { ...state, ...data, selected: null };
    render();
  }

  function undo() {
    if (!history.length) return;
    future.push(snapshot());
    restoreSnapshot(history.pop());
    updateHistoryButtons();
  }

  function redo() {
    if (!future.length) return;
    history.push(snapshot());
    restoreSnapshot(future.pop());
    updateHistoryButtons();
  }

  function updateHistoryButtons() {
    $("#undoButton").disabled = history.length === 0;
    $("#redoButton").disabled = future.length === 0;
  }

  function setCustomMode() {
    if (state.mode === "custom") return;
    state.leds = clone(state.leds);
    state.mode = "custom";
    $("#modePill").textContent = t("Ленты", "Strips");
  }

  function validateLeds(leds) {
    if (!Array.isArray(leds)) return { ok: false, message: t("Корень JSON должен быть массивом", "The JSON root must be an array") };
    if (!leds.length) return { ok: true, message: t("Холст пуст — создайте или импортируйте ленту", "Canvas is empty — create or import a strip") };
    for (let index = 0; index < leds.length; index += 1) {
      const led = leds[index];
      if (![led.hmin, led.hmax, led.vmin, led.vmax].every(Number.isFinite)) {
        return { ok: false, message: t(`LED ${index}: координаты должны быть числами`, `LED ${index}: coordinates must be numbers`) };
      }
      if ([led.hmin, led.hmax, led.vmin, led.vmax].some(value => value < 0 || value > 1)) {
        return { ok: false, message: t(`LED ${index}: координаты должны быть от 0 до 1`, `LED ${index}: coordinates must be between 0 and 1`) };
      }
      if (led.hmin >= led.hmax || led.vmin >= led.vmax) {
        return { ok: false, message: t(`LED ${index}: min должен быть меньше max`, `LED ${index}: min must be less than max`) };
      }
    }
    return { ok: true, message: t("Конфигурация корректна", "Configuration is valid") };
  }

  function renderPreview() {
    const layer = $("#ledLayer");
    layer.classList.toggle("show-numbers", state.showNumbers);
    const fragment = document.createDocumentFragment();
    state.leds.forEach((led, index) => {
      const zone = document.createElement("button");
      zone.type = "button";
      zone.className = "led-zone";
      if (!state.showZones) zone.classList.add("no-fill");
      if (index === state.selected) zone.classList.add("selected");
      const stripMin = Math.min(state.stripFrom ?? -1, state.stripTo ?? -1);
      const stripMax = Math.max(state.stripFrom ?? -1, state.stripTo ?? -1);
      if (index >= stripMin && index <= stripMax) zone.classList.add("strip-selected");
      if (led.disabled === true) zone.classList.add("disabled");
      zone.dataset.index = String(index);
      zone.style.setProperty("--hue", String(index * 360 / Math.max(1, state.leds.length)));
      zone.style.left = `${led.hmin * 100}%`;
      zone.style.top = `${led.vmin * 100}%`;
      zone.style.width = `${Math.max(.05, (led.hmax - led.hmin) * 100)}%`;
      zone.style.height = `${Math.max(.05, (led.vmax - led.vmin) * 100)}%`;
      zone.title = `LED ${index}${led.group ? t(` · группа ${led.group}`, ` · group ${led.group}`) : ""}${led.disabled ? t(" · отключён", " · disabled") : ""}`;
      zone.setAttribute("aria-label", zone.title);
      zone.innerHTML = `<span>${led.name ?? index}</span><i class="resize-handle" aria-hidden="true"></i>`;
      fragment.append(zone);
    });
    layer.replaceChildren(fragment);
  }

  function renderControls() {
    $$('[data-matrix]').forEach(input => { input.value = state.matrix[input.dataset.matrix]; });
    $$('input[name="wiring"]').forEach(input => { input.checked = input.value === state.matrix.wiring; });
    $$('input[name="matrixStart"]').forEach(input => { input.checked = input.value === state.matrix.start; });
  }

  function renderInspector() {
    const strip = getSelectedStrip();
    if (!strip) {
      $("#inspectorTitle").textContent = t("Лента не выбрана", "No strip selected");
      $("#indexBadge").textContent = "—";
      return;
    }
    const index = state.strips.findIndex(item => item.id === strip.id);
    $("#inspectorTitle").textContent = strip.name || defaultStripName(strip, index);
    $("#indexBadge").textContent = `#${strip.from}…#${strip.to}`;
  }

  function createBatchRange(fromValue, toValue) {
    if (!state.leds.length) return { from: 0, to: -1, low: 0, high: -1, step: 1, indices: [], leds: [] };
    const from = clamp(Math.round(fromValue), 0, state.leds.length - 1);
    const to = clamp(Math.round(toValue), 0, state.leds.length - 1);
    const step = from <= to ? 1 : -1;
    const indices = [];
    for (let index = from; step > 0 ? index <= to : index >= to; index += step) indices.push(index);
    return {
      from,
      to,
      low: Math.min(from, to),
      high: Math.max(from, to),
      step,
      indices,
      leds: indices.map(index => state.leds[index])
    };
  }

  function ledSide(led) {
    const centerH = (led.hmin + led.hmax) / 2;
    const centerV = (led.vmin + led.vmax) / 2;
    const width = led.hmax - led.hmin;
    const height = led.vmax - led.vmin;
    // A vertical physical strip samples wide, shallow horizontal bands; a
    // horizontal strip samples narrow, tall bands. This keeps corner LEDs
    // attached to their strip instead of misclassifying them as top/bottom.
    if (width >= height) return centerH <= .5 ? "left" : "right";
    return centerV <= .5 ? "top" : "bottom";
  }

  function inferStripsFromLeds() {
    const strips = [];
    state.leds.forEach((led, index) => {
      const side = ledSide(led);
      const previous = strips.at(-1);
      if (!previous || previous.side !== side) strips.push({ from: index, to: index, side });
      else previous.to = index;
    });
    return strips.map(strip => ({ ...strip, count: strip.to - strip.from + 1 }));
  }

  function buildStripDefinitions(strips) {
    return strips.map((strip, index) => ({
      id: `strip-${strip.from}-${strip.to}-${strip.side}-${index}`,
      name: "",
      from: strip.from,
      to: strip.to
    }));
  }

  function ensureStripDefinitions() {
    const valid = Array.isArray(state.strips) && state.strips.length
      && state.strips.every(strip => Number.isInteger(strip.from) && Number.isInteger(strip.to) && strip.from >= 0 && strip.to < state.leds.length);
    if (!valid && state.leds.length) state.strips = buildStripDefinitions(inferStripsFromLeds());
    if (!state.strips.length) {
      state.selectedStripId = null;
      state.stripFrom = null;
      state.stripTo = null;
      return;
    }
    if (!state.strips.some(strip => strip.id === state.selectedStripId)) state.selectedStripId = state.strips[0].id;
    const selected = state.strips.find(strip => strip.id === state.selectedStripId);
    if (selected && (state.stripFrom === null || state.stripTo === null)) {
      state.stripFrom = selected.from;
      state.stripTo = selected.to;
    }
  }

  function detectStrips() {
    ensureStripDefinitions();
    return state.strips.map(strip => {
      const first = state.leds[strip.from];
      return { ...strip, count: strip.to - strip.from + 1, side: first ? ledSide(first) : "right" };
    });
  }

  function getSelectedStrip() {
    ensureStripDefinitions();
    return state.strips.find(strip => strip.id === state.selectedStripId) || null;
  }

  function getStripRange() {
    return createBatchRange(state.stripFrom ?? 0, state.stripTo ?? -1);
  }

  function stripSideLabel(side) {
    const labels = currentLanguage === "en"
      ? { left: "Left", right: "Right", top: "Top", bottom: "Bottom" }
      : { left: "Левая", right: "Правая", top: "Верхняя", bottom: "Нижняя" };
    return labels[side] || t("Лента", "Strip");
  }

  function defaultStripName(strip, index = 0) {
    if (strip?.side) return currentLanguage === "en" ? `${stripSideLabel(strip.side)} strip` : `${stripSideLabel(strip.side)} лента`;
    return t(`Лента ${index + 1}`, `Strip ${index + 1}`);
  }

  function renderStripEditor() {
    const strips = detectStrips();
    const max = Math.max(0, state.leds.length - 1);
    if (state.leds.length && (state.stripFrom === null || state.stripTo === null || state.stripFrom > max || state.stripTo > max)) {
      const first = strips[0] || { from: 0, to: max };
      state.stripFrom = first.from;
      state.stripTo = first.to;
    }
    const list = $("#stripList");
    const cards = strips.map((strip, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "strip-card";
      button.dataset.stripIndex = String(index);
      button.classList.toggle("active", strip.id === state.selectedStripId);
      button.innerHTML = `<span><strong>${strip.name || defaultStripName(strip, index)}</strong><small>#${strip.from}…#${strip.to}</small></span><b>${strip.count} LED</b>`;
      return button;
    });
    list.replaceChildren(...cards);
    const selectedStrip = getSelectedStrip();
    if (selectedStrip) {
      state.stripFrom = clamp(state.stripFrom ?? selectedStrip.from, selectedStrip.from, selectedStrip.to);
      state.stripTo = clamp(state.stripTo ?? selectedStrip.to, selectedStrip.from, selectedStrip.to);
    }
    $("#stripFrom").min = selectedStrip?.from ?? 0;
    $("#stripFrom").max = selectedStrip?.to ?? max;
    $("#stripTo").min = selectedStrip?.from ?? 0;
    $("#stripTo").max = selectedStrip?.to ?? max;
    $("#stripFrom").value = state.stripFrom ?? 0;
    $("#stripTo").value = state.stripTo ?? max;
    const range = getStripRange();
    const first = range.leds[0];
    const last = range.leds.at(-1);
    const side = first ? ledSide(first) : "right";
    $("#stripCount").textContent = `${range.indices.length} LED`;
    $("#stripSide").textContent = currentLanguage === "en"
      ? `${stripSideLabel(side).toLowerCase()} side`
      : `${stripSideLabel(side).toLowerCase()} сторона`;
    $("#stripName").value = selectedStrip?.name || "";
    $("#stripDirectionLine").textContent = range.indices.length > 2
      ? `[${range.from}] … [${range.to}]`
      : range.indices.map(index => `[${index}]`).join(" ");
    if (first && last) {
      const vertical = side === "left" || side === "right";
      const firstCenter = vertical ? (first.vmin + first.vmax) / 2 : (first.hmin + first.hmax) / 2;
      const lastCenter = vertical ? (last.vmin + last.vmax) / 2 : (last.hmin + last.hmax) / 2;
      const direction = vertical
        ? (firstCenter <= lastCenter ? t("сверху → вниз", "top → bottom") : t("снизу → вверх", "bottom → top"))
        : (firstCenter <= lastCenter ? t("слева → вправо", "left → right") : t("справа → влево", "right → left"));
      $("#stripDirectionLabel").textContent = t(`Сейчас ${direction}`, `Currently ${direction}`);
    }
  }

  function stripBounds(strip, leds = state.leds) {
    const items = leds.slice(strip.from, strip.to + 1);
    if (!items.length) return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    const left = Math.min(...items.map(led => led.hmin));
    const right = Math.max(...items.map(led => led.hmax));
    const top = Math.min(...items.map(led => led.vmin));
    const bottom = Math.max(...items.map(led => led.vmax));
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  }

  function selectStrip(stripId, resetRange = true) {
    const strip = state.strips.find(item => item.id === stripId);
    if (!strip) return;
    state.selectedStripId = strip.id;
    state.selected = null;
    if (resetRange) {
      state.stripFrom = strip.from;
      state.stripTo = strip.to;
    }
    render();
  }

  function renderLayoutStripList() {
    const strips = detectStrips();
    $("#layoutStripCount").textContent = strips.length;
    const items = strips.map((strip, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "layout-strip-item";
      button.classList.toggle("active", strip.id === state.selectedStripId);
      button.dataset.stripId = strip.id;
      button.style.setProperty("--strip-hue", String(index * 137.5 % 360));
      button.innerHTML = `<i></i><span><strong>${strip.name || defaultStripName(strip, index)}</strong><small>#${strip.from}…#${strip.to}</small></span><b>${strip.count}</b>`;
      return button;
    });
    $("#layoutStripList").replaceChildren(...items);
    $("#snapEnabled").checked = state.snapEnabled;
    $("#snapStrength").value = state.snapStrength;
    $("#snapStrengthOutput").textContent = `${state.snapStrength}%`;
  }

  function renderStripLayer() {
    const layer = $("#stripLayer");
    layer.classList.add("editing");
    const boxes = detectStrips().map((strip, index) => {
      const bounds = stripBounds(strip);
      const box = document.createElement("div");
      box.className = "strip-box";
      box.classList.toggle("active", strip.id === state.selectedStripId);
      box.dataset.stripId = strip.id;
      box.style.setProperty("--strip-hue", String(index * 137.5 % 360));
      box.style.left = `${bounds.left * 100}%`;
      box.style.top = `${bounds.top * 100}%`;
      box.style.width = `${Math.max(.1, bounds.width * 100)}%`;
      box.style.height = `${Math.max(.1, bounds.height * 100)}%`;
      box.innerHTML = `<span class="strip-box-label">${strip.name || defaultStripName(strip, index)} · ${strip.count} LED</span>${["nw", "ne", "sw", "se"].map(handle => `<i class="strip-handle" data-handle="${handle}"></i>`).join("")}`;
      return box;
    });
    layer.replaceChildren(...boxes);
  }

  function snapTargets(excludeStripId) {
    const x = [0, .5, 1];
    const y = [0, .5, 1];
    detectStrips().filter(strip => strip.id !== excludeStripId).forEach(strip => {
      const bounds = stripBounds(strip);
      x.push(bounds.left, (bounds.left + bounds.right) / 2, bounds.right);
      y.push(bounds.top, (bounds.top + bounds.bottom) / 2, bounds.bottom);
    });
    return { x: [...new Set(x)], y: [...new Set(y)] };
  }

  function nearestSnap(points, targets, threshold) {
    let result = null;
    points.forEach(point => targets.forEach(target => {
      const delta = target - point;
      if (Math.abs(delta) <= threshold && (!result || Math.abs(delta) < Math.abs(result.delta))) result = { delta, target };
    }));
    return result;
  }

  function snapMoveBounds(bounds, stripId) {
    if (!state.snapEnabled) return { bounds, snapX: null, snapY: null };
    const targets = snapTargets(stripId);
    const threshold = state.snapStrength / 100;
    const xSnap = nearestSnap([bounds.left, (bounds.left + bounds.right) / 2, bounds.right], targets.x, threshold);
    const ySnap = nearestSnap([bounds.top, (bounds.top + bounds.bottom) / 2, bounds.bottom], targets.y, threshold);
    const dx = xSnap?.delta || 0;
    const dy = ySnap?.delta || 0;
    return {
      bounds: { ...bounds, left: bounds.left + dx, right: bounds.right + dx, top: bounds.top + dy, bottom: bounds.bottom + dy },
      snapX: xSnap?.target ?? null,
      snapY: ySnap?.target ?? null
    };
  }

  function snapResizeBounds(bounds, handle, stripId) {
    if (!state.snapEnabled) return { bounds, snapX: null, snapY: null };
    const targets = snapTargets(stripId);
    const threshold = state.snapStrength / 100;
    const xEdge = handle.includes("w") ? bounds.left : bounds.right;
    const yEdge = handle.includes("n") ? bounds.top : bounds.bottom;
    const xSnap = nearestSnap([xEdge], targets.x, threshold);
    const ySnap = nearestSnap([yEdge], targets.y, threshold);
    const next = { ...bounds };
    if (xSnap) next[handle.includes("w") ? "left" : "right"] = xSnap.target;
    if (ySnap) next[handle.includes("n") ? "top" : "bottom"] = ySnap.target;
    return { bounds: next, snapX: xSnap?.target ?? null, snapY: ySnap?.target ?? null };
  }

  function applyStripBounds(strip, originalLeds, originalBounds, nextBounds) {
    const sourceWidth = Math.max(.0001, originalBounds.width);
    const sourceHeight = Math.max(.0001, originalBounds.height);
    const scaleX = (nextBounds.right - nextBounds.left) / sourceWidth;
    const scaleY = (nextBounds.bottom - nextBounds.top) / sourceHeight;
    originalLeds.forEach((source, offset) => {
      const led = state.leds[strip.from + offset];
      Object.assign(led, {
        hmin: round(nextBounds.left + (source.hmin - originalBounds.left) * scaleX),
        hmax: round(nextBounds.left + (source.hmax - originalBounds.left) * scaleX),
        vmin: round(nextBounds.top + (source.vmin - originalBounds.top) * scaleY),
        vmax: round(nextBounds.top + (source.vmax - originalBounds.top) * scaleY)
      });
    });
  }

  function updateSnapGuides(snapX, snapY) {
    const guideX = $("#snapGuideX");
    const guideY = $("#snapGuideY");
    guideX.classList.toggle("visible", snapX !== null);
    guideY.classList.toggle("visible", snapY !== null);
    if (snapX !== null) guideX.style.left = `${snapX * 100}%`;
    if (snapY !== null) guideY.style.top = `${snapY * 100}%`;
  }

  function updateDraggedStripBox(box, bounds) {
    box.style.left = `${bounds.left * 100}%`;
    box.style.top = `${bounds.top * 100}%`;
    box.style.width = `${(bounds.right - bounds.left) * 100}%`;
    box.style.height = `${(bounds.bottom - bounds.top) * 100}%`;
  }

  function updateJsonEditor(force = false) {
    const editor = $("#jsonEditor");
    if (force || document.activeElement !== editor) editor.value = JSON.stringify(state.leds, null, 2);
  }

  function updateStats() {
    const active = state.leds.filter(led => led.disabled !== true).length;
    const disabled = state.leds.length - active;
    const groups = new Set(state.leds.map(led => led.group).filter(Boolean)).size;
    const current = active * 0.06 * 1.1;
    $("#ledCount").textContent = state.leds.length;
    $("#activeCount").textContent = active;
    $("#powerCount").textContent = (current * 5).toFixed(1);
    $("#groupCount").textContent = groups;
    $("#disabledCount").textContent = disabled;
    $("#currentCount").textContent = `${current.toFixed(1)} A`;
    const validation = validateLeds(state.leds);
    $("#validationBar").classList.toggle("invalid", !validation.ok);
    $("#validationText").textContent = validation.message;
    $(".validation-icon").textContent = validation.ok ? "✓" : "!";
  }

  function saveLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, snapshot());
    } catch (_) {
      // The editor remains fully functional if localStorage is unavailable.
    }
  }

  function render() {
    syncGeneratedLeds();
    renderControls();
    renderPreview();
    renderInspector();
    renderStripEditor();
    renderLayoutStripList();
    renderStripLayer();
    updateJsonEditor();
    updateStats();
    updateHistoryButtons();
    $("#modePill").textContent = state.mode === "matrix" ? t("Матрица", "Matrix") : t("Ленты", "Strips");
    applyLanguage();
    saveLocal();
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function switchTab(tabName) {
    $$('[data-tab]').forEach(tab => {
      const active = tab.dataset.tab === tabName;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    $$('[data-panel]').forEach(panel => panel.classList.toggle("active", panel.dataset.panel === tabName));
    if (tabName === "json") updateJsonEditor(true);
  }

  function transformStripGeometry(operation, fromValue = state.stripFrom, toValue = state.stripTo) {
    const range = createBatchRange(fromValue, toValue);
    if (!range.indices.length) return 0;
    if (operation === "reverse_geometry") {
      const geometries = range.indices.map(index => {
        const { hmin, hmax, vmin, vmax } = state.leds[index];
        return { hmin, hmax, vmin, vmax };
      }).reverse();
      range.indices.forEach((index, offset) => Object.assign(state.leds[index], geometries[offset]));
      return range.indices.length;
    }
    range.indices.forEach(index => {
      const led = state.leds[index];
      if (operation === "mirror_vertical") {
        const vmin = round(1 - led.vmax);
        const vmax = round(1 - led.vmin);
        Object.assign(led, { vmin, vmax });
      } else if (operation === "mirror_horizontal") {
        const hmin = round(1 - led.hmax);
        const hmax = round(1 - led.hmin);
        Object.assign(led, { hmin, hmax });
      } else {
        throw new Error(t("Неизвестное преобразование ленты", "Unknown strip transformation"));
      }
    });
    return range.indices.length;
  }

  function mutateStrip(operation, message) {
    const strip = getSelectedStrip();
    if (!strip) return;
    const range = createBatchRange(strip.from, strip.to);
    if (!range.indices.length) return;
    const before = snapshot();
    setCustomMode();
    transformStripGeometry(operation, range.from, range.to);
    pushHistory(before);
    render();
    showToast(message);
  }

  function createStrip() {
    const count = clamp(Math.round(Number($("#newStripCount").value)), 1, 2000);
    const orientation = $('input[name="newStripOrientation"]:checked')?.value || "horizontal";
    const before = snapshot();
    setCustomMode();
    const from = state.leds.length;
    const slot = state.strips.length % 5;
    const offset = slot * .035;
    if (orientation === "vertical") {
      const left = clamp(.46 + offset, 0, .9);
      const top = .15;
      const height = .7;
      const step = height / count;
      for (let index = 0; index < count; index += 1) {
        state.leds.push({ hmin: round(left), hmax: round(left + .08), vmin: round(top + step * index), vmax: round(top + step * (index + 1)), group: 0 });
      }
    } else {
      const left = .15;
      const top = clamp(.46 + offset, 0, .9);
      const width = .7;
      const step = width / count;
      for (let index = 0; index < count; index += 1) {
        state.leds.push({ hmin: round(left + step * index), hmax: round(left + step * (index + 1)), vmin: round(top), vmax: round(top + .08), group: 0 });
      }
    }
    const name = $("#newStripName").value.trim() || t(`Лента ${state.strips.length + 1}`, `Strip ${state.strips.length + 1}`);
    const strip = { id: `strip-custom-${Date.now().toString(36)}`, name, from, to: from + count - 1 };
    state.strips.push(strip);
    state.selectedStripId = strip.id;
    state.stripFrom = strip.from;
    state.stripTo = strip.to;
    state.selected = null;
    pushHistory(before);
    render();
    showToast(t(`${name}: создано ${count} LED`, `${name}: ${count} LEDs created`));
  }

  function copyLedGeometry(target, source) {
    Object.assign(target, { hmin: source.hmin, hmax: source.hmax, vmin: source.vmin, vmax: source.vmax });
  }

  function pinStripRangeGeometry(strip, fromValue, toValue) {
    const from = clamp(Math.round(fromValue), strip.from, strip.to);
    const to = clamp(Math.round(toValue), strip.from, strip.to);
    const range = createBatchRange(from, to);
    const firstGeometry = clone(state.leds[range.from]);
    const lastGeometry = clone(state.leds[range.to]);
    for (let index = strip.from; index <= strip.to; index += 1) {
      if (index >= range.low && index <= range.high) continue;
      if (range.step < 0) copyLedGeometry(state.leds[index], index > range.high ? firstGeometry : lastGeometry);
      else copyLedGeometry(state.leds[index], index < range.low ? firstGeometry : lastGeometry);
    }
    return range;
  }

  function pinSelectedStripEdges() {
    const strip = getSelectedStrip();
    if (!strip) return;
    const from = clamp(Math.round(state.stripFrom), strip.from, strip.to);
    const to = clamp(Math.round(state.stripTo), strip.from, strip.to);
    const before = snapshot();
    setCustomMode();
    pinStripRangeGeometry(strip, from, to);
    pushHistory(before);
    render();
    showToast(t(`Края ленты поджаты к #${from} и #${to}`, `Outside LEDs pinned to #${from} and #${to}`));
  }

  function deleteSelectedStrip() {
    const strip = getSelectedStrip();
    if (!strip) return;
    const stripName = strip.name || t("Лента", "Strip");
    if (!window.confirm(t(`Удалить «${stripName}» и все её LED?`, `Delete “${stripName}” and all of its LEDs?`))) return;
    const before = snapshot();
    const count = strip.to - strip.from + 1;
    setCustomMode();
    state.leds.splice(strip.from, count);
    const deletedIndex = state.strips.findIndex(item => item.id === strip.id);
    state.strips.splice(deletedIndex, 1);
    state.strips.forEach(item => {
      if (item.from > strip.to) {
        item.from -= count;
        item.to -= count;
      }
    });
    const next = state.strips[Math.min(deletedIndex, state.strips.length - 1)] || null;
    state.selectedStripId = next?.id ?? null;
    state.stripFrom = next?.from ?? null;
    state.stripTo = next?.to ?? null;
    pushHistory(before);
    render();
    showToast(t(`${strip.name || "Лента"} удалена`, `${strip.name || "Strip"} deleted`));
  }

  function applyJson() {
    const before = snapshot();
    try {
      const parsed = JSON.parse($("#jsonEditor").value);
      if (!Array.isArray(parsed)) throw new Error(t("Корень JSON должен быть массивом", "The JSON root must be an array"));
      const normalized = parsed.map(normalizeLed);
      const validation = validateLeds(normalized);
      if (!validation.ok) throw new Error(validation.message);
      state.leds = normalized;
      state.mode = "custom";
      state.selected = null;
      state.strips = [];
      state.selectedStripId = null;
      state.stripFrom = null;
      state.stripTo = null;
      pushHistory(before);
      render();
      showToast(t(`Загружено: ${normalized.length} LED`, `Loaded: ${normalized.length} LEDs`));
    } catch (error) {
      $("#validationBar").classList.add("invalid");
      $("#validationText").textContent = error.message;
      showToast(t(`Ошибка JSON: ${error.message}`, `JSON error: ${error.message}`));
    }
  }

  function downloadJson() {
    const blob = new Blob([`${JSON.stringify(state.leds, null, 2)}\n`], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hyperhdr-layout.json";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast(t("JSON скачан", "JSON downloaded"));
  }

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(state.leds, null, 2));
      showToast(t("JSON скопирован", "JSON copied"));
    } catch (_) {
      switchTab("json");
      $("#jsonEditor").select();
      document.execCommand("copy");
      showToast(t("JSON выделен и скопирован", "JSON selected and copied"));
    }
  }

  function loadFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      switchTab("json");
      $("#jsonEditor").value = String(reader.result);
      applyJson();
    };
    reader.onerror = () => showToast(t("Не удалось прочитать файл", "Could not read the file"));
    reader.readAsText(file);
  }

  function bindEvents() {
    $$('[data-language]').forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.language)));
    $$('[data-tab]').forEach(button => button.addEventListener("click", () => switchTab(button.dataset.tab)));

    $("#stripList").addEventListener("click", event => {
      const card = event.target.closest(".strip-card");
      if (!card) return;
      const strip = detectStrips()[Number(card.dataset.stripIndex)];
      if (!strip) return;
      selectStrip(strip.id);
    });
    [$("#stripFrom"), $("#stripTo")].forEach(input => input.addEventListener("input", () => {
      const strip = getSelectedStrip();
      if (!strip) return;
      const value = clamp(Math.round(Number(input.value)), strip.from, strip.to);
      if (input.id === "stripFrom") state.stripFrom = value;
      else state.stripTo = value;
      renderStripEditor();
      renderPreview();
    }));
    $("#layoutStripList").addEventListener("click", event => {
      const item = event.target.closest(".layout-strip-item");
      if (item) selectStrip(item.dataset.stripId);
    });
    $("#createStrip").addEventListener("click", createStrip);
    $("#stripName").addEventListener("change", event => {
      const strip = getSelectedStrip();
      if (!strip) return;
      const before = snapshot();
      strip.name = event.target.value.trim() || t("Лента", "Strip");
      pushHistory(before);
      render();
    });
    $("#snapEnabled").addEventListener("change", event => {
      state.snapEnabled = event.target.checked;
      renderLayoutStripList();
    });
    $("#snapStrength").addEventListener("input", event => {
      state.snapStrength = Number(event.target.value);
      $("#snapStrengthOutput").textContent = `${state.snapStrength}%`;
      saveLocal();
    });
    $("#pinStripEdges").addEventListener("click", pinSelectedStripEdges);
    $("#mirrorStripVertical").addEventListener("click", () => mutateStrip("mirror_vertical", t("Выбранная лента отражена по вертикали", "Selected strip flipped vertically")));
    $("#mirrorStripHorizontal").addEventListener("click", () => mutateStrip("mirror_horizontal", t("Выбранная лента отражена по горизонтали", "Selected strip flipped horizontally")));
    $("#reverseStripGeometry").addEventListener("click", () => mutateStrip("reverse_geometry", t("Порядок зон выбранной ленты развёрнут", "Selected strip zone order reversed")));
    $("#deleteStrip").addEventListener("click", deleteSelectedStrip);

    $$('[data-matrix]').forEach(input => input.addEventListener("input", () => {
      const before = snapshot();
      state.mode = "matrix";
      state.selected = null;
      state.matrix[input.dataset.matrix] = Math.max(1, Math.round(Number(input.value)));
      pushHistory(before);
      render();
    }));
    $$('input[name="wiring"]').forEach(input => input.addEventListener("change", () => {
      const before = snapshot();
      state.mode = "matrix";
      state.matrix.wiring = input.value;
      pushHistory(before);
      render();
    }));
    $$('input[name="matrixStart"]').forEach(input => input.addEventListener("change", () => {
      const before = snapshot();
      state.mode = "matrix";
      state.matrix.start = input.value;
      pushHistory(before);
      render();
    }));

    $("#stripLayer").addEventListener("pointerdown", event => {
      const box = event.target.closest(".strip-box");
      if (!box) return;
      const strip = state.strips.find(item => item.id === box.dataset.stripId);
      if (!strip) return;
      state.selectedStripId = strip.id;
      state.stripFrom = strip.from;
      state.stripTo = strip.to;
      state.selected = null;
      $$(".strip-box").forEach(item => item.classList.toggle("active", item === box));
      renderStripEditor();
      renderLayoutStripList();
      renderPreview();
      const screenRect = $("#screen").getBoundingClientRect();
      const originalLeds = clone(state.leds.slice(strip.from, strip.to + 1));
      const originalBounds = stripBounds(strip, state.leds);
      const handle = event.target.closest(".strip-handle")?.dataset.handle || null;
      stripDragState = {
        box,
        strip,
        handle,
        before: snapshot(),
        startX: event.clientX,
        startY: event.clientY,
        screenWidth: screenRect.width,
        screenHeight: screenRect.height,
        originalLeds,
        originalBounds
      };
      setCustomMode();
      box.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    $("#stripLayer").addEventListener("pointermove", event => {
      if (!stripDragState) return;
      const drag = stripDragState;
      const dx = (event.clientX - drag.startX) / drag.screenWidth;
      const dy = (event.clientY - drag.startY) / drag.screenHeight;
      let next;
      let snapped;
      if (!drag.handle) {
        const width = drag.originalBounds.width;
        const height = drag.originalBounds.height;
        const left = clamp(drag.originalBounds.left + dx, 0, 1 - width);
        const top = clamp(drag.originalBounds.top + dy, 0, 1 - height);
        next = { left, top, right: left + width, bottom: top + height };
        snapped = snapMoveBounds(next, drag.strip.id);
      } else {
        next = { ...drag.originalBounds };
        if (drag.handle.includes("w")) next.left = clamp(drag.originalBounds.left + dx, 0, next.right - .005);
        if (drag.handle.includes("e")) next.right = clamp(drag.originalBounds.right + dx, next.left + .005, 1);
        if (drag.handle.includes("n")) next.top = clamp(drag.originalBounds.top + dy, 0, next.bottom - .005);
        if (drag.handle.includes("s")) next.bottom = clamp(drag.originalBounds.bottom + dy, next.top + .005, 1);
        snapped = snapResizeBounds(next, drag.handle, drag.strip.id);
        next = snapped.bounds;
        if (next.right - next.left < .005 || next.bottom - next.top < .005) return;
      }
      next = snapped.bounds;
      applyStripBounds(drag.strip, drag.originalLeds, drag.originalBounds, next);
      updateDraggedStripBox(drag.box, next);
      updateSnapGuides(snapped.snapX, snapped.snapY);
      renderPreview();
      updateJsonEditor();
      updateStats();
    });

    const endStripDrag = () => {
      if (!stripDragState) return;
      pushHistory(stripDragState.before);
      stripDragState = null;
      updateSnapGuides(null, null);
      render();
    };
    $("#stripLayer").addEventListener("pointerup", endStripDrag);
    $("#stripLayer").addEventListener("pointercancel", endStripDrag);

    $("#ledLayer").addEventListener("pointerdown", event => {
      const zone = event.target.closest(".led-zone");
      if (!zone) return;
      const index = Number(zone.dataset.index);
      const strip = detectStrips().find(item => index >= item.from && index <= item.to);
      if (strip) selectStrip(strip.id);
      event.preventDefault();
    });
    $("#showNumbers").addEventListener("change", event => { state.showNumbers = event.target.checked; renderPreview(); });
    $("#showZones").addEventListener("change", event => { state.showZones = event.target.checked; renderPreview(); });
    $("#fitButton").addEventListener("click", () => {
      $("#screenWrap").style.transform = "scale(.985)";
      setTimeout(() => { $("#screenWrap").style.transform = ""; }, 180);
    });

    $("#undoButton").addEventListener("click", undo);
    $("#redoButton").addEventListener("click", redo);
    $("#applyJson").addEventListener("click", applyJson);
    $("#formatJson").addEventListener("click", () => {
      try {
        $("#jsonEditor").value = JSON.stringify(JSON.parse($("#jsonEditor").value), null, 2);
        showToast(t("JSON отформатирован", "JSON formatted"));
      } catch (error) {
        showToast(t(`Ошибка JSON: ${error.message}`, `JSON error: ${error.message}`));
      }
    });
    $("#downloadButton").addEventListener("click", downloadJson);
    $("#copyButton").addEventListener("click", copyJson);
    $("#importButton").addEventListener("click", () => $("#fileInput").click());
    $("#fileInput").addEventListener("change", event => loadFile(event.target.files[0]));

    document.addEventListener("keydown", event => {
      const meta = event.ctrlKey || event.metaKey;
      if (meta && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo(); else undo();
        return;
      }
      if (meta && event.key.toLowerCase() === "y") { event.preventDefault(); redo(); return; }
    });

    document.addEventListener("dragover", event => event.preventDefault());
    document.addEventListener("drop", event => {
      event.preventDefault();
      loadFile(event.dataTransfer.files[0]);
    });
  }

  async function loadInitialState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const saved = JSON.parse(stored);
        state = {
          ...state,
          ...saved,
          mode: saved.mode === "matrix" ? "matrix" : "custom",
          selected: null
        };
        return;
      }
    } catch (_) {
      // Ignore broken or unavailable local state and create the starter strip.
    }
    state.leds = createStarterLayout();
    state.mode = "custom";
    state.strips = [];
    state.selectedStripId = null;
    state.stripFrom = null;
    state.stripTo = null;
  }

  function registerWebMCPTools() {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = tool => {
      try {
        void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {});
      } catch (_) {
        // WebMCP is optional and currently unavailable in most browsers.
      }
    };

    register({
      name: "read_led_layout",
      title: "Read LED layout",
      description: "Return the current HyperHDR LED layout and a concise summary without changing it.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute() {
        return {
          count: state.leds.length,
          disabled: state.leds.filter(led => led.disabled === true).length,
          layout: clone(state.leds)
        };
      }
    });

    register({
      name: "transform_led_strip",
      title: "Transform LED strip",
      description: "Mirror only one inclusive LED strip range vertically or horizontally, or reverse the geometry assigned to its LED indices.",
      inputSchema: {
        type: "object",
        properties: {
          from: { type: "integer", minimum: 0 },
          to: { type: "integer", minimum: 0 },
          operation: { type: "string", enum: ["mirror_vertical", "mirror_horizontal", "reverse_geometry"] }
        },
        required: ["from", "to", "operation"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const values = input && typeof input === "object" ? input : {};
        const from = Number(values.from);
        const to = Number(values.to);
        if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0 || from >= state.leds.length || to >= state.leds.length) {
          throw new Error("Invalid LED strip range");
        }
        if (!["mirror_vertical", "mirror_horizontal", "reverse_geometry"].includes(values.operation)) {
          throw new Error("Invalid strip operation");
        }
        const before = snapshot();
        setCustomMode();
        const count = transformStripGeometry(values.operation, from, to);
        state.stripFrom = from;
        state.stripTo = to;
        pushHistory(before);
        render();
        return { count, from, to, operation: values.operation };
      }
    });
  }

  async function init() {
    bindEvents();
    await loadInitialState();
    render();
    registerWebMCPTools();
  }

  init();
})();

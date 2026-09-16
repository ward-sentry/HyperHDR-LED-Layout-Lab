# HyperHDR LED Layout Editor

<p align="center">
  Визуальный редактор расположения светодиодных лент для HyperHDR.<br>
  Visual LED strip layout editor for HyperHDR.
</p>

<p align="center">
  <img alt="Vanilla JavaScript" src="https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?logo=javascript&logoColor=111">
  <img alt="No build step" src="https://img.shields.io/badge/build-none-24e4c4">
  <img alt="Local first" src="https://img.shields.io/badge/data-local--first-8a7dff">
  <img alt="Languages Russian and English" src="https://img.shields.io/badge/UI-RU%20%2F%20EN-ffb454">
</p>

<p align="center">
  <a href="#русский">Русский</a> · <a href="#english">English</a>
</p>

---

## Русский

### Что это

HyperHDR LED Layout Editor — локальный конструктор конфигураций светодиодов HyperHDR. Он позволяет работать с физическими лентами как с цельными объектами: создавать, перемещать, масштабировать, отражать и поджимать неиспользуемые LED к краям рабочего диапазона.

Редактор работает прямо в браузере, не требует сборки и не отправляет конфигурацию на сервер.

### Возможности

- создание ленты по количеству LED и ориентации;
- автоматическое распознавание нескольких непрерывных лент из импортированной конфигурации HyperHDR;
- перемещение и изменение размера всей ленты на холсте;
- магнитная привязка к краям и центру экрана, а также к соседним лентам;
- настраиваемая сила магнитизма;
- вертикальное и горизонтальное отражение выбранной ленты;
- разворот порядка зон без изменения физических индексов;
- режимы лент, матрицы и ручного JSON;
- отмена и повтор действий;
- импорт, копирование и скачивание готового JSON;
- локальное автосохранение;
- интерфейс на русском и английском языках.

### Быстрый запуск

Клонируйте репозиторий. Редактор можно открыть напрямую через `index.html` или запустить любой статический HTTP-сервер:

```bash
git clone <repository-url>
cd hyperHDR-controller
python3 -m http.server 8080
```

Откройте [http://localhost:8080](http://localhost:8080).

При первом запуске редактор создаёт одну базовую ленту из 30 LED. Её можно удалить и создать собственные ленты с нужным количеством светодиодов.

### Основной сценарий

1. Используйте базовую ленту или нажмите **«Импорт»**, чтобы открыть существующую конфигурацию HyperHDR.
2. Перейдите на вкладку **«Ленты»**.
3. Выберите ленту в списке или прямо на холсте.
4. Перетаскивайте рамку, чтобы двигать всю ленту.
5. Тяните угловые маркеры, чтобы изменить её размер.
6. Скачайте итоговый файл кнопкой **«Скачать JSON»**.

### Поджать края

Операция нужна, когда только часть физической ленты находится рядом с экраном, а остальные LED должны повторять цвет ближайшего края.

Например, рабочий диапазон правой ленты — `30…80`:

```text
LED 0…29  → повторяют геометрию LED 30
LED 30…80 → распределены по рабочей области
```

Выберите ленту, укажите **начало** и **конец диапазона**, затем нажмите **«Поджать края»**. Операция применяется только к выбранной ленте и не затрагивает соседние ленты.

Направленный диапазон также поддерживается: для `80 → 30` LED за концами будут поджаты с учётом физического направления укладки.

### Формат HyperHDR

Редактор читает и экспортирует обычный массив зон HyperHDR:

```json
[
  {
    "hmin": 0.95,
    "hmax": 1.0,
    "vmin": 0.0,
    "vmax": 0.0123,
    "group": 0
  }
]
```

Координаты находятся в диапазоне `0…1`. Неизвестные свойства объектов сохраняются при импорте и последующем экспорте.

### Структура проекта

```text
.
├── index.html   # интерфейс редактора
├── styles.css   # оформление и адаптивная раскладка
├── app.js       # генераторы, холст, история, импорт и экспорт
└── README.md
```

### GitHub Pages

Workflow `.github/workflows/pages.yml` автоматически публикует редактор в GitHub Pages после каждого push в ветку `master`. В настройках репозитория один раз выберите **Settings → Pages → Source → GitHub Actions**.

Публикуемый артефакт содержит только `index.html`, `styles.css` и `app.js`.

### Хранение данных

Текущее состояние и выбранный язык сохраняются в `localStorage` браузера. Все вычисления выполняются локально. Для сброса сохранённого состояния очистите данные сайта в браузере или импортируйте нужный JSON заново.

### Разработка

Проект использует только HTML, CSS и JavaScript без зависимостей и этапа сборки.

Минимальная проверка JavaScript:

```bash
node --check app.js
```

---

## English

### What it is

HyperHDR LED Layout Editor is a local visual builder for HyperHDR LED configurations. It treats physical strips as complete objects that you can create, move, resize, flip, and pin to the endpoints of an active range.

The editor runs entirely in the browser, requires no build step, and does not upload your configuration anywhere.

### Features

- create a strip by LED count and orientation;
- automatically detect multiple contiguous strips from an imported HyperHDR configuration;
- move and resize an entire strip directly on the canvas;
- snap to screen edges, screen center, and nearby strips;
- adjustable snapping strength;
- flip the selected strip vertically or horizontally;
- reverse zone order without changing physical LED indices;
- strip, matrix, and raw JSON modes;
- undo and redo;
- import, copy, and download the resulting JSON;
- local autosave;
- Russian and English interface.

### Quick start

Clone the repository. You can open `index.html` directly or start any static HTTP server:

```bash
git clone <repository-url>
cd hyperHDR-controller
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

On the first launch, the editor creates one starter strip with 30 LEDs. Delete it if needed and create your own strips with the required LED counts.

### Basic workflow

1. Use the starter strip or click **Import** to open an existing HyperHDR configuration.
2. Open the **Strips** tab.
3. Select a strip in the list or directly on the canvas.
4. Drag its frame to move the whole strip.
5. Drag a corner handle to resize it.
6. Click **Download JSON** to export the result.

### Pin outside LEDs

This operation is useful when only part of a physical strip is next to the screen and every remaining LED should repeat the nearest edge color.

For example, when the active range of the right strip is `30…80`:

```text
LED 0…29  → repeat LED 30 geometry
LED 30…80 → cover the active screen area
```

Select the strip, enter the range **start** and **end**, then click **Pin outside LEDs**. The operation is scoped to the selected strip and never modifies neighboring strips.

Directed ranges are supported as well. With `80 → 30`, LEDs outside the range are pinned according to the physical wiring direction.

### HyperHDR format

The editor reads and exports a standard HyperHDR capture-zone array:

```json
[
  {
    "hmin": 0.95,
    "hmax": 1.0,
    "vmin": 0.0,
    "vmax": 0.0123,
    "group": 0
  }
]
```

Coordinates use the `0…1` range. Unknown object properties are preserved during import and subsequent export.

### Project structure

```text
.
├── index.html   # editor interface
├── styles.css   # visual design and responsive layout
├── app.js       # generators, canvas, history, import and export
└── README.md
```

### GitHub Pages

The `.github/workflows/pages.yml` workflow automatically deploys the editor to GitHub Pages after every push to `main`. In the repository settings, select **Settings → Pages → Source → GitHub Actions** once.

The published artifact contains only `index.html`, `styles.css`, and `app.js`.

### Data storage

The current layout and language preference are stored in browser `localStorage`. All processing happens locally. To reset saved state, clear the site's browser data or import the desired JSON again.

### Development

The project uses plain HTML, CSS, and JavaScript with no dependencies or build step.

Run a basic JavaScript syntax check with:

```bash
node --check app.js
```

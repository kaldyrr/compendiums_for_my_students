const blocks = [
  {
    id: "state",
    title: "Состояние приложения",
    category: "Основа",
    required: true,
    explain: "Создает объект `app`, где живут название и задачи.",
    why: "Без состояния остальным блокам некуда читать и записывать данные.",
    deps: [],
    code: "const app = {\n  title: \"Счетчик задач\",\n  tasks: []\n};\nconsole.log(app.title);"
  },
  {
    id: "seed",
    title: "Начальные задачи",
    category: "Данные",
    required: true,
    explain: "Добавляет первые элементы в `app.tasks`.",
    why: "Так сразу видно, что список рендерится и меняется.",
    deps: ["state"],
    code: "app.tasks.push(\n  { text: \"Прочитать урок\", done: true },\n  { text: \"Собрать проект\", done: false }\n);\nconsole.log(\"tasks\", app.tasks.length);"
  },
  {
    id: "validate",
    title: "Проверка ввода",
    category: "Функции",
    required: true,
    explain: "Проверяет, что текст задачи не пустой.",
    why: "Валидация защищает приложение от мусорных данных.",
    deps: [],
    code: "function normalizeTaskText(text) {\n  const value = String(text || \"\").trim();\n  if (value.length === 0) throw new Error(\"Введите текст задачи\");\n  return value;\n}"
  },
  {
    id: "add",
    title: "Добавление задачи",
    category: "Функции",
    required: true,
    explain: "Создает новую задачу и кладет ее в массив.",
    why: "Это первая настоящая бизнес-логика проекта.",
    deps: ["state", "validate"],
    code: "function addTask(text) {\n  app.tasks.push({ text: normalizeTaskText(text), done: false });\n  return app.tasks.length;\n}\nconsole.log(\"after add\", addTask(\"Запустить тесты\"));"
  },
  {
    id: "renderItem",
    title: "Рендер одной задачи",
    category: "Рендер",
    required: true,
    explain: "Преобразует одну задачу в строку для вывода.",
    why: "Маленькую функцию проще тестировать и менять.",
    deps: [],
    code: "function renderTask(task, index) {\n  const mark = task.done ? \"[x]\" : \"[ ]\";\n  return `${index + 1}. ${mark} ${task.text}`;\n}"
  },
  {
    id: "renderList",
    title: "Рендер списка",
    category: "Рендер",
    required: true,
    explain: "Собирает все задачи в один текстовый список.",
    why: "Так данные превращаются в интерфейс.",
    deps: ["state", "renderItem"],
    code: "function renderList() {\n  return app.tasks.map(renderTask).join(\"\\n\");\n}\nconsole.log(renderList());"
  },
  {
    id: "summary",
    title: "Итоговый вывод",
    category: "Результат",
    required: true,
    explain: "Показывает, сколько задач сейчас в приложении.",
    why: "Финальный блок подтверждает, что проект собран целиком.",
    deps: ["state"],
    code: "console.log(`Готово: ${app.tasks.length} задачи`);"
  },
  {
    id: "toggle",
    title: "Переключение готовности",
    category: "Дополнительно",
    required: false,
    explain: "Меняет `done` у задачи по индексу.",
    why: "Добавляет интерактивность без усложнения архитектуры.",
    deps: ["state"],
    code: "function toggleTask(index) {\n  const task = app.tasks[index];\n  if (!task) return false;\n  task.done = !task.done;\n  return true;\n}\nconsole.log(\"toggle first\", toggleTask(0));"
  },
  {
    id: "stats",
    title: "Статистика",
    category: "Дополнительно",
    required: false,
    explain: "Считает выполненные и оставшиеся задачи.",
    why: "Показывает, как получать новые данные из массива.",
    deps: ["state"],
    code: "function getStats() {\n  const done = app.tasks.filter(task => task.done).length;\n  return { done, left: app.tasks.length - done };\n}\nconsole.log(\"stats\", JSON.stringify(getStats()));"
  },
  {
    id: "filterOpen",
    title: "Фильтр невыполненных",
    category: "Дополнительно",
    required: false,
    explain: "Оставляет только задачи, которые еще не готовы.",
    why: "Фильтрация часто встречается в реальных интерфейсах.",
    deps: ["state"],
    code: "const openTasks = app.tasks.filter(task => !task.done);\nconsole.log(\"open\", openTasks.map(task => task.text).join(\", \"));"
  },
  {
    id: "tryCatch",
    title: "Безопасная ошибка",
    category: "Ошибки",
    required: false,
    explain: "Показывает ошибку валидации без падения приложения.",
    why: "Студент видит разницу между ошибкой и обработанной ошибкой.",
    deps: ["add"],
    code: "try {\n  addTask(\"\");\n} catch (error) {\n  console.log(\"validation\", error.message);\n}"
  },
  {
    id: "domTemplate",
    title: "HTML-шаблон",
    category: "DOM",
    required: false,
    explain: "Готовит HTML для будущего браузерного интерфейса.",
    why: "Мостик от консольной логики к настоящей странице.",
    deps: ["state"],
    code: "const listHtml = app.tasks\n  .map(task => `<li class=\"${task.done ? \"done\" : \"\"}\">${task.text}</li>`)\n  .join(\"\");\nconsole.log(`<ul>${listHtml}</ul>`);"
  },
  {
    id: "eventPlan",
    title: "План обработчика клика",
    category: "DOM",
    required: false,
    explain: "Добавляет заготовку обработчика события.",
    why: "В продвинутом режиме студент допишет реальный DOM-код.",
    deps: ["add", "renderList"],
    code: "function onAddButtonClick(inputValue) {\n  addTask(inputValue);\n  return renderList();\n}"
  },
  {
    id: "storageDraft",
    title: "Черновик сохранения",
    category: "Storage",
    required: false,
    explain: "Показывает, какие данные можно сохранить.",
    why: "Позже этот блок станет `localStorage` или backend API.",
    deps: ["state"],
    code: "const snapshot = JSON.stringify(app.tasks);\nconsole.log(\"snapshot\", snapshot);"
  },
  {
    id: "viteScaffold",
    title: "Подготовить React-проект",
    category: "Vite React",
    required: false,
    explain: "Создает проект, где React уже подключен.",
    why: "Студент начинает с экрана, а не с команды в терминале.",
    deps: [],
    runner: "vite-react",
    code: "// Vite React: смотрите package.json, src/main.jsx и src/App.jsx в продвинутом режиме."
  },
  {
    id: "reactRoot",
    title: "Подключить экран к странице",
    category: "Vite React",
    required: false,
    explain: "Показывает, где приложение появляется на странице.",
    why: "Техническое имя этого места: `src/main.jsx`.",
    deps: ["viteScaffold"],
    runner: "vite-react",
    code: "// React root живет в src/main.jsx."
  },
  {
    id: "appComponent",
    title: "Главный экран App",
    category: "Vite React",
    required: false,
    explain: "Создает главный экран приложения.",
    why: "Техническое имя файла: `src/App.jsx`.",
    deps: ["reactRoot"],
    runner: "vite-react",
    code: "// App component живет в src/App.jsx."
  },
  {
    id: "reactState",
    title: "Память экрана",
    category: "Vite React",
    required: false,
    explain: "Запоминает задачи внутри React-экрана.",
    why: "Техническое имя механизма: `useState`.",
    deps: ["appComponent"],
    runner: "vite-react",
    code: "// useState добавлен в src/App.jsx."
  },
  {
    id: "taskListComponent",
    title: "Список задач",
    category: "Vite React",
    required: false,
    explain: "Выносит список в отдельный кусок интерфейса.",
    why: "Позже это называется component composition.",
    deps: ["reactState"],
    runner: "vite-react",
    code: "// TaskList добавлен в src/App.jsx."
  },
  {
    id: "addFormComponent",
    title: "Форма добавления",
    category: "Vite React",
    required: false,
    explain: "Добавляет поле ввода и кнопку.",
    why: "Технически это form submit и event handler.",
    deps: ["reactState"],
    runner: "vite-react",
    code: "// AddTaskForm добавлен в src/App.jsx."
  },
  {
    id: "taskItemComponent",
    title: "Карточка задачи",
    category: "React UI",
    required: false,
    explain: "Выносит одну задачу в отдельный компонент.",
    why: "Так интерфейс легче расширять: чекбокс, текст, кнопки и стили живут рядом.",
    deps: ["taskListComponent"],
    runner: "vite-react",
    code: "// TaskItem добавлен в src/App.jsx."
  },
  {
    id: "emptyStateView",
    title: "Пустой экран",
    category: "React UI",
    required: false,
    explain: "Показывает понятное сообщение, когда задач нет.",
    why: "Реальный интерфейс должен хорошо выглядеть не только с тестовыми данными.",
    deps: ["taskListComponent"],
    runner: "vite-react",
    code: "// EmptyState добавлен в src/App.jsx."
  },
  {
    id: "filterControls",
    title: "Фильтр на экране",
    category: "React UI",
    required: false,
    explain: "Добавляет переключатель: все задачи или только открытые.",
    why: "Студент видит, как состояние меняет список на экране.",
    deps: ["reactState"],
    runner: "vite-react",
    code: "// Фильтр задач добавлен в src/App.jsx."
  },
  {
    id: "completionStatsView",
    title: "Статистика на экране",
    category: "React UI",
    required: false,
    explain: "Показывает выполненные и оставшиеся задачи прямо в интерфейсе.",
    why: "Так вычисления из массива становятся полезной частью продукта.",
    deps: ["reactState"],
    runner: "vite-react",
    code: "// Статистика задач добавлена в src/App.jsx."
  },
  {
    id: "localStorageSave",
    title: "Сохранить задачи",
    category: "Storage",
    required: false,
    explain: "Готовит функцию сохранения задач в браузере.",
    why: "После перезагрузки студент ожидает увидеть те же данные, а не пустой проект.",
    deps: ["storageDraft"],
    code: "function saveTasksSnapshot(tasks) {\n  return JSON.stringify(tasks);\n}\nconsole.log(\"save\", saveTasksSnapshot(app.tasks));"
  },
  {
    id: "localStorageRestore",
    title: "Восстановить задачи",
    category: "Storage",
    required: false,
    explain: "Готовит безопасное чтение сохраненного списка.",
    why: "Любое сохранение нужно уметь восстановить и не сломаться на плохих данных.",
    deps: ["localStorageSave"],
    code: "function restoreTasksSnapshot(snapshot) {\n  try {\n    const parsed = JSON.parse(snapshot);\n    return Array.isArray(parsed) ? parsed : [];\n  } catch {\n    return [];\n  }\n}\nconsole.log(\"restore\", restoreTasksSnapshot(saveTasksSnapshot(app.tasks)).length);"
  },
  {
    id: "testNormalize",
    title: "Тест проверки ввода",
    category: "Тесты",
    required: false,
    explain: "Проверяет, что пустой текст вызывает ошибку, а нормальный текст проходит.",
    why: "Тест превращает правило в проверяемое обещание программы.",
    deps: ["validate"],
    code: "function expectThrows(fn, label) {\n  try {\n    fn();\n    console.log(label, \"fail\");\n  } catch {\n    console.log(label, \"pass\");\n  }\n}\nexpectThrows(() => normalizeTaskText(\"\"), \"empty task\");\nconsole.log(\"valid task\", normalizeTaskText(\"  Сделать проект  \"));"
  },
  {
    id: "testAddTask",
    title: "Тест добавления",
    category: "Тесты",
    required: false,
    explain: "Проверяет, что добавление увеличивает список задач.",
    why: "Студент видит, что тесты проверяют поведение, а не просто наличие кода.",
    deps: ["add"],
    code: "const beforeAddTest = app.tasks.length;\naddTask(\"Проверить тест\");\nconsole.log(\"add test\", app.tasks.length === beforeAddTest + 1 ? \"pass\" : \"fail\");"
  },
  {
    id: "npmNetworkProfile",
    title: "Профиль сети вуза",
    category: "Release",
    required: false,
    explain: "Фиксирует `.npmrc` с `strict-ssl=false` для лабораторной сети.",
    why: "Студент не должен застрять на сертификатах до первой сборки.",
    deps: ["viteScaffold"],
    runner: "vite-react",
    code: "// .npmrc подготовлен для вузовской сети."
  },
  {
    id: "buildChecklist",
    title: "Проверка сборки",
    category: "Release",
    required: false,
    explain: "Добавляет финальную проверку `npm run build` и smoke-тест проекта.",
    why: "Перед показом другим людям нужно доказать, что проект собирается.",
    deps: ["viteScaffold"],
    runner: "vite-react",
    code: "// Финальная команда: npm run build."
  },
  {
    id: "publishPlan",
    title: "План публикации",
    category: "Release",
    required: false,
    explain: "Готовит короткий чеклист: ссылка, доступ, ограничения и что показывать преподавателю.",
    why: "Итог курса должен заканчиваться демонстрацией, а не просто последним блоком кода.",
    deps: ["buildChecklist"],
    runner: "vite-react",
    code: "// План публикации: build, preview, ссылка, демонстрация."
  }
];

const stages = [
  {
    id: "foundation",
    title: "Понять проект",
    short: "данные",
    goal: "Собрать основу приложения: название и первые задачи.",
    result: "Студент видит, что проект начинается с понятных данных, а не с терминала.",
    blockIds: ["state", "seed"],
    required: ["state", "seed"]
  },
  {
    id: "logic",
    title: "Научить добавлять",
    short: "логика",
    goal: "Добавить правило: пустые задачи нельзя сохранять, нормальные задачи попадают в список.",
    result: "Появляется первая бизнес-логика, которую можно запускать и ломать безопасно.",
    blockIds: ["validate", "add"],
    required: ["validate", "add"]
  },
  {
    id: "render",
    title: "Показать результат",
    short: "вывод",
    goal: "Превратить массив задач в текстовый экран и итог.",
    result: "Данные становятся видимым результатом, который можно проверить.",
    blockIds: ["renderItem", "renderList", "summary"],
    required: ["renderItem", "renderList", "summary"]
  },
  {
    id: "upgrade",
    title: "Выбрать улучшение",
    short: "выбор",
    goal: "Выбрать одну полезную возможность: переключение, статистику, фильтр или обработку ошибки.",
    result: "Дополнительные блоки становятся решением конкретной задачи, а не случайными кнопками.",
    blockIds: ["toggle", "stats", "filterOpen", "tryCatch"],
    required: [],
    choose: 1
  },
  {
    id: "browser",
    title: "Перейти к экрану",
    short: "браузер",
    goal: "Подготовить мост от консольной логики к браузерному интерфейсу.",
    result: "Студент понимает, зачем нужны шаблон, событие и сохранение.",
    blockIds: ["domTemplate", "eventPlan", "storageDraft"],
    required: ["domTemplate", "eventPlan", "storageDraft"]
  },
  {
    id: "react",
    title: "Собрать React",
    short: "Vite",
    goal: "Открыть тот же проект как Vite React-приложение без ручного старта в терминале.",
    result: "Технические слова появляются после результата: src/App.jsx, useState, components.",
    blockIds: ["viteScaffold", "reactRoot", "appComponent", "reactState", "taskListComponent", "addFormComponent"],
    required: ["viteScaffold", "reactRoot", "appComponent", "reactState", "taskListComponent", "addFormComponent"]
  },
  {
    id: "reactPolish",
    title: "Довести экран",
    short: "UI",
    goal: "Сделать React-экран похожим на продукт: карточка задачи, пустой экран и одно улучшение.",
    result: "Проект становится не просто рабочим, а понятным для пользователя.",
    blockIds: ["taskItemComponent", "emptyStateView", "filterControls", "completionStatsView"],
    required: ["taskItemComponent", "emptyStateView"],
    choose: 1
  },
  {
    id: "persistence",
    title: "Сохранить прогресс",
    short: "память",
    goal: "Добавить сохранение и восстановление задач после перезагрузки.",
    result: "Студент видит, что приложение может помнить состояние между запусками.",
    blockIds: ["localStorageSave", "localStorageRestore"],
    required: ["localStorageSave", "localStorageRestore"]
  },
  {
    id: "testing",
    title: "Проверить проект",
    short: "тесты",
    goal: "Добавить первые проверки: правило ввода и добавление задачи.",
    result: "Проект перестает быть ручной демонстрацией и получает проверяемые гарантии.",
    blockIds: ["testNormalize", "testAddTask"],
    required: ["testNormalize", "testAddTask"]
  },
  {
    id: "release",
    title: "Подготовить показ",
    short: "релиз",
    goal: "Собрать финальный чеклист: вузовская сеть, build-проверка и план публикации.",
    result: "Студент понимает, как показать проект другим и что проверить перед сдачей.",
    blockIds: ["npmNetworkProfile", "buildChecklist", "publishPlan"],
    required: ["npmNetworkProfile", "buildChecklist"],
    choose: 1
  }
];

const files = {
  package: `{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "engines": {
    "node": ">=24 <27"
  },
  "devDependencies": {
    "vitest": "latest"
  }
}`,
  mainjsx: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
  viteconfig: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()]
});`,
  npmrc: `strict-ssl=false
registry=https://registry.npmjs.org/
`
};

const state = {
  mode: "learn",
  selectedTab: "code",
  assembled: [],
  fileOverrides: {},
  projectRevision: 0,
  activeStage: "foundation",
  transitioningStage: null,
  recentBlock: null,
  libraryFilter: "next",
  paletteFilter: "all"
};

const AUTO_ADVANCE_DELAY = 950;
const RECENT_BLOCK_DELAY = 720;
let autoAdvanceTimer = null;
let recentBlockTimer = null;

const stageRail = document.querySelector("#stageRail");
const stageCard = document.querySelector("#stageCard");
const stageTitle = document.querySelector("#stageTitle");
const stageGoal = document.querySelector("#stageGoal");
const stageResult = document.querySelector("#stageResult");
const stageProgress = document.querySelector("#stageProgress");
const nextStageBtn = document.querySelector("#nextStageBtn");
const library = document.querySelector("#blockLibrary");
const paletteOverlay = document.querySelector("#paletteOverlay");
const paletteGrid = document.querySelector("#paletteGrid");
const dropZone = document.querySelector("#dropZone");
const codeEditor = document.querySelector("#codeEditor");
const codeHint = document.querySelector("#codeHint");
const consoleOutput = document.querySelector("#consoleOutput");
const diagnosticsOutput = document.querySelector("#diagnosticsOutput");
const visualState = document.querySelector("#visualState");
const stepCount = document.querySelector("#stepCount");
const statusText = document.querySelector("#statusText");

function renderStageRail() {
  stageRail.innerHTML = "";

  stages.forEach((stage, index) => {
    const button = document.createElement("button");
    const locked = state.mode === "learn" && !isStageUnlocked(stage.id);
    const done = isStageComplete(stage.id);
    const transitioning = state.transitioningStage === stage.id;
    button.className = `stage-step ${stage.id === state.activeStage ? "active" : ""} ${done ? "done" : ""} ${locked ? "locked" : ""} ${transitioning ? "transitioning" : ""}`;
    button.innerHTML = `
      <span class="stage-index">${done ? "✓" : index + 1}</span>
      <span class="stage-copy">
        <strong>${stage.short}</strong>
        <span>${stage.title}</span>
      </span>
      <span class="stage-status">${stageStatusLabel(stage.id)}</span>
    `;
    button.addEventListener("click", () => selectStage(stage.id));
    stageRail.appendChild(button);
  });
}

function renderStageCard() {
  const stage = currentStage();
  const required = stageRequiredBlocks(stage.id);
  const selectedRequired = required.filter(block => state.assembled.includes(block.id)).length;
  const selectedChoice = stageChoiceCount(stage.id);
  const total = required.length + (stage.choose || 0);
  const done = selectedRequired + Math.min(selectedChoice, stage.choose || 0);
  const progress = total === 0 ? 100 : Math.round((done / total) * 100);

  stageTitle.textContent = stage.title;
  stageGoal.textContent = stage.goal;
  stageResult.textContent = stage.result;
  stageProgress.textContent = `${done}/${total}`;
  stageProgress.style.setProperty("--progress", `${progress}%`);

  const nextStage = nextStageAfter(stage.id);
  const transitioning = state.transitioningStage === stage.id;
  stageCard.classList.toggle("stage-complete", isStageComplete(stage.id));
  stageCard.classList.toggle("stage-transitioning", transitioning);
  if (transitioning && nextStage) {
    stageResult.textContent = `${stage.result} Сейчас откроется "${nextStage.title}".`;
  }
  nextStageBtn.hidden = transitioning || !isStageComplete(stage.id) || !nextStage;
  nextStageBtn.textContent = nextStage ? `Дальше: ${nextStage.title}` : "Маршрут завершен";
}

function renderLibrary() {
  library.innerHTML = "";
  const visibleBlocks = filterBlocks(state.libraryFilter);

  if (visibleBlocks.length === 0) {
    const stage = currentStage();
    library.innerHTML = `<div class="empty-note">${isStageComplete(stage.id) ? "Этап собран. Запустите проверку или переходите дальше." : "Нет доступных действий для этого фильтра."}</div>`;
    return;
  }

  for (const block of visibleBlocks) {
    library.appendChild(createBlockCard(block));
  }
}

function renderPalette() {
  paletteGrid.innerHTML = "";
  const visible = filterBlocks(state.paletteFilter, { forPalette: true });

  for (const stage of stages) {
    const stageBlocksInPalette = visible.filter(block => blockStageId(block.id) === stage.id);
    if (stageBlocksInPalette.length === 0) continue;

    const group = document.createElement("section");
    group.className = "palette-stage";
    group.innerHTML = `
      <header>
        <strong>${stage.title}</strong>
        <span>${stage.goal}</span>
      </header>
      <div class="palette-stage-grid"></div>
    `;

    const grid = group.querySelector(".palette-stage-grid");
    stageBlocksInPalette.forEach(block => grid.appendChild(createBlockCard(block, { forPalette: true })));
    paletteGrid.appendChild(group);
  }
}

function createBlockCard(block, options = {}) {
  const missing = missingDeps(block);
  const stageId = blockStageId(block.id);
  const stage = findStage(stageId);
  const locked = state.mode === "learn" && (!isStageUnlocked(stageId) || missing.length > 0);
  const activeStageBlock = stageId === state.activeStage;
  const item = document.createElement("div");
  item.className = `block ${isStageRequiredBlock(block.id) ? "required" : "optional"} ${locked ? "locked" : ""} ${activeStageBlock ? "current-stage-block" : ""}`;
  item.draggable = !locked;
  item.dataset.id = block.id;
  item.innerHTML = `
    <div class="block-top">
      <strong>${block.title}</strong>
      <span class="badge ${isStageRequiredBlock(block.id) ? "" : "optional"}">${blockBadge(block)}</span>
    </div>
    <small class="stage-label">${stage.title}</small>
    <small>${block.explain}</small>
    <small class="why">${block.why}</small>
    ${!isStageUnlocked(stageId) && state.mode === "learn" ? `<small class="requires">Сначала завершите предыдущий этап</small>` : ""}
    ${missing.length > 0 ? `<small class="requires">Сначала: ${missing.map(depId => findBlock(depId).title).join(", ")}</small>` : ""}
  `;
  item.addEventListener("dragstart", event => {
    event.dataTransfer.setData("text/plain", block.id);
  });
  item.addEventListener("click", () => addBlock(block.id));
  return item;
}

function renderBuilder() {
  dropZone.innerHTML = "";
  stages.forEach((stage, stageIndex) => {
    const stageBlockIds = state.assembled.filter(blockId => blockStageId(blockId) === stage.id);
    const section = document.createElement("section");
    const locked = state.mode === "learn" && !isStageUnlocked(stage.id);
    const transitioning = state.transitioningStage === stage.id;
    section.className = `stage-build ${stage.id === state.activeStage ? "current" : ""} ${isStageComplete(stage.id) ? "done" : ""} ${locked ? "locked" : ""} ${transitioning ? "transitioning" : ""}`;
    section.innerHTML = `
      <header class="stage-build-head">
        <div>
          <strong>${stageIndex + 1}. ${stage.title}</strong>
          <span>${stage.goal}</span>
        </div>
        <span>${stageStatusLabel(stage.id)}</span>
      </header>
      <div class="stage-build-body"></div>
    `;

    const body = section.querySelector(".stage-build-body");
    if (stageBlockIds.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = locked ? "Откроется после предыдущего этапа." : "Пока нет действий в этом этапе.";
      body.appendChild(empty);
    }

    stageBlockIds.forEach(blockId => {
      const block = findBlock(blockId);
      const index = state.assembled.indexOf(blockId);
      const row = document.createElement("div");
      row.className = `assembled ${state.recentBlock === blockId ? "new-item" : ""}`;
      row.innerHTML = `
        <span>${index + 1}</span>
        <div><strong>${block.title}</strong><br><code>${block.explain}</code></div>
        <span class="badge ${isStageRequiredBlock(block.id) ? "" : "optional"}">${blockBadge(block)}</span>
        <button class="remove" aria-label="Remove block">x</button>
      `;
      row.querySelector(".remove").addEventListener("click", () => {
        clearAutoAdvance();
        state.assembled.splice(index, 1);
        state.projectRevision += 1;
        sync();
      });
      body.appendChild(row);
    });

    if (stage.id === state.activeStage && !isStageComplete(stage.id)) {
      const nextBlock = nextBlockForStage(stage.id);
      const next = document.createElement("div");
      next.className = "stage-next";
      if (nextBlock) {
        next.innerHTML = `
          <strong>Следующее действие: ${nextBlock.title}</strong>
          <span>${nextBlock.why}</span>
          <button class="small-button" type="button">Добавить действие</button>
        `;
        next.querySelector("button").addEventListener("click", () => addBlock(nextBlock.id));
      } else {
        next.innerHTML = `
          <strong>Нужен выбор</strong>
          <span>Выберите одно улучшение слева, которое реально меняет поведение проекта.</span>
        `;
      }
      body.appendChild(next);
    }

    dropZone.appendChild(section);
  });

  const completedStages = stages.filter(stage => isStageComplete(stage.id)).length;
  stepCount.textContent = `${completedStages}/${stages.length} этапов · ${state.assembled.length} действий`;
}

function generateCode() {
  if (state.assembled.length === 0) {
    return "// Идите по этапам слева.\n// Каждый этап добавляет понятный кусок проекта.\n";
  }

  return state.assembled
    .map(blockId => findBlock(blockId).code)
    .join("\n\n");
}

function currentFileText() {
  const override = state.fileOverrides[state.selectedTab];
  if (override && override.revision === state.projectRevision) return override.value;
  if (state.selectedTab === "appjsx") return generateReactAppCode();
  if (state.selectedTab === "mainjsx") return files.mainjsx;
  if (state.selectedTab === "viteconfig") return files.viteconfig;
  if (state.selectedTab === "package") return files.package;
  if (state.selectedTab === "npmrc") return files.npmrc;
  return generateCode();
}

function renderEditor() {
  if (state.mode === "learn") {
    state.selectedTab = "code";
    document.querySelectorAll(".tab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.tab === "code");
    });
  }
  const editable = state.mode === "advanced";
  codeEditor.readOnly = !editable;
  codeEditor.classList.toggle("is-editable", editable);
  codeHint.textContent = editable
    ? `Editable: можно менять ${currentTabName()} руками. Новые действия обновят generated-код.`
    : `Read-only: код рождается из действий этапа "${currentStage().title}". Ручное редактирование доступно в продвинутом режиме.`;
  codeEditor.value = currentFileText();
}

function sync() {
  renderStageRail();
  renderStageCard();
  renderBuilder();
  renderLibrary();
  renderPalette();
  renderEditor();
  renderVisualState();
}

function clearAutoAdvance() {
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
  state.transitioningStage = null;
}

function markRecentBlock(blockId) {
  if (recentBlockTimer) clearTimeout(recentBlockTimer);
  state.recentBlock = blockId;
  recentBlockTimer = setTimeout(() => {
    if (state.recentBlock === blockId) {
      state.recentBlock = null;
      sync();
    }
  }, RECENT_BLOCK_DELAY);
}

function scheduleAutoAdvance(stageId) {
  if (state.mode !== "learn") return;

  const nextStage = nextStageAfter(stageId);
  if (!nextStage || !isStageComplete(stageId)) return;

  if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
  state.transitioningStage = stageId;
  setStatus(`Этап готов, открываю "${nextStage.title}"`);
  sync();

  autoAdvanceTimer = setTimeout(() => {
    autoAdvanceTimer = null;
    if (state.activeStage === stageId && isStageComplete(stageId)) {
      state.transitioningStage = null;
      selectStage(nextStage.id, { automatic: true });
      diagnosticsOutput.textContent = `Автопереход: открыт этап "${nextStage.title}".\n${nextStage.goal}`;
    } else {
      state.transitioningStage = null;
      sync();
    }
  }, AUTO_ADVANCE_DELAY);
}

function addBlock(blockId) {
  const block = findBlock(blockId);
  const stageId = blockStageId(block.id);
  if (state.assembled.includes(blockId)) {
    setStatus("Это действие уже добавлено");
    return;
  }
  if (state.mode === "learn" && !isStageUnlocked(stageId)) {
    const stage = findStage(stageId);
    diagnosticsOutput.textContent = `${stage.title} пока закрыт.\nСначала завершите предыдущий этап проекта.`;
    setStatus("Этап еще закрыт");
    return;
  }
  const missing = missingDeps(block);
  if (state.mode === "learn" && missing.length > 0) {
    const names = missing.map(depId => findBlock(depId).title).join(", ");
    diagnosticsOutput.textContent = `${block.title} пока рано добавлять.\nСначала выполните: ${names}`;
    setStatus("Нужны предыдущие действия");
    return;
  }
  state.activeStage = stageId;
  state.assembled.push(blockId);
  state.projectRevision += 1;
  markRecentBlock(blockId);
  const completed = isStageComplete(stageId);
  setStatus(completed ? "Этап собран" : "Действие добавлено");
  if (!isStageRequiredBlock(block.id)) {
    diagnosticsOutput.textContent = `${block.title}\nЧто добавили: ${block.explain}\nЗачем: ${block.why}`;
  }
  if (completed) {
    sync();
    scheduleAutoAdvance(stageId);
  } else {
    sync();
  }
}

function setStatus(text) {
  statusText.textContent = text;
}

dropZone.addEventListener("dragover", event => {
  event.preventDefault();
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", event => {
  event.preventDefault();
  dropZone.classList.remove("drag-over");
  addBlock(event.dataTransfer.getData("text/plain"));
});

document.querySelectorAll(".mode").forEach(button => {
  button.addEventListener("click", () => {
    clearAutoAdvance();
    state.mode = button.dataset.mode;
    if (state.mode === "learn" && !isStageUnlocked(state.activeStage)) {
      state.activeStage = stages.find(stage => !isStageComplete(stage.id))?.id || stages[0].id;
    }
    document.querySelector(".course-window").classList.toggle("is-advanced", state.mode === "advanced");
    document.querySelectorAll(".mode").forEach(item => item.classList.toggle("active", item === button));
    setStatus(state.mode === "advanced" ? "Код справа можно редактировать" : "Обучающий режим");
    sync();
  });
});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    state.libraryFilter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item === button));
    renderLibrary();
  });
});

document.querySelectorAll(".palette-filter").forEach(button => {
  button.addEventListener("click", () => {
    state.paletteFilter = button.dataset.paletteFilter;
    document.querySelectorAll(".palette-filter").forEach(item => item.classList.toggle("active", item === button));
    renderPalette();
  });
});

document.querySelector("#openPaletteBtn").addEventListener("click", () => {
  paletteOverlay.hidden = false;
  renderPalette();
});

document.querySelector("#closePaletteBtn").addEventListener("click", () => {
  paletteOverlay.hidden = true;
});

nextStageBtn.addEventListener("click", () => {
  const nextStage = nextStageAfter(state.activeStage);
  if (nextStage) selectStage(nextStage.id);
});

paletteOverlay.addEventListener("click", event => {
  if (event.target === paletteOverlay) {
    paletteOverlay.hidden = true;
  }
});

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    state.selectedTab = button.dataset.tab;
    document.querySelectorAll(".tab").forEach(item => item.classList.toggle("active", item === button));
    renderEditor();
  });
});

codeEditor.addEventListener("input", () => {
  if (state.mode === "advanced") {
    state.fileOverrides[state.selectedTab] = {
      value: codeEditor.value,
      revision: state.projectRevision
    };
    setStatus(`${currentTabName()} изменен вручную`);
  }
});

document.querySelector("#resetBtn").addEventListener("click", () => {
  clearAutoAdvance();
  state.assembled = [];
  state.fileOverrides = {};
  state.projectRevision += 1;
  state.activeStage = "foundation";
  state.libraryFilter = "next";
  document.querySelectorAll(".filter").forEach(item => {
    item.classList.toggle("active", item.dataset.filter === "next");
  });
  consoleOutput.textContent = "";
  diagnosticsOutput.textContent = "";
  setStatus("Сброшено");
  sync();
});

document.querySelector("#runBtn").addEventListener("click", runCode);
document.querySelector("#testBtn").addEventListener("click", runTests);

function runCode() {
  const logs = [];
  const code = state.mode === "advanced" && state.selectedTab === "code" ? codeEditor.value : generateCode();
  const fakeConsole = {
    log: (...args) => logs.push(args.map(String).join(" "))
  };

  try {
    Function("console", `"use strict";\n${code}`)(fakeConsole);
    consoleOutput.textContent = logs.join("\n") || "Код выполнен без вывода";
    diagnosticsOutput.textContent = "Ошибок выполнения нет.";
    setStatus("Run complete");
  } catch (error) {
    consoleOutput.textContent = logs.join("\n");
    diagnosticsOutput.textContent = explainError(error);
    setStatus("Ошибка выполнения");
  }
  renderVisualState();
}

function runTests() {
  const stage = currentStage();
  const missing = stageRequiredBlocks(stage.id).filter(block => !state.assembled.includes(block.id));
  const choiceMissing = Math.max(0, (stage.choose || 0) - stageChoiceCount(stage.id));
  const orderErrors = findOrderErrors();

  if (missing.length === 0 && choiceMissing === 0 && orderErrors.length === 0) {
    diagnosticsOutput.textContent = [
      `Этап принят: ${stage.title}.`,
      stage.result,
      allStagesComplete() ? "Весь маршрут собран: можно переходить к реальной сборке проекта и аккаунтам." : "Теперь можно перейти к следующему этапу.",
      hasReactBlocks() ? "Vite/React часть в реальном приложении проверяется Node runner: npm run build + tests." : ""
    ].filter(Boolean).join("\n");
    setStatus("Этап проверен");
    scheduleAutoAdvance(stage.id);
    return;
  }

  const messages = [];
  if (missing.length > 0) {
    messages.push(`Для этапа не хватает: ${missing.map(block => block.title).join(", ")}`);
  }
  if (choiceMissing > 0) {
    messages.push(`Нужно выбрать еще улучшений: ${choiceMissing}`);
  }
  if (orderErrors.length > 0) {
    messages.push("Порядок действий:");
    messages.push(...orderErrors.map(error => `- ${error}`));
  }

  diagnosticsOutput.textContent = messages.join("\n");
  setStatus("Этап не закрыт");
}

function findOrderErrors() {
  const errors = [];
  for (const blockId of state.assembled) {
    const block = findBlock(blockId);
    const blockIndex = state.assembled.indexOf(blockId);
    for (const depId of block.deps) {
      const depIndex = state.assembled.indexOf(depId);
      if (depIndex === -1) {
        errors.push(`${block.title} требует блок "${findBlock(depId).title}"`);
      } else if (depIndex > blockIndex) {
        errors.push(`"${findBlock(depId).title}" должен стоять выше, чем "${block.title}"`);
      }
    }
  }
  return errors;
}

function explainError(error) {
  if (error instanceof SyntaxError) {
    return `SyntaxError: проверьте скобки, кавычки и порядок блоков.\n${error.message}`;
  }
  if (error instanceof ReferenceError) {
    return `ReferenceError: переменная или функция используется до объявления.\nВероятно, нужный блок стоит ниже или не добавлен.\n${error.message}`;
  }
  if (error.message.includes("Введите текст задачи")) {
    return `Validation error: блок проверки ввода сработал правильно.\n${error.message}`;
  }
  return `${error.name}: ${error.message}`;
}

function renderVisualState() {
  const stage = currentStage();
  const completedStages = stages.filter(item => isStageComplete(item.id)).length;
  const rows = [
    ["mode", state.mode],
    ["stage", stage.title],
    ["progress", `${completedStages}/${stages.length}`],
    ["actions", String(state.assembled.length)],
    ["framework", hasReactBlocks() ? "vite-react" : "vanilla-js"],
    ["next", nextBlockForStage(stage.id)?.title || (isStageComplete(stage.id) ? "stage ready" : "choose upgrade")],
    ["editable", state.mode === "advanced" ? "yes" : "no"],
    ["network", "npm strict-ssl=false profile"]
  ];

  visualState.innerHTML = rows
    .map(([key, value]) => `<div class="state-row"><span>${key}</span><strong>${value}</strong></div>`)
    .join("");
}

function requiredBlocks() {
  return [...new Set(stages.flatMap(stage => stage.required))].map(findBlock);
}

function findBlock(blockId) {
  return blocks.find(block => block.id === blockId);
}

function findStage(stageId) {
  return stages.find(stage => stage.id === stageId);
}

function currentStage() {
  return findStage(state.activeStage);
}

function blockStageId(blockId) {
  return stages.find(stage => stage.blockIds.includes(blockId))?.id || "foundation";
}

function stageRequiredBlocks(stageId) {
  return findStage(stageId).required.map(findBlock);
}

function stageChoiceCount(stageId) {
  const stage = findStage(stageId);
  return stage.blockIds
    .filter(blockId => !stage.required.includes(blockId))
    .filter(blockId => state.assembled.includes(blockId))
    .length;
}

function isStageRequiredBlock(blockId) {
  return findStage(blockStageId(blockId)).required.includes(blockId);
}

function isStageComplete(stageId) {
  const stage = findStage(stageId);
  const requiredDone = stage.required.every(blockId => state.assembled.includes(blockId));
  const choiceDone = !stage.choose || stageChoiceCount(stageId) >= stage.choose;
  return requiredDone && choiceDone;
}

function allStagesComplete() {
  return stages.every(stage => isStageComplete(stage.id));
}

function isStageUnlocked(stageId) {
  const index = stages.findIndex(stage => stage.id === stageId);
  return stages.slice(0, index).every(stage => isStageComplete(stage.id));
}

function nextStageAfter(stageId) {
  const index = stages.findIndex(stage => stage.id === stageId);
  return stages[index + 1] || null;
}

function selectStage(stageId, options = {}) {
  if (!options.automatic) {
    clearAutoAdvance();
  }
  if (state.mode === "learn" && !isStageUnlocked(stageId)) {
    diagnosticsOutput.textContent = `${findStage(stageId).title} пока закрыт.\nЗакройте предыдущие этапы, чтобы курс не превращался в хаос.`;
    setStatus("Этап закрыт");
    return;
  }
  state.activeStage = stageId;
  state.libraryFilter = "next";
  document.querySelectorAll(".filter").forEach(item => {
    item.classList.toggle("active", item.dataset.filter === "next");
  });
  setStatus(options.automatic ? `Открыт этап: ${findStage(stageId).title}` : `Этап: ${findStage(stageId).title}`);
  sync();
}

function stageStatusLabel(stageId) {
  if (state.transitioningStage === stageId) return "переход";
  if (isStageComplete(stageId)) return "готов";
  if (state.mode === "learn" && !isStageUnlocked(stageId)) return "закрыт";
  const stage = findStage(stageId);
  const requiredLeft = stage.required.filter(blockId => !state.assembled.includes(blockId)).length;
  if (requiredLeft > 0) return `${requiredLeft} нужно`;
  if (stage.choose && stageChoiceCount(stageId) < stage.choose) return "выбор";
  return "доступно";
}

function nextBlockForStage(stageId) {
  if (isStageComplete(stageId)) return null;
  const stage = findStage(stageId);
  const stageBlocks = stage.blockIds.map(findBlock);
  const ready = block => !state.assembled.includes(block.id) && missingDeps(block).length === 0;
  const requiredNext = stage.required.map(findBlock).find(ready);
  if (requiredNext) return requiredNext;
  if (stage.choose && stageChoiceCount(stageId) < stage.choose) {
    return null;
  }
  return stageBlocks.find(ready) || null;
}

function missingDeps(block) {
  return block.deps.filter(depId => !state.assembled.includes(depId));
}

function blockBadge(block) {
  if (isStageRequiredBlock(block.id)) return "обяз.";
  if (findStage(blockStageId(block.id)).choose) return "выбор";
  if (block.runner === "vite-react") return "React";
  return "доп.";
}

function filterBlocks(filter, options = {}) {
  const stage = currentStage();
  const source = options.forPalette ? blocks : stage.blockIds.map(findBlock);
  const availableBlocks = source.filter(block => options.forPalette || !state.assembled.includes(block.id));
  if (filter === "required") return availableBlocks.filter(block => isStageRequiredBlock(block.id));
  if (filter === "optional") return availableBlocks.filter(block => !isStageRequiredBlock(block.id) && block.runner !== "vite-react");
  if (filter === "react") return availableBlocks.filter(block => block.runner === "vite-react");
  if (filter === "all") return availableBlocks;

  if (isStageComplete(stage.id)) return [];
  const next = nextBlockForStage(stage.id);
  if (!next && stage.choose && stageChoiceCount(stage.id) < stage.choose) {
    return availableBlocks.filter(block => !isStageRequiredBlock(block.id) && missingDeps(block).length === 0);
  }
  return next ? [next] : availableBlocks.filter(block => missingDeps(block).length === 0);
}

function hasReactBlocks() {
  return state.assembled.some(blockId => findBlock(blockId).runner === "vite-react");
}

function currentTabName() {
  const labels = {
    code: "main.js",
    appjsx: "src/App.jsx",
    mainjsx: "src/main.jsx",
    viteconfig: "vite.config.js",
    package: "package.json",
    npmrc: ".npmrc"
  };
  return labels[state.selectedTab] || state.selectedTab;
}

function generateReactAppCode() {
  const selected = new Set(state.assembled);
  if (!selected.has("appComponent")) {
    return `export default function App() {
  return <h1>Добавьте действие "Главный экран App"</h1>;
}`;
  }

  const includeState = selected.has("reactState");
  const includeList = selected.has("taskListComponent");
  const includeForm = selected.has("addFormComponent");
  const includeTaskItem = selected.has("taskItemComponent");
  const includeEmpty = selected.has("emptyStateView");
  const includeFilter = selected.has("filterControls");
  const includeStats = selected.has("completionStatsView");
  const includePersistence = selected.has("localStorageRestore");
  const reactImports = ["useState"];
  if (includePersistence) reactImports.push("useEffect");
  const imports = includeState ? `import { ${reactImports.join(", ")} } from "react";\n\n` : "";
  const stateCode = includeState
    ? `const initialTasks = [
  { text: "Прочитать урок", done: true },
  { text: "Собрать проект", done: false }
];

`
    : "";
  const itemCode = includeTaskItem
    ? `function TaskItem({ task }) {
  return (
    <li className={task.done ? "done" : ""}>
      <span>{task.done ? "✓" : "○"}</span>
      {task.text}
    </li>
  );
}

`
    : "";
  const emptyCode = includeEmpty
    ? `function EmptyState() {
  return <p>Задач пока нет. Добавьте первую задачу.</p>;
}

`
    : "";
  const listCode = includeList
    ? `function TaskList({ tasks }) {
  ${includeEmpty ? "if (tasks.length === 0) return <EmptyState />;" : ""}

  return (
    <ul>
      {tasks.map(task => ${includeTaskItem ? "<TaskItem key={task.text} task={task} />" : "<li key={task.text}>{task.text}</li>"})}
    </ul>
  );
}

`
    : "";
  const formCode = includeForm
    ? `function AddTaskForm({ onAdd }) {
  const [text, setText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onAdd(text);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={event => setText(event.target.value)} />
      <button type="submit">Добавить</button>
    </form>
  );
}

`
    : "";
  const filterCode = includeFilter
    ? `function FilterControls({ filter, onFilterChange }) {
  return (
    <div>
      <button type="button" onClick={() => onFilterChange("all")} disabled={filter === "all"}>Все</button>
      <button type="button" onClick={() => onFilterChange("open")} disabled={filter === "open"}>Открытые</button>
    </div>
  );
}

`
    : "";
  const statsCode = includeStats
    ? `function TaskStats({ tasks }) {
  const done = tasks.filter(task => task.done).length;
  return <p>Готово: {done}. Осталось: {tasks.length - done}.</p>;
}

`
    : "";
  const appBody = includeState
    ? `  const [tasks, setTasks] = useState(${includePersistence ? `() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : initialTasks;
  }` : "initialTasks"});
  ${includeFilter ? `const [filter, setFilter] = useState("all");
  const visibleTasks = filter === "open" ? tasks.filter(task => !task.done) : tasks;
` : ""}
  ${includePersistence ? `useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
` : ""}

  function addTask(text) {
    const value = text.trim();
    if (!value) return;
    setTasks(current => [...current, { text: value, done: false }]);
  }

  return (
    <main>
      <h1>Счетчик задач</h1>
      ${includeFilter ? "<FilterControls filter={filter} onFilterChange={setFilter} />" : ""}
      ${includeForm ? "<AddTaskForm onAdd={addTask} />" : "<button onClick={() => addTask(\"Новая задача\")}>Добавить</button>"}
      ${includeStats ? "<TaskStats tasks={tasks} />" : ""}
      ${includeList ? `<TaskList tasks={${includeFilter ? "visibleTasks" : "tasks"}} />` : "<pre>{JSON.stringify(tasks, null, 2)}</pre>"}
      <p>Всего: {tasks.length}</p>
    </main>
  );`
    : `  return <h1>Счетчик задач</h1>;`;

  return `${imports}${stateCode}${itemCode}${emptyCode}${listCode}${filterCode}${statsCode}${formCode}export default function App() {
${appBody}
}`;
}

sync();

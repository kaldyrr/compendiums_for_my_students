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
  libraryFilter: "next",
  paletteFilter: "all"
};

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

function renderLibrary() {
  library.innerHTML = "";
  const visibleBlocks = filterBlocks(state.libraryFilter);

  if (visibleBlocks.length === 0) {
    library.innerHTML = `<div class="empty-note">Нет доступных блоков для этого фильтра.</div>`;
    return;
  }

  for (const category of categoriesOf(visibleBlocks)) {
    const title = document.createElement("div");
    title.className = "category-title";
    title.textContent = category;
    library.appendChild(title);

    for (const block of visibleBlocks.filter(item => item.category === category)) {
      library.appendChild(createBlockCard(block));
    }
  }
}

function renderPalette() {
  paletteGrid.innerHTML = "";
  for (const block of filterBlocks(state.paletteFilter, { forPalette: true })) {
    paletteGrid.appendChild(createBlockCard(block, { compact: false }));
  }
}

function createBlockCard(block, options = {}) {
  const missing = missingDeps(block);
  const locked = state.mode === "learn" && missing.length > 0;
  const item = document.createElement("div");
  item.className = `block ${block.required ? "required" : "optional"} ${locked ? "locked" : ""}`;
  item.draggable = !locked;
  item.dataset.id = block.id;
  item.innerHTML = `
    <div class="block-top">
      <strong>${block.title}</strong>
      <span class="badge ${block.required ? "" : "optional"}">${blockBadge(block)}</span>
    </div>
    <small>${block.explain}</small>
    <small class="why">${block.why}</small>
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
  if (state.assembled.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Начните с понятного шага. Платформа сама подготовит технические файлы.";
    dropZone.appendChild(empty);
  }

  state.assembled.forEach((blockId, index) => {
    const block = findBlock(blockId);
    const row = document.createElement("div");
    row.className = "assembled";
    row.innerHTML = `
      <span>${index + 1}</span>
      <div><strong>${block.title}</strong><br><code>${block.explain}</code></div>
      <span class="badge ${block.required ? "" : "optional"}">${block.required ? "обяз." : "доп."}</span>
      <button class="remove" aria-label="Remove block">x</button>
    `;
    row.querySelector(".remove").addEventListener("click", () => {
      state.assembled.splice(index, 1);
      sync();
    });
    dropZone.appendChild(row);
  });

  const requiredDone = requiredBlocks().filter(block => state.assembled.includes(block.id)).length;
  stepCount.textContent = `${state.assembled.length} блоков · ${requiredDone}/${requiredBlocks().length} обязательных`;
}

function generateCode() {
  if (state.assembled.length === 0) {
    return "// Соберите проект из блоков слева.\n// Обязательные блоки отмечены бейджем \"обяз.\".\n";
  }

  return state.assembled
    .map(blockId => findBlock(blockId).code)
    .join("\n\n");
}

function currentFileText() {
  if (state.fileOverrides[state.selectedTab]) return state.fileOverrides[state.selectedTab];
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
    ? `Editable: можно менять ${currentTabName()} руками. Для Vite/React build нужен Node runner.`
    : "Read-only: код генерируется из блоков. Для ручного редактирования включите продвинутый режим.";
  codeEditor.value = currentFileText();
}

function sync() {
  renderBuilder();
  renderLibrary();
  renderPalette();
  renderEditor();
  renderVisualState();
}

function addBlock(blockId) {
  const block = findBlock(blockId);
  if (state.assembled.includes(blockId)) {
    setStatus("Блок уже добавлен");
    return;
  }
  const missing = missingDeps(block);
  if (state.mode === "learn" && missing.length > 0) {
    const names = missing.map(depId => findBlock(depId).title).join(", ");
    diagnosticsOutput.textContent = `${block.title} пока рано добавлять.\nСначала соберите: ${names}`;
    setStatus("Нужны зависимости");
    return;
  }
  state.assembled.push(blockId);
  setStatus(block.required ? "Обязательный блок добавлен" : "Улучшение добавлено");
  if (!block.required) {
    diagnosticsOutput.textContent = `${block.title}\nЧто добавили: ${block.explain}\nЗачем: ${block.why}`;
  }
  sync();
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
    state.mode = button.dataset.mode;
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
    state.fileOverrides[state.selectedTab] = codeEditor.value;
    setStatus(`${currentTabName()} изменен вручную`);
  }
});

document.querySelector("#resetBtn").addEventListener("click", () => {
  state.assembled = [];
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
  const missing = requiredBlocks().filter(block => !state.assembled.includes(block.id));
  const orderErrors = findOrderErrors();

  if (missing.length === 0 && orderErrors.length === 0) {
    diagnosticsOutput.textContent = [
      "Tests passed: обязательные блоки собраны.",
      "Дополнительные блоки можно добавлять для интерактивности, статистики, DOM и Vite/React.",
      hasReactBlocks() ? "Vite/React блоки требуют Node runner: npm run build + tests." : ""
    ].filter(Boolean).join("\n");
    setStatus("Tests passed");
    return;
  }

  const messages = [];
  if (missing.length > 0) {
    messages.push(`Не хватает обязательных блоков: ${missing.map(block => block.title).join(", ")}`);
  }
  if (orderErrors.length > 0) {
    messages.push("Порядок зависимостей:");
    messages.push(...orderErrors.map(error => `- ${error}`));
  }

  diagnosticsOutput.textContent = messages.join("\n");
  setStatus("Tests failed");
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
  const requiredDone = requiredBlocks().filter(block => state.assembled.includes(block.id)).length;
  const rows = [
    ["mode", state.mode],
    ["blocks", String(state.assembled.length)],
    ["required", `${requiredDone}/${requiredBlocks().length}`],
    ["framework", hasReactBlocks() ? "vite-react" : "vanilla-js"],
    ["next", filterBlocks("next").length ? filterBlocks("next")[0].title : "ready"],
    ["editable", state.mode === "advanced" ? "yes" : "no"],
    ["network", "npm strict-ssl=false profile"]
  ];

  visualState.innerHTML = rows
    .map(([key, value]) => `<div class="state-row"><span>${key}</span><strong>${value}</strong></div>`)
    .join("");
}

function requiredBlocks() {
  return blocks.filter(block => block.required);
}

function findBlock(blockId) {
  return blocks.find(block => block.id === blockId);
}

function categoriesOf(items) {
  return [...new Set(items.map(block => block.category))];
}

function missingDeps(block) {
  return block.deps.filter(depId => !state.assembled.includes(depId));
}

function blockBadge(block) {
  if (block.runner === "vite-react") return "React";
  return block.required ? "обяз." : "доп.";
}

function filterBlocks(filter, options = {}) {
  const availableBlocks = blocks.filter(block => options.forPalette || !state.assembled.includes(block.id));
  if (filter === "required") return availableBlocks.filter(block => block.required);
  if (filter === "optional") return availableBlocks.filter(block => !block.required && block.runner !== "vite-react");
  if (filter === "react") return availableBlocks.filter(block => block.runner === "vite-react");
  if (filter === "all") return availableBlocks;

  const requiredLeft = requiredBlocks().some(block => !state.assembled.includes(block.id));
  return availableBlocks.filter(block => {
    const ready = missingDeps(block).length === 0;
    if (!ready) return false;
    return requiredLeft ? block.required : true;
  });
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
  return <h1>Добавьте блок "Компонент App"</h1>;
}`;
  }

  const includeState = selected.has("reactState");
  const includeList = selected.has("taskListComponent");
  const includeForm = selected.has("addFormComponent");
  const imports = includeState ? `import { useState } from "react";\n\n` : "";
  const stateCode = includeState
    ? `const initialTasks = [
  { text: "Прочитать урок", done: true },
  { text: "Собрать проект", done: false }
];

`
    : "";
  const listCode = includeList
    ? `function TaskList({ tasks }) {
  return (
    <ul>
      {tasks.map(task => <li key={task.text}>{task.text}</li>)}
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
  const appBody = includeState
    ? `  const [tasks, setTasks] = useState(initialTasks);

  function addTask(text) {
    const value = text.trim();
    if (!value) return;
    setTasks(current => [...current, { text: value, done: false }]);
  }

  return (
    <main>
      <h1>Счетчик задач</h1>
      ${includeForm ? "<AddTaskForm onAdd={addTask} />" : "<button onClick={() => addTask(\"Новая задача\")}>Добавить</button>"}
      ${includeList ? "<TaskList tasks={tasks} />" : "<pre>{JSON.stringify(tasks, null, 2)}</pre>"}
      <p>Всего: {tasks.length}</p>
    </main>
  );`
    : `  return <h1>Счетчик задач</h1>;`;

  return `${imports}${stateCode}${listCode}${formCode}export default function App() {
${appBody}
}`;
}

renderLibrary();
sync();

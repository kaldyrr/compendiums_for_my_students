const blocks = [
  {
    id: "title",
    title: "Заголовок",
    category: "DOM",
    explain: "Создает название мини-проекта.",
    code: "const title = \"Счетчик задач\";\nconsole.log(title);"
  },
  {
    id: "data",
    title: "Массив задач",
    category: "Data",
    explain: "Хранит задачи в памяти.",
    code: "const tasks = [\"Прочитать урок\", \"Собрать проект\"];\nconsole.log(\"tasks\", tasks.length);"
  },
  {
    id: "function",
    title: "Функция добавления",
    category: "Function",
    explain: "Добавляет новую задачу и возвращает длину списка.",
    code: "function addTask(text) {\n  if (!text) throw new Error(\"Task text is required\");\n  tasks.push(text);\n  return tasks.length;\n}\nconsole.log(\"after add\", addTask(\"Запустить тесты\"));"
  },
  {
    id: "render",
    title: "Рендер списка",
    category: "Render",
    explain: "Преобразует массив задач в HTML.",
    code: "const html = tasks.map((task, index) => `${index + 1}. ${task}`).join(\"\\n\");\nconsole.log(html);"
  },
  {
    id: "summary",
    title: "Итог",
    category: "Output",
    explain: "Показывает финальное состояние проекта.",
    code: "console.log(`Готово: ${tasks.length} задачи`);"
  }
];

const files = {
  package: `{
  "type": "module",
  "scripts": {
    "start": "node main.js",
    "test": "vitest run"
  },
  "engines": {
    "node": ">=24 <27"
  },
  "devDependencies": {
    "vitest": "latest"
  }
}`,
  npmrc: `strict-ssl=false
registry=https://registry.npmjs.org/
`
};

const state = {
  mode: "learn",
  selectedTab: "code",
  assembled: []
};

const library = document.querySelector("#blockLibrary");
const dropZone = document.querySelector("#dropZone");
const codeEditor = document.querySelector("#codeEditor");
const consoleOutput = document.querySelector("#consoleOutput");
const diagnosticsOutput = document.querySelector("#diagnosticsOutput");
const visualState = document.querySelector("#visualState");
const stepCount = document.querySelector("#stepCount");
const statusText = document.querySelector("#statusText");

function renderLibrary() {
  library.innerHTML = "";
  for (const block of blocks) {
    const item = document.createElement("div");
    item.className = "block";
    item.draggable = true;
    item.dataset.id = block.id;
    item.innerHTML = `<strong>${block.title}</strong><small>${block.category} · ${block.explain}</small>`;
    item.addEventListener("dragstart", event => {
      event.dataTransfer.setData("text/plain", block.id);
    });
    item.addEventListener("click", () => addBlock(block.id));
    library.appendChild(item);
  }
}

function renderBuilder() {
  dropZone.innerHTML = "";
  if (state.assembled.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Перетащите блоки сюда";
    dropZone.appendChild(empty);
  }

  state.assembled.forEach((blockId, index) => {
    const block = blocks.find(item => item.id === blockId);
    const row = document.createElement("div");
    row.className = "assembled";
    row.innerHTML = `
      <span>${index + 1}</span>
      <div><strong>${block.title}</strong><br><code>${block.category}</code></div>
      <button class="remove" aria-label="Remove block">x</button>
    `;
    row.querySelector(".remove").addEventListener("click", () => {
      state.assembled.splice(index, 1);
      sync();
    });
    dropZone.appendChild(row);
  });

  stepCount.textContent = `${state.assembled.length} блоков`;
}

function generateCode() {
  if (state.assembled.length === 0) {
    return "// Соберите проект из блоков слева\n";
  }

  return state.assembled
    .map(blockId => blocks.find(item => item.id === blockId).code)
    .join("\n\n");
}

function currentFileText() {
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
  codeEditor.readOnly = state.mode === "learn";
  codeEditor.value = currentFileText();
}

function sync() {
  renderBuilder();
  renderEditor();
  renderVisualState();
}

function addBlock(blockId) {
  if (state.mode === "learn" && state.assembled.includes(blockId)) {
    setStatus("Блок уже добавлен");
    return;
  }
  state.assembled.push(blockId);
  setStatus("Блок добавлен");
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
    setStatus(state.mode === "advanced" ? "Открыта внутрянка" : "Обучающий режим");
    sync();
  });
});

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    state.selectedTab = button.dataset.tab;
    document.querySelectorAll(".tab").forEach(item => item.classList.toggle("active", item === button));
    renderEditor();
  });
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
  const code = state.mode === "advanced" ? codeEditor.value : generateCode();
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
  const required = ["title", "data", "function", "render", "summary"];
  const missing = required.filter(blockId => !state.assembled.includes(blockId));

  if (missing.length === 0) {
    diagnosticsOutput.innerHTML = "Tests passed: проект собран полностью.";
    setStatus("Tests passed");
    return;
  }

  const names = missing.map(blockId => blocks.find(block => block.id === blockId).title).join(", ");
  diagnosticsOutput.textContent = `Tests failed: не хватает блоков: ${names}`;
  setStatus("Tests failed");
}

function explainError(error) {
  if (error instanceof SyntaxError) {
    return `SyntaxError: проверьте скобки, кавычки и порядок блоков.\n${error.message}`;
  }
  if (error instanceof ReferenceError) {
    return `ReferenceError: переменная или функция используется до объявления.\nВероятно, блоки стоят не в том порядке.\n${error.message}`;
  }
  return `${error.name}: ${error.message}`;
}

function renderVisualState() {
  const rows = [
    ["mode", state.mode],
    ["blocks", String(state.assembled.length)],
    ["editable", state.mode === "advanced" ? "yes" : "no"],
    ["network", "npm strict-ssl=false profile"]
  ];

  visualState.innerHTML = rows
    .map(([key, value]) => `<div class="state-row"><span>${key}</span><strong>${value}</strong></div>`)
    .join("");
}

renderLibrary();
sync();

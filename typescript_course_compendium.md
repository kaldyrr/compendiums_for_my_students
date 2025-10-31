# Компендим по TypeScript

Глубокое руководство по TypeScript: установка, конфигурация, статическая типизация, продвинутые типы, сборка, тестирование и интеграция с современными фреймворками. Материал ориентирован на разработчиков, которые хотят писать надёжный JavaScript‑код.

---

## 1. Подготовка окружения
- Установите Node.js LTS (18+). Проверка: `node -v`, `npm -v`.
- Альтернативные менеджеры: `nvm`, `fnm`, `volta`.
- Установите TypeScript глобально или как dev-зависимость:
  ```bash
  npm install -D typescript
  npx tsc --version
  ```
- Рекомендуемые инструменты:
  - Менеджер пакетов: `pnpm` (быстрый), `yarn`, `npm`.
  - Редактор: VS Code (встроенная поддержка TS), WebStorm.
  - Линтеры: ESLint (`@typescript-eslint`), Prettier.

---

## 2. Структура проекта и tsconfig
- Инициализация: `npx tsc --init`.
- Ключевые опции `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "target": "ES2022",
      "module": "ESNext",
      "moduleResolution": "Node",
      "strict": true,
      "noImplicitAny": true,
      "exactOptionalPropertyTypes": true,
      "noUncheckedIndexedAccess": true,
      "skipLibCheck": true,
      "esModuleInterop": true,
      "forceConsistentCasingInFileNames": true,
      "resolveJsonModule": true,
      "types": ["node"],
      "baseUrl": "./src",
      "paths": {
        "@/*": ["*"]
      },
      "outDir": "./dist"
    },
    "include": ["src"],
    "exclude": ["node_modules"]
  }
  ```
- Для монореп (pnpm workspaces, Nx, Turborepo) используйте `tsconfig.base.json` и наследование.
- Служебные файлы: `tsconfig.node.json`, `tsconfig.eslint.json`.

---

## 3. Типы и базовый синтаксис
- Примитивы: `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined`.
- Массивы: `number[]`, `Array<number>`.
- Кортежи: `[string, number]`.
- Enum: `enum Direction { Up, Down }` (лучше использовать union типов).
- Литеральные типы: `"create" | "update" | "delete"`.
- Alias: `type ID = string | number`.

```ts
const users: Array<{ id: number; name: string }> = [
  { id: 1, name: "Ann" }
];
```

---

## 4. Интерфейсы и type alias
- Интерфейсы:
  ```ts
  interface User {
    id: number;
    name: string;
    email?: string;
  }
  ```
- Type aliases: `type User = { id: number; name: string }`.
- Расширение:
  ```ts
  interface Admin extends User {
    permissions: string[];
  }
  ```
- Для React prop типов предпочтительны `type` + `interface` (смешанный подход).
- Пересоздавайте типы через `Pick`, `Omit`, `Partial`.

---

## 5. Функции и контекст `this`
- Объявления:
  ```ts
  function add(a: number, b: number): number {
    return a + b;
  }

  const sum = (a: number, b: number): number => a + b;
  ```
- Неявный `any` запрещается (`noImplicitAny`).
- Контекст `this` описывается через `this: Type`.
- Перегрузка функций (`function fn(a: string): string; function fn(a: number): number;`).
- Асинхронные функции: `async function fetchUsers(): Promise<User[]> { ... }`.

---

## 6. Классы и декораторы
- Классы с модификаторами:
  ```ts
  class ApiClient {
    #token: string; // приватное поле
    protected baseUrl: string;

    constructor(baseUrl: string, token: string) {
      this.baseUrl = baseUrl;
      this.#token = token;
    }
  }
  ```
- Абстрактные классы, геттеры/сеттеры, статические методы.
- Декораторы (экспериментальная функция): обязательно включите `"experimentalDecorators": true`.

---

## 7. Generics и утилиты
- Generics:
  ```ts
  function identity<T>(value: T): T {
    return value;
  }
  ```
- Ограничения:
  ```ts
  function prop<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
  }
  ```
- Utility types:
  - `Partial<T>`, `Required<T>`, `Readonly<T>`, `Pick<T, K>`, `Omit<T, K>`.
  - `Record<K, T>`, `ReturnType<T>`, `InstanceType<T>`.
  - `Extract`, `Exclude`, `NonNullable`.
  - `Awaited<T>`.
- Собственные утилиты:
  ```ts
  type ValuesOf<T> = T[keyof T];
  ```

---

## 8. Union, intersection, type guards
- Union: `type Result = Success | Failure`.
- Intersection: `type WithMeta<T> = T & { meta: Meta }`.
- Type guards:
  ```ts
  function isError(result: Result): result is Failure {
    return "error" in result;
  }
  ```
- Discriminated unions (tagged union):
  ```ts
  type Shape =
    | { kind: "circle"; radius: number }
    | { kind: "square"; size: number };
  ```
- Exhaustive checks:
  ```ts
  function area(shape: Shape): number {
    switch (shape.kind) {
      case "circle": return Math.PI * shape.radius ** 2;
      case "square": return shape.size ** 2;
      default: const _exhaustive: never = shape; return _exhaustive;
    }
  }
  ```

---

## 9. Advanced Types
- Mapped types:
  ```ts
  type Nullable<T> = { [K in keyof T]: T[K] | null };
  ```
- Conditional types:
  ```ts
  type PromiseValue<T> = T extends Promise<infer U> ? U : T;
  ```
- Template literal types:
  ```ts
  type EventName<T extends string> = `on${Capitalize<T>}`;
  ```
- Variadic tuple types, satisfies operator:
  ```ts
  const routes = [
    { path: "/", component: Home },
    { path: "/about", component: About }
  ] satisfies Array<{ path: string; component: ComponentType }>;
  ```
- `infer`, `is`, `asserts` для собственных type guards.

---

## 10. Работа с модулями
- ESM (ECMAScript Modules) по умолчанию: `import`, `export`.
- Для CommonJS укажите `"module": "CommonJS"` или используйте `ts-node/register`.
- `esModuleInterop`: позволяет писать `import express from "express"` для CommonJS библиотек.
- Типы из DefinitelyTyped: `@types/express`, `@types/node`.
- `declare global` и `declare module` — расширение типов.

---

## 11. Сборка и инструментальная цепочка
- `tsc` — компиляция без bundling. Для проектов используйте bundlers:
  - Web: `vite`, `webpack`, `esbuild`, `parcel`.
  - Backend: `ts-node-dev`, `tsx`, `esbuild`, `swc`.
  - Monorepo: `turbo`, `nx`, `rush`.
- Пример `package.json`:
  ```json
  {
    "scripts": {
      "dev": "vite",
      "build": "tsc --noEmit && vite build",
      "lint": "eslint \"src/**/*.{ts,tsx}\"",
      "test": "vitest run"
    }
  }
  ```
- `ts-node`/`tsx` для запуска TS напрямую (Node >=18 поддерживает `--loader ts-node/esm`).
- Sourcemaps: включите `"sourceMap": true` для дебага.

---

## 12. Линтинг и форматирование
- ESLint + `@typescript-eslint/eslint-plugin`.
  ```js
  // eslint.config.js
  import tsParser from "@typescript-eslint/parser";
  import tsPlugin from "@typescript-eslint/eslint-plugin";

  export default [
    {
      files: ["**/*.ts", "**/*.tsx"],
      languageOptions: {
        parser: tsParser,
        parserOptions: { project: "./tsconfig.json" }
      },
      plugins: {
        "@typescript-eslint": tsPlugin
      },
      rules: {
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/explicit-function-return-type": "off"
      }
    }
  ];
  ```
- Prettier — форматирование. Настройте совместимость с ESLint (`eslint-config-prettier`).
- Husky + lint-staged — pre-commit проверки.

---

## 13. Тестирование
- Unit: Vitest, Jest, uvu.
- E2E: Playwright, Cypress.
- Пример Vitest:
  ```ts
  import { expect, test } from "vitest";
  import { add } from "./math";

  test("add", () => {
    expect(add(2, 3)).toBe(5);
  });
  ```
- Настройте `tsconfig.spec.json` для тестов.
- Type-level testing: `expectTypeOf`, `vitest` + `tsd`.
- Mocking: `vi.fn()`, `ts-auto-mock`.

---

## 14. Работа с асинхронностью
- `Promise<T>`, `async/await`, `Promise.all`, `Promise.race`.
- Типизация API:
  ```ts
  async function request<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network error");
    return (await response.json()) as T;
  }
  ```
- `AbortController` для отмены.
- Типизация событий и Web API (`lib` в tsconfig).

---

## 15. Работа с React/Node/Vue/Angular
- **React**:
  - `tsx`, `React.FC` (используйте `FunctionComponent` только если нужны `children` по умолчанию).
  - Типы пропсов, `useState`, `useReducer`, `useRef`.
  - Разбор JSX типизации, `ReactNode`, `ReactElement`.
- **Next.js/Remix**: App Router, Server Components, типы `InferGetServerSidePropsType`.
- **Vue**: `<script setup lang="ts">`, Volar, Vite.
- **Angular**: TS обязательный, strong typing, RxJS.
- **Node.js**: `ts-node`, `express`, `fastify`, `NestJS`.
- **tRPC**, GraphQL (codegen), Zod для валидации схем.

---

## 16. Работа с данными и валидация
- Runtime валидация: `zod`, `yup`, `io-ts`, `valibot`.
  ```ts
  const UserSchema = z.object({
    id: z.number().int(),
    name: z.string().min(1),
    email: z.string().email().optional()
  });

  type User = z.infer<typeof UserSchema>;
  ```
- API Schema: OpenAPI + `openapi-typescript`, GraphQL Code Generator.
- Преобразование типов (DTO -> Domain).

---

## 17. Производительность и инфраструктура
- Webpack/Vite оптимизации: code splitting, tree shaking, `import type`.
- В Node — использовании `ts-node` только для dev, для prod — компиляция/бандлинг.
- Профилирование Node: `node --prof`, `clinic.js`.
- Docker: multi-stage build (tsc -> node:18-slim).
- CI: `npm ci`, `pnpm install --frozen-lockfile`, `tsc --noEmit`, `eslint`, `vitest`.

---

## 18. Типичные ошибки
1. **Отключение strict режима** — теряете преимущества TS. Используйте `strict: true`.
2. **Избыточный `any`** — вводит динамику, используйте `unknown`.
3. **Широкие типы** — приводят к багам. Используйте узкие типы, `const assertions` (`as const`).
4. **Экспорт `default` во всех файлах** — сложнее рефакторить. Предпочитайте named exports.
5. **Отсутствие ESLint/Prettier** — разнобой код-стиля и потенциальные ошибки.
6. **Неаккуратная работа с async** — забытый `await`, игнор ошибок.
7. **Расхождение runtime/compile-time** — компилятор ничего не знает о валидности данных. Используйте runtime валидацию.

---

## 19. Дорожная карта
1. Освойте базовый синтаксис TypeScript, настройте строгий `tsconfig`.
2. Перепишите небольшой JavaScript проект на TS, добавьте типы.
3. Изучите advanced типизацию (generics, conditional types, mapped types).
4. Настройте ESLint, Prettier, Husky, CI pipeline (`tsc --noEmit`, `lint`, `test`).
5. Разработайте приложение на React/Vue/Next с полноценной типизацией API (GraphQL/REST).
6. Внедрите runtime схемы (Zod) и авто-генерацию типов из OpenAPI/Prisma.
7. Изучите метапрограммирование (TS Transformers, decorators, AST).

---

## 20. Ресурсы
- Документация: [typescriptlang.org/docs](https://www.typescriptlang.org/docs/).
- Книги: *Effective TypeScript* (Dan Vanderkam), *Programming TypeScript* (Boris Cherny).
- Курсы: TypeScript Deep Dive (Basarat), EpicReact.dev TS, Frontend Masters.
- Практика: Type Challenges (github.com/type-challenges), Codewars, Advent of Code.
- Сообщества: TypeScript Discord, Reddit r/typescript, Telegram чаты, Stack Overflow.

> TypeScript — мощный инструмент, когда вы используете строгую конфигурацию, следуете архитектурным паттернам и держите типы в актуальном состоянии. Инвестируйте в tooling, покрывайте код тестами и регулярно проводите рефакторинг типов.

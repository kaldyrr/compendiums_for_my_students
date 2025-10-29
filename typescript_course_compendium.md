# Курс‑компендиум по TypeScript

Сильная типизация JavaScript: практики, типовые паттерны, сборка.

## Раздел 1. Окружение и инициализация
- Node.js LTS, `npm -v`/`pnpm -v`/`yarn -v`.
- Установка: `npm i -D typescript ts-node`.
- Инициализация: `npx tsc --init` → `tsconfig.json`.

## Раздел 2. Важные опции tsconfig
- `"target": "ES2022"`, `"module": "ESNext"`, `"moduleResolution": "Bundler"|"Node"`.
- Включите строгий режим: `"strict": true`, `"noImplicitAny": true`, `"exactOptionalPropertyTypes": true`.
- Пути: `"baseUrl"` и `"paths"` для алиасов импортов.

## Раздел 3. Базовые типы и коллекции
- `number`, `string`, `boolean`, `null`, `undefined`, `bigint`, `symbol`.
- Массивы `T[]`/`Array<T>`, кортежи `[T,U]`, `readonly` массивы.
```ts
let n: number = 42; const xs: number[] = [1,2,3];
```

## Раздел 4. Объекты, интерфейсы, тип‑алиасы
- `interface` и `type`, опциональные поля `?`, модификатор `readonly`.
```ts
interface User { name: string; age?: number }
type Id = string | number;
```

## Раздел 5. Функции и перегрузка
- Аннотации параметров/результата, перегрузки сигнатур, `this` в функциях.
```ts
function add(a: number, b: number): number { return a+b }
```

## Раздел 6. Классы и наследование
- Поля, модификаторы `public/private/protected`, `abstract`, `implements`.
```ts
class Person { constructor(public name: string){} }
class Dev extends Person { lang = "ts" }
```

## Раздел 7. Дженерики и ограничения
- `<T>`, `extends`, параметры по умолчанию.
```ts
function first<T>(xs: T[]): T | undefined { return xs[0] }
```

## Раздел 8. Объединения, пересечения и сужение типов
- `A | B`, `A & B`, сужение: `typeof`, `in`, `instanceof`, пользовательские предикаты.
```ts
function len(x: string | string[]): number { return typeof x === 'string' ? x.length : x.length }
```

## Раздел 9. Дискриминируемые объединения
- Поле‑дискриминатор даёт исчерпывающее `switch`.
```ts
type Shape = { kind:'circle', r:number } | { kind:'rect', w:number, h:number }
function area(s: Shape){ switch(s.kind){ case 'circle': return Math.PI*s.r*s.r; case 'rect': return s.w*s.h } }
```

## Раздел 10. Утилитные типы и продвинутые конструкции
- `Partial/Required/Pick/Omit/Record/Readonly`, `ReturnType`, `NonNullable`.
- Условные и отображаемые типы, инференс `infer`.

## Раздел 11. Модули, ESM/CJS и сборка
- ESM `import/export`. Node 18+ поддерживает ESM.
- Сборка: `tsc` или бандлеры (`tsup`, `esbuild`, `vite`), запуск: `node dist/main.js` или `tsx src/main.ts`.

## Раздел 12. Async/await и промисы
- `Promise<T>`, `await`, обработка ошибок `try/catch`, `Promise.all`.
```ts
async function ping(){ const res = await fetch('https://example.com'); return res.status }
```

## Раздел 13. Node и браузерные типы
- Node‑API: `fs`, `http`; DOM типы через `lib: ["dom"]` в tsconfig.
```ts
import { promises as fs } from 'fs';
async function main(){ await fs.writeFile('out.txt','hello'); console.log(await fs.readFile('out.txt','utf8')) }
main();
```

## Раздел 14. Линтинг и форматирование
- ESLint + `@typescript-eslint`, конфиг Prettier для форматирования.

## Раздел 15. Тестирование
- Vitest/Jest. Пример Vitest:
```ts
import { expect, test } from 'vitest';
test('add', () => { expect(2+3).toBe(5) })
```

## Раздел 16. Валидация рантайм‑данных
- Zod/Valibot для проверки внешних данных и вывода типов из схем.
```ts
import { z } from 'zod'; const User = z.object({ name:z.string(), age:z.number().optional() }); type User = z.infer<typeof User>;
```

## Раздел 17. Частые подводные камни
- `any` отключает типобезопасность — предпочитайте `unknown` + сужение.
- `enum` может добавлять рантайм‑код — чаще используйте union литералов.
- Даты/часовые пояса — используйте `Temporal`/`date-fns`/`Luxon`.

## Раздел 18. Экосистема
- Веб: React/Next.js, Vue/Nuxt, SvelteKit. Node: Fastify/NestJS.
- Типобезопасные API: tRPC, GraphQL + codegen.

## Раздел 19. Ресурсы
- Handbook: typescriptlang.org, `tsconfig` reference, Effective TypeScript (Vanderkam).


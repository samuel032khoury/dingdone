## DingDone — TanStack Start Todo App

A small TanStack Start program that demonstrates server-aware routing, data mutations, and a Postgres-backed todo list using modern React and TypeScript.

### Stack
- TanStack Start with file-based routing and server functions
- React 19 + TypeScript
- Drizzle ORM + Postgres (migrations in `drizzle/`)
- Tailwind CSS
- Biome for lint/format, Vitest for tests

### Quickstart
1) Install dependencies (use your package manager of choice):
```bash
npm install
# or
pnpm install
# or
bun install
```
2) Provide a Postgres connection string in `.env`:
```bash
DATABASE_URL=postgres://user:password@localhost:5432/dingdonedb
```
You can start a local Postgres via Docker: `docker compose up -d` (see `compose.yaml`).

3) Apply the schema:
```bash
npm run db:migrate
# or: npm run db:push
```

4) Run the app:
```bash
npm run dev
```
Visit http://localhost:3000.

### Scripts
- `dev` — Vite dev server (port 3000)
- `build` / `preview` — production build and preview
- `test` — Vitest test run
- `lint` / `format` / `check` — Biome checks
- `db:generate` / `db:migrate` / `db:push` / `db:pull` / `db:studio` — Drizzle tooling

### App Notes
- Routes live in `src/routes`; the root shell is in `src/routes/__root.tsx` with TanStack devtools enabled.
- Todos are listed, toggled, created, edited, and deleted through TanStack Start `createServerFn` handlers that call Drizzle (`src/routes/index.tsx`, `src/routes/todos/...`).
- Database schema is defined in `src/db/schema.ts`; migrations output to `drizzle/`.
- UI primitives live in `src/components/ui`; the todo form is in `src/components/todo-form.tsx`.

### Development tips
- After changing the schema, run `npm run db:generate` to create a migration, then `npm run db:migrate` to apply it.
- TanStack Router invalidation is used after mutations; if you add new data sources, wire them through `createServerFn` loaders.
- Tailwind CSS classes are imported via `src/styles.css` and provided globally from the root route.

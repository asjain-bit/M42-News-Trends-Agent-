# Project Conventions for AI Agents

Welcome to the Next.js 15 scaffold. As an AI agent working on this codebase, you must adhere strictly to these rules.

## Scripts (package.json)
- `pnpm dev`: Runs the Next.js dev server.
- `pnpm build`: Builds the production bundle.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Lints the `src` directory using our custom ESLint flat config.
- `pnpm typecheck`: Runs TypeScript without emitting files.
- `pnpm test`: Runs Vitest in a single run.
- `pnpm test:watch`: Runs Vitest in watch mode.
- `pnpm test:coverage`: Runs Vitest with coverage report.
- `pnpm test:e2e`: Runs Playwright end-to-end tests.
- `pnpm storybook`: Starts Storybook dev server.
- `pnpm build-storybook`: Builds static Storybook.

## Design Token Rules (Non-negotiable)
- All styles must use design tokens defined in `src/styles/tokens/`.
- NO raw colors (hex, rgb, hsl) are allowed in component code.
- Prefer Tailwind utilities that resolve to our tokens.

## Atomic Design Folder Convention
Every UI component lives in `src/components/` under one of the Atomic layers: `atoms/`, `molecules/`, `organisms/`, or `templates/`.
A component must include:
- `ComponentName.tsx`: The actual implementation.
- `ComponentName.types.ts`: Props interface (if shared/non-trivial).
- `ComponentName.test.tsx`: Vitest tests for the component.
- `ComponentName.stories.tsx`: Storybook stories.
- `index.ts`: Export file.

## Path Aliases
- Use `@/` which resolves to `./src/`.
- NEVER use relative imports (like `../../`) across different atomic layers.

## Documentation
- Read and understand `DESIGN.md`. 
- **Whenever you add or modify a component, you MUST update `DESIGN.md`.**

## Commits & Code Quality
- All commits are verified via Husky (`pre-commit` for `lint-staged`, `commit-msg` for `commitlint`, `pre-push` for typecheck and tests).
- Your code must follow Conventional Commits standard.
- Do NOT use `any`, `// @ts-ignore`, or `eslint-disable`.

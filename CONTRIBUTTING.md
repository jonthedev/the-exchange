# Contributing Guidelines

## Commit Message Format

We follow the Conventional Commits specification. Each commit message should be structured as follows:

type(scope): subject

Types:

- feat: New feature
- fix: Bug fix
- security: Security improvements
- perf: Performance improvements
- refactor: Code change that neither fixes a bug nor adds a feature
- test: Adding missing tests or correcting existing tests
- docs: Documentation only changes
- chore: Changes to the build process or auxiliary tools

Example:
feat(orders): add limit order validation
fix(ws): handle WebSocket disconnection
security(api): add rate limiting

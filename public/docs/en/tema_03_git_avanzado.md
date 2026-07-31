# Advanced Git Workflows

Collaboration at scale requires efficient branching strategies.

## Trunk-Based Development vs GitFlow
- **Trunk-Based:** Direct continuous integration to `main`. Requires *Feature Flags* and strict TDD. Reduces conflicts.
- **GitFlow:** Ideal for strict versioned releases (`develop`, `release`, `main`).

## Git Hooks and Husky
Husky allows you to run scripts before committing code (e.g. Linting, Prettier, Unit Testing).

```mermaid
gitGraph
  commit
  branch feature/A
  checkout feature/A
  commit
  main checkout
  merge feature/A
  commit id: "v1.0" tag: "release"
```

> [!NOTE]
> The rest of the white paper is kept in its original language to preserve the syntax of code and diagrams.


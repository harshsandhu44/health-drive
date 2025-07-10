# Git Hooks with Husky

This directory contains Git hooks managed by Husky to ensure code quality and consistency across the project.

## 🪝 Available Hooks

### 1. **pre-commit**

Runs before each commit to ensure code quality:

- ✅ TypeScript type checking (`tsc --noEmit`)
- 🔧 ESLint with auto-fix (`npm run lint:fix`)
- 🎨 Prettier formatting (`npm run format`)

### 2. **pre-push**

Runs before pushing to remote repository:

- 📦 Production build test (`npm run build`)
- 🔧 TypeScript type checking (`npm run type-check`)

### 3. **commit-msg**

Validates commit messages follow conventional commits format:

- ✅ Enforces: `type(scope): description`
- 📋 Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`

## 📝 Commit Message Examples

```bash
# ✅ Good examples:
git commit -m "feat(auth): add user login functionality"
git commit -m "fix(ui): resolve button hover state"
git commit -m "docs: update README installation steps"
git commit -m "chore: update dependencies"

# ❌ Bad examples:
git commit -m "fixed stuff"
git commit -m "Added new feature"
git commit -m "WIP"
```

## 🚫 Bypassing Hooks

In exceptional cases, you can bypass hooks:

```bash
# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Skip pre-push hook
git push --no-verify
```

⚠️ **Use sparingly** - Bypassing hooks can introduce quality issues.

## 🔧 Setup for New Team Members

Hooks are automatically set up when running:

```bash
npm install
```

The `prepare` script in `package.json` runs `husky` automatically.

## 🛠️ Troubleshooting

### Hook not running?

```bash
# Reinstall Husky
npm run prepare

# Check hook permissions
chmod +x .husky/pre-commit .husky/pre-push .husky/commit-msg
```

### Build failing in pre-push?

```bash
# Run checks locally first
npm run pre-commit
npm run build
npm run type-check
```

## 📚 Learn More

- [Husky Documentation](https://typicode.github.io/husky/)
- [Conventional Commits](https://conventionalcommits.org/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)

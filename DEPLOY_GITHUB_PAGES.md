# Leetcode Pattern Trainer GitHub Pages Handoff

Repo location:

```text
Current workspace folder: C:\Users\<Windows user>\Documents\leetcode trainer
```

Project URL:

```text
https://twinkylee55688.github.io/leetcode-pattern-trainer/trainer.html
```

Repository:

```text
https://github.com/TwinkyLee55688/leetcode-pattern-trainer
```

Important detail: GitHub Pages should be served from `gh-pages`, while normal development should happen on `main`. After committing to `main`, sync `gh-pages` to `main` and push it.

Commands:

```powershell
cd "C:\Users\<Windows user>\Documents\leetcode trainer"

git status --short --branch
git diff --check
git diff --stat

git add trainer.html style.css trainer.js neetcode-wave1.js neetcode-wave2.js neetcode-wave3.js notes.html DEPLOY_GITHUB_PAGES.md
git commit -m "Your commit message"

git push origin main

git branch -f gh-pages main
git push origin gh-pages

git fetch origin main gh-pages
git rev-parse origin/main
git rev-parse origin/gh-pages
git status --short --branch
```

Expected final condition:

- `origin/main` and `origin/gh-pages` should point to the same commit.
- `git status --short --branch` should be clean.
- GitHub Pages may cache for up to around 10 minutes, so test with a version query string.

Example:

```text
https://twinkylee55688.github.io/leetcode-pattern-trainer/trainer.html?v=20260720
```

Current app shape:

- This is a static GitHub Pages app.
- The trainer stores user progress in the browser with `localStorage`.
- There is no real account login yet.
- Cross-device login/sync will need an external auth/data service such as Firebase, Supabase, or a GitHub OAuth flow with a backend/serverless callback.

Reference project pattern:

- `Table_Arrangement` develops on `main`.
- `Table_Arrangement` publishes GitHub Pages by force-updating `gh-pages` to match `main`.
- Use the same flow here when publishing trainer updates.

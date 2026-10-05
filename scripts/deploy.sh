#!/usr/bin/env bash
# Builds the app and publishes the build/ folder to the gh-pages branch.
# GitHub Pages serves that branch at https://diegomottadev.github.io/hackersnew-react/
set -euo pipefail

DEPLOY_DIR=.gh-pages
SOURCE_COMMIT=$(git rev-parse --short HEAD)

npm run build

# Check out gh-pages in a separate folder, so the current branch doesn't change.
if git fetch origin gh-pages 2>/dev/null; then
  git worktree add -B gh-pages "$DEPLOY_DIR" origin/gh-pages
else
  git worktree add --orphan -b gh-pages "$DEPLOY_DIR"
fi
trap 'git worktree remove --force "$DEPLOY_DIR"' EXIT

# Replace the old build with the new one.
git -C "$DEPLOY_DIR" rm -rq --ignore-unmatch .
cp -r build/. "$DEPLOY_DIR"/
# Without this file, GitHub runs Jekyll and skips some files.
touch "$DEPLOY_DIR/.nojekyll"

git -C "$DEPLOY_DIR" add -A
if git -C "$DEPLOY_DIR" diff --cached --quiet; then
  echo "Nothing changed since the last deploy."
  exit 0
fi
git -C "$DEPLOY_DIR" commit -q -m "Deploy $SOURCE_COMMIT"
git -C "$DEPLOY_DIR" push origin gh-pages

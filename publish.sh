#!/bin/bash
set -e
current_branch="$(git rev-parse --abbrev-ref HEAD)"

function quittrap {
    git checkout "$current_branch"
}
trap "quittrap" SIGINT SIGTERM EXIT
git checkout 'gh-pages'
git pull -u origin 'gh-pages'
git merge -m "Merge branch '$current_branch' into gh-pages" "$current_branch"
cat public.html > index.html
git commit -m "Generate new index.html" index.html || true
git push -u origin 'gh-pages'

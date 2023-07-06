set -e
npm run build
cd dist
echo > .nojekyll

git init
git checkout -B main
git add -A
git commit -m "deploy"

# If you are deploying to https://<USERNAME>.github.io/, you can omit base as it defaults to '/'.

# If you are deploying to https://<USERNAME>.github.io/<REPO>/, for example your repository is at https://github.com/<USERNAME>/<REPO>, then set base to '/<REPO>/'.

#git push -f git@github.com:dhiyarisalah/dashboard-exe-summary.git main:gh-pages

cd -
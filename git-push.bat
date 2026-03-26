git init
git rm -r --cached "node_modules" 2>nul
git rm -r --cached ".env" 2>nul
git add .
git commit -m "Complete UI Modernization & Fixes"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/khabya-git/AlphaFit_Updated.git
git push -u origin main

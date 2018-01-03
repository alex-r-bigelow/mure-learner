node_modules/.bin/rollup -c rollup.config.js
cat <(echo "javascript:") build/mure-learner.js > build/temp.js
mv build/temp.js build/mure-learner.js

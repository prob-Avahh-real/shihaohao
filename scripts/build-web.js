const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const root = __dirname.replace(/\/scripts$/, '');
const www = path.join(root, 'www');
const src = path.join(root, 'src');

fs.mkdirSync(path.join(www, 'js'), { recursive: true });

esbuild.buildSync({
  entryPoints: [path.join(src, 'app.js')],
  bundle: true,
  format: 'iife',
  outfile: path.join(www, 'js', 'app.js'),
  sourcemap: true,
  target: ['es2020'],
});

for (const mod of ['store', 'standards', 'capture-quality', 'inspect']) {
  esbuild.buildSync({
    entryPoints: [path.join(src, `${mod}.js`)],
    bundle: true,
    format: 'cjs',
    outfile: path.join(src, `${mod}.cjs.js`),
    platform: 'node',
    target: ['node18'],
  });
}

fs.copyFileSync(path.join(root, 'index.html'), path.join(www, 'index.html'));
console.log('Built 食好好 → www/');

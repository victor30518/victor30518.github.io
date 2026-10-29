// Keep game logic and dialogue in one HTML response so cached assets cannot mix versions.
// Run after editing projects/fish-30/collection.js: node scripts/build-fish30.mjs
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../projects/fish-30/',import.meta.url);
const source=readFileSync(new URL('collection.js',root),'utf8');
if(/<\/script/i.test(source))throw new Error('Inline script must not contain a closing script tag');
const version=createHash('sha256').update(source).digest('hex').slice(0,12);
const start='<!-- fish30-collection:start -->',end='<!-- fish30-collection:end -->';
const bundle=`${start}\r\n<script data-dialogue-version="${version}">\r\n${source.replace(/\r?\n/g,'\r\n')}\r\n</script>\r\n${end}`;
const file=new URL('index.html',root),html=readFileSync(file,'utf8');
const pattern=html.includes(start)?/<!-- fish30-collection:start -->[\s\S]*?<!-- fish30-collection:end -->/:/<script src="collection\.js\?v=\d+"><\/script>/;
if(!pattern.test(html))throw new Error('Could not locate collection script');
writeFileSync(file,html.replace(pattern,()=>bundle));
console.log(`Bundled dialogue version ${version}`);

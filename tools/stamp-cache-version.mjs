import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const pkg=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8"));
const version=pkg.version;
const skipDirs=new Set([".git","node_modules","reference"]);
const textExt=new Set([".js",".mjs",".html",".css",".json",".webmanifest",".md"]);
let changed=0;
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(entry.isDirectory()&&skipDirs.has(entry.name))continue;const full=path.join(dir,entry.name);if(entry.isDirectory()){walk(full);continue;}if(!textExt.has(path.extname(entry.name))&&entry.name!=="manifest.webmanifest")continue;let s=fs.readFileSync(full,"utf8"),next=s;
  next=next.replace(/([?&]v=)0\.\d+\.\d+/g,`$1${version}`);
  if(path.extname(entry.name)===".js"){
    next=next.replace(/(from\s+["\'](?:\.\.?\/)[^"\'?]+\.js)(?:\?v=0\.\d+\.\d+)?(["\'])/g,`$1?v=${version}$2`);
    next=next.replace(/(import\s*\(\s*["\'](?:\.\.?\/)[^"\'?]+\.js)(?:\?v=0\.\d+\.\d+)?(["\']\s*\))/g,`$1?v=${version}$2`);
  }
  next=next.replace(/(BUILD_VERSION\s*=\s*["'])0\.\d+\.\d+(["'])/g,`$1${version}$2`);
  next=next.replace(/(currentBuild\s*=\s*["'])0\.\d+\.\d+(["'])/g,`$1${version}$2`);
  next=next.replace(/(CARD ART STUDIO · v)0\.\d+\.\d+/g,`$1${version}`);
  if(entry.name==="build.json") next=next.replace(/("version"\s*:\s*")0\.\d+\.\d+("\s*)/,`$1${version}$2`);
  if(next!==s){fs.writeFileSync(full,next);changed++;}
}}
walk(root);
console.log(JSON.stringify({version,changedFiles:changed},null,2));

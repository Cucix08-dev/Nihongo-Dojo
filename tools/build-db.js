// Uso (Node 18+, serve internet):  node tools/build-db.js [totale=4000]
// Scarica da kanjiapi.dev i kanji mancanti (gradi 1-6, 8, jinmeiyo, resto; in ogni gruppo ordinati per frequenza)
// e aggiorna data/database.json. Le traduzioni italiane esistenti restano; data/it.json ({"日":["giorno","sole"]}) le sovrascrive.
const fs=require('fs'),vm=require('vm'),N=+process.argv[2]||4000,API='https://kanjiapi.dev/v1/kanji/';
const ctx={};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('js/data.js','utf8')+fs.readFileSync('js/api.js','utf8')+';this.fromApi=fromApi',ctx);
const file='data/database.json',db=JSON.parse(fs.readFileSync(file,'utf8')),it=JSON.parse(fs.readFileSync('data/it.json','utf8'));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function get(p){for(let i=0;i<3;i++){try{const r=await fetch(API+p);if(r.ok)return await r.json()}catch(e){}await wait(500*(i+1))}return null}
const entry=j=>{const x=ctx.fromApi(j);return{k:j.kanji,grade:j.grade,jlpt:j.jlpt,strokes:j.stroke_count,freq:j.freq_mainichi_shinbun||null,on:j.on_readings,kun:j.kun_readings,r:x.r,kana:x.kana,en:j.meanings.length?j.meanings:(j.heisig_en?[j.heisig_en]:[]),it:[]}};
async function details(chars){const out=[],q=[...chars];let d=0;
 await Promise.all(Array(8).fill(0).map(async()=>{while(q.length){const j=await get(encodeURIComponent(q.shift()));if(j&&j.on_readings.length+j.kun_readings.length&&(j.meanings.length||j.heisig_en))out.push(entry(j));if(++d%100==0)console.log('  ...',d)}}));return out}
(async()=>{const have=new Map(db.kanji.map(e=>[e.k,e])),order=db.kanji.map(e=>e.k),seen=new Set(order);
 for(const s of ['grade-1','grade-2','grade-3','grade-4','grade-5','grade-6','grade-8','jinmeiyo','all']){
  const need=N-order.length;if(need<=0)break;let add=((await get(s))||[]).filter(c=>!seen.has(c));if(s=='all')add=add.slice(0,need*2);
  const d=(await details(add)).sort((a,b)=>(a.freq||1e4)-(b.freq||1e4)).slice(0,need);
  d.forEach(e=>{order.push(e.k);seen.add(e.k);have.set(e.k,e)});console.log(s,'+',d.length)}
 db.kanji=order.map(k=>have.get(k));db.kanji.forEach(e=>{if(it[e.k])e.it=it[e.k]});
 db.meta.kanjiCount=db.kanji.length;db.meta.generated=new Date().toISOString().slice(0,10);
 fs.writeFileSync(file,'{"meta":'+JSON.stringify(db.meta)+',\n"kana":'+JSON.stringify(db.kana)+',\n"kanji":[\n'+db.kanji.map(e=>JSON.stringify(e)).join(',\n')+'\n]}\n');
 const todo=db.kanji.filter(e=>!e.it.length);fs.writeFileSync('data/it-todo.txt',todo.map(e=>e.k+'|'+e.en.join(', ')).join('\n')+'\n');
 console.log(db.kanji.length+' kanji salvati; '+todo.length+' senza italiano (elenco in data/it-todo.txt)')})();

/* Client per https://kanjiapi.dev + conversione kana <-> romaji + cache in localStorage */
let IT={};const API='https://kanjiapi.dev/v1/kanji/',LK=new Map(KANJI.map(x=>[x.k,x]));
const SETS=['grade-1','grade-2','grade-3','grade-4','grade-5','grade-6','grade-8','jinmeiyo','all'];
const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
async function jget(path){const c=store.get('kd:'+path);if(c)return c;const r=await fetch(API+path);if(!r.ok)throw new Error(r.status);const j=await r.json();store.set('kd:'+path,j);return j}

const K2R={},R2K={};
['base','dak','han','yoon'].forEach(g=>G[g].d.forEach(x=>{K2R[x.k]=x.r[0];if(!R2K[x.r[0]])R2K[x.r[0]]=x.k}));
const hira=s=>[...s].map(c=>{const n=c.charCodeAt(0);return n>=0x30A1&&n<=0x30F6?String.fromCharCode(n-0x60):c}).join('');
function toRomaji(s){s=hira(s);let o='',d=0;for(let i=0;i<s.length;){const c=s[i];
 if(c=='っ'){d=1;i++;continue}
 if(c=='ー'){o+=o.slice(-1);i++;continue}
 const k=K2R[s.substr(i,2)]?s.substr(i,2):c;let r=K2R[k]||'';
 if(d){r=r.startsWith('ch')?'t'+r:r[0]+r;d=0}o+=r;i+=k.length}return o}
function toHira(r){let o='';for(let i=0;i<r.length;){
 if(r[i]==r[i+1]&&!'aiueon'.includes(r[i])){o+='っ';i++;continue}
 const t=[3,2,1].map(n=>r.substr(i,n)).find(x=>R2K[x]);
 if(!t){o+=r[i++];continue}o+=R2K[t];i+=t.length}return o}
KANJI.forEach(x=>{x.kana=x.r.map(toHira)});

/* Converte la risposta dell'API nel formato interno */
function fromApi(j){const st=a=>a.map(x=>x.replace(/^-|-$/g,'').split('.')[0]);
 const on=st(j.on_readings||[]),kun=st(j.kun_readings||[]),kana=[...new Set([...on,...kun])];
 const full=(j.kun_readings||[]).map(x=>x.replace(/[-.]/g,''));
 const r=[...new Set([...kana,...full].map(toRomaji).filter(Boolean))];
 return{k:j.kanji,r,kana,it:'',en:(j.meanings||[]).slice(0,3).join(', ')||j.heisig_en||''}}
const IC=new Map();
async function info(c){if(LK.has(c))return LK.get(c);if(IC.has(c))return IC.get(c);const v=fromApi(await jget(encodeURIComponent(c)));if(!v.kana.length||!v.en)return null;v.it=(IT[c]||[]).slice(0,3).join(', ');IC.set(c,v);return v}
/* Traduzione EN->IT con MyMemory (gratuita, quota giornaliera limitata: per alzarla metti un'email in MM_EMAIL). Risultati salvati in cache. */
const MM_EMAIL='';
const trKey=x=>x.en.split(', ').slice(0,2).join(', ');
const trOff=()=>Date.now()-(store.get('tr:off')||0)<36e5;
let tlast=0,tq=Promise.resolve();
/* Una richiesta alla volta, con pausa tra l'una e l'altra. Al primo errore (429 / quota finita) si ferma per un'ora. */
function tr(en){const k='tr:'+en,c=store.get(k);if(c)return Promise.resolve(c);
 return tq=tq.then(async()=>{if(trOff())return '';const w=300-(Date.now()-tlast);if(w>0)await new Promise(r=>setTimeout(r,w));tlast=Date.now();
  try{const r=await fetch('https://api.mymemory.translated.net/get?langpair=en|it&q='+encodeURIComponent(en)+(MM_EMAIL?'&de='+MM_EMAIL:''));if(!r.ok)throw 0;
   const j=await r.json(),t=j.responseData&&j.responseData.translatedText;if(j.responseStatus!=200||!t||/MYMEMORY/i.test(t))throw 0;
   const v=t.toLowerCase();store.set(k,v);return v}
  catch(e){store.set('tr:off',Date.now());return ''}})}
const USE_MT=false; /* traduzione automatica (MyMemory): spenta, si usa data/database.json */
async function ital(a){if(!USE_MT)return;const u=a.filter(x=>!x.it&&!x.tried),l=$('#ld'),n=u.length;let d=0;
 for(const x of u){x.tried=1;x.it=await tr(trKey(x));l&&(l.textContent=`Traduzione in italiano ${++d} / ${n}`)}}

/* Elenco ordinato per difficoltà: prima i kanji locali, poi gradi scolastici 1-6, 8, jinmeiyo, resto. Caricato solo se serve. */
const ORDER=KANJI.map(x=>x.k),seen=new Set(ORDER),done=new Set();
async function order(n){for(const s of SETS){if(ORDER.length>=n)break;if(done.has(s))continue;
 try{(await jget(s)).forEach(c=>{if(!seen.has(c)){seen.add(c);ORDER.push(c)}});done.add(s)}catch(e){break}}
 return ORDER.slice(0,n)}

/* Carica data/database.json (richiede un server locale, es. python3 -m http.server). Se manca, restano i kanji base di data.js. */
async function loadDB(){try{IT=await(await fetch('data/it.json')).json()}catch(e){}
try{const r=await fetch('data/database.json');if(!r.ok)throw 0;const d=await r.json();
 const m=d.kanji.map(e=>({k:e.k,r:e.r,kana:e.kana,it:(e.it&&e.it.length?e.it:IT[e.k]||[]).slice(0,3).join(', '),en:(e.en||[]).slice(0,3).join(', ')}));
 const ok=m.filter(x=>x.en||x.it);KANJI.length=0;KANJI.push(...ok);LK.clear();ORDER.length=0;seen.clear();m.filter(x=>!(x.en||x.it)).forEach(x=>seen.add(x.k));ok.forEach(x=>{LK.set(x.k,x);ORDER.push(x.k);seen.add(x.k)})}catch(e){console.info('database.json non caricato: uso i dati base')}}

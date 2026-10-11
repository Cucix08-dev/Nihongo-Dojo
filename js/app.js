const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
(function(){const r=document.documentElement,t=$('#thm');let d=store.get('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
 const ap=()=>{r.dataset.theme=d;t.checked=d=='dark'};ap();t.onchange=()=>{d=t.checked?'dark':'light';store.set('theme',d);ap()}})();
const S={h:1,k:1,g:['base'],n:20,lv:0,type:'rom',lang:store.get('lang')||((navigator.language||'it').slice(0,2)=='it'?'it':'en'),ks:new Set(),js:new Set()};
/* Testi dell'interfaccia: IT / EN */
const TX={it:{tag:'Allenati su kana e kanji con flashcard.',tk:'Hiragana · Katakana',tj:'Kanji',scripts:'Alfabeti',groups:'Gruppi (modalità standard)',spec:'Simboli specifici',specH:'(se ne scegli, i gruppi vengono ignorati)',clear:'Azzera',sel:'selezionati',lvl:'Difficoltà',ktype:'Tipo di quiz',rom:'Scrivi il romaji',mean:'Scegli il significato',kana:'Scegli la lettura in kana',mix:'Misto',kspec:'Kanji specifici',kspecH:'(se ne scegli, la difficoltà viene ignorata)',nq:'Numero di domande',start:'Inizia il quiz',q:'Domanda',ok:'corrette',exit:'Esci',next:'Avanti ↵',ph:'romaji…',right:'Corretto!',ans:'Risposta:',res:'Risultato',pct:'di risposte corrette',rev:'Da ripassare',you:'tu',again:'Rifai',settings:'Impostazioni',load:'Caricamento kanji',trad:'Traduzione in italiano',a1:'Scegli almeno un alfabeto',a2:'Nessun simbolo selezionato',a3:'Impossibile caricare i kanji: controlla la connessione.',avail:'disponibili',loading:'caricamento…',theme:'Chiaro / scuro'},
en:{tag:'Practice kana and kanji with flashcards.',tk:'Hiragana · Katakana',tj:'Kanji',scripts:'Scripts',groups:'Groups (standard mode)',spec:'Specific symbols',specH:'(if you pick any, groups are ignored)',clear:'Clear',sel:'selected',lvl:'Difficulty',ktype:'Quiz type',rom:'Type the romaji',mean:'Choose the meaning',kana:'Choose the kana reading',mix:'Mixed',kspec:'Specific kanji',kspecH:'(if you pick any, difficulty is ignored)',nq:'Number of questions',start:'Start quiz',q:'Question',ok:'correct',exit:'Quit',next:'Next ↵',ph:'romaji…',right:'Correct!',ans:'Answer:',res:'Result',pct:'correct answers',rev:'To review',you:'you',again:'Retry',settings:'Settings',load:'Loading kanji',trad:'Translating',a1:'Choose at least one script',a2:'No symbols selected',a3:'Could not load the kanji: check your connection.',avail:'available',loading:'loading…',theme:'Light / dark'}};
const GN={it:{base:'Base',dak:'Dakuten (が…)',han:'Handakuten (ぱ…)',yoon:'Yōon (きゃ…)',lv:'Doppie vocali',dc:'Doppie consonanti (っ)'},en:{base:'Basic',dak:'Dakuten (が…)',han:'Handakuten (ぱ…)',yoon:'Yōon (きゃ…)',lv:'Long vowels',dc:'Double consonants (っ)'}};
const LVN=['Elementary','Easy','Medium','Hard','Japanese I','Japanese II','Japanese III','Japanese IV','Japanese V'];
const t=k=>TX[S.lang][k],lvn=i=>S.lang=='it'?LV[i][0]:LVN[i];
let T='kana',Q=null,POOL=[],pt=0,IO;
const app=$('#app');
const rd=(v)=>`<label class="c"><input type="radio" name="ty" ${S.type==v?'checked':''} onchange="S.type='${v}'">${t(v)}</label>`;

function setLang(l){S.lang=l;store.set('lang',l);document.documentElement.lang=l;
 document.querySelectorAll('.lg button').forEach(b=>b.classList.toggle('on',b.dataset.l==l));$('.sw').title=t('theme');
 if(!Q)home();else if(Q.i>=Q.q.length)end();else if(!Q.wait)show()}
document.querySelectorAll('.lg button').forEach(b=>b.onclick=()=>setLang(b.dataset.l));

function kanaUI(){const ids=[];Object.entries(G).forEach(([g,o])=>o.d.forEach(x=>ids.push([g+':'+x.k,x.k,kt(x.k)])));
 return`<h3>${t('scripts')}</h3><label class="c"><input type="checkbox" ${S.h?'checked':''} onchange="S.h=this.checked?1:0">Hiragana</label><label class="c"><input type="checkbox" ${S.k?'checked':''} onchange="S.k=this.checked?1:0">Katakana</label>
 <h3>${t('groups')}</h3>${Object.keys(G).map(g=>`<label class="c"><input type="checkbox" ${S.g.includes(g)?'checked':''} onchange="gt('${g}',this.checked)">${GN[S.lang][g]}</label>`).join('')}
 <h3>${t('spec')} <span class="muted">${t('specH')}</span></h3>
 <div class="row" style="justify-content:flex-start"><button class="btn" onclick="S.ks.clear();home()">${t('clear')}</button><span class="muted" id="cnt">${S.ks.size} ${t('sel')}</span></div>
 <div class="grid">${ids.map(([i,a,b])=>`<button class="${S.ks.has(i)?'on':''}" onclick="tg(this,'${i}')">${a}<small>${b}</small></button>`).join('')}</div>`}
function kanjiUI(){return`<h3>${t('lvl')}</h3><select onchange="S.lv=+this.value;pool()">${LV.map((l,i)=>`<option value="${i}" ${S.lv==i?'selected':''}>${lvn(i)} (${l[1]})</option>`).join('')}</select> <span class="muted" id="avail"></span>
 <h3>${t('ktype')}</h3>${['rom','mean','kana','mix'].map(rd).join('')}
 <h3>${t('kspec')} <span class="muted">${t('kspecH')}</span></h3>
 <div class="row" style="justify-content:flex-start"><button class="btn" onclick="S.js.clear();grid()">${t('clear')}</button><span class="muted" id="cnt">${S.js.size} ${t('sel')}</span></div>
 <div class="grid" id="grid"></div>`}
function home(){Q=null;const kn=T=='kanji';
 app.innerHTML=`<h1>日本語 <span>Dojo</span></h1><p class="muted">${t('tag')}</p>
 <div class="tabs"><button class="${kn?'':'on'}" onclick="T='kana';home()">${t('tk')}</button><button class="${kn?'on':''}" onclick="T='kanji';home()">${t('tj')}</button></div>
 <div class="box">${kn?kanjiUI():kanaUI()}<h3>${t('nq')}</h3><input type="number" min="1" max="500" value="${S.n}" oninput="S.n=Math.max(1,Math.min(500,+this.value||1))"></div>
 <div class="row"><button class="btn main" onclick="go()">${t('start')}</button></div>`;
 if(kn)pool()}
function gt(g,on){S.g=on?[...S.g,g]:S.g.filter(x=>x!=g)}
function tg(b,id){const s=T=='kana'?S.ks:S.js;s.has(id)?s.delete(id):s.add(id);b.classList.toggle('on');$('#cnt').textContent=s.size+' '+t('sel')}
function grid(){const g=$('#grid');if(!g)return;
 g.innerHTML=POOL.map(c=>{const x=LK.get(c);return`<button class="${S.js.has(c)?'on':''}" onclick="tg(this,'${c}')">${c}<small>${x?esc(x[S.lang]||x.en):''}</small></button>`}).join('');
 $('#cnt').textContent=S.js.size+' '+t('sel');
 IO&&IO.disconnect();IO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){IO.unobserve(e.target);fill(e.target)}}),{root:g,rootMargin:'120px'});g.querySelectorAll('button').forEach(b=>IO.observe(b))}
/* Significato di ogni kanji, caricato quando il tasto compare nella griglia */
async function fill(b){try{const x=await info(b.firstChild.textContent);if(!x){b.remove();return}const s=b.querySelector('small');s&&(s.textContent=x[S.lang]||x.en)}catch(e){}}
async function pool(){const k=++pt,n=LV[S.lv][1],a=$('#avail');a.textContent=t('loading');
 const l=await order(n);if(k!=pt)return;POOL=l;grid();a.textContent=l.length<n?`${t('avail')}: ${l.length}`:`${l.length} kanji`}

async function load(chars){const m=new Map(),u=[...new Set(chars)],tot=u.length;let d=0;
 const w=async()=>{while(u.length){const c=u.pop();try{const x=await info(c);if(x)m.set(c,x)}catch(e){}const l=$('#ld');l&&(l.textContent=`${t('load')} ${++d} / ${tot}`)}};
 await Promise.all(Array(8).fill(0).map(w));return m}
async function go(){let q=[];
 if(T=='kana'){if(!S.h&&!S.k)return alert(t('a1'));const items=[];
  Object.entries(G).forEach(([g,o])=>o.d.forEach(x=>{if(!(S.ks.size?S.ks.has(g+':'+x.k):S.g.includes(g)))return;
   const K=g=='lv'&&x.k[0]==x.k[1]?kt(x.k[0])+'ー':kt(x.k);
   if(S.h)items.push({k:x.k,r:x.r,alt:K,g});
   if(S.k)items.push({k:K,r:x.r,alt:x.k,g})}));
  if(!items.length)return alert(t('a2'));
  while(q.length<S.n)q.push(...shuf(items));Q={q:q.slice(0,S.n),kana:1,pool:[]}}
 else{app.innerHTML=`<div class="box load"><p id="ld">${t('loading')}</p></div>`;
  const ch=S.js.size?[...S.js]:await order(LV[S.lv][1]);
  while(q.length<S.n)q.push(...shuf(ch));q=q.slice(0,S.n);
  const m=await load(q),it=q.map(c=>m.get(c)).filter(Boolean);
  if(!it.length){alert(t('a3'));return home()}
  Q={q:it,pool:[...m.values(),...KANJI]}}
 Object.assign(Q,{i:0,ok:0,bad:[],wait:0});show()}
const dist=(c,f,good)=>shuf([good,...[...new Set(shuf(Q.pool).filter(x=>x.k!=c.k).map(f).filter(v=>v&&v!=good))].slice(0,3)]);
function show(){if(Q.i>=Q.q.length)return end();const c=Q.q[Q.i];
 const t0=Q.kana?'rom':S.type=='mix'?['rom','mean','kana'][Math.random()*3|0]:S.type;Q.t=t0;let o;
 if(t0=='rom')o=`<div class="row"><input type="text" id="a" autocomplete="off" autocapitalize="off" placeholder="${t('ph')}" onkeydown="if(event.key=='Enter'){event.stopPropagation();ans(this.value)}"><button class="btn main" onclick="ans($('#a').value)">OK</button></div>`;
 else{let f;if(t0=='mean'){const L=S.lang=='it'&&c.it?'it':'en';f=x=>x[L];Q.good=c[L]}else{f=x=>x.kana.slice(0,3).join('・');Q.good=f(c)}
  o=`<div class="opts">${dist(c,f,Q.good).map(v=>`<button class="btn" onclick="ans(this.textContent)">${esc(v)}</button>`).join('')}</div>`}
 app.innerHTML=`<div class="muted">${t('q')} ${Q.i+1} / ${Q.q.length} · ${t('ok')}: ${Q.ok}</div><div class="bar"><i style="width:${Q.i/Q.q.length*100}%"></i></div>
 <div class="box"><div class="muted" style="text-align:center">${t(t0)}</div><div class="big">${c.k}</div>${o}<div class="fb" id="fb"></div>
 <div class="row"><button class="btn" onclick="home()">${t('exit')}</button><button class="btn main" id="nx" style="display:none" onclick="nxt()">${t('next')}</button></div></div>`;
 const a=$('#a');a&&a.focus()}
function ans(v){if(Q.wait)return;Q.wait=1;const c=Q.q[Q.i],ty=Q.t,ok=ty=='rom'?c.r.some(r=>norm(r)==norm(v)):v==Q.good;
 const good=ty=='rom'?c.r.slice(0,4).join(' / '):Q.good;
 const ex=Q.kana?` — ${c.alt} · ${GN[S.lang][c.g]}`:` — ${c.kana.slice(0,3).join('・')} · ${c[S.lang]||c.en}`;
 ok?Q.ok++:Q.bad.push({k:c.k,good:good+ex,v});
 const f=$('#fb');f.className='fb '+(ok?'ok':'ko');f.textContent=(ok?'✓ '+t('right')+' ':'✗ '+t('ans')+' ')+good+ex;
 document.querySelectorAll('.opts .btn').forEach(b=>{b.disabled=true;if(b.textContent==good)b.classList.add('good');else if(b.textContent==v)b.classList.add('bad')});$('.big').classList.add(ok?'yes':'no');
 const a=$('#a');if(a)a.disabled=true;$('#nx').style.display=''}
function nxt(){Q.wait=0;Q.i++;show()}
document.addEventListener('keydown',e=>{if(e.key=='Enter'&&Q&&Q.wait&&Q.i<Q.q.length)nxt()});
function end(){Q.wait=0;const p=Math.round(Q.ok/Q.q.length*100);
 app.innerHTML=`<h1>${t('res')}</h1><div class="box"><div class="big">${Q.ok}/${Q.q.length}</div><p style="text-align:center">${p}% ${t('pct')}</p></div>
 ${Q.bad.length?`<div class="box wrap"><h3>${t('rev')}</h3>${Q.bad.map(b=>`<div><b style="font-size:1.4rem">${b.k}</b> → ${esc(b.good)} <span class="muted">(${t('you')}: ${esc(b.v||'—')})</span></div>`).join('')}</div>`:''}
 <div class="row"><button class="btn main" onclick="go()">${t('again')}</button><button class="btn" onclick="home()">${t('settings')}</button></div>`}
setLang(S.lang);loadDB().then(home);

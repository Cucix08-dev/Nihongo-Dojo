const $=s=>document.querySelector(s),shuf=a=>[...a].sort(()=>Math.random()-.5);
const H=s=>s.split(' ').map(t=>{const[k,r]=t.split(':');return{k,r:r.split('/')}});
const G={
base:{n:'Base',d:H('あ:a い:i う:u え:e お:o か:ka き:ki く:ku け:ke こ:ko さ:sa し:shi す:su せ:se そ:so た:ta ち:chi つ:tsu て:te と:to な:na に:ni ぬ:nu ね:ne の:no は:ha ひ:hi ふ:fu へ:he ほ:ho ま:ma み:mi む:mu め:me も:mo や:ya ゆ:yu よ:yo ら:ra り:ri る:ru れ:re ろ:ro わ:wa を:wo/o ん:n/nn')},
dak:{n:'Dakuten (が…)',d:H('が:ga ぎ:gi ぐ:gu げ:ge ご:go ざ:za じ:ji ず:zu ぜ:ze ぞ:zo だ:da ぢ:ji づ:zu で:de ど:do ば:ba び:bi ぶ:bu べ:be ぼ:bo')},
han:{n:'Handakuten (ぱ…)',d:H('ぱ:pa ぴ:pi ぷ:pu ぺ:pe ぽ:po')},
yoon:{n:'Yōon (きゃ…)',d:H('きゃ:kya きゅ:kyu きょ:kyo しゃ:sha しゅ:shu しょ:sho ちゃ:cha ちゅ:chu ちょ:cho にゃ:nya にゅ:nyu にょ:nyo ひゃ:hya ひゅ:hyu ひょ:hyo みゃ:mya みゅ:myu みょ:myo りゃ:rya りゅ:ryu りょ:ryo ぎゃ:gya ぎゅ:gyu ぎょ:gyo じゃ:ja じゅ:ju じょ:jo びゃ:bya びゅ:byu びょ:byo ぴゃ:pya ぴゅ:pyu ぴょ:pyo')},
lv:{n:'Doppie vocali',d:H('ああ:aa いい:ii うう:uu ええ:ee えい:ei おお:oo おう:ou/oo')},
dc:{n:'Doppie consonanti (っ)',d:[]}};
const bm={};[...G.base.d,...G.han.d].forEach(x=>bm[x.k]=x.r[0]);
'かきくけこさしすせそたちつてとぱぴぷぺぽ'.split('').forEach(c=>{const r=bm[c];G.dc.d.push({k:'っ'+c,r:[r.startsWith('ch')?'t'+r:r[0]+r]})});
const kt=s=>[...s].map(c=>{const n=c.charCodeAt(0);return n>=0x3041&&n<=0x3096?String.fromCharCode(n+0x60):c}).join('');
const norm=s=>s.toLowerCase().replace(/[^a-z]/g,'').replace(/tsu/g,'tu').replace(/shi/g,'si').replace(/chi/g,'ti').replace(/sh/g,'sy').replace(/ch/g,'ty').replace(/fu/g,'hu').replace(/ji/g,'zi').replace(/j/g,'zy').replace(/di/g,'zi').replace(/du/g,'zu');
const LV=[['Elementare',30],['Facile',100],['Medio',200],['Difficile',400],['Giapponese I',600],['Giapponese II',1000],['Giapponese III',2200],['Giapponese IV',3000],['Giapponese V',4000]];
/* Dati kanji: simbolo|letture romaji|italiano|inglese. Aggiungi altre righe per arrivare a 4000, in ordine di difficoltà. */
const KANJI=`一|ichi|uno|one
二|ni|due|two
三|san|tre|three
四|shi/yon|quattro|four
五|go|cinque|five
六|roku|sei|six
七|shichi/nana|sette|seven
八|hachi|otto|eight
九|kyuu/ku|nove|nine
十|juu|dieci|ten
人|jin/nin/hito|persona|person
日|nichi/jitsu/hi|giorno|day
月|getsu/gatsu/tsuki|luna|moon
火|ka/hi|fuoco|fire
水|sui/mizu|acqua|water
木|moku/ki|albero|tree
金|kin/kane|oro|gold
土|do/tsuchi|terra|earth
山|san/yama|montagna|mountain
川|sen/kawa|fiume|river
大|dai/tai/oo|grande|big
小|shou/ko/chii|piccolo|small
上|jou/ue|sopra|above
下|ka/ge/shita|sotto|below
中|chuu/naka|dentro|middle
口|kou/kuchi|bocca|mouth
目|moku/me|occhio|eye
耳|ji/mimi|orecchio|ear
手|shu/te|mano|hand
足|soku/ashi|piede|foot
力|ryoku/chikara|forza|power
男|dan/otoko|uomo|man
女|jo/onna|donna|woman
子|shi/ko|bambino|child
学|gaku|studio|study
生|sei/shou/i/nama|vita|life
先|sen/saki|prima|previous
年|nen/toshi|anno|year
百|hyaku|cento|hundred
千|sen/chi|mille|thousand
万|man|diecimila|ten thousand
円|en/maru|yen|yen
本|hon/moto|libro|book
車|sha/kuruma|auto|car
田|den/ta|risaia|rice field
空|kuu/sora|cielo|sky
天|ten|paradiso|heaven
雨|u/ame|pioggia|rain
花|ka/hana|fiore|flower
草|sou/kusa|erba|grass
虫|chuu/mushi|insetto|insect
犬|ken/inu|cane|dog
猫|byou/neko|gatto|cat
魚|gyo/sakana|pesce|fish
鳥|chou/tori|uccello|bird
白|haku/shiro|bianco|white
赤|seki/aka|rosso|red
青|sei/ao|blu|blue
黒|koku/kuro|nero|black
右|yuu/migi|destra|right
左|sa/hidari|sinistra|left
前|zen/mae|davanti|front
後|go/kou/ushiro/ato|dopo|after
外|gai/soto|fuori|outside
内|nai/uchi|interno|inside
西|sei/nishi|ovest|west
東|tou/higashi|est|east
南|nan/minami|sud|south
北|hoku/kita|nord|north
間|kan/aida|intervallo|interval
時|ji/toki|tempo|time
分|bun/fun/wa|minuto|minute
今|kon/kin/ima|adesso|now
何|ka/nani|cosa|what
語|go/kata|lingua|language
言|gen/gon/i|dire|say
話|wa/hanashi|parlare|talk
読|doku/yo|leggere|read
書|sho/ka|scrivere|write
見|ken/mi|vedere|see
聞|bun/ki|ascoltare|listen
食|shoku/ta|mangiare|eat
飲|in/no|bere|drink
行|kou/gyou/i/yuku|andare|go
来|rai/ku/kita|venire|come
出|shutsu/de|uscire|exit
入|nyuu/hai/i|entrare|enter
休|kyuu/yasu|riposo|rest
立|ritsu/ta|stare in piedi|stand
国|koku/kuni|paese|country
会|kai/a|incontrare|meet
社|sha/yashiro|società|company
電|den|elettricità|electricity
気|ki/ke|spirito|spirit
校|kou|scuola|school
名|mei/na|nome|name
友|yuu/tomo|amico|friend
母|bo/haha|madre|mother
父|fu/chichi|padre|father
新|shin/atarashi|nuovo|new
古|ko/furu|vecchio|old
長|chou/naga|lungo|long
高|kou/taka|alto|high
安|an/yasu|economico|cheap
多|ta/oo|molto|many
少|shou/suku|poco|few
店|ten/mise|negozio|shop
駅|eki|stazione|station
道|dou/michi|strada|road
海|kai/umi|mare|sea
森|shin/mori|foresta|forest
林|rin/hayashi|boschetto|grove
石|seki/ishi|pietra|stone
正|sei/shou/tadashi|giusto|correct
早|sou/haya|presto|early
午|go|mezzogiorno|noon
半|han|metà|half
毎|mai|ogni|every
週|shuu|settimana|week
曜|you|giorno della settimana|day of week
朝|chou/asa|mattina|morning
昼|chuu/hiru|diurno|daytime
夜|ya/yoru|notte|night
夕|seki/yuu|sera|evening
春|shun/haru|primavera|spring
夏|ka/natsu|estate|summer
秋|shuu/aki|autunno|autumn
冬|tou/fuyu|inverno|winter
風|fuu/kaze|vento|wind
雪|setsu/yuki|neve|snow
雲|un/kumo|nuvola|cloud
星|sei/hoshi|stella|star
光|kou/hikari|luce|light
音|on/oto|suono|sound
色|shoku/iro|colore|color
形|kei/katachi|forma|shape
体|tai/karada|corpo|body
頭|tou/atama|testa|head
顔|gan/kao|viso|face
心|shin/kokoro|cuore|heart
思|shi/omo|pensare|think
知|chi/shi|sapere|know
考|kou/kanga|riflettere|consider
教|kyou/oshi|insegnare|teach
習|shuu/nara|imparare|learn
字|ji|carattere|character
文|bun/fumi|frase|sentence
数|suu/kazu|numero|number
理|ri|ragione|reason
科|ka|materia|subject
歌|ka/uta|canzone|song
楽|gaku/raku/tano|musica|music
絵|kai/e|dipinto|painting
画|ga/kaku|disegno|drawing
写|sha/utsu|copiare|copy
真|shin/ma|vero|true
家|ka/ie|casa|house
室|shitsu/muro|stanza|room
門|mon/kado|cancello|gate
戸|ko/to|porta|door
窓|sou/mado|finestra|window
町|chou/machi|città|town
村|son/mura|villaggio|village
市|shi/ichi|mercato|market
都|to/miyako|capitale|capital
県|ken|prefettura|prefecture
場|jou/ba|luogo|place
所|sho/tokoro|posto|spot
地|chi/ji|suolo|ground
図|zu/to|mappa|map
通|tsuu/too|passare|pass through
走|sou/hashi|correre|run
歩|ho/aru|camminare|walk
止|shi/to|fermare|stop
送|sou/oku|inviare|send
待|tai/ma|aspettare|wait
持|ji/mo|tenere|hold
取|shu/to|prendere|take
使|shi/tsuka|usare|use
作|saku/tsuku|fare|make
買|bai/ka|comprare|buy
売|bai/u|vendere|sell
開|kai/hira/a|aprire|open
閉|hei/shi|chiudere|close
始|shi/haji|iniziare|begin
終|shuu/o|finire|end
死|shi|morte|death
愛|ai|amore|love
好|kou/su|piacere|like
悪|aku/waru|cattivo|bad
強|kyou/tsuyo|forte|strong
弱|jaku/yowa|debole|weak
重|juu/omo|pesante|heavy
軽|kei/karu|leggero|lightweight
明|mei/aka|luminoso|bright
暗|an/kura|buio|dark
広|kou/hiro|ampio|wide
太|tai/futo|grosso|thick
細|sai/hoso|sottile|thin
近|kin/chika|vicino|near
遠|en/too|lontano|far
速|soku/haya|veloce|fast
遅|chi/oso|lento|slow
暑|sho/atsu|caldo|hot weather
寒|kan/samu|freddo|cold
熱|netsu/atsu|calore|heat
甘|kan/ama|dolce|sweet
辛|shin/kara|piccante|spicy
米|bei/kome|riso|rice
肉|niku|carne|meat
茶|cha|tè|tea
牛|gyuu/ushi|mucca|cow
馬|ba/uma|cavallo|horse
王|ou|re|king
医|i|medico|doctor
者|sha/mono|persona (chi fa)|one who
病|byou/yamai|malattia|illness
薬|yaku/kusuri|medicina|medicine
仕|shi|servire|serve
事|ji/koto|fatto|matter`.split('\n').map(l=>{const[k,r,it,en]=l.split('|');return{k,r:r.split('/'),it,en}});


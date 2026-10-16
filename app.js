
const DB_KEY="immobile-visite-v3";
const TYPES=["Appartamento","Attico / mansarda","Casa indipendente","Villetta / bifamiliare","Terratetto","Rustico / casale","Nuova costruzione","Locale / altro"];
const PURPOSES=["Investimento da locare","Acquisto e rivendita","Uso personale","Uso misto / da definire"];
const commonSections=[
 {title:"Stato dell'immobile",qs:[
  ["Ci sono segni di umidità, muffa, infiltrazioni o perdite d'acqua?",1],
  ["Infissi, persiane/tapparelle e vetri sono in buono stato?",0],
  ["Impianto elettrico: anno, conformità, quadro e potenza disponibile?",1],
  ["Impianto idraulico: anno, stato e presenza di perdite o cali di pressione?",1],
  ["Bagni e cucina richiedono lavori immediati?",0],
  ["È presente climatizzazione? Età e stato degli apparecchi?",0],
  ["Quali lavori sono stati eseguiti negli ultimi 10 anni?",0],
  ["Ci sono difetti noti o problemi ricorrenti dichiarati dal proprietario?",1]
 ]},
 {title:"Documentazione e regolarità",qs:[
  ["Qual è la categoria e la rendita catastale?",1],
  ["Posso ricevere la planimetria catastale prima di una proposta?",1],
  ["La planimetria corrisponde allo stato reale dell'immobile?",1],
  ["La conformità urbanistica e catastale è già stata verificata da un tecnico?",1],
  ["L'APE è disponibile e in corso di validità?",0],
  ["Ci sono ipoteche, pignoramenti, usufrutti, successioni o altri vincoli?",1],
  ["Esistono pratiche edilizie aperte, sanatorie, condoni o difformità note?",1],
  ["Gli impianti hanno dichiarazioni di conformità o rispondenza?",0]
 ]},
 {title:"Costi e gestione",qs:[
  ["Quali sono i costi ordinari annuali oltre alle utenze?",1],
  ["Sono previsti interventi importanti o manutenzioni straordinarie?",1],
  ["Quali sono IMU e altre imposte locali indicative per questo immobile?",0],
  ["Ci sono servitù, passi, strade private o costi condivisi con terzi?",0],
  ["Ci sono assicurazioni, consorzi o altri oneri ricorrenti?",0]
 ]},
 {title:"Zona e rivendibilità",qs:[
  ["Quali sono i principali punti di forza e debolezza della microzona?",0],
  ["Parcheggio, accessi e servizi sono adeguati al profilo dell'acquirente/inquilino?",1],
  ["Ci sono fonti di rumore, traffico, attività o criticità nelle vicinanze?",1],
  ["Qual è il tempo medio di vendita di immobili simili in zona?",0],
  ["Ci sono progetti urbanistici o infrastrutturali che possono influire sul valore?",0]
 ]},
 {title:"Prezzo e trattativa",qs:[
  ["Da quanto tempo è in vendita e perché viene venduto?",0],
  ["Il prezzo richiesto è trattabile?",1],
  ["Il proprietario ha già ricevuto offerte? Con quale esito?",0],
  ["Qual è la provvigione dell'agenzia, IVA compresa?",1],
  ["Ci sono altri costi a carico dell'acquirente?",1],
  ["Il venditore ha esigenze particolari sui tempi di preliminare o rogito?",0]
 ]}
];
const condoSection={title:"Condominio e parti comuni",qs:[
 ["Qual è la spesa condominiale ordinaria e cosa comprende?",1],
 ["Riscaldamento e acqua sono centralizzati? Come vengono contabilizzati?",1],
 ["Ci sono morosità rilevanti o contenziosi nel condominio?",1],
 ["Ci sono lavori straordinari già deliberati o previsti?",1],
 ["Posso ricevere ultimi due consuntivi e ultimi verbali di assemblea?",1],
 ["Stato di tetto, facciate, balconi, ascensore e impianti comuni?",0],
 ["Il regolamento condominiale limita locazioni, animali o altri usi?",0]
]};
const independentSection={title:"Esterni, tetto e pertinenze",qs:[
 ["Tetto e grondaie: quando sono stati rifatti o manutenzionati?",1],
 ["Facciate, muri perimetrali e fondazioni presentano crepe o infiltrazioni?",1],
 ["Terreno, giardino, recinzioni e confini corrispondono alle mappe?",1],
 ["Ci sono pozzi, fosse biologiche, depuratori o impianti autonomi da mantenere?",0],
 ["Accessi carrabili/pedonali e servitù sono regolari?",1],
 ["Garage, cantine, annessi e pertinenze sono catastalmente regolari?",1]
]};
const investmentSection={title:"Locazione e redditività",qs:[
 ["A quale canone mensile realistico si può locare oggi l'immobile?",1],
 ["Il canone stimato è al netto delle spese accessorie?",1],
 ["Avete locato recentemente immobili realmente comparabili? A quale canone?",1],
 ["Qual è il profilo di inquilino più frequente in questa zona?",0],
 ["Quanto tempo serve mediamente per trovare un inquilino?",0],
 ["Quali lavori/arredi aumenterebbero maggiormente il canone o la domanda?",0],
 ["Ci sono limitazioni alle locazioni brevi o transitorie?",0]
]};
const resaleSection={title:"Potenziale rivendita / lavori",qs:[
 ["Quali lavori sono realmente necessari prima della rivendita?",1],
 ["Ci sono preventivi o stime recenti per i lavori principali?",0],
 ["Quale prezzo di vendita avrebbe l'immobile dopo una ristrutturazione ragionevole?",1],
 ["Quali immobili ristrutturati comparabili sono stati venduti recentemente?",1],
 ["Ci sono elementi che possono allungare i tempi di rivendita?",0]
]};
const personalChecks=[
 "Luminosità naturale adeguata","Rumore accettabile","Nessun odore o segno evidente di umidità",
 "Spazi e distribuzione realmente funzionali","Infissi in condizioni accettabili","Bagni senza criticità evidenti",
 "Accesso e parcheggio pratici","Contesto esterno e vicinato convincenti","Parti comuni / esterni curati",
 "Immobile coerente con il prezzo richiesto"
];
const scoreNames=["Posizione","Stato immobile","Qualità fabbricato/pertinenze","Prezzo rispetto al mercato","Costi e rischi nascosti","Rivendibilità futura"];

let db={visits:[]};
let currentId=null;

function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function today(){return new Date().toISOString().slice(0,10)}
function emptyVisit(){
 return {
  id:uid(),createdAt:Date.now(),updatedAt:Date.now(),
  meta:{title:"",address:"",city:"",date:today(),type:"Appartamento",purpose:"Investimento da locare",price:"",sqm:"",floor:"",elevator:"",parking:"",occupied:"",agency:"",link:""},
  finance:{rent:"",condo:"",heating:"",extra:"",extraAmount:"",agencyFee:"",cadastral:"",renovation:"",furniture:"",negotiable:"",agentPrice:""},
  checks:{},notes:{},personal:{},scores:{},decision:"",finalNotes:""
 };
}
function loadDB(){
 try{const x=JSON.parse(localStorage.getItem(DB_KEY));if(x&&Array.isArray(x.visits))db=x}catch(e){}
}
function saveDB(){localStorage.setItem(DB_KEY,JSON.stringify(db))}
function getVisit(){return db.visits.find(v=>v.id===currentId)}
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]))}
function money(n){const x=Number(n);return Number.isFinite(x)&&x>0?new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(x):"—"}
function pct(n){return Number.isFinite(n)?n.toFixed(2).replace(".",",")+"%":"—"}

function appSections(v){
 const arr=[commonSections[0]];
 if(["Appartamento","Attico / mansarda","Nuova costruzione"].includes(v.meta.type))arr.push(condoSection);else arr.push(independentSection);
 arr.push(commonSections[1],commonSections[2],commonSections[3]);
 if(v.meta.purpose==="Investimento da locare"||v.meta.purpose==="Uso misto / da definire")arr.push(investmentSection);
 if(v.meta.purpose==="Acquisto e rivendita"||v.meta.purpose==="Uso misto / da definire")arr.push(resaleSection);
 arr.push(commonSections[4]);
 return arr;
}
function decisionBadge(d){
 if(d==="INSERIRE")return '<span class="badge ok">INSERIRE</span>';
 if(d==="ATTENDERE")return '<span class="badge warn">ATTENDERE</span>';
 if(d==="SCARTARE")return '<span class="badge bad">SCARTARE</span>';
 return '<span class="badge">DA VALUTARE</span>';
}
function renderDashboard(){
 currentId=null;document.getElementById("editor").classList.add("hidden");document.getElementById("dashboard").classList.remove("hidden");
 const list=document.getElementById("visitList");
 if(!db.visits.length){list.innerHTML='<div class="empty">Nessuna visita salvata.<br>Crea la prima scheda immobile.</div>';return}
 list.innerHTML=[...db.visits].sort((a,b)=>b.updatedAt-a.updatedAt).map(v=>{
  const title=v.meta.title||v.meta.address||"Immobile senza nome";
  const meta=[v.meta.type,v.meta.city,v.meta.price?money(v.meta.price):"",v.meta.sqm?(v.meta.sqm+" m²"):""].filter(Boolean).join(" · ");
  return '<div class="visit-item"><div class="visit-item-top"><div><div class="visit-title">'+esc(title)+'</div><div class="visit-meta">'+esc(meta)+'</div></div>'+decisionBadge(v.decision)+'</div><div class="item-actions"><button class="btn small dark" onclick="openVisit(\''+v.id+'\')">Apri</button><button class="btn small soft" onclick="duplicateVisit(\''+v.id+'\')">Duplica</button><button class="btn small danger" onclick="deleteVisit(\''+v.id+'\')">Elimina</button></div></div>';
 }).join("");
}
function newVisit(){
 const v=emptyVisit();db.visits.push(v);saveDB();openVisit(v.id)
}
function duplicateVisit(id){
 const src=db.visits.find(v=>v.id===id);if(!src)return;
 const v=JSON.parse(JSON.stringify(src));v.id=uid();v.createdAt=Date.now();v.updatedAt=Date.now();v.meta.title=(src.meta.title||"Immobile")+" - copia";db.visits.push(v);saveDB();renderDashboard()
}
function deleteVisit(id){
 const v=db.visits.find(v=>v.id===id);if(!v)return;
 if(confirm("Eliminare questa visita e tutti gli appunti?")){db.visits=db.visits.filter(x=>x.id!==id);saveDB();renderDashboard()}
}
function openVisit(id){
 currentId=id;document.getElementById("dashboard").classList.add("hidden");document.getElementById("editor").classList.remove("hidden");renderEditor()
}
function field(id,label,type="text",options=null,placeholder=""){
 if(type==="select")return '<div class="field"><label>'+label+'</label><select data-meta="'+id+'">'+options.map(o=>'<option>'+o+'</option>').join("")+'</select></div>';
 return '<div class="field"><label>'+label+'</label><input data-meta="'+id+'" type="'+type+'" '+(type==="number"?'inputmode="decimal"':'')+' placeholder="'+placeholder+'"></div>';
}
function renderEditor(){
 const v=getVisit();if(!v)return renderDashboard();
 document.getElementById("editorTitle").textContent=v.meta.title||v.meta.address||"Nuova visita";
 document.getElementById("metaForm").innerHTML=
  field("title","Nome breve / riferimento","text",null,"es. Bilocale Cisanello")+
  '<div class="grid">'+field("address","Indirizzo","text",null,"Via, numero")+field("city","Comune / zona","text",null,"Comune o quartiere")+'</div>'+
  '<div class="grid">'+field("date","Data visita","date")+field("type","Tipologia","select",TYPES)+'</div>'+
  field("purpose","Obiettivo","select",PURPOSE)+
  '<div class="grid">'+field("price","Prezzo richiesto (€)","number",null,"150000")+field("sqm","Superficie commerciale (m²)","number",null,"70")+'</div>'+
  '<div class="grid">'+field("floor","Piano","text",null,"es. 2°")+field("elevator","Ascensore","select",["Da verificare","Sì","No","Non applicabile"])+'</div>'+
  '<div class="grid">'+field("parking","Posto auto / garage","text",null,"es. garage 18 m²")+field("occupied","Stato occupazionale","select",["Da verificare","Libero","Occupato dal proprietario","Locato","Altro"])+'</div>'+
  '<div class="grid">'+field("agency","Agenzia / referente","text")+field("link","Link annuncio","text")+'</div>';
 document.querySelectorAll("[data-meta]").forEach(el=>{
  el.value=v.meta[el.dataset.meta]??"";
  el.addEventListener("input",()=>{v.meta[el.dataset.meta]=el.value;touch(v);if(["type","purpose"].includes(el.dataset.meta))renderEditor();else{updateMetrics();document.getElementById("editorTitle").textContent=v.meta.title||v.meta.address||"Nuova visita"}})
 });
 renderSections(v);renderFinance(v);renderScores(v);updateMetrics();updateProgress()
}
function renderSections(v){
 const host=document.getElementById("sections");host.innerHTML="";
 appSections(v).forEach((sec,si)=>{
  const d=document.createElement("details");d.className="section";d.open=true;
  d.innerHTML='<summary><span class="num">'+(si+1)+'</span>'+sec.title+'<span class="count" id="count-'+si+'">0/'+sec.qs.length+'</span></summary><div class="content"></div>';
  const c=d.querySelector(".content");
  sec.qs.forEach((q,qi)=>{
   const id="s"+si+"q"+qi;
   const w=document.createElement("div");w.className="q";
   w.innerHTML='<div class="qline"><input type="checkbox" id="'+id+'"><label class="qtext" for="'+id+'">'+q[0]+(q[1]?' <span class="priority">PRIORITÀ</span>':'')+'</label></div><textarea placeholder="Appunti / risposta" data-note="'+id+'"></textarea>';
   c.appendChild(w);
   const cb=w.querySelector("input");const ta=w.querySelector("textarea");
   cb.checked=!!v.checks[id];ta.value=v.notes[id]||"";
   cb.addEventListener("change",()=>{v.checks[id]=cb.checked;touch(v);updateProgress()});
   ta.addEventListener("input",()=>{v.notes[id]=ta.value;touch(v)});
  });
  host.appendChild(d);
 });
 const ph=document.getElementById("personal");ph.innerHTML="";
 personalChecks.forEach((t,i)=>{
  const id="p"+i,w=document.createElement("div");w.className="q";w.innerHTML='<div class="qline"><input type="checkbox" id="'+id+'"><label class="qtext" for="'+id+'">'+t+'</label></div>';
  ph.appendChild(w);const cb=w.querySelector("input");cb.checked=!!v.personal[id];cb.addEventListener("change",()=>{v.personal[id]=cb.checked;touch(v);updateProgress()});
 });
}
function renderFinance(v){
 const f=v.finance;
 const html='<div class="grid">'+
 financeField("rent","Canone realistico (€ / mese)","number","es. 700")+
 financeField("condo","Condominio / spese comuni (€ / mese)","number","es. 100")+
 financeSelect("heating","Riscaldamento incluso?",["Da verificare","Sì","No","Parziale","Non applicabile"])+
 financeSelect("extra","Straordinarie previste?",["Da verificare","No","Sì"])+
 financeField("extraAmount","Importo straordinarie (€)","number","")+
 financeField("renovation","Lavori iniziali stimati (€)","number","")+
 financeField("agencyFee","Provvigione agenzia","text","% o importo IVA compresa")+
 financeField("cadastral","Rendita catastale","text","")+
 financeSelect("furniture","Arredi inclusi?",["Da verificare","Sì","No","Parziale"])+
 financeSelect("negotiable","Prezzo trattabile?",["Da verificare","Sì","No"])+
 financeField("agentPrice","Prezzo che l'agente lascia intendere (€)","number","")+
 '</div>';
 document.getElementById("finance").innerHTML=html;
 document.querySelectorAll("[data-fin]").forEach(el=>{el.value=f[el.dataset.fin]??"";el.addEventListener("input",()=>{f[el.dataset.fin]=el.value;touch(v);updateMetrics()})});
}
function financeField(id,label,type,ph){return '<div class="field"><label>'+label+'</label><input data-fin="'+id+'" type="'+type+'" '+(type==="number"?'inputmode="decimal"':'')+' placeholder="'+ph+'"></div>'}
function financeSelect(id,label,opts){return '<div class="field"><label>'+label+'</label><select data-fin="'+id+'">'+opts.map(o=>'<option>'+o+'</option>').join("")+'</select></div>'}
function renderScores(v){
 const sh=document.getElementById("scores");sh.innerHTML="";
 scoreNames.forEach((t,i)=>{
  const r=document.createElement("div");r.className="scoreRow";r.innerHTML='<div class="scoreTitle">'+t+'</div><div class="score" data-score="'+i+'">'+[1,2,3,4,5].map(n=>'<button type="button" data-n="'+n+'">'+n+'</button>').join("")+'</div>';
  sh.appendChild(r);r.querySelectorAll("button").forEach(b=>{if(String(v.scores[i])===b.dataset.n)b.classList.add("active");b.onclick=()=>{v.scores[i]=b.dataset.n;touch(v);renderScores(v)}})
 });
 document.querySelectorAll("#decisions button").forEach(b=>{b.classList.toggle("active",b.dataset.v===v.decision);b.onclick=()=>{v.decision=b.dataset.v;touch(v);renderScores(v)}});
 const n=document.getElementById("finalNotes");n.value=v.finalNotes||"";n.oninput=()=>{v.finalNotes=n.value;touch(v)};
}
function updateMetrics(){
 const v=getVisit();if(!v)return;const p=Number(v.meta.price),s=Number(v.meta.sqm),r=Number(v.finance.rent);
 document.getElementById("metricPsm").textContent=p>0&&s>0?Math.round(p/s).toLocaleString("it-IT")+" €/m²":"—";
 document.getElementById("metricYield").textContent=p>0&&r>0?pct(r*12/p*100):"—";
 const extras=Number(v.finance.extraAmount||0)+Number(v.finance.renovation||0);
 document.getElementById("metricBase").textContent=p>0?money(p+extras):"—";
}
function updateProgress(){
 const v=getVisit();if(!v)return;const secs=appSections(v);let total=0,done=0;
 secs.forEach((sec,si)=>{let sd=0;sec.qs.forEach((_,qi)=>{total++;if(v.checks["s"+si+"q"+qi]){done++;sd++}});const x=document.getElementById("count-"+si);if(x)x.textContent=sd+"/"+sec.qs.length});
 let pd=0;personalChecks.forEach((_,i)=>{total++;if(v.personal["p"+i]){done++;pd++}});
 document.getElementById("personalCount").textContent=pd+"/"+personalChecks.length;document.getElementById("progressText").textContent=done+"/"+total+" controlli";document.getElementById("progressBar").style.width=(total?done/total*100:0)+"%";
}
function touch(v){v.updatedAt=Date.now();saveDB()}
function summary(v=getVisit()){
 if(!v)return"";let out="VISITA IMMOBILE\n";
 out+=(v.meta.title||v.meta.address||"Immobile")+"\n"+[v.meta.address,v.meta.city,v.meta.type,v.meta.purpose].filter(Boolean).join(" · ")+"\n";
 out+="Prezzo: "+money(v.meta.price)+" | Superficie: "+(v.meta.sqm||"-")+" m²\n";
 const p=Number(v.meta.price),s=Number(v.meta.sqm),r=Number(v.finance.rent);
 if(p&&s)out+="Prezzo/m²: "+Math.round(p/s).toLocaleString("it-IT")+" €/m²\n";
 if(p&&r)out+="Rendimento lordo indicativo: "+pct(r*12/p*100)+"\n";
 out+="\n";
 appSections(v).forEach((sec,si)=>{out+=(si+1)+". "+sec.title.toUpperCase()+"\n";sec.qs.forEach((q,qi)=>{const id="s"+si+"q"+qi;out+=(v.checks[id]?"✓ ":"□ ")+q[0]+(v.notes[id]?"\n   → "+v.notes[id]:"")+"\n"});out+="\n"});
 out+="DATI ECONOMICI\nCanone: "+(v.finance.rent||"-")+" €/mese\nCondominio/spese comuni: "+(v.finance.condo||"-")+" €/mese\nRiscaldamento incluso: "+(v.finance.heating||"-")+"\nStraordinarie: "+(v.finance.extra||"-")+" "+(v.finance.extraAmount?("("+v.finance.extraAmount+" €)"):"")+"\nLavori iniziali: "+(v.finance.renovation||"-")+" €\nProvvigione: "+(v.finance.agencyFee||"-")+"\nRendita catastale: "+(v.finance.cadastral||"-")+"\nTrattabile: "+(v.finance.negotiable||"-")+"\nIndicazione agente: "+(v.finance.agentPrice||"-")+" €\n\n";
 scoreNames.forEach((t,i)=>out+=t+": "+(v.scores[i]||"-")+"/5\n");
 out+="Decisione: "+(v.decision||"-")+"\nNote finali: "+(v.finalNotes||"-");
 return out;
}
async function shareSummary(){const t=summary();if(navigator.share){try{await navigator.share({title:"Visita immobile",text:t})}catch(e){}}else copySummary()}
async function copySummary(){await navigator.clipboard.writeText(summary());flash("Riepilogo copiato")}
function flash(msg){const b=document.getElementById("copyBtn"),old=b.textContent;b.textContent=msg;setTimeout(()=>b.textContent=old,1300)}
function exportBackup(){
 const blob=new Blob([JSON.stringify(db,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="visite-immobiliari-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)
}
function importBackup(ev){
 const file=ev.target.files[0];if(!file)return;const rd=new FileReader();rd.onload=()=>{try{const x=JSON.parse(rd.result);if(!x||!Array.isArray(x.visits))throw new Error();if(confirm("Importare il backup sostituendo le visite presenti?")){db=x;saveDB();renderDashboard()}}catch(e){alert("Backup non valido")}};rd.readAsText(file);ev.target.value=""
}
function resetCurrent(){
 const v=getVisit();if(v&&confirm("Azzerare checklist, appunti e giudizi di questa visita mantenendo i dati dell'immobile?")){v.checks={};v.notes={};v.personal={};v.scores={};v.decision="";v.finalNotes="";touch(v);renderEditor()}
}
window.openVisit=openVisit;window.duplicateVisit=duplicateVisit;window.deleteVisit=deleteVisit;

document.addEventListener("DOMContentLoaded",()=>{
 loadDB();renderDashboard();
 document.getElementById("newBtn").onclick=newVisit;
 document.getElementById("backBtn").onclick=renderDashboard;
 document.getElementById("shareBtn").onclick=shareSummary;
 document.getElementById("copyBtn").onclick=copySummary;
 document.getElementById("resetBtn").onclick=resetCurrent;
 document.getElementById("exportBtn").onclick=exportBackup;
 document.getElementById("importBtn").onclick=()=>document.getElementById("importFile").click();
 document.getElementById("importFile").onchange=importBackup;
 if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
});

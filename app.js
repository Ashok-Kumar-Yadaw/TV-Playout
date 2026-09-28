const $=id=>document.getElementById(id);
const program=$("program"),preview=$("preview");
const API="https://api.github.com/repos/Ashok-Kumar-Yadaw/TV-Playout/contents/videos?ref=main";
let S=JSON.parse(localStorage.getItem("tvv5auto")||"null")||{chs:[[],[],[],[]],ch:0,i:0,logs:[]};
let previewI=0;
const base=new URL(".",location.href);
function save(){localStorage.setItem("tvv5auto",JSON.stringify(S))}
function log(x){S.logs.push(new Date().toTimeString().slice(0,8)+" • "+x);S.logs=S.logs.slice(-100);save();$("log").textContent=S.logs.slice().reverse().join("\n")}
function fmt(n){n=Math.max(0,Math.floor(n||0));return[Math.floor(n/3600),Math.floor(n%3600/60),n%60].map(x=>String(x).padStart(2,"0")).join(":")}
function fileURL(path){return new URL(path.split("/").map(encodeURIComponent).join("/"),base).href}
function renderChannels(){let n=$("channels");n.innerHTML=S.chs.map((_,i)=>`<button class="ch ${i===S.ch?"active":""}" onclick="switchCh(${i})">CH ${i+1}</button>`).join("")}
function switchCh(i){S.ch=i;S.i=0;render();renderChannels();log("CH "+(i+1))}
function render(){let l=S.chs[S.ch];$("playlist").innerHTML=l.map((x,i)=>`<div class="item ${i===S.i?"active":""}"><b>${i+1}</b><span>${x.title}<small>${x.src}</small></span><button onclick="previewItem(${i})">PREVIEW</button><button onclick="take(${i})">TAKE</button></div>`).join("")||'<p class="hint">कोई MP4 नहीं मिली। SCAN / REFRESH VIDEOS दबाएँ।</p>';$("now").textContent=l[S.i]?.title||"—";$("next").textContent=(l[S.i+1]||l[0])?.title||"—";$("chbug").textContent="CH "+(S.ch+1);$("log").textContent=S.logs.slice().reverse().join("\n")}
function previewItem(i){let x=S.chs[S.ch][i];if(!x)return;previewI=i;preview.src=fileURL(x.src);$("previewTitle").textContent=x.title;preview.load();preview.play().catch(()=>{});log("PREVIEW • "+x.title)}
function take(i){let x=S.chs[S.ch][i];if(!x)return;S.i=i;program.src=fileURL(x.src);program.load();render();program.play().catch(()=>{$("state").textContent="PRESS PLAY"});log("TAKE • "+x.title)}
async function scanVideos(){ $("scanStatus").textContent="SCANNING...";try{let r=await fetch(API,{cache:"no-store"});if(!r.ok)throw new Error("GitHub API HTTP "+r.status);let data=await r.json();let mp4=data.filter(x=>x.type==="file"&&/\.mp4$/i.test(x.name));S.chs[0]=mp4.map(x=>({src:"videos/"+x.name,title:x.name}));S.i=0;save();$("scanStatus").textContent=mp4.length+" MP4 FOUND";$("repoInfo").textContent="Ashok-Kumar-Yadaw / TV-Playout / videos";render();log("SCAN • "+mp4.length+" MP4 found")}catch(e){$("scanStatus").textContent="SCAN ERROR";$("repoInfo").textContent=e.message;log("SCAN ERROR • "+e.message);render()}}
$("scan").onclick=scanVideos;
$("take").onclick=()=>take(previewI);$("play").onclick=()=>program.play().catch(()=>{});$("pause").onclick=()=>program.pause();$("stop").onclick=()=>{program.pause();program.currentTime=0;log("STOP")};
$("nextBtn").onclick=()=>{let l=S.chs[S.ch];if(!l.length)return;if(S.i+1<l.length)S.i++;else if($("loop").checked)S.i=0;else return;take(S.i)};
program.onloadedmetadata=()=>{$("state").textContent="READY"};program.onplaying=()=>{$("state").textContent="PLAYING"};program.ontimeupdate=()=>{$("remain").textContent=fmt(program.duration-program.currentTime)};program.onended=()=>{if($("auto").checked||$("loop").checked)$("nextBtn").click()};program.onerror=()=>{ $("state").textContent="MEDIA ERROR";log("MEDIA ERROR • "+(S.chs[S.ch][S.i]?.src||""))};
$("add").onclick=()=>{let src=$("src").value.trim();if(!src)return;S.chs[S.ch].push({src,title:src.split("/").pop()});save();render();$("src").value="";log("MANUAL ADD • "+src)};
function clock(){let d=new Date();$("clock").textContent=d.toTimeString().slice(0,8);if($("schedule").checked){let t=d.toTimeString().slice(0,5),i=S.chs[S.ch].findIndex(x=>x.time===t);if(i>=0&&i!==S.i)take(i)}}setInterval(clock,1000);clock();renderChannels();render();scanVideos();
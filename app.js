const $=id=>document.getElementById(id),player=$("player"),preview=$("preview");
let channels=JSON.parse(localStorage.getItem("tvV5Channels")||"null")||Array.from({length:4},()=>[]);
let logs=JSON.parse(localStorage.getItem("tvV5Logs")||"[]"),ch=0,idx=0,selected=0,backup=false;
if(!channels[0].length)channels[0]=[
{title:"Morning Program",src:"videos/program1.mp4",time:"06:00",dur:"00:30:00",type:"PROGRAM"},
{title:"Commercial Break",src:"videos/commercial.mp4",time:"06:30",dur:"00:02:00",type:"COMMERCIAL"},
{title:"News Bulletin",src:"videos/news.mp4",time:"06:32",dur:"00:15:00",type:"NEWS"},
{title:"Channel Promo",src:"videos/promo.mp4",time:"06:47",dur:"00:00:30",type:"PROMO"}];
function save(){localStorage.setItem("tvV5Channels",JSON.stringify(channels));localStorage.setItem("tvV5Logs",JSON.stringify(logs.slice(-150)))}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function fmt(n){if(!isFinite(n)||n<0)n=0;n=Math.floor(n);let h=Math.floor(n/3600),m=Math.floor(n%3600/60),s=n%60;return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")}
function toast(t){$("toast").textContent=t;$("toast").style.display="block";clearTimeout(window.tm);window.tm=setTimeout(()=>$("toast").style.display="none",2300)}
function log(t){let ts=new Date().toTimeString().slice(0,8);logs.push(ts+" • "+t);save();renderLog()}
function renderLog(){$("log").innerHTML=logs.slice(-80).reverse().map(x=>`<div>${esc(x)}</div>`).join("")}
function renderChannels(){let e=$("channels");e.innerHTML="";for(let i=0;i<4;i++){let b=document.createElement("button");b.className="ch"+(i===ch?" active":"");b.innerHTML=`CH ${i+1}<small>${i===ch?"● ON AIR":"STANDBY"}</small>`;b.onclick=()=>switchCh(i);e.appendChild(b)}}
function render(){
 let l=channels[ch],tl=$("timeline");tl.innerHTML="";
 l.forEach((x,i)=>{let d=document.createElement("div");d.className="event "+String(x.type||"PROGRAM").toLowerCase()+(i===idx?" active":"");
 d.innerHTML=`<button class="del">✕</button><b>${esc(x.time||"--:--")} • ${esc(x.title)}</b><small>${esc(x.type)} • ${esc(x.dur||"")}</small>`;
 d.onclick=e=>{if(e.target.classList.contains("del"))return;selected=i;previewItem(i)};
 d.querySelector(".del").onclick=e=>{e.stopPropagation();l.splice(i,1);if(idx>=l.length)idx=Math.max(0,l.length-1);selected=Math.min(selected,Math.max(0,l.length-1));save();render();update();};
 tl.appendChild(d)});
 $("timelineInfo").textContent=l.length+" EVENTS";renderSchedule();renderLog();update();
}
function update(){let l=channels[ch],cur=l[idx],n=l[idx+1]||l[0];$("outLabel").textContent="CH "+(ch+1)+(backup?" • BACKUP":"");$("now").textContent=cur?cur.title:"—";$("next").textContent=n?n.title:"—";$("logoBug").textContent="CHANNEL "+(ch+1);$("logoBug").style.display=$("logo").checked?"block":"none"}
function previewItem(i){let x=channels[ch][i];if(!x)return;selected=i;preview.src=x.src;$("previewTitle").textContent=x.title;$("previewPath").textContent=x.src;$("previewState").textContent="PREVIEW";preview.play().catch(()=>{});}
function load(i){if(!channels[ch][i])return;idx=i;selected=i;player.src=channels[ch][i].src;update();render();player.play().catch(()=>toast("PLAY दबाएँ"))}
function take(){if(!channels[ch][selected])return;load(selected);log("TAKE • "+channels[ch][selected].title)}
function next(){let l=channels[ch];if(!l.length)return;if(idx+1<l.length)idx++;else if($("loop").checked||$("mode247").checked)idx=0;else return toast("Playlist समाप्त");load(idx);log("NEXT • "+l[idx].title)}
function switchCh(i){ch=i;idx=0;selected=0;backup=false;player.pause();player.removeAttribute("src");player.load();renderChannels();render();toast("CH "+(i+1)+" selected");log("CHANNEL • CH "+(i+1))}
$("take").onclick=take;
$("play").onclick=()=>{if(!player.src&&channels[ch].length)load(idx);else player.play().catch(()=>toast("PLAY दबाएँ"))};
$("pause").onclick=()=>{player.pause();log("PAUSE")};
$("stop").onclick=()=>{player.pause();player.currentTime=0;log("STOP")};
$("nextBtn").onclick=next;
$("emergency").onclick=()=>{player.pause();player.currentTime=0;$("playoutStatus").textContent="● EMERGENCY";toast("EMERGENCY STOP");log("EMERGENCY STOP")};
player.onended=()=>{if($("auto").checked||$("mode247").checked)next()};
player.ontimeupdate=()=>{$("remain").textContent=fmt(player.duration-player.currentTime)};
$("add").onclick=()=>{let src=$("src").value.trim(),title=$("title").value.trim()||src.split("/").pop();if(!src)return toast("MP4 path डालें");channels[ch].push({src,title,time:$("time").value||"--:--",dur:$("dur").value||"00:00:00",type:$("type").value});$("src").value="";$("title").value="";save();render();toast("Event added");log("ADD • "+title)};
$("switchBackup").onclick=()=>{if(!$("backupArmed").checked)return toast("Backup Armed नहीं है");backup=!backup;$("primary").textContent=backup?"● STANDBY":"● READY";$("backup").textContent=backup?"● ACTIVE":"● READY";$("switchBackup").textContent=backup?"RETURN TO PRIMARY":"SWITCH TO BACKUP";update();log(backup?"BACKUP • ACTIVE":"PRIMARY • ACTIVE")};
$("clearTimes").onclick=()=>{channels[ch].forEach(x=>x.time="--:--");save();render();log("SCHEDULE TIMES CLEARED")};
$("clearLog").onclick=()=>{logs=[];save();renderLog()};
$("lower").onchange=e=>$("lowerThird").style.display=e.target.checked?"block":"none";
$("applyLower").onclick=()=>{$("lowerThird").textContent=$("lowerText").value||"TV PROGRAM";$("lower").checked=true;$("lowerThird").style.display="block";log("GRAPHICS • LOWER THIRD")};
$("breakingToggle").onchange=e=>$("breaking").style.display=e.target.checked?"block":"none";
$("applyBreaking").onclick=()=>{$("breaking").textContent=$("breakingText").value||"BREAKING NEWS";$("breakingToggle").checked=true;$("breaking").style.display="block";log("GRAPHICS • BREAKING NEWS")};
$("ticker").onchange=e=>{if(e.target.checked){$("ticker").classList.add("on")}else{$("ticker").classList.remove("on")}};
$("applyTicker").onclick=()=>{toast("Ticker text set");log("GRAPHICS • TICKER UPDATED")};
function renderSchedule(){$("schedule").innerHTML=channels[ch].filter(x=>x.time&&x.time!=="--:--").sort((a,b)=>a.time.localeCompare(b.time)).map(x=>`<div class="sched"><b>${esc(x.time)}</b><span>${esc(x.title)}</span><span>${esc(x.type)}</span></div>`).join("")||'<div style="padding:14px;color:#718094">No scheduled events</div>'}
function clock(){let d=new Date();$("clock").textContent=[d.getHours(),d.getMinutes(),d.getSeconds()].map(x=>String(x).padStart(2,"0")).join(":");
 if($("autoschedule").checked){let t=d.toTimeString().slice(0,5),l=channels[ch],i=l.findIndex(x=>x.time===t);if(i>=0&&i!==idx){load(i);log("SCHEDULE • "+l[i].title)}}}
setInterval(clock,1000);clock();renderChannels();render();

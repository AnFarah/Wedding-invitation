const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const inviteId = (params.get("id") || "").trim().toUpperCase();

const invite = {
  general: !inviteId,
  name: "ضيوفنا الأعزاء",
  maxGuests: 10,
  code: inviteId
};

async function initGuest(){
  if(inviteId){
    try{
      const res = await fetch("assets/data/guests.json",{cache:"no-store"});
      const data = await res.json();
      if(data[inviteId]){
        invite.general = false;
        invite.name = data[inviteId].name;
        invite.maxGuests = Number(data[inviteId].maxGuests || 1);
      }
    }catch(e){}
  }

  $("coverGuest").textContent = invite.name;
  $("heroGuest").textContent = invite.name;
  $("guestInput").value = invite.general ? "" : invite.name;
  $("inviteCode").value = invite.general ? "GENERAL" : invite.code;
  $("guestCount").max = invite.maxGuests;

  if(invite.general){
    $("coverLabel").textContent = "دعوة عامة إلى";
    $("heroLabel").textContent = "يسعدنا أن نتشرّف بحضور";
    document.title = "دعوة زفاف أنس ومريم";
  }else{
    $("coverLabel").textContent = "دعوة خاصة إلى";
    $("heroLabel").textContent = "نتشرّف بدعوة";
    $("rsvpText").textContent = `الدعوة مخصصة حتى ${invite.maxGuests} أشخاص.`;
    document.title = `دعوة زفاف أنس ومريم | ${invite.name}`;
  }
}
initGuest();

const card = $("openCard");
const cover = $("cover");
const app = $("app");
const music = $("music");
const musicBtn = $("musicBtn");
let playing = false;

card.addEventListener("click", async ()=>{
  card.classList.add("is-opening");
  try{
    music.volume = .3;
    await music.play();
    playing = true;
    musicBtn.textContent = "❚❚";
  }catch(e){}
  setTimeout(()=>{
    cover.classList.add("is-hidden");
    document.body.classList.remove("is-locked");
    app.classList.add("is-visible");
  },520);
});

musicBtn.addEventListener("click", async ()=>{
  if(playing){
    music.pause();
    playing = false;
    musicBtn.textContent = "♫";
  }else{
    try{
      await music.play();
      playing = true;
      musicBtn.textContent = "❚❚";
    }catch(e){}
  }
});

const target = new Date("2026-08-28T19:00:00+04:00").getTime();
function tick(){
  let diff = Math.max(0,target-Date.now());
  $("days").textContent = String(Math.floor(diff/86400000)).padStart(2,"0");
  diff%=86400000;
  $("hours").textContent = String(Math.floor(diff/3600000)).padStart(2,"0");
  diff%=3600000;
  $("minutes").textContent = String(Math.floor(diff/60000)).padStart(2,"0");
  $("seconds").textContent = String(Math.floor((diff%60000)/1000)).padStart(2,"0");
}
tick();
setInterval(tick,1000);

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

$("calendarBtn").addEventListener("click",()=>{
  const ics=`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Anas Maryem Wedding//AR
BEGIN:VEVENT
UID:anas-maryem-20260828
DTSTART:20260828T150000Z
DTEND:20260828T190000Z
SUMMARY:حفل زفاف أنس ومريم
LOCATION:Oud Metha Ballroom, Movenpick Bur Dubai
END:VEVENT
END:VCALENDAR`;
  const blob=new Blob([ics],{type:"text/calendar;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download="Anas-Maryem-Wedding.ics";a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
});

$("rsvpForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(e.currentTarget).entries());
  const list=JSON.parse(localStorage.getItem("weddingResponses")||"[]");
  list.push({...data,submittedAt:new Date().toISOString()});
  localStorage.setItem("weddingResponses",JSON.stringify(list));
  $("success").style.display="block";
});

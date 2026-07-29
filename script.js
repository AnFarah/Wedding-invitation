const $ = id => document.getElementById(id);
const cover = $("cover");
const app = $("app");
const card = $("openCard");
const music = $("music");
const musicBtn = $("musicBtn");
let playing = false;

card.addEventListener("click", ()=>{
  card.classList.add("opening");
  app.classList.add("visible");
  document.body.classList.remove("locked");
  setTimeout(()=>cover.classList.add("hidden"), 90);

  music.volume = .25;
  music.play().then(()=>{
    playing = true;
    musicBtn.textContent = "❚❚";
  }).catch(()=>{});
});

musicBtn.addEventListener("click", ()=>{
  if(playing){
    music.pause();
    playing = false;
    musicBtn.textContent = "♫";
  }else{
    music.play().then(()=>{
      playing = true;
      musicBtn.textContent = "❚❚";
    }).catch(()=>{});
  }
});

const target = new Date("2026-08-28T19:00:00+04:00").getTime();
function tick(){
  let diff = Math.max(0, target - Date.now());
  $("days").textContent = String(Math.floor(diff / 86400000)).padStart(2,"0");
  diff %= 86400000;
  $("hours").textContent = String(Math.floor(diff / 3600000)).padStart(2,"0");
  diff %= 3600000;
  $("minutes").textContent = String(Math.floor(diff / 60000)).padStart(2,"0");
  $("seconds").textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2,"0");
}
tick();
setInterval(tick,1000);

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

$("calendarBtn").addEventListener("click", ()=>{
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Anas Maryem Wedding//AR
BEGIN:VEVENT
UID:anas-maryem-20260828
DTSTART:20260828T150000Z
DTEND:20260828T190000Z
SUMMARY:حفل زفاف أنس ومريم
LOCATION:Oud Metha Ballroom, Movenpick Bur Dubai, Dubai, UAE
END:VEVENT
END:VCALENDAR`;
  const blob = new Blob([ics], {type:"text/calendar;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Anas-Maryem-Wedding.ics";
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
});

const opening = document.getElementById('opening');
const openInvitation = document.getElementById('openInvitation');
const site = document.getElementById('site');
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let playing = false;

openInvitation.addEventListener('click', async () => {
  try {
    music.volume = 0.34;
    await music.play();
    playing = true;
    musicToggle.textContent = '❚❚';
  } catch (e) {}
  opening.classList.add('hide');
  document.body.classList.remove('locked');
  site.classList.add('show');
});

musicToggle.addEventListener('click', async () => {
  if (playing) {
    music.pause();
    playing = false;
    musicToggle.textContent = '♫';
  } else {
    try {
      await music.play();
      playing = true;
      musicToggle.textContent = '❚❚';
    } catch(e) {}
  }
});

const target = new Date('2026-08-28T19:00:00+04:00').getTime();
function tick(){
  let diff = Math.max(0, target - Date.now());
  const d = Math.floor(diff/86400000); diff%=86400000;
  const h = Math.floor(diff/3600000); diff%=3600000;
  const m = Math.floor(diff/60000);
  const s = Math.floor((diff%60000)/1000);
  document.getElementById('days').textContent = String(d).padStart(2,'0');
  document.getElementById('hours').textContent = String(h).padStart(2,'0');
  document.getElementById('minutes').textContent = String(m).padStart(2,'0');
  document.getElementById('seconds').textContent = String(s).padStart(2,'0');
}
tick(); setInterval(tick,1000);

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('show');
  });
},{threshold:.16});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.getElementById('calendarBtn').addEventListener('click',()=>{
  const ics=`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Anas Maryem Wedding//AR
BEGIN:VEVENT
UID:anas-maryem-20260828
DTSTAMP:20260716T110000Z
DTSTART:20260828T150000Z
DTEND:20260828T190000Z
SUMMARY:حفل زفاف أنس ومريم
LOCATION:Oud Metha Ballroom, Movenpick Bur Dubai
DESCRIPTION:نتشرف بحضوركم حفل زفاف أنس ومريم
END:VEVENT
END:VCALENDAR`;
  const blob=new Blob([ics],{type:'text/calendar;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='Anas-Maryem-Wedding.ics';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
});

document.getElementById('rsvpForm').addEventListener('submit',e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(e.currentTarget).entries());
  localStorage.setItem('anasMaryemRSVP',JSON.stringify(data));
  document.getElementById('success').style.display='block';
});

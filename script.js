const cinematic = document.getElementById('cinematic');
const enterBtn = document.getElementById('enterBtn');
const mainContent = document.getElementById('mainContent');
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let playing = false;

enterBtn.addEventListener('click', async () => {
  try {
    music.volume = 0.35;
    await music.play();
    playing = true;
    musicToggle.textContent = '❚❚';
  } catch (e) {}
  cinematic.classList.add('hide');
  document.body.classList.remove('locked');
  mainContent.classList.add('show');
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
    } catch (e) {}
  }
});

const target = new Date('2026-08-28T19:00:00+04:00').getTime();
function updateCountdown() {
  let diff = Math.max(0, target - Date.now());
  const d = Math.floor(diff / 86400000); diff %= 86400000;
  const h = Math.floor(diff / 3600000); diff %= 3600000;
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  days.textContent = String(d).padStart(2,'0');
  hours.textContent = String(h).padStart(2,'0');
  minutes.textContent = String(m).padStart(2,'0');
  seconds.textContent = String(s).padStart(2,'0');
}
updateCountdown(); setInterval(updateCountdown,1000);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
},{threshold:.18});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.getElementById('calendarBtn').addEventListener('click', () => {
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Anas Maryem Wedding//AR
BEGIN:VEVENT
UID:anas-maryem-wedding-20260828
DTSTAMP:20260716T110000Z
DTSTART:20260828T150000Z
DTEND:20260828T190000Z
SUMMARY:حفل زفاف أنس ومريم
LOCATION:Oud Metha Ballroom, Movenpick Bur Dubai
DESCRIPTION:نتشرف بحضوركم حفل زفاف أنس ومريم
END:VEVENT
END:VCALENDAR`;
  const blob = new Blob([ics], {type:'text/calendar;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'Anas-Maryem-Wedding.ics'; a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
});

document.getElementById('rsvpForm').addEventListener('submit', e => {
  e.preventDefault();
  const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
  localStorage.setItem('anasMaryemRSVP', JSON.stringify(payload));
  document.getElementById('successMsg').style.display = 'block';
});

/* Golden star field */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];
function resize(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth*dpr; canvas.height = innerHeight*dpr;
  canvas.style.width = innerWidth+'px'; canvas.style.height = innerHeight+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  stars = Array.from({length: Math.min(180, Math.floor(innerWidth/5))},()=>({
    x:Math.random()*innerWidth,y:Math.random()*innerHeight,
    r:Math.random()*1.5+.25,a:Math.random()*.8+.2,v:Math.random()*.02+.005
  }));
}
function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const s of stars){
    s.a += s.v;
    if(s.a>1 || s.a<.15) s.v*=-1;
    ctx.beginPath();
    ctx.fillStyle=`rgba(232,204,145,${s.a})`;
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
  }
  requestAnimationFrame(draw);
}
addEventListener('resize',resize); resize(); draw();

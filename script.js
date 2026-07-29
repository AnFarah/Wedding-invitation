const byId = (id) => document.getElementById(id);
const params = new URLSearchParams(window.location.search);
const inviteId = (params.get('id') || '').trim().toUpperCase();

const invitation = {
  isGeneral: !inviteId,
  guestName: 'ضيوفنا الأعزاء',
  maxGuests: 10,
  inviteId
};

async function loadInvitation() {
  if (inviteId) {
    try {
      const response = await fetch('assets/data/guests.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Guest list unavailable');
      const guests = await response.json();
      const guest = guests[inviteId];
      if (guest?.name) {
        invitation.isGeneral = false;
        invitation.guestName = guest.name;
        invitation.maxGuests = Number(guest.maxGuests || 1);
      }
    } catch (error) {
      invitation.isGeneral = true;
    }
  }
  applyInvitation();
}

function applyInvitation() {
  byId('guestNameCard').textContent = invitation.guestName;
  byId('guestNameHero').textContent = invitation.guestName;
  byId('guestInput').value = invitation.isGeneral ? '' : invitation.guestName;
  byId('inviteCode').value = invitation.isGeneral ? 'GENERAL' : invitation.inviteId;
  byId('guestCount').max = invitation.maxGuests;

  if (invitation.isGeneral) {
    byId('cardAudienceLabel').textContent = 'دعوة عامة إلى';
    byId('heroAudienceLabel').textContent = 'يسعدنا أن نتشرّف بحضور';
    document.title = 'دعوة زفاف أنس ومريم';
  } else {
    byId('cardAudienceLabel').textContent = 'دعوة خاصة إلى';
    byId('heroAudienceLabel').textContent = 'نتشرّف بدعوة';
    document.title = `دعوة زفاف أنس ومريم | ${invitation.guestName}`;
  }
}

loadInvitation();

const opening = byId('opening');
const card = byId('inviteCard');
const site = byId('site');
const music = byId('bgMusic');
const musicToggle = byId('musicToggle');
let playing = false;

async function openCard() {
  card.classList.add('open');
  try {
    music.volume = 0.34;
    await music.play();
    playing = true;
    musicToggle.textContent = '❚❚';
  } catch (error) {}
  setTimeout(() => {
    opening.classList.add('hide');
    document.body.classList.remove('locked');
    site.classList.add('show');
  }, 850);
}

card.addEventListener('click', openCard);
card.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') openCard();
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
    } catch (error) {}
  }
});

const target = new Date('2026-08-28T19:00:00+04:00').getTime();
function tick() {
  let remaining = Math.max(0, target - Date.now());
  byId('days').textContent = String(Math.floor(remaining / 86400000)).padStart(2, '0');
  remaining %= 86400000;
  byId('hours').textContent = String(Math.floor(remaining / 3600000)).padStart(2, '0');
  remaining %= 3600000;
  byId('minutes').textContent = String(Math.floor(remaining / 60000)).padStart(2, '0');
  byId('seconds').textContent = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
}
tick();
setInterval(tick, 1000);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.16 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

byId('rsvpForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const responses = JSON.parse(localStorage.getItem('anasMaryemResponses') || '[]');
  responses.push({ ...data, submittedAt: new Date().toISOString() });
  localStorage.setItem('anasMaryemResponses', JSON.stringify(responses));
  byId('success').style.display = 'block';
});

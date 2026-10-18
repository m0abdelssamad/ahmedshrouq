// Attempt to start the background music automatically when the invitation opens.
// Some browsers block audible autoplay until the visitor interacts with the page.
const backgroundMusic = document.getElementById('backgroundMusic');
if (backgroundMusic) {
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.25;
  const tryBackgroundMusic = () => {
    if (backgroundMusic.paused) {
      const playback = backgroundMusic.play();
      if (playback && typeof playback.catch === 'function') playback.catch(() => {
        // Autoplay was blocked by the browser. It cannot be forced without user interaction.
      });
    }
  };
  document.addEventListener('DOMContentLoaded', tryBackgroundMusic, { once: true });
  window.addEventListener('pageshow', tryBackgroundMusic);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryBackgroundMusic();
  });
  tryBackgroundMusic();
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

// The event begins at 4:00 PM Alexandria/Cairo time on 29 October 2026.
const eventDate = new Date('2026-10-29T16:00:00+02:00');
const pad = value => String(value).padStart(2, '0');
function updateCountdown() {
  const distance = eventDate.getTime() - Date.now();
  if (distance <= 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    document.querySelector('.countdown-label').textContent = 'أهلاً بكم، نتمنى لكم وقتاً سعيداً';
    return;
  }
  document.getElementById('days').textContent = pad(Math.floor(distance / 86400000));
  document.getElementById('hours').textContent = pad(Math.floor(distance / 3600000) % 24);
  document.getElementById('minutes').textContent = pad(Math.floor(distance / 60000) % 60);
  document.getElementById('seconds').textContent = pad(Math.floor(distance / 1000) % 60);
}
updateCountdown();
setInterval(updateCountdown, 1000);

document.getElementById('calendarBtn').addEventListener('click', () => {
  const start = '20261029T140000Z';
  const end = '20261029T180000Z';
  const ics = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invitation//AR',
    'CALSCALE:GREGORIAN','BEGIN:VEVENT',
    `DTSTART:${start}`,`DTEND:${end}`,
    'SUMMARY:زفاف أحمد وشروق',
    'DESCRIPTION:موعد استقبال زفاف أحمد وشروق',
    'LOCATION:فندق 6 أكتوبر قاعة سي جاردن، الإسكندرية',
    'END:VEVENT','END:VCALENDAR'
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'wedding-ahmed-shorouq.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

const rsvpForm = document.getElementById('rsvpForm');
if (rsvpForm) rsvpForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('guestName').value.trim();
  const attendance = document.getElementById('attendance').value;
  const message = `السلام عليكم، أنا ${name}. ${attendance} لحفل زفاف أحمد وشروق يوم الخميس 29 أكتوبر 2026.`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});

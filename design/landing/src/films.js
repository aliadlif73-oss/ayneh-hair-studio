/* The three service films: one <video>, three tabs. Only the tab that is asked for is
   downloaded (preload=none + a src swap), the clip plays only while it is on screen, and a
   clip that cannot be fetched says so instead of leaving a black rectangle.
   The clips have no audio track, so there is no mute control to mislead anyone; the film is
   muted autoplay only, and reduced-motion / save-data visitors get the poster with a play
   button instead of a film they did not ask for. */
(()=>{
  const root = document.querySelector('.films'); if (!root) return;
  const video = root.querySelector('video'), tabs = [...root.querySelectorAll('[data-film]')];
  const error = root.querySelector('#filmError'), title = root.querySelector('#filmTitle');
  const text = root.querySelector('#filmText');
  const playBtn = root.querySelector('#filmPlay');
  if (!video || !tabs.length) return;
  const FILMS = {
    hair:   ['مدل مو',    'مشتری مدل را روی عکس خودش می‌بیند و همان را برای شما می‌فرستد.'],
    lashes: ['مدل مژه',   'حالت و حجم مژه روی عکس چشم خودش، پیش از گرفتن نوبت.'],
    nails:  ['طرح و رنگ ناخن', 'طرح و رنگ ناخن را روی عکس دست خودش امتحان می‌کند.'],
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const auto = !reduced && !saveData;
  let current = '', visible = false, wanted = false;

  function stop() { if (!video.paused) video.pause(); }
  function play() {
    if (!visible || !wanted || document.hidden) return;
    video.play().catch(() => {});
  }
  function mark(playing) {
    root.classList.toggle('is-playing', playing);
    if (playBtn) {
      playBtn.hidden = playing;
      playBtn.setAttribute('aria-label', playing ? 'توقف ویدئو' : 'پخش ویدئو');
    }
  }
  /* Switching tabs is the only thing that loads a clip; the 'current' guard stops a second
     request for the same file, so re-clicking the open tab never redownloads it. */
  function select(key, autoPlay) {
    if (!FILMS[key]) return;
    error.hidden = true; video.classList.remove('is-broken');
    if (current !== key) {
      current = key;
      stop();
      video.poster = 'assets/' + key + '-poster.webp';
      video.src = 'assets/video/' + key + '.mp4';
      video.setAttribute('aria-label', 'ویدئوی ' + FILMS[key][0]);
    } else if (video.ended) {
      video.currentTime = 0;
    }
    wanted = !!autoPlay;
    title.textContent = FILMS[key][0];
    text.textContent = FILMS[key][1];
    tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.film === key)));
    if (autoPlay) play(); else mark(false);
  }

  tabs.forEach(tab => tab.addEventListener('click', () => select(tab.dataset.film, true)));
  if (playBtn) playBtn.addEventListener('click', () => {
    if (video.paused) { wanted = true; play(); } else stop();
  });
  video.addEventListener('playing', () => mark(true));
  video.addEventListener('waiting', () => root.classList.remove('is-playing'));
  video.addEventListener('pause', () => mark(false));
  video.addEventListener('error', () => {
    mark(false);
    video.classList.add('is-broken');
    error.textContent = 'این ویدئو بارگیری نشد. برای تلاش دوباره، دکمهٔ همین خدمت را بزنید.';
    error.hidden = false;
  });
  /* Autoplay only while on screen; scrolling past pauses instead of burning the visitor's
     battery on a film she cannot see. */
  new IntersectionObserver(([entry]) => {
    visible = entry.intersectionRatio >= .35;
    if (visible && auto) { wanted = true; play(); } else if (!visible) stop();
  }, { threshold: [.35] }).observe(video);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else play(); });
  select('hair', auto);
})();

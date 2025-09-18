
(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Copy buttons (any element with data-addr)
  const copyButtons = document.querySelectorAll('[data-addr]');
  copyButtons.forEach((btn)=>{
    btn.addEventListener('click', async () => {
      try {
        const addr = btn.getAttribute('data-addr');
        await navigator.clipboard.writeText(addr);
        const original = btn.textContent;
        btn.textContent = 'Copied ✔';
        setTimeout(() => btn.textContent = original || 'Copy', 1500);
      } catch (e) {
        const original = btn.textContent;
        btn.textContent = 'Copy failed';
        setTimeout(() => btn.textContent = original || 'Copy', 2000);
      }
    });
  });

  // Background video autoplay helpers
  const vid = document.getElementById('bg-video');
  if (vid){
    vid.muted = true;
    vid.setAttribute('playsinline', '');
    const tryPlay = () => vid.play().catch(()=>{});
    document.addEventListener('click', tryPlay, { once:true });
    document.addEventListener('touchstart', tryPlay, { once:true });
  }

  // Sound toggle
  const toggle = document.getElementById('sound-toggle');
  if (toggle && vid){
    const setBtn = (on)=> toggle.textContent = on ? '🔊 Sound: ON' : '🔈 Sound: OFF';
    setBtn(false);
    const enableSound = async () => {
      try {
        vid.muted = false;
        await vid.play();
        setBtn(true);
      } catch (e) {
        vid.muted = true;
        setBtn(false);
      }
    };
    const disableSound = () => { vid.muted = true; setBtn(false); };
    let isOn = false;
    toggle.addEventListener('click', async () => {
      if (!isOn){
        await enableSound();
        isOn = !vid.muted;
      } else {
        disableSound();
        isOn = false;
      }
    });
  }
})();

// ====== Auto-fill marquee so it’s always “full” ======
(() => {
  const container = document.querySelector('.marquee');
  const track = document.getElementById('marquee-track');
  if (!container || !track) return;

  // Your repeating text chunk (edit freely)
  const CHUNK = 'DJ POWELL • $DJPOWELL • BONK • SOLANA • RATE CUTS • PUMP • REKT • WAGMI • ';

  function fill() {
    // clear and rebuild
    track.innerHTML = '';
    // create a single chunk to measure
    const mk = () => {
      const span = document.createElement('span');
      span.className = 'chunk';
      span.textContent = CHUNK;
      return span;
    };
    // keep adding until we surpass 2x container width (for seamless 0 → -50% loop)
    let target = container.offsetWidth * 2;
    // guard for tiny widths
    if (target < 600) target = 600;

    let total = 0;
    // seed with 1 first so scrollWidth grows from something
    track.appendChild(mk());
    total = track.scrollWidth;

    while (total < target) {
      track.appendChild(mk());
      total = track.scrollWidth;
    }
  }

  // simple debounce for resize
  let t;
  function onResize(){
    clearTimeout(t);
    t = setTimeout(() => {
      fill();
    }, 150);
  }

  fill();
  window.addEventListener('resize', onResize);

  // optional: pause on hover (remove if you don’t want it)
  container.addEventListener('mouseenter', () => container.classList.add('paused'));
  container.addEventListener('mouseleave', () => container.classList.remove('paused'));
})();
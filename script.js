/* ============================================================
   PREMIUM PROPOSAL GENERATOR — SCRIPT
   ============================================================ */

/* ─── GLOBAL STATE ─── */
let STATE = {
  name: "Ananya",
  key: "",
  letter: `Every time I see you, my heart skips a beat.
The way you smile can light up the darkest room.
The way you laugh makes me want to freeze time.

I have tried to find the right words a thousand times,
but nothing I write feels worthy of what you mean to me.

So here I am — heart wide open — hoping you know
that you are the person I want to share every little
moment with. The coffee mornings, the stormy evenings,
the adventures, and the quiet in-between.

You are extraordinary. And I am the luckiest person
in the world just for getting to know you.`,
  photos: [
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&auto=format&fit=crop"
  ]
};

/* ─── DOM HELPER ─── */
const el = id => document.getElementById(id);

/* ─── SCREEN TRANSITION SYSTEM ─── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const next = el(id);
  if (next) next.classList.add('active');
}

/* ─── BUILDER & URL LOGIC ─── */
function initBootLogic() {
  const hash = window.location.hash.substring(1);

  if (hash && hash.length > 10) {
    // We have a config! Run the proposal experience
    try {
      const decodedStr = decodeURIComponent(atob(hash));
      const config = JSON.parse(decodedStr);

      // Override state securely
      STATE.name = config.name || STATE.name;
      STATE.letter = config.letter || STATE.letter;
      STATE.key = config.key || "";
      if (config.photos && config.photos.length === 3) {
        STATE.photos = config.photos;
      }

      // Inject Photos
      el('img-p1').src = STATE.photos[0] || "";
      el('img-p2').src = STATE.photos[1] || "";
      el('img-p3').src = STATE.photos[2] || "";

      // Start Proposal flow
      showScreen('s-landing');
    } catch (err) {
      console.error("Invalid magic link", err);
      showScreen('s-builder');
      prepBuilder();
    }
  } else {
    // No config, show the builder tool
    showScreen('s-builder');
    prepBuilder();
  }
}

function prepBuilder() {
  el('b-letter').value = STATE.letter;
  el('b-p1').value = STATE.photos[0];
  el('b-p2').value = STATE.photos[1];
  el('b-p3').value = STATE.photos[2];

  el('btn-generate').onclick = () => {
    const config = {
      name: el('b-name').value.trim() || "Ananya",
      letter: el('b-letter').value.trim() || STATE.letter,
      key: el('b-key').value.trim(),
      photos: [
        el('b-p1').value.trim() || STATE.photos[0],
        el('b-p2').value.trim() || STATE.photos[1],
        el('b-p3').value.trim() || STATE.photos[2]
      ]
    };

    const encoded = btoa(encodeURIComponent(JSON.stringify(config)));
    const magicLink = window.location.origin + window.location.pathname + "#" + encoded;

    el('result-box').style.display = 'block';
    el('b-link').value = magicLink;
  };

  el('btn-copy').onclick = () => {
    const linkEl = el('b-link');
    linkEl.select();
    document.execCommand('copy');
    el('btn-copy').textContent = 'Copied! ✅';
    setTimeout(() => el('btn-copy').textContent = 'Copy Link to Clipboard 📋', 2000);
  };
}

/* ─── PARALLAX BACKGROUND SYSTEM ─── */
function initParallax() {
  const layer1 = el('bg-layer-1');
  const layer2 = el('bg-layer-2');
  const layer3 = el('bg-layer-3');

  if (!layer1 || !layer2 || !layer3) return;

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    requestAnimationFrame(() => {
      layer1.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
      layer2.style.transform = `translate(${x * -45}px, ${y * -45}px)`;
      layer3.style.transform = `translate(${x * -70}px, ${y * -70}px)`;
    });
  });
}

/* ─── MAGIC CURSOR (FAIRY DUST) ─── */
function initMagicCursor() {
  const container = el('magic-cursor-container');
  if (!container) return;

  let lastParticleTime = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastParticleTime < 40) return;
    lastParticleTime = now;

    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 8 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${e.clientX}px`;
    particle.style.top = `${e.clientY}px`;

    container.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) particle.parentNode.removeChild(particle);
    }, 850);
  });
}

/* ─── TYPEWRITER EFFECT ─── */
function typewrite(target, text, speed, onDone) {
  let i = 0;
  target.textContent = '';
  const tick = setInterval(() => {
    target.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(tick);
      if (onDone) onDone();
    }
  }, speed);
}

/* ─── SCREEN LOGIC ─── */

function initScreens() {
  // 1. Landing to Memory Lane
  const envWrap = el('env-wrap');
  if (envWrap) {
    envWrap.addEventListener('click', function onEnvClick() {
      envWrap.removeEventListener('click', onEnvClick);
      el('env').classList.add('opening');
      setTimeout(() => { showScreen('s-memory'); }, 700);
    });
  }

  // 2. Memory Lane to Letter
  const btnToLetter = el('btn-to-letter');
  if (btnToLetter) {
    btnToLetter.addEventListener('click', () => {
      showScreen('s-letter');
      setTimeout(startLetter, 600);
    });
  }
}

function startLetter() {
  const body = el('letter-body');
  const btn = el('btn-next');
  btn.style.display = 'none';

  typewrite(body, STATE.letter, 20, () => {
    btn.style.opacity = 0;
    btn.style.display = 'inline-block';
    setTimeout(() => {
      btn.style.transition = 'opacity 1s ease';
      btn.style.opacity = 1;
    }, 100);
  });

  btn.onclick = () => {
    showScreen('s-proposal');
    setTimeout(startProposal, 600);
  };
}

function startProposal() {
  const q = el('prop-q');
  const propQuestion = STATE.name
    ? `Will you be mine, ${STATE.name}? 💍`
    : `Will you be mine? 💍`;

  typewrite(q, propQuestion, 45, null);

  // YES logic
  el('btn-yes').onclick = () => {
    if (STATE.key && STATE.key.trim() !== "") {
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: STATE.key.trim(),
          subject: "💍 YES! She said YES!",
          from_name: "Proposal Website",
          message: `Amazing news! ${STATE.name} just clicked the YES button on your proposal website! 🎉`
        })
      }).catch(err => console.log("Notification silent fail", err));
    }

    showScreen('s-celebrate');
    setTimeout(startCelebration, 500);
  };

  // NO logic (escapes cursor)
  const btnNo = el('btn-no');
  let escapes = 0;
  let surrendered = false;

  btnNo.onclick = () => {
    if (surrendered) {
      showScreen('s-celebrate');
      setTimeout(startCelebration, 500);
    }
  };

  btnNo.addEventListener('mouseenter', () => {
    if (surrendered) return;
    if (escapes >= 7) {
      surrendered = true;
      btnNo.textContent = 'Okay fine… YES! 💕';
      return;
    }
    escapes++;

    const bw = btnNo.offsetWidth || 140;
    const bh = btnNo.offsetHeight || 50;
    const maxX = Math.max(0, window.innerWidth - bw - 20);
    const maxY = Math.max(0, window.innerHeight - bh - 20);

    btnNo.style.position = 'fixed';
    btnNo.style.left = (Math.random() * maxX) + 'px';
    btnNo.style.top = (Math.random() * maxY) + 'px';
    btnNo.style.transition = 'left .25s ease, top .25s ease';

    if (escapes === 4) btnNo.textContent = "I can't escape 😅";
    if (escapes === 6) btnNo.textContent = 'Fine, you win 🥺';
  });
}

function startCelebration() {
  const yesMsg = STATE.name ? `${STATE.name} said YES! 🎉💍` : `She said YES! 🎉💍`;
  el('cel-title').textContent = yesMsg;
  el('cel-hearts').textContent = '💖 💍 💖 ✨ 💖';
  launchConfetti();
}

/* ─── CONFETTI SYSTEM ─── */
function launchConfetti() {
  const canvas = el('confetti');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLS = ['#ff4d75', '#ff80ab', '#f9d423', '#ffffff', '#e91e63'];
  const pieces = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 6 + 4,
    c: COLS[Math.floor(Math.random() * COLS.length)],
    vx: (Math.random() - .5) * 3,
    vy: Math.random() * 3 + 2,
    a: Math.random() * Math.PI * 2,
    av: (Math.random() - .5) * .1,
  }));

  let raf;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.a += p.av;
      if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
      ctx.save();
      ctx.fillStyle = p.c;
      ctx.globalAlpha = 0.9;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.beginPath();
      if (p.r > 7) { ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r); }
      else { ctx.arc(0, 0, p.r, 0, Math.PI * 2); }
      ctx.fill();
      ctx.restore();
    });
    raf = requestAnimationFrame(draw);
  }
  draw();
  setTimeout(() => cancelAnimationFrame(raf), 12000);
}

window.addEventListener('resize', () => {
  const canvas = el('confetti');
  if (canvas && canvas.width > 0) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
});

/* ─── BOOT ─── */
document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initMagicCursor();
  initScreens();
  initBootLogic(); // decides if we show builder or proposal
});

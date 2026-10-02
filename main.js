/**
 * TIRTH PATEL — DATA ANALYST & MACHINE LEARNING PORTFOLIO
 * High-performance interactive client scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioSystem();
  initCustomCursor();
  initHeroCanvas();
  initScrollSpy();
  initKineticCycler();
  initContributionMatrix();
  initTerminal();
  initHandshakeConnection();
  initTransmissionForm();
  initClipboardButtons();
  initResumeModal();
  initScrollReveal();
  initCardSpotlightAndTilt();
  initTextDecrypt();
  initSubsystemsBootSequence();
  initGitSvgAnimation();
  initMetricCounters();
});

/* ==========================================================================
   1. NATIVE WEB AUDIO SYNTHESIZER (ZERO ASSET DEPENDENCIES)
   ========================================================================== */
let audioCtx = null;
let audioEnabled = false;

function initAudioSystem() {
  const toggleBtn = document.getElementById('audio-toggle-btn');
  const iconMuted = document.getElementById('audio-icon-muted');
  const iconUnmuted = document.getElementById('audio-icon-unmuted');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    audioEnabled = !audioEnabled;

    if (audioEnabled) {
      iconMuted.classList.add('hidden');
      iconUnmuted.classList.remove('hidden');
      playTone(880, 'sine', 0.08, 0.05);
      showToast('SFX Enabled: Cyber audio feedback active');
    } else {
      iconMuted.classList.remove('hidden');
      iconUnmuted.classList.add('hidden');
      showToast('SFX Muted');
    }
  });
}

function playTone(freq = 440, type = 'sine', duration = 0.05, gainLevel = 0.04) {
  if (!audioEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(gainLevel, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context safe fallback
  }
}

function playConnectChime() {
  if (!audioEnabled || !audioCtx) return;
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTone(freq, 'triangle', 0.15, 0.06);
    }, idx * 90);
  });
}

/* ==========================================================================
   2. CUSTOM CURSOR FOLLOWER
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderRing);
  }
  renderRing();

  const interactiveElements = document.querySelectorAll('a, button, input, textarea, .git-node, .matrix-cell, .tech-badge');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      playTone(1200, 'sine', 0.02, 0.015);
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
}

/* ==========================================================================
   3. HERO CONSTELLATION / PARTICLE WEB CANVAS
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 12000), 85);
  let mouse = { x: null, y: null, radius: 140 };

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.65;
      this.vy = (Math.random() - 0.5) * 0.65;
      this.radius = Math.random() * 1.6 + 0.8;
      this.baseAlpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse proximity interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10, 132, 255, ${this.baseAlpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    const maxDist = 120;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.18;
          ctx.strokeStyle = `rgba(10, 132, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });
}

/* ==========================================================================
   4. SCROLL PROGRESS & HUD SECTION SPY
   ========================================================================== */
function initScrollSpy() {
  const progressBar = document.getElementById('scroll-progress');
  const sectionNum = document.getElementById('hud-section-number');
  const sectionLabel = document.getElementById('hud-section-label');
  const sections = document.querySelectorAll('section[data-section-index]');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    // Determine current section in viewport
    let currentSection = sections[0];
    const triggerOffset = window.innerHeight * 0.35;

    sections.forEach((sec) => {
      const top = sec.getBoundingClientRect().top;
      if (top <= triggerOffset) {
        currentSection = sec;
      }
    });

    if (currentSection && sectionNum && sectionLabel) {
      const idx = currentSection.getAttribute('data-section-index') || '01';
      const name = currentSection.getAttribute('data-section-name') || 'HERO';
      sectionNum.textContent = idx;
      sectionLabel.textContent = name;
    }
  }, { passive: true });
}

/* ==========================================================================
   5. KINETIC TEXT CYCLER
   ========================================================================== */
function initKineticCycler() {
  const items = document.querySelectorAll('.kinetic-item');
  const dots = document.querySelectorAll('.kinetic-dot');
  const prevBtn = document.getElementById('kinetic-prev');
  const nextBtn = document.getElementById('kinetic-next');

  if (items.length === 0) return;

  let currentIndex = 0;
  let cycleTimer = null;

  function setIndex(index) {
    items[currentIndex].classList.remove('active');
    dots[currentIndex]?.classList.remove('active');

    currentIndex = (index + items.length) % items.length;
    items[currentIndex].classList.add('active');
    dots[currentIndex]?.classList.add('active');
    playTone(600 + currentIndex * 60, 'sine', 0.04, 0.02);
  }

  function startAutoCycle() {
    stopAutoCycle();
    cycleTimer = setInterval(() => {
      setIndex(currentIndex + 1);
    }, 3800);
  }

  function stopAutoCycle() {
    if (cycleTimer) clearInterval(cycleTimer);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      setIndex(currentIndex - 1);
      startAutoCycle();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      setIndex(currentIndex + 1);
      startAutoCycle();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.getAttribute('data-target') || '0', 10);
      setIndex(target);
      startAutoCycle();
    });
  });

  const cyclerElem = document.getElementById('kinetic-cycler');
  if (cyclerElem) {
    cyclerElem.addEventListener('mouseenter', stopAutoCycle);
    cyclerElem.addEventListener('mouseleave', startAutoCycle);
  }

  startAutoCycle();
}

/* ==========================================================================
   6. GITHUB CONTRIBUTION ACTIVITY MATRIX
   ========================================================================== */
function initContributionMatrix() {
  const container = document.getElementById('matrix-container');
  if (!container) return;

  container.classList.add('matrix-container-anim');

  // 52 weeks x 7 days
  const totalWeeks = 52;
  const daysPerWeek = 7;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const fragment = document.createDocumentFragment();

  for (let w = 0; w < totalWeeks; w++) {
    const col = document.createElement('div');
    col.className = 'matrix-week-col';
    col.style.transitionDelay = `${w * 14}ms`;

    for (let d = 0; d < daysPerWeek; d++) {
      const cell = document.createElement('div');
      cell.className = 'matrix-cell';

      // Generate realistic distribution of commit activity
      const seed = (w * 7 + d * 13) % 100;
      let level = 0;
      let commits = 0;

      if (seed > 80) {
        level = 4;
        commits = Math.floor(Math.random() * 8) + 9;
      } else if (seed > 60) {
        level = 3;
        commits = Math.floor(Math.random() * 4) + 5;
      } else if (seed > 38) {
        level = 2;
        commits = Math.floor(Math.random() * 3) + 2;
      } else if (seed > 18) {
        level = 1;
        commits = 1;
      } else {
        level = 0;
        commits = 0;
      }

      cell.classList.add(`lvl-${level}`);

      // Calculate approximate month/day
      const monthName = months[Math.floor((w / totalWeeks) * 12)];
      const dayNum = ((w * 7 + d) % 28) + 1;
      const tooltip = commits === 0 ? `No commits on ${monthName} ${dayNum}` : `${commits} commits on ${monthName} ${dayNum}`;
      cell.setAttribute('title', tooltip);

      cell.addEventListener('click', () => {
        playTone(700 + level * 100, 'sine', 0.05, 0.03);
        showToast(tooltip);
      });

      col.appendChild(cell);
    }
    fragment.appendChild(col);
  }

  container.appendChild(fragment);

  // Trigger wave reveal on scroll
  const matrixObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        container.classList.add('revealed');
        matrixObserver.unobserve(container);
      }
    });
  }, { threshold: 0.15 });

  matrixObserver.observe(container);
}

/* ==========================================================================
   7. INTERACTIVE OPERATING SYSTEM TERMINAL
   ========================================================================== */
function initTerminal() {
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const terminalBody = document.getElementById('terminal-body');
  const clearBtn = document.getElementById('term-clear-btn');
  const quickCmdBtns = document.querySelectorAll('.quick-cmd-btn');

  if (!form || !input || !output) return;

  const commandHistory = [];
  let historyIndex = -1;

  const commandRegistry = {
    help: () => `TP-ANALYTICS CLI - Recognized commands:
  about       View developer background and systems profile
  projects    List key Machine Learning & Data Analytics case studies
  skills      Display verified Python, ML/AI, SQL & BI stack
  timeline    Print career milestones & education history
  contact     Open direct transmission channel & contact links
  matrix      Toggle digital rain animation mode
  date        Display system hardware clock
  whoami      Display current terminal caller permissions
  echo [text] Print input back to screen
  theme       Toggle terminal visual theme
  clear       Clear terminal screen history`,

    about: () => `Tirth Patel — Data Analyst & Machine Learning Engineer
Focus: Predictive ML pipelines, disaster risk AI modeling, SQL database design & Power BI dashboards.
Location: Gandhinagar / Ahmedabad, Gujarat, India.
Passionate about transforming messy real-world datasets into life-saving & high-impact decisions.`,

    projects: () => `FEATURED CASE STUDIES & PRODUCTION PIPELINES:
1. NER LANDSLIDE EARLY WARNING & RISK MONITORING SYSTEM (SIH 2026 PS 26001) [FEATURED BEST PROJECT]
   Stack: Python, XGBoost, Scikit-learn, Computer Vision (YOLO), Folium & Leaflet.js, FastAPI, Twilio SMS
   Key: Multi-source geospatial risk pipeline across 8 North Eastern states, 94.6% ML accuracy, <3s alert latency.

2. AIR QUALITY INDEX (AQI) ANALYSIS & POLLUTANT CORRELATION
   Stack: Python, Pandas, NumPy, Matplotlib, Seaborn, EDA
   Key: 9,000+ environmental records analyzed across 12 chemical telemetry metrics.

3. HOSPITAL CLINICAL MANAGEMENT RELATIONAL ARCHITECTURE
   Stack: SQL, MySQL, Relational Schema Design, Normalization (3NF)
   Key: 5+ normalized tables, advanced window functions & joins, <40ms query execution.

4. AGRICULTURAL CROP RECOMMENDATION BI SYSTEM
   Stack: Power BI, Machine Learning, Data Analytics, DAX
   Key: Multi-parameter soil (N-P-K) & climate analysis dashboard for farming optimization.`,

    skills: () => `VERIFIED TECHNICAL SUBSYSTEMS:
[PROGRAMMING & APIS]     Python · SQL (MySQL) · FastAPI · JavaScript · HTML5 · CSS3
[DATA SCIENCE & EDA]     Pandas · NumPy · Data Cleaning · Wrangling · Feature Engineering · Excel
[MACHINE LEARNING & AI]  Scikit-learn · XGBoost · Supervised Learning · YOLO (CV) · Model Evaluation
[VISUALIZATION & BI]     Power BI · Matplotlib · Seaborn · Folium / Leaflet.js GIS · MySQL`,

    timeline: () => `CAREER & ACADEMIC TIMELINE:
2024      Higher Secondary — Science (Narayan Vidhyalay)
2024-2028 B.Tech Computer Science (Gandhinagar Institute Of Technology)
2025      Data Science Certification (Acmegrade & IIT Delhi Rendezvous)
2025-2026 Advanced Training in Data Science & AI/ML (Red & White Skill Education)
2026      Smart India Hackathon 2026 — Team UI WIZARDS (NER Landslide AI System)
2026      Analytical Pipelines (AQI Analysis & Indian Economy Modeling)
NOW       Open to Opportunities (Data Analyst / Machine Learning Engineer)`,

    contact: () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      return `Targeting #contact channel.
Email: tirthpatel622@gmail.com
GitHub: https://github.com/Tirthdeveloper
LinkedIn: http://www.linkedin.com/in/patel-tirth-421b9a34a
Twitter / X: https://x.com/PatelTirth12822
Instagram: https://www.instagram.com/tirth_patel_2407?stkn=MzNubXlhcGc5eDUy
Phone: +91 96386 36364`;
    },

    whoami: () => `guest@tp-analytics.internal (Role: Guest Explorer, Status: Verified)`,

    date: () => new Date().toUTCString(),

    sudo: () => `sudo: Permission denied. User 'guest' is not in the sudoers file. This incident has been logged.`,

    theme: () => {
      document.body.classList.toggle('neon-theme');
      return `Terminal theme toggled.`;
    },

    matrix: () => {
      runMatrixRainInTerminal(output, terminalBody);
      return `Matrix digital stream initialized. Press any key or scroll to stop.`;
    },

    clear: () => {
      output.innerHTML = '';
      return '';
    }
  };

  function executeCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    commandHistory.push(trimmed);
    historyIndex = commandHistory.length;

    // Render user command line
    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-line-cmd';
    cmdLine.innerHTML = `<span class="prompt">guest@tp-analytics:~$</span> <span>${escapeHtml(trimmed)}</span>`;
    output.appendChild(cmdLine);

    playTone(900, 'sine', 0.03, 0.02);

    // Parse command
    const parts = trimmed.split(' ');
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    let responseText = '';

    if (cmdName === 'clear') {
      commandRegistry.clear();
      return;
    } else if (cmdName === 'echo') {
      responseText = args || '';
    } else if (commandRegistry[cmdName]) {
      responseText = commandRegistry[cmdName]();
    } else {
      responseText = `command not found: ${escapeHtml(cmdName)}. Type 'help' to see recognized commands.`;
    }

    if (responseText) {
      const respLine = document.createElement('div');
      respLine.className = 'term-line-resp';
      respLine.textContent = responseText;
      output.appendChild(respLine);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    executeCommand(input.value);
    input.value = '';
  });

  // History cycling (Arrow Up / Arrow Down)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
      }
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      output.innerHTML = '';
      playTone(400, 'sine', 0.05, 0.02);
    });
  }

    quickCmdBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        input.value = cmd;
        executeCommand(cmd);
        input.value = '';
      }
    });
  });

  // Ghost typing simulation on first reveal
  let hasAutoTyped = false;
  const terminalObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAutoTyped) {
        hasAutoTyped = true;
        terminalObserver.unobserve(entry.target);

        setTimeout(() => {
          if (output.children.length === 0 && input.value === '') {
            const cmd = 'skills';
            let charIndex = 0;
            const typingInterval = setInterval(() => {
              input.value += cmd[charIndex];
              charIndex++;
              playTone(850 + charIndex * 40, 'sine', 0.02, 0.01);
              if (charIndex >= cmd.length) {
                clearInterval(typingInterval);
                setTimeout(() => {
                  executeCommand(cmd);
                  input.value = '';
                }, 350);
              }
            }, 85);
          }
        }, 500);
      }
    });
  }, { threshold: 0.35 });

  const terminalSection = document.getElementById('terminal');
  if (terminalSection) {
    terminalObserver.observe(terminalSection);
  }
}

function runMatrixRainInTerminal(outputElem, containerElem) {
  const pre = document.createElement('pre');
  pre.style.color = '#30d158';
  pre.style.fontFamily = 'monospace';
  pre.style.fontSize = '10px';
  pre.style.lineHeight = '1.2';
  pre.textContent = 'CONNECTING TO MATRIX STREAM...\n';
  outputElem.appendChild(pre);

  let step = 0;
  const chars = '0123456789ABCDEF@#$%&*+-/<>~ΞΨΩ';
  const interval = setInterval(() => {
    let line = '';
    for (let i = 0; i < 48; i++) {
      line += chars[Math.floor(Math.random() * chars.length)] + ' ';
    }
    pre.textContent += line + '\n';
    containerElem.scrollTop = containerElem.scrollHeight;
    step++;
    if (step > 15) {
      clearInterval(interval);
      pre.textContent += '\n[STREAM COMPLETE: Telemetry synchronized]\n';
      containerElem.scrollTop = containerElem.scrollHeight;
    }
  }, 90);
}

/* ==========================================================================
   8. SECURE CHANNEL CONTACT HANDSHAKE SIMULATOR
   ========================================================================== */
function initHandshakeConnection() {
  const triggerBtn = document.getElementById('establish-connection-btn');
  const triggerWrap = document.getElementById('connection-trigger-wrap');
  const simWrap = document.getElementById('handshake-simulation-wrap');
  const runner = document.getElementById('packet-runner');
  const logsContainer = document.getElementById('handshake-logs');
  const revealedWrap = document.getElementById('revealed-channels-wrap');

  if (!triggerBtn || !simWrap || !logsContainer) return;

  triggerBtn.addEventListener('click', () => {
    playTone(750, 'sine', 0.1, 0.06);

    // Hide trigger button, reveal simulation
    triggerWrap.classList.add('hidden');
    simWrap.classList.remove('hidden');

    if (runner) runner.classList.add('active');

    const steps = [
      { text: 'Initializing secure telemetry channel via wss://gateway.tp-analytics.internal...', delay: 350 },
      { text: 'Resolving endpoint DNS & establishing TLS 1.3 cryptographic session...', delay: 800 },
      { text: 'Verifying origin credentials: [Curve25519-AES-256-GCM authenticated]...', delay: 1300 },
      { text: 'Connection established: 200 OK — Direct channels unlocked.', delay: 1800 }
    ];

    logsContainer.innerHTML = '';

    steps.forEach((step, idx) => {
      setTimeout(() => {
        const logLine = document.createElement('div');
        logLine.className = 'log-entry';
        logLine.innerHTML = `<span class="check">✓</span> <span>${step.text}</span>`;
        logsContainer.appendChild(logLine);
        playTone(650 + idx * 120, 'sine', 0.06, 0.04);

        if (idx === steps.length - 1) {
          setTimeout(() => {
            if (runner) runner.classList.remove('active');
            revealedWrap.classList.remove('hidden');
            playConnectChime();
            showToast('Secure Connection Established: Channels Unlocked');
          }, 400);
        }
      }, step.delay);
    });
  });
}

/* ==========================================================================
   9. DIRECT PACKET TRANSMISSION FORM
   ========================================================================== */
function initTransmissionForm() {
  const form = document.getElementById('transmission-form');
  const sendBtn = document.getElementById('tx-send-btn');
  const feedback = document.getElementById('tx-feedback-msg');

  if (!form || !sendBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const sender = document.getElementById('tx-sender-name')?.value || 'Guest';
    const email = document.getElementById('tx-sender-email')?.value || '';
    const subject = document.getElementById('tx-subject')?.value || '';
    const message = document.getElementById('tx-message')?.value || '';

    sendBtn.disabled = true;
    sendBtn.innerHTML = `<span>TRANSMITTING...</span>`;
    playTone(1000, 'sine', 0.1, 0.05);

    setTimeout(() => {
      sendBtn.disabled = false;
      sendBtn.innerHTML = `<span>TRANSMIT PACKET</span>`;
      if (feedback) {
        feedback.textContent = `✓ Packet delivered to gateway for ${escapeHtml(sender)}!`;
      }
      form.reset();
      playTone(1200, 'triangle', 0.15, 0.06);
      showToast(`Transmission received from ${sender}. Thank you!`);

      // Fallback mailto trigger for genuine contact
      const mailtoLink = `mailto:tirthpatel622@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${sender} (${email})\n\n${message}`)}`;
      window.open(mailtoLink, '_blank');
    }, 1200);
  });
}

/* ==========================================================================
   10. CLIPBOARD COPY BUTTONS
   ========================================================================== */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('.copy-val-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          playTone(1350, 'sine', 0.08, 0.04);
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast(`Address: ${textToCopy}`);
        });
      }
    });
  });
}

/* ==========================================================================
   11. RESUME MODAL & PRINT HANDLER
   ========================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtn = document.getElementById('open-resume-btn');
  const mobileBtn = document.getElementById('mobile-resume-btn');
  const footerBtn = document.getElementById('footer-resume-btn');
  const closeBtn = document.getElementById('close-resume-modal');
  const downloadBtn = document.getElementById('download-cv-btn');

  if (!modal) return;

  function openModal() {
    modal.classList.remove('hidden');
    playTone(800, 'sine', 0.06, 0.03);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    playTone(500, 'sine', 0.05, 0.03);
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (mobileBtn) mobileBtn.addEventListener('click', openModal);
  if (footerBtn) footerBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  const downloadPdfBtn = document.getElementById('download-pdf-btn');
  const downloadDocxBtn = document.getElementById('download-docx-btn');

  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      playTone(1200, 'sine', 0.1, 0.05);
      showToast('Downloading Tirth_Patel_Resume_AIML.pdf...');
    });
  }

  if (downloadDocxBtn) {
    downloadDocxBtn.addEventListener('click', () => {
      playTone(1050, 'triangle', 0.1, 0.05);
      showToast('Downloading Tirth_Patel_Resume_AIML.docx...');
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      playTone(1100, 'sine', 0.08, 0.04);
      window.print();
    });
  }
}

/* ==========================================================================
   12. TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message, duration = 3200) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>⚡</span> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   13. ADVANCED SCROLL REVEAL SYSTEM
   ========================================================================== */
function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal-item');
  if (revealItems.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.08
  });

  revealItems.forEach((item) => observer.observe(item));

  // Timeline track draw observer
  const timelineTrack = document.querySelector('.timeline-track-wrap');
  if (timelineTrack) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          timelineTrack.classList.add('timeline-active');
        }
      });
    }, { threshold: 0.15 });
    timelineObserver.observe(timelineTrack);
  }
}

/* ==========================================================================
   14. 3D TILT & MOUSE SPOTLIGHT ENGINE
   ========================================================================== */
function initCardSpotlightAndTilt() {
  const cards = document.querySelectorAll('.card-spotlight');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS spotlight coordinates
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D Tilt calculation with smooth dampening
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.setProperty('--mouse-x', `50%`);
      card.style.setProperty('--mouse-y', `50%`);
    });
  });
}

/* ==========================================================================
   15. CYBER TEXT SCRAMBLE / DECRYPT ANIMATION
   ========================================================================== */
function initTextDecrypt() {
  const decryptElements = document.querySelectorAll('.decrypt-text');
  const glyphs = '01#$%/\\<>_~X*&+-=!@';

  function scramble(element) {
    const targetText = element.getAttribute('data-value') || element.textContent.trim();
    const length = targetText.length;
    let iteration = 0;
    const maxIterations = length;

    element.classList.add('scrambling');

    const interval = setInterval(() => {
      element.textContent = targetText
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iteration) {
            return targetText[index];
          }
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join('');

      iteration += 1 / 2.2;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        element.textContent = targetText;
        element.classList.remove('scrambling');
      }
    }, 28);
  }

  // Scramble Hero Title on load
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle) {
    setTimeout(() => scramble(heroTitle), 320);
  }

  // Scramble other decrypt elements when scrolled into view
  const decryptObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el !== heroTitle) {
          scramble(el);
          playTone(920, 'sine', 0.03, 0.015);
        }
        decryptObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  decryptElements.forEach((el) => {
    if (el !== heroTitle) {
      decryptObserver.observe(el);
    }

    // Scramble on hover
    el.addEventListener('mouseenter', () => {
      scramble(el);
      playTone(1100, 'sine', 0.04, 0.02);
    });
  });
}

/* ==========================================================================
   16. TECH STACK SUBSYSTEMS SEQUENTIAL BOOT
   ========================================================================== */
function initSubsystemsBootSequence() {
  const techSection = document.getElementById('tech-stack');
  const rows = document.querySelectorAll('.subsystem-row');
  if (!techSection || rows.length === 0) return;

  let hasBooted = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasBooted) {
        hasBooted = true;

        rows.forEach((row, idx) => {
          setTimeout(() => {
            row.classList.add('booted');
            playTone(550 + idx * 100, 'sine', 0.05, 0.03);
          }, idx * 220);
        });
      }
    });
  }, { threshold: 0.15 });

  observer.observe(techSection);
}

/* ==========================================================================
   17. SVG GIT COMMIT GRAPH DRAWING & TRAVELING PACKET ANIMATION
   ========================================================================== */
function initGitSvgAnimation() {
  const svg = document.getElementById('git-dag-svg');
  const branchPath = document.getElementById('git-feature-path');
  const packet = document.getElementById('git-live-packet');
  if (!svg) return;

  let hasDrawn = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasDrawn) {
        hasDrawn = true;
        svg.classList.add('drawn');
        playTone(950, 'sine', 0.06, 0.03);

        // Continuous traveling commit packet along feature branch
        if (branchPath && packet) {
          try {
            const pathLen = branchPath.getTotalLength();
            let progress = 0;

            function animatePacket() {
              progress = (progress + 0.0035) % 1;
              const pt = branchPath.getPointAtLength(progress * pathLen);
              packet.setAttribute('cx', pt.x.toFixed(2));
              packet.setAttribute('cy', pt.y.toFixed(2));
              requestAnimationFrame(animatePacket);
            }

            setTimeout(() => {
              packet.style.opacity = '1';
              animatePacket();
            }, 800);
          } catch (e) {
            // SVG path fallback
          }
        }
      }
    });
  }, { threshold: 0.25 });

  observer.observe(svg);
}

/* ==========================================================================
   18. NUMERICAL ODOMETER METRIC COUNTERS
   ========================================================================== */
function initMetricCounters() {
  const counters = document.querySelectorAll('.counter-value');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        obs.unobserve(el);

        const rawTarget = el.getAttribute('data-target') || '0';
        const targetVal = parseFloat(rawTarget);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const duration = 1400; // ms
        const startTime = performance.now();
        const isNegative = targetVal < 0;
        const absTarget = Math.abs(targetVal);

        el.classList.add('counting');

        function updateCounter(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          // Ease out exponential curve
          const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = (absTarget * ease).toFixed(decimals);
          el.textContent = `${prefix}${isNegative ? '-' : ''}${current}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = `${prefix}${isNegative ? '-' : ''}${absTarget.toFixed(decimals)}${suffix}`;
            el.classList.remove('counting');
          }
        }

        requestAnimationFrame(updateCounter);
      }
    });
  }, { threshold: 0.25 });

  counters.forEach((c) => observer.observe(c));
}

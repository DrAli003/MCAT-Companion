
/* ============================================================
   MCAT COMPANION — APPLICATION LOGIC
   ============================================================ */

/* ---------- Helpers ---------- */
const qs = sel => document.querySelector(sel);
const qsa = sel => document.querySelectorAll(sel);
const app = qs("#app");

/* ---------- Sound (Web Audio API — correct/wrong chimes) ---------- */
let audioCtx;
function playSound(type){
  if(!state.soundOn) return;
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    const ctx = audioCtx;
    if(type === 'correct'){
      // Ascending triad
      [523.25, 659.25, 783.99].forEach((f,i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type='sine'; o.frequency.value=f;
        o.connect(g); g.connect(ctx.destination);
        const t = ctx.currentTime + i*0.08;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.15, t+0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t+0.3);
        o.start(t); o.stop(t+0.3);
      });
    } else if(type === 'wrong'){
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type='sawtooth'; o.frequency.value=220;
      o.connect(g); g.connect(ctx.destination);
      o.frequency.exponentialRampToValueAtTime(150, ctx.currentTime+0.25);
      g.gain.setValueAtTime(0.1, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.3);
      o.start(); o.stop(ctx.currentTime+0.3);
    } else if(type === 'complete'){
      [523, 659, 784, 1047].forEach((f,i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type='triangle'; o.frequency.value=f;
        o.connect(g); g.connect(ctx.destination);
        const t = ctx.currentTime + i*0.1;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.15, t+0.03);
        g.gain.exponentialRampToValueAtTime(0.001, t+0.5);
        o.start(t); o.stop(t+0.5);
      });
    } else if(type === 'tick'){
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type='sine'; o.frequency.value=800;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.05, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.1);
      o.start(); o.stop(ctx.currentTime+0.1);
    }
  }catch(e){}
}

/* ---------- Date helpers ---------- */
function dateKey(d){
  const dt = (d instanceof Date)?d:new Date(d);
  return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0');
}
function todayKey(){return dateKey(new Date());}
function parseKey(k){const [y,m,d]=k.split('-').map(Number); return new Date(y,m-1,d);}
function formatDate(d){
  const dt = typeof d === 'string'?parseKey(d):d;
  return dt.toLocaleDateString('en-US',{weekday:'short', month:'short', day:'numeric'});
}
function getStreak(){
  let streak=0;
  let d = new Date();
  while(state.tasks[dateKey(d)] && state.tasks[dateKey(d)].filter(t=>t.done).length>0){
    streak++;
    d.setDate(d.getDate()-1);
  }
  return streak;
}

/* ---------- Theme toggle ---------- */
function initTheme(){
  const btn = qs('#theme-toggle-btn');
  if(!btn) return;
  btn.textContent = state.lightTheme ? '☀️' : '🌙';
  btn.addEventListener('click', () => {
    state.lightTheme = !state.lightTheme;
    document.body.classList.toggle('light', state.lightTheme);
    btn.textContent = state.lightTheme ? '☀️' : '🌙';
    localStorage.setItem('mcat-theme', state.lightTheme?'light':'dark');
  });
}

function saveTasks(){localStorage.setItem('mcat-tasks', JSON.stringify(state.tasks));}
function saveScores(){localStorage.setItem('mcat-fl-scores', JSON.stringify(state.flScores));}

/* ---------- State ---------- */
const state = {
  testDate: new Date('2027-09-03T08:00:00'),
  currentSection: 'dashboard',
  aaFilter: 'All',
  aaQuizMode: false,
  mnemCategory: 'All',
  mnemQuery: '',
  quizIndex: 0,
  quizScore: 0,
  quizAnswered: false,
  quizShuffled: [],
  quizCategories: {}, // tracks correct/total by category for weak area
  carsCurrentPassage: null,
  carsTimer: null,
  carsTimeLeft: 0,
  carsAnswered: {},
  carsAnswersShown: false,
  pomMode: 'focus',
  pomRunning: false,
  pomTimeLeft: 25*60,
  pomInterval: null,
  soundOn: localStorage.getItem('mcat-sound') !== 'false',
  lightTheme: localStorage.getItem('mcat-theme') === 'light',
  tasks: JSON.parse(localStorage.getItem('mcat-tasks') || '{}'),
  flScores: JSON.parse(localStorage.getItem('mcat-fl-scores') || 'null'),
};
// Apply theme on load
if(state.lightTheme) document.body.classList.add('light');


const POM_MODES = {
  focus: {label:'Focus', sec:25*60, color:'url(#pomGrad)'},
  short: {label:'Short Break', sec:5*60, color:'#34d399'},
  long: {label:'Long Break', sec:15*60, color:'#60a5fa'},
};

/* ---------- Navigation ---------- */
// nav binding happens in init

function navigate(section){
  state.currentSection = section;
  qsa('.nav-link').forEach(b => b.classList.toggle('active', b.dataset.section === section));
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ---------- Rendering Router ---------- */
function render(){
  switch(state.currentSection){
    case 'dashboard': renderDashboard(); break;
    case 'schedule': renderSchedule(); break;
    case 'tasks': renderTasks(); break;
    case 'amino': renderAmino(); break;
    case 'pathways': renderPathways(); break;
    case 'mnemonics': renderMnemonics(); break;
    case 'lab': renderLab(); break;
    case 'formulas': renderFormulas(); break;
    case 'calc': renderCalc(); break;
    case 'quiz': renderQuiz(); break;
    case 'cars': renderCars(); break;
    case 'psych': renderPsych(); break;
    case 'scores': renderScores(); break;
    case 'duas': renderDuas(); break;
    case 'journey': renderJourney(); break;
    case 'dedication': renderDedication(); break;
    case 'testday': renderTestDay(); break;
    case 'tasbih': renderTasbih(); break;
    case 'wrong': renderWrong(); break;
    case 'tools': renderTools(); break;
    case 'achievements': renderAchievements(); break;
    case 'timer': openPomodoro(); break;
  }
}

/* ===========================================================
   DASHBOARD
   =========================================================== */
function getDailyQuote(){
  const today = new Date();
  const start = new Date(today.getFullYear(),0,0);
  const dayOfYear = Math.floor((today - start) / (1000*60*60*24));
  return QUOTES[dayOfYear % QUOTES.length];
}

function renderDashboard(){
  const now = new Date();
  const td = getTestDate();
  const days = daysUntilTest();
  const diff = td - now;
  const hours = Math.floor((diff / (1000*60*60)) % 24);
  const mins = Math.floor((diff / (1000*60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  // Determine current phase
  let phaseLabel, phaseEmoji, phaseColor;
  const weeksLeft = Math.ceil(days/7);
  if (days > 84){ phaseLabel = "Phase 1 — Content Review"; phaseEmoji="📚"; phaseColor="var(--blue)"; }
  else if (days > 28){ phaseLabel = "Phase 2 — UWorld Practice"; phaseEmoji="⚡"; phaseColor="var(--purple)"; }
  else { phaseLabel = "Phase 3 — AAMC Refinement"; phaseEmoji="🎯"; phaseColor="var(--green)"; }

  // Quote changes once per day (stable for 24h)
  const quote = state._currentQuote || getDailyQuote();
  state._currentQuote = quote;

  app.innerHTML = `
    <section class="section active">
      <div class="hero-grid">
        <div class="countdown-card">
          <div class="countdown-label">Test Day Countdown</div>
          <div style="font-family:'Space Grotesk'; font-size:1.1rem; font-weight:500; color:var(--text-dim); margin-bottom:4px;">September 3, 2027</div>
          <div class="countdown-days">${days}</div>
          <div class="countdown-sub">days until test day inshaAllah</div>
          <div class="countdown-grid">
            <div class="countdown-box"><div class="countdown-num">${days}</div><div class="countdown-unit">days</div></div>
            <div class="countdown-box"><div class="countdown-num">${hours}</div><div class="countdown-unit">hours</div></div>
            <div class="countdown-box"><div class="countdown-num">${mins}</div><div class="countdown-unit">mins</div></div>
            <div class="countdown-box"><div class="countdown-num">${secs}</div><div class="countdown-unit">secs</div></div>
          </div>
          <div class="mt-16" style="display:inline-flex; align-items:center; gap:8px; padding:8px 16px; border-radius:999px; background:rgba(0,0,0,0.3); border:1px solid var(--border);">
            <span style="font-size:1.1rem">${phaseEmoji}</span>
            <span style="font-weight:600; font-size:0.9rem; color:${phaseColor}">${phaseLabel}</span>
          </div>
        </div>

        <div class="card quote-card">
          <div class="quote-mark">"</div>
          <p class="quote-text" id="dash-quote-text">${quote.text}</p>
          <div class="flex-between">
            <span class="quote-src" id="dash-quote-src">${quote.src}</span>
            <button class="btn btn-sm" id="new-quote-btn" title="New quote">↻ New Quote</button>
          </div>
        </div>
      </div>

      <!-- Personal greeting + Level + QOTD -->
      <div class="grid grid-2 mb-16">
        <div class="card-flat" style="padding:24px; border:1px solid var(--border-strong); background:linear-gradient(135deg,rgba(167,139,250,0.08),rgba(236,72,153,0.05));">
          <div style="font-size:0.78rem; text-transform:uppercase; letter-spacing:0.12em; color:var(--purple); font-weight:700; margin-bottom:6px;">Assalamu alaykum, ${USER_NAME}</div>
          ${(()=>{
            const s=loadStats(); const lv=getLevel(s.xp);
            return `
              <div style="display:flex; align-items:center; gap:16px; margin-top:10px;">
                <div class="level-num" style="font-size:3rem;">Lv ${lv.cur.level}</div>
                <div style="flex:1;">
                  <div style="font-weight:700; font-size:1.05rem;">${lv.cur.title}</div>
                  <div style="font-size:0.82rem; color:var(--text-mute); margin-top:2px;">${s.xp} XP total · ${lv.next.min - s.xp} XP to Lv ${lv.next.level}</div>
                  <div class="xp-bar"><div class="xp-fill" style="width:${(lv.prog*100).toFixed(1)}%"></div></div>
                </div>
                <button class="btn btn-sm" data-jump="achievements">🏅 Badges</button>
              </div>
            `;
          })()}
          <p style="margin-top:12px; font-size:0.9rem; color:var(--text-dim); margin-bottom:0;">
            Today is a step closer to that white coat, ${SHORT_NAME}. Be consistent, make du'a, and trust Allah's plan.
          </p>
        </div>

        <div class="qotd-card" id="qotd-wrap">
          ${(()=>{
            const q = getQOTD();
            return `
              <div class="qotd-label">❓ Question of the Day</div>
              <div style="font-weight:600; font-size:1.05rem; margin-bottom:10px;">${q.q}</div>
              <div class="quiz-choices" style="gap:6px;" id="qotd-choices">
                ${q.choices.map((c,i)=>`<button class="quiz-choice" data-i="${i}" style="padding:10px 14px; font-size:0.88rem;"><span class="choice-letter">${'ABCD'[i]}</span><span>${c}</span></button>`).join('')}
              </div>
              <div id="qotd-explain"></div>
            `;
          })()}
        </div>
      </div>

      <div class="stat-cards">
        <div class="stat-card streak-pulse">
          <div class="stat-icon">🔥</div>
          <div class="stat-label">Study Streak</div>
          <div class="stat-value" style="color:var(--orange)">${getStreak()}</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📖</div>
          <div class="stat-label">Amino Acids</div>
          <div class="stat-value">20</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🧠</div>
          <div class="stat-label">Mnemonics</div>
          <div class="stat-value">${MNEMONICS.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔬</div>
          <div class="stat-label">Lab Techniques</div>
          <div class="stat-value">${LAB_TECHNIQUES.length}</div>
        </div>
      </div>

      <h2 style="margin-bottom:14px;">Quick Start</h2>
      <div class="quick-actions">
        <button class="quick-action" data-jump="tasks">
          <div class="qa-icon">✅</div>
          <div class="qa-title">Daily Tasks</div>
          <div class="qa-desc">Check off your to-dos, keep streak</div>
        </button>
        <button class="quick-action" data-jump="schedule">
          <div class="qa-icon">📅</div>
          <div class="qa-title">Study Schedule</div>
          <div class="qa-desc">Customizable 3-phase plan</div>
        </button>
        <button class="quick-action" data-jump="amino">
          <div class="qa-icon">🧬</div>
          <div class="qa-title">Amino Acid Explorer</div>
          <div class="qa-desc">Structures + facts + quiz</div>
        </button>
        <button class="quick-action" data-jump="quiz">
          <div class="qa-icon">⚡</div>
          <div class="qa-title">Quiz Bowl</div>
          <div class="qa-desc">Test your high-yield recall</div>
        </button>
        <button class="quick-action" data-jump="scores">
          <div class="qa-icon">📊</div>
          <div class="qa-title">FL Score Tracker</div>
          <div class="qa-desc">Chart your progress</div>
        </button>
        <button class="quick-action" data-jump="mnemonics">
          <div class="qa-icon">💡</div>
          <div class="qa-title">Mnemonic Library</div>
          <div class="qa-desc">Tricks to remember everything</div>
        </button>
        <button class="quick-action" data-jump="lab">
          <div class="qa-icon">🔬</div>
          <div class="qa-title">Lab Techniques</div>
          <div class="qa-desc">PCR, blots, chrom, ELISAs</div>
        </button>
        <button class="quick-action" data-jump="calc">
          <div class="qa-icon">🧮</div>
          <div class="qa-title">Physics Calculators</div>
          <div class="qa-desc">Lens, HW, pH, pI, Beer</div>
        </button>
        <button class="quick-action" data-jump="pathways">
          <div class="qa-icon">🔄</div>
          <div class="qa-title">Metabolic Pathways</div>
          <div class="qa-desc">Glycolysis, Krebs, ETC</div>
        </button>
        <button class="quick-action" data-jump="formulas">
          <div class="qa-icon">📐</div>
          <div class="qa-title">Formula Cheat Sheet</div>
          <div class="qa-desc">Physics & Gen Chem</div>
        </button>
        <button class="quick-action" data-jump="cars">
          <div class="qa-icon">📝</div>
          <div class="qa-title">CARS Trainer</div>
          <div class="qa-desc">Timed passages + strategy</div>
        </button>
        <button class="quick-action" data-jump="duas">
          <div class="qa-icon">❓</div>
          <div class="qa-title">Du'as for Study</div>
          <div class="qa-desc">Supplications for barakah</div>
        </button>
      </div>
      <div class="row mt-16" style="justify-content:flex-end;">
        <span style="font-size:0.85rem; color:var(--text-mute);">Sound effects:</span>
        <div class="switch ${state.soundOn?'on':''}" id="sound-toggle"></div>
      </div>

      <div class="mt-24 card-flat">
        <h3 style="margin-bottom:8px;">💡 How to use this tool</h3>
        <p>This companion is built around the high-yield study strategy that 515+ scorers consistently recommend:
          <strong>(1)</strong> Master content first,
          <strong>(2)</strong> Practice heavily with UWorld while tracking errors,
          <strong>(3)</strong> Spend the final month exclusively on AAMC materials under strict test conditions.
          It's designed to complement your existing Anki cards and books — not replace them.
          Use the Amino Acid Explorer and Mnemonics for daily active-recall drills, the Formula sheet when doing C/P passages,
          and the Quiz Bowl for quick study breaks. May Allah make it easy and grant you success!</p>
      </div>
    </section>
  `;

  // New quote button
  qs('#new-quote-btn').addEventListener('click', () => {
    const q = QUOTES[Math.floor(Math.random()*QUOTES.length)];
    qs('#dash-quote-text').textContent = q.text;
    qs('#dash-quote-src').textContent = q.src;
  });

  // Quick action buttons
  qsa('.quick-action').forEach(b => b.addEventListener('click', () => navigate(b.dataset.jump)));

  // QOTD interaction
  const qotdChoices = qsa('#qotd-choices .quiz-choice');
  if(qotdChoices.length){
    const qotd = getQOTD();
    qotdChoices.forEach(btn=>{
      btn.addEventListener('click',()=>{
        const i = +btn.dataset.i;
        const correct = i === qotd.answer;
        qotdChoices.forEach((b,bi)=>{
          b.disabled=true;
          if(bi===qotd.answer) b.classList.add('correct');
          else if(bi===i) b.classList.add('wrong');
        });
        const exp = qs('#qotd-explain');
        exp.innerHTML = `<div class="quiz-explain"><strong>${correct?'✅ Correct! +5 XP':'❌ Good try'}</strong> ${qotd.explain}</div>`;
        if(correct) awardXP(5, 'QOTD');
      });
    });
  }
  // Badges button
  const badgeBtn = qs('[data-jump="achievements"]');
  if(badgeBtn) badgeBtn.addEventListener('click',()=>navigate('achievements'));

  // First-visit welcome
  if(!localStorage.getItem('mcat-welcomed')){
    showWelcome();
    localStorage.setItem('mcat-welcomed','true');
  }
}

function showWelcome(){
  const overlay = document.createElement('div');
  overlay.className='welcome-overlay';
  overlay.innerHTML = `
    <div class="welcome-card" style="animation:fadeUp 0.7s ease;">
      <div style="font-size:5rem;">🩺</div>
      <div class="welcome-title">Welcome, Dr. Leen</div>
      <p class="welcome-sub">Your MCAT companion is ready. Let's get you to that white coat inshaAllah.</p>
      <div style="font-size:1.2rem; line-height:1.8; color:var(--text-dim); margin:20px 0;">
        "Indeed, with hardship comes ease."<br>
        <span style="color:var(--purple); font-size:0.95rem; font-weight:600;">— Qur'an 94:5</span>
      </div>
      <button class="btn btn-primary" id="welcome-begin" style="font-size:1rem; padding:14px 36px;">Bismillah — let's begin</button>
    </div>
  `;
  document.body.appendChild(overlay);
  qs('#welcome-begin',overlay).addEventListener('click',()=>{
    overlay.style.opacity='0';
    overlay.style.transition='opacity 0.5s';
    setTimeout(()=>overlay.remove(),500);
    awardXP(10,'Welcome');
    launchConfetti();
  });
}

/* ---------- Achievements Page ---------- */
function renderAchievements(){
  const s = loadStats();
  s.dedicationRead = s.dedicationRead; // keep
  s.mnemonicsViewed = s.mnemonicsViewed || false;
  s.structureQuizPerfect = s.structureQuizPerfect || false;
  s.flLogged = s.flLogged || state.flScores && state.flScores.exams && state.flScores.exams.some(e=>e.score);
  checkAchievements();
  const unlocked = Object.keys(s.achievements).length;
  app.innerHTML = `
    <section class="section active">
      <div class="section-header">
        <h1>🏅 Achievements</h1>
        <p class="section-subtitle">${unlocked} of ${ACHIEVEMENTS.length} badges unlocked. Keep studying to earn more!</p>
      </div>
      <div class="card-flat" style="display:flex; align-items:center; gap:20px; margin-bottom:20px; padding:20px;">
        <div style="font-size:3rem;">🏅</div>
        <div style="flex:1;">
          <div style="font-weight:700; font-size:1.2rem;">${getLevel(s.xp).cur.title}</div>
          <div style="color:var(--text-dim); font-size:0.9rem;">Level ${getLevel(s.xp).cur.level} · ${s.xp} XP</div>
          <div class="xp-bar" style="margin-top:8px;"><div class="xp-fill" style="width:${(getLevel(s.xp).prog*100).toFixed(1)}%"></div></div>
        </div>
      </div>
      <div class="ach-grid">
        ${ACHIEVEMENTS.map(a=>{
          const got = !!s.achievements[a.id];
          return `<div class="ach-tile ${got?'':'locked'}">
            <div class="ach-icon">${a.icon}</div>
            <div class="ach-name">${a.title}</div>
            <div class="ach-desc">${a.desc}</div>
            <div style="font-size:0.65rem;color:var(--purple);margin-top:4px;font-weight:600;">+${a.xp} XP</div>
          </div>`;
        }).join('')}
      </div>
    </section>
  `;
}

/* ---------- Journey Timeline ---------- */
function renderJourney(){
  const stats = loadStats();
  const stops = getJourneyStops();
  const td = getTestDate();
  const days = daysUntilTest();
  app.innerHTML = `
    <section class="section active">
      <div class="section-header">
        <h1>🗺️ Your Journey to Dr. ${SHORT_NAME}</h1>
        <p class="section-subtitle">Every day of study, every question you answer, is one step closer. May Allah make each step easy.</p>
      </div>
      <div class="card-flat mb-16" style="padding:22px;">
        <div class="stats-grid">
          <div class="stat-big-card"><div class="stat-big-val">${stats.pomodorosCompleted}</div><div class="stat-big-label">Pomodoros</div></div>
          <div class="stat-big-card"><div class="stat-big-val">${Math.floor(stats.totalFocusMinutes/60)}h</div><div class="stat-big-label">Focus Time</div></div>
          <div class="stat-big-card"><div class="stat-big-val">${stats.quizQuestionsAnswered}</div><div class="stat-big-label">Q's Answered</div></div>
          <div class="stat-big-card"><div class="stat-big-val">${stats.quizQuestionsAnswered?Math.round((stats.quizCorrect/stats.quizQuestionsAnswered)*100):0}%</div><div class="stat-big-label">Accuracy</div></div>
          <div class="stat-big-card"><div class="stat-big-val">${stats.tasksCompleted}</div><div class="stat-big-label">Tasks Done</div></div>
          <div class="stat-big-card"><div class="stat-big-val">${getStreak()}</div><div class="stat-big-label">Day Streak</div></div>
        </div>
      </div>
      <div class="card-flat mb-16" style="padding:20px; display:flex; align-items:center; gap:16px; flex-wrap:wrap; justify-content:space-between;">
        <div>
          <div style="font-size:0.78rem; text-transform:uppercase; letter-spacing:0.12em; color:var(--purple); font-weight:700; margin-bottom:4px;">Test Day</div>
          <div style="font-family:'Space Grotesk'; font-size:1.5rem; font-weight:700;">${td.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
          <div style="color:var(--text-dim); font-size:0.9rem; margin-top:2px;">${days>0?days+' days to go — Bismillah':days===0?'Today is the day. Bismillah':'Test day has passed — mashaAllah'}</div>
        </div>
        <div class="row" style="gap:8px;">
          <button class="btn" id="change-date-btn">📅 Change Test Date</button>
          <button class="btn btn-primary" id="open-testday-letter">🔒 Sealed Letter</button>
        </div>
      </div>
      <div class="card-flat">
        <h3 style="margin-bottom:18px;">The Road Ahead</h3>
        <div class="journey-timeline">
          ${stops.map((stop,i)=>{
            const isPast = i<=1 ? false : false; // highlight based on date
            // Determine past/future based on stop date text roughly
            let cls = 'future';
            if(i===0) cls='past';
            if(days<=0 && i<=1) cls='past';
            return `<div class="journey-stop ${cls}">
              <div class="journey-dot ${cls}">${stop.emoji}</div>
              <div class="journey-date">${stop.date}</div>
              <div class="journey-title">${stop.title}</div>
              <div class="journey-desc">${stop.desc}</div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </section>
  `;
  qs('#change-date-btn').addEventListener('click', showChangeDateModal);
  qs('#open-testday-letter').addEventListener('click', ()=>navigate('testday'));
}

/* ---------- Change Test Date Modal ---------- */
function showChangeDateModal(){
  const m = document.createElement('div');
  m.className = 'modal-overlay';
  m.style.cssText = 'position:fixed;inset:0;z-index:500;background:rgba(11,7,32,0.7);backdrop-filter:blur(8px);display:grid;place-items:center;';
  const cur = getTestDate().toISOString().slice(0,10);
  m.innerHTML = `
    <div class="modal-content" style="max-width:380px;padding:28px;">
      <button class="modal-close" id="cd-close">×</button>
      <h2 style="margin-bottom:6px;">📅 Change Test Date</h2>
      <p style="color:var(--text-dim);margin-bottom:16px;">Pick your new test day. The countdown and schedule will recalculate.</p>
      <input type="date" id="cd-input" value="${cur}" min="2025-01-01" max="2030-12-31" style="width:100%;padding:12px;border-radius:var(--radius);border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:1rem;font-family:inherit;margin-bottom:16px;">
      <div class="row" style="justify-content:flex-end;gap:8px;">
        <button class="btn" id="cd-cancel">Cancel</button>
        <button class="btn btn-primary" id="cd-save">Save</button>
      </div>
    </div>
  `;
  document.body.appendChild(m);
  const close = ()=>m.remove();
  m.querySelector('#cd-close').onclick = close;
  m.querySelector('#cd-cancel').onclick = close;
  m.addEventListener('click',e=>{if(e.target===m)close();});
  m.querySelector('#cd-save').onclick = ()=>{
    const v = m.querySelector('#cd-input').value;
    if(v){setTestDate(v); showToast('Test date updated','— '+getTestDate().toLocaleDateString()); close(); if(state.view==='journey')renderJourney(); else navigate('journey');}
  };
}

/* ---------- Locked Test-Day Letter ---------- */
function renderTestDay(){
  const days = daysUntilTest();
  const unlocked = isLetterUnlocked();
  app.innerHTML = `
    <section class="section active">
      <div class="section-header" style="text-align:center;">
        <h1>🔒 Sealed Letter</h1>
        <p class="section-subtitle">Open this only on test day, ${SHORT_NAME}. It will not reveal until then.</p>
      </div>
      <div style="max-width:560px; margin:0 auto;">
        ${unlocked ? renderTestDayLetterOpen() : renderTestDaySealed(days)}
      </div>
    </section>
  `;
  if(unlocked && days<=0 && !loadStats().testDayOpened){ unlockLetter(); }
}

function renderTestDaySealed(days){
  const td = getTestDate();
  return `
    <div class="dedication-card" style="text-align:center;">
      <div style="font-size:5rem; margin:10px 0;">🔒</div>
      <h2 style="margin-bottom:8px;">Do not open until test day</h2>
      <p style="color:var(--text-dim); margin-bottom:24px;">This letter is sealed until <strong>${td.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</strong>.</p>
      <div style="display:inline-block; padding:18px 28px; border-radius:var(--radius); background:var(--surface); border:1px solid var(--border); margin-bottom:18px;">
        <div style="font-size:0.8rem; text-transform:uppercase; letter-spacing:0.12em; color:var(--text-mute); font-weight:700;">Days Until Unlocked</div>
        <div style="font-family:'Space Grotesk'; font-size:3rem; font-weight:700; background:linear-gradient(135deg,var(--purple),var(--pink)); -webkit-background-clip:text; background-clip:text; color:transparent; line-height:1;">${Math.max(0,days)}</div>
      </div>
    </div>
  `;
}

function renderTestDayLetterOpen(){
  return `
    <div class="dedication-card" style="text-align:center; animation:fadeUp 0.8s ease;">
      <div style="font-size:4rem; margin-bottom:8px;">🤲</div>
      <div dir="rtl" lang="ar" style="font-family:'Amiri',serif; font-size:2rem; line-height:1.8; color:var(--purple); margin:20px 0; font-weight:700;">${TESTDAY_ARABIC}</div>
      <div style="font-size:0.8rem; color:var(--text-mute); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:20px;">— Surah Ta-Ha 20:25-28</div>
      <div class="dedication-body" style="text-align:left;">
        <p>${TESTDAY_MESSAGE}</p>
      </div>
      <div class="row" style="justify-content:center; gap:10px; margin-top:28px;">
        <button class="btn btn-primary" data-jump="dashboard">Bismillah — let's go →</button>
      </div>
    </div>
  `;
}

/* ---------- Dedication Page ---------- */
function renderDedication(){
  const s = loadStats();
  s.dedicationRead = true;
  saveStats(s);
  checkAchievements();
  app.innerHTML = `
    <section class="section active">
      <div class="section-header" style="text-align:center;">
        <h1>✉️ A Note For You</h1>
      </div>
      <div class="dedication-card">
        <div style="font-size:3.5rem; margin-bottom:8px;">🩺</div>
        <h2 style="background:linear-gradient(135deg,var(--purple),var(--pink));-webkit-background-clip:text;background-clip:text;color:transparent;">To Dr. ${SHORT_NAME},</h2>
        <div class="dedication-body">
          <p>This is just a small gesture, but I hope it helps carry you through the long days and late nights ahead.</p>
          <p>The MCAT is a mountain, but you weren't made to stand at the bottom. Every Anki card you review, every question you solve, every morning you drag yourself to your desk when you'd rather sleep; it all matters. It is all planting seeds you'll see bloom inshaAllah.</p>
          <p>When it gets hard, and it will: remember why you started. Remember why you chose this path, remember the patients you'll treat one day, remember the life you imagined and dreamed of.</p>
          <p>And one day, when you walk across that stage as Dr. ${SHORT_NAME}, may I be there to say I always believed you would.</p>
          <p style="font-weight:700; color:var(--purple); margin-top:24px;">Have full faith in Allah, have full faith in yourself.</p>
        </div>
        <div class="row" style="justify-content:center; gap:10px; margin-top:28px;">
          <button class="btn btn-primary" data-jump="dashboard">← Back to studying</button>
        </div>
      </div>
    </section>
  `;
  qsa('[data-jump]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.jump)));
}


/* ============================================================
   WRONG ANSWER NOTEBOOK
   ============================================================ */
function renderWrong(){
  let wrong = loadWrongAnswers();
  const cats = ['All', ...new Set(wrong.map(w=>w.cat).filter(Boolean))];
  const filter = state.wrongFilter||'All';
  const showReviewed = !!state.wrongShowReviewed;
  let filtered = filter==='All'?wrong : wrong.filter(w=>w.cat===filter);
  if(!showReviewed) filtered = filtered.filter(w=>!w.reviewed);
  app.innerHTML = `
    <section class="section active">
      <div class="section-header">
        <h1>📓 Wrong Answer Notebook</h1>
        <p class="section-subtitle">Every wrong question logged is a point you won't miss on test day inshaAllah. Review these until you can teach them back.</p>
      </div>
      <div class="card-flat mb-16">
        <div class="row" style="gap:10px; flex-wrap:wrap; margin-bottom:14px;">
          <select id="wrong-cat" style="flex:1; min-width:140px;">
            ${cats.map(c=>`<option value="${c}" ${c===filter?'selected':''}>${c}</option>`).join('')}
          </select>
          <label style="display:inline-flex;align-items:center;gap:8px;font-size:0.88rem;cursor:pointer;">
            <input type="checkbox" id="wrong-show-rev" ${showReviewed?'checked':''}/> Show reviewed
          </label>
          <button class="btn" id="wrong-clear" style="font-size:0.82rem;">Clear reviewed</button>
        </div>
        <div style="font-size:0.9rem;color:var(--text-mute);margin-bottom:10px;">
          ${wrong.length} total logged · ${wrong.filter(w=>!w.reviewed).length} to review
        </div>
        ${filtered.length===0 ? `
          <div style="text-align:center;padding:40px 20px;color:var(--text-mute);">
            <div style="font-size:3rem;margin-bottom:10px;">📖</div>
            <p>${wrong.length===0?'Your wrong-answer book is empty. Miss a quiz question and it will show up here for review.':'Nothing to review in this filter. MashaAllah!'}
          </div>
        ` : filtered.map(w=>`
          <div class="wrong-item ${w.reviewed?'reviewed':''}" data-id="${w.id}">
            <div class="wrong-meta">
              <span class="wrong-cat">${w.cat||'General'}</span>
              <span class="wrong-date">${w.date?new Date(w.date).toLocaleDateString():''}</span>
            </div>
            <div class="wrong-q">${w.q}</div>
            <div class="wrong-choices">
              <div class="wc wc-wrong"><span class="wc-label">You picked:</span> ${w.userChoice||'(unanswered)'}</div>
              <div class="wc wc-right"><span class="wc-label">Correct:</span> ${w.correctAnswer}</div>
            </div>
            <div class="wrong-explain">${w.explain||''}</div>
            <div class="row" style="gap:8px;margin-top:10px;">
              <button class="btn btn-sm wrong-mark" data-id="${w.id}">${w.reviewed?'↩ Mark for review':'✓ I understand this now'}</button>
              <button class="btn btn-sm wrong-del" data-id="${w.id}">🗑</button>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
  qs('#wrong-cat').addEventListener('change',e=>{state.wrongFilter=e.target.value;renderWrong();});
  qs('#wrong-show-rev').addEventListener('change',e=>{state.wrongShowReviewed=e.target.checked;renderWrong();});
  qs('#wrong-clear').addEventListener('click',()=>{
    if(confirm('Remove all reviewed entries?')){
      const kept = loadWrongAnswers().filter(w=>!w.reviewed);
      localStorage.setItem('mcat-wrong',JSON.stringify(kept));
      showToast('Reviewed entries cleared'); renderWrong();
    }
  });
  qsa('.wrong-mark').forEach(b=>b.addEventListener('click',()=>{
    const id=+b.dataset.id;
    const arr=loadWrongAnswers();
    const entry=arr.find(x=>x.id===id);
    if(entry){markWrongReviewed(id,!entry.reviewed); showToast(entry.reviewed?'Marked for review':'✓ Marked as reviewed'); renderWrong();}
  }));
  qsa('.wrong-del').forEach(b=>b.addEventListener('click',()=>{
    if(confirm('Delete this entry?')){deleteWrong(+b.dataset.id);renderWrong();}
  }));
}

/* ============================================================
   TASBIH / DHIKR COUNTER
   ============================================================ */
let tasbihInterval=null;
function renderTasbih(){
  const t = loadTasbih();
  const preset = TASBIH_PRESETS.find(p=>p.id===t.current)||TASBIH_PRESETS[0];
  const target = t.target||preset.target;
  const pct = Math.min(1,t.count/target);
  app.innerHTML = `
    <section class="section active">
      <div class="section-header" style="text-align:center;">
        <h1>📿 Tasbih</h1>
        <p class="section-subtitle" style="margin:0 auto;">Remember Allah in your study breaks. A few moments of dhikr calm the heart and bring barakah.</p>
      </div>
      <div class="tasbih-card">
        <div class="tasbih-ar" dir="rtl">${preset.ar}</div>
        <div class="tasbih-en">${preset.en}</div>
        <div class="tasbih-meaning">${preset.meaning}</div>
        <select id="tasbih-preset" style="margin:14px auto; display:block; max-width:260px;">
          ${TASBIH_PRESETS.map(p=>`<option value="${p.id}" ${p.id===t.current?'selected':''}>${p.en} (${p.target})</option>`).join('')}
        </select>
        <button class="tasbih-count-btn" id="tasbih-tap">
          <div class="tasbih-num">${t.count}</div>
          <div class="tasbih-target">/ ${target}</div>
        </button>
        <div class="tasbih-bar"><div class="tasbih-fill" style="width:${pct*100}%"></div></div>
        <div class="row" style="gap:10px; justify-content:center; margin-top:18px;">
          <button class="btn" id="tasbih-reset">↺ Reset</button>
          <button class="btn btn-primary" id="tasbih-vibrate">${navigator.vibrate?'🔳 Toggle Vibration':'📳 Vibration not supported'}</button>
        </div>
        <div style="text-align:center; margin-top:18px; font-size:0.85rem; color:var(--text-mute);">
          Lifetime total: ${t.total||0} · Tap the button or press spacebar
        </div>
      </div>
    </section>
  `;
  function updateTasbih(){
    const btn=qs('#tasbih-tap'); const num=btn.querySelector('.tasbih-num'); const tgt=btn.querySelector('.tasbih-target');
    const fill=qs('.tasbih-fill');
    const cur=loadTasbih();
    const pr=TASBIH_PRESETS.find(p=>p.id===cur.current)||TASBIH_PRESETS[0];
    const t=cur.target||pr.target;
    num.textContent=cur.count; tgt.textContent='/ '+t;
    fill.style.width=Math.min(100,(cur.count/t)*100)+'%';
  }
  function tap(){
    const cur=loadTasbih();
    cur.count++; cur.total=(cur.total||0)+1;
    if(cur.count>=(cur.target||preset.target)){
      saveStats(Object.assign(loadStats(),{tasbihCompleted:true}));
      checkAchievements();
      showToast('✅ MashaAllah! Round complete +30 XP','May Allah accept your worship');
      launchConfetti();
      awardXP(30,'Tasbih round completed');
      cur.count=0;
    }
    saveTasbih(cur);
    if(navigator.vibrate && !cur.noVibrate) navigator.vibrate(20);
    updateTasbih();
  }
  qs('#tasbih-tap').addEventListener('click',tap);
  qs('#tasbih-reset').addEventListener('click',()=>{
    const cur=loadTasbih(); cur.count=0; saveTasbih(cur); updateTasbih();
  });
  qs('#tasbih-preset').addEventListener('change',e=>{
    const pr=TASBIH_PRESETS.find(p=>p.id===e.target.value);
    const cur=loadTasbih(); cur.current=pr.id; cur.target=pr.target; cur.count=0; saveTasbih(cur);
    renderTasbih();
  });
  const vbtn=qs('#tasbih-vibrate');
  if(navigator.vibrate){
    vbtn.addEventListener('click',()=>{
      const cur=loadTasbih(); cur.noVibrate=!cur.noVibrate; saveTasbih(cur);
      vbtn.textContent = cur.noVibrate?'🔳 Vibration off':'🔳 Vibration on';
    });
  }
  // Spacebar support
  tasbihInterval && document.removeEventListener('keydown',window._tasbihKey);
  window._tasbihKey = (ev)=>{if(ev.code==='Space' && state.view==='tasbih' && !ev.repeat){ev.preventDefault();tap();}};
  document.addEventListener('keydown',window._tasbihKey);
}

/* ============================================================
   TOOLS PAGE — hub for all the smaller features
   ============================================================ */
function renderTools(){
  const accent=getAccent();
  app.innerHTML = `
    <section class="section active">
      <div class="section-header">
        <h1>🧰 Tools & Reminders</h1>
        <p class="section-subtitle">Small things that help — checklist, breathing, future-self letter, daily win, heatmap, theme.</p>
      </div>

      <div class="grid grid-2 mb-16">
        <div class="card tool-card" id="tool-checklist">
          <div class="tool-icon">✅</div>
          <h3>Test-Day Checklist</h3>
          <p>Everything you need to pack, do, and remember the night before and morning of.</p>
          <button class="btn btn-primary">Open →</button>
        </div>
        <div class="card tool-card" id="tool-breathe">
          <div class="tool-icon">🌬️</div>
          <h3>Take a Breath</h3>
          <p>60-second box breathing (4-4-4-4) to calm anxiety between UWorld blocks.</p>
          <button class="btn btn-primary">Breathe →</button>
        </div>
        <div class="card tool-card" id="tool-selfletter">
          <div class="tool-icon">✍️</div>
          <h3>Letter to Future Self</h3>
          <p>Write a note sealed until test day. Read it alongside the one waiting for you.</p>
          <button class="btn btn-primary">${loadSelfLetter().written?'Edit your letter':'Write letter →'}</button>
        </div>
        <div class="card tool-card" id="tool-win">
          <div class="tool-icon">💫</div>
          <h3>Today's Win</h3>
          <p>Log one thing you're proud of today, no matter how small. Look back on test day.</p>
          <button class="btn btn-primary">Log a win →</button>
        </div>
        <div class="card tool-card" id="tool-heatmap">
          <div class="tool-icon">🟪</div>
          <h3>Focus Heatmap</h3>
          <p>See all your pomodoro days laid out — every purple square is a day you showed up.</p>
          <button class="btn btn-primary">View heatmap →</button>
        </div>
        <div class="card tool-card" id="tool-accent">
          <div class="tool-icon">🎨</div>
          <h3>Accent Color</h3>
          <p>Pick your favorite theme accent for the whole app.</p>
          <div class="accent-row">${ACCENTS.map(a=>`<button class="accent-dot" data-acc="${a.id}" style="background:${a.grad}" title="${a.name}"></button>`).join('')}</div>
        </div>
        <div class="card tool-card">
          <div class="tool-icon">🕌</div>
          <h3>Next Prayer</h3>
          <p>${(()=>{const n=nextPrayer();const h=Math.floor(n.minsLeft/60),m=n.minsLeft%60;return `<strong>${n.p.name}</strong>${n.p.ar?' · '+n.p.ar:''} in ~${h}h ${m}m — ${String(n.p.h).padStart(2,'0')}:${String(n.p.m).padStart(2,'0')}`;})()}</p>
          <p style="font-size:0.78rem;color:var(--text-mute);margin-top:4px;">Approx. for Beirut — confirm with a proper prayer app.</p>
        </div>
        <div class="card tool-card">
          <div class="tool-icon">📈</div>
          <h3>Score Projection</h3>
          <p>${(()=>{const p=projectScore();if(!p) return 'Log at least 2 full-length scores to see a trend.'; return `Last score: <strong>${p.last}</strong> · trending ${p.trend} · projected ~${p.projected} if you keep working like this.`;})()}</p>
          <button class="btn" data-jump="scores">Go to scores →</button>
        </div>
      </div>
    </section>
  `;
  qs('#tool-checklist').addEventListener('click',()=>showChecklistModal());
  qs('#tool-breathe').addEventListener('click',()=>showBreathingModal());
  qs('#tool-selfletter').addEventListener('click',()=>showSelfLetterModal());
  qs('#tool-win').addEventListener('click',()=>showWinModal());
  qs('#tool-heatmap').addEventListener('click',()=>showHeatmapModal());
  qsa('.accent-dot').forEach(b=>b.addEventListener('click',()=>{setAccent(b.dataset.acc);showToast('Theme updated');}));
  qsa('[data-jump]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.jump)));
}

/* ---------- Checklist Modal ---------- */
function showChecklistModal(){
  const checked = loadChecklist();
  let total=0,done=0;
  CHECKLIST_SECTIONS.forEach(sec=>sec.items.forEach(it=>{total++; if(checked[it])done++;}));
  const m=document.createElement('div');m.className='modal-overlay';m.style.cssText='position:fixed;inset:0;z-index:500;background:rgba(11,7,32,0.75);backdrop-filter:blur(8px);display:grid;place-items:center;padding:16px;';
  m.innerHTML=`
    <div class="modal-content" style="max-width:560px;max-height:85vh;overflow-y:auto;padding:24px;">
      <button class="modal-close" id="cl-x">×</button>
      <h2>✅ Game Day Ready</h2>
      <p style="color:var(--text-dim);margin-bottom:8px;">Tick off everything as you prepare. The app remembers what you've done.</p>
      <div style="margin-bottom:14px;">
        <div style="height:8px;background:rgba(255,255,255,0.08);border-radius:999px;overflow:hidden;"><div style="height:100%;background:linear-gradient(90deg,var(--purple),var(--pink));width:${total?(done/total*100):0}%;transition:width 0.4s;"></div></div>
        <div style="font-size:0.8rem;color:var(--text-mute);margin-top:4px;">${done}/${total} ready</div>
      </div>
      ${CHECKLIST_SECTIONS.map(sec=>`
        <div style="margin-bottom:18px;">
          <h3 style="margin-bottom:8px;font-size:1rem;">${sec.title}</h3>
          ${sec.items.map(it=>`
            <label style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;cursor:pointer;font-size:0.9rem;">
              <input type="checkbox" data-it="${it}" ${checked[it]?'checked':''} style="margin-top:3px;width:18px;height:18px;accent-color:var(--purple);flex-shrink:0;"/>
              <span style="color:var(--text-dim);${checked[it]?'text-decoration:line-through;opacity:0.6;':''}">${it}</span>
            </label>
          `).join('')}
        </div>
      `).join('')}
      <div class="row" style="justify-content:flex-end;">
        <button class="btn btn-primary" id="cl-done">Done</button>
      </div>
    </div>`;
  document.body.appendChild(m);
  const close=()=>m.remove();
  m.querySelector('#cl-x').onclick=close;
  m.querySelector('#cl-done').onclick=close;
  m.addEventListener('click',e=>{if(e.target===m)close();});
  m.querySelectorAll('input[type=checkbox]').forEach(cb=>cb.addEventListener('change',()=>{
    const c=loadChecklist(); c[cb.dataset.it]=cb.checked; saveChecklist(c);
    checkAchievements();
    const nt=c.parentElement.nextElementSibling?c.parentElement.querySelector('span'):null;
    if(nt){nt.style.textDecoration=cb.checked?'line-through':'none'; nt.style.opacity=cb.checked?'0.6':'1';}
    // update progress bar
    let t2=0,d2=0; CHECKLIST_SECTIONS.forEach(sec=>sec.items.forEach(it=>{t2++; const cc=loadChecklist(); if(cc[it])d2++;}));
    const bar=m.querySelector('div > div > div'); if(bar)bar.style.width=(d2/t2*100)+'%';
    const cnt=m.querySelector('div[style*="0.8rem"]'); if(cnt)cnt.textContent=d2+'/'+t2+' ready';
  }));
}

/* ---------- Breathing Modal ---------- */
function showBreathingModal(){
  const s=loadStats(); s.breathed=true; saveStats(s); checkAchievements(); awardXP(20,'Breathing exercise completed');
  const m=document.createElement('div');m.className='modal-overlay';m.style.cssText='position:fixed;inset:0;z-index:500;background:rgba(11,7,32,0.9);backdrop-filter:blur(16px);display:grid;place-items:center;padding:20px;';
  m.innerHTML=`
    <div style="text-align:center; color:white; max-width:420px;">
      <div id="breath-circle" style="width:200px;height:200px;border-radius:50%;border:3px solid rgba(167,139,250,0.5);background:radial-gradient(circle,rgba(167,139,250,0.2),rgba(236,72,153,0.15));margin:0 auto 30px;display:grid;place-items:center;transition:transform 4s cubic-bezier(.4,0,.4,1), background 4s; transform:scale(0.5);">
        <div id="breath-text" style="font-family:'Space Grotesk';font-size:1.4rem;font-weight:700;">Get ready…</div>
      </div>
      <p style="color:var(--text-dim);margin-bottom:20px;">Box breathing calms your nervous system in under a minute. Follow the circle.</p>
      <div class="row" style="gap:8px;justify-content:center;">
        <button class="btn" id="br-x">Close</button>
      </div>
    </div>`;
  document.body.appendChild(m);
  const close=()=>{clearInterval(iv);clearTimeout(st);m.remove();};
  m.querySelector('#br-x').onclick=close;
  const circle=m.querySelector('#breath-circle'), label=m.querySelector('#breath-text');
  const phases=[
    {t:'Breathe in',s:1.0, dur:4000},
    {t:'Hold',      s:1.0, dur:4000},
    {t:'Breathe out',s:0.5, dur:4000},
    {t:'Hold',      s:0.5, dur:4000},
  ];
  let phase=0, cycles=0;
  function step(){
    const p=phases[phase];
    label.textContent=p.t;
    circle.style.transform='scale('+p.s+')';
    phase=(phase+1)%4;
    if(phase===0) cycles++;
    if(cycles>=4){
      setTimeout(()=>{label.textContent='Done 💜 May Allah grant you calm.'; circle.style.transform='scale(1)';},100);
      return;
    }
    iv=setTimeout(step,p.dur);
  }
  let iv=setTimeout(step,1500);
  setTimeout(()=>label.textContent='Breathe in…',500);
}

/* ---------- Future Self Letter Modal ---------- */
function showSelfLetterModal(){
  if(isSelfLetterUnlocked()){
    // already unlocked — show it
    const sl = loadSelfLetter();
    const m=document.createElement('div');m.className='modal-overlay';m.style.cssText='position:fixed;inset:0;z-index:500;background:rgba(11,7,32,0.8);backdrop-filter:blur(12px);display:grid;place-items:center;padding:16px;';
    m.innerHTML=`<div class="modal-content" style="max-width:540px;max-height:85vh;overflow-y:auto;padding:28px;">
      <button class="modal-close" id="sl-x">×</button>
      <h2>✍️ From past-you</h2>
      <p style="color:var(--text-dim);font-size:0.85rem;">Written ${sl.date||'earlier this year'}</p>
      <div style="margin-top:18px;white-space:pre-wrap;line-height:1.8;color:var(--text);font-style:italic;border-left:3px solid var(--purple);padding-left:16px;">${sl.text||'(empty)'}</div>
    </div>`;
    document.body.appendChild(m);
    m.querySelector('#sl-x').onclick=()=>m.remove();
    m.addEventListener('click',e=>{if(e.target===m)m.remove();});
    return;
  }
  const sl=loadSelfLetter();
  const days=daysUntilTest();
  const m=document.createElement('div');m.className='modal-overlay';m.style.cssText='position:fixed;inset:0;z-index:500;background:rgba(11,7,32,0.8);backdrop-filter:blur(12px);display:grid;place-items:center;padding:16px;';
  m.innerHTML=`<div class="modal-content" style="max-width:540px;max-height:85vh;overflow-y:auto;padding:24px;">
    <button class="modal-close" id="sl-x">×</button>
    <h2>✍️ Letter to Future You</h2>
    <p style="color:var(--text-dim); margin-bottom:14px;">Write a note to yourself to open on test day inshaAllah — something your future self needs to hear.</p>
    ${sl.written?`<div style="padding:10px 14px;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.3);border-radius:10px;font-size:0.85rem;color:var(--green);margin-bottom:10px;">✓ Sealed ${sl.date}. You can edit below.</div>`:''}
    <textarea id="sl-text" rows="10" style="width:100%;padding:14px;border-radius:12px;background:var(--surface);border:1px solid var(--border);color:var(--text);font-family:inherit;font-size:0.95rem;line-height:1.7;resize:vertical;" placeholder="On test day, when I'm sitting in that room, I want myself to remember...">${sl.text||''}</textarea>
    <p style="font-size:0.8rem;color:var(--text-mute);margin-top:8px;">🔒 Seals automatically — unlocks in ~${days} days.</p>
    <div class="row" style="gap:8px;justify-content:flex-end;margin-top:14px;">
      <button class="btn" id="sl-cancel">Cancel</button>
      <button class="btn btn-primary" id="sl-save">Seal this letter</button>
    </div>
  </div>`;
  document.body.appendChild(m);
  const close=()=>m.remove();
  m.querySelector('#sl-x').onclick=close;
  m.querySelector('#sl-cancel').onclick=close;
  m.addEventListener('click',e=>{if(e.target===m)close();});
  m.querySelector('#sl-save').onclick=()=>{
    const t=m.querySelector('#sl-text').value.trim();
    if(!t){alert('Write something first, even just a line.');return;}
    saveSelfLetter(t); saveStats(Object.assign(loadStats(),{selfLetterWritten:true})); checkAchievements();
    awardXP(40,'Letter to self sealed');
    showToast('✍️ Sealed until test day inshaAllah','You\'ll see it when it matters most');
    close();
  };
}

/* ---------- Daily Win Modal ---------- */
function showWinModal(){
  const cur = getTodayWin();
  const wins = loadWins();
  const keys = Object.keys(wins).sort().reverse().slice(0,7);
  const m=document.createElement('div');m.className='modal-overlay';m.style.cssText='position:fixed;inset:0;z-index:500;background:rgba(11,7,32,0.75);backdrop-filter:blur(8px);display:grid;place-items:center;padding:16px;';
  m.innerHTML=`<div class="modal-content" style="max-width:500px;max-height:85vh;overflow-y:auto;padding:24px;">
    <button class="modal-close" id="w-x">×</button>
    <h2>💫 Today's Win</h2>
    <p style="color:var(--text-dim);margin-bottom:14px;">Write one thing — big or small — that you're proud of today. Even showing up counts.</p>
    <textarea id="w-text" rows="3" style="width:100%;padding:14px;border-radius:12px;background:var(--surface);border:1px solid var(--border);color:var(--text);font-family:inherit;font-size:0.95rem;resize:vertical;" placeholder="Today I...">${cur}</textarea>
    <div class="row" style="gap:8px;justify-content:flex-end;margin:14px 0;">
      <button class="btn" id="w-cancel">Close</button>
      <button class="btn btn-primary" id="w-save">Save</button>
    </div>
    ${keys.length?`<div style="border-top:1px solid var(--border);padding-top:14px;margin-top:6px;">
      <h3 style="font-size:0.9rem;color:var(--text-mute);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.1em;">Last ${keys.length} days</h3>
      ${keys.map(k=>`<div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:0.88rem;"><strong style="color:var(--purple);">${k.slice(5)}</strong> — ${wins[k]}</div>`).join('')}
    </div>`:''}
  </div>`;
  document.body.appendChild(m);
  const close=()=>m.remove();
  m.querySelector('#w-x').onclick=close; m.querySelector('#w-cancel').onclick=close;
  m.addEventListener('click',e=>{if(e.target===m)close();});
  m.querySelector('#w-save').onclick=()=>{
    saveTodayWin(m.querySelector('#w-text').value);
    checkAchievements();
    showToast('Saved 💫','May Allah fill your days with small victories');
    close();
  };
}

/* ---------- Focus Heatmap ---------- */
function showHeatmapModal(){
  const history = getPomoHistory();
  const weeks=52, days=7;
  const now=new Date(); now.setHours(0,0,0,0);
  // Start at the Sunday 52 weeks ago
  const start = new Date(now); start.setDate(start.getDate()-weeks*7+((7-start.getDay())%7));
  let cells='';
  const vals=[];
  for(let w=0;w<weeks;w++){
    for(let d=0;d<days;d++){
      const day=new Date(start); day.setDate(start.getDate()+w*7+d);
      if(day>now){cells+='<div class="hm-cell" style="background:transparent;"></div>';continue;}
      const k=day.getFullYear()+'-'+String(day.getMonth()+1).padStart(2,'0')+'-'+String(day.getDate()).padStart(2,'0');
      const v=history[k]||0; vals.push(v);
      let col='rgba(255,255,255,0.05)';
      if(v>=10) col='rgba(167,139,250,0.25)';
      if(v>=25) col='rgba(167,139,250,0.45)';
      if(v>=50) col='rgba(167,139,250,0.65)';
      if(v>=100)col='rgba(236,72,153,0.85)';
      if(v>=150)col='rgba(236,72,153,1)';
      const hr=Math.floor(v/60), mn=v%60;
      const label = v?`${hr?hr+'h ':''}${mn}m on ${k}`:'No focus logged';
      cells+=`<div class="hm-cell" style="background:${col};" title="${label}"></div>`;
    }
  }
  const total = Object.values(history).reduce((a,b)=>a+b,0);
  const daysWith = Object.values(history).filter(v=>v>0).length;
  const m=document.createElement('div');m.className='modal-overlay';m.style.cssText='position:fixed;inset:0;z-index:500;background:rgba(11,7,32,0.85);backdrop-filter:blur(12px);display:grid;place-items:center;padding:16px;';
  m.innerHTML=`<div class="modal-content" style="max-width:760px;width:100%;padding:24px;overflow-x:auto;">
    <button class="modal-close" id="hm-x">×</button>
    <h2>🟪 Focus Heatmap</h2>
    <p style="color:var(--text-dim);margin-bottom:14px;">Every square is a day. Darker = more pomodoro minutes. Look how far you've already come.</p>
    <div style="display:flex;gap:20px;margin-bottom:14px;flex-wrap:wrap;">
      <div><div class="hm-stat">${Math.floor(total/60)}h ${total%60}m</div><div class="hm-stat-label">Total focus</div></div>
      <div><div class="hm-stat">${daysWith}</div><div class="hm-stat-label">Days studied</div></div>
      <div><div class="hm-stat">${Object.values(history).length?Math.round(total/daysWith):0}m</div><div class="hm-stat-label">Avg on study days</div></div>
    </div>
    <div class="hm-grid" style="display:grid;grid-template-columns:repeat(${weeks},1fr);grid-template-rows:repeat(${days},1fr);gap:3px;">${cells}</div>
    <div style="display:flex;align-items:center;gap:6px;justify-content:flex-end;margin-top:10px;font-size:0.75rem;color:var(--text-mute);">
      Less <div class="hm-cell" style="width:12px;height:12px;background:rgba(255,255,255,0.05);"></div>
      <div class="hm-cell" style="width:12px;height:12px;background:rgba(167,139,250,0.25);"></div>
      <div class="hm-cell" style="width:12px;height:12px;background:rgba(167,139,250,0.45);"></div>
      <div class="hm-cell" style="width:12px;height:12px;background:rgba(167,139,250,0.65);"></div>
      <div class="hm-cell" style="width:12px;height:12px;background:rgba(236,72,153,0.85);"></div>
      <div class="hm-cell" style="width:12px;height:12px;background:rgba(236,72,153,1);"></div> More
    </div>
  </div>`;
  document.body.appendChild(m);
  m.querySelector('#hm-x').onclick=()=>m.remove();
  m.addEventListener('click',e=>{if(e.target===m)m.remove();});
}


/* ===========================================================
   AMINO ACID EXPLORER
   =========================================================== */
function renderAmino(){
  const groups = ['All','Nonpolar','Aromatic','Polar Uncharged','Acidic (-)','Basic (+)'];
  const filtered = state.aaFilter === 'All' ? AMINO_ACIDS : AMINO_ACIDS.filter(a => a.group === state.aaFilter);

  app.innerHTML = `
    <section class="section active">
      <div class="section-header">
        <h1>🧬 Amino Acid Explorer</h1>
        <p class="section-subtitle">Click any amino acid for details, structures, and high-yield connections. Master these cold — they show up across every section.</p>
      </div>

      <div class="row" style="justify-content:space-between; margin-bottom:16px;">
        <div class="group-tabs">
          ${groups.map(g => `<button class="group-tab ${state.aaFilter===g?'active':''}" data-group="${g}">${g}</button>`).join('')}
        </div>
        <div class="row" style="gap:16px;">
          <button class="btn btn-primary btn-sm" id="struct-quiz-btn">🔬 Structure Quiz</button>
          <div class="toggle-row">
            <span style="font-size:0.85rem;color:var(--text-dim);">Name Hide Mode</span>
            <div class="switch ${state.aaQuizMode?'on':''}" id="aa-quiz-toggle"></div>
          </div>
        </div>
      </div>

      <div class="aa-grid" id="aa-grid">
        ${filtered.map((aa,idx) => renderAACard(aa, idx)).join('')}
      </div>
    </section>

    <div class="modal" id="aa-modal">
      <div class="modal-content" id="aa-modal-content"></div>
    </div>

    <div class="modal" id="struct-quiz-modal">
      <div class="modal-content" id="struct-quiz-content" style="max-width:560px;"></div>
    </div>
  `;

  qsa('.group-tab').forEach(t => t.addEventListener('click', () => { state.aaFilter = t.dataset.group; renderAmino(); }));
  qs('#aa-quiz-toggle').addEventListener('click', () => {
    state.aaQuizMode = !state.aaQuizMode;
    renderAmino();
  });

  qsa('.aa-card').forEach((c,i) => c.addEventListener('click', () => {
    if(state.aaQuizMode){
      // Quiz: hide name, reveal on click
      c.classList.toggle('revealed');
      const nameEl = c.querySelector('.aa-name');
      const groupEl = c.querySelector('.aa-group');
      if(c.classList.contains('revealed')){
        nameEl.style.visibility='visible';
        groupEl.style.visibility='visible';
      } else {
        nameEl.style.visibility='hidden';
        groupEl.style.visibility='hidden';
      }
    } else {
      openAAModal(filtered[i]);
    }
  }));

  // If quiz mode, hide names initially
  if(state.aaQuizMode){
    qsa('.aa-card .aa-name, .aa-card .aa-group').forEach(el => el.style.visibility = 'hidden');
  }

  // Structure quiz button
  qs('#struct-quiz-btn').addEventListener('click', startStructureQuiz);
}

/* Structure identification quiz */
let structQuiz = {idx:0, score:0, pool:[], total:0, answered:false};
function startStructureQuiz(){
  // Pick 10 random amino acids; each question shows the structure + 4 choices (one correct, three random distractors)
  structQuiz.pool = shuffleArray(AMINO_ACIDS).slice(0,10);
  structQuiz.idx = 0;
  structQuiz.score = 0;
  structQuiz.total = structQuiz.pool.length;
  structQuiz.answered = false;
  showStructureQuestion();
}
function showStructureQuestion(){
  if(structQuiz.idx >= structQuiz.total){
    return endStructureQuiz();
  }
  const aa = structQuiz.pool[structQuiz.idx];
  // Pick 3 distractors from different amino acids
  const distractors = shuffleArray(AMINO_ACIDS.filter(x => x.abbr !== aa.abbr)).slice(0,3);
  const choices = shuffleArray([aa, ...distractors]);
  const pct = (structQuiz.idx / structQuiz.total)*100;

  const modal = qs('#struct-quiz-modal');
  const content = qs('#struct-quiz-content');
  content.innerHTML = `
    <button class="modal-close" id="sq-close">×</button>
    <div style="text-align:center;">
      <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.12em; color:var(--purple); font-weight:700;">🔬 Structure Identification Quiz</div>
      <h3 style="margin:6px 0 10px;">Identify this amino acid</h3>
      <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-mute); margin-bottom:8px;">
        <span>Question ${structQuiz.idx+1} of ${structQuiz.total}</span>
        <span>Score: ${structQuiz.score}/${structQuiz.idx}</span>
      </div>
      <div class="quiz-progress-bar" style="margin-bottom:14px;"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
    </div>
    <div style="display:grid; place-items:center; background:rgba(255,255,255,0.03); border-radius:${'var(--radius)'}; padding:10px; margin-bottom:14px; min-height:230px;">
      ${drawAAStructure(aa, {width:320, height:310})}
    </div>
    <div class="quiz-choices" id="sq-choices">
      ${choices.map((c,i) => `
        <button class="quiz-choice" data-abbr="${c.abbr}">
          <span class="choice-letter">${'ABCD'[i]}</span>
          <span><strong>${c.abbr}</strong> — ${c.name} <span style="color:var(--text-mute); font-size:0.85rem;">(${c.group})</span></span>
        </button>
      `).join('')}
    </div>
    <div id="sq-explain"></div>
  `;
  modal.classList.add('open');
  qs('#sq-close').addEventListener('click', () => modal.classList.remove('open'));
  qsa('#sq-choices .quiz-choice').forEach(b => {
    b.addEventListener('click', () => answerStructure(b, aa));
  });
}
function answerStructure(btn, correctAA){
  if(structQuiz.answered) return;
  structQuiz.answered = true;
  const picked = btn.dataset.abbr;
  const right = picked === correctAA.abbr;
  if(right) structQuiz.score++;

  qsa('#sq-choices .quiz-choice').forEach(b => {
    b.disabled = true;
    if(b.dataset.abbr === correctAA.abbr) b.classList.add('correct');
    else if(b === btn) b.classList.add('wrong');
  });
  qs('#sq-explain').innerHTML = `
    <div class="quiz-explain" style="${right?'':'background:rgba(248,113,113,0.08); border-color:rgba(248,113,113,0.3);'}">
      <strong>${right?'✅ Correct!':'❌ That was '+correctAA.name+' ('+correctAA.abbr+').'}</strong> ${correctAA.special.split(';')[0]}.
    </div>
    <div class="row" style="justify-content:center;">
      <button class="btn btn-primary" id="sq-next">${structQuiz.idx+1>=structQuiz.total?'See Results':'Next →'}</button>
    </div>
  `;
  qs('#sq-next').addEventListener('click', () => {
    structQuiz.idx++;
    structQuiz.answered = false;
    showStructureQuestion();
  });
}
function endStructureQuiz(){
  const pct = Math.round((structQuiz.score/structQuiz.total)*100);
  if(pct===100){
    const s=loadStats();
    s.structureQuizPerfect=true;
    saveStats(s);
    awardXP(30,'Structure quiz perfect!');
  }
  awardXP(10 + Math.floor(pct/20)*5, 'Structure quiz completed');
  let msg, emoji;
  if(pct===100){emoji="🏆"; msg="Perfect score! You're ready for any amino acid question."; launchConfetti();}
  else if(pct>=80){emoji="🔥"; msg="Excellent! Structures are looking solid.";}
  else if(pct>=60){emoji="💪"; msg="Good progress! Review the ones you missed and try again.";}
  else{emoji="📚"; msg="Keep drilling — open the explorer and click each structure to learn.";}
  const content = qs('#struct-quiz-content');
  content.innerHTML = `
    <button class="modal-close" id="sq-close2">×</button>
    <div style="text-align:center; padding:20px 0;">
      <div style="font-size:4rem;">${emoji}</div>
      <h2 style="margin-top:10px;">Structure Quiz Complete!</h2>
      <div class="quiz-end-score" style="font-family:'Space Grotesk'; font-size:3.5rem; font-weight:700; background:linear-gradient(135deg,var(--purple),var(--pink)); -webkit-background-clip:text; background-clip:text; color:transparent; line-height:1.1;">
        ${structQuiz.score}/${structQuiz.total}
      </div>
      <p style="margin:10px auto 20px; max-width:400px;">${pct}% correct. ${msg}</p>
      <div class="row" style="justify-content:center; gap:8px;">
        <button class="btn btn-primary" id="sq-again">🔬 Try Again</button>
        <button class="btn" id="sq-browse">Browse AAs</button>
      </div>
    </div>
  `;
  qs('#sq-close2').addEventListener('click', () => qs('#struct-quiz-modal').classList.remove('open'));
  qs('#sq-again').addEventListener('click', startStructureQuiz);
  qs('#sq-browse').addEventListener('click', () => qs('#struct-quiz-modal').classList.remove('open'));
}

function renderAACard(aa, idx){
  return `
    <div class="aa-card" style="--aa-color:${aa.color}" data-idx="${idx}">
      <div class="aa-one">${aa.one}</div>
      <div class="aa-abbr">${aa.abbr}</div>
      <div class="aa-name">${aa.name}</div>
      <div class="aa-group">${aa.group}</div>
      <div class="aa-pka">${aa.pKa !== '—' ? `pKa: ${aa.pKa}` : `pI: ${aa.pi}`}</div>
    </div>
  `;
}

function openAAModal(aa){
  const modal = qs('#aa-modal');
  const content = qs('#aa-modal-content');
  content.innerHTML = `
    <button class="modal-close" id="modal-close">×</button>
    <div style="display:flex; align-items:baseline; gap:14px; margin-bottom:4px;">
      <div style="font-family:'Space Grotesk'; font-size:2.8rem; font-weight:700; color:${aa.color}">${aa.abbr}</div>
      <div style="font-size:1.2rem; font-weight:700;">${aa.name}</div>
      <div style="margin-left:auto; background:rgba(0,0,0,0.3); width:40px; height:40px; display:grid; place-items:center; border-radius:10px; font-family:'Space Grotesk'; font-size:1.3rem; font-weight:700; color:var(--text-mute);">${aa.one}</div>
    </div>
    <div class="mb-16"><span class="badge" style="background:${aa.color}22; color:${aa.color}">${aa.group}</span> ${aa.aromatic ? '<span class="badge badge-pink">Aromatic</span>' : ''} <span class="badge badge-cyan">L-configuration (zwitterion)</span></div>

    <div class="card-flat" style="margin-bottom:14px; padding:8px; background:rgba(255,255,255,0.03); display:grid; place-items:center;">
      <div style="font-size:0.7rem; color:var(--text-mute); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:2px; margin-top:4px;">Chemical Structure @ pH 7.4</div>
      ${drawAAStructure(aa, {width:320, height:310})}
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
      <div class="card-flat" style="padding:12px;">
        <div style="font-size:0.72rem; color:var(--text-mute); text-transform:uppercase; letter-spacing:0.1em;">Side Chain (R)</div>
        <div style="font-family:'Space Grotesk'; font-size:1.05rem; margin-top:2px;">${aa.formula}</div>
      </div>
      <div class="card-flat" style="padding:12px;">
        <div style="font-size:0.72rem; color:var(--text-mute); text-transform:uppercase; letter-spacing:0.1em;">Charge @ pH 7.4</div>
        <div style="font-family:'Space Grotesk'; font-size:1.05rem; margin-top:2px;">${aa.charge}</div>
      </div>
      <div class="card-flat" style="padding:12px;">
        <div style="font-size:0.72rem; color:var(--text-mute); text-transform:uppercase; letter-spacing:0.1em;">pKa (R-group)</div>
        <div style="font-family:'Space Grotesk'; font-size:1.05rem; margin-top:2px;">${aa.pKa}</div>
      </div>
      <div class="card-flat" style="padding:12px;">
        <div style="font-size:0.72rem; color:var(--text-mute); text-transform:uppercase; letter-spacing:0.1em;">Isoelectric Pt (pI)</div>
        <div style="font-family:'Space Grotesk'; font-size:1.05rem; margin-top:2px;">${aa.pi}</div>
      </div>
    </div>

    <div class="card-flat" style="background:rgba(167,139,250,0.08); border-color:rgba(167,139,250,0.3);">
      <div style="font-size:0.72rem; color:var(--purple); text-transform:uppercase; letter-spacing:0.1em; font-weight:700; margin-bottom:6px;">🔑 High-Yield Connections</div>
      <div style="color:var(--text-dim); font-size:0.92rem;">${aa.special}</div>
    </div>
  `;
  modal.classList.add('open');
  qs('#modal-close').addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', e => { if(e.target === modal) modal.classList.remove('open'); });
}

/* ===========================================================
   MNEMONICS
   =========================================================== */
function renderMnemonics(){
  const s = loadStats(); s.mnemonicsViewed = true; saveStats(s);
  const cats = ['All', ...new Set(MNEMONICS.map(m => m.cat))];
  const filtered = MNEMONICS.filter(m =>
    (state.mnemCategory === 'All' || m.cat === state.mnemCategory) &&
    (state.mnemQuery === '' ||
      m.title.toLowerCase().includes(state.mnemQuery.toLowerCase()) ||
      m.mnemonic.toLowerCase().includes(state.mnemQuery.toLowerCase()) ||
      m.explains.toLowerCase().includes(state.mnemQuery.toLowerCase()))
  );

  app.innerHTML = `
    <section class="section active">
      <div class="section-header">
        <h1>💡 Mnemonic Library</h1>
        <p class="section-subtitle">Curated high-yield mnemonics to lock in the trickiest facts — grouped by section, searchable.</p>
      </div>

      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="text" id="mnem-search" placeholder="Search mnemonics (e.g., 'glycolysis', 'hormones', 'krebs')..." value="${state.mnemQuery}">
      </div>

      <div class="cat-filter">
        ${cats.map(c => `<button class="cat-chip ${state.mnemCategory===c?'active':''}" data-cat="${c}">${c}</button>`).join('')}
      </div>

      <div id="mnem-list">
        ${filtered.length ? filtered.map(m => `
          <div class="mnem-card">
            <div class="mnem-cat">${m.cat}</div>
            <div class="mnem-title">${m.title}</div>
            <div class="mnem-mnemonic">${m.mnemonic}</div>
            <div class="mnem-explain">${m.explains}</div>
          </div>
        `).join('') : '<p style="text-align:center;padding:40px;color:var(--text-mute);">No mnemonics match your search.</p>'}
      </div>
    </section>
  `;

  qs('#mnem-search').addEventListener('input', e => { state.mnemQuery = e.target.value; renderMnemonics(); });
  qsa('.cat-chip').forEach(c => c.addEventListener('click', () => { state.mnemCategory = c.dataset.cat; renderMnemonics(); }));
}

/* ===========================================================
   FORMULAS
   =========================================================== */
function renderFormulas(){
  const cats = [...new Set(FORMULAS.map(f => f.cat))];
  app.innerHTML = `
    <section class="section active">
      <div class="section-header">
        <h1>📐 Physics & Gen Chem Formulas</h1>
        <p class="section-subtitle">Every formula you should have memorized by test day — searchable and grouped by topic.</p>
      </div>

      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="text" id="formula-search" placeholder="Search formulas (e.g., 'force', 'kinetic', 'pressure', 'pH')...">
      </div>

      <div class="cat-filter" id="formula-cats">
        <button class="cat-chip active" data-cat="All">All</button>
        ${cats.map(c => `<button class="cat-chip" data-cat="${c}">${c}</button>`).join('')}
      </div>

      <div class="formula-grid" id="formula-grid"></div>
    </section>
  `;

  function drawFormulas(filterCat='All', q=''){
    const filtered = FORMULAS.filter(f =>
      (filterCat==='All' || f.cat === filterCat) &&
      (q === '' ||
        f.name.toLowerCase().includes(q.toLowerCase()) ||
        f.formula.toLowerCase().includes(q.toLowerCase()) ||
        f.cat.toLowerCase().includes(q.toLowerCase())));
    qs('#formula-grid').innerHTML = filtered.map(f => `
      <div class="formula-card">
        <div class="formula-cat">${f.cat}</div>
        <div class="formula-name">${f.name}</div>
        <div class="formula-eq">${f.formula}</div>
        ${f.tip ? `<div class="formula-tip">💡 ${f.tip}</div>` : ''}
      </div>
    `).join('');
  }
  drawFormulas();

  let curCat = 'All';
  qs('#formula-search').addEventListener('input', e => drawFormulas(curCat, e.target.value));
  qsa('#formula-cats .cat-chip').forEach(c => c.addEventListener('click', () => {
    qsa('#formula-cats .cat-chip').forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    curCat = c.dataset.cat;
    drawFormulas(curCat, qs('#formula-search').value);
  }));
}

/* ===========================================================
   PSYCH/SOC
   =========================================================== */
function renderPsych(){
  app.innerHTML = `
    <section class="section active">
      <div class="section-header">
        <h1>🧠 Psych/Soc Quick Reference</h1>
        <p class="section-subtitle">High-yield terms and theories that 515+ scorers flag as frequently tested. Pair with your Anki deck (Pankow/AnKing).</p>
      </div>
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="text" id="psych-search" placeholder="Search terms (e.g., 'conformity', 'Freud', 'attachment')...">
      </div>
      <div class="psych-grid" id="psych-grid"></div>
    </section>
  `;
  function draw(q=''){
    const filtered = PSYCH_TERMS.filter(t =>
      q === '' ||
      t.term.toLowerCase().includes(q.toLowerCase()) ||
      t.def.toLowerCase().includes(q.toLowerCase()));
    qs('#psych-grid').innerHTML = filtered.map(t => `
      <div class="psych-card">
        <div class="psych-term">${t.term}</div>
        <div class="psych-def">${t.def}</div>
      </div>
    `).join('');
  }
  draw();
  qs('#psych-search').addEventListener('input', e => draw(e.target.value));
}

/* ===========================================================
   QUIZ BOWL
   =========================================================== */
function shuffleArray(arr){
  const a = [...arr];
  for(let i=a.length-1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function renderQuiz(){
  if(!state.quizShuffled.length){
    state.quizShuffled = shuffleArray(QUIZ_QUESTIONS);
    state.quizIndex = 0;
    state.quizScore = 0;
    state.quizAnswered = false;
    state.quizCategories = {};
  }

  const total = state.quizShuffled.length;
  if(state.quizIndex >= total){
    return renderQuizEnd();
  }
  const q = state.quizShuffled[state.quizIndex];
  const pct = ((state.quizIndex)/total)*100;

  app.innerHTML = `
    <section class="section active">
      <div class="quiz-container">
        <div class="section-header">
          <h1>⚡ Quiz Bowl</h1>
          <p class="section-subtitle">High-yield rapid-fire questions. No penalty for guessing — review the explanation every time!</p>
        </div>

        <div class="quiz-header">
          <div>Question <strong>${state.quizIndex+1}</strong> of ${total}</div>
          <div class="quiz-score">Score: ${state.quizScore}/${state.quizIndex}</div>
        </div>
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>

        <div class="card">
          <div class="quiz-q">${q.q}</div>
          <div class="quiz-choices" id="quiz-choices">
            ${q.choices.map((c,i) => `
              <button class="quiz-choice" data-i="${i}">
                <span class="choice-letter">${'ABCD'[i]}</span>
                <span>${c}</span>
              </button>
            `).join('')}
          </div>
          <div id="quiz-explain-wrap"></div>
        </div>
        <div class="row" style="justify-content:center; margin-top:16px;">
          <button class="btn btn-ghost btn-sm" id="quiz-restart">↻ Restart</button>
        </div>
      </div>
    </section>
  `;

  qsa('.quiz-choice').forEach(btn => {
    btn.addEventListener('click', () => answerQuiz(parseInt(btn.dataset.i), q));
  });
  qs('#quiz-restart').addEventListener('click', () => {
    state.quizShuffled = shuffleArray(QUIZ_QUESTIONS);
    state.quizIndex = 0;
    state.quizScore = 0;
    state.quizAnswered = false;
    renderQuiz();
  });
}

function answerQuiz(i, q){
  if(state.quizAnswered) return;
  state.quizAnswered = true;
  const correct = i === q.answer;
  if(correct){
    state.quizScore++;
    playSound('correct');
    awardXP(3, 'Correct answer');
  } else {
    playSound('wrong');
    // Save to wrong-answer notebook
    saveWrongAnswer({
      q: q.q,
      userChoice: q.choices[i],
      correctAnswer: q.choices[q.answer],
      cat: cat,
      explain: q.explain,
    });
  }
  const s = loadStats();
  s.quizQuestionsAnswered++;
  if(correct) s.quizCorrect++;
  s.quizzesTaken = Math.max(s.quizzesTaken, Math.ceil((state.quizIndex+1)/30));
  saveStats(s);
  // Track category
  const cat = q.cat || 'General';
  if(!state.quizCategories[cat]) state.quizCategories[cat] = {correct:0,total:0};
  state.quizCategories[cat].total++;
  if(correct) state.quizCategories[cat].correct++;

  const choices = qsa('.quiz-choice');
  choices.forEach((b, bi) => {
    b.disabled = true;
    if(bi === q.answer) b.classList.add('correct');
    else if(bi === i) b.classList.add('wrong');
  });

  qs('#quiz-explain-wrap').innerHTML = `
    <div class="quiz-explain">
      <strong>${correct ? '✅ Correct!' : '❌ Not quite.'}</strong> ${q.explain}
    </div>
    <div class="row" style="justify-content:center;">
      <button class="btn btn-primary" id="next-q">${state.quizIndex+1 >= state.quizShuffled.length ? 'See Results 🏆' : 'Next Question →'}</button>
    </div>
  `;
  qs('#next-q').addEventListener('click', () => {
    state.quizIndex++;
    state.quizAnswered = false;
    renderQuiz();
  });
}

function renderQuizEnd(){
  const pct = Math.round((state.quizScore/state.quizShuffled.length)*100);
  let msg, emoji;
  if(pct>=90){msg="Incredible! You're in 520+ territory. Keep this up!"; emoji="🏆";}
  else if(pct>=75){msg="Great work! You're solidly in 515+ range. Review your misses."; emoji="🔥";}
  else if(pct>=60){msg="Nice! Content gaps to address but you're on the right track."; emoji="💪";}
  else{msg="Content foundation still building — review these topics then try again!"; emoji="📚";}

  // Find weakest categories
  const cats = Object.entries(state.quizCategories).map(([name,d])=>({
    name, pct: d.total?Math.round((d.correct/d.total)*100):100, correct:d.correct, total:d.total
  })).sort((a,b)=>a.pct-b.pct);
  const weak = cats.filter(c=>c.total>=2 && c.pct<70);

  playSound('complete');

  app.innerHTML = `
    <section class="section active">
      <div class="quiz-container">
        <div class="card quiz-end">
          <div style="font-size:4rem;">${emoji}</div>
          <h1 style="margin-top:12px;">Quiz Complete!</h1>
          <div class="quiz-end-score">${state.quizScore}/${state.quizShuffled.length}</div>
          <p style="font-size:1.1rem; margin-top:8px;">${pct}% correct</p>
          <p style="margin:14px auto 24px; max-width:450px;">${msg}</p>

          ${weak.length ? `
            <div class="weak-panel" style="text-align:left; max-width:450px; margin:0 auto 20px;">
              <h4>🎯 Focus Areas</h4>
              <p style="font-size:0.9rem; color:var(--text-dim); margin-bottom:8px;">Spend extra time reviewing these topics:</p>
              <ul style="margin-left:18px;">
                ${weak.map(w=>`<li style="font-size:0.88rem; color:var(--text-dim); margin-bottom:4px;"><strong style="color:var(--text);">${w.name}</strong> — ${w.correct}/${w.total} (${w.pct}%)</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <div style="max-width:450px; margin:0 auto 20px; text-align:left;">
            <div style="font-size:0.75rem; color:var(--text-mute); text-transform:uppercase; letter-spacing:0.1em; font-weight:700; margin-bottom:8px;">Category Breakdown</div>
            ${cats.map(c=>`
              <div style="margin-bottom:6px;">
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:3px;">
                  <span>${c.name}</span><span style="color:var(--text-mute);">${c.correct}/${c.total}</span>
                </div>
                <div style="height:6px; background:rgba(255,255,255,0.08); border-radius:999px; overflow:hidden;">
                  <div style="height:100%; width:${c.pct}%; background:linear-gradient(90deg,var(--purple),var(--pink)); border-radius:999px;"></div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="row" style="justify-content:center; gap:10px;">
            <button class="btn btn-primary" id="quiz-again">↻ Play Again</button>
            <button class="btn" data-jump="mnemonics">Review Mnemonics</button>
          </div>
        </div>
      </div>
    </section>
  `;
  qs('#quiz-again').addEventListener('click', () => {
    state.quizShuffled = shuffleArray(QUIZ_QUESTIONS);
    state.quizIndex = 0; state.quizScore = 0; state.quizAnswered = false;
    state.quizCategories = {};
    renderQuiz();
  });
  document.querySelector('[data-jump="mnemonics"]').addEventListener('click', () => navigate('mnemonics'));
}

/* ===========================================================
   METABOLIC PATHWAYS
   =========================================================== */
let currentPathway = 'glycolysis';
function renderPathways(){
  app.innerHTML = `
    <section class="section active">
      <div class="section-header">
        <h1>🔄 Metabolic Pathways</h1>
        <p class="section-subtitle">Interactive visualization of the highest-yield pathways. Rate-limiting enzymes in red, energy yield noted. Hover to learn.</p>
      </div>

      <div class="pathway-tabs">
        <button class="pathway-tab ${currentPathway==='glycolysis'?'active':''}" data-path="glycolysis">Glycolysis</button>
        <button class="pathway-tab ${currentPathway==='krebs'?'active':''}" data-path="krebs">Krebs (TCA) Cycle</button>
        <button class="pathway-tab ${currentPathway==='etc'?'active':''}" data-path="etc">Electron Transport Chain</button>
        <button class="pathway-tab ${currentPathway==='regulation'?'active':''}" data-path="regulation">Hormonal Regulation</button>
      </div>

      <div class="pathway-container" id="pathway-body"></div>
    </section>
  `;

  qsa('.pathway-tab').forEach(t => t.addEventListener('click', () => {
    currentPathway = t.dataset.path;
    renderPathways();
  }));

  drawPathway();
}

function node(name, enzyme, note, atp, rl){
  return `<div class="path-node ${rl?'rate-limiting':''} ${enzyme?'highlight-enzyme':''}">
    <div class="pn-name">${name}</div>
    ${enzyme?`<div class="pn-enzyme">${enzyme}</div>`:''}
    ${note?`<div class="pn-note">${note}</div>`:''}
    ${atp?`<div class="pn-atp">${atp}</div>`:''}
    ${rl?`<div class="pn-rl">RATE-LIMITING</div>`:''}
  </div>`;
}
const arrow = () => `<div class="path-arrow">→</div>`;

function drawPathway(){
  const body = qs('#pathway-body');
  if(currentPathway === 'glycolysis'){
    body.innerHTML = `
      <h3 style="text-align:center; margin-bottom:8px;">Glycolysis — Glucose → 2 Pyruvate (Cytoplasm)</h3>
      <p style="text-align:center; color:var(--text-mute); font-size:0.9rem; margin-bottom:20px;">Net: 2 ATP + 2 NADH + 2 pyruvate per glucose. Anaerobic.</p>
      <div class="pathway-flow">
        ${node('Glucose','Hexokinase','Traps glucose','−1 ATP')}${arrow()}
        ${node('Glucose-6-P','Phosphoglucose Isomerase')}${arrow()}
        ${node('Fructose-6-P')}${arrow()}
        ${node('Fructose-1,6-BP','PFK-1 🔴','Committed step','−1 ATP',true)}${arrow()}
        ${node('DHAP ↔ G3P','Aldolase / TIM','Yields 2 G3P')}${arrow()}
        ${node('1,3-BPG','G3P Dehydrogenase','','+2 NADH')}${arrow()}
        ${node('3-PG','Phosphoglycerate Kinase','Substrate-level PO₄','+2 ATP')}${arrow()}
        ${node('2-PG','Phosphoglycerate Mutase')}${arrow()}
        ${node('PEP','Enolase')}${arrow()}
        ${node('Pyruvate','Pyruvate Kinase','','+2 ATP')}
      </div>
      <div class="path-info">
        <h4>🔑 High-Yield Points</h4>
        <ul>
          <li><strong>Irreversible steps:</strong> Hexokinase, PFK-1, Pyruvate Kinase ("How Glycolysis Pushes Forward the Process")</li>
          <li><strong>Rate-limiting enzyme = PFK-1</strong> — activated by AMP, F-2,6-BP (insulin); inhibited by ATP, citrate, glucagon</li>
          <li><strong>Hexokinase</strong> (most cells, high affinity for glucose, feedback-inhibited by G6P) vs <strong>Glucokinase</strong> (liver/pancreas, low affinity, not inhibited by G6P — acts as glucose sensor)</li>
          <li><strong>Net per glucose:</strong> 2 ATP invested → 4 ATP produced = net 2 ATP + 2 NADH + 2 pyruvate</li>
          <li>Under anaerobic conditions (e.g., RBCs, exercising muscle), pyruvate → <strong>lactate</strong> (via LDH) to regenerate NAD⁺</li>
          <li>Arsenate inhibits G3P dehydrogenase → no net ATP; Fluoride inhibits enolase</li>
        </ul>
      </div>
    `;
  } else if(currentPathway === 'krebs'){
    body.innerHTML = `
      <h3 style="text-align:center; margin-bottom:8px;">Krebs Cycle (TCA/Citric Acid) — Mitochondrial Matrix</h3>
      <p style="text-align:center; color:var(--text-mute); font-size:0.9rem; margin-bottom:20px;">Per acetyl-CoA: 3 NADH + 1 FADH₂ + 1 GTP = 10 ATP equivalents. Cycle runs TWICE per glucose.</p>
      <div class="pathway-flow">
        ${node('Acetyl-CoA + OAA','Citrate Synthase','Condenses 2C + 4C')}${arrow()}
        ${node('Citrate','Aconitase')}${arrow()}
        ${node('Isocitrate')}${arrow()}
        ${node('α-Ketoglutarate','Isocitrate DH 🔴','First CO₂ + NADH','+NADH',true)}${arrow()}
        ${node('Succinyl-CoA','α-KG DH Complex','Second CO₂ + NADH','+NADH')}${arrow()}
        ${node('Succinate','Succinyl-CoA Synthetase','Substrate-level GTP','+GTP')}${arrow()}
        ${node('Fumarate','Succinate DH','Complex II of ETC','+FADH₂')}${arrow()}
        ${node('Malate','Fumarase')}${arrow()}
        ${node('Oxaloacetate','Malate DH','','+NADH')}
      </div>
      <div class="path-info">
        <h4>🔑 High-Yield Points</h4>
        <ul>
          <li><strong>Rate-limiting: Isocitrate dehydrogenase</strong> (activated by ADP/AMP; inhibited by ATP/NADH)</li>
          <li>Intermediates mnemonic: "Can I Keep Selling Seashells For Money, Officer?"</li>
          <li><strong>Succinate DH = Complex II</strong> of the ETC (membrane-bound; only TCA enzyme not in matrix)</li>
          <li>Products per acetyl-CoA: 3 NADH, 1 FADH₂, 1 GTP, 2 CO₂</li>
          <li>Per glucose (2 acetyl-CoA): 6 NADH, 2 FADH₂, 2 GTP → plus 2 NADH from pyruvate dehydrogenase (link step)</li>
          <li><strong>Anaplerotic reactions</strong> replenish OAA (e.g., pyruvate carboxylase using biotin; activated by acetyl-CoA)</li>
          <li>Thiamine (B1), lipoic acid, CoA, FAD, NAD⁺ are cofactors for α-KG DH complex (same as pyruvate DH complex)</li>
        </ul>
      </div>
    `;
  } else if(currentPathway === 'etc'){
    body.innerHTML = `
      <h3 style="text-align:center; margin-bottom:8px;">Electron Transport Chain & Oxidative Phosphorylation (Inner Mitochondrial Membrane)</h3>
      <p style="text-align:center; color:var(--text-mute); font-size:0.9rem; margin-bottom:20px;">NADH/FADH₂ → proton gradient → ATP via ATP synthase. ~2.5 ATP/NADH, ~1.5 ATP/FADH₂.</p>
      <div class="pathway-flow" style="margin-bottom:24px;">
        ${node('Complex I\n(NADH DH)','','Pumps 4H⁺','NADH→NAD⁺')}${arrow()}
        ${node('CoQ\n(Ubiquinone)','','Mobile carrier')}${arrow()}
        ${node('Complex III\n(Cytochrome b-c₁)','','Pumps 4H⁺')}${arrow()}
        ${node('Cytochrome c','','Mobile carrier')}${arrow()}
        ${node('Complex IV\n(Cyt c Oxidase)','','Pumps 2H⁺','O₂→H₂O')}${arrow()}
        ${node('ATP Synthase\n(Complex V)','','Rotary engine!','~3H⁺/ATP')}
      </div>
      <div class="pathway-flow" style="margin-bottom:20px;">
        <div style="padding:10px 14px; color:var(--text-mute); font-size:0.85rem;">FADH₂ enters via ↘</div>
        ${node('Complex II\n(Succinate DH)','','Same as TCA enzyme!','No H⁺ pumped')}
      </div>
      <div class="path-info">
        <h4>🔑 High-Yield Points</h4>
        <ul>
          <li><strong>Complex I & III & IV</strong> pump protons to intermembrane space; Complex II does NOT</li>
          <li>Electrons flow to progressively more <strong>positive reduction potentials</strong> (NADH → O₂ final acceptor)</li>
          <li><strong>ATP synthase</strong> uses proton-motive force: Fo subunit rotates as H⁺ flows; F₁ catalyzes ADP + Pi → ATP</li>
          <li><strong>Inhibitors:</strong> Rotenone (Complex I); Antimycin A (Complex III); Cyanide/CO (Complex IV); Oligomycin (ATP synthase)</li>
          <li><strong>Uncouplers</strong> (2,4-DNP, aspirin overdose, thermogenin/UCP1 in brown fat): dissipate gradient → heat instead of ATP</li>
          <li><strong>Total ATP per glucose:</strong> ~30-32 (eukaryotes) depending on shuttle (G3P shuttle yields ~1.5 from cytosolic NADH; malate-aspartate ~2.5)</li>
          <li>Glycolysis produces NADH in the <strong>cytoplasm</strong>; must be shuttled into mitochondria</li>
        </ul>
      </div>
    `;
  } else if(currentPathway === 'regulation'){
    body.innerHTML = `
      <h3 style="text-align:center; margin-bottom:8px;">Hormonal Regulation of Metabolism</h3>
      <p style="text-align:center; color:var(--text-mute); font-size:0.9rem; margin-bottom:20px;">Fed state vs fasting — insulin vs glucagon.</p>
      <div class="grid grid-2">
        <div class="card-flat" style="border-color:var(--green);">
          <h3 style="color:var(--green);">🟢 Insulin (Fed State — β-cells of pancreas)</h3>
          <p style="margin-top:10px; font-size:0.9rem;">Released when blood glucose is HIGH (after a meal). Activates phosphatases.</p>
          <ul style="margin-left:18px; margin-top:10px; color:var(--text-dim); font-size:0.88rem;">
            <li>Activates PFK-2 → ↑F2,6-BP → glycolysis ON</li>
            <li>Stimulates glycogen SYNTHESIS (glycogen synthase ON)</li>
            <li>Inhibits glycogen phosphorylase (glycogenolysis OFF)</li>
            <li>Promotes fatty acid SYNTHESIS, triglyceride storage</li>
            <li>Promotes protein synthesis, cell growth</li>
            <li>↑ GLUT4 transporters → glucose uptake into muscle/adipose</li>
          </ul>
        </div>
        <div class="card-flat" style="border-color:var(--orange);">
          <h3 style="color:var(--orange);">🟠 Glucagon (Fasting — α-cells of pancreas)</h3>
          <p style="margin-top:10px; font-size:0.9rem;">Released when blood glucose is LOW (fasting/exercise). Activates cAMP/PKA.</p>
          <ul style="margin-left:18px; margin-top:10px; color:var(--text-dim); font-size:0.88rem;">
            <li>Inhibits PFK-2 → ↓F2,6-BP → gluconeogenesis ON; glycolysis OFF</li>
            <li>Activates glycogen phosphorylase (glycogenolysis)</li>
            <li>Inhibits glycogen synthase</li>
            <li>Promotes gluconeogenesis in liver (PEPCK, F-1,6-BPase, G6Pase)</li>
            <li>Promotes lipolysis (hormone-sensitive lipase in adipose)</li>
            <li>Stimulates ketone body production (prolonged fast)</li>
          </ul>
        </div>
      </div>
      <div class="grid grid-3 mt-16">
        <div class="card-flat">
          <h3 style="color:var(--red);">🔴 Epinephrine</h3>
          <p style="font-size:0.88rem; margin-top:6px;">"Fight or flight" — acts on muscle/liver like glucagon but FASTER. Raises blood glucose acutely.</p>
        </div>
        <div class="card-flat">
          <h3 style="color:var(--yellow);">🟡 Cortisol</h3>
          <p style="font-size:0.88rem; margin-top:6px;">Long-term stress hormone (glucocorticoid). ↑ gluconeogenesis, ↑ lipolysis, ↑ proteolysis in muscle. Chronic high → hyperglycemia & immune suppression.</p>
        </div>
        <div class="card-flat">
          <h3 style="color:var(--cyan);">🔵 T3/T4 (Thyroid)</h3>
          <p style="font-size:0.88rem; margin-top:6px;">Basal metabolic rate. Increase Na⁺/K⁺-ATPase activity → increased O₂ consumption → increased heat.</p>
        </div>
      </div>
    `;
  }
}

/* ===========================================================
   CARS TRAINER
   =========================================================== */
function renderCars(){
  app.innerHTML = `
    <section class="section active">
      <div class="section-header">
        <h1>📝 CARS Trainer</h1>
        <p class="section-subtitle">Timed CARS practice with sample passages (9 passages / 90 minutes = ~10 min/passage on test day). These are simplified examples — always use official AAMC materials for the real thing.</p>
      </div>

      <div id="cars-start" class="card cars-setup">
        <div style="font-size:4rem;">⏱️</div>
        <h2 style="margin-top:12px;">Ready to practice CARS?</h2>
        <p style="max-width:500px; margin:12px auto 24px;">Choose a passage. Timer is set to 10 minutes (the gold-standard pace). Remember: 3-4 min reading, 6-7 min questions. No outside knowledge!</p>
        <div class="row" style="justify-content:center;" id="passage-choices">
          ${CARS_PASSAGES.map((p,i) => `<button class="btn btn-primary" data-passage="${i}">Passage ${i+1}: ${p.title.length>35?p.title.slice(0,35)+'…':p.title}</button>`).join('')}
        </div>
        <div class="cars-tips-grid" style="text-align:left;">
          ${CARS_TIPS.map(t => `
            <div class="tip-card">
              <h3>${t.title}</h3>
              <p>${t.body}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="cars-active" class="cars-passage-container">
        <div class="cars-timer-bar">
          <div>
            <button class="btn btn-sm btn-ghost" id="cars-back">← Back</button>
          </div>
          <div>Passage <span id="cars-pnum"></span> of ${CARS_PASSAGES.length} — <span id="cars-ptitle"></span></div>
          <div class="cars-time" id="cars-time">10:00</div>
        </div>
        <div class="cars-passage" id="cars-passage-text"></div>
        <div class="cars-q-block" id="cars-questions"></div>
        <div class="row" style="justify-content:center; margin-top:20px;">
          <button class="btn btn-success hidden" id="cars-score">See Results</button>
        </div>
      </div>
    </section>
  `;

  qsa('#passage-choices button').forEach(b => {
    b.addEventListener('click', () => startCars(parseInt(b.dataset.passage)));
  });
  qs('#cars-back').addEventListener('click', () => {
    clearInterval(state.carsTimer);
    state.carsTimer = null;
    renderCars();
  });
}

function startCars(i){
  state.carsCurrentPassage = i;
  state.carsTimeLeft = 10*60;
  state.carsAnswered = {};
  state.carsAnswersShown = false;

  qs('#cars-start').style.display='none';
  qs('#cars-active').classList.add('active');

  const p = CARS_PASSAGES[i];
  qs('#cars-pnum').textContent = i+1;
  qs('#cars-ptitle').textContent = p.title;
  qs('#cars-passage-text').innerHTML = `
    <div class="cars-passage-title">${p.title}</div>
    <div class="cars-passage-author">${p.author}</div>
    ${p.text.split('\n\n').map(par => `<p>${par}</p>`).join('')}
  `;
  qs('#cars-questions').innerHTML = p.questions.map((q, qi) => `
    <div class="quiz-q">${qi+1}. ${q.q}</div>
    <div class="quiz-choices" data-qi="${qi}">
      ${q.choices.map((c,ci) => `
        <button class="quiz-choice cars-choice" data-qi="${qi}" data-ci="${ci}">
          <span class="choice-letter">${'ABCD'[ci]}</span>
          <span>${c}</span>
        </button>
      `).join('')}
    </div>
  `).join('');

  qsa('.cars-choice').forEach(b => {
    b.addEventListener('click', () => {
      if(state.carsAnswersShown) return;
      const qi = parseInt(b.dataset.qi);
      state.carsAnswered[qi] = parseInt(b.dataset.ci);
      // Visual
      b.parentElement.querySelectorAll('.cars-choice').forEach(x => x.style.outline = '');
      b.style.outline = '2px solid var(--purple)';

      // If all answered, show "See Results"
      if(Object.keys(state.carsAnswered).length === p.questions.length){
        qs('#cars-score').classList.remove('hidden');
      }
    });
  });
  qs('#cars-score').addEventListener('click', gradeCars);

  updateCarsTime();
  if(state.carsTimer) clearInterval(state.carsTimer);
  state.carsTimer = setInterval(() => {
    state.carsTimeLeft--;
    updateCarsTime();
    if(state.carsTimeLeft <= 0){
      clearInterval(state.carsTimer);
      gradeCars();
    }
  }, 1000);
}

function updateCarsTime(){
  const m = Math.floor(state.carsTimeLeft/60);
  const s = state.carsTimeLeft%60;
  const el = qs('#cars-time');
  el.textContent = `${m}:${s.toString().padStart(2,'0')}`;
  el.classList.toggle('warning', state.carsTimeLeft < 60);
}

function gradeCars(){
  if(state.carsAnswersShown) return;
  state.carsAnswersShown = true;
  clearInterval(state.carsTimer);
  const p = CARS_PASSAGES[state.carsCurrentPassage];
  let correct = 0;
  p.questions.forEach((q, qi) => {
    const userChoice = state.carsAnswered[qi];
    const correctIdx = q.answer;
    qsa(`.cars-choice[data-qi="${qi}"]`).forEach((b, ci) => {
      b.disabled = true;
      const idx = parseInt(b.dataset.ci);
      if(idx === correctIdx) b.classList.add('correct');
      else if(idx === userChoice) b.classList.add('wrong');
      if(userChoice === undefined && idx === correctIdx) b.classList.add('correct');
    });
    if(userChoice === correctIdx) correct++;
  });

  // Scroll to top of questions
  qs('#cars-score').classList.add('hidden');
  const scoreEl = document.createElement('div');
  scoreEl.className = 'card-flat mt-16';
  scoreEl.style.textAlign='center';
  scoreEl.style.borderColor='var(--green)';
  scoreEl.style.background='rgba(52,211,153,0.08)';
  scoreEl.innerHTML = `
    <div style="font-family:'Space Grotesk'; font-size:2.5rem; font-weight:700;" class="text-gradient">${correct}/${p.questions.length}</div>
    <p style="margin-top:6px;">${correct === p.questions.length ? 'Perfect CARS accuracy! 🎯' : correct >= p.questions.length-1 ? 'Excellent work — focus on the question(s) you missed.' : 'Review the logic of any incorrect answers carefully. Remember: the answer is ALWAYS in the passage.'}</p>
    <div class="row" style="justify-content:center; gap:8px; margin-top:12px;">
      <button class="btn btn-primary" id="cars-again">Try Again</button>
      <button class="btn" id="cars-another">Try Another Passage</button>
    </div>
  `;
  qs('#cars-questions').before(scoreEl);
  scoreEl.scrollIntoView({behavior:'smooth', block:'center'});
  qs('#cars-again').addEventListener('click', () => startCars(state.carsCurrentPassage));
  qs('#cars-another').addEventListener('click', () => {
    renderCars();
  });
}

/* ===========================================================
   STUDY SCHEDULE BUILDER
   =========================================================== */
function computeSchedule(){
  const hoursPerWeek = parseInt(qs('#hours-week')?.value || 20);
  const startDate = new Date(qs('#start-date')?.value || new Date());
  const testDate = getTestDate();
  const targetScore = parseInt(qs('#target-score')?.value || 515);
  const baseline = parseInt(qs('#baseline')?.value || 500);

  const totalDays = Math.max(30, Math.ceil((testDate - startDate)/(1000*60*60*24)));
  const totalWeeks = Math.ceil(totalDays/7);

  // Phase split (research-backed for 515+)
  // If > 16 weeks: longer content phase
  // If ~12 weeks: 4+4+4
  // If <= 8 weeks: aggressive (2+3+3)
  let phase1Weeks, phase2Weeks, phase3Weeks;
  if(totalWeeks >= 20){
    phase1Weeks = Math.round(totalWeeks*0.5);
    phase2Weeks = Math.round(totalWeeks*0.3);
    phase3Weeks = totalWeeks - phase1Weeks - phase2Weeks;
  } else if(totalWeeks >= 12){
    phase1Weeks = Math.max(4, Math.round(totalWeeks/3));
    phase2Weeks = Math.round((totalWeeks - phase1Weeks)/2);
    phase3Weeks = totalWeeks - phase1Weeks - phase2Weeks;
  } else {
    phase1Weeks = Math.max(2, Math.floor(totalWeeks*0.3));
    phase2Weeks = Math.ceil((totalWeeks - phase1Weeks)/2);
    phase3Weeks = totalWeeks - phase1Weeks - phase2Weeks;
  }
  phase3Weeks = Math.max(4, phase3Weeks);
  phase2Weeks = totalWeeks - phase1Weeks - phase3Weeks;

  function buildWeeklyPlan(){
    const weeks = [];
    let weekNum = 1;

    // PHASE 1: Content Review
    const bioBiochemChapters = 12;
    const chemPhysChapters = 12;
    const psychSocChapters = 10;
    const totalChapters = bioBiochemChapters + chemPhysChapters + psychSocChapters;
    const chaptersPerWeek = Math.ceil(totalChapters / phase1Weeks);

    let chCount = 0;
    for(let w=1; w<=phase1Weeks; w++){
      const ch = [];
      for(let i=0;i<chaptersPerWeek && chCount < totalChapters; i++){
        const names = [
          // Biol/Biochem
          'Biochem: Amino Acids & Proteins','Biochem: Enzymes & Kinetics','Biochem: DNA/RNA & Biotech',
          'Bio: Cell Biology & Organelles','Bio: Metabolism & Bioenergetics','Bio: Molecular Biology (Central Dogma)',
          'Bio: Reproduction & Development','Bio: Nervous System','Bio: Endocrine System','Bio: Cardiovascular & Respiratory',
          'Bio: Renal & Digestive','Bio: Immune System & Muscle/Skeletal',
          // Chem/Phys
          'Gen Chem: Atomic & Periodic Trends','Gen Chem: Bonding & Intermolecular Forces',
          'Gen Chem: Thermodynamics & Kinetics','Gen Chem: Equilibrium & Solutions',
          'Gen Chem: Acids & Bases','Gen Chem: Electrochemistry',
          'O-Chem: Nomenclature & Stereochemistry','O-Chem: Functional Groups & Reactions',
          'Physics: Kinematics & Forces','Physics: Energy & Momentum','Physics: Fluids & Waves',
          'Physics: Electrostatics & Circuits','Physics: Optics & Light',
          // Psych/Soc
          'P/S: Biology & Behavior','P/S: Sensation & Perception','P/S: Learning & Memory',
          'P/S: Cognition & Development','P/S: Motivation/Emotion/Stress','P/S: Personality & Disorders',
          'P/S: Social Behavior & Attitudes','P/S: Social Stratification & Demography',
          'P/S: Research Methods & Statistics','P/S: Sociological Theories'
        ];
        if(chCount < names.length) ch.push(names[chCount]);
        chCount++;
      }
      weeks.push({
        phase:1,
        weekNum,
        title: w === 1 ? 'Diagnostic Exam + Start Content' : (w === phase1Weeks ? 'Finish content review, take first full-length' : `Content Review — Week ${w}`),
        tasks: [
          w === 1 ? '📋 Take a diagnostic full-length (Blueprint free or Kaplan sample) to establish baseline' : null,
          ch.length ? `📖 Content: ${ch.join('; ')}` : '📖 Finish remaining content review chapters',
          '🃏 Anki daily: Unsuspend cards corresponding to reviewed chapters (AnKing/Miledown/Pankow for P/S)',
          w <= 2 ? '📝 Light UWorld: 20-30 Q/day on completed chapters (untimed, learning mode)' : '📝 UWorld: 30-40 Q/day on reviewed subjects, thorough review',
          '📚 1-2 CARS passages daily (Jack Westin free daily)',
          w % 2 === 0 ? '📊 Half-length or full-length practice exam (Blueprint/Altius)' : null,
          '😴 One rest day per week'
        ].filter(Boolean)
      });
      weekNum++;
    }

    // PHASE 2: UWorld + 3rd party practice
    for(let w=1; w<=phase2Weeks; w++){
      weeks.push({
        phase:2,
        weekNum,
        title: w === 1 ? 'Begin heavy UWorld practice' : (w === phase2Weeks ? 'Finish UWorld, identify weak areas' : `Practice — Week ${w}`),
        tasks: [
          `📝 UWorld: ${hoursPerWeek>=20?'50-60':'30-40'} Q/day in TIMED blocks (${Math.min(hoursPerWeek,40)}+ hrs/week)`,
          '🔍 DEEP REVIEW: spend 1.5-2× the question time reviewing explanations — why right AND wrong',
          '📒 Error log: mark every missed concept → add to Anki or a notebook',
          `📚 CARS: 3-4 passages/day timed; review logic carefully`,
          '🃏 Anki: keep up with reviews (45-60 min/day); add cards for UWorld misses',
          '📊 One full-length exam every weekend (Blueprint/Altius, 1 AAMC FL mixed in by end)',
          '🎯 Targeted review on weakest areas per FL results',
          '😴 One rest day per week — burnout is real'
        ].filter(Boolean)
      });
      weekNum++;
    }

    // PHASE 3: AAMC ONLY (final push)
    const aamcOrder = [
      'AAMC Sample Test (unscored) — baseline for AAMC style',
      'AAMC FL 1 — full review over 2 days',
      'AAMC Section Bank (B/B, C/P, P/S) — hardest & best predictor; review deeply',
      'AAMC CARS Question Packs 1 & 2',
      'AAMC Question Packs (Bio, Chem, Phys)',
      'AAMC FL 2 — full review',
      'AAMC FL 3 — full review',
      'AAMC Biology Question Pack vol 1 & 2',
      'AAMC FL 4 — final full-length',
      'AAMC Official Guide questions',
      'Final review of missed questions, high-yield notes, amino acids & formulas'
    ];
    const perWeek = Math.ceil(aamcOrder.length / phase3Weeks);
    for(let w=1; w<=phase3Weeks; w++){
      const tasks = aamcOrder.slice((w-1)*perWeek, Math.min(w*perWeek, aamcOrder.length));
      weeks.push({
        phase:3,
        weekNum,
        title: w === 1 ? 'Start AAMC materials exclusively' : (w === phase3Weeks ? '🕌 Test Week! — Final review & rest' : `AAMC Phase — Week ${w}`),
        tasks: [
          ...tasks.map(t => `📘 ${t}`),
          w < phase3Weeks ? '📝 Continue reviewing every single question; revisit Section Bank problems' : null,
          w < phase3Weeks ? '🃏 Light Anki reviews; focus on high-yield weak points' : null,
          w === phase3Weeks ? '⚠️ NO new material 2-3 days before test. Light review only.' : null,
          w === phase3Weeks ? '😴 Sleep 8+ hours. Eat normally. Visit test center if possible. Tawakkul.' : null
        ].filter(Boolean)
      });
      weekNum++;
    }

    return weeks;
  }

  return {
    startDate,
    totalWeeks,
    phase1Weeks, phase2Weeks, phase3Weeks,
    hoursPerWeek, targetScore, baseline,
    weeks: buildWeeklyPlan()
  };
}

let schedule;

function renderSchedule(){
  // Load saved schedule if exists
  const saved = localStorage.getItem('mcat-schedule');
  if(!schedule){
    schedule = saved ? JSON.parse(saved) : null;
  }

  const today = new Date();
  const defaultStart = today.toISOString().split('T')[0];

  app.innerHTML = `
    <section class="section active">
      <div class="section-header">
        <h1>📅 Customizable Study Schedule</h1>
        <p class="section-subtitle">Built on the proven 3-phase approach used by 515+ scorers: Content Review → UWorld Practice → AAMC Refinement. Edit any week to fit your life!</p>
      </div>

      <div class="schedule-controls">
        <div class="sched-grid">
          <div>
            <label>Start Date</label>
            <input type="date" id="start-date" value="${defaultStart}">
          </div>
          <div>
            <label>Hours per Week (realistic)</label>
            <select id="hours-week">
              <option value="10">10 hrs (light — classes/work)</option>
              <option value="15">15 hrs (moderate)</option>
              <option value="20" selected>20 hrs (balanced part-time)</option>
              <option value="30">30 hrs (serious)</option>
              <option value="40">40+ hrs (full-time)</option>
            </select>
          </div>
          <div>
            <label>Baseline (diagnostic score)</label>
            <select id="baseline">
              <option value="485">&lt; 490</option>
              <option value="495">490–499</option>
              <option value="500" selected>500–504</option>
              <option value="505">505–509</option>
              <option value="510">510+</option>
            </select>
          </div>
          <div>
            <label>Target Score</label>
            <select id="target-score">
              <option value="505">505–508</option>
              <option value="510">510–514</option>
              <option value="515" selected>515–519</option>
              <option value="520">520+ (top tier)</option>
            </select>
          </div>
        </div>
        <div class="sched-btn-row">
          <button class="btn btn-primary" id="gen-schedule">✨ Generate Schedule</button>
          <button class="btn" id="save-schedule">💾 Save to Device</button>
          <button class="btn btn-ghost" id="reset-schedule">↺ Reset Edits</button>
        </div>
      </div>

      <div id="schedule-output"></div>
    </section>
  `;

  if(schedule){
    drawSchedule();
  }

  qs('#gen-schedule').addEventListener('click', () => {
    schedule = computeSchedule();
    drawSchedule();
  });
  qs('#save-schedule').addEventListener('click', () => {
    if(schedule){
      localStorage.setItem('mcat-schedule', JSON.stringify(schedule));
      showToast('💾 Schedule saved to your browser!');
    }
  });
  qs('#reset-schedule').addEventListener('click', () => {
    if(confirm('Reset all custom edits and regenerate?')){
      schedule = computeSchedule();
      drawSchedule();
    }
  });
}

function drawSchedule(){
  const out = qs('#schedule-output');
  if(!out) return;

  const p1Start = new Date(schedule.startDate);
  const p1End = new Date(p1Start); p1End.setDate(p1End.getDate() + schedule.phase1Weeks*7);
  const p2End = new Date(p1End); p2End.setDate(p2End.getDate() + schedule.phase2Weeks*7);
  const p3End = new Date(schedule.testDate || getTestDate());

  const fmt = d => d.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'});

  out.innerHTML = `
    <div class="grid grid-3 mb-16">
      <div class="card-flat" style="border-left: 4px solid var(--blue);">
        <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--blue); font-weight:700;">Phase 1 · ${schedule.phase1Weeks} weeks</div>
        <h3 style="margin:6px 0;">📚 Content Review</h3>
        <div style="font-size:0.82rem; color:var(--text-mute);">${fmt(p1Start)} → ${fmt(p1End)}</div>
        <p style="font-size:0.85rem; margin-top:8px;">Build your foundation. Work through books (Kaplan/TPR/Khan), Anki cards, light UWorld. One FL every 2 weeks.</p>
      </div>
      <div class="card-flat" style="border-left: 4px solid var(--purple);">
        <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--purple); font-weight:700;">Phase 2 · ${schedule.phase2Weeks} weeks</div>
        <h3 style="margin:6px 0;">⚡ Practice & Application</h3>
        <div style="font-size:0.82rem; color:var(--text-mute);">${fmt(p1End)} → ${fmt(p2End)}</div>
        <p style="font-size:0.85rem; margin-top:8px;">Heavy UWorld blocks, aggressive error logging, 3rd party FLs weekly. Identify and drill weak areas.</p>
      </div>
      <div class="card-flat" style="border-left: 4px solid var(--green);">
        <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--green); font-weight:700;">Phase 3 · ${schedule.phase3Weeks} weeks</div>
        <h3 style="margin:6px 0;">🎯 AAMC Refinement</h3>
        <div style="font-size:0.82rem; color:var(--text-mute);">${fmt(p2End)} → ${fmt(p3End)}</div>
        <p style="font-size:0.85rem; margin-top:8px;">AAMC ONLY. All FLs, Section Bank, QPacks. One FL per week under strict conditions. Deep 2-day reviews.</p>
      </div>
    </div>

    ${renderPhaseWeeks(1)}
    ${renderPhaseWeeks(2)}
    ${renderPhaseWeeks(3)}
  `;

  // Edit buttons
  qsa('.week-item').forEach(item => {
    item.addEventListener('click', () => editWeek(item));
  });
}

function renderPhaseWeeks(phase){
  const weeks = schedule.weeks.filter(w => w.phase === phase);
  if(!weeks.length) return '';
  const phaseClass = `phase-${phase}`;
  return `
    <div class="phase-card ${phaseClass}">
      <div class="phase-header">
        <div>
          <div class="phase-tag">Phase ${phase}</div>
          <div class="phase-title">${weeks[0].title.split('—')[0].trim()}</div>
        </div>
        <div style="font-size:0.85rem; color:var(--text-dim);">${weeks.length} weeks</div>
      </div>
      <div class="week-list">
        ${weeks.map((w,i) => `
          <div class="week-item" data-week="${w.weekNum-1}">
            <div class="week-num">Week ${w.weekNum}</div>
            <div class="week-content">${w.tasks.map(t => `<div>• ${t}</div>`).join('')}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function editWeek(item){
  const idx = parseInt(item.dataset.week);
  const w = schedule.weeks[idx];
  item.classList.add('editing');
  const content = item.querySelector('.week-content');
  const currentText = w.tasks.join('\n');
  content.innerHTML = `
    <textarea>${currentText}</textarea>
    <div class="row" style="margin-top:8px; gap:6px;">
      <button class="btn btn-sm btn-primary save-week">Save</button>
      <button class="btn btn-sm cancel-edit">Cancel</button>
    </div>
  `;
  content.querySelector('.save-week').addEventListener('click', () => {
    const newText = content.querySelector('textarea').value;
    w.tasks = newText.split('\n').filter(l => l.trim());
    w.custom = true;
    localStorage.setItem('mcat-schedule', JSON.stringify(schedule));
    drawSchedule();
  });
  content.querySelector('.cancel-edit').addEventListener('click', () => {
    item.classList.remove('editing');
    content.innerHTML = w.tasks.map(t => `<div>• ${t}</div>`).join('');
  });
}

/* ===========================================================
   POMODORO TIMER
   =========================================================== */
function initPomodoro(){
  const fab = qs('#pomodoro-fab');
  if(fab) fab.addEventListener('click', openPomodoro);
}

function openPomodoro(){
  // Close any existing
  let modal = qs('#pomodoro-modal');
  if(!modal){
    modal = document.createElement('div');
    modal.className = 'pomodoro-modal';
    modal.id = 'pomodoro-modal';
    modal.innerHTML = `
      <div class="pom-label" id="pom-label">Focus Session</div>
      <div class="pom-mode-row">
        <button class="pom-mode active" data-mode="focus">Focus (25)</button>
        <button class="pom-mode" data-mode="short">Short Break</button>
        <button class="pom-mode" data-mode="long">Long Break</button>
      </div>
      <div class="pom-circle">
        <svg class="pom-svg" width="200" height="200" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="pomGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#a78bfa"/>
              <stop offset="100%" stop-color="#ec4899"/>
            </linearGradient>
          </defs>
          <circle class="pom-bg-circle" cx="100" cy="100" r="85"/>
          <circle class="pom-fg-circle" id="pom-fg" cx="100" cy="100" r="85" stroke-dasharray="534" stroke-dashoffset="0"/>
        </svg>
        <div class="pom-time-display" id="pom-time">25:00</div>
      </div>
      <div class="pom-controls">
        <button class="btn btn-primary" id="pom-start">▶ Start</button>
        <button class="btn" id="pom-reset">↺ Reset</button>
      </div>
    `;
    document.body.appendChild(modal);

    qs('#pom-start').addEventListener('click', togglePom);
    qs('#pom-reset').addEventListener('click', resetPom);
    qsa('.pom-mode').forEach(b => b.addEventListener('click', () => {
      state.pomMode = b.dataset.mode;
      qsa('.pom-mode').forEach(x => x.classList.toggle('active', x.dataset.mode === state.pomMode));
      resetPom();
    }));
  }
  modal.classList.toggle('open');
}

function togglePom(){
  state.pomRunning = !state.pomRunning;
  const btn = qs('#pom-start');
  if(state.pomRunning){
    btn.innerHTML = '⏸ Pause';
    if(state.pomInterval) clearInterval(state.pomInterval);
    state.pomInterval = setInterval(() => {
      state.pomTimeLeft--;
      if(state.pomTimeLeft <= 0){
        clearInterval(state.pomInterval);
        state.pomRunning = false;
        btn.innerHTML = '▶ Start';
        if(state.pomMode === 'focus'){
          const s = loadStats();
          s.pomodorosCompleted++;
          s.totalFocusMinutes += 25;
          saveStats(s);
          recordPomoDay(25);
          awardXP(15, 'Pomodoro complete');
          showToast('🎉 Focus session complete! +15 XP', 'Take a well-deserved break');
          launchConfetti();
        } else {
          showToast('⏰ Break over! Ready to focus?');
        }
        resetPom();
        return;
      }
      updatePomDisplay();
    }, 1000);
  } else {
    btn.innerHTML = '▶ Start';
    clearInterval(state.pomInterval);
  }
}

function resetPom(){
  clearInterval(state.pomInterval);
  state.pomRunning = false;
  state.pomTimeLeft = POM_MODES[state.pomMode].sec;
  const btn = qs('#pom-start');
  if(btn) btn.innerHTML = '▶ Start';
  const lbl = qs('#pom-label');
  if(lbl) lbl.textContent = POM_MODES[state.pomMode].label + ' Session';
  updatePomDisplay();
}

function updatePomDisplay(){
  const m = Math.floor(state.pomTimeLeft/60);
  const s = state.pomTimeLeft%60;
  const pt = qs('#pom-time');
  if(pt) pt.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  const total = POM_MODES[state.pomMode].sec;
  const frac = state.pomTimeLeft/total;
  const circ = 2*Math.PI*85; // ~534
  const fg = qs('#pom-fg');
  if(fg) fg.style.strokeDashoffset = circ*(1-frac);
}

/* ===========================================================
   TOAST NOTIFICATIONS
   =========================================================== */
function showToast(text, src=''){
  const toast = qs('#quote-toast');
  qs('#quote-text').textContent = text;
  qs('#quote-src').textContent = src;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 5000);
}
function dismissToast(){
  const toast = qs('#quote-toast');
  if(toast){toast.classList.remove('show'); clearTimeout(toast._t);}
}

/* ---------- Live countdown tick (lightweight: updates numbers only, no full re-render) ---------- */
setInterval(() => {
  if(state.currentSection !== 'dashboard') return;
  const now = new Date();
  const diff = getTestDate() - now;
  if(diff <= 0) return;
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff / (1000*60*60)) % 24);
  const mins = Math.floor((diff / (1000*60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  const bigDay = document.querySelector('.countdown-days');
  const boxes = document.querySelectorAll('.countdown-box .countdown-num');
  if(bigDay) bigDay.textContent = days;
  if(boxes.length >= 4){
    boxes[0].textContent = days;
    boxes[1].textContent = hours;
    boxes[2].textContent = mins;
    boxes[3].textContent = secs;
  }
  // Also update phase badge if week boundary crossed (checks once per minute)
  if(secs === 0 && document.querySelector('.countdown-card')){
    // Phase recompute is rare enough that full re-render is fine once/min
    renderDashboard();
  }
}, 1000);

/* ===========================================================
   TASKS / DAILY CHECKLIST WITH STREAK
   =========================================================== */
function renderTasks(){
  const today = todayKey();
  if(!state.tasks[today]) state.tasks[today] = [];
  const todayTasks = state.tasks[today];

  // Build 7 days view
  const days = [];
  for(let i=0;i<7;i++){
    const d = new Date();
    d.setDate(d.getDate()-i);
    days.unshift(dateKey(d));
  }

  const streak = getStreak();
  const doneToday = todayTasks.filter(t=>t.done).length;
  const totalToday = todayTasks.length;

  app.innerHTML = `
    <section class="section active">
      <div class="section-header">
        <h1>✅ Daily Tasks & Streak</h1>
        <p class="section-subtitle">Check off what you accomplished today. The streak motivates consistency — small daily wins beat cramming!</p>
      </div>

      <div class="grid grid-3 mb-16">
        <div class="streak-card">
          <div class="streak-flame">🔥</div>
          <div class="streak-num">${streak}</div>
          <div style="font-size:0.9rem; color:var(--text-dim);">day streak</div>
          <p style="font-size:0.8rem; color:var(--text-mute); margin-top:8px;">${streak===0?'Complete at least one task today to start your streak!':streak<7?'Great momentum — keep going!':'MashaAllah, consistency is key!'}</p>
        </div>
        <div class="stat-card" style="grid-column:span 2;">
          <div class="stat-label">Today (${formatDate(today)})</div>
          <div class="stat-value" style="font-size:2.2rem;">${doneToday}/${totalToday}</div>
          <p style="color:var(--text-dim); font-size:0.9rem; margin-top:6px;">
            ${totalToday===0?'Add tasks below to get started for the day.':doneToday===totalToday?'MashaAllah, all tasks done today! 🎉':'You got this — keep pushing forward.'}
          </p>
          <div class="task-input-row" style="margin-top:14px;">
            <input type="text" id="new-task" placeholder="Add a new task (e.g., 20 UWorld Bio, Anki reviews, 3 CARS passages)…" onkeypress="if(event.key==='Enter')addTaskFromInput()">
            <button class="btn btn-primary" id="add-task-btn">+ Add</button>
          </div>
        </div>
      </div>

      <h2 style="margin-bottom:14px;">Last 7 Days</h2>
      ${days.map(k => renderTaskDay(k)).join('')}
    </section>
  `;

  qs('#add-task-btn').addEventListener('click', addTaskFromInput);
  bindTaskEvents();
  saveTasks();
}

function addTaskFromInput(){
  const inp = qs('#new-task');
  const txt = inp.value.trim();
  if(!txt) return;
  const today = todayKey();
  if(!state.tasks[today]) state.tasks[today]=[];
  state.tasks[today].push({text:txt, done:false, id:Date.now()});
  saveTasks();
  renderTasks();
}

function renderTaskDay(k){
  const tasks = state.tasks[k] || [];
  const done = tasks.filter(t=>t.done).length;
  const isToday = k === todayKey();
  const d = parseKey(k);
  const isPast = d < new Date(new Date().toDateString());
  return `
    <div class="task-day" data-day="${k}">
      <div class="task-day-header">
        <div>
          <div class="task-date">${isToday?'Today — ':''}${formatDate(d)}</div>
          <div style="font-size:0.8rem; color:var(--text-mute);">${done}/${tasks.length} completed</div>
        </div>
        ${done===tasks.length && tasks.length>0 ? '<span class="badge badge-green">✓ Complete</span>' : ''}
      </div>
      <div class="task-list">
        ${tasks.map(t => `
          <div class="task-item ${t.done?'done':''}" data-id="${t.id}" data-day="${k}">
            <div class="task-check" data-toggle="${t.id}" data-day="${k}">${t.done?'✓':''}</div>
            <div class="task-text">${escapeHtml(t.text)}</div>
            <button class="task-del" data-del="${t.id}" data-day="${k}" title="Delete">×</button>
          </div>
        `).join('')}
      </div>
      ${isToday ? `
        <div class="task-input-row">
          <input type="text" class="add-task-input" placeholder="Add task…" data-day="${k}">
          <button class="btn btn-primary btn-sm add-task-quick" data-day="${k}">+</button>
        </div>
      ` : ''}
    </div>
  `;
}

function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function bindTaskEvents(){
  qsa('.task-check').forEach(el => el.addEventListener('click', () => {
    const day = el.dataset.day;
    const id = +el.dataset.toggle;
    const t = state.tasks[day].find(x=>x.id===id);
    if(t){
      t.done = !t.done;
      if(t.done){
        const s = loadStats();
        s.tasksCompleted++;
        saveStats(s);
        awardXP(5,'Task completed');
        playSound('correct');
      }
      saveTasks(); renderTasks();
    }
  }));
  qsa('.task-del').forEach(el => el.addEventListener('click', () => {
    const day = el.dataset.day;
    const id = +el.dataset.del;
    state.tasks[day] = state.tasks[day].filter(x=>x.id!==id);
    saveTasks(); renderTasks();
  }));
  qsa('.add-task-quick').forEach(btn => btn.addEventListener('click', () => {
    const day = btn.dataset.day;
    const inp = document.querySelector('.add-task-input[data-day="'+day+'"]');
    const v = inp.value.trim(); if(!v) return;
    if(!state.tasks[day]) state.tasks[day]=[];
    state.tasks[day].push({text:v,done:false,id:Date.now()});
    saveTasks(); renderTasks();
  }));
  const sound = qs('#sound-toggle');
  if(sound){
    sound.classList.toggle('on', state.soundOn);
    sound.addEventListener('click', () => {
      state.soundOn = !state.soundOn;
      sound.classList.toggle('on', state.soundOn);
      localStorage.setItem('mcat-sound', state.soundOn?'true':'false');
    });
  }
}

/* ===========================================================
   LAB TECHNIQUES
   =========================================================== */
function renderLab(){
  const cats = [...new Set(LAB_TECHNIQUES.map(l=>l.cat))];
  app.innerHTML = `
    <section class="section active">
      <div class="section-header">
        <h1>🔬 Lab Techniques Reference</h1>
        <p class="section-subtitle">Every major lab technique tested on the MCAT — from PCR to ELISA to chromatography. High-yield connections included.</p>
      </div>
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="text" id="lab-search" placeholder="Search techniques (e.g., 'PCR', 'Western', 'chromatography')…">
      </div>
      <div class="cat-filter" id="lab-cats">
        <button class="cat-chip active" data-cat="All">All</button>
        ${cats.map(c=>`<button class="cat-chip" data-cat="${c}">${c}</button>`).join('')}
      </div>
      <div class="lab-grid" id="lab-grid"></div>
    </section>
  `;
  function drawLab(cat='All', q=''){
    const filt = LAB_TECHNIQUES.filter(l =>
      (cat==='All'||l.cat===cat) &&
      (q===''||(l.title+l.what+l.keypoints+l.reagents).toLowerCase().includes(q.toLowerCase())));
    qs('#lab-grid').innerHTML = filt.map(l => `
      <div class="lab-card">
        <div class="lab-cat">${l.cat}</div>
        <div class="lab-title">${l.title}</div>
        <div class="lab-what">${l.what}</div>
        ${l.steps ? `<div class="lab-section-title">How it works</div><div class="lab-body">${l.steps}</div>` : ''}
        ${l.reagents ? `<div class="lab-section-title">Key reagents / mnemonic</div><div class="lab-body">${l.reagents}</div>` : ''}
        <div class="lab-section-title">🔑 High-Yield</div>
        <div class="lab-body">${l.keypoints}</div>
      </div>
    `).join('');
  }
  drawLab();
  let cur='All';
  qs('#lab-search').addEventListener('input', e => drawLab(cur, e.target.value));
  qsa('#lab-cats .cat-chip').forEach(c => c.addEventListener('click', () => {
    qsa('#lab-cats .cat-chip').forEach(x=>x.classList.remove('active'));
    c.classList.add('active'); cur=c.dataset.cat;
    drawLab(cur, qs('#lab-search').value);
  }));
}

/* ===========================================================
   PHYSICS / CHEM CALCULATORS
   =========================================================== */
function renderCalc(){
  app.innerHTML = `
    <section class="section active">
      <div class="section-header">
        <h1>🧮 Calculators</h1>
        <p class="section-subtitle">Quick calculators for high-yield physics and gen chem problem types.</p>
      </div>
      <div class="calc-grid" id="calc-grid">
        ${CALCULATORS.map(c => `
          <div class="calc-card" data-calc="${c.id}">
            <div class="calc-title">${c.name}</div>
            <div class="calc-desc">${c.desc}</div>
            <div class="calc-fields">
              ${c.fields.map(f=>{
                if(f.type==='select'){
                  return `<div class="calc-field"><label>${f.label}</label><select class="calc-input" data-key="${f.key}">${f.options.map(o=>`<option>${o}</option>`).join('')}</select></div>`;
                }
                return `<div class="calc-field"><label>${f.label}</label><input type="${f.type}" class="calc-input" data-key="${f.key}" value="${f.default}" ${f.step?'step="'+f.step+'"':''} ${f.min!==undefined?'min="'+f.min+'"':''} ${f.max!==undefined?'max="'+f.max+'"':''}></div>`;
              }).join('')}
            </div>
            <button class="btn btn-primary btn-sm calc-compute" data-calc="${c.id}">Calculate</button>
            <div class="calc-result hidden" id="calc-result-${c.id}"></div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
  qsa('.calc-compute').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.calc;
    const calc = CALCULATORS.find(x=>x.id===id);
    const inputs = document.querySelectorAll('.calc-card[data-calc="'+id+'"] .calc-input');
    const vals = {};
    inputs.forEach(i => vals[i.dataset.key] = i.value);
    const res = qs('#calc-result-'+id);
    res.classList.remove('hidden');
    res.innerHTML = calc.compute(vals);
    playSound('tick');
  }));
  // Auto-compute on load
  qsa('.calc-compute').forEach(b => b.click());
}

/* ===========================================================
   FL SCORE TRACKER
   =========================================================== */
function renderScores(){
  if(!state.flScores){
    state.flScores = FL_EXAMS_DEFAULT.map(e => ({...e}));
    saveScores();
  }
  // Add target score default
  if(!state.flScores.target) state.flScores.target = 515;
  // Backwards compat: split out target
  let target = state.flScores.target || 515;
  const exams = state.flScores.exams || state.flScores.filter ? state.flScores : state.flScores.exams;
  // Migrate
  if(Array.isArray(state.flScores)){
    state.flScores = {target:515, exams: state.flScores};
    saveScores();
  }
  target = state.flScores.target;
  const examList = state.flScores.exams;

  // Sort by planned date (if given)
  const sorted = [...examList].sort((a,b)=>(a.plannedDate||'9999').localeCompare(b.plannedDate||'9999'));

  // Chart data — plot only scored exams
  const scored = sorted.filter(e=>e.score && !isNaN(+e.score)).map((e,i)=>({
    name:e.name, score:+e.score, company:e.company,
    date:e.plannedDate||i+1
  }));

  app.innerHTML = `
    <section class="section active">
      <div class="section-header">
        <h1>📊 Full-Length Score Tracker</h1>
        <p class="section-subtitle">Log your practice exam scores and watch your progress climb. Aim for a consistent upward trend — AAMC FLs (in green) are the most accurate predictors.</p>
      </div>

      <div class="chart-container">
        <div class="flex-between mb-16">
          <h3>Progress Over Time</h3>
          <div class="row">
            <label style="margin-bottom:0; font-size:0.85rem;">Target Score:</label>
            <input type="number" id="target-input" value="${target}" min="472" max="528" style="width:80px;">
          </div>
        </div>
        ${scored.length >= 1 ? drawScoreChart(scored, target) : '<p style="text-align:center; padding:40px; color:var(--text-mute);">Enter scores below to see your progress chart.</p>'}
      </div>

      <div class="card-flat">
        <h3 style="margin-bottom:12px;">Practice Exams</h3>
        <div style="overflow-x:auto;">
        <table class="score-table">
          <thead>
            <tr><th>Exam</th><th>Company</th><th>Date Taken</th><th>Score (472–528)</th><th></th></tr>
          </thead>
          <tbody id="score-rows">
            ${examList.map((e,i)=>`
              <tr data-idx="${i}">
                <td><input class="score-input" data-field="name" value="${escapeHtml(e.name)}"></td>
                <td>
                  <select class="score-input" data-field="company">
                    ${['AAMC','Blueprint','Altius','Kaplan','Other'].map(c=>`<option ${e.company===c?'selected':''}>${c}</option>`).join('')}
                  </select>
                </td>
                <td><input type="date" class="score-input" data-field="plannedDate" value="${e.plannedDate||''}"></td>
                <td><input type="number" class="score-input" data-field="score" value="${e.score||''}" min="472" max="528" placeholder="—"></td>
                <td><button class="btn btn-sm btn-ghost del-exam" data-idx="${i}">🗑</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        </div>
        <div class="row mt-16" style="gap:8px;">
          <button class="btn btn-sm" id="add-exam">+ Add Exam</button>
          <button class="btn btn-sm btn-ghost" id="reset-exams">↺ Reset to defaults</button>
        </div>
      </div>
    </section>
  `;

  // Bind score input events
  qsa('#score-rows tr').forEach(tr => {
    const idx = +tr.dataset.idx;
    tr.querySelectorAll('.score-input').forEach(inp => {
      inp.addEventListener('change', () => {
        const f = inp.dataset.field;
        state.flScores.exams[idx][f] = inp.value;
        saveScores();
        renderScores();
      });
      inp.addEventListener('input', () => {
        if(inp.type==='date' || inp.tagName==='SELECT'){
          const f = inp.dataset.field;
          state.flScores.exams[idx][f] = inp.value;
          saveScores();
        }
      });
    });
    tr.querySelector('.del-exam').addEventListener('click', () => {
      if(confirm('Delete this exam entry?')){
        state.flScores.exams.splice(idx,1);
        saveScores(); renderScores();
      }
    });
  });
  qs('#target-input').addEventListener('change', e => {
    state.flScores.target = +e.target.value;
    saveScores(); renderScores();
  });
  qs('#add-exam').addEventListener('click', () => {
    state.flScores.exams.push({name:'New Exam',company:'Other',plannedDate:'',score:''});
    saveScores(); renderScores();
  });
  qs('#reset-exams').addEventListener('click', () => {
    if(confirm('Reset exam list to defaults? This will clear your scores.')){
      state.flScores = {target:state.flScores.target||515, exams: FL_EXAMS_DEFAULT.map(e=>({...e}))};
      saveScores(); renderScores();
    }
  });
}

function drawScoreChart(scored, target){
  const W=900, H=300;
  const pad={t:20,r:30,b:40,l:50};
  const iw=W-pad.l-pad.r, ih=H-pad.t-pad.b;
  const minScore=472, maxScore=528;
  const y = s => pad.t + ih - ((s-minScore)/(maxScore-minScore))*ih;
  const x = i => iw * (i/Math.max(scored.length-1,1));
  let poly='', pts=[];
  scored.forEach((p,i)=>{
    const px=pad.l+x(i), py=y(p.score);
    pts.push({px,py,...p});
    poly+= (i?' L':'M')+px+','+py;
  });
  const targetY = y(target);
  return `
    <svg class="chart-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
      <!-- gridlines -->
      ${[472,485,500,510,515,520,528].map(s=>`
        <line x1="${pad.l}" y1="${y(s)}" x2="${W-pad.r}" y2="${y(s)}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        <text x="${pad.l-8}" y="${y(s)+4}" fill="var(--text-mute)" font-size="11" text-anchor="end" font-family="Space Grotesk">${s}</text>
      `).join('')}
      <!-- target line -->
      <line x1="${pad.l}" y1="${targetY}" x2="${W-pad.r}" y2="${targetY}" class="target-line"/>
      <text x="${W-pad.r+4}" y="${targetY+4}" fill="var(--green)" font-size="11" font-family="Space Grotesk">Target ${target}</text>
      <!-- area fill -->
      ${pts.length>1?`<path d="${poly} L${pts[pts.length-1].px},${H-pad.b} L${pts[0].px},${H-pad.b} Z" fill="url(#grad)" opacity="0.3"/>`:''}
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ec4899"/>
          <stop offset="100%" stop-color="#a78bfa" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <!-- line -->
      ${pts.length>1?`<path d="${poly}" fill="none" stroke="url(#gradline)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`:''}
      <defs>
        <linearGradient id="gradline" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#a78bfa"/>
          <stop offset="100%" stop-color="#ec4899"/>
        </linearGradient>
      </defs>
      <!-- points -->
      ${pts.map(p=>`
        <circle cx="${p.px}" cy="${p.py}" r="7" fill="${p.company==='AAMC'?'#34d399':(p.company==='Blueprint'?'#60a5fa':'#a78bfa')}" stroke="white" stroke-width="2"/>
        <text x="${p.px}" y="${p.py-14}" fill="var(--text)" font-size="11" font-weight="700" text-anchor="middle" font-family="Space Grotesk">${p.score}</text>
      `).join('')}
      <!-- axis -->
      <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${H-pad.b}" stroke="var(--border)" stroke-width="1"/>
      <line x1="${pad.l}" y1="${H-pad.b}" x2="${W-pad.r}" y2="${H-pad.b}" stroke="var(--border)" stroke-width="1"/>
      <text x="${pad.l-32}" y="${pad.t+ih/2}" fill="var(--text-mute)" font-size="11" text-anchor="middle" transform="rotate(-90 ${pad.l-32} ${pad.t+ih/2})" font-family="Space Grotesk">Score</text>
    </svg>
    <div style="display:flex; gap:12px; justify-content:center; margin-top:8px; font-size:0.8rem; color:var(--text-mute);">
      <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--green);vertical-align:middle;margin-right:4px;"></span>AAMC (most accurate)</span>
      <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--blue);vertical-align:middle;margin-right:4px;"></span>Blueprint</span>
      <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--purple);vertical-align:middle;margin-right:4px;"></span>Other 3rd party</span>
    </div>
  `;
}

/* ===========================================================
   DU'AS
   =========================================================== */
function renderDuas(){
  app.innerHTML = `
    <section class="section active">
      <div class="section-header">
        <h1>🕌 Du'as for Seeking Knowledge & Exams</h1>
        <p class="section-subtitle">A collection of supplications from the Qur'an and Sunnah to seek Allah's help in your studies. May Allah accept and make your journey easy.</p>
      </div>
      <div class="card-flat mb-16" style="border-color:var(--green);">
        <p style="font-size:0.92rem;">The Prophet ﷺ said: <em>"Whoever travels a path seeking knowledge, Allah will make easy for them a path to Paradise."</em> (Sahih Muslim). Make du'a with sincerity, work hard, and put your trust in Allah.</p>
      </div>
      <div class="dua-grid">
        ${DUAS.map(d=>`
          <div class="dua-card">
            <div class="dua-title">${d.title}</div>
            ${d.arabic?`<div class="dua-arabic">${d.arabic}</div>`:''}
            ${d.translit?`<div class="dua-translit">${d.translit}</div>`:''}
            <div class="dua-meaning">${d.meaning}</div>
            ${d.note?`<div class="dua-note">${d.note}</div>`:''}
          </div>
        `).join('')}
      </div>
      <div class="card-flat mt-24">
        <h3 style="margin-bottom:8px;">💡 Practical tips for barakah in your studies</h3>
        <ul style="margin-left:20px; color:var(--text-dim); font-size:0.9rem; line-height:1.8;">
          <li>Pray your five daily prayers on time — this is the foundation of all success.</li>
          <li>Make du'a in the last third of the night and between adhan and iqamah (times of acceptance).</li>
          <li>Send salah (blessings) upon the Prophet ﷺ abundantly.</li>
          <li>Begin studying with "Bismillah" and end with gratitude (Alhamdulillah).</li>
          <li>Give charity (sadaqah) regularly — sadaqah repels calamity and opens doors.</li>
          <li>Ask Allah to make what you learn a benefit, and to keep you sincere — knowledge that doesn't benefit is a weight.</li>
          <li>Your parents' du'a is one of the fastest accepted — keep them happy!</li>
        </ul>
      </div>
    </section>
  `;
}

/* ---------- Initialize ---------- */
function initNavToggle(){
  const toggle = qs('#nav-toggle');
  const links = qs('#nav-links');
  if(!toggle || !links) return;
  toggle.addEventListener('click', ()=>{
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open?'true':'false');
  });
  // Close menu when a link is tapped
  qsa('.nav-link', links).forEach(btn=>{
    btn.addEventListener('click', ()=>{
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
    });
  });
  // Close when tapping outside
  document.addEventListener('click', (e)=>{
    if(links.classList.contains('open') && !links.contains(e.target) && !toggle.contains(e.target)){
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
    }
  });
}

function initApp(){
  // Bind navigation
  qsa('.nav-link').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.section));
  });
  initNavToggle();
  initTheme();
  setAccent(getAccent().id);
  initPomodoro();
  resetPom();
  // Toast dismiss (multiple events for iOS reliability)
  const tc = qs('#toast-close');
  const doDismiss=(e)=>{e.stopPropagation();e.preventDefault();dismissToast();};
  if(tc){
    tc.addEventListener('click',doDismiss);
    tc.addEventListener('touchend',doDismiss,{passive:false});
  }
  const tt = qs('#quote-toast');
  if(tt) tt.addEventListener('click', e=>{ if(e.target===tt) dismissToast(); });
  renderDashboard(); // start on dashboard
  // What's New popup for this update (shows once)
  setTimeout(showWhatsNew, 600);
}

function showWhatsNew(){
  const key='mcat-whatsnew-v5';
  if(localStorage.getItem(key)) return;
  localStorage.setItem(key,'1');
  const m=document.createElement('div');
  m.className='whatsnew-overlay';
  m.style.cssText='position:fixed;inset:0;z-index:600;background:rgba(11,7,32,0.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);display:grid;place-items:center;padding:20px;animation:fadeUp 0.5s ease;';
  m.innerHTML=`
    <div class="whatsnew-card" style="max-width:480px;width:100%;background:var(--surface);border:1px solid var(--border-strong);border-radius:20px;padding:30px 26px;position:relative;text-align:center;max-height:90vh;overflow-y:auto;-webkit-overflow-scrolling:touch;">
      <button class="modal-close" id="wn-x" style="position:absolute;top:14px;right:14px;">×</button>
      <div style="font-size:3rem;margin-bottom:8px;">🆕</div>
      <h2 style="margin-bottom:6px;background:linear-gradient(135deg,var(--purple),var(--pink));-webkit-background-clip:text;background-clip:text;color:transparent;">Updated for you</h2>
      <p style="color:var(--text-dim);font-size:0.92rem;margin-bottom:18px;">Bismillah — a fresh batch of features to help you through these months, and the whole app now works properly on phones and tablets.</p>
      <div style="text-align:left;display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <span style="font-size:1.3rem;flex-shrink:0;">📱</span>
          <div><strong style="font-size:0.92rem;">Phone & tablet friendly</strong><div style="font-size:0.82rem;color:var(--text-mute);margin-top:2px;line-height:1.5;">Hamburger menu, proper spacing, bigger tap targets, no more cut-off toasts. Works smoothly on iPhones, iPads, and Android.</div></div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <span style="font-size:1.3rem;flex-shrink:0;">✍️</span>
          <div><strong style="font-size:0.92rem;">Letter to your future self</strong><div style="font-size:0.82rem;color:var(--text-mute);margin-top:2px;line-height:1.5;">Write a note sealed until test day — open it alongside the one waiting for you, inshaAllah. Under Tools.</div></div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <span style="font-size:1.3rem;flex-shrink:0;">📓</span>
          <div><strong style="font-size:0.92rem;">Wrong Answer Notebook</strong><div style="font-size:0.82rem;color:var(--text-mute);margin-top:2px;line-height:1.5;">Every quiz question you miss is auto-saved for review. Mark ones you've mastered. In the nav.</div></div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <span style="font-size:1.3rem;flex-shrink:0;">📿</span>
          <div><strong style="font-size:0.92rem;">Tasbih counter</strong><div style="font-size:0.82rem;color:var(--text-mute);margin-top:2px;line-height:1.5;">SubhanAllah, Alhamdulillah, Allahu Akbar & more — with Arabic and vibration feedback for study breaks.</div></div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <span style="font-size:1.3rem;flex-shrink:0;">🌬️</span>
          <div><strong style="font-size:0.92rem;">Take a Breath</strong><div style="font-size:0.82rem;color:var(--text-mute);margin-top:2px;line-height:1.5;">60-second box breathing exercise for anxiety before UWorld blocks. Under Tools.</div></div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <span style="font-size:1.3rem;flex-shrink:0;">✅</span>
          <div><strong style="font-size:0.92rem;">Test-Day Checklist</strong><div style="font-size:0.82rem;color:var(--text-mute);margin-top:2px;line-height:1.5;">Packing, suhoor, du'a, sleep — everything to remember the night before and morning of.</div></div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <span style="font-size:1.3rem;flex-shrink:0;">💫</span>
          <div><strong style="font-size:0.92rem;">Daily Wins · Heatmap · Themes · Prayer times</strong><div style="font-size:0.82rem;color:var(--text-mute);margin-top:2px;line-height:1.5;">Small ways to see your progress, stay grounded, and make it feel yours.</div></div>
        </div>
      </div>
      <p style="font-size:0.85rem;color:var(--text-mute);font-style:italic;margin-bottom:16px;line-height:1.6;">May Allah make every hour of study count, keep your heart at peace, and bring you to that white coat inshaAllah.</p>
      <button class="btn btn-primary" id="wn-ok" style="width:100%;justify-content:center;padding:14px;font-size:1rem;min-height:48px;">Bismillah, let's study →</button>
    </div>
  `;
  document.body.appendChild(m);
  const close=()=>{m.style.opacity='0';m.style.transition='opacity 0.3s'; setTimeout(()=>m.remove(),350);};
  m.querySelector('#wn-x').onclick=close;
  m.querySelector('#wn-ok').onclick=()=>{close(); launchConfetti();};
  m.addEventListener('click',e=>{if(e.target===m)close();});
}
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

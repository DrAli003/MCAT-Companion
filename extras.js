/* ============================================================
   MCAT COMPANION — EXTRAS: XP, Levels, Achievements, Confetti,
   Question of the Day, Journey Timeline, Stats, Dedication
   ============================================================ */

const USER_NAME = "Dr. Leen";
const SHORT_NAME = "Leen";

// ---------- LEVEL SYSTEM ----------
const LEVELS = [
  {level:1,title:"Aspiring Pre-Med",min:0},
  {level:2,title:"Content Reviewer",min:50},
  {level:3,title:"Amino Acid Apprentice",min:150},
  {level:4,title:"Krebs Cycle Cadet",min:300},
  {level:5,title:"UWorld Warrior",min:500},
  {level:6,title:"CARS Conqueror",min:750},
  {level:7,title:"FL Test-Taker",min:1050},
  {level:8,title:"Psych/Soc Pro",min:1400},
  {level:9,title:"High-Yield Hero",min:1800},
  {level:10,title:"520+ Challenger",min:2250},
  {level:11,title:"Med School Bound",min:2800},
  {level:12,title:"Future Doctor",min:3500},
  {level:13,title:"Dr. Leen, MD (inshaAllah)",min:5000}
];

function getLevel(xp){
  let cur = LEVELS[0], next = LEVELS[1];
  for(let i=0;i<LEVELS.length;i++){
    if(xp >= LEVELS[i].min){cur=LEVELS[i]; next=LEVELS[i+1]||LEVELS[i];}
  }
  const prog = (xp - cur.min) / Math.max(1, next.min - cur.min);
  return {cur, next, prog: Math.min(1,prog), xp};
}

function awardXP(amount, reason){
  if(!amount) return;
  const stats = loadStats();
  const prevLvl = getLevel(stats.xp).cur.level;
  stats.xp = (stats.xp||0) + amount;
  stats.totalXP = (stats.totalXP||0) + amount;
  stats.level = getLevel(stats.xp).cur.level;
  saveStats(stats);
  if(stats.level > prevLvl){
    const lvl = getLevel(stats.xp);
    showToast(`🎉 Level up! You're now: ${lvl.cur.title}`, '— ' + SHORT_NAME);
    setTimeout(()=>showLevelUp(lvl), 400);
    launchConfetti();
  } else if(reason){
    showToast(`+${amount} XP — ${reason}`, 'Keep going, ' + SHORT_NAME + '!');
  }
  checkAchievements();
  return stats;
}

function showLevelUp(lvl){
  const modal = document.createElement('div');
  modal.className = 'levelup-modal';
  modal.innerHTML = `
    <div class="levelup-card">
      <div class="lu-badge">🎉</div>
      <div class="lu-label">LEVEL UP</div>
      <div class="lu-level">Lv ${lvl.cur.level}</div>
      <div class="lu-title">${lvl.cur.title}</div>
      <div class="lu-note">${lvl.next ? `${lvl.xp - lvl.cur.req}/${lvl.next.req - lvl.cur.req} XP to Lv ${lvl.next.level}` : 'MAX LEVEL — Dr. Leen, MD 🩺'}</div>
      <button class="btn btn-primary lu-continue" style="margin-top:14px;">Continue →</button>
    </div>
  `;
  document.body.appendChild(modal);
  requestAnimationFrame(()=>modal.classList.add('show'));
  launchConfetti();
  modal.querySelector('.lu-continue').onclick = () => {
    modal.classList.remove('show');
    setTimeout(()=>modal.remove(),500);
    if(state.view === 'dashboard') renderDashboard();
  };
}

// ---------- STATS ----------
function loadStats(){
  return JSON.parse(localStorage.getItem('mcat-stats') || JSON.stringify({
    xp:0, totalXPEarned:0,
    pomodorosCompleted:0, totalFocusMinutes:0,
    quizzesTaken:0, quizQuestionsAnswered:0, quizCorrect:0,
    tasksCompleted:0, firstVisit:Date.now(),
    uwEntries: [], // {date, subject, percent}
    achievements: {},
  }));
}
function saveStats(s){localStorage.setItem('mcat-stats', JSON.stringify(s));}

// ---------- ACHIEVEMENTS ----------
const ACHIEVEMENTS = [
  {id:'first-steps',title:'First Steps',desc:'Complete your first task',icon:'👣',check:s=>s.tasksCompleted>=1,xp:20},
  {id:'streak-3',title:'On Fire',desc:'3 day study streak',icon:'🔥',check:s=>getStreak()>=3,xp:50},
  {id:'streak-7',title:'Week Warrior',desc:'7 day study streak',icon:'⚔️',check:s=>getStreak()>=7,xp:100},
  {id:'streak-30',title:'Iron Discipline',desc:'30 day study streak',icon:'🗿',check:s=>getStreak()>=30,xp:300},
  {id:'pom-1',title:'First Focus',desc:'Complete a 25-min pomodoro',icon:'🍅',check:s=>s.pomodorosCompleted>=1,xp:20},
  {id:'pom-10',title:'Deep Work',desc:'Complete 10 pomodoro sessions',icon:'🧠',check:s=>s.pomodorosCompleted>=10,xp:75},
  {id:'pom-50',title:'Study Machine',desc:'Complete 50 pomodoros',icon:'⚡',check:s=>s.pomodorosCompleted>=50,xp:200},
  {id:'quiz-first',title:'Quiz Taker',desc:'Answer your first quiz question',icon:'❓',check:s=>s.quizQuestionsAnswered>=1,xp:20},
  {id:'quiz-50',title:'Well-Read',desc:'Answer 50 quiz questions',icon:'📚',check:s=>s.quizQuestionsAnswered>=50,xp:100},
  {id:'quiz-100',title:'High-Yield Hero',desc:'Answer 100 quiz questions',icon:'🎯',check:s=>s.quizQuestionsAnswered>=100,xp:200},
  {id:'quiz-80pct',title:'Sharp Mind',desc:'Score ≥ 80% on any quiz round',icon:'💎',check:s=>s.quizQuestionsAnswered>=10 && (s.quizCorrect/Math.max(1,s.quizQuestionsAnswered))>=0.8,xp:150},
  {id:'aa-quiz-100',title:'Amino Acid Master',desc:'Get 100% on a structure quiz',icon:'🧬',check:s=>s.structureQuizPerfect,xp:150},
  {id:'first-fl',title:'Baseline Set',desc:'Log your first full-length exam score',icon:'📊',check:s=>s.flLogged,xp:75},
  {id:'all-mnemonics',title:'Mnemonic Browser',desc:'View all mnemonic categories',icon:'💡',check:s=>s.mnemonicsViewed,xp:50},
  {id:'dedication-viewed',title:'Sincere Intentions',desc:'Read the dedication',icon:'🤍',check:s=>s.dedicationRead,xp:50},
];

let _checkingAch = false;
function checkAchievements(){
  if(_checkingAch) return;
  _checkingAch = true;
  const s = loadStats();
  let newly = [];
  ACHIEVEMENTS.forEach(a=>{
    if(!s.achievements[a.id] && a.check(s)){
      s.achievements[a.id] = Date.now();
      s.xp = (s.xp||0) + a.xp;
      s.totalXP = (s.totalXP||0) + a.xp;
      const level = getLevel(s.xp);
      if(level.num !== s.level){
        s.level = level.num;
        setTimeout(()=>showLevelUp(level), 300);
      }
      newly.push(a);
    }
  });
  saveStats(s);
  _checkingAch = false;
  newly.forEach(a=>{
    setTimeout(()=>{
      showToast(`🏅 Achievement Unlocked: ${a.title}`, a.desc);
    }, 600);
  });
}

// ---------- QUESTION OF THE DAY ----------
function getQOTD(){
  // Pick based on day of year — same question all day
  const today = new Date();
  const doy = Math.floor((today - new Date(today.getFullYear(),0,0))/(1000*60*60*24));
  return QUIZ_QUESTIONS[doy % QUIZ_QUESTIONS.length];
}

// ---------- CONFETTI ----------
function launchConfetti(){
  const colors = ['#a78bfa','#ec4899','#60a5fa','#34d399','#fbbf24','#fb923c','#f87171','#22d3ee'];
  for(let i=0;i<80;i++){
    const el = document.createElement('div');
    const size = Math.random()*10+6;
    const color = colors[Math.floor(Math.random()*colors.length)];
    const left = Math.random()*100;
    const dur = Math.random()*2+2;
    const delay = Math.random()*0.5;
    el.style.cssText = `position:fixed;top:-20px;left:${left}%;width:${size}px;height:${size}px;background:${color};border-radius:${Math.random()>0.5?'50%':'3px'};z-index:9999;pointer-events:none;transform:rotate(${Math.random()*360}deg);animation:confetti-fall ${dur}s ${delay}s cubic-bezier(0.2,0.8,0.4,1) forwards;`;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(), (dur+delay)*1000+100);
  }
}

// Inject confetti keyframes
(function injectConfettiCSS(){
  const style = document.createElement('style');
  style.textContent = `
    @keyframes confetti-fall{
      0%{transform:translateY(-20px) rotate(0deg);opacity:1;}
      100%{transform:translateY(110vh) rotate(720deg);opacity:0.8;}
    }
    @keyframes fadeUp{
      from{opacity:0;transform:translateY(20px) scale(0.95);}
      to{opacity:1;transform:none;}
    }
    .welcome-overlay{position:fixed;inset:0;z-index:500;background:rgba(11,7,32,0.9);backdrop-filter:blur(20px);display:grid;place-items:center;animation:fadeUp 0.5s ease;}
    .welcome-card{text-align:center;max-width:540px;padding:50px 40px;}
    .welcome-title{font-family:'Space Grotesk';font-size:2.8rem;font-weight:700;background:linear-gradient(135deg,var(--purple),var(--pink));-webkit-background-clip:text;background-clip:text;color:transparent;line-height:1.1;margin-bottom:8px;}
    .welcome-sub{color:var(--text-dim);font-size:1.1rem;margin-bottom:24px;}
    .level-banner{
      margin-top:20px; padding:18px; border-radius:var(--radius);
      background:linear-gradient(135deg,rgba(167,139,250,0.15),rgba(236,72,153,0.1));
      border:1px solid var(--border-strong);
      display:flex;align-items:center;gap:16px;margin-bottom:20px;
    }
    .level-num{
      font-family:'Space Grotesk';font-size:2.5rem;font-weight:700;
      background:linear-gradient(135deg,var(--purple),var(--pink));
      -webkit-background-clip:text;background-clip:text;color:transparent;
      line-height:1;
    }
    .xp-bar{height:10px;background:rgba(255,255,255,0.08);border-radius:999px;overflow:hidden;margin-top:6px;}
    .xp-fill{height:100%;background:linear-gradient(90deg,var(--purple),var(--pink));border-radius:999px;transition:width 0.6s ease;}
    .ach-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;margin-top:16px;}
    .ach-tile{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 8px;text-align:center;transition:all 0.2s;}
    .ach-tile:hover{transform:translateY(-2px);border-color:var(--border-strong);}
    .ach-tile.locked{opacity:0.35;filter:grayscale(0.8);}
    .ach-icon{font-size:1.8rem;margin-bottom:4px;}
    .ach-name{font-size:0.72rem;font-weight:700;color:var(--text);margin-bottom:2px;}
    .ach-desc{font-size:0.65rem;color:var(--text-mute);}
    .journey-timeline{position:relative;padding-left:40px;margin-top:10px;}
    .journey-timeline::before{content:"";position:absolute;left:15px;top:0;bottom:0;width:2px;background:linear-gradient(180deg,var(--purple),var(--pink),var(--green));}
    .journey-stop{position:relative;margin-bottom:28px;padding-left:20px;}
    .journey-dot{position:absolute;left:-32px;top:4px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:0.9rem;background:var(--surface);border:2px solid var(--purple);z-index:1;}
    .journey-dot.past{background:linear-gradient(135deg,var(--purple),var(--pink));border-color:transparent;color:white;}
    .journey-dot.future{border-color:var(--border);color:var(--text-mute);}
    .journey-stop.past .journey-title{color:var(--text);}
    .journey-stop.future .journey-title{color:var(--text-mute);}
    .journey-title{font-weight:700;font-size:1rem;margin-bottom:2px;}
    .journey-date{font-size:0.8rem;color:var(--text-mute);}
    .journey-desc{font-size:0.88rem;color:var(--text-dim);margin-top:4px;}
    .dedication-card{
      background:linear-gradient(135deg,rgba(167,139,250,0.1),rgba(236,72,153,0.05));
      border:1px solid var(--border-strong);
      border-radius:var(--radius-lg);padding:36px;
      text-align:center;max-width:640px;margin:0 auto;
    }
    .dedication-card h2{font-size:2rem;}
    .dedication-body{font-size:1.05rem;line-height:1.9;color:var(--text-dim);margin-top:20px;text-align:left;}
    .dedication-body p{margin-bottom:14px;}
    .qotd-card{
      background:linear-gradient(135deg,rgba(52,211,153,0.1),rgba(34,211,238,0.05));
      border:1px solid var(--border-strong);
      border-radius:var(--radius);padding:20px;margin-bottom:20px;
    }
    .qotd-label{font-size:0.75rem;text-transform:uppercase;letter-spacing:0.12em;color:var(--green);font-weight:700;margin-bottom:6px;}
    .stats-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;margin:20px 0;}
    .stat-big-card{padding:18px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);text-align:center;}
    .stat-big-val{font-family:'Space Grotesk';font-size:2rem;font-weight:700;background:linear-gradient(135deg,var(--purple),var(--pink));-webkit-background-clip:text;background-clip:text;color:transparent;line-height:1;}
    .stat-big-label{font-size:0.78rem;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.08em;margin-top:6px;font-weight:600;}
    .uw-entry{display:grid;grid-template-columns:1.5fr 1fr 1fr auto;gap:8px;align-items:end;margin-bottom:8px;}
    .uw-entry select,.uw-entry input{font-size:0.85rem;padding:8px 10px;}
    .signoff{font-style:italic;color:var(--purple);margin-top:30px;font-size:1.1rem;text-align:center;}
    body.light .level-banner{background:rgba(167,139,250,0.1);}
    body.light .ach-tile{background:rgba(255,255,255,0.6);}
    .levelup-modal{position:fixed;inset:0;z-index:600;background:rgba(11,7,32,0.85);backdrop-filter:blur(16px);display:grid;place-items:center;opacity:0;transition:opacity 0.3s;}
    .levelup-modal.show{opacity:1;}
    .levelup-card{text-align:center;padding:50px 46px;max-width:440px;animation:fadeUp 0.6s ease;}
    .lu-badge{font-size:4rem;margin-bottom:6px;animation:pop 0.6s cubic-bezier(.34,1.56,.64,1);}
    @keyframes pop{0%{transform:scale(0);}60%{transform:scale(1.2);}100%{transform:scale(1);}}
    .lu-label{font-size:0.75rem;letter-spacing:0.3em;color:var(--pink);font-weight:700;}
    .lu-level{font-family:'Space Grotesk';font-size:4.5rem;font-weight:700;background:linear-gradient(135deg,var(--purple),var(--pink));-webkit-background-clip:text;background-clip:text;color:transparent;line-height:1;}
    .lu-title{font-size:1.3rem;font-weight:700;margin:6px 0 10px;}
    .lu-note{color:var(--text-mute);font-size:0.9rem;}
  `;
  document.head.appendChild(style);
})();

// ---------- JOURNEY STOPS ----------
const JOURNEY_STOPS = [
  {date:"Today",emoji:"📍",title:"You are here",desc:'Starting your MCAT journey, '+SHORT_NAME+'. May Allah make every step easy.'},
  {date:"Sep 3, 2027",emoji:"📝",title:"Test Day inshaAllah",desc:"You walk into that exam center confident, prepared, and grounded in du\'a.'"},
  {date:"~Oct 2027",emoji:"🎉",title:"Score Release",desc:"The score you worked so hard for appears — the one that opens the next door, inshaAllah."},
  {date:"2027–2028",emoji:"📨",title:"Applications & Interviews",desc:"Secondaries, interviews, and the tawakkul of choosing where to train."},
  {date:"2028 inshaAllah",emoji:"🥼",title:"Medical School Begins",desc:"First day of white coat — the dream becoming reality."},
  {date:"One day inshaAllah",emoji:"🩺",title:"Dr. "+SHORT_NAME,desc:'Treating patients with knowledge, compassion, and ihsan. May Allah make you among those who heal.'},
];

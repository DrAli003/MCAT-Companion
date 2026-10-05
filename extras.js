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
  {id:'dedication-viewed',title:'The Note',desc:'Read the dedication letter',icon:'✉️',check:s=>s.dedicationRead,xp:50},
  {id:'testday-unlocked',title:'Test Day',desc:'Open the sealed letter on test day',icon:'🔓',check:s=>s.testDayOpened,xp:200},
  {id:'wrong-logged',title:'Error Logger',desc:'Save your first wrong answer',icon:'📓',check:s=>(loadWrongAnswers().length)>=1,xp:25},
  {id:'wrong-25',title:'Mistake Master',desc:'Log 25 wrong answers',icon:'📖',check:s=>loadWrongAnswers().length>=25,xp:100},
  {id:'self-letter',title:'Letter to Self',desc:'Write a note to your future self',icon:'✍️',check:s=>loadSelfLetter().written,xp:40},
  {id:'tasbih-100',title:'Remembrance',desc:'Complete a round of dhikr',icon:'📿',check:s=>s.tasbihCompleted,xp:30},
  {id:'wins-7',title:'Daily Wins',desc:'Log a win 7 days in a row',icon:'💫',check:s=>{
    const wins=loadWins();
    let streak=0; const d=new Date();
    for(let i=0;i<30;i++){
      const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
      if(wins[k])streak++; else break;
      d.setDate(d.getDate()-1);
    }
    return streak>=7;
  },xp:80},
  {id:'checklist-complete',title:'Game Day Ready',desc:'Check off every test-day item',icon:'✅',check:s=>{
    const done=loadChecklist(); let total=0,checked=0;
    CHECKLIST_SECTIONS.forEach(sec=>sec.items.forEach(it=>{total++; if(done[it])checked++;}));
    return total>0 && checked===total;
  },xp:100},
  {id:'breathe',title:'Breathe',desc:'Complete a box-breathing session',icon:'🌬️',check:s=>s.breathed,xp:20},
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
function getJourneyStops(){
  const td = getTestDate();
  const testStr = td.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  // Score release ~30 days after test day
  const score = new Date(td); score.setDate(score.getDate()+32);
  const scoreStr = score.toLocaleDateString('en-US',{year:'numeric',month:'long'});
  // Next cycle apps (June after test year) / med school starts August after that
  const appYr = td.getFullYear() + '-' + (td.getFullYear()+1);
  const medYr = '2028–2029 inshaAllah';
  return [
    {date:'2026–2027',emoji:'📍',title:'Third Year (Now)',desc:'Content review, practice, Anki grind, and building the discipline that carries you through. '+SHORT_NAME+' vs. the MCAT — round one.'},
    {date:testStr,emoji:'📝',title:'Test Day inshaAllah',desc:'You walk into that exam center calm, prepared, and grounded in du\u2018a. Execute, one passage at a time.'},
    {date:'~'+scoreStr,emoji:'🎉',title:'Score Release',desc:'The score you earned — the one that opens the next door, inshaAllah.'},
    {date:appYr,emoji:'📨',title:'Senior Year: Applications & Interviews',desc:'Secondaries, interviews, and tawakkul — choosing where you will train. The year of putting yourself out there.'},
    {date:medYr,emoji:'🥼',title:'Medical School Begins',desc:'First day in the white coat — the dream becoming reality. May Allah make the journey easy.'},
    {date:'One day inshaAllah',emoji:'🩺',title:'Dr. '+SHORT_NAME,desc:'Treating patients with knowledge, compassion, and ihsan. May Allah make you among those who heal.'},
  ];
}

// ---------- TEST DATE ----------
const DEFAULT_TEST_DATE = '2027-09-03';
function getTestDate(){
  const raw = localStorage.getItem('mcat-test-date') || DEFAULT_TEST_DATE;
  const d = new Date(raw+'T08:00:00');
  if(isNaN(d.getTime())) return new Date(DEFAULT_TEST_DATE+'T08:00:00');
  return d;
}
function setTestDate(iso){
  localStorage.setItem('mcat-test-date', iso);
}
function daysUntilTest(){
  const now = new Date();
  now.setHours(0,0,0,0);
  const td = getTestDate(); td.setHours(0,0,0,0);
  return Math.round((td-now)/(1000*60*60*24));
}

// ---------- SEALED TEST-DAY LETTER ----------
const TESTDAY_ARABIC = 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي';
const TESTDAY_MESSAGE = `You've done your part and put in the real work. Today isn't about knowing everything, it's just about executing what you've practiced one passage at a time. may Allah grant you total calm, sharp recall, and ease through every section. Remember that this test doesn't define your capability; it's just a hurdle you're more than ready to clear. Take a deep breath, tackle it question by question, don't underestimate yourself, and finish strong. Go crush it.`;
// Tamper-resistance: hash-based seal; opening before test day does not unlock
const SEAL_SALT = 'bismillah-'+USER_NAME+'-mcat';
function sealCode(dateISO){
  // Simple deterministic checksum (not crypto, just prevents casual fiddling)
  let h=0; const s=SEAL_SALT+dateISO;
  for(let i=0;i<s.length;i++) h = ((h<<5)-h+s.charCodeAt(i))|0;
  return 'sealed-'+(h>>>0).toString(36);
}
function isLetterUnlocked(){
  const du = daysUntilTest();
  if(du <= 0) return true;
  return localStorage.getItem('mcat-letter-opened') === sealCode(getTestDate().toISOString().slice(0,10));
}
function unlockLetter(){
  localStorage.setItem('mcat-letter-opened', sealCode(getTestDate().toISOString().slice(0,10)));
  const s=loadStats(); s.testDayOpened=true; saveStats(s); checkAchievements();
}


/* ============================================================
   NEW FEATURES LAYER (v5)
   ============================================================ */

// ---------- WRONG ANSWER NOTEBOOK ----------
function loadWrongAnswers(){
  return JSON.parse(localStorage.getItem('mcat-wrong')||'[]');
}
function saveWrongAnswer(entry){
  // entry: {q, correctA, userA, cat, explain, date}
  const arr = loadWrongAnswers();
  arr.unshift({...entry, id:Date.now(), reviewed:false});
  localStorage.setItem('mcat-wrong',JSON.stringify(arr));
}
function markWrongReviewed(id, reviewed){
  const arr = loadWrongAnswers();
  const idx = arr.findIndex(x=>x.id===id);
  if(idx>=0){arr[idx].reviewed=reviewed; localStorage.setItem('mcat-wrong',JSON.stringify(arr));}
}
function deleteWrong(id){
  const arr = loadWrongAnswers().filter(x=>x.id!==id);
  localStorage.setItem('mcat-wrong',JSON.stringify(arr));
}

// ---------- FUTURE-SELF LETTER ----------
function loadSelfLetter(){
  return JSON.parse(localStorage.getItem('mcat-self-letter')||'{"written":false,"text":"","date":null}');
}
function saveSelfLetter(text){
  localStorage.setItem('mcat-self-letter', JSON.stringify({written:true,text,date:new Date().toISOString().slice(0,10)}));
}
function isSelfLetterUnlocked(){ return daysUntilTest()<=0 || isLetterUnlocked(); }

// ---------- DAILY WINS ----------
function todayKey(){
  const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function loadWins(){
  return JSON.parse(localStorage.getItem('mcat-wins')||'{}');
}
function getTodayWin(){ return loadWins()[todayKey()]||''; }
function saveTodayWin(text){
  const w=loadWins();
  if(text.trim()) w[todayKey()]=text.trim(); else delete w[todayKey()];
  localStorage.setItem('mcat-wins',JSON.stringify(w));
}

// ---------- TASBIH ----------
function loadTasbih(){
  return JSON.parse(localStorage.getItem('mcat-tasbih')||'{\"count\":0,\"total\":0,\"target\":33,\"current\":\"subhanAllah\"}');
}
function saveTasbih(t){ localStorage.setItem('mcat-tasbih',JSON.stringify(t)); }
const TASBIH_PRESETS = [
  {id:'subhanAllah', ar:'سُبْحَانَ ٱللَّٰه',  en:'SubhanAllah',              target:33, meaning:'Glory be to Allah'},
  {id:'alhamdulillah',ar:'ٱلْحَمْدُ لِلَّٰه', en:'Alhamdulillah',            target:33, meaning:'All praise is due to Allah'},
  {id:'allahuAkbar',  ar:'ٱللَّٰهُ أَكْبَر',   en:'Allahu Akbar',             target:34, meaning:'Allah is the Greatest'},
  {id:'astaghfirullah',ar:'أَسْتَغْفِرُ ٱللَّٰه',en:'Astaghfirullah',         target:100,meaning:'I seek forgiveness from Allah'},
  {id:'laIlaha',      ar:'لَا إِلَٰهَ إِلَّا ٱللَّٰه',en:'La ilaha illa Allah',target:100,meaning:'There is no god but Allah'},
  {id:'salawat',      ar:'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ',en:'Salawat (Allahumma salli \'ala Muhammad)',target:100,meaning:'O Allah, send blessings upon Muhammad ﷺ'},
  {id:'custom',       ar:'',                     en:'Custom dhikr',             target:33, meaning:'Enter your own'},
];

// ---------- TEST-DAY CHECKLIST ----------
const CHECKLIST_SECTIONS = [
  {title:'The Night Before', items:[
    'Print MCAT admission confirmation',
    'Set TWO alarms (one across the room)',
    'Pack 2 forms of valid ID (government photo + student)',
    'Pack snacks (nuts, fruit, chocolate — nothing messy)',
    'Pack water bottle (clear, label-free)',
    'Pack lunch (familiar foods — no surprises)',
    'Layers (testing center AC is unpredictable)',
    'Earplugs (soft foam — check center policy)',
    'Tissues, pain reliever, inhaler if needed',
    'Phone fully charged (silenced, left in locker)',
    'Do NOT study new material — light review only',
    'Sleep 7–8 hours, no screens 1 hour before bed',
    'Make du\'a in sujood before sleeping',
  ]},
  {title:'The Morning Of', items:[
    'Wake up early — no rushing',
    'Make wudu and pray Fajr with presence',
    'Eat a normal breakfast (oats/eggs/bread — same as practice days)',
    'Recite رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    'Drink water, coffee if you normally do',
    'Leave early — arrive 30+ minutes before check-in',
    'Avoid stressful conversations before entering',
    'Two rak\'ah salah al-hajah if time permits',
  ]},
  {title:'During the Exam', items:[
    'Bismillah before clicking "start"',
    'Breathe — 4 in, 4 hold, 4 out between sections',
    'Read every question carefully, flag hard ones and move on',
    'Eat/drink during every break (you earned it)',
    'Make du\'a in your heart during breaks',
    'Don\'t discuss questions with other test-takers',
    'One passage at a time — stay present',
    'Wudhu refresh on long breaks if possible',
  ]},
];
function loadChecklist(){
  return JSON.parse(localStorage.getItem('mcat-checklist')||'{}');
}
function saveChecklist(c){ localStorage.setItem('mcat-checklist',JSON.stringify(c)); }

// ---------- BREATHING EXERCISE ----------
// The 4-4-4-4 box breathing pattern; uses setInterval in app.js

// ---------- ACCENT/THEME COLOR ----------
const ACCENTS = [
  {id:'purple', name:'Purple',   grad:'linear-gradient(135deg,#a78bfa,#ec4899)', c1:'#a78bfa', c2:'#ec4899'},
  {id:'green',  name:'Emerald',  grad:'linear-gradient(135deg,#34d399,#22d3ee)', c1:'#34d399', c2:'#22d3ee'},
  {id:'blue',   name:'Ocean',    grad:'linear-gradient(135deg,#60a5fa,#818cf8)', c1:'#60a5fa', c2:'#818cf8'},
  {id:'gold',   name:'Desert',   grad:'linear-gradient(135deg,#fbbf24,#fb923c)', c1:'#fbbf24', c2:'#fb923c'},
  {id:'rose',   name:'Rose',     grad:'linear-gradient(135deg,#f472b6,#f87171)', c1:'#f472b6', c2:'#f87171'},
  {id:'neutral',name:'Classic',  grad:'linear-gradient(135deg,#a78bfa,#ec4899)', c1:'#a78bfa', c2:'#ec4899'},
];
function getAccent(){
  const id = localStorage.getItem('mcat-accent')||'purple';
  return ACCENTS.find(a=>a.id===id)||ACCENTS[0];
}
function setAccent(id){
  localStorage.setItem('mcat-accent', id);
  const a = getAccent();
  document.documentElement.style.setProperty('--purple', a.c1);
  document.documentElement.style.setProperty('--pink', a.c2);
}

// ---------- POMODORO HEATMAP DATA ----------
function getPomoHistory(){
  return JSON.parse(localStorage.getItem('mcat-pomo-history')||'{}');
}
function recordPomoDay(minutes){
  const h = getPomoHistory();
  const k = todayKey();
  h[k] = (h[k]||0) + minutes;
  localStorage.setItem('mcat-pomo-history', JSON.stringify(h));
}

// ---------- FL SCORE PROJECTOR ----------
function projectScore(){
  const s = loadStats();
  const scores = (s.flScores||[]).filter(x=>x.score).sort((a,b)=>new Date(a.date)-new Date(b.date));
  if(scores.length<2) return null;
  // Simple linear regression over index vs score
  const n=scores.length;
  let sx=0,sy=0,sxy=0,sxx=0;
  scores.forEach((sc,i)=>{sx+=i;sy+=sc.score;sxy+=i*sc.score;sxx+=i*i;});
  const slope=(n*sxy-sx*sy)/(n*sxx-sx*sx);
  const intercept=(sy-slope*sx)/n;
  const last = scores[scores.length-1].score;
  const projected = Math.min(528, Math.max(472, Math.round(last + slope*2))); // project 2 FLs ahead
  const delta = projected - last;
  return {last, projected, delta, trend:slope>0.5?'up':slope<-0.5?'down':'plateau', n};
}

// ---------- PRAYER TIMES (Beirut, approximate) ----------
// Beirut prayer times — astronomical formula calibrated to Dar al-Fatwa anchor (Oct 5 2026).
// Approximate awareness tool; verify with a proper prayer app for legal precision.
// Beirut: lat 33.89°N, lon 35.50°E. DST (EEST UTC+3): last Sun March 00:00 → last Sun Oct 00:00 → EET UTC+2.
function getPrayerTimes(){
  const now = new Date();
  const lat=33.8938, lng=35.5018;
  function isDST(d){
    const y=d.getFullYear();
    function lastSun(m){const x=new Date(y,m+1,0); x.setDate(x.getDate()-x.getDay()); x.setHours(0,0,0,0); return x;}
    return d>=lastSun(2) && d<lastSun(9);
  }
  const dst=isDST(now), tz=dst?3:2;
  const start=new Date(now.getFullYear(),0,0);
  const jd=Math.floor((now-start)/86400000);
  const B=(360/365*(jd-81))*Math.PI/180;
  const EoT=9.87*Math.sin(2*B)-7.53*Math.cos(B)-1.5*Math.sin(B); // minutes
  const decl=23.45*Math.sin((360/365*(284+jd))*Math.PI/180);
  const dhuhrMin=720+4*(15*tz-lng)-EoT;
  const toR=d=>d*Math.PI/180, toD=r=>r*180/Math.PI;
  function sinD(d){return Math.sin(toR(d));}
  function cosD(d){return Math.cos(toR(d));}
  function tanD(d){return Math.tan(toR(d));}
  function acosD(x){return toD(Math.acos(Math.max(-1,Math.min(1,x))));}
  function atan2D(y,x){return toD(Math.atan2(y,x));}
  function timeForAlt(alt,rise){
    const cosHA=(sinD(alt)-sinD(lat)*sinD(decl))/(cosD(lat)*cosD(decl));
    const HA=acosD(cosHA)/15;
    return rise? dhuhrMin-HA*60 : dhuhrMin+HA*60;
  }
  const sunrise=timeForAlt(-0.833,true);
  const maghrib=timeForAlt(-0.833,false);
  const asrAlt=atan2D(1,1+Math.tan(toR(Math.abs(lat-decl))));
  const asr=timeForAlt(asrAlt,false);
  const fajr=timeForAlt(-18.0,true);
  const isha=timeForAlt(-16.3,false);
  function toHM(mins,cal=0){
    let t=mins+cal; t=((t%1440)+1440)%1440;
    let h=Math.floor(t/60)%24, m=Math.round(t%60);
    if(m===60){h=(h+1)%24;m=0;}
    return {h,m};
  }
  const cal={fajr:-11, sunrise:-3, dhuhr:0, asr:3, maghrib:9, isha:10};
  const F=toHM(fajr,cal.fajr), Su=toHM(sunrise,cal.sunrise), D=toHM(dhuhrMin,cal.dhuhr),
        A=toHM(asr,cal.asr), M=toHM(maghrib,cal.maghrib), I=toHM(isha,cal.isha);
  return [
    {name:'Fajr',    h:F.h, m:F.m, ar:'الفجر'},
    {name:'Sunrise',h:Su.h,m:Su.m,ar:'الشروق',isSunrise:true},
    {name:'Dhuhr',   h:D.h, m:D.m, ar:'الظهر'},
    {name:'Asr',     h:A.h, m:A.m, ar:'العصر'},
    {name:'Maghrib', h:M.h, m:M.m, ar:'المغرب'},
    {name:'Isha',    h:I.h, m:I.m, ar:'العشاء'},
  ];
}
function nextPrayer(){
  const prayers = getPrayerTimes().filter(p=>!p.isSunrise);
  const now = new Date();
  const nowMin = now.getHours()*60+now.getMinutes();
  for(const p of prayers){
    const pm = p.h*60+p.m;
    if(pm>nowMin) return {p, minsLeft:pm-nowMin};
  }
  return {p:{...prayers[0],name:'Fajr (tomorrow)'}, minsLeft:(24*60-nowMin)+prayers[0].h*60+prayers[0].m};
}

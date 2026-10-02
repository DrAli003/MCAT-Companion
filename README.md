# MCAT Companion 🧬

A vibrant, all-in-one MCAT study dashboard built for future doctors. Test date: **September 3, 2027 inshaAllah**.

## Features

- **📊 Dashboard** — Live countdown to test day, daily motivational quote (changes once per day, includes Qur'an/hadith and medicine quotes), current study phase indicator (auto-switches Content → UWorld → AAMC as the date approaches), and study streak counter.
- **✅ Daily Tasks & Streak** — Checklist system per day; check off tasks and build a streak (saved locally in browser). Last 7 days visible at a glance.
- **📅 Customizable Study Schedule** — Auto-generates a 3-phase plan (Content Review → UWorld Practice → AAMC Refinement) based on start date, available hours, baseline, and target score. Editable week-by-week; saves to localStorage.
- **🧬 Amino Acid Explorer** — All 20 amino acids grouped by category, color-coded, with clickable detail cards showing chemical structures (drawn as zwitterions at pH 7.4, with stereochemistry wedges), pKa, pI, charge, and high-yield connections. Includes:
  - **Name Hide Mode** — toggle to cover names for flashcard-style review
  - **🔬 Structure Identification Quiz** — 10 questions/round showing structures with 4 multiple-choice answers; explains key facts about each.
- **🔄 Metabolic Pathways Visualizer** — Interactive flowcharts for Glycolysis, Krebs Cycle, ETC/Oxidative Phosphorylation, and Hormonal Regulation (insulin/glucagon/cortisol), with rate-limiting enzymes highlighted and energy yields noted.
- **💡 Mnemonic Library** — 38 curated high-yield mnemonics across Biochem, Biology, Chem/Phys, Psych/Soc, and Research Design — searchable and filterable.
- **🔬 Lab Techniques Reference** — 16 techniques (PCR, blotting, gel electrophoresis, ELISA, chromatography, CRISPR, microscopy, flow cytometry, vaccines, spectroscopy, etc.) with how-it-works steps, key reagents, and high-yield connections.
- **📐 Formula Quick-Ref** — 44 Physics & Gen Chem formulas, searchable by topic.
- **🧮 Physics/Chem Calculators** — Lens/mirror (gives real/virtual, upright/inverted, magnification, diopters), Hardy-Weinberg, Henderson-Hasselbalch buffer pH, Amino acid pI estimator, Beer-Lambert concentration, Kinematics (no-time equation and others).
- **⚡ Quiz Bowl** — 30 high-yield questions across all sections with immediate feedback, detailed explanations, category tracking that identifies weak areas, and completion fanfare sound.
- **📝 CARS Trainer** — Timed 10-minute-pace passages with 2 sample passages + 8 evidence-based strategy tips.
- **🧠 Psych/Soc Quick Reference** — 26 high-yield terms/theorists/biases.
- **📊 FL Score Tracker** — Log practice exam scores (Blueprint/Altius/AAMC/etc.) with an SVG progress chart, target score line, color-coded by company, and editable exam list. AAMC scores show in green (most accurate predictor).
- **🤍 Du'as Page** — Arabic + transliteration + meaning of key supplications for seeking knowledge and exams (Rabbi zidni 'ilma, Rabbish rah li sadri, etc.), plus practical tips for barakah in studies.
- **⏱️ Floating Pomodoro Timer** — 25/5/15 minute sessions with animated circular progress.
- **🌙/☀️ Theme Toggle** — Switch between dark (default, purple/pink gradient) and light themes.
- **🔊 Sound Effects** (toggleable) — Soft chimes for correct answers, wrong answers, and quiz completion.

## How to Host on GitHub Pages

1. Create a new GitHub repository (e.g., `mcat-companion`).
2. Upload the 6 files to the repo:
   - `index.html`
   - `styles.css`
   - `data.js`
   - `data2.js`
   - `structures.js`
   - `app.js`
3. Go to repository **Settings → Pages**.
4. Under "Source", select **Deploy from a branch**, choose `main` branch and `/ (root)` folder, then Save.
5. Wait ~1 minute — your site will be live at `https://<your-username>.github.io/mcat-companion/`

Then share that link with her, and she can open it on phone, laptop, or tablet any time inshaAllah. 🌙

It works fully offline after first load — no external dependencies beyond Google Fonts. All her data (tasks, scores, schedule edits, theme, sound preference) saves in her browser's localStorage.

## Customization

- **Test date:** edit `state.testDate` near the top of `app.js`.
- **Add more quiz questions:** add entries to the `QUIZ_QUESTIONS` array in `data.js`.
- **Add more mnemonics:** add to the `MNEMONICS` array in `data.js`.
- **Add CARS passages:** add to `CARS_PASSAGES` in `data.js`.
- **Add lab techniques:** add to `LAB_TECHNIQUES` in `data2.js`.
- **Add quotes:** add to the `QUOTES` array in `data.js`.
- **Add duas:** add to the `DUAS` array in `data2.js`.

## Built With

- Pure HTML, CSS, and vanilla JavaScript — no build tools, no dependencies.
- Fonts from Google Fonts (Plus Jakarta Sans + Space Grotesk + Amiri for Arabic).
- Sounds generated via Web Audio API (no audio files).
- Content compiled from AAMC guidance, r/MCAT 515+ consensus, Jack Westin, Khan Academy, UWorld strategies, Kaplan/TPR high-yield lists, and SDN.

May Allah make it a means of success and barakah in her journey to medical school. 🤍

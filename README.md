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
- **🎨 Three visual styles** — Choose Basic, Floral, or Neuro from the in-app Style menu; the choice is saved locally and included in manual sync. Each style keeps the six-color accent switcher and the light/dark toggle.
- **🌙/☀️ Light/Dark Toggle** — Switch the active style between light and dark modes.
- **🔊 Sound Effects** (toggleable) — Soft chimes for correct answers, wrong answers, and quiz completion.
- **📱 Offline/PWA support** — A service worker precaches the app, theme artwork, floral fonts, and install icons. Keep the project’s folder structure when deploying.

## How to Host on GitHub Pages

1. Download and unzip this complete project.
2. Upload **all files and folders** to the repository root. Keep `assets/` and `assets/fonts/` intact; do not upload only the HTML/JS files.
3. In repository **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
4. The production URL is `https://drali003.github.io/MCAT-Companion/` (or your repository’s corresponding Pages URL).
5. After Pages finishes publishing, open the new URL and refresh once if an old service-worker cache is still active.

The site is static and GitHub Pages-ready: all app assets use relative paths, and the service worker caches the three styles, app files, icons, floral fonts, and physician artwork for offline use after the first successful visit. Study progress, the selected style, six-color accent, light/dark preference, and sound preference remain in browser storage; manual sync/backup is available in Tools.

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
- Plus Jakarta Sans, Space Grotesk, and Amiri use Google Fonts; Floral also includes local Nunito, Playfair Display, Dancing Script, and Arabic font files so that skin works offline.
- Sounds generated via Web Audio API (no audio files).
- Content compiled from AAMC guidance, r/MCAT 515+ consensus, Jack Westin, Khan Academy, UWorld strategies, Kaplan/TPR high-yield lists, and SDN.

May Allah make it a means of success and barakah in her journey to medical school. 🤍

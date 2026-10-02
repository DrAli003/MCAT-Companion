# MCAT Companion 🧬

A vibrant, all-in-one MCAT study dashboard built for future doctors. Test date: **September 3, 2027 inshaAllah**.

## Features

- **📊 Dashboard** — Live countdown to test day, rotating motivational quotes (including Qur'an/hadith), daily phase indicator
- **📅 Customizable Study Schedule** — Auto-generates a 3-phase plan (Content Review → UWorld Practice → AAMC Refinement) based on start date, available hours, baseline, and target score. Editable week-by-week. Saves to browser localStorage.
- **🧬 Amino Acid Explorer** — All 20 amino acids grouped by category, color-coded, with clickable detail cards showing structures, pKa, pI, charge, and high-yield connections. Includes quiz mode (hide names, test yourself).
- **🔄 Metabolic Pathways Visualizer** — Interactive flowcharts for Glycolysis, Krebs Cycle, ETC/Oxidative Phosphorylation, and Hormonal Regulation (insulin/glucagon/cortisol), with rate-limiting enzymes highlighted.
- **💡 Mnemonic Library** — 38 curated high-yield mnemonics across Biochem, Biology, Chem/Phys, Psych/Soc, and Research Design — searchable and filterable by category.
- **📐 Formula Quick-Ref** — 44 Physics & Gen Chem formulas, searchable by topic.
- **⚡ Quiz Bowl** — 30 high-yield questions with immediate feedback & detailed explanations; reshuffles every round.
- **📝 CARS Trainer** — Timed 10-minute passage practice with sample passages + 8 evidence-based strategy tips.
- **🧠 Psych/Soc Quick Reference** — 26 high-yield terms/theorists/biases.
- **⏱️ Floating Pomodoro Timer** — 25/5/15 minute sessions with animated circular progress.

## How to Host on GitHub Pages

1. Create a new GitHub repository (e.g., `mcat-companion`).
2. Upload these 4 files to the repo:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `data.js`
3. Go to repository **Settings → Pages**.
4. Under "Source", select **Deploy from a branch**, choose `main` branch and `/ (root)` folder, then Save.
5. Wait ~1 minute — your site will be live at `https://<your-username>.github.io/mcat-companion/`

You can then share that link with her, and she can open it on her phone, laptop, or tablet anytime inshaAllah. 🌙

## How to Customize (advanced)

- **Change test date**: edit `state.testDate` at the top of `app.js`.
- **Add more quiz questions**: add entries to the `QUIZ_QUESTIONS` array in `data.js`.
- **Add more mnemonics**: add to the `MNEMONICS` array in `data.js`.
- **Add more CARS passages**: add to `CARS_PASSAGES` in `data.js`.
- **Add encouragement quotes**: add to the `QUOTES` array in `data.js`.

## Built With

- Pure HTML, CSS, and vanilla JavaScript — no build tools, no dependencies.
- Fonts from Google Fonts (Plus Jakarta Sans + Space Grotesk).
- Content compiled from AAMC guidance, r/MCAT 515+ consensus, Jack Westin, Khan Academy, UWorld strategies, and Kaplan/TPR high-yield lists.

May Allah make it a means of success and barakah in her journey to medical school. 🤍

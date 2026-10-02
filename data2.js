/* ============================================================
   MCAT COMPANION — DATA MODULE (PART 2)
   Lab techniques, duas, physics calculators data
   ============================================================ */

// ---------- LAB TECHNIQUES ----------
const LAB_TECHNIQUES = [
  {
    cat:"Molecular Biology",
    title:"PCR (Polymerase Chain Reaction)",
    what:"Amplifies a specific DNA sequence exponentially (billions of copies in hours).",
    steps:"Denaturation (95°C → separates strands) → Annealing (~55°C → primers bind) → Elongation (72°C → Taq polymerase synthesizes). Repeats ~30 cycles.",
    reagents:"Template DNA, forward & reverse primers, Taq polymerase (thermostable, from Thermus aquaticus), dNTPs, Mg²⁺ buffer.",
    keypoints:"Use Taq (heat-stable; human DNA pol would denature). Reverse transcriptase PCR (RT-PCR) starts from mRNA → cDNA → measures gene expression. qPCR (real-time) quantifies product as it's made using fluorescence (SYBR green or TaqMan probes); can measure relative expression."
  },
  {
    cat:"Molecular Biology",
    title:"Gel Electrophoresis",
    what:"Separates molecules (DNA, RNA, protein) by size and charge.",
    steps:"Load sample into agarose (nucleic acids) or polyacrylamide (proteins) gel. Apply electric field. Nucleic acids (negative at pH 8) run toward anode (positive). Smaller molecules travel farther through pores.",
    reagents:"Ethidium bromide (DNA intercalator, fluoresces under UV) or SYBR Safe for visualization; loading dye; size ladder.",
    keypoints:"DNA → agarose; proteins → SDS-PAGE. SDS denatures proteins & coats them negative → separation by SIZE alone. Native PAGE preserves shape/charge. Southern = DNA, Northern = RNA, Western = Protein (SNOW DROP)."
  },
  {
    cat:"Molecular Biology",
    title:"Blotting Summary (SNOW DROP)",
    what:"Techniques to detect specific molecules after gel electrophoresis.",
    steps:"Separate by gel → transfer (blot) to membrane → block → probe → detect.",
    reagents:"<b>Southern (DNA):</b> uses labeled complementary DNA probe; detects specific DNA sequences (RFLPs, gene mutations).<br><b>Northern (RNA):</b> uses labeled DNA probe; measures mRNA levels (gene expression).<br><b>Western (Protein):</b> uses primary ANTIBODY + enzyme/fluorescent-labeled secondary antibody.",
    keypoints:"Southwestern = DNA-binding proteins. Western uses antibodies; S/N use nucleic acid probes. Loading controls: β-actin or GAPDH for Western; GAPDH mRNA for Northern."
  },
  {
    cat:"Molecular Biology",
    title:"DNA Sequencing (Sanger)",
    what:"Determines the order of nucleotides.",
    steps:"Use dideoxynucleotides (ddNTPs) that LACK a 3′-OH → chain termination. Run four separate reactions (one for each ddNTP, labeled different colors). Separate by capillary electrophoresis. Read colors in order.",
    reagents:"Template, primer, DNA pol, dNTPs, fluorescent ddNTPs.",
    keypoints:"Next-gen sequencing (NGS) is massively parallel, much faster/cheaper. Sanger still gold standard for accuracy (~1000 bp/read)."
  },
  {
    cat:"Molecular Biology",
    title:"Restriction Enzymes & Cloning",
    what:"Cut DNA at specific palindromic recognition sequences (4-8 bp). Used for DNA cloning.",
    steps:"Cut vector and insert with same restriction enzyme (produces sticky or blunt ends). Use DNA ligase to join insert into vector. Transform into bacteria. Select with antibiotic resistance.",
    reagents:"Restriction endonucleases, DNA ligase, plasmid vector (with ori, antibiotic resistance, multiple cloning site), competent bacteria.",
    keypoints:"Sticky ends more efficient than blunt ends. cDNA libraries (from mRNA via reverse transcriptase) lack introns; genomic libraries include them. Expression vectors have promoters for protein production."
  },
  {
    cat:"Molecular Biology",
    title:"CRISPR-Cas9",
    what:"Precise gene editing tool adapted from bacterial immune system.",
    steps:"Guide RNA (gRNA) directs Cas9 endonuclease to complementary DNA sequence. Cas9 makes double-strand break. Repair via NHEJ (indels → gene knockout) or HDR (with donor template → precise insertion/correction).",
    reagents:"Cas9 protein, gRNA, donor template (for HDR).",
    keypoints:"Off-target effects possible; PAM sequence required (NGG for spCas9). Revolutionary for gene therapy."
  },
  {
    cat:"Protein Chemistry",
    title:"SDS-PAGE",
    what:"Denaturing protein gel electrophoresis that separates by MOLECULAR WEIGHT only.",
    steps:"Boil protein sample with SDS (detergent) and β-mercaptoethanol (reducing agent, breaks disulfide bonds). SDS coats proteins with uniform negative charge. Run on polyacrylamide gel. Stain with Coomassie blue or transfer to Western blot.",
    reagents:"SDS (denatures, uniform negative charge), β-me or DTT (reduces disulfides), polyacrylamide, Coomassie/silver stain.",
    keypoints:"Non-reducing conditions (no β-me) keep disulfide bonds intact → quaternary structure visible. Native PAGE preserves 3D structure/function."
  },
  {
    cat:"Protein Chemistry",
    title:"Isoelectric Focusing (IEF)",
    what:"Separates proteins by ISOELECTRIC POINT (pI).",
    steps:"Load protein onto gel with pH gradient. Apply electric field. Proteins migrate until they reach the pH where their net charge = 0 (their pI), then stop.",
    reagents:"Polyacrylamide gel with immobilized pH gradient ampholytes.",
    keypoints:"2D gel electrophoresis = IEF (first dimension, by pI) + SDS-PAGE (second dimension, by size) → separates thousands of proteins in complex mixtures."
  },
  {
    cat:"Separation/Purification",
    title:"Chromatography",
    what:"Separates mixtures based on differential affinity for stationary vs mobile phase.",
    steps:"<b>Column:</b> sample runs through column containing stationary phase; different components elute at different rates.<br><b>Types:</b>",
    reagents:"",
    keypoints:"<b>Ion exchange:</b> separates by charge (cation-exchange binds positive proteins; anion-exchange binds negative); elute with salt gradient.<br><b>Size exclusion (gel filtration):</b> separates by size — LARGEST elutes FIRST (small ones get trapped in pores).<br><b>Affinity:</b> most specific — uses antibody, substrate, or His-tag/Ni⁺⁺. Highest purity.<br><b>HPLC:</b> high pressure, high resolution."
  },
  {
    cat:"Separation/Purification",
    title:"Distillation & Extraction",
    what:"<b>Simple distillation:</b> separates liquids with large boiling point differences (>25°C).<br><b>Vacuum distillation:</b> lowers pressure → lowers boiling point (for compounds that decompose at high BP).<br><b>Fractional distillation:</b> separates liquids with close BPs using fractionating column (more surface area, multiple vaporization-condensation cycles).<br><b>Extraction:</b> separates based on solubility in aqueous vs organic solvent; like-dissolves-like; acids deprotonated into aqueous layer, bases protonated into aqueous.",
    steps:"",
    reagents:"Separatory funnel; organic solvents (ether, ethyl acetate, dichloromethane); aqueous acid/base for washes.",
    keypoints:"<b>Order of extractions for separation:</b> (1) weak acid (bicarbonate) extracts strong acids (carboxylic acids), (2) strong base (NaOH) extracts weak acids (phenols), (3) acid extracts bases (amines). All else stays organic."
  },
  {
    cat:"Microscopy",
    title:"Microscopy Types",
    what:"<b>Light (brightfield):</b> simple; requires staining/killing cells; low contrast.<br><b>Phase contrast:</b> converts differences in refractive index into contrast; live cells, no staining.<br><b>Darkfield:</b> light scattered by sample against dark background; very small objects (e.g., spirochetes like Treponema).<br><b>Fluorescence:</b> uses fluorophores (GFP, antibodies tagged with fluorescent dye); immunofluorescence; super-resolution beyond diffraction limit.<br><b>Electron microscopy (TEM/SEM):</b> highest resolution (nm scale). TEM = internal structures (2D slices), SEM = surface (3D images). Requires dead, fixed samples, heavy metal stain.",
    steps:"",
    reagents:"",
    keypoints:"Confocal microscopy uses laser + pinhole → sharp optical sections, 3D reconstruction. Electron microscopes use magnets to focus electrons (not glass lenses to focus light)."
  },
  {
    cat:"Cell Biology",
    title:"Flow Cytometry & FACS",
    what:"Counts/sorts cells one-by-one based on light scatter and fluorescence.",
    steps:"Cells pass single-file through laser. Forward scatter (FSC) = size. Side scatter (SSC) = granularity/internal complexity. Fluorescent-tagged antibodies bind specific cell-surface markers (CD antigens). FACS (fluorescence-activated cell sorting) actually separates cell populations (e.g., CD4+ helper T cells).",
    reagents:"Fluorophore-conjugated antibodies; sheath fluid for hydrodynamic focusing.",
    keypoints:"Used for blood cell counts, immune profiling, cell cycle analysis (DNA content with propidium iodide), apoptosis (Annexin V stain)."
  },
  {
    cat:"Genetics",
    title:"ELISA (Enzyme-Linked Immunosorbent Assay)",
    what:"Detects presence of ANTIBODIES or ANTIGENS using enzyme-linked antibodies and colorimetric readout.",
    steps:"<b>Indirect:</b> antigen on plate → add patient serum (if antibodies present, they bind) → add enzyme-linked secondary anti-human antibody → add substrate → color change = positive (e.g., HIV test).<br><b>Sandwich:</b> capture antibody on plate → antigen → detection antibody → more sensitive.<br><b>Competitive:</b> sample antigen competes with labeled antigen; less signal = more antigen in sample.",
    reagents:"Microplate, primary Abs, enzyme-conjugated secondary Abs (horse radish peroxidase = HRP or alkaline phosphatase = AP), colorimetric substrate (TMB → blue).",
    keypoints:"Screening test (high sensitivity); positive results confirmed with Western (high specificity)."
  },
  {
    cat:"Genetics",
    title:"Karyotyping & FISH",
    what:"<b>Karyotyping:</b> visualize metaphase chromosomes stained (Giemsa banding/G-banding) to count chromosomes and detect large abnormalities (trisomy 21, translocations).<br><b>FISH (Fluorescence In Situ Hybridization):</b> fluorescent probe binds specific chromosomal region → detects deletions/duplications/translocations/gene amplifications (e.g., HER2 in breast cancer). Can be done on INTERPHASE cells (no need for metaphase).",
    steps:"",
    reagents:"Colchicine (arrests cells in metaphase for karyotyping); fluorescent DNA probes.",
    keypoints:"G-banding pattern unique per chromosome. FISH is higher resolution than karyotype; DNA sequencing detects even smaller changes."
  },
  {
    cat:"Immunology",
    title:"Vaccine Types",
    what:"<b>Live attenuated:</b> weakened microbe → strong cellular AND humoral immunity; can cause disease in immunocompromised (MMR, Sabin polio, BCG, varicella).<br><b>Inactivated (killed):</b> dead pathogen; safer; weaker response, may need boosters (Salk polio, influenza injection, hepatitis A).<br><b>Subunit/recombinant:</b> antigenic fragment only (HBV = recombinant HBsAg; HPV L1 capsid; acellular pertussis).<br><b>mRNA:</b> codes for antigen (spike protein); host cells produce antigen (Pfizer/BioNTech, Moderna).<br><b>Viral vector:</b> non-replicating virus delivers DNA (J&J/Janssen, AstraZeneca).",
    steps:"",
    reagents:"",
    keypoints:"Herd immunity threshold varies by R₀ (~95% for measles, ~80-85% for polio)."
  },
  {
    cat:"Spectroscopy",
    title:"IR, NMR, UV-Vis & Mass Spec",
    what:"<b>IR (Infrared):</b> identifies FUNCTIONAL GROUPS via bond vibrations. Key peaks: O-H broad ~3300, N-H ~3300 (sharp), C-H ~3000, C=O sharp ~1700, C=C ~1650.<br><b>¹H NMR:</b> reveals number of unique H, their environments (chemical shift, ppm), neighbors (splitting n+1 rule), and counts (integration). Aldehyde ~9-10, carboxylic acid ~10-12, aromatic ~7-8, vinyl ~5-6.<br><b>UV-Vis:</b> detects CONJUGATED π systems; more conjugation → longer λ; used for concentration (Beer-Lambert A = εbc).<br><b>Mass spec:</b> molecular weight via mass-to-charge (m/z); parent peak = molecular ion; fragmentation patterns identify structure.",
    steps:"",
    reagents:"",
    keypoints:"n+1 rule for splitting; TMS reference at 0 ppm; deuterated solvents (CDCl₃). UV absorbance of proteins at 280 nm (Trp, Tyr)."
  },
];

// ---------- DUAS / SUPPLICATIONS ----------
const DUAS = [
  {
    title:"Before Studying / Seeking Knowledge",
    arabic:"رَبِّ زِدْنِي عِلْمًا",
    translit:"Rabbi zidni 'ilma",
    meaning:"My Lord, increase me in knowledge. — Qur'an 20:114",
    note:"The Prophet (ﷺ) taught to recite this for increase in knowledge. Short and powerful."
  },
  {
    title:"For Ease in Difficulty",
    arabic:"رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي",
    translit:"Rabbish-rah li sadri, wa yassir li amri, wahlul 'uqdatam-min lisani, yafqahu qawli",
    meaning:"My Lord, expand for me my breast, and ease for me my task, and untie the knot from my tongue that they may understand my speech. — Qur'an 20:25-28 (Du'a of Musa 'alayhis-salam)",
    note:"The famous du'a Prophet Musa made before facing Pharaoh and speaking publicly — scholars recommend it before exams, interviews, or difficult tasks."
  },
  {
    title:"For Something Difficult",
    arabic:"اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
    translit:"Allahumma la sahla illa ma ja'altahu sahla, wa anta taj'al al-hazna idha shi'ta sahla",
    meaning:"O Allah, there is no ease except what You make easy, and You make grief easy if You will.",
    note:"A du'a reported from the Sunnah for when things feel heavy or overwhelming."
  },
  {
    title:"Seeking Benefit in Knowledge",
    arabic:"اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي وَزِدْنِي عِلْمًا",
    translit:"Allahummanfa'ni bima 'allamtani wa 'allimni ma yanfa'uni wa zidni 'ilma",
    meaning:"O Allah, benefit me by that which You have taught me, teach me that which will benefit me, and increase me in knowledge.",
    note:"Often recited after prayer; asks Allah to make your knowledge beneficial and put it to good use."
  },
  {
    title:"After Studying / to Retain",
    arabic:"سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ",
    translit:"SubhanAllahi wal-hamdu lillahi wa la ilaha illallahu wallahu akbar",
    meaning:"Glory be to Allah, all praise is Allah's, none has the right to be worshiped but Allah, and Allah is Most Great.",
    note:"Scholars mention these words help anchor memory. Also, review your notes within 24 hours — educational research and Islamic tradition both emphasize repetition for retention."
  },
  {
    title:"For Success (general)",
    arabic:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    translit:"Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhab an-nar",
    meaning:"Our Lord, grant us good in this world and good in the hereafter, and protect us from the punishment of the Fire. — Qur'an 2:201",
    note:"The most comprehensive du'a — asks Allah for the best of both worlds. Recite frequently."
  },
  {
    title:"Entering the Exam (remembrance)",
    arabic:"حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    translit:"Hasbunallahu wa ni'mal wakeel",
    meaning:"Allah is sufficient for us, and He is the best disposer of affairs. — Qur'an 3:173",
    note:"A powerful du'a for when you feel anxious or overwhelmed — remember that your effort plus trust in Allah is enough. Recite often and breathe."
  },
  {
    title:"Etiquette of Seeking Knowledge",
    arabic:"",
    translit:"",
    meaning:"The scholars note that knowledge comes with etiquettes: sincere intention (to benefit people and act upon what you learn), patience with your teachers, reviewing consistently, acting on your knowledge, and thanking Allah for allowing you to study. The Prophet (ﷺ) said: 'Whoever travels a path seeking knowledge, Allah will make easy for them a path to Paradise.' — Sahih Muslim",
    note:"Medicine is a noble path — you're not just studying for an exam, you're preparing to serve Allah's creation inshaAllah."
  }
];

// ---------- PHYSICS CALCULATORS ----------
const CALCULATORS = [
  {
    id:"lens",
    name:"Lens/Mirror Calculator",
    desc:"Given focal length and object distance, calculates image position, magnification, real/virtual, upright/inverted.",
    fields:[
      {key:"f",label:"Focal length f (cm)",type:"number",default:10},
      {key:"d0",label:"Object distance d₀ (cm)",type:"number",default:20},
      {key:"isMirror",label:"Mirror (not lens)",type:"checkbox"}
    ],
    compute:(v)=>{
      const f=+v.f, d0=+v.d0;
      if(d0===0) return "<p style='color:var(--red)'>Object distance cannot be zero.</p>";
      // thin lens: 1/f = 1/d0 + 1/di
      const di = 1/(1/f - 1/d0);
      const m = -di/d0;
      const real = di>0;
      const upright = m>0;
      const magnified = Math.abs(m)>1;
      return `
        <p><strong>Image distance dᵢ:</strong> ${di.toFixed(2)} cm</p>
        <p><strong>Magnification m:</strong> ${m.toFixed(2)}</p>
        <ul style="margin-left:18px; margin-top:8px; color:var(--text-dim); font-size:0.9rem;">
          <li>Image is <strong style="color:${real?'var(--green)':'var(--orange)'}">${real?'REAL (opposite side)':'VIRTUAL (same side)'}</strong></li>
          <li>Image is <strong style="color:${upright?'var(--green)':'var(--orange)'}">${upright?'UPRIGHT':'INVERTED'}</strong></li>
          <li>Image is <strong style="color:${magnified?'var(--cyan)':'var(--text-dim)'}">${magnified?'MAGNIFIED':'REDUCED'}</strong> (|m| = ${Math.abs(m).toFixed(2)})</li>
          <li>Power P = 1/f (in meters) = ${(1/(f/100)).toFixed(2)} diopters</li>
        </ul>`;
    }
  },
  {
    id:"hw",
    name:"Hardy-Weinberg Equilibrium",
    desc:"Calculates allele frequencies (p, q) and genotype frequencies (p², 2pq, q²).",
    fields:[
      {key:"q2",label:"Frequency of recessive genotype (q²)",type:"number",default:0.04, step:"0.01", min:0, max:1}
    ],
    compute:(v)=>{
      const q2=+v.q2;
      if(q2<0||q2>1) return "<p style='color:var(--red)'>Enter a value between 0 and 1.</p>";
      const q = Math.sqrt(q2);
      const p = 1 - q;
      const p2 = p*p;
      const pq2 = 2*p*q;
      const total = p2+pq2+q2;
      return `
        <p><strong>Allele frequencies:</strong></p>
        <ul style="margin-left:18px; color:var(--text-dim); font-size:0.9rem;">
          <li>p (dominant allele) = <strong>${p.toFixed(4)}</strong></li>
          <li>q (recessive allele) = <strong>${q.toFixed(4)}</strong></li>
        </ul>
        <p style="margin-top:10px;"><strong>Genotype frequencies:</strong></p>
        <ul style="margin-left:18px; color:var(--text-dim); font-size:0.9rem;">
          <li>p² (homozygous dominant) = <strong>${(p2*100).toFixed(1)}%</strong></li>
          <li>2pq (heterozygous carriers) = <strong>${(pq2*100).toFixed(1)}%</strong></li>
          <li>q² (homozygous recessive) = <strong>${(q2*100).toFixed(1)}%</strong> (input)</li>
        </ul>
        <p style="margin-top:8px; font-size:0.82rem; color:var(--text-mute);">Sum: ${(total*100).toFixed(1)}% — assumes no mutation, no migration, random mating, no selection, large population.</p>`;
    }
  },
  {
    id:"hh",
    name:"Buffer pH (Henderson-Hasselbalch)",
    desc:"Calculates pH of a buffer solution; also finds ratio of conjugate base to acid.",
    fields:[
      {key:"pka",label:"pKa of acid",type:"number",default:4.76, step:"0.01"},
      {key:"ratio",label:"[A⁻] / [HA] ratio",type:"number",default:1, step:"0.1"}
    ],
    compute:(v)=>{
      const pKa=+v.pka, r=+v.ratio;
      if(r<=0) return "<p style='color:var(--red)'>Ratio must be positive.</p>";
      const pH = pKa + Math.log10(r);
      const isBuffer = Math.abs(pH - pKa) <= 1;
      return `
        <p><strong>pH = ${pH.toFixed(2)}</strong></p>
        <p style="margin-top:8px; color:var(--text-dim); font-size:0.9rem;">
          When [A⁻] = [HA], pH = pKa = ${pKa}.<br>
          Buffer effective range: pKa ± 1 = ${(pKa-1).toFixed(2)} to ${(pKa+1).toFixed(2)}<br>
          This buffer is ${isBuffer?'<strong style="color:var(--green)">within effective range</strong>':'<strong style="color:var(--orange)">outside optimal buffer range</strong>'}.
        </p>`;
    }
  },
  {
    id:"pi",
    name:"Amino Acid pI Estimator",
    desc:"Calculates isoelectric point (pI) from pKa values. Amino acid zwitterion has net 0 at pI.",
    fields:[
      {key:"pka1",label:"pKa₁ (carboxyl, ~2)",type:"number",default:2.34, step:"0.01"},
      {key:"pka2",label:"pKa₂ (amino, ~9)",type:"number",default:9.69, step:"0.01"},
      {key:"pkaR",label:"pKa R-group (leave blank for neutral AAs)",type:"number",default:"", step:"0.01"}
    ],
    compute:(v)=>{
      const p1=+v.pka1, p2=+v.pka2, pR=v.pkaR===""||isNaN(+v.pkaR)?null:+v.pkaR;
      let pI, note;
      if(pR===null){
        pI = (p1+p2)/2;
        note = "Neutral amino acid (nonpolar or polar uncharged) — pI is average of amino and carboxyl pKa.";
      } else if(pR < 7){
        pI = (p1+pR)/2;
        note = "Acidic amino acid (or cysteine/tyrosine) — pI is average of the two LOWEST pKa values.";
      } else {
        pI = (p2+pR)/2;
        note = "Basic amino acid — pI is average of the two HIGHEST pKa values.";
      }
      return `
        <p><strong>pI ≈ ${pI.toFixed(2)}</strong></p>
        <p style="margin-top:8px; color:var(--text-dim); font-size:0.9rem;">${note}</p>
        <p style="margin-top:8px; font-size:0.82rem; color:var(--text-mute);">At pH below pI → net positive charge. At pH above pI → net negative.</p>`;
    }
  },
  {
    id:"beer",
    name:"Beer-Lambert Law (A = εbc)",
    desc:"Converts absorbance to concentration, or vice versa.",
    fields:[
      {key:"eps",label:"Molar absorptivity ε (M⁻¹cm⁻¹)",type:"number",default:15000},
      {key:"b",label:"Path length b (cm)",type:"number",default:1},
      {key:"A",label:"Absorbance A",type:"number",default:0.5, step:"0.01"}
    ],
    compute:(v)=>{
      const eps=+v.eps, b=+v.b, A=+v.A;
      const c = A/(eps*b);
      const T = Math.pow(10,-A)*100;
      return `
        <p><strong>Concentration c = ${c.toExponential(3)} M</strong> (${(c*1e6).toFixed(2)} μM)</p>
        <p style="margin-top:8px; color:var(--text-dim); font-size:0.9rem;">
          Transmittance T = 10⁻ᴬ = ${T.toFixed(2)}%<br>
          Linear range typically A = 0.1 to 1.0 (most accurate near 0.4-0.6).
        </p>`;
    }
  },
  {
    id:"kinematic",
    name:"Kinematics (No-time & Others)",
    desc:"Quick kinematics: v² = v₀² + 2aΔx; v = v₀ + at; Δx = v₀t + ½at²",
    fields:[
      {key:"v0",label:"Initial velocity v₀ (m/s)",type:"number",default:0},
      {key:"v",label:"Final velocity v (m/s)",type:"number",default:20},
      {key:"a",label:"Acceleration a (m/s²)",type:"number",default:9.8, step:"0.1"},
      {key:"calc",label:"Solve for:",type:"select",options:["Distance Δx (no time)","Time (if constant a)"]}
    ],
    compute:(v)=>{
      const v0=+v.v0, vf=+v.v, a=+v.a;
      if(v.calc==="Distance Δx (no time)"){
        const dx=(vf*vf-v0*v0)/(2*a);
        return `<p><strong>Δx = ${dx.toFixed(2)} m</strong></p><p style="margin-top:8px; color:var(--text-dim); font-size:0.9rem;">Using v² = v₀² + 2aΔx.</p>`;
      } else {
        const t = (vf-v0)/a;
        const dx = v0*t + 0.5*a*t*t;
        return `
          <p><strong>Time t = ${t.toFixed(2)} s</strong></p>
          <p style="margin-top:8px; color:var(--text-dim); font-size:0.9rem;">
            Displacement over that time: Δx = ${dx.toFixed(2)} m<br>
            Using v = v₀ + at and Δx = v₀t + ½at².
          </p>`;
      }
    }
  }
];

// ---------- FL TRACKER DEFAULTS (commonly used exams) ----------
const FL_EXAMS_DEFAULT = [
  {name:"Blueprint Half-Length (diagnostic)",company:"Blueprint",max:528,plannedDate:"",score:""},
  {name:"Blueprint FL 1",company:"Blueprint",max:528,plannedDate:"",score:""},
  {name:"Blueprint FL 2",company:"Blueprint",max:528,plannedDate:"",score:""},
  {name:"Altius FL 1",company:"Altius",max:528,plannedDate:"",score:""},
  {name:"AAMC Sample Test (unscored)",company:"AAMC",max:528,plannedDate:"",score:""},
  {name:"AAMC FL 1",company:"AAMC",max:528,plannedDate:"",score:""},
  {name:"AAMC FL 2",company:"AAMC",max:528,plannedDate:"",score:""},
  {name:"AAMC FL 3",company:"AAMC",max:528,plannedDate:"",score:""},
  {name:"AAMC FL 4",company:"AAMC",max:528,plannedDate:"",score:""},
];

// ---------- DAILY STREAK DATA ----------
// Streak/tasks saved in localStorage under 'mcat-tasks'

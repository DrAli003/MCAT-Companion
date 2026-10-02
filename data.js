/* ============================================================
   MCAT COMPANION — DATA MODULE
   High-yield content compiled from AAMC guidance, r/MCAT
   consensus (515+ scorers), Jack Westin, Kaplan, Khan Academy,
   UWorld, and Student Doctor Network.
   ============================================================ */

/* ---------- AMINO ACID STRUCTURES (SVG) ----------
   Each is drawn in L-configuration (the biologically active form)
   at physiological pH (zwitterion where applicable).
   Coordinates assume alpha carbon at (100,110) as origin.
   Rendered by drawAAStructure() in app.js.
*/
const AA_STRUCTURES = {
  Gly: {rType:"H", special:"simple"},
  Ala: {rType:"chain", chain:[{bond:"-",label:"CH₃"}]},
  Val: {rType:"chain", chain:[{bond:"-",label:"CH",branch:[{bond:"-",label:"CH₃",angle:-35},{bond:"-",label:"CH₃",angle:35}]}]},
  Leu: {rType:"chain", chain:[{bond:"-",label:"CH₂"},{bond:"-",label:"CH",branch:[{bond:"-",label:"CH₃",angle:-35},{bond:"-",label:"CH₃",angle:35}]}]},
  Ile: {rType:"chain", chain:[{bond:"-",label:"CH",branch:[{bond:"-",label:"CH₃",angle:-35},{bond:"-",label:"CH₂",angle:35,chain:[{bond:"-",label:"CH₃"}]}]}]},
  Met: {rType:"chain", chain:[{bond:"-",label:"CH₂"},{bond:"-",label:"CH₂"},{bond:"-",label:"S"},{bond:"-",label:"CH₃"}]},
  Pro: {rType:"proline"},  // special ring back to N
  Phe: {rType:"chain", chain:[{bond:"-",label:"CH₂"},{bond:"benzene"}]},
  Tyr: {rType:"chain", chain:[{bond:"-",label:"CH₂"},{bond:"phenol"}]},
  Trp: {rType:"chain", chain:[{bond:"-",label:"CH₂"},{bond:"indole"}]},
  Ser: {rType:"chain", chain:[{bond:"-",label:"CH₂",labelSub:"OH",subPos:"right"}]},
  Thr: {rType:"chain", chain:[{bond:"-",label:"CH",branch:[{bond:"-",label:"OH",angle:-35},{bond:"-",label:"CH₃",angle:35}]}]},
  Cys: {rType:"chain", chain:[{bond:"-",label:"CH₂",labelSub:"SH",subPos:"right"}]},
  Asn: {rType:"chain", chain:[{bond:"-",label:"CH₂"},{bond:"amide",terminal:true}]},
  Gln: {rType:"chain", chain:[{bond:"-",label:"CH₂"},{bond:"-",label:"CH₂"},{bond:"amide",terminal:true}]},
  Asp: {rType:"chain", chain:[{bond:"-",label:"CH₂"},{bond:"carboxyl",charged:true,terminal:true}]},
  Glu: {rType:"chain", chain:[{bond:"-",label:"CH₂"},{bond:"-",label:"CH₂"},{bond:"carboxyl",charged:true,terminal:true}]},
  Lys: {rType:"chain", chain:[{bond:"-",label:"CH₂"},{bond:"-",label:"CH₂"},{bond:"-",label:"CH₂"},{bond:"-",label:"CH₂"},{bond:"amine",charged:true,terminal:true}]},
  Arg: {rType:"chain", chain:[{bond:"-",label:"CH₂"},{bond:"-",label:"CH₂"},{bond:"-",label:"CH₂"},{bond:"guanidino"}]},
  His: {rType:"chain", chain:[{bond:"-",label:"CH₂"},{bond:"imidazole"}]},
};

// ---------- AMINO ACIDS ----------
const AMINO_ACIDS = [
  // Nonpolar aliphatic (9) — "GA VL IMP" or "GA V LIM P"
  {abbr:"Gly",one:"G",name:"Glycine",group:"Nonpolar",pKa:"—",pi:6.0,charge:"neutral",aromatic:false,special:"Simplest AA; achiral (H as R-group); fits in tight turns; inhibitory neurotransmitter precursor. The only non-chiral amino acid.",formula:"H",color:"#60a5fa"},
  {abbr:"Ala",one:"A",name:"Alanine",group:"Nonpolar",pKa:"—",pi:6.0,charge:"neutral",aromatic:false,special:"Methyl side chain — the 'boring' reference. In L-configuration, CH₃ projects BACK (dashed wedge) in standard Fischer projection; purely glucogenic.",formula:"CH₃",color:"#60a5fa"},
  {abbr:"Val",one:"V",name:"Valine",group:"Nonpolar",pKa:"—",pi:6.0,charge:"neutral",aromatic:false,special:"Essential; branched-chain (like Leu, Ile); purely glucogenic. Deficiency of branched-chain α-ketoacid DH → Maple Syrup Urine Disease.",formula:"CH(CH₃)₂",color:"#60a5fa"},
  {abbr:"Leu",one:"L",name:"Leucine",group:"Nonpolar",pKa:"—",pi:6.0,charge:"neutral",aromatic:false,special:"Essential; branched-chain; ONE OF ONLY TWO PURELY KETOGENIC amino acids (with Lys). Commonly found in α-helices.",formula:"CH₂CH(CH₃)₂",color:"#60a5fa"},
  {abbr:"Ile",one:"I",name:"Isoleucine",group:"Nonpolar",pKa:"—",pi:6.0,charge:"neutral",aromatic:false,special:"Essential; branched-chain; has a SECOND chiral center at the β-carbon (4 stereoisomers); both glucogenic AND ketogenic.",formula:"CH(CH₃)CH₂CH₃",color:"#60a5fa"},
  {abbr:"Met",one:"M",name:"Methionine",group:"Nonpolar",pKa:"—",pi:5.7,charge:"neutral",aromatic:false,special:"Essential; START codon AUG (eukaryotes); contains SULFUR (thioether); SAM (S-adenosylmethionine) is the universal methyl donor. Formyl-Met in prokaryotes.",formula:"CH₂CH₂SCH₃",color:"#60a5fa"},
  {abbr:"Pro",one:"P",name:"Proline",group:"Nonpolar",pKa:"—",pi:6.3,charge:"neutral",aromatic:false,special:"IMINO acid (secondary amine, not primary) — its side chain loops back to bond with the α-amino group. Rigid ring KINKS α-helices; common in β-turns and collagen.",formula:"(ring to N)",color:"#60a5fa"},
  // Aromatic (3) — "WYF"
  {abbr:"Phe",one:"F",name:"Phenylalanine",group:"Aromatic",pKa:"—",pi:5.5,charge:"neutral",aromatic:true,special:"Essential; purely ketogenic; precursor to Tyrosine via phenylalanine hydroxylase (PAH). DEFICIENCY OF PAH → PHENYLKETONURIA (PKU) — must avoid aspartame. Absorbs UV at 258 nm (weakly).",formula:"CH₂-benzene",color:"#c084fc"},
  {abbr:"Tyr",one:"Y",name:"Tyrosine",group:"Aromatic",pKa:"~10.5",pi:5.7,charge:"neutral",aromatic:true,special:"Has a phenol (-OH) group; phosphorylation target (Ser/Thr/Tyr kinases). Precursor to dopamine, norepinephrine, epinephrine (catecholamines), thyroxine, melanin. STRONG UV absorbance at 280 nm.",formula:"CH₂-phenol",color:"#c084fc"},
  {abbr:"Trp",one:"W",name:"Tryptophan",group:"Aromatic",pKa:"—",pi:5.9,charge:"neutral",aromatic:true,special:"Essential; largest side chain (bicyclic indole ring). Precursor to SEROTONIN (→ melatonin) and niacin (B3). STRONGEST UV absorbance at 280 nm — mostly responsible for protein A280.",formula:"CH₂-indole",color:"#c084fc"},
  // Polar uncharged (5) — "ST NQ C" or "STQ NC"
  {abbr:"Ser",one:"S",name:"Serine",group:"Polar Uncharged",pKa:"~13",pi:5.7,charge:"neutral",aromatic:false,special:"Has -OH group; site of phosphorylation (by Ser/Thr kinases); O-linked glycosylation; common in catalytic triads (Ser-His-Asp) of proteases. Synthesized from 3-PG (glycolysis intermediate).",formula:"CH₂OH",color:"#34d399"},
  {abbr:"Thr",one:"T",name:"Threonine",group:"Polar Uncharged",pKa:"~13",pi:5.6,charge:"neutral",aromatic:false,special:"Essential; also phosphorylated and O-glycosylated; TWO chiral centers (like Ile). Named for structural similarity to threose sugar.",formula:"CH(OH)CH₃",color:"#34d399"},
  {abbr:"Cys",one:"C",name:"Cysteine",group:"Polar Uncharged",pKa:"~8.3",pi:5.0,charge:"neutral",aromatic:false,special:"SULFUR-containing (thiol); forms DISULFIDE BONDS (2 Cys → cystine) in oxidizing environments (extracellular/ER); important for tertiary structure. pKa ~8.3 — can act as nucleophile at active sites.",formula:"CH₂SH",color:"#34d399"},
  {abbr:"Asn",one:"N",name:"Asparagine",group:"Polar Uncharged",pKa:"—",pi:5.4,charge:"neutral",aromatic:false,special:"Amide of aspartate; site of N-LINKED GLYCOSYLATION (Asn-X-Ser/Thr motif); first AA discovered (from asparagus). Glutamine and asparagine carry ammonia in blood.",formula:"CH₂CONH₂",color:"#34d399"},
  {abbr:"Gln",one:"Q",name:"Glutamine",group:"Polar Uncharged",pKa:"—",pi:5.7,charge:"neutral",aromatic:false,special:"Amide of glutamate; MOST ABUNDANT free amino acid in blood; primary nitrogen carrier between tissues; major fuel for rapidly dividing cells (immune cells, intestinal cells).",formula:"CH₂CH₂CONH₂",color:"#34d399"},
  // Acidic (-) at pH 7.4 — "DE"
  {abbr:"Asp",one:"D",name:"Aspartate",group:"Acidic (-)",pKa:"~3.9",pi:2.8,charge:"-1",aromatic:false,special:"Negatively charged at pH 7.4. Substrate in urea cycle; transamination pairs (Asp ↔ OAA via AST); activates NMDA receptor (major excitatory NT along with Glu).",formula:"CH₂COO⁻",color:"#f87171"},
  {abbr:"Glu",one:"E",name:"Glutamate",group:"Acidic (-)",pKa:"~4.1",pi:3.2,charge:"-1",aromatic:false,special:"Negatively charged at pH 7.4. THE MAJOR EXCITATORY NEUROTRANSMITTER in the CNS; precursor to GABA (via glutamate decarboxylase) — major inhibitory NT; transamination pairs (Glu ↔ α-KG); umami taste receptor agonist.",formula:"CH₂CH₂COO⁻",color:"#f87171"},
  // Basic (+) at pH 7.4 — "KRH"
  {abbr:"Lys",one:"K",name:"Lysine",group:"Basic (+)",pKa:"~10.5",pi:9.7,charge:"+1",aromatic:false,special:"Essential; positively charged at physiological pH; ε-amino group is site of ubiquitination, acetylation, methylation (histone modifications). PURELY KETOGENIC (with Leu).",formula:"(CH₂)₄NH₃⁺",color:"#fbbf24"},
  {abbr:"Arg",one:"R",name:"Arginine",group:"Basic (+)",pKa:"~12.5",pi:10.8,charge:"+1",aromatic:false,special:"MOST BASIC amino acid (highest pKa → fully protonated at pH 7.4); guanidinium group always +. Intermediate in urea cycle; substrate for NO SYNTHASE → nitric oxide (potent vasodilator, cGMP pathway).",formula:"(CH₂)₃NHC(NH)NH₃⁺",color:"#fbbf24"},
  {abbr:"His",one:"H",name:"Histidine",group:"Basic (+)",pKa:"~6.0",pi:7.6,charge:"~+0.1",aromatic:true,special:"pKa ~6.0 — closest to physiological pH, so it readily DONATES/ACCEPTS protons → common in ENZYME ACTIVE SITES (catalytic triads: Ser-His-Asp). Precursor to histamine (allergies, stomach acid secretion). Imidazole ring.",formula:"CH₂-imidazole",color:"#fbbf24"}
];

// ---------- MNEMONIC LIBRARY ----------
const MNEMONICS = [
  // BIO/BIOCHEM
  {cat:"Biochemistry",title:"Amino Acids — Acidic vs Basic",mnemonic:"DEKRH",explains:"D (Asp) & E (Glu) are acidic (-) at pH 7.4. K (Lys), R (Arg), H (His) are basic (+). All others are nonpolar or polar uncharged."},
  {cat:"Biochemistry",title:"Nonpolar Aromatics",mnemonic:"I love my WYF's aroma (W,Y,F)",explains:"W = Tryptophan, Y = Tyrosine, F = Phenylalanine are the three aromatic amino acids."},
  {cat:"Biochemistry",title:"Essential Amino Acids",mnemonic:"PVT. TIM HaLL (or WHeRe FaVoriTe MiLK)",explains:"Phe, Val, Thr, Trp, Ile, Met, His, Leu, Lys — must be obtained from diet. (Arg & His essential in children; not adults.)"},
  {cat:"Biochemistry",title:"Purely Ketogenic AAs",mnemonic:"Lucy and Lila Love Keto",explains:"Leucine (L) and Lysine (K) are the ONLY purely ketogenic amino acids. All others are glucogenic or both."},
  {cat:"Biochemistry",title:"Krebs (Citric Acid) Cycle Intermediates",mnemonic:"Can I Keep Selling Seashells For Money, Officer?",explains:"Citrate → Isocitrate → α-Ketoglutarate → Succinyl-CoA → Succinate → Fumarate → Malate → Oxaloacetate"},
  {cat:"Biochemistry",title:"Krebs Cycle Products (per acetyl-CoA)",mnemonic:"NAD NAD GAH FAH NAH",explains:"3 NADH (isocitrate DH, α-KG DH, malate DH) + 1 GTP (succinyl-CoA synthetase) + 1 FADH₂ (succinate DH) — net 10 ATP equivalents."},
  {cat:"Biochemistry",title:"Glycolysis Intermediates (10 steps)",mnemonic:"Grandma Gets Fancy French Bread, Grandpa Brings Plenty Piping Pepperoni Pizza",explains:"Glucose → G6P → F6P → F-1,6-BP → G3P/DHAP → 1,3-BPG → 3-PG → 2-PG → PEP → Pyruvate"},
  {cat:"Biochemistry",title:"Glycolysis Irreversible Enzymes",mnemonic:"How Glycolysis Pushes Forward the Process",explains:"Hexokinase/Glucokinase, PFK-1 (RATE-LIMITING), Pyruvate Kinase — the three committed steps consuming/producing ATP."},
  {cat:"Biochemistry",title:"Enzyme Kinetics (Michaelis-Menten)",mnemonic:"V = Vmax × [S] / (Km + [S])",explains:"Km = [S] at ½ Vmax (affinity inverse). ↑ Km = lower affinity. Competitive inhibitors ↑ Km (same Vmax). Non-competitive ↓ Vmax (same Km)."},
  {cat:"Biology",title:"Anterior Pituitary Hormones (FLAT PEG)",mnemonic:"FLAT PEG",explains:"FLAT = tropic (FSH, LH, ACTH, TSH). PEG = direct (Prolactin, Endorphins, Growth Hormone). Posterior releases ADH & Oxytocin (made in hypothalamus)."},
  {cat:"Biology",title:"Pyrimidines vs Purines",mnemonic:"CUT the PYe; PUR As Gold",explains:"Pyrimidines = Cytosine, Uracil, Thymine (1 ring). Purines = Adenine, Guanine (2 rings). Mnemonic: 'CUT the Py' = CU T are PYrimidines."},
  {cat:"Biology",title:"Start & Stop Codons",mnemonic:"AUG inAU Gurates; U Are Annoying, U Go Away, U Are Gone",explains:"Start = AUG (methionine). Stops = UAA, UGA, UAG."},
  {cat:"Biology",title:"Blotting Techniques",mnemonic:"SNOW DROP",explains:"S = Southern (DNA), N = Northern (RNA), W = Western (Protein). DROP = Detect... Memorize what each probes."},
  {cat:"Biology",title:"Spinal Cord Pathways (SAME DAVE)",mnemonic:"SAME DAVE",explains:"Sensory = Afferent, Motor = Efferent. Dorsal = Afferent, Ventral = Efferent. Sensory enters dorsal horn; motor exits ventral."},
  {cat:"Biology",title:"Male Reproductive Tract — Sperm Path",mnemonic:"SEVE(N) UP",explains:"Seminiferous tubules → Epididymis → Vas deferens → Ejaculatory duct → (Nothing) → Urethra → Penis."},
  {cat:"Biology",title:"Kidney Functions",mnemonic:"A WET BED",explains:"Acid-base balance, Water balance, Electrolyte balance, Toxin removal, Blood pressure (renin), Erythropoietin, Vitamin D activation."},
  {cat:"Biology",title:"Sarcomere Bands",mnemonic:"Z is the end of the alphabet; M is the middle of the word",explains:"Z-lines = ends of sarcomere; M-line = middle; I-band = thin filaments only (light); H-zone = thick only; A-band = ALL thick filaments (overlap); I-band and H-zone shorten on contraction; A-band stays same."},
  {cat:"Biology",title:"Bone Cells",mnemonic:"OsteoBlasts Build; OsteoClasts Chew",explains:"Blasts build bone; Clasts resorb bone. Osteocytes maintain."},
  {cat:"Biology",title:"T Cells",mnemonic:"CD4 × 2 × 2 = 8; CD8 × 1 × 1 = 8",explains:"CD4+ helper T cells = MHC II (4×2=8). CD8+ cytotoxic T cells = MHC I (8×1=8). Helper T cells 'help' activate B cells & cytotoxic T cells."},
  {cat:"Biology",title:"GI Tract Layers (inner to outer)",mnemonic:"Mucosa Sits Muscularly, Serosa Out",explains:"Mucosa → Submucosa → Muscularis externa (circular + longitudinal) → Serosa."},
  {cat:"Chem/Phys",title:"Electrochemistry: Red Cat / An Ox",mnemonic:"RED CAT / AN OX",explains:"REDuction at CAThode; OXidation at ANode. In a GALVANIC (voltaic) cell: cathode ⊕, anode ⊖. In ELECTROLYTIC: cathode ⊖, anode ⊕."},
  {cat:"Chem/Phys",title:"Redox LEO says GER / OIL RIG",mnemonic:"LEO the lion says GER; or OIL RIG",explains:"Loss of Electrons = Oxidation; Gain of Electrons = Reduction. Or Oxidation Is Loss; Reduction Is Gain."},
  {cat:"Chem/Phys",title:"Gibbs Free Energy",mnemonic:"ΔG = ΔH – TΔS",explains:"ΔG negative → spontaneous (exergonic). positive → nonspontaneous (endergonic). ΔG° = -RT ln(Keq)."},
  {cat:"Chem/Phys",title:"Ideal Gas Law",mnemonic:"PV = nRT",explains:"P = pressure, V = volume, n = moles, R = gas constant, T = Kelvin. STP: 22.4 L/mol, 273 K, 1 atm."},
  {cat:"Chem/Phys",title:"Kinematics (the BIG 5)",mnemonic:"VAT, VAX, VATX, VTAX² — memorize the 5 kinematic equations.",explains:"(1) v = v₀ + at  (2) Δx = v₀t + ½at²  (3) v² = v₀² + 2aΔx  (4) Δx = vt − ½at²  (5) Δx = ½(v₀+v)t"},
  {cat:"Chem/Phys",title:"Lens / Mirror Sign Convention",mnemonic:"For lenses: UV light; for mirrors: UV no more (IR)",explains:"Lenses: real images form on opposite side (U = object side positive, V = image side positive for real). Easier: use 1/f = 1/d₀ + 1/dᵢ with sign conventions."},
  {cat:"Chem/Phys",title:"Spectroscopy",mnemonic:"IR: peaks = functional groups; NMR: H neighbors = n+1; UV: conjugation",explains:"IR tells you what bonds (O-H broad ~3300, C=O sharp ~1700). NMR: integration = H count; splitting n+1; chemical shift = environment. Mass spec = molecular weight."},
  {cat:"Psych/Soc",title:"Six Universal Emotions (Ekman)",mnemonic:"HaFA SSD — or keyboard ASD FGH",explains:"Anger, Surprise, Disgust, Fear, Sadness (Gloom), Happiness — Anger, Sadness, Disgust, Fear, Surprise, Happy."},
  {cat:"Psych/Soc",title:"Piaget's Stages of Development",mnemonic:"SPCF (Some People Can Fly)",explains:"Sensorimotor (0-2, object permanence) → Preoperational (2-7, symbolic thought, egocentrism) → Concrete Operational (7-11, conservation, logic for concrete events) → Formal Operational (12+, abstract reasoning, moral reasoning)."},
  {cat:"Psych/Soc",title:"Kohlberg's Moral Development",mnemonic:"PCC (Pre-Conventional, Conventional, Post-Conventional)",explains:"Pre-conventional = consequences/self-interest. Conventional = social approval/law & order. Post-conventional = social contract/universal ethics."},
  {cat:"Psych/Soc",title:"Sleep Stages",mnemonic:"BATs Sleep in the Dark (B,A,T,D)",explains:"Order as you fall asleep: Beta (awake/alert) → Alpha (drowsy/relaxed) → Theta (N1/N2 light sleep) → Delta (N3 deep/SWS). REM returns via theta, with rapid eye movement and paralysis (paradoxical sleep)."},
  {cat:"Psych/Soc",title:"Attribution Theory Biases",mnemonic:"FAE + SSB + SS",explains:"Fundamental Attribution Error (blame others' traits for their behavior, not situation). Self-Serving Bias (attribute own success to self, failures to situation). Self-Serving vs Actor-Observer."},
  {cat:"Psych/Soc",title:"Freud's Psychosexual Stages",mnemonic:"Old Age People Love Grandkids",explains:"Oral (0-1), Anal (1-3), Phallic (3-6, Oedipal/Electra), Latency (6-12), Genital (12+)."},
  {cat:"Psych/Soc",title:"Reinforcement Schedules",mnemonic:"VR is the MOST resistant to extinction; FR fast, VI steady, FI scalloped",explains:"Variable Ratio (slot machines) = highest steady rate, very hard to extinguish. Fixed Ratio = high rate with post-reward pause. Fixed Interval = scalloped curve (cramming). Variable Interval = slow & steady."},
  {cat:"Psych/Soc",title:"The 4 Lobes of the Brain",mnemonic:"F-POT (Frontal, Parietal, Occipital, Temporal)",explains:"Frontal = motor, executive, speech (Broca's in LEFT). Parietal = somatosensory, spatial. Occipital = vision. Temporal = hearing, memory (hippocampus inside), Wernicke's (language comprehension)."},
  {cat:"Psych/Soc",title:"Broca's vs Wernicke's Aphasia",mnemonic:"Broca = Broken speech; Wernicke = Word salad",explains:"Broca's (left frontal): can't produce speech fluently but understands. Wernicke's (left temporal): fluent but meaningless speech, can't understand. Both = global aphasia."},
  {cat:"Research Design",title:"Types of Studies",mnemonic:"COCO",explains:"Cohort = group by exposure, observe outcome (prospective). Case-Control = group by outcome (cases vs controls), look back at exposure (retrospective). Cross-sectional = snapshot at one time."},
  {cat:"Research Design",title:"Validity Types",mnemonic:"CICI: Convergent vs Discriminant; Internal vs External",explains:"Internal validity = cause-effect sure (controlled). External validity = generalizability. Construct validity = does it measure what it claims? Convergent = correlates with similar constructs; Discriminant = doesn't correlate with different ones."}
];

// ---------- QUIZ BOWL QUESTIONS (high-yield) ----------
const QUIZ_QUESTIONS = [
  {cat:"Biochemistry",q:"Which amino acid has a pKa closest to physiological pH (~6.0), making it ideal for acid-base catalysis?",choices:["Lysine","Histidine","Aspartate","Tyrosine"],answer:1,explain:"Histidine's side-chain pKa is ~6.0, so it exists in both protonated/deprotonated forms at pH 7.4 — perfect for donating/accepting protons in enzyme active sites (e.g., catalytic triads)."},
  {cat:"Biochemistry",q:"Which two amino acids are purely ketogenic?",choices:["Leu & Lys","Val & Ile","Phe & Trp","Ala & Gly"],answer:0,explain:"Leucine and Lysine are the only strictly ketogenic amino acids. All others are glucogenic or both. Mnemonic: 'Lucy and Lila Love Keto'."},
  {cat:"Biochemistry",q:"What is the rate-limiting enzyme of glycolysis?",choices:["Hexokinase","Phosphofructokinase-1 (PFK-1)","Pyruvate kinase","Glyceraldehyde-3-P dehydrogenase"],answer:1,explain:"PFK-1 is the committed step of glycolysis, converting F6P → F-1,6-BP. It's tightly regulated (activated by AMP/F2,6-BP/insulin; inhibited by ATP/citrate/glucagon)."},
  {cat:"Biochemistry",q:"In competitive inhibition, what happens to Km and Vmax?",choices:["Km ↑, Vmax same","Km same, Vmax ↓","Km ↓, Vmax same","Km ↑, Vmax ↓"],answer:0,explain:"Competitive inhibitors bind active site → overcome by ↑[S] → Km increases (lower apparent affinity) but Vmax unchanged. Noncompetitive/allosteric → Vmax decreases, Km same."},
  {cat:"Biology",q:"Which hormone does NOT come from the anterior pituitary?",choices:["ACTH","Prolactin","Oxytocin","TSH"],answer:2,explain:"Oxytocin (and ADH) are produced in the hypothalamus but RELEASED from the posterior pituitary (the 'posterior pituitary hormones'). Remember FLAT PEG for anterior."},
  {cat:"Biology",q:"Which blotting technique detects proteins?",choices:["Southern","Northern","Western","Eastern"],answer:2,explain:"SNOW DROP: Southern = DNA, Northern = RNA, Western = Protein (uses antibodies). Eastern = post-translational modifications (rare on MCAT)."},
  {cat:"Chem/Phys",q:"Where does reduction occur in a galvanic (voltaic) cell?",choices:["Anode","Cathode","Salt bridge","Voltmeter"],answer:1,explain:"'RED CAT' = Reduction at Cathode; 'AN OX' = Oxidation at Anode. In galvanic cells, cathode is +, anode is -."},
  {cat:"Psych/Soc",q:"Which stage of sleep shows rapid eye movements, muscle paralysis, and dreaming?",choices:["N1","N2","N3 (slow-wave)","REM"],answer:3,explain:"REM (paradoxical sleep): EEG resembles awake brain (beta-like), muscles paralyzed via motor neuron inhibition, most vivid dreaming occurs here."},
  {cat:"Biology",q:"A stop codon is:",choices:["AUG","UAA","UAC","AAA"],answer:1,explain:"Stop codons: UAA (U Are Annoying), UAG (U Are Gone), UGA (U Go Away). AUG is the START codon (methionine)."},
  {cat:"Biology",q:"Which amino acid is the START codon AUG?",choices:["Alanine","Methionine","Glycine","Tyrosine"],answer:1,explain:"AUG codes for Methionine, the starting amino acid for translation in eukaryotes (formyl-Met in prokaryotes)."},
  {cat:"Biology",q:"Sensory neurons enter the spinal cord via the _______ root; motor neurons exit via the _______ root.",choices:["ventral, dorsal","dorsal, ventral","anterior, posterior","ganglion, tract"],answer:1,explain:"SAME DAVE: Sensory Afferent (dorsal/back side) — Motor Efferent (ventral/front side). Dorsal root ganglia contain sensory neuron cell bodies."},
  {cat:"Biochemistry",q:"How many NADH are produced per acetyl-CoA in the Krebs cycle?",choices:["1","2","3","4"],answer:2,explain:"3 NADH per acetyl-CoA (isocitrate DH, α-KG DH, malate DH), plus 1 FADH2 (succinate DH) and 1 GTP (succinyl-CoA synthetase) → 10 ATP equivalents total."},
  {cat:"Biology",q:"Which nucleotide base is found in RNA but not DNA?",choices:["Adenine","Cytosine","Guanine","Uracil"],answer:3,explain:"Uracil replaces Thymine in RNA. Pyrimidines: CUT (Cytosine, Uracil, Thymine) — CUT the Py."},
  {cat:"Psych/Soc",q:"Which reinforcement schedule produces the highest, most persistent response rate (most resistant to extinction)?",choices:["Fixed ratio","Fixed interval","Variable ratio","Variable interval"],answer:2,explain:"Variable ratio (e.g., slot machines) → highest, steadiest rate, hardest to extinguish. Fixed interval → scalloped curve."},
  {cat:"Psych/Soc",q:"Which lobe of the brain contains Wernicke's area (language comprehension)?",choices:["Frontal","Parietal","Occipital","Temporal"],answer:3,explain:"Wernicke's area is in the superior temporal gyrus (left hemisphere); damage → receptive aphasia (fluent but meaningless). Broca's (speech production) is in the left frontal lobe."},
  {cat:"CARS",q:"What is the approximate recommended time per CARS passage?",choices:["6 min","10 min","15 min","20 min"],answer:1,explain:"9 passages in 90 minutes = ~10 min per passage. Aim for ~3-4 min reading, 6-7 min answering questions. This is the gold standard."},
  {cat:"Biochemistry",q:"Which enzyme converts fructose-6-phosphate to fructose-1,6-bisphosphate?",choices:["Hexokinase","Phosphoglucose isomerase","PFK-1","Pyruvate kinase"],answer:2,explain:"PFK-1 catalyzes this committed step (using ATP). It is the rate-limiting enzyme of glycolysis."},
  {cat:"Biochemistry",q:"Insulin activates glycolysis primarily via which signaling molecule?",choices:["cAMP","Fructose-2,6-bisphosphate (F2,6-BP)","Acetyl-CoA","NADH"],answer:1,explain:"Insulin activates PFK-2 → produces F2,6-BP → activates PFK-1 → glycolysis ON. Glucagon inhibits PFK-2 → F2,6-BP falls → glycolysis OFF."},
  {cat:"Biochemistry",q:"Which AA is the precursor to serotonin?",choices:["Tyrosine","Tryptophan","Glutamate","Histidine"],answer:1,explain:"Tryptophan → serotonin → melatonin. Tyrosine → dopamine → NE → epi; also thyroxine & melanin."},
  {cat:"Biochemistry",q:"In the Michaelis-Menten equation, Km equals:",choices:["Vmax","[S] at Vmax","[S] at ½ Vmax","kcat"],answer:2,explain:"Km = [S] when reaction velocity is half of Vmax. Lower Km = higher substrate affinity."},
  {cat:"Biochemistry",q:"Which bond/interaction holds α-helices and β-sheets together?",choices:["Disulfide bonds","H-bonds between backbone N-H and C=O","Hydrophobic interactions","Ionic salt bridges"],answer:1,explain:"Secondary structure is stabilized by H-bonds between the polypeptide BACKBONE (not side chains). Proline disrupts helices (kink)."},
  {cat:"Biology",q:"The Hardy-Weinberg equations assume all of the following EXCEPT:",choices:["No mutation","Random mating","No natural selection","Small population size"],answer:3,explain:"HW assumes LARGE population (to prevent genetic drift), plus no mutation, random mating, no gene flow, no selection."},
  {cat:"Biology",q:"Which vitamin is essential for collagen synthesis (hydroxylation of proline/lysine)?",choices:["Vitamin A","Vitamin C","Vitamin D","Vitamin K"],answer:1,explain:"Vitamin C (ascorbic acid) is cofactor for prolyl/lysyl hydroxylase. Deficiency → scurvy (bleeding gums, poor wound healing)."},
  {cat:"Chem/Phys",q:"What is the Nernst equation (simplified at body temp) used for?",choices:["Gibbs free energy","Equilibrium potential of an ion","Fluid resistance","pH buffers"],answer:1,explain:"Eion = (61.5/z) log([outside]/[inside]). Gives the equilibrium potential for each ion. K⁺ ~ -90 mV, Na⁺ ~ +60 mV; resting potential ~ -70 mV."},
  {cat:"Psych/Soc",q:"In operant conditioning, removing a pleasant stimulus to decrease a behavior is:",choices:["Positive reinforcement","Negative reinforcement","Positive punishment","Negative punishment"],answer:3,explain:"Positive = add something; Negative = remove something. Reinforcement = ↑ behavior; Punishment = ↓ behavior. So removing a pleasant stimulus = NEGATIVE PUNISHMENT (e.g., taking away a phone)."},
  {cat:"Biochemistry",q:"What is the pI of a protein?",choices:["pH where it's most soluble","pH where net charge = 0","pH where all side chains protonated","pH at enzyme maximum"],answer:1,explain:"Isoelectric point (pI) = pH at which the amino acid/protein has net zero charge. For acidic AAs low pI (~3); basic AAs high pI (~10). At pI, protein is LEAST soluble → precipitates."},
  {cat:"Biology",q:"Which of the following is a hallmark of the lysogenic viral life cycle?",choices:["Immediate lysis","Host cell produces viral particles immediately","Integration into host genome as a prophage","RNA replication"],answer:2,explain:"Lysogenic = virus integrates into host genome (prophage/provirus) and replicates with it, dormant. Lytic = immediately produces new virions and lyses cell."},
  {cat:"Biology",q:"Which type of muscle is striated but involuntary?",choices:["Skeletal only","Cardiac and smooth","Cardiac only","Smooth only"],answer:2,explain:"Cardiac muscle is striated (sarcomeres) and involuntary. Skeletal = striated & voluntary. Smooth = non-striated & involuntary."},
  {cat:"Chem/Phys",q:"SN2 reactions proceed with what stereochemistry?",choices:["Racemization","Retention","Inversion of configuration","Carbocation intermediate"],answer:2,explain:"SN2 = backside attack → INVERSION of configuration (like an umbrella flipping). Concerted (one step). Favored in polar aprotic solvents. SN1 = carbocation → racemic."},
  {cat:"Biology",q:"Which part of the nephron is impermeable to water but actively transports salts (diluting segment)?",choices:["Proximal convoluted tubule","Descending loop of Henle","Thick ascending limb","Collecting duct"],answer:2,explain:"Thick ascending limb (diluting segment): impermeable to water but actively pumps out Na⁺/K⁺/Cl⁻. Descending limb: permeable to water only. ADH inserts aquaporins in collecting duct."}
];

// ---------- FORMULAS (Physics & Gen Chem) ----------
const FORMULAS = [
  {cat:"Kinematics",name:"Velocity (constant a)",formula:"v = v₀ + at",tip:"No displacement needed"},
  {cat:"Kinematics",name:"Displacement (no final v)",formula:"Δx = v₀t + ½at²",tip:""},
  {cat:"Kinematics",name:"No-time equation",formula:"v² = v₀² + 2aΔx",tip:"Use when no time given/needed"},
  {cat:"Kinematics",name:"Average velocity",formula:"Δx = ½(v₀+v)t",tip:""},
  {cat:"Forces",name:"Newton's 2nd Law",formula:"F = ma",tip:"1 N = 1 kg·m/s²"},
  {cat:"Forces",name:"Weight",formula:"W = mg",tip:"g ≈ 9.8 m/s²"},
  {cat:"Forces",name:"Gravitational Force",formula:"F = Gm₁m₂/r²",tip:"G = 6.67×10⁻¹¹"},
  {cat:"Forces",name:"Static friction",formula:"fₛ ≤ μₛN",tip:"Max static > kinetic"},
  {cat:"Forces",name:"Kinetic friction",formula:"fₖ = μₖN",tip:"Constant, not velocity-dependent"},
  {cat:"Forces",name:"Hooke's Law (spring)",formula:"F = -kx",tip:"k = spring constant; x = displacement"},
  {cat:"Energy",name:"Kinetic Energy",formula:"KE = ½mv²",tip:""},
  {cat:"Energy",name:"Gravitational PE",formula:"PE = mgh",tip:""},
  {cat:"Energy",name:"Elastic PE (spring)",formula:"PE = ½kx²",tip:""},
  {cat:"Energy",name:"Work",formula:"W = Fd cosθ",tip:"θ = angle between F and d"},
  {cat:"Energy",name:"Power",formula:"P = W/t = Fv",tip:"Watts = J/s"},
  {cat:"Momentum",name:"Momentum",formula:"p = mv",tip:""},
  {cat:"Momentum",name:"Impulse",formula:"J = FΔt = Δp",tip:"Change in momentum"},
  {cat:"Fluids",name:"Pressure",formula:"P = F/A",tip:"Pascals = N/m²"},
  {cat:"Fluids",name:"Hydrostatic pressure",formula:"P = ρgh",tip:"At depth h"},
  {cat:"Fluids",name:"Continuity",formula:"A₁v₁ = A₂v₂",tip:"Flow rate conserved"},
  {cat:"Fluids",name:"Bernoulli's Equation",formula:"P + ½ρv² + ρgh = const",tip:"Energy conservation for ideal fluids"},
  {cat:"Fluids",name:"Buoyant Force (Archimedes)",formula:"F_b = ρ_fluid × V_displaced × g",tip:"Weight of displaced fluid"},
  {cat:"Electrostatics",name:"Coulomb's Law",formula:"F = kq₁q₂/r²",tip:"k = 9×10⁹ N·m²/C²"},
  {cat:"Electrostatics",name:"Electric Field",formula:"E = kQ/r² = F/q",tip:"N/C or V/m"},
  {cat:"Electrostatics",name:"Electric PE",formula:"PE = kq₁q₂/r",tip:""},
  {cat:"Circuits",name:"Ohm's Law",formula:"V = IR",tip:"V = volts, I = amps, R = ohms"},
  {cat:"Circuits",name:"Resistors in series",formula:"R_total = R₁ + R₂ + ...",tip:"Same current through each"},
  {cat:"Circuits",name:"Resistors in parallel",formula:"1/R_total = 1/R₁ + 1/R₂ + ...",tip:"Same voltage across each"},
  {cat:"Circuits",name:"Power (electrical)",formula:"P = IV = I²R = V²/R",tip:""},
  {cat:"Circuits",name:"Capacitance",formula:"C = Q/V",tip:"Farads"},
  {cat:"Waves/Optics",name:"Wave speed",formula:"v = fλ",tip:"f = frequency, λ = wavelength"},
  {cat:"Waves/Optics",name:"Period",formula:"T = 1/f",tip:""},
  {cat:"Waves/Optics",name:"Snell's Law",formula:"n₁sinθ₁ = n₂sinθ₂",tip:"Refraction"},
  {cat:"Waves/Optics",name:"Lens/mirror (thin lens eq.)",formula:"1/f = 1/d₀ + 1/dᵢ",tip:"For lenses: +dᵢ = real image (opposite side)"},
  {cat:"Waves/Optics",name:"Magnification",formula:"m = -dᵢ/d₀ = hᵢ/h₀",tip:"-m = inverted; |m| > 1 = magnified"},
  {cat:"Waves/Optics",name:"Energy of a photon",formula:"E = hf = hc/λ",tip:"h = 6.626×10⁻³⁴ J·s"},
  {cat:"Thermo/GenChem",name:"Gibbs Free Energy",formula:"ΔG = ΔH – TΔS",tip:"-ΔG = spontaneous"},
  {cat:"Thermo/GenChem",name:"ΔG° and Keq",formula:"ΔG° = –RT ln(Keq)",tip:"R = 8.314 J/mol·K"},
  {cat:"Thermo/GenChem",name:"Ideal Gas Law",formula:"PV = nRT",tip:"R = 0.0821 L·atm/mol·K = 8.314 J/mol·K"},
  {cat:"Thermo/GenChem",name:"pH",formula:"pH = –log[H⁺]",tip:""},
  {cat:"Thermo/GenChem",name:"Henderson-Hasselbalch",formula:"pH = pKa + log([A⁻]/[HA])",tip:"Buffers! At [A⁻]=[HA], pH = pKa"},
  {cat:"Thermo/GenChem",name:"pKa / pKb",formula:"pKa + pKb = 14",tip:"(at 25°C)"},
  {cat:"GenChem",name:"Molarity",formula:"M = mol / L",tip:""},
  {cat:"GenChem",name:"Beer-Lambert Law",formula:"A = εbc",tip:"Absorbance; ε = molar absorptivity; b = path length; c = concentration"},
];

// ---------- CARS STRATEGIES ----------
const CARS_TIPS = [
  {title:"⏱️ The 10-Minute Rule",body:"9 passages in 90 minutes = ~10 minutes per passage. Allocate ~3–4 minutes reading and 6–7 minutes on questions. Check the clock after EVERY passage, not every third."},
  {title:"🎯 Read for Argument, Not Facts",body:"CARS tests your understanding of the author's THESIS and tone, not memorization of details. Identify the main point in the first 2 paragraphs and the author's stance (positive, negative, neutral, qualified)."},
  {title:"✏️ Highlight Sparingly",body:"Mark only the thesis, key transitions (however, therefore, but), and author opinions. Do NOT highlight facts, examples, or lists — they clog your 'map'."},
  {title:"🚩 Flag Hard Questions",body:"If you're stuck > 90 seconds on a question, flag and move on. Come back later with fresh eyes. A question you spend 3 min on costs you another whole passage later."},
  {title:"❌ Eliminate Before You Choose",body:"Train yourself to cross out TWO obviously wrong answers in under 30 seconds. This leaves you choosing between 2 (easier) instead of 4 (paralyzing)."},
  {title:"🔄 Practice Every Single Day",body:"Do at least 1-2 CARS passages daily (Jack Westin daily passage is free). Consistency beats cramming. Do deep review — for every wrong answer, ask: WHY was I wrong?"},
  {title:"🧠 Don't Bring Outside Knowledge",body:"CARS answers must be supported by the PASSAGE ONLY. If something isn't in the passage, even if it's factually true IRL, it's not the answer."},
  {title:"🧭 Reset Between Passages",body:"Take 5 seconds between passages: close eyes, deep breath. Don't let a hard philosophy passage bleed into an easier sociology passage."},
];

// ---------- SAMPLE CARS PASSAGES ----------
const CARS_PASSAGES = [
  {
    title:"The Ethics of Artificial Intelligence in Medicine",
    author:"Adapted from a contemporary bioethics essay",
    text:`The increasing integration of artificial intelligence into clinical medicine has sparked fierce debate among ethicists, clinicians, and patients alike. Proponents argue that AI—particularly machine learning algorithms trained on vast datasets of medical records—can detect patterns invisible to human clinicians, leading to earlier diagnoses, fewer medical errors, and more personalized treatment plans. A 2019 study in Nature Medicine, for instance, found that a deep-learning model outperformed radiologists in detecting breast cancer from mammograms, yielding fewer false positives and false negatives.\n\nCritics, however, raise three principal concerns. The first is opacity: many modern AI systems, particularly deep neural networks, function as "black boxes," providing predictions without articulating the reasoning that led to them. In a field where clinicians are ethically and legally required to justify their decisions, this opacity undermines accountability. If an AI recommends a treatment that causes harm, who is responsible—the programmer, the hospital, the clinician who acted on the recommendation? The law has not yet settled this question.\n\nThe second concern is bias. Machine learning models trained on historical data risk perpetuating—indeed amplifying—the inequities already present in medicine. If an algorithm is trained primarily on data from wealthy, white patients, it may perform poorly for patients from underrepresented groups, widening rather than narrowing health disparities.\n\nThe third concern is the erosion of the patient-clinician relationship. Medicine has always been as much an art as a science; empathy, trust, and shared decision-making are central to healing. If clinicians increasingly defer to algorithmic recommendations, critics worry they will cease to treat patients as whole persons, reducing them instead to collections of data points.\n\nProponents do not dismiss these concerns but argue that they are arguments for better regulation and better design, not for abandoning the technology. Just as the stethoscope did not replace the physician but extended her senses, they argue, AI should be viewed as a tool—one that, properly deployed, could free clinicians to spend more time on the human dimensions of care rather than less. The question, then, is not whether AI will enter medicine but how.`,
    questions:[
      {q:"The author's central thesis is that:",choices:["AI will inevitably replace many clinical functions.","AI in medicine raises serious concerns that warrant careful attention but are not insurmountable.","The dangers of medical AI outweigh its potential benefits.","Bias in AI algorithms is an unsolvable technical problem."],answer:1},
      {q:"The author mentions the Nature Medicine study primarily to:",choices:["Prove that AI is clinically superior to human doctors.","Illustrate that legitimate evidence supports AI's potential benefits.","Argue that radiology is the easiest field for AI to enter.","Criticize radiologists for missing cancers."],answer:1},
      {q:"According to the passage, the 'black box' problem refers to:",choices:["The high cost of implementing AI in hospitals.","AI systems providing predictions without explaining their reasoning.","The use of patient data without consent.","Clinicians refusing to adopt new technologies."],answer:1},
      {q:"With which of the following statements would the author most likely agree?",choices:["AI should be banned from clinical use until all legal questions are resolved.","The stethoscope analogy shows that tools can enhance rather than replace clinical judgment.","Historical bias in data cannot be corrected.","Patients prefer AI diagnoses over human ones."],answer:1},
      {q:"The author's tone can best be described as:",choices:["Stridently opposed to AI in medicine","Uncritically enthusiastic about medical AI","Measured and analytical, acknowledging both potential and risks","Dismissive of critics' concerns"],answer:2},
    ]
  },
  {
    title:"On the Nature of Scientific Revolutions",
    author:"Adapted from philosophy of science literature",
    text:`Thomas Kuhn's 1962 work The Structure of Scientific Revolutions fundamentally challenged the prevailing view of science as a steady, cumulative march toward truth. Kuhn argued that science proceeds not through gradual accretion of facts but through a series of dramatic paradigm shifts—intellectual upheavals in which one worldview replaces another.\n\nDuring periods of "normal science," researchers work within an accepted paradigm—a framework of theories, methods, and assumptions that define what questions are worth asking and what counts as a valid answer. Normal science, Kuhn observed, is inherently conservative; it does not aim to produce novelty but to "mop up" unresolved puzzles within the existing framework. When anomalies accumulate that resist explanation within the paradigm—observations that the framework simply cannot accommodate—a crisis emerges.\n\nIf the crisis is sufficiently acute and a compelling alternative paradigm emerges, a scientific revolution occurs. Kuhn famously compared paradigm shifts to gestalt switches: just as one can flip between seeing a duck and a rabbit in the famous optical illusion, scientists experiencing a revolution see the world differently—and crucially, Kuhn insisted, proponents of competing paradigms practice their trades in different worlds. The new paradigm does not simply add to the old; it redefines the terms, the methods, and even the standards by which science is judged.\n\nCritics have objected that this account borders on relativism. If paradigms are incommensurable—if there is no neutral standard by which to judge them—how can we say science progresses toward truth? Kuhn's later writings walked back some of the more radical implications, suggesting that science does progress, but not in the linear fashion commonly assumed. Rather, progress is akin to evolution: a process driven by problem-solving, in which later theories are better not because they approximate "truth" in any metaphysical sense, but because they solve more problems, or different problems, more effectively than their predecessors.\n\nThe implications extend beyond the history of science. Kuhn's framework has been invoked to explain transformations in fields as diverse as economics, political theory, and even literary criticism. Whether or not one accepts Kuhn's strong claims about incommensurability, his work permanently changed how we think about the messy, human process by which knowledge advances.`,
    questions:[
      {q:"The primary purpose of the passage is to:",choices:["Argue that Kuhn's theory has been disproven.","Explain Kuhn's theory of scientific revolutions and its significance.","Compare Kuhn's views to those of Einstein.","Show that science progresses cumulatively."],answer:1},
      {q:"According to Kuhn, 'normal science' is primarily characterized by:",choices:["Frequent paradigm shifts.","Puzzle-solving within an accepted framework.","Rejection of all prior theories.","Purely random experimentation."],answer:1},
      {q:"The author uses the duck-rabbit gestalt analogy primarily to illustrate:",choices:["The unreliability of optical illusions in scientific study.","How paradigm shifts change perception of phenomena fundamentally.","Why scientists cannot agree on basic facts.","The difference between physics and biology."],answer:1},
      {q:"Critics of Kuhn worry that his theory implies:",choices:["Science progresses too quickly.","Scientists are not intelligent enough.","There may be no neutral standard for judging scientific theories, implying relativism.","Normal science is useless."],answer:2},
      {q:"In Kuhn's evolved view (as described), scientific progress is most analogous to:",choices:["A straight line toward ultimate truth.","Biological evolution—problem-solving driven, without a fixed endpoint of 'truth'.","A series of random events with no pattern.","The work of a single genius."],answer:1},
    ]
  }
];

// ---------- ENCOURAGEMENT QUOTES (halal, no love messages) ----------
const QUOTES = [
  {text:"Indeed, with hardship comes ease.",src:"— Qur'an 94:6"},
  {text:"Allah does not burden a soul beyond that it can bear.",src:"— Qur'an 2:286"},
  {text:"And whoever relies upon Allah, then He is sufficient for him.",src:"— Qur'an 65:3"},
  {text:"So remember Me; I will remember you.",src:"— Qur'an 2:152"},
  {text:"The seeker of knowledge is on the path of Allah until they return.",src:"— Hadith, Sunan al-Tirmidhi"},
  {text:"Seek knowledge from the cradle to the grave.",src:"— Hadith (widely attributed)"},
  {text:"The best among you are those who learn the Qur'an and teach it.",src:"— Hadith, Sahih al-Bukhari"},
  {text:"Knowledge from which no benefit is derived is like a treasure from which nothing is spent in the cause of Allah.",src:"— Hadith"},
  {text:"Success is not final, failure is not fatal: it is the courage to continue that counts.",src:"— Winston Churchill"},
  {text:"The secret of getting ahead is getting started.",src:"— Mark Twain"},
  {text:"The expert in anything was once a beginner.",src:"— Helen Hayes"},
  {text:"Discipline is the bridge between goals and accomplishment.",src:"— Jim Rohn"},
  {text:"You don't have to be great to start, but you have to start to be great.",src:"— Zig Ziglar"},
  {text:"Push yourself because no one else will do it for you.",src:"— Motivational proverb"},
  {text:"Small daily improvements are the key to staggering long-term results.",src:"— Robin Sharma"},
  {text:"Tough times never last, but tough people do.",src:"— Robert H. Schuller"},
  {text:"Trust the process. Your hardest times often lead to the greatest moments of your life.",src:"— Roy T. Bennett"},
  {text:"Medicine is a science of uncertainty and an art of probability.",src:"— William Osler"},
  {text:"Wherever the art of medicine is loved, there is also a love of humanity.",src:"— Hippocrates"},
  {text:"He who studies medicine without books sails an uncharted sea, but he who studies medicine without patients does not go to sea at all.",src:"— William Osler"},
  {text:"Every expert was once a beginner. Every 528 was once a diagnostic score.",src:"— MCAT proverb"},
  {text:"You are capable of more than you know.",src:"— E.O. Wilson"},
  {text:"The future belongs to those who believe in the beauty of their dreams.",src:"— Eleanor Roosevelt"}
];

// ---------- PSYCH/SOC HIGH-YIELD TERMS ----------
const PSYCH_TERMS = [
  {term:"Functionalism (James/Durkheim)",def:"Society as interconnected parts working together to maintain equilibrium; each institution serves a function."},
  {term:"Conflict Theory (Marx/Weber)",def:"Society as competition for limited resources; inequality (class, power) drives social change."},
  {term:"Symbolic Interactionism (Mead/Cooley)",def:"Society constructed through everyday interactions and shared meanings/symbols (language, gestures)."},
  {term:"Social Constructionism",def:"Reality is socially created (e.g., money, race categories, gender roles)."},
  {term:"Rational Choice Theory",def:"Individuals make decisions by weighing costs/benefits to maximize self-interest."},
  {term:"Social Exchange Theory",def:"Social interactions are transactions aimed at maximizing rewards and minimizing costs."},
  {term:"Looking-glass self (Cooley)",def:"Our self-concept shaped by how we think others perceive us."},
  {term:"Social facilitation",def:"Presence of others improves performance on SIMPLE/well-learned tasks, impairs on difficult ones."},
  {term:"Social loafing",def:"Individuals exert less effort in a group than alone (tug-of-war effect)."},
  {term:"Groupthink (Janis)",def:"Desire for group harmony overrides critical thinking, leading to bad decisions (symptoms: illusion of invulnerability, pressure to conform)."},
  {term:"Group polarization",def:"Group discussion shifts members toward more extreme views than they held individually."},
  {term:"Deindividuation",def:"Loss of self-awareness/restraint in group situations (mob behavior; online trolling)."},
  {term:"Bystander effect",def:"Individuals less likely to help when others are present (diffusion of responsibility)."},
  {term:"Conformity (Asch)",def:"Adjusting behavior/thoughts to match group norm (line-judgment experiments)."},
  {term:"Obedience (Milgram)",def:"Following orders from authority (shock 'learner' experiment — 65% went to max voltage)."},
  {term:"Cognitive Dissonance (Festinger)",def:"Discomfort from holding conflicting beliefs/behavior → motivates attitude change."},
  {term:"Fundamental Attribution Error",def:"Over-attributing others' behavior to internal traits (e.g., 'they're rude') while underweighting situation."},
  {term:"Self-serving bias",def:"Attribute own success to internal factors, failures to external ones."},
  {term:"Stereotype threat",def:"Risk of confirming a negative group stereotype impairs performance."},
  {term:"Self-fulfilling prophecy (Rosenthal)",def:"Expectations about a person/group influence behavior in ways that make those expectations come true (Pygmalion effect)."},
  {term:"Classical conditioning (Pavlov)",def:"Learning via association of neutral stimulus with unconditioned stimulus to produce conditioned response."},
  {term:"Operant conditioning (Skinner)",def:"Learning via consequences: reinforcement ↑, punishment ↓ behavior."},
  {term:"Observational learning (Bandura)",def:"Learning by watching others (Bobo doll experiment)."},
  {term:"Yerkes-Dodson Law",def:"Performance peaks at moderate arousal; too low or too high = worse."},
  {term:"Broca's area",def:"Left frontal lobe; speech PRODUCTION (broken speech aphasia)."},
  {term:"Wernicke's area",def:"Left temporal lobe; language COMPREHENSION (word salad aphasia)."},
];

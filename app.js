/* ============================================
   app.js — Simulasi Hukum Mendel
   MahedaLabs
   ============================================ */

// ============================================
// 1. DATA DEFINITIONS
// ============================================

const ORGANISMS = [
  {
    id: "semangka",
    name: "Semangka",
    emoji: "🍉",
    latin: "Citrullus lanatus",
    traits: [
      {
        id: "bentuk_buah",
        name: "Bentuk Buah",
        allele: { dominant: "B", recessive: "b" },
        dominanceType: "complete",
        phenotypes: {
          dominant:     { label: "Bulat",    svgKey: "watermelonRound" },
          heterozygous: { label: "Bulat",    svgKey: "watermelonRound" },
          recessive:    { label: "Lonjong",  svgKey: "watermelonOval" },
        },
      },
      {
        id: "jumlah_biji",
        name: "Jumlah Biji",
        allele: { dominant: "S", recessive: "s" },
        dominanceType: "complete",
        phenotypes: {
          dominant:     { label: "Sedikit Biji", svgKey: "watermelonFewSeeds" },
          heterozygous: { label: "Sedikit Biji", svgKey: "watermelonFewSeeds" },
          recessive:    { label: "Banyak Biji",  svgKey: "watermelonManySeeds" },
        },
      },
    ],
  },
  {
    id: "antirrhinum",
    name: "Antirrhinum",
    emoji: "🌸",
    latin: "Antirrhinum majus",
    traits: [
      {
        id: "warna_bunga",
        name: "Warna Bunga",
        allele: { dominant: "M", recessive: "m" },
        dominanceType: "incomplete",
        phenotypes: {
          dominant:     { label: "Merah",  svgKey: "snapdragonRed" },
          heterozygous: { label: "Pink",   svgKey: "snapdragonPink" },
          recessive:    { label: "Putih",  svgKey: "snapdragonWhite" },
        },
      },
    ],
  },
];

// ============================================
// 2. APPLICATION STATE
// ============================================

const state = {
  organism: null,        // currently selected organism object
  trait: null,           // currently selected trait object
  parent1Index: 0,       // genotype index for parent 1 (0, 1, 2)
  parent2Index: 2,       // genotype index for parent 2 (0, 1, 2)
};

// ============================================
// 3. SVG GENERATORS
// ============================================

const SVG = {
  /* ---- Watermelon: Round (Bulat) ---- */
  watermelonRound() {
    return `
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <!-- Shadow -->
        <ellipse cx="60" cy="112" rx="32" ry="5" fill="rgba(0,0,0,0.08)"/>
        <!-- Body base (dark outline) -->
        <circle cx="60" cy="58" r="46" fill="#15803d"/>
        <!-- Body main -->
        <circle cx="60" cy="58" r="44" fill="#22c55e"/>
        <!-- Body highlight zone -->
        <ellipse cx="46" cy="42" rx="28" ry="22" fill="#4ade80" opacity="0.5"/>
        <!-- Stripes — organic curves -->
        <path d="M 20,28 C 28,42 36,54 22,78" stroke="#15803d" stroke-width="5" fill="none" opacity="0.35" stroke-linecap="round"/>
        <path d="M 34,14 C 40,34 46,54 36,92" stroke="#15803d" stroke-width="4.5" fill="none" opacity="0.30" stroke-linecap="round"/>
        <path d="M 60,12 C 60,34 60,56 60,104" stroke="#15803d" stroke-width="4" fill="none" opacity="0.25" stroke-linecap="round"/>
        <path d="M 86,14 C 80,34 74,54 84,92" stroke="#15803d" stroke-width="4.5" fill="none" opacity="0.30" stroke-linecap="round"/>
        <path d="M 100,28 C 92,42 84,54 98,78" stroke="#15803d" stroke-width="5" fill="none" opacity="0.35" stroke-linecap="round"/>
        <!-- Shine -->
        <ellipse cx="40" cy="34" rx="12" ry="8" fill="white" opacity="0.18" transform="rotate(-22,40,34)"/>
        <!-- Stem -->
        <path d="M 58,14 C 56,9 53,5 48,3" stroke="#78350f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- Tendril -->
        <path d="M 62,14 C 66,9 70,7 72,10 C 74,14 70,16 67,13" stroke="#22c55e" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <!-- Leaf hint -->
        <path d="M 48,3 C 44,5 42,3 40,5" stroke="#16a34a" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>`;
  },

  /* ---- Watermelon: Oval (Lonjong) ---- */
  watermelonOval() {
    return `
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="60" cy="110" rx="22" ry="4" fill="rgba(0,0,0,0.07)"/>
        <ellipse cx="60" cy="58" rx="28" ry="46" fill="#15803d"/>
        <ellipse cx="60" cy="58" rx="26" ry="44" fill="#22c55e"/>
        <ellipse cx="50" cy="40" rx="18" ry="26" fill="#4ade80" opacity="0.45"/>
        <path d="M 38,18 C 44,36 46,56 40,90" stroke="#15803d" stroke-width="4" fill="none" opacity="0.30" stroke-linecap="round"/>
        <path d="M 50,8  C 54,28 56,54 52,100" stroke="#15803d" stroke-width="3.5" fill="none" opacity="0.25" stroke-linecap="round"/>
        <path d="M 60,6  C 60,28 60,54 60,102" stroke="#15803d" stroke-width="3" fill="none" opacity="0.22" stroke-linecap="round"/>
        <path d="M 70,8  C 66,28 64,54 68,100" stroke="#15803d" stroke-width="3.5" fill="none" opacity="0.25" stroke-linecap="round"/>
        <path d="M 82,18 C 76,36 74,56 80,90" stroke="#15803d" stroke-width="4" fill="none" opacity="0.30" stroke-linecap="round"/>
        <ellipse cx="46" cy="30" rx="6" ry="10" fill="white" opacity="0.16" transform="rotate(-8,46,30)"/>
        <path d="M 58,14 C 56,8 53,4 48,2" stroke="#78350f" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 62,14 C 66,9 69,7 71,10" stroke="#22c55e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      </svg>`;
  },

  /* ---- Watermelon: Cross-section, Few Seeds ---- */
  watermelonFewSeeds() {
    return `
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="60" cy="114" rx="40" ry="4" fill="rgba(0,0,0,0.06)"/>
        <!-- Outer rind -->
        <circle cx="60" cy="58" r="48" fill="#16a34a"/>
        <!-- Inner rind (white-green) -->
        <circle cx="60" cy="58" r="44" fill="#bbf7d0"/>
        <!-- Flesh -->
        <circle cx="60" cy="58" r="38" fill="#ef4444"/>
        <!-- Flesh highlight -->
        <ellipse cx="48" cy="44" rx="22" ry="16" fill="#f87171" opacity="0.4"/>
        <!-- Center -->
        <circle cx="60" cy="58" r="10" fill="#fca5a5" opacity="0.45"/>
        <!-- Flesh texture lines -->
        <line x1="60" y1="22" x2="60" y2="94" stroke="#dc2626" stroke-width="0.5" opacity="0.15"/>
        <line x1="24" y1="58" x2="96" y2="58" stroke="#dc2626" stroke-width="0.5" opacity="0.15"/>
        <!-- Seeds — teardrop shapes -->
        <path d="M 42,42 Q 39,37 42,33 Q 45,37 42,42 Z" fill="#1e293b"/>
        <path d="M 70,38 Q 67,33 70,29 Q 73,33 70,38 Z" fill="#1e293b"/>
        <path d="M 52,70 Q 49,65 52,61 Q 55,65 52,70 Z" fill="#1e293b" transform="rotate(12,52,70)"/>
        <!-- Seed highlights -->
        <ellipse cx="41.5" cy="36" rx="1" ry="1.5" fill="white" opacity="0.25"/>
        <ellipse cx="69.5" cy="32" rx="1" ry="1.5" fill="white" opacity="0.25"/>
        <ellipse cx="51.5" cy="64" rx="1" ry="1.5" fill="white" opacity="0.25"/>
      </svg>`;
  },

  /* ---- Watermelon: Cross-section, Many Seeds ---- */
  watermelonManySeeds() {
    return `
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="60" cy="114" rx="40" ry="4" fill="rgba(0,0,0,0.06)"/>
        <circle cx="60" cy="58" r="48" fill="#16a34a"/>
        <circle cx="60" cy="58" r="44" fill="#bbf7d0"/>
        <circle cx="60" cy="58" r="38" fill="#ef4444"/>
        <ellipse cx="48" cy="44" rx="22" ry="16" fill="#f87171" opacity="0.4"/>
        <circle cx="60" cy="58" r="10" fill="#fca5a5" opacity="0.45"/>
        <line x1="60" y1="22" x2="60" y2="94" stroke="#dc2626" stroke-width="0.5" opacity="0.15"/>
        <line x1="24" y1="58" x2="96" y2="58" stroke="#dc2626" stroke-width="0.5" opacity="0.15"/>
        <!-- Many seeds -->
        <path d="M 36,36 Q 33,31 36,27 Q 39,31 36,36 Z" fill="#1e293b"/>
        <path d="M 56,30 Q 53,25 56,21 Q 59,25 56,30 Z" fill="#1e293b"/>
        <path d="M 74,36 Q 71,31 74,27 Q 77,31 74,36 Z" fill="#1e293b"/>
        <path d="M 40,54 Q 37,49 40,45 Q 43,49 40,54 Z" fill="#1e293b"/>
        <path d="M 72,52 Q 69,47 72,43 Q 75,47 72,52 Z" fill="#1e293b"/>
        <path d="M 34,70 Q 31,65 34,61 Q 37,65 34,70 Z" fill="#1e293b" transform="rotate(10,34,70)"/>
        <path d="M 56,72 Q 53,67 56,63 Q 59,67 56,72 Z" fill="#1e293b" transform="rotate(-8,56,72)"/>
        <path d="M 76,66 Q 73,61 76,57 Q 79,61 76,66 Z" fill="#1e293b" transform="rotate(5,76,66)"/>
        <!-- Seed highlights -->
        <ellipse cx="35.5" cy="30" rx="1" ry="1.5" fill="white" opacity="0.22"/>
        <ellipse cx="55.5" cy="24" rx="1" ry="1.5" fill="white" opacity="0.22"/>
        <ellipse cx="73.5" cy="30" rx="1" ry="1.5" fill="white" opacity="0.22"/>
        <ellipse cx="39.5" cy="48" rx="1" ry="1.5" fill="white" opacity="0.22"/>
        <ellipse cx="71.5" cy="46" rx="1" ry="1.5" fill="white" opacity="0.22"/>
        <ellipse cx="33.5" cy="64" rx="1" ry="1.5" fill="white" opacity="0.22"/>
        <ellipse cx="55.5" cy="66" rx="1" ry="1.5" fill="white" opacity="0.22"/>
        <ellipse cx="75.5" cy="60" rx="1" ry="1.5" fill="white" opacity="0.22"/>
      </svg>`;
  },

  /* ---- Snapdragon: Red ---- */
  snapdragonRed() {
    return `
      <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <!-- Stem -->
        <path d="M 50,78 C 49,88 50,98 50,112" stroke="#16a34a" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- Leaves -->
        <path d="M 49,90 C 38,84 26,86 24,92 C 30,90 38,88 49,90" fill="#4ade80" stroke="#16a34a" stroke-width="0.8"/>
        <path d="M 51,100 C 62,94 74,96 76,102 C 70,100 62,98 51,100" fill="#4ade80" stroke="#16a34a" stroke-width="0.8"/>
        <!-- Leaf veins -->
        <line x1="49" y1="90" x2="30" y2="88" stroke="#16a34a" stroke-width="0.5" opacity="0.5"/>
        <line x1="51" y1="100" x2="70" y2="98" stroke="#16a34a" stroke-width="0.5" opacity="0.5"/>
        <!-- Calyx -->
        <path d="M 42,74 L 46,66 L 50,72 L 54,66 L 58,74" fill="#16a34a" stroke="#15803d" stroke-width="0.8"/>
        <!-- Upper petals (2 fused) -->
        <path d="M 50,10 C 30,16 20,32 26,50 L 50,40 L 74,50 C 80,32 70,16 50,10 Z" fill="#dc2626"/>
        <path d="M 50,10 C 30,16 20,32 26,50 L 50,40 Z" fill="#b91c1c" opacity="0.2"/>
        <!-- Left petal -->
        <path d="M 24,40 C 10,46 8,62 18,74 C 24,66 26,56 26,50 Z" fill="#ef4444"/>
        <!-- Right petal -->
        <path d="M 76,40 C 90,46 92,62 82,74 C 76,66 74,56 74,50 Z" fill="#ef4444"/>
        <!-- Lower left petal -->
        <path d="M 22,62 C 18,70 26,80 42,76 C 34,72 26,66 22,62 Z" fill="#f87171"/>
        <!-- Lower right petal -->
        <path d="M 78,62 C 82,70 74,80 58,76 C 66,72 74,66 78,62 Z" fill="#f87171"/>
        <!-- Petal veins -->
        <path d="M 50,18 L 50,38" stroke="#991b1b" stroke-width="0.6" opacity="0.2" fill="none"/>
        <path d="M 16,52 L 26,50" stroke="#991b1b" stroke-width="0.5" opacity="0.2" fill="none"/>
        <path d="M 84,52 L 74,50" stroke="#991b1b" stroke-width="0.5" opacity="0.2" fill="none"/>
        <!-- Center throat -->
        <ellipse cx="50" cy="48" rx="10" ry="12" fill="#fbbf24"/>
        <ellipse cx="50" cy="48" rx="5" ry="7" fill="#f59e0b"/>
        <circle cx="50" cy="46" r="2" fill="#d97706" opacity="0.5"/>
      </svg>`;
  },

  /* ---- Snapdragon: Pink ---- */
  snapdragonPink() {
    return `
      <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50,78 C 49,88 50,98 50,112" stroke="#16a34a" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 49,90 C 38,84 26,86 24,92 C 30,90 38,88 49,90" fill="#4ade80" stroke="#16a34a" stroke-width="0.8"/>
        <path d="M 51,100 C 62,94 74,96 76,102 C 70,100 62,98 51,100" fill="#4ade80" stroke="#16a34a" stroke-width="0.8"/>
        <line x1="49" y1="90" x2="30" y2="88" stroke="#16a34a" stroke-width="0.5" opacity="0.5"/>
        <line x1="51" y1="100" x2="70" y2="98" stroke="#16a34a" stroke-width="0.5" opacity="0.5"/>
        <path d="M 42,74 L 46,66 L 50,72 L 54,66 L 58,74" fill="#16a34a" stroke="#15803d" stroke-width="0.8"/>
        <path d="M 50,10 C 30,16 20,32 26,50 L 50,40 L 74,50 C 80,32 70,16 50,10 Z" fill="#ec4899"/>
        <path d="M 50,10 C 30,16 20,32 26,50 L 50,40 Z" fill="#be185d" opacity="0.2"/>
        <path d="M 24,40 C 10,46 8,62 18,74 C 24,66 26,56 26,50 Z" fill="#f472b6"/>
        <path d="M 76,40 C 90,46 92,62 82,74 C 76,66 74,56 74,50 Z" fill="#f472b6"/>
        <path d="M 22,62 C 18,70 26,80 42,76 C 34,72 26,66 22,62 Z" fill="#f9a8d4"/>
        <path d="M 78,62 C 82,70 74,80 58,76 C 66,72 74,66 78,62 Z" fill="#f9a8d4"/>
        <path d="M 50,18 L 50,38" stroke="#9d174d" stroke-width="0.6" opacity="0.2" fill="none"/>
        <path d="M 16,52 L 26,50" stroke="#9d174d" stroke-width="0.5" opacity="0.2" fill="none"/>
        <path d="M 84,52 L 74,50" stroke="#9d174d" stroke-width="0.5" opacity="0.2" fill="none"/>
        <ellipse cx="50" cy="48" rx="10" ry="12" fill="#fbbf24"/>
        <ellipse cx="50" cy="48" rx="5" ry="7" fill="#f59e0b"/>
        <circle cx="50" cy="46" r="2" fill="#d97706" opacity="0.5"/>
      </svg>`;
  },

  /* ---- Snapdragon: White ---- */
  snapdragonWhite() {
    return `
      <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50,78 C 49,88 50,98 50,112" stroke="#16a34a" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 49,90 C 38,84 26,86 24,92 C 30,90 38,88 49,90" fill="#4ade80" stroke="#16a34a" stroke-width="0.8"/>
        <path d="M 51,100 C 62,94 74,96 76,102 C 70,100 62,98 51,100" fill="#4ade80" stroke="#16a34a" stroke-width="0.8"/>
        <line x1="49" y1="90" x2="30" y2="88" stroke="#16a34a" stroke-width="0.5" opacity="0.5"/>
        <line x1="51" y1="100" x2="70" y2="98" stroke="#16a34a" stroke-width="0.5" opacity="0.5"/>
        <path d="M 42,74 L 46,66 L 50,72 L 54,66 L 58,74" fill="#16a34a" stroke="#15803d" stroke-width="0.8"/>
        <path d="M 50,10 C 30,16 20,32 26,50 L 50,40 L 74,50 C 80,32 70,16 50,10 Z" fill="#ffffff" stroke="#d1d5db" stroke-width="1.5"/>
        <path d="M 50,10 C 30,16 20,32 26,50 L 50,40 Z" fill="#f3f4f6" opacity="0.5"/>
        <path d="M 24,40 C 10,46 8,62 18,74 C 24,66 26,56 26,50 Z" fill="#f9fafb" stroke="#d1d5db" stroke-width="1.2"/>
        <path d="M 76,40 C 90,46 92,62 82,74 C 76,66 74,56 74,50 Z" fill="#f9fafb" stroke="#d1d5db" stroke-width="1.2"/>
        <path d="M 22,62 C 18,70 26,80 42,76 C 34,72 26,66 22,62 Z" fill="#ffffff" stroke="#d1d5db" stroke-width="1"/>
        <path d="M 78,62 C 82,70 74,80 58,76 C 66,72 74,66 78,62 Z" fill="#ffffff" stroke="#d1d5db" stroke-width="1"/>
        <path d="M 50,18 L 50,38" stroke="#9ca3af" stroke-width="0.6" opacity="0.25" fill="none"/>
        <path d="M 16,52 L 26,50" stroke="#9ca3af" stroke-width="0.5" opacity="0.25" fill="none"/>
        <path d="M 84,52 L 74,50" stroke="#9ca3af" stroke-width="0.5" opacity="0.25" fill="none"/>
        <ellipse cx="50" cy="48" rx="10" ry="12" fill="#fbbf24"/>
        <ellipse cx="50" cy="48" rx="5" ry="7" fill="#f59e0b"/>
        <circle cx="50" cy="46" r="2" fill="#d97706" opacity="0.5"/>
      </svg>`;
  },
};

function getSvg(svgKey) {
  return SVG[svgKey] ? SVG[svgKey]() : "";
}

// ============================================
// 4. CROSSING / GENETIC LOGIC
// ============================================

/**
 * Return genotype options for a given trait.
 * Index 0 = Homozygous Dominan, 1 = Heterozygous, 2 = Homozygous Resesif.
 */
function getGenotypeOptions(trait) {
  const d = trait.allele.dominant;
  const r = trait.allele.recessive;
  return [
    { genotype: d + d, type: "dominant",     description: "Homozygous Dominan" },
    { genotype: d + r, type: "heterozygous", description: "Heterozygous" },
    { genotype: r + r, type: "recessive",    description: "Homozygous Resesif" },
  ];
}

/** Split a genotype into two gamete alleles. */
function getGametes(genotype) {
  return [genotype[0], genotype[1]];
}

/** Sort two alleles so the dominant (uppercase) comes first. */
function sortAlleles(a, b) {
  const aIsDom = a === a.toUpperCase();
  const bIsDom = b === b.toUpperCase();
  if (aIsDom && !bIsDom) return a + b;
  if (bIsDom && !aIsDom) return b + a;
  return a + b;
}

/**
 * Perform a monohybrid cross. Returns an object with:
 *   - punnett: 2D array of genotype strings
 *   - gametes1, gametes2: arrays of allele strings
 *   - offspring: flat array of 4 genotype strings
 */
function performCross(genotype1, genotype2) {
  const gametes1 = getGametes(genotype1);
  const gametes2 = getGametes(genotype2);

  const punnett = [];
  const offspring = [];

  for (const g1 of gametes1) {
    const row = [];
    for (const g2 of gametes2) {
      const combined = sortAlleles(g1, g2);
      row.push(combined);
      offspring.push(combined);
    }
    punnett.push(row);
  }

  return { punnett, gametes1, gametes2, offspring };
}

/** Determine the genotype category ("dominant", "heterozygous", "recessive"). */
function getGenotypeCategory(genotype, trait) {
  const d = trait.allele.dominant;
  if (genotype === d + d) return "dominant";
  if (genotype[0] === d && genotype[1] === trait.allele.recessive) return "heterozygous";
  if (genotype[0] === trait.allele.recessive && genotype[1] === d) return "heterozygous";
  return "recessive";
}

/** Get phenotype info (label + svgKey) for a given genotype and trait. */
function getPhenotypeInfo(genotype, trait) {
  const category = getGenotypeCategory(genotype, trait);
  return trait.phenotypes[category];
}

/**
 * Calculate genotype and phenotype ratios from an offspring array.
 * Returns { genoRatios: Map, phenoRatios: Map }
 */
function calculateRatios(offspring, trait) {
  const genoCounts = new Map();
  const phenoCounts = new Map();

  // Build a phenotype-label → category map from the trait definition
  // so that the dominant phenotype always uses "dom" color, etc.
  const phenoCategoryMap = {};
  for (const [cat, info] of Object.entries(trait.phenotypes)) {
    if (!phenoCategoryMap[info.label]) {
      phenoCategoryMap[info.label] = cat;
    }
  }

  for (const g of offspring) {
    genoCounts.set(g, (genoCounts.get(g) || 0) + 1);

    const pheno = getPhenotypeInfo(g, trait);
    const key = pheno.label;
    if (!phenoCounts.has(key)) {
      phenoCounts.set(key, { count: 0, category: phenoCategoryMap[key] });
    }
    phenoCounts.get(key).count += 1;
  }

  return { genoCounts, phenoCounts };
}

// ============================================
// 5. DOM REFERENCES
// ============================================

const dom = {
  stepOrganism: document.getElementById("step-organism"),
  stepCross:    document.getElementById("step-cross"),
  organismGrid: document.getElementById("organism-grid"),
  traitTabs:    document.getElementById("trait-tabs"),
  display1:     document.getElementById("display-1"),
  display2:     document.getElementById("display-2"),
  crossSummary: document.getElementById("cross-summary"),
  crossTitle:   document.getElementById("cross-title"),
  btnBack:      document.getElementById("btn-back"),
  btnCross:     document.getElementById("btn-cross"),
  modalOverlay: document.getElementById("modal-overlay"),
  modal:        document.getElementById("modal"),
  btnClose:     document.getElementById("btn-close"),
  resultParental:    document.getElementById("result-parental"),
  resultPunnett:     document.getElementById("result-punnett"),
  resultGenotypeRatio: document.getElementById("result-genotype-ratio"),
  resultPhenotypeRatio: document.getElementById("result-phenotype-ratio"),
};

// ============================================
// 6. RENDERING FUNCTIONS
// ============================================

/** Show a step by id, hide the others. */
function showStep(stepId) {
  document.querySelectorAll(".step").forEach((s) => s.classList.remove("active"));
  document.getElementById(stepId).classList.add("active");
}

/* ---------- Step 1: Organism Selection ---------- */
function renderOrganisms() {
  dom.organismGrid.innerHTML = ORGANISMS.map(
    (org) => `
    <div class="organism-card" data-id="${org.id}" tabindex="0" role="button"
         aria-label="Pilih ${org.name}">
      <span class="emoji">${org.emoji}</span>
      <div class="name">${org.name}</div>
      <div class="latin">${org.latin}</div>
    </div>`
  ).join("");
}

/* ---------- Step 2: Trait Tabs ---------- */
function renderTraitTabs() {
  const traits = state.organism.traits;
  dom.traitTabs.innerHTML = traits
    .map(
      (t, i) =>
        `<button class="trait-tab${i === 0 ? " active" : ""}" data-trait-id="${t.id}">
          ${t.name}
        </button>`
    )
    .join("");
}

/* ---------- Genotype Display for one parent ---------- */
function renderGenotypeDisplay(parentKey) {
  const trait = state.trait;
  const options = getGenotypeOptions(trait);
  const index = parentKey === 1 ? state.parent1Index : state.parent2Index;
  const opt = options[index];
  const pheno = getPhenotypeInfo(opt.genotype, trait);

  const display = parentKey === 1 ? dom.display1 : dom.display2;
  display.innerHTML = `
    <div class="svg-container">${getSvg(pheno.svgKey)}</div>
    <div class="genotype-label">${opt.genotype}</div>
    <div class="genotype-type">${opt.description}</div>
    <div class="phenotype-label">${pheno.label}</div>
  `;
}

/* ---------- Both Parents ---------- */
function renderParents() {
  renderGenotypeDisplay(1);
  renderGenotypeDisplay(2);
  renderCrossSummary();
}

/* ---------- Cross Summary Text ---------- */
function renderCrossSummary() {
  const opts = getGenotypeOptions(state.trait);
  const g1 = opts[state.parent1Index].genotype;
  const g2 = opts[state.parent2Index].genotype;
  dom.crossSummary.innerHTML = `<strong>Genotipe:</strong> ${g1} × ${g2}`;
}

/* ---------- Modal: Full Results ---------- */
function renderResults() {
  const trait = state.trait;
  const opts = getGenotypeOptions(trait);
  const g1 = opts[state.parent1Index].genotype;
  const g2 = opts[state.parent2Index].genotype;

  const result = performCross(g1, g2);
  const { genoCounts, phenoCounts } = calculateRatios(result.offspring, trait);

  // -- Parental Info --
  const pheno1 = getPhenotypeInfo(g1, trait);
  const pheno2 = getPhenotypeInfo(g2, trait);

  dom.resultParental.innerHTML = `
    <h3>📋 Informasi Persilangan</h3>
    <div class="parental-detail">
      <div class="item"><span class="label">Parent 1:</span>
        <span class="value">${getSvg(pheno1.svgKey).replace("viewBox", 'width="32" height="32" viewBox')}</span>
        <span class="value">${g1}</span>
        <span class="label">(${pheno1.label})</span>
      </div>
      <span class="separator">×</span>
      <div class="item"><span class="label">Parent 2:</span>
        <span class="value">${getSvg(pheno2.svgKey).replace("viewBox", 'width="32" height="32" viewBox')}</span>
        <span class="value">${g2}</span>
        <span class="label">(${pheno2.label})</span>
      </div>
    </div>
    <div class="gametes-row">
      <span class="label">Gamet P₁:</span>
      ${result.gametes1.map((a) => `<span class="gamete-badge">${a}</span>`).join("")}
    </div>
    <div class="gametes-row">
      <span class="label">Gamet P₂:</span>
      ${result.gametes2.map((a) => `<span class="gamete-badge">${a}</span>`).join("")}
    </div>
  `;

  // -- Punnett Square --
  const gametes1 = result.gametes1;
  const gametes2 = result.gametes2;

  let tableHtml = `<table class="punnett-table">
    <thead>
      <tr>
        <th class="corner-cell">P₁ ╲ P₂</th>
        ${gametes2.map((a) => `<th class="gamete-cell">${a}</th>`).join("")}
      </tr>
    </thead>
    <tbody>`;

  result.punnett.forEach((row, ri) => {
    tableHtml += `<tr><th class="gamete-cell">${gametes1[ri]}</th>`;
    row.forEach((genotype) => {
      const pheno = getPhenotypeInfo(genotype, trait);
      tableHtml += `
        <td class="offspring-cell">
          <div class="og-genotype">${genotype}</div>
          <div class="og-image">${getSvg(pheno.svgKey)}</div>
          <div class="og-phenotype">${pheno.label}</div>
        </td>`;
    });
    tableHtml += `</tr>`;
  });

  tableHtml += `</tbody></table>`;
  dom.resultPunnett.innerHTML = tableHtml;

  // -- Genotype Ratio --
  const total = result.offspring.length;
  let genoHtml = "";
  for (const [geno, count] of genoCounts) {
    const cat = getGenotypeCategory(geno, trait);
    const pct = Math.round((count / total) * 100);
    const barClass = cat === "dominant" ? "dom" : cat === "heterozygous" ? "het" : "rec";
    const phenoLabel = getPhenotypeInfo(geno, trait).label;
    genoHtml += `
      <div class="ratio-item">
        <div class="ratio-label">
          <span class="genotype-badge">${geno}</span>
          <span class="phenotype-text">${phenoLabel}</span>
        </div>
        <div class="ratio-bar-track">
          <div class="ratio-bar-fill ${barClass}" style="width:${pct}%;">${count}/${total}</div>
        </div>
        <span class="ratio-fraction">${pct}%</span>
      </div>`;
  }
  dom.resultGenotypeRatio.innerHTML = genoHtml;

  // -- Phenotype Ratio --
  let phenoHtml = "";
  for (const [label, data] of phenoCounts) {
    const pct = Math.round((data.count / total) * 100);
    const barClass = data.category === "dominant" ? "dom" : data.category === "heterozygous" ? "het" : "rec";
    phenoHtml += `
      <div class="ratio-item">
        <div class="ratio-label">
          <span class="genotype-badge">${label}</span>
        </div>
        <div class="ratio-bar-track">
          <div class="ratio-bar-fill ${barClass}" style="width:${pct}%;">${data.count}/${total}</div>
        </div>
        <span class="ratio-fraction">${pct}%</span>
      </div>`;
  }
  dom.resultPhenotypeRatio.innerHTML = phenoHtml;
}

// ============================================
// 7. EVENT HANDLERS
// ============================================

/** Select an organism and move to step 2. */
function selectOrganism(organismId) {
  state.organism = ORGANISMS.find((o) => o.id === organismId);
  state.trait = state.organism.traits[0];
  state.parent1Index = 0;
  state.parent2Index = 2;

  dom.crossTitle.textContent = `Atur Persilangan — ${state.organism.name}`;
  renderTraitTabs();
  renderParents();
  showStep("step-cross");
}

/** Select a trait tab. */
function selectTrait(traitId) {
  state.trait = state.organism.traits.find((t) => t.id === traitId);
  state.parent1Index = 0;
  state.parent2Index = 2;

  document.querySelectorAll(".trait-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.traitId === traitId);
  });
  renderParents();
}

/** Cycle a parent's genotype forward or backward. */
function cycleParent(parentKey, direction) {
  const options = getGenotypeOptions(state.trait);
  if (parentKey === 1) {
    state.parent1Index = (state.parent1Index + direction + options.length) % options.length;
  } else {
    state.parent2Index = (state.parent2Index + direction + options.length) % options.length;
  }
  renderGenotypeDisplay(parentKey);
  renderCrossSummary();
}

/** Open the results modal. */
function openModal() {
  renderResults();
  dom.modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

/** Close the results modal. */
function closeModal() {
  dom.modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

// ============================================
// 8. INITIALIZATION
// ============================================

function init() {
  // Step 1: Organism selection (click + keyboard)
  dom.organismGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".organism-card");
    if (card) selectOrganism(card.dataset.id);
  });
  dom.organismGrid.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const card = e.target.closest(".organism-card");
      if (card) { e.preventDefault(); selectOrganism(card.dataset.id); }
    }
  });

  // Back button
  dom.btnBack.addEventListener("click", () => {
    showStep("step-organism");
  });

  // Trait tabs
  dom.traitTabs.addEventListener("click", (e) => {
    const tab = e.target.closest(".trait-tab");
    if (tab) selectTrait(tab.dataset.traitId);
  });

  // Genotype navigation arrows
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const parentKey = parseInt(btn.dataset.parent, 10);
      const dir = parseInt(btn.dataset.dir, 10);
      cycleParent(parentKey, dir);
    });
  });

  // Cross button
  dom.btnCross.addEventListener("click", openModal);

  // Close modal
  dom.btnClose.addEventListener("click", closeModal);
  dom.modalOverlay.addEventListener("click", (e) => {
    if (e.target === dom.modalOverlay) closeModal();
  });

  // Keyboard: Escape to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dom.modalOverlay.classList.contains("open")) {
      closeModal();
    }
  });

  // Render initial organism cards
  renderOrganisms();
}

document.addEventListener("DOMContentLoaded", init);

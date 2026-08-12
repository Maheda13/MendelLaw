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
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="90" rx="28" ry="4" fill="rgba(0,0,0,0.07)"/>
        <circle cx="50" cy="50" r="40" fill="#4ade80"/>
        <circle cx="50" cy="50" r="40" fill="none" stroke="#16a34a" stroke-width="2"/>
        <path d="M 18,28 Q 50,50 18,72" stroke="#16a34a" stroke-width="3" fill="none" opacity="0.35"/>
        <path d="M 33,14 Q 50,50 33,86" stroke="#16a34a" stroke-width="3" fill="none" opacity="0.35"/>
        <path d="M 50,10 L 50,90"       stroke="#16a34a" stroke-width="3" fill="none" opacity="0.35"/>
        <path d="M 67,14 Q 50,50 67,86" stroke="#16a34a" stroke-width="3" fill="none" opacity="0.35"/>
        <path d="M 82,28 Q 50,50 82,72" stroke="#16a34a" stroke-width="3" fill="none" opacity="0.35"/>
        <rect x="47" y="7" width="6" height="8" rx="2" fill="#92400e"/>
      </svg>`;
  },

  /* ---- Watermelon: Oval (Lonjong) ---- */
  watermelonOval() {
    return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="90" rx="20" ry="4" fill="rgba(0,0,0,0.07)"/>
        <ellipse cx="50" cy="50" rx="26" ry="42" fill="#4ade80"/>
        <ellipse cx="50" cy="50" rx="26" ry="42" fill="none" stroke="#16a34a" stroke-width="2"/>
        <path d="M 30,18 Q 50,50 30,82" stroke="#16a34a" stroke-width="2.5" fill="none" opacity="0.35"/>
        <path d="M 42,9  Q 50,50 42,91" stroke="#16a34a" stroke-width="2.5" fill="none" opacity="0.35"/>
        <path d="M 50,8  L 50,92"       stroke="#16a34a" stroke-width="2.5" fill="none" opacity="0.35"/>
        <path d="M 58,9  Q 50,50 58,91" stroke="#16a34a" stroke-width="2.5" fill="none" opacity="0.35"/>
        <path d="M 70,18 Q 50,50 70,82" stroke="#16a34a" stroke-width="2.5" fill="none" opacity="0.35"/>
        <rect x="47" y="5" width="6" height="8" rx="2" fill="#92400e"/>
      </svg>`;
  },

  /* ---- Watermelon: Cross-section, Few Seeds ---- */
  watermelonFewSeeds() {
    return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#4ade80" stroke="#16a34a" stroke-width="2"/>
        <circle cx="50" cy="50" r="38" fill="#ef4444"/>
        <circle cx="50" cy="50" r="22" fill="#fca5a5" opacity="0.25"/>
        <ellipse cx="40" cy="40" rx="2.5" ry="4" fill="#1e293b" transform="rotate(-15,40,40)"/>
        <ellipse cx="58" cy="36" rx="2.5" ry="4" fill="#1e293b" transform="rotate(12,58,36)"/>
        <ellipse cx="50" cy="58" rx="2.5" ry="4" fill="#1e293b" transform="rotate(-5,50,58)"/>
      </svg>`;
  },

  /* ---- Watermelon: Cross-section, Many Seeds ---- */
  watermelonManySeeds() {
    return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#4ade80" stroke="#16a34a" stroke-width="2"/>
        <circle cx="50" cy="50" r="38" fill="#ef4444"/>
        <circle cx="50" cy="50" r="22" fill="#fca5a5" opacity="0.25"/>
        <ellipse cx="35" cy="34" rx="2.5" ry="4" fill="#1e293b" transform="rotate(-20,35,34)"/>
        <ellipse cx="55" cy="30" rx="2.5" ry="4" fill="#1e293b" transform="rotate(15,55,30)"/>
        <ellipse cx="66" cy="42" rx="2.5" ry="4" fill="#1e293b" transform="rotate(5,66,42)"/>
        <ellipse cx="38" cy="50" rx="2.5" ry="4" fill="#1e293b" transform="rotate(-10,38,50)"/>
        <ellipse cx="60" cy="54" rx="2.5" ry="4" fill="#1e293b" transform="rotate(8,60,54)"/>
        <ellipse cx="34" cy="64" rx="2.5" ry="4" fill="#1e293b" transform="rotate(-12,34,64)"/>
        <ellipse cx="50" cy="66" rx="2.5" ry="4" fill="#1e293b" transform="rotate(3,50,66)"/>
        <ellipse cx="63" cy="68" rx="2.5" ry="4" fill="#1e293b" transform="rotate(-7,63,68)"/>
      </svg>`;
  },

  /* ---- Snapdragon: Red ---- */
  snapdragonRed() {
    return `
      <svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="22" rx="13" ry="17" fill="#dc2626"/>
        <ellipse cx="27" cy="36" rx="13" ry="17" fill="#ef4444" transform="rotate(-35,27,36)"/>
        <ellipse cx="73" cy="36" rx="13" ry="17" fill="#ef4444" transform="rotate(35,73,36)"/>
        <ellipse cx="30" cy="60" rx="11" ry="15" fill="#dc2626" transform="rotate(-60,30,60)"/>
        <ellipse cx="70" cy="60" rx="11" ry="15" fill="#dc2626" transform="rotate(60,70,60)"/>
        <circle cx="50" cy="42" r="8" fill="#fbbf24"/>
        <circle cx="50" cy="42" r="4" fill="#f59e0b"/>
        <line x1="50" y1="70" x2="50" y2="100" stroke="#16a34a" stroke-width="3"/>
        <ellipse cx="40" cy="85" rx="8" ry="4" fill="#4ade80" transform="rotate(-25,40,85)"/>
      </svg>`;
  },

  /* ---- Snapdragon: Pink ---- */
  snapdragonPink() {
    return `
      <svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="22" rx="13" ry="17" fill="#ec4899"/>
        <ellipse cx="27" cy="36" rx="13" ry="17" fill="#f472b6" transform="rotate(-35,27,36)"/>
        <ellipse cx="73" cy="36" rx="13" ry="17" fill="#f472b6" transform="rotate(35,73,36)"/>
        <ellipse cx="30" cy="60" rx="11" ry="15" fill="#ec4899" transform="rotate(-60,30,60)"/>
        <ellipse cx="70" cy="60" rx="11" ry="15" fill="#ec4899" transform="rotate(60,70,60)"/>
        <circle cx="50" cy="42" r="8" fill="#fbbf24"/>
        <circle cx="50" cy="42" r="4" fill="#f59e0b"/>
        <line x1="50" y1="70" x2="50" y2="100" stroke="#16a34a" stroke-width="3"/>
        <ellipse cx="40" cy="85" rx="8" ry="4" fill="#4ade80" transform="rotate(-25,40,85)"/>
      </svg>`;
  },

  /* ---- Snapdragon: White ---- */
  snapdragonWhite() {
    return `
      <svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="22" rx="13" ry="17" fill="#ffffff" stroke="#d1d5db" stroke-width="1.5"/>
        <ellipse cx="27" cy="36" rx="13" ry="17" fill="#f9fafb" stroke="#d1d5db" stroke-width="1.5" transform="rotate(-35,27,36)"/>
        <ellipse cx="73" cy="36" rx="13" ry="17" fill="#f9fafb" stroke="#d1d5db" stroke-width="1.5" transform="rotate(35,73,36)"/>
        <ellipse cx="30" cy="60" rx="11" ry="15" fill="#ffffff" stroke="#d1d5db" stroke-width="1.5" transform="rotate(-60,30,60)"/>
        <ellipse cx="70" cy="60" rx="11" ry="15" fill="#ffffff" stroke="#d1d5db" stroke-width="1.5" transform="rotate(60,70,60)"/>
        <circle cx="50" cy="42" r="8" fill="#fbbf24"/>
        <circle cx="50" cy="42" r="4" fill="#f59e0b"/>
        <line x1="50" y1="70" x2="50" y2="100" stroke="#16a34a" stroke-width="3"/>
        <ellipse cx="40" cy="85" rx="8" ry="4" fill="#4ade80" transform="rotate(-25,40,85)"/>
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

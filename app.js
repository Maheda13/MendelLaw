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

/* ========================================
 * SEMANGKA — Berbasis ikon Twemoji (Twitter)
 * Sumber: github.com/jdecked/twemoji
 * Lisensi: CC-BY 4.0
 * ======================================== */

  /* ---- Semangka Bulat (dilihat dari luar) ---- */
  watermelonRound() {
    return `
      <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="18" cy="33" rx="14" ry="1.5" fill="rgba(0,0,0,0.06)"/>
        <circle cx="18" cy="19" r="16" fill="#3D6B1E"/>
        <circle cx="18" cy="19" r="15" fill="#5C913B"/>
        <ellipse cx="14" cy="14" rx="9" ry="7" fill="#7AB648" opacity="0.35"/>
        <path d="M5,8 C8,14 10,19 6,27" stroke="#3D6B1E" stroke-width="2" fill="none" opacity="0.3" stroke-linecap="round"/>
        <path d="M10,3 C12,10 14,18 11,31" stroke="#3D6B1E" stroke-width="1.8" fill="none" opacity="0.25" stroke-linecap="round"/>
        <path d="M18,2 L18,34" stroke="#3D6B1E" stroke-width="1.5" fill="none" opacity="0.2"/>
        <path d="M26,3 C24,10 22,18 25,31" stroke="#3D6B1E" stroke-width="1.8" fill="none" opacity="0.25" stroke-linecap="round"/>
        <path d="M31,8 C28,14 26,19 30,27" stroke="#3D6B1E" stroke-width="2" fill="none" opacity="0.3" stroke-linecap="round"/>
        <ellipse cx="12" cy="10" rx="4" ry="2.5" fill="white" opacity="0.15" transform="rotate(-20,12,10)"/>
        <path d="M17,4 C16,2 14,1 12,1" stroke="#8B6914" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M19,4 C21,2 23,1 24,2" stroke="#5C913B" stroke-width="1" fill="none" stroke-linecap="round"/>
      </svg>`;
  },

  /* ---- Semangka Lonjong (dilihat dari luar) ---- */
  watermelonOval() {
    return `
      <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="18" cy="33" rx="10" ry="1.5" fill="rgba(0,0,0,0.06)"/>
        <ellipse cx="18" cy="19" rx="10" ry="16" fill="#3D6B1E"/>
        <ellipse cx="18" cy="19" rx="9" ry="15" fill="#5C913B"/>
        <ellipse cx="15" cy="13" rx="6" ry="9" fill="#7AB648" opacity="0.3"/>
        <path d="M10,5 C12,12 13,19 11,30" stroke="#3D6B1E" stroke-width="1.5" fill="none" opacity="0.25" stroke-linecap="round"/>
        <path d="M14,2 L14,34" stroke="#3D6B1E" stroke-width="1.2" fill="none" opacity="0.2"/>
        <path d="M18,1 L18,35" stroke="#3D6B1E" stroke-width="1" fill="none" opacity="0.15"/>
        <path d="M22,2 L22,34" stroke="#3D6B1E" stroke-width="1.2" fill="none" opacity="0.2"/>
        <path d="M26,5 C24,12 23,19 25,30" stroke="#3D6B1E" stroke-width="1.5" fill="none" opacity="0.25" stroke-linecap="round"/>
        <ellipse cx="13" cy="10" rx="2" ry="3.5" fill="white" opacity="0.12" transform="rotate(-5,13,10)"/>
        <path d="M17,4 C16,2 14,1 12,1" stroke="#8B6914" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      </svg>`;
  },

  /* ---- Semangka Irisan: Sedikit Biji (3 biji) ---- */
  watermelonFewSeeds() {
    return `
      <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <path fill="#5C913B" d="M2.472 6.572C1.528 8.698 1 11.038 1 13.5 1 23.165 9.059 31 19 31c7.746 0 14.33-4.767 16.868-11.44L2.472 6.572z"/>
        <path fill="#FFE8B6" d="M4.332 7.295C3.479 9.197 3 11.293 3 13.5c0 8.591 7.164 15.556 16 15.556 6.904 0 12.77-4.26 15.013-10.218L4.332 7.295z"/>
        <path fill="#DD2E44" d="M6.191 8.019C5.43 9.697 5 11.548 5 13.5c0 7.518 6.268 13.611 14 13.611 6.062 0 11.21-3.753 13.156-8.995L6.191 8.019z"/>
        <path d="M9.916 14.277c-.307.46-.741.708-.971.555-.23-.153-.168-.649.139-1.109.307-.46.741-.708.971-.555.23.153.168.649-.139 1.109z"/>
        <path d="M11.998 17.955c.05.551-.132 1.016-.406 1.041-.275.025-.538-.4-.588-.951-.05-.551.132-1.016.406-1.04.276-.026.538.398.588.95z"/>
        <path d="M23.935 23.755c.273.481.299.979.06 1.115-.241.137-.656-.143-.929-.624-.273-.48-.299-.979-.059-1.115.241-.138.655.141.928.624z"/>
      </svg>`;
  },

  /* ---- Semangka Irisan: Banyak Biji (8 biji) ---- */
  watermelonManySeeds() {
    return `
      <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <path fill="#5C913B" d="M2.472 6.572C1.528 8.698 1 11.038 1 13.5 1 23.165 9.059 31 19 31c7.746 0 14.33-4.767 16.868-11.44L2.472 6.572z"/>
        <path fill="#FFE8B6" d="M4.332 7.295C3.479 9.197 3 11.293 3 13.5c0 8.591 7.164 15.556 16 15.556 6.904 0 12.77-4.26 15.013-10.218L4.332 7.295z"/>
        <path fill="#DD2E44" d="M6.191 8.019C5.43 9.697 5 11.548 5 13.5c0 7.518 6.268 13.611 14 13.611 6.062 0 11.21-3.753 13.156-8.995L6.191 8.019z"/>
        <path d="M9.916 14.277c-.307.46-.741.708-.971.555-.23-.153-.168-.649.139-1.109.307-.46.741-.708.971-.555.23.153.168.649-.139 1.109zm6 1c-.307.46-.741.708-.971.555-.23-.153-.168-.649.139-1.109.307-.46.741-.708.971-.555.23.153.168.649-.139 1.109zm5.082 4.678c.05.551-.132 1.016-.406 1.041-.275.025-.538-.4-.588-.951-.051-.551.132-1.016.406-1.04.275-.026.538.398.588.95zm-9-2c.05.551-.132 1.016-.406 1.041-.275.025-.538-.4-.588-.951-.05-.551.132-1.016.406-1.04.276-.026.538.398.588.95zm3.901 5.346c-.333.441-.78.663-1 .497-.221-.166-.129-.658.205-1.099.333-.441.781-.663 1-.497.221.166.13.657-.205 1.099zm8.036.454c.273.481.299.979.06 1.115-.241.137-.656-.143-.929-.624-.273-.48-.299-.979-.059-1.115.241-.138.655.141.928.624zm-7.017-5.028c.303.463.362.958.131 1.109-.231.152-.663-.1-.966-.562-.303-.462-.361-.958-.131-1.108.231-.154.663.097.966.561zm8.981 1.574c-.333.441-.78.663-1.001.497-.221-.166-.129-.658.205-1.099.333-.442.78-.663 1-.497.222.166.131.657-.204 1.099z"/>
      </svg>`;
  },

/* ========================================
 * ANTIRRHINUM — Berbasis ikon Twemoji (hibiscus)
 * Warna diubah untuk menunjukkan fenotipe:
 * Merah (MM) / Pink (Mm) / Putih (mm)
 * ======================================== */

  /* ---- Bunga Merah (MM) ---- */
  snapdragonRed() {
    return `
      <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <path fill="#77B255" d="M19.602 32.329c6.509 6.506 17.254-7.669 15.72-7.669-7.669 0-22.227 1.161-15.72 7.669z"/>
        <path fill="#77B255" d="M15.644 33.372C9.612 39.404-.07 26.263 1.352 26.263c3.81 0 9.374-.348 12.79.867 2.958 1.052 4.304 3.442 1.502 6.242z"/>
        <path fill="#FF6B6B" d="M34.613 15.754c-.052-.901-.175-2.585-1.398-4.227-1.16-1.549-3.805-3.371-5.534-2.585.516-1.676-.264-4.125-1.191-5.49-1.179-1.736-4.262-3.843-8.146-3.026-1.754.369-4.18 2.036-4.632 3.864-1.18-1.471-4.22-1.675-6.015-1.222-2.026.511-3.154 1.777-3.739 2.461l.003-.005-.03.034-.027.033c-.583.689-1.656 1.994-1.847 4.074-.193 2.146.75 5.832 3.026 6.042.149.014.324.031.514.051-2.271.098-3.572 3.654-3.595 5.8-.022 2.102.926 3.506 1.443 4.243l-.003-.004c.008.01.019.024.025.036.007.011.02.023.026.036.523.733 1.525 2.094 3.515 2.776 1.958.669 5.553.656 6.567-1.236-.273 2.244 3.027 4.077 5.169 4.438 2.115.358 3.71-.358 4.55-.753l-.005.003c.013-.008.028-.015.041-.021l.041-.02c.838-.4 2.398-1.178 3.462-3.04.729-1.282 1.27-3.403.951-5.015l.192.127c1.826 1.224 4.63-1.119 5.705-2.938 1.044-1.761.932-4.424.932-4.436z"/>
        <path fill="#DC2626" d="M27.542 13.542c-1.786-.997-4.874-.434-6.792.308-.266-.468-.621-.875-1.051-1.196 1.393-1.607 3.526-4.593 1.468-6.362-2.191-1.883-3.74 2.154-3.575 5.605-.068-.003-.132-.02-.201-.02-1.019 0-1.94.402-2.632 1.045-1.401-2.277-3.942-4.244-5.314-2.392-1.482 2.002 1.148 3.153 4.222 4.2-.09.329-.154.668-.154 1.025 0 .456.093.887.238 1.293-2.541.732-6.236 2.718-4.21 4.91 2.122 2.296 4.472-1.238 5.604-3.053.635.454 1.407.727 2.247.727.225 0 .441-.029.655-.066-.109 4.802 1.443 7.07 4.036 5.892 2.295-1.043-.137-5.299-1.781-7.165.316-.362.564-.779.729-1.241 7.008 2.544 8.589-2.351 6.511-3.51z"/>
        <path fill="#991B1B" d="M17.707 17.459c-.679 0-.668-.562-.832-1.25-.532-2.233-2.381-6.308-4.601-9.163-.509-.654-.391-1.596.263-2.105.654-.508 1.596-.391 2.105.263 2.439 3.136 3.264 7.404 3.982 10.421.191.806.237 1.601-.569 1.792-.116.028-.233.042-.348.042z"/>
        <path fill="#FFCC4D" d="M15.904 5.327c.498.684.079 1.838-.936 2.578l-.475.347c-1.016.739-2.243.785-2.741.101l-2.78-3.817c-.498-.684-.079-1.838.936-2.577l.475-.347c1.015-.739 2.242-.785 2.74-.101l2.781 3.816z"/>
      </svg>`;
  },

  /* ---- Bunga Pink (Mm) ---- */
  snapdragonPink() {
    return `
      <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <path fill="#77B255" d="M19.602 32.329c6.509 6.506 17.254-7.669 15.72-7.669-7.669 0-22.227 1.161-15.72 7.669z"/>
        <path fill="#77B255" d="M15.644 33.372C9.612 39.404-.07 26.263 1.352 26.263c3.81 0 9.374-.348 12.79.867 2.958 1.052 4.304 3.442 1.502 6.242z"/>
        <path fill="#F9A8D4" d="M34.613 15.754c-.052-.901-.175-2.585-1.398-4.227-1.16-1.549-3.805-3.371-5.534-2.585.516-1.676-.264-4.125-1.191-5.49-1.179-1.736-4.262-3.843-8.146-3.026-1.754.369-4.18 2.036-4.632 3.864-1.18-1.471-4.22-1.675-6.015-1.222-2.026.511-3.154 1.777-3.739 2.461l.003-.005-.03.034-.027.033c-.583.689-1.656 1.994-1.847 4.074-.193 2.146.75 5.832 3.026 6.042.149.014.324.031.514.051-2.271.098-3.572 3.654-3.595 5.8-.022 2.102.926 3.506 1.443 4.243l-.003-.004c.008.01.019.024.025.036.007.011.02.023.026.036.523.733 1.525 2.094 3.515 2.776 1.958.669 5.553.656 6.567-1.236-.273 2.244 3.027 4.077 5.169 4.438 2.115.358 3.71-.358 4.55-.753l-.005.003c.013-.008.028-.015.041-.021l.041-.02c.838-.4 2.398-1.178 3.462-3.04.729-1.282 1.27-3.403.951-5.015l.192.127c1.826 1.224 4.63-1.119 5.705-2.938 1.044-1.761.932-4.424.932-4.436z"/>
        <path fill="#EC4899" d="M27.542 13.542c-1.786-.997-4.874-.434-6.792.308-.266-.468-.621-.875-1.051-1.196 1.393-1.607 3.526-4.593 1.468-6.362-2.191-1.883-3.74 2.154-3.575 5.605-.068-.003-.132-.02-.201-.02-1.019 0-1.94.402-2.632 1.045-1.401-2.277-3.942-4.244-5.314-2.392-1.482 2.002 1.148 3.153 4.222 4.2-.09.329-.154.668-.154 1.025 0 .456.093.887.238 1.293-2.541.732-6.236 2.718-4.21 4.91 2.122 2.296 4.472-1.238 5.604-3.053.635.454 1.407.727 2.247.727.225 0 .441-.029.655-.066-.109 4.802 1.443 7.07 4.036 5.892 2.295-1.043-.137-5.299-1.781-7.165.316-.362.564-.779.729-1.241 7.008 2.544 8.589-2.351 6.511-3.51z"/>
        <path fill="#BE185D" d="M17.707 17.459c-.679 0-.668-.562-.832-1.25-.532-2.233-2.381-6.308-4.601-9.163-.509-.654-.391-1.596.263-2.105.654-.508 1.596-.391 2.105.263 2.439 3.136 3.264 7.404 3.982 10.421.191.806.237 1.601-.569 1.792-.116.028-.233.042-.348.042z"/>
        <path fill="#FFCC4D" d="M15.904 5.327c.498.684.079 1.838-.936 2.578l-.475.347c-1.016.739-2.243.785-2.741.101l-2.78-3.817c-.498-.684-.079-1.838.936-2.577l.475-.347c1.015-.739 2.242-.785 2.74-.101l2.781 3.816z"/>
      </svg>`;
  },

  /* ---- Bunga Putih (mm) ---- */
  snapdragonWhite() {
    return `
      <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <path fill="#77B255" d="M19.602 32.329c6.509 6.506 17.254-7.669 15.72-7.669-7.669 0-22.227 1.161-15.72 7.669z"/>
        <path fill="#77B255" d="M15.644 33.372C9.612 39.404-.07 26.263 1.352 26.263c3.81 0 9.374-.348 12.79.867 2.958 1.052 4.304 3.442 1.502 6.242z"/>
        <path fill="#F9FAFB" d="M34.613 15.754c-.052-.901-.175-2.585-1.398-4.227-1.16-1.549-3.805-3.371-5.534-2.585.516-1.676-.264-4.125-1.191-5.49-1.179-1.736-4.262-3.843-8.146-3.026-1.754.369-4.18 2.036-4.632 3.864-1.18-1.471-4.22-1.675-6.015-1.222-2.026.511-3.154 1.777-3.739 2.461l.003-.005-.03.034-.027.033c-.583.689-1.656 1.994-1.847 4.074-.193 2.146.75 5.832 3.026 6.042.149.014.324.031.514.051-2.271.098-3.572 3.654-3.595 5.8-.022 2.102.926 3.506 1.443 4.243l-.003-.004c.008.01.019.024.025.036.007.011.02.023.026.036.523.733 1.525 2.094 3.515 2.776 1.958.669 5.553.656 6.567-1.236-.273 2.244 3.027 4.077 5.169 4.438 2.115.358 3.71-.358 4.55-.753l-.005.003c.013-.008.028-.015.041-.021l.041-.02c.838-.4 2.398-1.178 3.462-3.04.729-1.282 1.27-3.403.951-5.015l.192.127c1.826 1.224 4.63-1.119 5.705-2.938 1.044-1.761.932-4.424.932-4.436z"/>
        <path fill="#D1D5DB" d="M27.542 13.542c-1.786-.997-4.874-.434-6.792.308-.266-.468-.621-.875-1.051-1.196 1.393-1.607 3.526-4.593 1.468-6.362-2.191-1.883-3.74 2.154-3.575 5.605-.068-.003-.132-.02-.201-.02-1.019 0-1.94.402-2.632 1.045-1.401-2.277-3.942-4.244-5.314-2.392-1.482 2.002 1.148 3.153 4.222 4.2-.09.329-.154.668-.154 1.025 0 .456.093.887.238 1.293-2.541.732-6.236 2.718-4.21 4.91 2.122 2.296 4.472-1.238 5.604-3.053.635.454 1.407.727 2.247.727.225 0 .441-.029.655-.066-.109 4.802 1.443 7.07 4.036 5.892 2.295-1.043-.137-5.299-1.781-7.165.316-.362.564-.779.729-1.241 7.008 2.544 8.589-2.351 6.511-3.51z"/>
        <path fill="#9CA3AF" d="M17.707 17.459c-.679 0-.668-.562-.832-1.25-.532-2.233-2.381-6.308-4.601-9.163-.509-.654-.391-1.596.263-2.105.654-.508 1.596-.391 2.105.263 2.439 3.136 3.264 7.404 3.982 10.421.191.806.237 1.601-.569 1.792-.116.028-.233.042-.348.042z"/>
        <path fill="#FFCC4D" d="M15.904 5.327c.498.684.079 1.838-.936 2.578l-.475.347c-1.016.739-2.243.785-2.741.101l-2.78-3.817c-.498-.684-.079-1.838.936-2.577l.475-.347c1.015-.739 2.242-.785 2.74-.101l2.781 3.816z"/>
      </svg>`;
  },

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

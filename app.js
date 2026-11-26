// WEHU - D1 & D2 (JKKP 7) Digital Form + 64-Column WEHU_D Sheet Mapper + Rekod_Link

const SPREADSHEET_ID = "1zmq-qaZW5EGiWWGAJ1a1zhgGch11AhdMRUI7lI7wRJg";
const SHEET_NAME = "WEHU_D";
const PUBLIC_FORM_BASE_URL = "https://ahashushami.github.io/borang-wehu-d/";
const DEFAULT_GAS_WEB_APP_URL = ""; // Boleh ditetapkan melalui modal 'Sambungan Apps Script' atau dikemas kini di sini

const WEHU_D_64_HEADERS = [
  "NO",
  "DATE OF ENTRY (dd/mm/yyyy)",
  "CASE CODE",
  "NAME OF NOTIFIER",
  "DESIGNATION OF NOTIFIER",
  "ADDRESS OF CLINIC/HOSPITAL OF NOTIFIER",
  "CONTACT NUMBER OF NOTIFIER (e.g : 0134567890)",
  "NAME OF AFFECTED PERSON",
  "DATE OF BIRTH (dd/mm/yyyy)",
  "AGE",
  "AGE GROUP",
  "NEW IC /PASSPORT NO. (e.g : 880721034567)",
  "NATIONALITY",
  "OTHERS NATIONALITY (PLEASE SPECIFY)",
  "GENDER",
  "ETHNIC GROUP",
  "OCCUPATION",
  "OCCUPATIONAL CLASS",
  "TYPE OF FACILITY",
  "NAME AND ADDRESS OF ORGANIZATION OF AFFECTED PERSON",
  "DEPARTMENT",
  "UNIT",
  "DISTRICT",
  "STATE",
  "DATE OF DIAGNOSIS (dd/mm/yyyy)",
  "MONTH OF DIAGNOSIS",
  "DIAGNOSIS/PROVISIONAL DIAGNOSIS",
  "WHAT KIND OF WORK DID THE PATIENT DO WHICH MAY BE ASSOCIATED WITH THE DISEASE? (DESCRIBE THE WORK ACTIVITIES)",
  "WHAT WAS THE HAZARDS OR AGENT BEEN EXPOSED TO THE PATIENT?",
  "HOW LONG HAD THE PATIENT BEEN EXPOSED TO THE HAZARD OR AGENT? (day)",
  "HOW LONG HAD THE PATIENT BEEN EXPOSED TO THE HAZARD OR AGENT? (month)",
  "HOW LONG HAD THE PATIENT BEEN EXPOSED TO THE HAZARD OR AGENT? (years)",
  "HOW LONG HAD THE PATIENT BEEN EXPERIENCING THE SYMPTOMS? (days)",
  "HOW LONG HAD THE PATIENT BEEN EXPERIENCING THE SYMPTOMS? (month)",
  "HOW LONG HAD THE PATIENT BEEN EXPERIENCING THE SYMPTOMS? (years)",
  "DATE OF NOTIFICATION (dd/mm/yyyy)",
  "MONTH OF NOTIFICATION",
  "DATE OF OCCURRENCE (dd/mm/yyyy)",
  "TIME OF OCCURRENCE (hh:mm)",
  "STATUS CASE",
  "PLACE OF OCCURRENCE",
  "OTHERS PLACE OF OCCURENCE (PLEASE SPECIFY)",
  "CIRCUMSTANCES OF POISONING",
  "TRADE NAME OF POISONING AGENT(S)",
  "TRADE NAME OF ACTIVE INGREDIENT",
  "TYPE OF POISONING",
  "TYPE OF PESTICIDE",
  "OTHER TYPE OF PESTICIDE (PLEASE SPECIFY)",
  "TYPE OF CHEMICAL",
  "OTHER TYPE OF CHEMICAL",
  "IF PHARMACEUTICAL AGENTS, PLEASE INDICATE",
  "LIKELY ROUTE (S) OF POISONING 1",
  "LIKELY ROUTE (S) OF POISONING 2",
  "LIKELY ROUTE (S) OF POISONING 3",
  "WAS FIRST AID GIVEN AT THE SITE OF POISONING?",
  "OTHER ROUTE OF POISONING",
  "IS POISONING CONFIRMED BY LABORATORY INVESTIGATION?",
  "OTHER IF POISONING CONFIRMED",
  "OUTCOME OF POISONING",
  "ADMITTED WARD/DIED AFTER TREATED (DAYS)",
  "OTHERS OUTCOMES",
  "No Kod KKM",
  "SIASATAN"
];

const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

function getGasWebAppUrl() {
  return localStorage.getItem("wehu_d_gas_url") || DEFAULT_GAS_WEB_APP_URL;
}

function renderD2CheckItem(section, item) {
  const singleAttr = item.singleGroup ? ` single-group" data-group="${item.singleGroup}` : "";
  if (item.inlineInputId) {
    return `
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
        <label class="wehu-check-label">
          <input type="checkbox" class="wehu-check${singleAttr}" data-section="${section}" data-item-id="${item.id}" value="${item.value || item.label}" />
          <span>${item.label}</span>
        </label>
        <input type="text" id="${item.inlineInputId}" class="underline-input" style="width:${item.inputWidth || "155px"};" placeholder="${item.placeholder || ""}" />
      </div>`;
  }
  return `
    <label class="wehu-check-label">
      <input type="checkbox" class="wehu-check${singleAttr}" data-section="${section}" data-item-id="${item.id}" value="${item.value || item.label}" />
      <span>${item.label}</span>
    </label>`;
}

function initD2Sections() {
  // Question 6: Pesticides
  const q6Left = [
    { id: "pest_paraquat", label: "Paraquat" },
    { id: "pest_glyphosate", label: "Glyphosate" },
    { id: "pest_organophos", label: "Organophosphate" },
    { id: "pest_carbamate", label: "Carbamate" },
    { id: "pest_thiocarb", label: "Thiocarbamate" },
    { id: "pest_organochlor", label: "Organochlorine" },
    { id: "pest_nitrophenol", label: "Nitrophenol" }
  ];
  const q6Right = [
    { id: "pest_24d", label: "2 - 4 - Dichlorophenoxyacetic Acid (2-4-D)" },
    { id: "pest_pyrethroid", label: "Pyrethroid" },
    { id: "pest_warfarin", label: "Warfarin" },
    { id: "pest_superwarfarin", label: "Superwarfarin" },
    { id: "pest_zinc", label: "Zinc phosphide" },
    { id: "pest_unknown", label: "Unknown" },
    { id: "pest_others", label: "Others (please specify) &nbsp; :", value: "Others", inlineInputId: "d2-pesticide-others", inputWidth: "155px" }
  ];

  document.getElementById("d2-q6-row").innerHTML = `
    <span class="d2-num">6.</span>
    <div class="d2-content">
      <div>If pesticide is the poisoning agent(s), please state type if known</div>
      <div class="d2-italic-note">(Tick <span class="tick-sample-box">&#10003;</span> more than one if mixture is used)</div>
      <div class="d2-check-2col">
        <div class="d2-check-list">${q6Left.map(i => renderD2CheckItem("pesticide_type", i)).join("")}</div>
        <div class="d2-check-list">${q6Right.map(i => renderD2CheckItem("pesticide_type", i)).join("")}</div>
      </div>
    </div>
  `;

  // Question 7: Chemicals
  const q7Left = [
    { id: "chem_pharma", label: "Therapeutic drugs (pharmaceutical)" },
    { id: "chem_metals", label: "Metals" },
    { id: "chem_gases", label: "Gases" },
    { id: "chem_agro", label: "Agrochemical (excluding pesticide)" },
    { id: "chem_solvents", label: "Solvents" }
  ];
  const q7Right = [
    { id: "chem_ind", label: "Other industrial chemical" },
    { id: "chem_household", label: "Household products (e.g. clorox)" },
    { id: "chem_kerosene", label: "Kerosene" },
    { id: "chem_unknown", label: "Unknown" }
  ];

  document.getElementById("d2-q7-row").innerHTML = `
    <span class="d2-num">7.</span>
    <div class="d2-content">
      <div>If chemical is the poisoning agent(s), please state type if known</div>
      <div class="d2-italic-note">(Tick <span class="tick-sample-box">&#10003;</span> more than one if mixture is used)</div>
      <div class="d2-check-2col">
        <div class="d2-check-list">${q7Left.map(i => renderD2CheckItem("chemical_type", i)).join("")}</div>
        <div class="d2-check-list">${q7Right.map(i => renderD2CheckItem("chemical_type", i)).join("")}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-top:1px;">
        <label class="wehu-check-label">
          <input type="checkbox" class="wehu-check" data-section="chemical_type" data-item-id="chem_others" value="Others" />
          <span>Others (please specify) &nbsp; :</span>
        </label>
        <input type="text" id="d2-chemical-others" class="underline-input" style="width:240px;" />
      </div>
    </div>
  `;

  // Question 8: Likely routes
  const q8List = [
    { id: "route_oral", label: "Oral" },
    { id: "route_dermal", label: "Dermal" },
    { id: "route_inhal", label: "Inhalation" },
    { id: "route_mixed", label: "Mixed" },
    { id: "route_others", label: "Others (please specify) :", value: "Others", inlineInputId: "d2-route-others", inputWidth: "135px" }
  ];

  document.getElementById("d2-q8-row").innerHTML = `
    <span class="d2-num">8.</span>
    <div class="d2-content">
      <div>Likely route (s) of poisoning :</div>
      <div class="d2-italic-note">(Tick <span class="tick-sample-box">&#10003;</span> more than one if mixed)</div>
      <div class="d2-check-list" style="margin-top:2px;">
        ${q8List.map(i => renderD2CheckItem("route_poisoning", i)).join("")}
      </div>
    </div>
  `;

  // Question 9: Circumstances
  const q9List = [
    { id: "circ_occ", label: "Occupational", singleGroup: "circumstances" },
    { id: "circ_suic", label: "Suicidal/ Parasuicidal", singleGroup: "circumstances" },
    { id: "circ_homi", label: "Homicidal", singleGroup: "circumstances" },
    { id: "circ_acc", label: "Accidental", singleGroup: "circumstances" }
  ];

  document.getElementById("d2-q9-row").innerHTML = `
    <span class="d2-num">9.</span>
    <div class="d2-content">
      <div>Circumstances of poisoning</div>
      <div class="d2-check-list" style="margin-top:8px;">
        ${q9List.map(i => renderD2CheckItem("circumstances", i)).join("")}
      </div>
    </div>
  `;
}

function initFieldBehaviors() {
  // Single-choice checkbox groups
  document.querySelectorAll(".wehu-check.single-group").forEach(cb => {
    cb.addEventListener("change", () => {
      if (cb.checked) {
        const grp = cb.dataset.group;
        document.querySelectorAll(`.wehu-check.single-group[data-group="${grp}"]`).forEach(other => {
          if (other !== cb) other.checked = false;
        });
      }
    });
  });

  // Auto-check corresponding checkbox when typing into specify/days inputs
  const autoCheckPairs = [
    ["d2-place-others", 'input[data-item-id="place_others"]'],
    ["d2-pesticide-others", 'input[data-item-id="pest_others"]'],
    ["d2-chemical-others", 'input[data-item-id="chem_others"]'],
    ["d2-pharma-specify", 'input[data-item-id="chem_pharma"]'],
    ["d2-route-others", 'input[data-item-id="route_others"]'],
    ["d2-lab-others", 'input[data-item-id="lab_others"]'],
    ["d2-admitted-days", 'input[data-item-id="outcome_admitted"]'],
    ["d2-died-days", 'input[data-item-id="outcome_died"]']
  ];
  autoCheckPairs.forEach(([inputId, cbSelector]) => {
    const inp = document.getElementById(inputId);
    const cb = document.querySelector(cbSelector);
    if (inp && cb) {
      inp.addEventListener("input", () => {
        if (inp.value.trim()) {
          cb.checked = true;
          cb.dispatchEvent(new Event("change"));
        }
      });
    }
  });

  // Quick facility helper for Part A Address
  const quickFac = document.getElementById("parta-quick-facility");
  if (quickFac) {
    quickFac.addEventListener("change", () => {
      if (quickFac.value) {
        const addr = document.getElementById("parta-address");
        addr.value = quickFac.value + ", KEDAH";
        quickFac.value = "";
      }
    });
  }

  // Auto-derive DOB from 12-digit Malaysian NRIC if DOB is empty
  const icInp = document.getElementById("partb-ic");
  const dobInp = document.getElementById("partb-dob");
  if (icInp && dobInp) {
    icInp.addEventListener("blur", () => {
      const clean = icInp.value.replace(/[^0-9]/g, "");
      if (clean.length === 12 && !dobInp.value.trim()) {
        const yy = parseInt(clean.slice(0, 2), 10);
        const mm = clean.slice(2, 4);
        const dd = clean.slice(4, 6);
        const mNum = parseInt(mm, 10);
        const dNum = parseInt(dd, 10);
        if (mNum >= 1 && mNum <= 12 && dNum >= 1 && dNum <= 31) {
          const fullYear = yy > 30 ? 1900 + yy : 2000 + yy;
          dobInp.value = `${dd}/${mm}/${fullYear}`;
        }
      }
    });
  }

  // Digits-only fields (Contact no., exposure/symptom duration boxes, ward days)
  document.querySelectorAll(".digits-only-input").forEach(inp => {
    inp.addEventListener("keydown", e => {
      const allowed = [
        "Backspace", "Delete", "Tab", "Escape", "Enter",
        "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"
      ];
      if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;
      if (!/^[0-9]$/.test(e.key)) e.preventDefault();
    });
    inp.addEventListener("input", () => {
      const cleaned = inp.value.replace(/[^0-9]/g, "");
      if (inp.value !== cleaned) inp.value = cleaned;
    });
    inp.addEventListener("paste", e => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData("text").replace(/[^0-9]/g, "");
      const s = inp.selectionStart || 0;
      const end = inp.selectionEnd || 0;
      inp.value = inp.value.slice(0, s) + pasted + inp.value.slice(end);
    });
  });

  // Auto-slash DD/MM/YYYY + Calendar Picker
  document.querySelectorAll(".date-slash-input").forEach(inp => {
    inp.addEventListener("keydown", e => {
      if (e.key === "Backspace" && inp.selectionStart === inp.selectionEnd) {
        const pos = inp.selectionStart;
        if (pos > 0 && inp.value[pos - 1] === "/") {
          e.preventDefault();
          inp.value = inp.value.slice(0, pos - 2) + inp.value.slice(pos);
          inp.setSelectionRange(pos - 2, pos - 2);
        }
      }
    });
    inp.addEventListener("input", () => {
      const digits = inp.value.replace(/[^0-9]/g, "").slice(0, 8);
      let formatted = digits;
      if (digits.length > 4) formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
      else if (digits.length > 2) formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
      if (inp.value !== formatted) inp.value = formatted;

      const nativeDate = document.querySelector(`input[type="date"][data-sync-target="${inp.id}"]`);
      if (nativeDate && /^\d{2}\/\d{2}\/\d{4}$/.test(formatted)) {
        const [dd, mm, yyyy] = formatted.split("/");
        nativeDate.value = `${yyyy}-${mm}-${dd}`;
      }
    });
  });

  document.querySelectorAll(".picker-icon-btn[data-picker-for]").forEach(btn => {
    const targetId = btn.dataset.pickerFor;
    const textInp = document.getElementById(targetId);
    const nativeDate = document.querySelector(`input[type="date"][data-sync-target="${targetId}"]`);
    if (!textInp || !nativeDate) return;

    btn.addEventListener("click", () => {
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(textInp.value)) {
        const [dd, mm, yyyy] = textInp.value.split("/");
        nativeDate.value = `${yyyy}-${mm}-${dd}`;
      }
      if (typeof nativeDate.showPicker === "function") nativeDate.showPicker();
      else {
        nativeDate.focus();
        nativeDate.click();
      }
    });

    nativeDate.addEventListener("change", () => {
      if (nativeDate.value) {
        const [yyyy, mm, dd] = nativeDate.value.split("-");
        textInp.value = `${dd}/${mm}/${yyyy}`;
      }
    });
  });

  // Auto-colon hh:mm + Clock Picker
  document.querySelectorAll(".time-colon-input").forEach(inp => {
    inp.addEventListener("keydown", e => {
      if (e.key === "Backspace" && inp.selectionStart === inp.selectionEnd) {
        const pos = inp.selectionStart;
        if (pos > 0 && inp.value[pos - 1] === ":") {
          e.preventDefault();
          inp.value = inp.value.slice(0, pos - 2) + inp.value.slice(pos);
          inp.setSelectionRange(pos - 2, pos - 2);
        }
      }
    });
    inp.addEventListener("input", () => {
      const digits = inp.value.replace(/[^0-9]/g, "").slice(0, 4);
      let formatted = digits;
      if (digits.length > 2) {
        let hh = Math.min(parseInt(digits.slice(0, 2), 10), 23);
        let mm = digits.length === 4 ? Math.min(parseInt(digits.slice(2, 4), 10), 59) : digits.slice(2);
        const hhStr = String(hh).padStart(2, "0");
        const mmStr = digits.length === 4 ? String(mm).padStart(2, "0") : String(mm);
        formatted = `${hhStr}:${mmStr}`;
      }
      if (inp.value !== formatted) inp.value = formatted;

      const nativeTime = document.querySelector(`input[type="time"][data-time-sync-target="${inp.id}"]`);
      if (nativeTime && /^\d{2}:\d{2}$/.test(formatted)) {
        nativeTime.value = formatted;
      }
    });
  });

  document.querySelectorAll(".picker-icon-btn[data-time-picker-for]").forEach(btn => {
    const targetId = btn.dataset.timePickerFor;
    const textInp = document.getElementById(targetId);
    const nativeTime = document.querySelector(`input[type="time"][data-time-sync-target="${targetId}"]`);
    if (!textInp || !nativeTime) return;

    btn.addEventListener("click", () => {
      if (/^\d{2}:\d{2}$/.test(textInp.value)) nativeTime.value = textInp.value;
      if (typeof nativeTime.showPicker === "function") nativeTime.showPicker();
      else {
        nativeTime.focus();
        nativeTime.click();
      }
    });

    nativeTime.addEventListener("change", () => {
      if (nativeTime.value) textInp.value = nativeTime.value.slice(0, 5);
    });
  });
}

function parseDdMmYyyy(str) {
  const s = String(str || "").trim();
  if (!s) return null;
  const parts = s.split(/[\/\-]/);
  if (parts.length !== 3) return null;
  if (parts[0].length === 4) {
    return { dd: parseInt(parts[2], 10), mm: parseInt(parts[1], 10), yyyy: parseInt(parts[0], 10) };
  }
  let yyyy = parseInt(parts[2], 10);
  if (parts[2].length === 2) yyyy = yyyy > 40 ? 1900 + yyyy : 2000 + yyyy;
  return { dd: parseInt(parts[0], 10), mm: parseInt(parts[1], 10), yyyy };
}

function formatAnyDateToDdMmYyyy(str) {
  const p = parseDdMmYyyy(str);
  if (!p || isNaN(p.dd) || isNaN(p.mm) || isNaN(p.yyyy)) return String(str || "").trim();
  return `${String(p.dd).padStart(2, "0")}/${String(p.mm).padStart(2, "0")}/${p.yyyy}`;
}

function computeAgeFromDob(dobStr, refDateStr) {
  const dob = parseDdMmYyyy(dobStr);
  if (!dob || isNaN(dob.yyyy)) return "";
  const ref = parseDdMmYyyy(refDateStr) || { yyyy: new Date().getFullYear(), mm: new Date().getMonth() + 1, dd: new Date().getDate() };
  let age = ref.yyyy - dob.yyyy;
  if (ref.mm < dob.mm || (ref.mm === dob.mm && ref.dd < dob.dd)) {
    age--;
  }
  return age >= 0 && age < 130 ? String(age) : "";
}

function computeAgeGroup(ageNum) {
  if (isNaN(ageNum) || ageNum <= 0) return "";
  if (ageNum < 20) return "< 20 YEARS";
  if (ageNum <= 29) return "20 - 29 YEARS";
  if (ageNum <= 39) return "30 - 39 YEARS";
  if (ageNum <= 49) return "40 - 49 YEARS";
  if (ageNum <= 59) return "50 - 59 YEARS";
  return ">= 60 YEARS";
}

function inferFacilityType(addrStr) {
  const up = String(addrStr || "").toUpperCase();
  if (!up) return "";
  if (up.includes("PKPD")) return "PKPD";
  if (up.includes("PKD")) return "PKD";
  if (up.includes("HOSPITAL")) return "HOSPITAL";
  if (up.includes("KLINIK KESIHATAN") || up.includes("KK ")) return "KLINIK KESIHATAN";
  return "OTHERS";
}

function getCheckedInSection(section) {
  return Array.from(document.querySelectorAll(`.wehu-check[data-section="${section}"]:checked`)).map(cb => cb.value);
}

function getMalaysiaTodayDdMmYyyy() {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kuala_Lumpur",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).formatToParts(new Date());
    const dd = parts.find(p => p.type === "day")?.value || "01";
    const mm = parts.find(p => p.type === "month")?.value || "01";
    const yyyy = parts.find(p => p.type === "year")?.value || "2026";
    return `${dd}/${mm}/${yyyy}`;
  } catch (_) {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
  }
}

function build64ColumnRow(rowNumber = "") {
  const todayStr = getMalaysiaTodayDdMmYyyy();

  const dateEntry = document.getElementById("reg-date-entry").value.trim() || todayStr;
  const caseCode = document.getElementById("reg-case-code").value.trim();

  // Part A - Notifier
  const notifierName = document.getElementById("parta-name").value.trim();
  const notifierDesig = document.getElementById("parta-designation").value.trim();
  const notifierAddr = document.getElementById("parta-address").value.replace(/\s*\n\s*/g, ", ").trim();
  const notifierContact = document.getElementById("parta-contact").value.replace(/[^0-9]/g, "");

  // Part B - Affected person
  const affectedName = document.getElementById("partb-name").value.trim();
  const dob = document.getElementById("partb-dob").value.trim();
  const diagDate = document.getElementById("partc-diag-date").value.trim();
  const ageStr = computeAgeFromDob(dob, diagDate || dateEntry);
  const ageGroup = computeAgeGroup(parseInt(ageStr, 10));
  const icPassport = document.getElementById("partb-ic").value.trim();

  const rawNat = document.getElementById("partb-nationality").value.trim().toUpperCase();
  const isMalaysian = !rawNat || rawNat === "MALAYSIA" || rawNat === "MALAYSIAN" || rawNat === "WARGANEGARA";
  const nationality = rawNat ? (isMalaysian ? rawNat : "OTHERS") : "";
  const othersNat = !isMalaysian && rawNat ? rawNat : "";

  const genderEl = document.querySelector('.wehu-check[data-group="gender"]:checked');
  const gender = genderEl ? genderEl.value : "";

  const ethnic = document.getElementById("partb-ethnic").value.trim();
  const occupation = document.getElementById("partb-occupation").value.trim();
  const occClass = document.getElementById("reg-occ-class").value.trim();
  const facType = document.getElementById("reg-facility-type").value.trim() || inferFacilityType(notifierAddr);
  const orgAddr = document.getElementById("partb-org").value.replace(/\s*\n\s*/g, ", ").trim();
  const incidentLoc = document.getElementById("partb-location").value.trim();
  const department = document.getElementById("reg-department").value.trim() || incidentLoc;
  const unit = document.getElementById("reg-unit").value.trim();
  const district = document.getElementById("partb-district").value.trim();
  const state = document.getElementById("partb-state").value.trim() || "KEDAH";

  // Part C
  const diagParsed = parseDdMmYyyy(diagDate);
  const monthOfDiag = diagParsed && diagParsed.mm >= 1 && diagParsed.mm <= 12 ? MONTH_NAMES[diagParsed.mm - 1] : "";
  const diagnosis = document.getElementById("partc-diagnosis").value.replace(/\s*\n\s*/g, " ").trim();

  // Part D
  const workDesc = [
    document.getElementById("partd-work-1").value.trim(),
    document.getElementById("partd-work-2").value.trim()
  ].filter(Boolean).join(" ");
  const hazardDesc = document.getElementById("partd-hazard").value.trim();
  const expDay = document.getElementById("partd-exp-day").value.trim();
  const expMonth = document.getElementById("partd-exp-month").value.trim();
  const expYear = document.getElementById("partd-exp-year").value.trim();
  const sympDay = document.getElementById("partd-symp-day").value.trim();
  const sympMonth = document.getElementById("partd-symp-month").value.trim();
  const sympYear = document.getElementById("partd-symp-year").value.trim();

  // Signature / Notification Date
  const notifDate = document.getElementById("sig-date").value.trim();
  const notifParsed = parseDdMmYyyy(notifDate);
  const monthOfNotif = notifParsed && notifParsed.mm >= 1 && notifParsed.mm <= 12 ? MONTH_NAMES[notifParsed.mm - 1] : "";

  // Page 2: WEHU - D2
  const occDate = document.getElementById("d2-occ-date").value.trim();
  const occTime = document.getElementById("d2-occ-time").value.trim();
  const statusCase = document.getElementById("reg-status-case").value.trim();

  const placeOcc = getCheckedInSection("place_occ").join("; ");
  const placeOthers = document.getElementById("d2-place-others").value.trim();
  const circumstances = getCheckedInSection("circumstances").join("; ");
  const tradeName = document.getElementById("d2-trade-name").value.trim();
  const activeIngred = document.getElementById("d2-active-ingredient").value.trim();
  const typePoisoning = getCheckedInSection("type_poisoning").join("; ");
  const typePesticide = getCheckedInSection("pesticide_type").join("; ");
  const otherPesticide = document.getElementById("d2-pesticide-others").value.trim();
  const typeChemical = getCheckedInSection("chemical_type").join("; ");
  const otherChemical = document.getElementById("d2-chemical-others").value.trim();
  const pharmaSpecify = document.getElementById("d2-pharma-specify").value.trim();

  const routes = getCheckedInSection("route_poisoning");
  const route1 = routes[0] || "";
  const route2 = routes[1] || "";
  const route3 = routes.slice(2).join("; ");
  const otherRoute = document.getElementById("d2-route-others").value.trim();

  const firstAid = getCheckedInSection("first_aid").join("; ");
  const labConfirm = getCheckedInSection("lab_confirm").join("; ");
  const otherLabConfirm = document.getElementById("d2-lab-others").value.trim();

  const outcome = getCheckedInSection("outcome").join("; ");
  const wardDays =
    document.getElementById("d2-admitted-days").value.trim() ||
    document.getElementById("d2-died-days").value.trim();
  const othersOutcome = document.getElementById("reg-others-outcome").value.trim();
  const kodKkm = document.getElementById("reg-kod-kkm").value.trim();
  const siasatan = document.getElementById("reg-siasatan").value.trim();

  return [
    rowNumber,        // 1. NO (A)
    dateEntry,        // 2. DATE OF ENTRY (B)
    caseCode,         // 3. CASE CODE (C)
    notifierName,     // 4. NAME OF NOTIFIER (D)
    notifierDesig,    // 5. DESIGNATION OF NOTIFIER (E)
    notifierAddr,     // 6. ADDRESS OF CLINIC/HOSPITAL OF NOTIFIER (F)
    notifierContact,  // 7. CONTACT NUMBER OF NOTIFIER (G)
    affectedName,     // 8. NAME OF AFFECTED PERSON (H)
    dob,              // 9. DATE OF BIRTH (I)
    ageStr,           // 10. AGE (J)
    ageGroup,         // 11. AGE GROUP (K)
    icPassport,       // 12. NEW IC /PASSPORT NO. (L)
    nationality,      // 13. NATIONALITY (M)
    othersNat,        // 14. OTHERS NATIONALITY (N)
    gender,           // 15. GENDER (O)
    ethnic,           // 16. ETHNIC GROUP (P)
    occupation,       // 17. OCCUPATION (Q)
    occClass,         // 18. OCCUPATIONAL CLASS (R)
    facType,          // 19. TYPE OF FACILITY (S)
    orgAddr,          // 20. NAME AND ADDRESS OF ORGANIZATION (T)
    department,       // 21. DEPARTMENT (U)
    unit,             // 22. UNIT (V)
    district,         // 23. DISTRICT (W)
    state,            // 24. STATE (X)
    diagDate,         // 25. DATE OF DIAGNOSIS (Y)
    monthOfDiag,      // 26. MONTH OF DIAGNOSIS (Z)
    diagnosis,        // 27. DIAGNOSIS/PROVISIONAL DIAGNOSIS (AA)
    workDesc,         // 28. WHAT KIND OF WORK... (AB)
    hazardDesc,       // 29. WHAT WAS THE HAZARDS... (AC)
    expDay,           // 30. EXPOSED (day) (AD)
    expMonth,         // 31. EXPOSED (month) (AE)
    expYear,          // 32. EXPOSED (years) (AF)
    sympDay,          // 33. SYMPTOMS (days) (AG)
    sympMonth,        // 34. SYMPTOMS (month) (AH)
    sympYear,         // 35. SYMPTOMS (years) (AI)
    notifDate,        // 36. DATE OF NOTIFICATION (AJ)
    monthOfNotif,     // 37. MONTH OF NOTIFICATION (AK)
    occDate,          // 38. DATE OF OCCURRENCE (AL)
    occTime,          // 39. TIME OF OCCURRENCE (AM)
    statusCase,       // 40. STATUS CASE (AN)
    placeOcc,         // 41. PLACE OF OCCURRENCE (AO)
    placeOthers,      // 42. OTHERS PLACE OF OCCURENCE (AP)
    circumstances,    // 43. CIRCUMSTANCES OF POISONING (AQ)
    tradeName,        // 44. TRADE NAME OF POISONING AGENT(S) (AR)
    activeIngred,     // 45. TRADE NAME OF ACTIVE INGREDIENT (AS)
    typePoisoning,    // 46. TYPE OF POISONING (AT)
    typePesticide,    // 47. TYPE OF PESTICIDE (AU)
    otherPesticide,   // 48. OTHER TYPE OF PESTICIDE (AV)
    typeChemical,     // 49. TYPE OF CHEMICAL (AW)
    otherChemical,    // 50. OTHER TYPE OF CHEMICAL (AX)
    pharmaSpecify,    // 51. IF PHARMACEUTICAL AGENTS, PLEASE INDICATE (AY)
    route1,           // 52. LIKELY ROUTE 1 (AZ)
    route2,           // 53. LIKELY ROUTE 2 (BA)
    route3,           // 54. LIKELY ROUTE 3 (BB)
    firstAid,         // 55. WAS FIRST AID GIVEN AT THE SITE OF POISONING? (BC)
    otherRoute,       // 56. OTHER ROUTE OF POISONING (BD)
    labConfirm,       // 57. IS POISONING CONFIRMED BY LAB INVESTIGATION? (BE)
    otherLabConfirm,  // 58. OTHER IF POISONING CONFIRMED (BF)
    outcome,          // 59. OUTCOME OF POISONING (BG)
    wardDays,         // 60. ADMITTED WARD/DIED AFTER TREATED (DAYS) (BH)
    othersOutcome,    // 61. OTHERS OUTCOMES (BI)
    kodKkm,           // 62. No Kod KKM (BJ)
    siasatan          // 63. SIASATAN (BK)
  ];
}

function showStatus(type, message) {
  const banner = document.getElementById("status-banner");
  const msgEl = document.getElementById("status-message");
  banner.className = `status-banner ${type}`;
  msgEl.textContent = message;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function clearAllFormFields() {
  document.getElementById("wehu-d-form").reset();
  document.getElementById("send-to-jkn").value = "KEDAH";
  document.getElementById("partb-state").value = "KEDAH";
  document.getElementById("partb-nationality").value = "MALAYSIA";

  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
  document.getElementById("reg-date-entry").value = todayStr;

  [
    "reg-case-code", "reg-occ-class", "reg-facility-type", "reg-department",
    "reg-unit", "reg-status-case", "d2-pharma-specify", "reg-others-outcome", "reg-kod-kkm", "reg-siasatan"
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  document.querySelectorAll(".wehu-check").forEach(cb => (cb.checked = false));
}

function resetForm() {
  clearAllFormFields();
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, "", window.location.pathname);
  }
  showStatus("info", "Borang telah dikosongkan.");
}

function setSelectOrDynamic(selectId, val) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  const clean = String(val || "").trim().toUpperCase();
  if (!clean) {
    sel.value = "";
    return;
  }
  const exists = Array.from(sel.options).some(o => o.value.toUpperCase() === clean);
  if (!exists) {
    const opt = document.createElement("option");
    opt.value = clean;
    opt.textContent = clean;
    sel.appendChild(opt);
  }
  sel.value = clean;
}

function restoreChecks(section, cellVal) {
  const raw = String(cellVal || "").trim();
  if (!raw) return;
  const tokens = raw.split(";").map(s => s.trim().toLowerCase()).filter(Boolean);
  document.querySelectorAll(`.wehu-check[data-section="${section}"]`).forEach(cb => {
    if (tokens.includes(cb.value.toLowerCase())) {
      cb.checked = true;
    }
  });
}

function populateFormFrom64Row(rawRow) {
  if (!Array.isArray(rawRow) || rawRow.length < 15) return;
  clearAllFormFields();

  const row = [];
  for (let i = 0; i < 63; i++) {
    row.push(String(rawRow[i] ?? "").replace(/^'/, "").trim());
  }

  document.getElementById("reg-date-entry").value = formatAnyDateToDdMmYyyy(row[1]);
  document.getElementById("reg-case-code").value = row[2];

  // Part A
  document.getElementById("parta-name").value = row[3];
  document.getElementById("parta-designation").value = row[4];
  document.getElementById("parta-address").value = row[5];
  document.getElementById("parta-contact").value = row[6].replace(/[^0-9]/g, "");
  document.getElementById("sig-notifier").value = row[3];

  // Part B
  document.getElementById("partb-name").value = row[7];
  document.getElementById("partb-dob").value = formatAnyDateToDdMmYyyy(row[8]);
  document.getElementById("partb-ic").value = row[11];
  document.getElementById("partb-nationality").value = row[12].toUpperCase() === "OTHERS" && row[13] ? row[13] : row[12];

  const genUp = row[14].toUpperCase();
  if (genUp === "MALE") document.getElementById("gender-male").checked = true;
  if (genUp === "FEMALE") document.getElementById("gender-female").checked = true;

  document.getElementById("partb-ethnic").value = row[15];
  document.getElementById("partb-occupation").value = row[16];
  document.getElementById("reg-occ-class").value = row[17];
  setSelectOrDynamic("reg-facility-type", row[18]);
  document.getElementById("partb-org").value = row[19];
  document.getElementById("reg-department").value = row[20];
  document.getElementById("partb-location").value = row[20];
  document.getElementById("reg-unit").value = row[21];
  setSelectOrDynamic("partb-district", row[22]);
  document.getElementById("partb-state").value = row[23] || "KEDAH";

  // Part C
  document.getElementById("partc-diag-date").value = formatAnyDateToDdMmYyyy(row[24]);
  document.getElementById("partc-diagnosis").value = row[26];

  // Part D
  if (row[27]) {
    if (row[27].length <= 85) {
      document.getElementById("partd-work-1").value = row[27];
    } else {
      document.getElementById("partd-work-1").value = row[27].slice(0, 85);
      document.getElementById("partd-work-2").value = row[27].slice(85).trim();
    }
  }
  document.getElementById("partd-hazard").value = row[28];
  document.getElementById("partd-exp-day").value = row[29];
  document.getElementById("partd-exp-month").value = row[30];
  document.getElementById("partd-exp-year").value = row[31];
  document.getElementById("partd-symp-day").value = row[32];
  document.getElementById("partd-symp-month").value = row[33];
  document.getElementById("partd-symp-year").value = row[34];

  document.getElementById("sig-date").value = formatAnyDateToDdMmYyyy(row[35]);

  // Page 2: WEHU - D2
  document.getElementById("d2-occ-date").value = formatAnyDateToDdMmYyyy(row[37]);
  document.getElementById("d2-occ-time").value = row[38];
  setSelectOrDynamic("reg-status-case", row[39]);

  restoreChecks("place_occ", row[40]);
  document.getElementById("d2-place-others").value = row[41];
  restoreChecks("circumstances", row[42]);
  document.getElementById("d2-trade-name").value = row[43];
  document.getElementById("d2-active-ingredient").value = row[44];
  restoreChecks("type_poisoning", row[45]);
  restoreChecks("pesticide_type", row[46]);
  document.getElementById("d2-pesticide-others").value = row[47];
  restoreChecks("chemical_type", row[48]);
  document.getElementById("d2-chemical-others").value = row[49];
  document.getElementById("d2-pharma-specify").value = row[50];

  const combinedRoutes = [row[51], row[52], row[53]].filter(Boolean).join("; ");
  restoreChecks("route_poisoning", combinedRoutes);
  restoreChecks("first_aid", row[54]);
  document.getElementById("d2-route-others").value = row[55];

  restoreChecks("lab_confirm", row[56]);
  document.getElementById("d2-lab-others").value = row[57];

  restoreChecks("outcome", row[58]);
  if (row[59]) {
    if (document.querySelector('input[data-item-id="outcome_died"]')?.checked) {
      document.getElementById("d2-died-days").value = row[59];
    } else {
      document.getElementById("d2-admitted-days").value = row[59];
    }
  }
  document.getElementById("reg-others-outcome").value = row[60];
  document.getElementById("reg-kod-kkm").value = row[61];
  setSelectOrDynamic("reg-siasatan", row[62]);

  const dispNo = row[0] ? `#${row[0]} ` : "";
  showStatus(
    "success",
    `Rekod ${dispNo}dibuka semula mengikut IC "${row[11]}" dan Tarikh Masuk "${row[1]}". Halaman WEHU-D1 & WEHU-D2 telah diisi.`
  );
}

function buildRekodLinkForRow(row) {
  const no = String(row[0] || "").trim();
  const dateEntry = String(row[1] || "").trim();
  const ic = String(row[11] || "").replace(/^'/, "").trim();
  if (!ic && !dateEntry) return "";
  const base = window.location.hostname.includes("github.io")
    ? PUBLIC_FORM_BASE_URL
    : window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  if (ic) params.set("ic", ic);
  if (dateEntry) params.set("date", dateEntry);
  if (no && no !== "(Auto)") params.set("no", no);
  const encodedRow = encodeURIComponent(row.slice(0, 63).map(v => String(v ?? "").replace(/^'/, "")).join("|~|"));
  return `${base}?${params.toString()}#d=${encodedRow}`;
}

function colIndexToLetter(idx) {
  let n = idx;
  let res = "";
  while (n >= 0) {
    res = String.fromCharCode(65 + (n % 26)) + res;
    n = Math.floor(n / 26) - 1;
  }
  return res;
}

function openPreviewModal() {
  const row = build64ColumnRow("(Auto)");
  const rekodLink = buildRekodLinkForRow(row);
  const allHeaders = [...WEHU_D_64_HEADERS, "Rekod_Link"];
  const allValues = [...row, rekodLink];

  const container = document.getElementById("preview-table-container");
  let html = `<table style="width:100%;border-collapse:collapse;font-size:12.3px;">
    <thead>
      <tr style="background:#1e293b;color:#fff;text-align:left;">
        <th style="padding:8px 10px;width:75px;">Lajur</th>
        <th style="padding:8px 10px;width:46%;">Pemboleh Ubah (Google Sheet WEHU_D)</th>
        <th style="padding:8px 10px;">Nilai Semasa</th>
      </tr>
    </thead>
    <tbody>`;

  allHeaders.forEach((h, idx) => {
    const colLetter = colIndexToLetter(idx);
    const val = allValues[idx] || "";
    const bg = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
    const cellHtml = idx === 63 && val
      ? `<a href="${val}" style="color:#2563eb;text-decoration:underline;word-break:break-all;">Buka Borang (Pautan Rekod_Link)</a>`
      : (val || "—");
    html += `<tr style="background:${bg};border-bottom:1px solid #e2e8f0;">
      <td style="padding:6px 10px;font-weight:700;color:#2563eb;">${colLetter} (${idx + 1})</td>
      <td style="padding:6px 10px;font-weight:600;color:#0f172a;">${h}</td>
      <td style="padding:6px 10px;color:${val ? "#065f46" : "#94a3b8"};font-family:monospace;">${cellHtml}</td>
    </tr>`;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
  document.getElementById("preview-modal").classList.add("open");
}

function fillDemoData() {
  clearAllFormFields();
  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

  document.getElementById("reg-date-entry").value = todayStr;
  document.getElementById("reg-case-code").value = "KDH/WEHUD/2026/001";
  document.getElementById("reg-occ-class").value = "AGRICULTURAL & FISHERY WORKERS";
  document.getElementById("reg-facility-type").value = "HOSPITAL";
  document.getElementById("reg-department").value = "LADANG PADI KUBANG PASU";
  document.getElementById("reg-unit").value = "OPERASI SEMBURAN";
  document.getElementById("reg-status-case").value = "CONFIRMED";
  document.getElementById("reg-kod-kkm").value = "KKM/JKNK/HSB/2026/09";
  document.getElementById("reg-siasatan").value = "DALAM SIASATAN";

  // Part A
  document.getElementById("parta-name").value = "DR. AHMad FAIZ BIN ZAINAL".toUpperCase();
  document.getElementById("parta-designation").value = "PEGAWAI PERUBATAN UD48";
  document.getElementById("parta-address").value = "JABATAN KECEMASAN & TRAUMA, HOSPITAL SULTANAH BAHIYAH, ALOR SETAR, KEDAH";
  document.getElementById("parta-contact").value = "0134567890";

  // Part B
  document.getElementById("partb-name").value = "MOHD HAFIZ BIN ISMAIL";
  document.getElementById("partb-dob").value = "21/07/1988";
  document.getElementById("partb-ic").value = "880721025431";
  document.getElementById("partb-nationality").value = "MALAYSIA";
  document.getElementById("gender-male").checked = true;
  document.getElementById("partb-ethnic").value = "MELAYU";
  document.getElementById("partb-occupation").value = "PEKERJA SEMBURAN RACUN PERTANIAN";
  document.getElementById("partb-org").value = "SYARIKAT PERTANIAN MAJU JAYA, JITRA, KEDAH";
  document.getElementById("partb-district").value = "KUBANG PASU";
  document.getElementById("partb-state").value = "KEDAH";
  document.getElementById("partb-location").value = "SAWAH PADI BLOK C, JITRA";

  // Part C & D
  document.getElementById("partc-diag-date").value = todayStr;
  document.getElementById("partc-diagnosis").value = "ACUTE ORGANOPHOSPHATE PESTICIDE POISONING";
  document.getElementById("partd-work-1").value = "MEMBANCUH DAN MENYEMBUR RACUN SERANGGA DI KAWASAN SAWAH PADI TANPA PPE LENGKAP";
  document.getElementById("partd-hazard").value = "CHLORPYRIFOS (ORGANOPHOSPHATE INSECTICIDE)";
  document.getElementById("partd-exp-day").value = "3";
  document.getElementById("partd-exp-month").value = "0";
  document.getElementById("partd-exp-year").value = "2";
  document.getElementById("partd-symp-day").value = "2";
  document.getElementById("partd-symp-month").value = "0";
  document.getElementById("partd-symp-year").value = "0";

  document.getElementById("sig-notifier").value = "DR. AHMAD FAIZ BIN ZAINAL";
  document.getElementById("sig-date").value = todayStr;
  document.getElementById("attending-doctor").value = "DR. AHMAD FAIZ BIN ZAINAL\nJABATAN KECEMASAN, HOSPITAL SULTANAH BAHIYAH";

  // Page 2: WEHU - D2
  document.getElementById("d2-occ-date").value = todayStr;
  document.getElementById("d2-occ-time").value = "10:30";
  document.querySelector('.wehu-check[data-section="place_occ"][value="Workplace"]').checked = true;
  document.getElementById("d2-trade-name").value = "DURSBAN 75";
  document.getElementById("d2-active-ingredient").value = "CHLORPYRIFOS";
  document.querySelector('.wehu-check[data-section="type_poisoning"][value="Pesticide"]').checked = true;
  document.querySelector('.wehu-check[data-item-id="pest_organophos"]').checked = true;
  document.querySelector('.wehu-check[data-item-id="route_inhal"]').checked = true;
  document.querySelector('.wehu-check[data-item-id="route_dermal"]').checked = true;
  document.querySelector('.wehu-check[data-item-id="circ_occ"]').checked = true;
  document.querySelector('.wehu-check[data-section="first_aid"][value="Yes"]').checked = true;
  document.querySelector('.wehu-check[data-section="lab_confirm"][value="Yes"]').checked = true;
  document.querySelector('.wehu-check[data-item-id="outcome_admitted"]').checked = true;
  document.getElementById("d2-admitted-days").value = "4";

  showStatus("info", "Contoh data lengkap telah diisi pada WEHU-D1 dan WEHU-D2. Klik 'Semak 65 Lajur' atau 'Hantar ke Google Sheet'.");
}

function fetchRowViaGvizJsonp(targetIc, targetDate, targetNo) {
  return new Promise((resolve, reject) => {
    const cbName = "__wehuDGvizCb_" + Date.now();
    const script = document.createElement("script");
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Masa menunggu sambungan Google Sheet tamat."));
    }, 10000);

    function cleanup() {
      clearTimeout(timer);
      delete window[cbName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[cbName] = function (resp) {
      cleanup();
      try {
        if (!resp || resp.status === "error" || !resp.table || !resp.table.rows) {
          reject(new Error("Tidak dapat membaca jadual Google Sheet WEHU_D."));
          return;
        }
        const normIc = String(targetIc || "").replace(/^'/, "").trim().toUpperCase();
        const normDate = String(targetDate || "").trim();
        const normNo = String(targetNo || "").trim();

        const rows = resp.table.rows.map(r => {
          const arr = [];
          for (let i = 0; i < 63; i++) {
            const cell = r.c && r.c[i];
            const val = cell ? (cell.f != null ? String(cell.f) : (cell.v != null ? String(cell.v) : "")) : "";
            arr.push(val.replace(/^'/, "").trim());
          }
          return arr;
        });

        for (let i = rows.length - 1; i >= 0; i--) {
          const r = rows[i];
          const icOk = !normIc || r[11].toUpperCase() === normIc || r[11].toUpperCase().startsWith(normIc);
          const dateOk = !normDate || formatAnyDateToDdMmYyyy(r[1]) === formatAnyDateToDdMmYyyy(normDate);
          const noOk = !normNo || r[0] === normNo;
          if (icOk && dateOk && noOk) {
            resolve(r);
            return;
          }
        }
        reject(new Error(`Tiada rekod dijumpai bagi IC "${targetIc}" dan Tarikh "${targetDate}".`));
      } catch (e) {
        reject(e);
      }
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Gagal memuatkan data daripada Google Sheet WEHU_D."));
    };

    script.src = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=responseHandler:${cbName}&sheet=${encodeURIComponent(SHEET_NAME)}`;
    document.head.appendChild(script);
  });
}

async function lookupAndLoadRecord(ic, dateEntry, no = "") {
  const cleanIc = String(ic || "").replace(/^'/, "").trim();
  const cleanDate = String(dateEntry || "").trim();
  if (!cleanIc && !no) {
    showStatus("error", "Sila masukkan NEW IC / PASSPORT NO. dan DATE OF ENTRY (dd/mm/yyyy).");
    return;
  }

  showStatus("info", `Sedang mencari rekod bagi IC "${cleanIc}" dan Tarikh "${cleanDate}"...`);

  const gasUrl = getGasWebAppUrl();
  if (gasUrl) {
    try {
      const q = new URLSearchParams();
      if (cleanIc) q.set("ic", cleanIc);
      if (cleanDate) q.set("date", cleanDate);
      if (no) q.set("no", no);
      const resp = await fetch(`${gasUrl}?${q.toString()}`, { method: "GET", redirect: "follow" });
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.ok && Array.isArray(data.row)) {
          populateFormFrom64Row(data.row);
          return;
        }
      }
    } catch (_) {}
  }

  try {
    const row = await fetchRowViaGvizJsonp(cleanIc, cleanDate, no);
    populateFormFrom64Row(row);
  } catch (err) {
    showStatus("error", err.message);
  }
}

function handleInitialUrlRecordLoad() {
  const params = new URLSearchParams(window.location.search);
  const ic = params.get("ic") || "";
  const dateEntry = params.get("date") || "";
  const no = params.get("no") || "";

  const hash = window.location.hash || "";
  if (hash.startsWith("#d=")) {
    try {
      const decoded = decodeURIComponent(hash.slice(3));
      const cols = decoded.split("|~|");
      if (cols.length >= 60) {
        populateFormFrom64Row(cols);
        return;
      }
    } catch (err) {
      console.error("Failed to decode Rekod_Link payload:", err);
    }
  }

  if (ic || no) {
    lookupAndLoadRecord(ic, dateEntry, no);
  }
}

async function submitToGoogleSheet() {
  const btn = document.getElementById("btn-submit");
  const affectedName = document.getElementById("partb-name").value.trim();
  if (!affectedName) {
    showStatus("error", "Sila isi sekurang-kurangnya medan 'Part B - Name (Affected person)' sebelum menghantar.");
    return;
  }

  // Automatically stamp DATE OF ENTRY (dd/mm/yyyy) at the exact moment of submission
  const submissionDate = getMalaysiaTodayDdMmYyyy();
  document.getElementById("reg-date-entry").value = submissionDate;

  const rowValues = build64ColumnRow("").map((val, idx) => {
    if (idx === 1) return submissionDate;
    // Preserve leading zeros in Google Sheets for Notifier Contact (idx 6) and Affected IC/Passport (idx 11)
    if ((idx === 6 || idx === 11) && typeof val === "string" && /^0\d+$/.test(val)) {
      return "'" + val;
    }
    return val;
  });

  const isLocalServer = window.location.protocol.startsWith("http") &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const gasUrl = getGasWebAppUrl();

  if (!isLocalServer && !gasUrl) {
    document.getElementById("gas-modal").classList.add("open");
    showStatus("error", "Sila masukkan URL Google Apps Script Web App (/exec) pada tetapan 'Sambungan Apps Script' terlebih dahulu.");
    return;
  }

  btn.disabled = true;
  const origText = btn.textContent;
  btn.textContent = "Menghantar...";

  try {
    let result = null;
    if (isLocalServer) {
      const resp = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row: rowValues, gasUrl })
      });
      result = await resp.json();
      if (!resp.ok || !result.ok) {
        throw new Error((result && result.error) || "Ralat semasa menghantar melalui pelayan tempatan.");
      }
    } else {
      const resp = await fetch(gasUrl, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ row: rowValues })
      });
      result = await resp.json();
      if (!resp.ok || !result.ok) {
        throw new Error((result && result.error) || "Ralat semasa menghantar ke Google Apps Script.");
      }
    }

    showStatus(
      "success",
      `Berjaya! Rekod (NO: ${result.rowNumber}) untuk "${affectedName}" telah dimasukkan ke dalam Google Sheet WEHU_D.`
    );
  } catch (err) {
    showStatus("error", "Gagal menghantar: " + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = origText;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initD2Sections();
  initFieldBehaviors();

  const today = new Date();
  document.getElementById("reg-date-entry").value =
    `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
  document.getElementById("send-to-jkn").value = "KEDAH";
  document.getElementById("partb-state").value = "KEDAH";
  if (!document.getElementById("partb-nationality").value.trim()) {
    document.getElementById("partb-nationality").value = "MALAYSIA";
  }
  document.getElementById("gas-url-input").value = getGasWebAppUrl();

  // Page navigation
  document.querySelectorAll(".page-nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".page-nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.page;
      document.querySelectorAll(".form-page").forEach(page => {
        if (target === "all" || page.dataset.pageNum === target) {
          page.classList.remove("hidden-page");
        } else {
          page.classList.add("hidden-page");
        }
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Modals
  document.getElementById("btn-extra-meta").addEventListener("click", () => {
    document.getElementById("extra-modal").classList.add("open");
  });
  document.getElementById("btn-close-extra").addEventListener("click", () => {
    document.getElementById("extra-modal").classList.remove("open");
  });
  document.getElementById("btn-save-extra").addEventListener("click", () => {
    document.getElementById("extra-modal").classList.remove("open");
  });

  document.getElementById("btn-open-record").addEventListener("click", () => {
    document.getElementById("lookup-modal").classList.add("open");
  });
  document.getElementById("btn-close-lookup").addEventListener("click", () => {
    document.getElementById("lookup-modal").classList.remove("open");
  });
  document.getElementById("btn-cancel-lookup").addEventListener("click", () => {
    document.getElementById("lookup-modal").classList.remove("open");
  });
  document.getElementById("btn-do-lookup").addEventListener("click", () => {
    const ic = document.getElementById("lookup-ic").value.trim();
    const dt = document.getElementById("lookup-date").value.trim();
    document.getElementById("lookup-modal").classList.remove("open");
    lookupAndLoadRecord(ic, dt);
  });

  document.getElementById("btn-gas-config").addEventListener("click", () => {
    document.getElementById("gas-url-input").value = getGasWebAppUrl();
    document.getElementById("gas-modal").classList.add("open");
  });
  document.getElementById("btn-close-gas").addEventListener("click", () => {
    document.getElementById("gas-modal").classList.remove("open");
  });
  document.getElementById("btn-cancel-gas").addEventListener("click", () => {
    document.getElementById("gas-modal").classList.remove("open");
  });
  document.getElementById("btn-save-gas").addEventListener("click", () => {
    const u = document.getElementById("gas-url-input").value.trim();
    if (u) localStorage.setItem("wehu_d_gas_url", u);
    else localStorage.removeItem("wehu_d_gas_url");
    document.getElementById("gas-modal").classList.remove("open");
    showStatus("success", "URL Google Apps Script telah disimpan.");
  });

  document.getElementById("btn-demo").addEventListener("click", fillDemoData);
  document.getElementById("btn-reset").addEventListener("click", resetForm);
  document.getElementById("btn-preview-row").addEventListener("click", openPreviewModal);
  document.getElementById("btn-close-preview").addEventListener("click", () => {
    document.getElementById("preview-modal").classList.remove("open");
  });
  document.getElementById("btn-print").addEventListener("click", () => window.print());
  document.getElementById("btn-submit").addEventListener("click", submitToGoogleSheet);

  handleInitialUrlRecordLoad();
});

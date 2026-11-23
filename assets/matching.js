/* StudyBridge matching helpers. Preference fit is never an admissions or award decision. */
(function (root) {
  "use strict";
  const FIELD_TERMS = {
    "Business and management": ["business", "management", "analytics", "economics"],
    "Marketing and communications": ["marketing", "communications", "media"],
    "Computer science and AI": ["computer", "artificial intelligence", "machine learning", "data", "information science"],
    "Engineering": ["engineering", "hydrology", "robotics", "technology"],
    "Health and medicine": ["health", "medical", "medicine", "biology"],
    "Law and public policy": ["law", "policy", "governance", "regulation"],
    "Science and environment": ["science", "environment", "water", "earth", "ecological"],
    "Arts and humanities": ["arts", "humanities", "history", "language"],
    "Education": ["education", "learning", "teaching"]
  };
  const DESTINATION_ALPHA3 = { CA:"CAN", FR:"FRA", DE:"DEU", UK:"GBR", US:"USA", MA:"MAR", ES:"ESP", NL:"NLD", AU:"AUS", JP:"JPN" };

  function programmeFit(record, preferences) {
    const p = preferences || {};
    const reasons = [];
    const checks = [];
    if (p.level) {
      if (record.degree_level === p.level) reasons.push("Study level matches your preference");
      else checks.push("Study level differs from your saved preference");
    }
    if (p.destination && p.destination !== "multiple") {
      const code3 = DESTINATION_ALPHA3[p.destination];
      const destinations = record.delivery_countries || [];
      if (destinations.includes(p.destination) || (code3 && destinations.includes(code3))) reasons.push("Study destination matches your preference");
      else checks.push("Your preferred destination is not listed among the confirmed delivery countries");
    }
    if (p.field && p.field !== "Other / undecided") {
      const terms = FIELD_TERMS[p.field] || [];
      const corpus = (record.study_fields || []).join(" ").toLowerCase();
      if (terms.some(term => corpus.includes(term))) reasons.push("Subject area is related to your interest");
      else checks.push("Subject fit needs a closer look");
    }
    if (p.language && p.language !== "Other") {
      if (!record.teaching_language) checks.push("Teaching language has not been verified");
      else if (String(record.teaching_language).toLowerCase().includes(p.language.toLowerCase())) reasons.push("Teaching language matches your preference");
      else checks.push("Teaching language differs from your preference");
    }
    if (p.intake && p.intake !== "Flexible") {
      const intake = String(record.intake || "");
      if (intake.includes(p.intake)) reasons.push("Intake timing matches your preference");
      else if (intake) checks.push("Confirm whether this programme has your preferred intake");
    }
    if (!reasons.length && !checks.length) checks.push("Add preferences to see why this programme may fit");
    return { matched: reasons.length > 0 && !checks.some(x => /differs|not listed/.test(x)), reasons, checks,
      label: reasons.length ? "Preference fit" : "Needs review",
      disclaimer: "This is a preference match only. It does not assess academic admission requirements or guarantee acceptance." };
  }

  function scholarshipNationalityFit(record, selectedNationalities, residence) {
    const selected = Array.isArray(selectedNationalities) ? selectedNationalities : [];
    const notes = [];
    if (!selected.length) return { status:"not_checked", label:"Select a nationality to check", notes:["Nationality has not been selected."] };
    if (record.verification_status !== "verified") return { status:"unknown", label:"Eligibility needs verification", notes:["This record is not marked as fully verified."] };
    if (["closed","expired"].includes(record.application_status) || record.verification_status === "closed" || record.verification_status === "expired") {
      return { status:"cycle_closed", label:"Past or closed cycle", notes:["This cycle is not currently open; nationality fit is not presented as an active opportunity."] };
    }
    const eligible = record.eligible_nationalities || [];
    const excluded = record.excluded_nationalities || [];
    const groups = record.eligible_nationality_groups || [];
    const excludedSelected = selected.filter(code => excluded.includes(code));
    const includedSelected = selected.filter(code => eligible.includes(code));
    if (excludedSelected.length) {
      return { status:"unknown", label:"Possible nationality restriction — confirm with provider",
        notes:["A selected nationality appears in the provider's exclusion list: " + excludedSelected.join(", ") + ".",
          "Multiple-citizenship rules can affect the result; StudyBridge cannot resolve this automatically."] };
    }
    if (groups.length && !eligible.includes("ALL")) {
      return { status:"unknown", label:"Nationality group requires manual verification",
        notes:["The provider uses a nationality group or country list that has not been mapped to each selected nationality.",
          "Check the official eligible-country list and dual-citizenship rules."] };
    }
    if (!eligible.includes("ALL") && !includedSelected.length) {
      return { status:"no_match", label:"No confirmed nationality match",
        notes:["None of the selected nationalities appears in the record's verified nationality list."] };
    }
    if (selected.length > 1 && !eligible.includes("ALL")) {
      return { status:"unknown", label:"Possible nationality match — dual citizenship needs checking",
        notes:["At least one selected nationality is listed, but the record does not establish how the provider treats multiple citizenships."] };
    }
    const residency = record.eligible_residencies || [];
    if (residency.length && !residence) {
      return { status:"unknown", label:"Nationality match — residence not checked",
        notes:["The provider lists residence conditions. Select your current country of residence separately."] };
    }
    if (residency.length && residence && !residency.includes("ALL") && !residency.includes(residence)) {
      return { status:"no_match", label:"Residence does not match listed countries",
        notes:["Your selected country of residence is not in the provider's listed eligible-residence countries."] };
    }
    return { status:"possible_match", label:"Listed nationality match — other conditions apply",
      notes:["This is not a confirmation of eligibility. Check academic, age, residence, prior-study and application-route conditions with the provider."] };
  }

  root.StudyBridgeMatching = { programmeFit, scholarshipNationalityFit };
  if (typeof module !== "undefined" && module.exports) module.exports = root.StudyBridgeMatching;
})(typeof globalThis !== "undefined" ? globalThis : this);

"use strict";
const assert = require("node:assert/strict");
const { programmeFit, scholarshipNationalityFit } = require("../assets/matching.js");

const programme = { degree_level:"postgraduate", delivery_countries:["CA"], study_fields:["Business analytics","Management"], teaching_language:null, intake:"July 2027" };
const fit = programmeFit(programme, { level:"postgraduate", destination:"CA", field:"Business and management", language:"English", intake:"2027" });
assert.ok(fit.reasons.includes("Study level matches your preference"));
assert.ok(fit.reasons.includes("Study destination matches your preference"));
assert.ok(fit.reasons.includes("Subject area is related to your interest"));
assert.ok(fit.checks.includes("Teaching language has not been verified"));

const base = { verification_status:"verified", application_status:"open", eligible_nationalities:["COD"], eligible_nationality_groups:[], excluded_nationalities:[], eligible_residencies:[] };
assert.equal(scholarshipNationalityFit(base, ["COD"], "").status, "possible_match");
assert.equal(scholarshipNationalityFit(base, ["COD","CAN"], "").status, "unknown");
assert.equal(scholarshipNationalityFit({...base, eligible_nationality_groups:["Non-EEA countries"], eligible_nationalities:[]}, ["COD"], "").status, "unknown");
assert.equal(scholarshipNationalityFit({...base, eligible_nationality_groups:["African participating countries"]}, ["COD"], "").status, "possible_match");
assert.equal(scholarshipNationalityFit({...base, excluded_nationalities:["COD"]}, ["COD"], "").status, "unknown");
assert.equal(scholarshipNationalityFit({...base, application_status:"closed"}, ["COD"], "").status, "cycle_closed");
assert.equal(scholarshipNationalityFit(base, [], "").status, "not_checked");
console.log("StudyBridge matching tests passed.");

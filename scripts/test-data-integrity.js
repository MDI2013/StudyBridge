#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const universities = JSON.parse(fs.readFileSync(path.join(root, "data/universities.json"), "utf8")).universities;
const programmes = JSON.parse(fs.readFileSync(path.join(root, "data/programmes.json"), "utf8")).programmes;
const errors = [];
const byId = new Map(universities.map(item => [item.id, item]));
const partnerRecords = universities.filter(item =>
  typeof item.review_notes === "string" &&
  item.review_notes.startsWith("Added as a verified partner institution in an official joint master's programme.")
);
const referenced = new Set();

for (const programme of programmes) {
  for (const id of programme.partner_institution_ids || []) {
    const institution = byId.get(id);
    if (!institution) {
      errors.push(programme.id + ": partner institution reference " + id + " does not exist");
      continue;
    }
    if (partnerRecords.includes(institution)) {
      referenced.add(id);
      if (!(programme.partner_institutions || []).includes(institution.name)) {
        errors.push(programme.id + ": partner_institutions is missing the name for " + id);
      }
    }
  }
}

for (const institution of partnerRecords) {
  if (!referenced.has(institution.id)) {
    errors.push(institution.id + ": consortium partner is not linked from any programme");
  }
}

if (partnerRecords.length !== 6) errors.push("expected six consortium-only partner institutions");


const languageScript = fs.readFileSync(path.join(root, "assets/site.js"), "utf8");
for (const token of ["sb-lg", "sb-language-picker", "fr:{", "es:{", "new MutationObserver", "function applyLanguage"]) {
  if (!languageScript.includes(token)) errors.push("shared language system is missing required feature: " + token);
}
for (const page of ["index.html", "scholarships.html", "programmes.html", "profile.html", "tracker.html"]) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  if (!html.includes('src="assets/site.js"')) errors.push(page + ": shared language/navigation script is not loaded");
}

const homepage = fs.readFileSync(path.join(root, "index.html"), "utf8");
const arrayStart = homepage.indexOf("const U=[");
const arrayEnd = homepage.indexOf("].map((u,i)=>", arrayStart);
if (arrayStart < 0 || arrayEnd < 0) {
  errors.push("homepage university finder data array could not be inspected");
} else {
  try {
    const finderRecords = JSON.parse(homepage.slice(arrayStart + "const U=".length, arrayEnd + 1));
    if (finderRecords.length !== 36) errors.push("homepage finder must contain 36 institution records");
    const normalised = homepage.slice(arrayEnd, homepage.indexOf("const S=", arrayEnd));
    if (!normalised.includes('fee:null,l:"Not verified",fl:[]')) {
      errors.push("homepage finder must suppress unverified legacy tuition, language and subject claims");
    }
  } catch (error) {
    errors.push("homepage finder data must remain valid JSON-compatible data: " + error.message);
  }
}

if (errors.length) {
  console.error("StudyBridge cross-dataset integrity failed:");
  errors.forEach(error => console.error(" - " + error));
  process.exit(1);
}
console.log("StudyBridge cross-dataset integrity passed: " + partnerRecords.length + " consortium partners linked to programme records.");

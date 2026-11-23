#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const file = path.join(__dirname, "..", "data", "scholarships.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const errors = [];
const ids = new Set();
const allowedVerification = new Set(["verified", "needs_review", "expired", "closed"]);
const allowedApplication = new Set(["open", "upcoming", "closed", "not_announced", "varies", "unknown"]);
const allowedLevels = new Set(["undergraduate", "postgraduate"]);
const allowedDualCitizenshipPolicies = new Set(["provider_unspecified", "non_african_disqualifies", "single_nationality_only", "manual_confirmation_required"]);
const isoDate = /^\d{4}-\d{2}-\d{2}$/;
const alpha3 = code => code === "ALL" || /^[A-Z]{3}$/.test(code);
const isUrl = value => {
  try { return new URL(value).protocol === "https:"; }
  catch { return false; }
};

if (!Array.isArray(data.scholarships)) errors.push("scholarships must be an array");

for (const [index, item] of (data.scholarships || []).entries()) {
  const label = item.id || "record #" + (index + 1);
  for (const field of ["id", "title", "provider", "official_application_url", "official_source_url", "last_verified", "verification_status", "application_status"]) {
    if (!item[field]) errors.push(label + ": missing " + field);
  }
  if (ids.has(item.id)) errors.push(label + ": duplicate id");
  ids.add(item.id);
  if (!allowedVerification.has(item.verification_status)) errors.push(label + ": invalid verification_status");
  if (!allowedApplication.has(item.application_status)) errors.push(label + ": invalid application_status");
  if (item.last_verified && !isoDate.test(item.last_verified)) errors.push(label + ": last_verified must use YYYY-MM-DD");
  if (item.deadline && !isoDate.test(item.deadline)) errors.push(label + ": deadline must use YYYY-MM-DD or null");
  for (const field of ["eligible_nationalities", "excluded_nationalities", "eligible_residencies", "host_countries"]) {
    if (!Array.isArray(item[field])) errors.push(label + ": " + field + " must be an array");
    else if (!item[field].every(alpha3)) errors.push(label + ": invalid country code in " + field);
  }
  if (!Array.isArray(item.study_levels) || !item.study_levels.every(x => allowedLevels.has(x))) {
    errors.push(label + ": study_levels must contain only undergraduate/postgraduate");
  }
  for (const field of ["official_application_url", "official_source_url"]) {
    if (item[field] && !isUrl(item[field])) errors.push(label + ": " + field + " must be an HTTPS URL");
  }
  if (item.dual_citizenship_policy && !allowedDualCitizenshipPolicies.has(item.dual_citizenship_policy)) errors.push(label + ": invalid dual_citizenship_policy");
  if (item.verification_status === "verified" && (!item.official_source_url || !item.last_verified)) {
    errors.push(label + ": verified records require an official source and last_verified date");
  }
}

if (errors.length) {
  console.error("Scholarship data validation failed:");
  errors.forEach(error => console.error(" - " + error));
  process.exit(1);
}

console.log("Scholarship data validation passed: " + ids.size + " records checked.");

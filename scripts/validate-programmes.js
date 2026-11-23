#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const file = path.join(__dirname, "..", "data", "programmes.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const errors = [];
const ids = new Set();
const statuses = new Set(["open", "upcoming", "closed", "not_announced", "unknown"]);
const levels = new Set(["undergraduate", "postgraduate"]);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const https = value => {
  try { return new URL(value).protocol === "https:"; }
  catch { return false; }
};

if (!Array.isArray(data.programmes)) errors.push("programmes must be an array");

for (const [index, item] of (data.programmes || []).entries()) {
  const label = item.id || "record #" + (index + 1);
  for (const field of ["id", "title", "qualification", "degree_level", "application_status", "official_programme_url", "official_admissions_url", "official_source_url", "last_verified", "verification_status"]) {
    if (item[field] === undefined || item[field] === null || item[field] === "") errors.push(label + ": missing " + field);
  }
  if (ids.has(item.id)) errors.push(label + ": duplicate id");
  ids.add(item.id);
  if (!levels.has(item.degree_level)) errors.push(label + ": invalid degree_level");
  if (!statuses.has(item.application_status)) errors.push(label + ": invalid application_status");
  if (item.last_verified && !datePattern.test(item.last_verified)) errors.push(label + ": last_verified must use YYYY-MM-DD");
  if (item.application_deadline && !datePattern.test(item.application_deadline)) errors.push(label + ": application_deadline must use YYYY-MM-DD or null");
  if (item.ects !== null && item.ects !== undefined && (!Number.isInteger(item.ects) || item.ects <= 0)) errors.push(label + ": ects must be a positive integer or null");
  for (const field of ["official_programme_url", "official_admissions_url", "official_source_url"]) {
    if (item[field] && !https(item[field])) errors.push(label + ": " + field + " must be an HTTPS URL");
  }
  for (const field of ["study_fields", "delivery_countries", "partner_institutions"]) {
    if (!Array.isArray(item[field])) errors.push(label + ": " + field + " must be an array");
  }
}

if (errors.length) {
  console.error("Programme data validation failed:");
  errors.forEach(error => console.error(" - " + error));
  process.exit(1);
}
console.log("Programme data validation passed: " + ids.size + " records checked.");

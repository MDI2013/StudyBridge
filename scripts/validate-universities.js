#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const file = path.join(__dirname, "..", "data", "universities.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const errors = [];
const ids = new Set();
const levels = new Set(["undergraduate", "postgraduate"]);
const statuses = new Set(["needs_review", "reviewed", "published", "archived"]);
const https = value => {
  try { return new URL(value).protocol === "https:"; }
  catch { return false; }
};

if (!Array.isArray(data.universities)) errors.push("universities must be an array");

for (const [index, item] of (data.universities || []).entries()) {
  const label = item.id || "record #" + (index + 1);
  for (const field of ["id", "name", "country_code", "official_website", "record_status"]) {
    if (!item[field]) errors.push(label + ": missing " + field);
  }
  if (ids.has(item.id)) errors.push(label + ": duplicate id");
  ids.add(item.id);
  if (item.country_code && !/^[A-Z]{2}$/.test(item.country_code)) errors.push(label + ": country_code must be ISO alpha-2");
  if (item.official_website && !https(item.official_website)) errors.push(label + ": official_website must be HTTPS");
  if (!statuses.has(item.record_status)) errors.push(label + ": invalid record_status");
  if (!Array.isArray(item.degree_levels) || !item.degree_levels.every(level => levels.has(level))) {
    errors.push(label + ": degree_levels must contain only undergraduate/postgraduate");
  }
  if (!item.tuition || !("amount" in item.tuition)) errors.push(label + ": tuition.amount field is required (use null when unknown)");
  if (item.tuition && item.tuition.amount !== null && (typeof item.tuition.amount !== "number" || item.tuition.amount < 0)) {
    errors.push(label + ": tuition.amount must be a non-negative number or null");
  }
}

if (errors.length) {
  console.error("University data validation failed:");
  errors.forEach(error => console.error(" - " + error));
  process.exit(1);
}
console.log("University data validation passed: " + ids.size + " records checked.");

#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const pages = ["index.html", "scholarships.html", "programmes.html", "profile.html", "tracker.html"];
const errors = [];

for (const page of pages) {
  const file = path.join(root, page);
  if (!fs.existsSync(file)) {
    errors.push(page + ": file not found");
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
  if (!scripts.length) errors.push(page + ": no inline script found");
  for (const [index, match] of scripts.entries()) {
    try {
      new Function(match[1]);
    } catch (error) {
      errors.push(page + ": inline script " + (index + 1) + " syntax error: " + error.message);
    }
  }
  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    const target = match[1];
    if (/^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(target)) continue;
    const pathname = target.split(/[?#]/)[0];
    if (!pathname) continue;
    if (!fs.existsSync(path.join(root, pathname))) errors.push(page + ": missing local asset/link " + pathname);
  }
  for (const match of html.matchAll(/fetch\(["']([^"']+)["']\)/gi)) {
    const target = match[1];
    if (/^https?:/i.test(target)) continue;
    if (!fs.existsSync(path.join(root, target))) errors.push(page + ": missing local data file " + target);
  }
}

if (errors.length) {
  console.error("StudyBridge page validation failed:");
  errors.forEach(error => console.error(" - " + error));
  process.exit(1);
}
console.log("StudyBridge page validation passed: " + pages.length + " pages checked.");

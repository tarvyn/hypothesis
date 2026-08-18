#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const client = path.join(dist, "client");
const server = path.join(dist, "server");

const readGlobal = (file, key) => {
  const sandbox = {window:{}};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, {filename:path.basename(file)});
  return sandbox.window[key];
};

const registryPath = path.join(root, "companies", "registry.js");
const registry = readGlobal(registryPath, "COMPANY_REGISTRY");
if (!registry?.companies?.length) throw new Error("The company registry is empty.");

fs.rmSync(dist, {recursive:true, force:true});
fs.mkdirSync(client, {recursive:true});
fs.mkdirSync(server, {recursive:true});

const copies = [
  ["index.html", path.join(client, "index.html")],
  ["styles.css", path.join(client, "styles.css")],
  ["app.js", path.join(client, "app.js")],
  ["og.png", path.join(client, "og.png")],
  [path.join("worker", "index.js"), path.join(server, "index.js")],
];

for (const [from, to] of copies) fs.copyFileSync(path.join(root, from), to);

fs.cpSync(path.join(root, "src"), path.join(client, "src"), {recursive:true});
fs.cpSync(path.join(root, "schemas"), path.join(client, "schemas"), {recursive:true});
fs.mkdirSync(path.join(client, "companies"), {recursive:true});
fs.copyFileSync(registryPath, path.join(client, "companies", "registry.js"));

for (const company of registry.companies) {
  const from = path.join(root, "companies", company.slug);
  const to = path.join(client, "companies", company.slug);
  fs.cpSync(from, to, {
    recursive:true,
    filter:source => path.basename(source) !== "validate.js",
  });
}

console.log(`Built ${registry.companies.length} registered company route(s) to ${dist}`);

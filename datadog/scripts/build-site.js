#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const client = path.join(dist, "client");
const server = path.join(dist, "server");

fs.rmSync(dist, {recursive:true, force:true});
fs.mkdirSync(path.join(client, "data"), {recursive:true});
fs.mkdirSync(server, {recursive:true});

const copies = [
  ["index.html", path.join(client, "index.html")],
  ["styles.css", path.join(client, "styles.css")],
  ["app.js", path.join(client, "app.js")],
  ["og.png", path.join(client, "og.png")],
  [path.join("data", "companies.js"), path.join(client, "data", "companies.js")],
  [path.join("worker", "index.js"), path.join(server, "index.js")],
];

for(const [from, to] of copies){
  fs.copyFileSync(path.join(root, from), to);
}

fs.cpSync(path.join(root, "companies"), path.join(client, "companies"), {recursive:true});

console.log(`Built static site to ${dist}`);

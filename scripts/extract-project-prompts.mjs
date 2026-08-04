#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const PROJECT_CWD = "/Users/tarasvynnychuk/Projects/personal/hypothesis";
const OUTPUT = path.join(PROJECT_CWD, "FINANCIAL_ANALYSIS_PROMPTS.md");
const CODEX_DIR = path.join(os.homedir(), ".codex");
const SEARCH_ROOTS = [
  path.join(CODEX_DIR, "sessions"),
  path.join(CODEX_DIR, "archived_sessions"),
];

function walkJsonl(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkJsonl(full));
    else if (entry.isFile() && entry.name.endsWith(".jsonl")) files.push(full);
  }
  return files;
}

function readEvents(file) {
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line)];
      } catch {
        return [];
      }
    });
}

function userText(event) {
  if (
    event.type !== "response_item" ||
    event.payload?.type !== "message" ||
    event.payload?.role !== "user"
  ) {
    return null;
  }

  return (event.payload.content ?? [])
    .filter((part) => part.type === "input_text")
    .map((part) => part.text ?? "")
    .join("\n")
    .trim();
}

function cleanPrompt(raw) {
  if (!raw) return null;
  if (raw.startsWith("<recommended_plugins>")) return null;
  if (/^<environment_context>[\s\S]*<\/environment_context>$/.test(raw)) return null;

  const attachments = [];
  const filesBlock = raw.match(/# Files mentioned by the user:\s*([\s\S]*?)\s*## My request for Codex:/);
  if (filesBlock) {
    for (const match of filesBlock[1].matchAll(/^##\s+(.+?):\s+(.+)$/gm)) {
      attachments.push(`${match[1]} — ${match[2]}`);
    }
  }

  let prompt = raw;
  const requestMarker = "## My request for Codex:";
  if (prompt.includes(requestMarker)) {
    prompt = prompt.slice(prompt.lastIndexOf(requestMarker) + requestMarker.length);
  }

  prompt = prompt
    .replace(/<image\b[^>]*>[\s\S]*?<\/image>/gi, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/^\s+|\s+$/g, "");

  if (!prompt || prompt.startsWith("<environment_context>")) return null;
  return { prompt, attachments };
}

function oneLine(value, max = 110) {
  const line = value.replace(/\s+/g, " ").trim();
  return line.length > max ? `${line.slice(0, max - 1)}…` : line;
}

function safeFence(value) {
  return value.replaceAll("`````", "````\\`");
}

const sessions = [];
for (const file of SEARCH_ROOTS.flatMap(walkJsonl)) {
  const events = readEvents(file);
  const meta = events.find((event) => event.type === "session_meta")?.payload;
  if (!meta || meta.cwd !== PROJECT_CWD || meta.thread_source !== "user") continue;

  const prompts = events.flatMap((event) => {
    const raw = userText(event);
    const cleaned = cleanPrompt(raw);
    return cleaned ? [{ timestamp: event.timestamp, ...cleaned }] : [];
  });

  if (!prompts.length) continue;
  sessions.push({
    id: meta.id,
    timestamp: meta.timestamp,
    file,
    prompts,
    label: oneLine(prompts[0].prompt, 90),
  });
}

sessions.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

const occurrences = sessions.flatMap((session) =>
  session.prompts.map((item, index) => ({
    ...item,
    sessionId: session.id,
    sessionDate: session.timestamp.slice(0, 10),
    index: index + 1,
  })),
);

const unique = new Map();
for (const item of occurrences) {
  const key = item.prompt.replace(/\s+/g, " ").trim();
  const record = unique.get(key) ?? { prompt: item.prompt, count: 0, uses: [] };
  record.count += 1;
  record.uses.push(`${item.sessionDate}/${item.sessionId}`);
  unique.set(key, record);
}

const lines = [
  "# Архів промптів проєкту Hypothesis",
  "",
  "> Автоматично зібрано з локальних кореневих чатів Codex у цьому проєкті. Службові блоки `environment_context`, `recommended_plugins`, ambient browser state та image-теги вилучено. Назви й шляхи вкладень збережено окремо. Субагентські внутрішні промпти не включено.",
  "",
  `- Кореневих чатів із user prompts: **${sessions.length}**`,
  `- Усього user prompts: **${occurrences.length}**`,
  `- Унікальних очищених формулювань: **${unique.size}**`,
  `- Період: **${sessions[0]?.timestamp.slice(0, 10) ?? "—"} — ${sessions.at(-1)?.timestamp.slice(0, 10) ?? "—"}**`,
  "",
  "## Як користуватися архівом",
  "",
  "Пошук за `Balance Sheet`, `Income Statement`, `Cash Flow`, `SBC`, `R&D`, `CapEx`, `ROIC`, `WACC`, `margin`, `yellow flags`, `moat`, `management` швидко веде до відповідних шаблонів. Довгі forensic prompts збережені повністю. Короткі команди й уточнення також залишені, щоб історія не втрачала контекст.",
  "",
  "## Хронологічний журнал",
  "",
];

for (const session of sessions) {
  lines.push(
    `### ${session.timestamp.slice(0, 10)} · ${session.label}`,
    "",
    `Session: \`${session.id}\` · prompts: ${session.prompts.length}`,
    "",
  );

  session.prompts.forEach((item, index) => {
    lines.push(
      "<details>",
      `<summary>${index + 1}. ${oneLine(item.prompt)}</summary>`,
      "",
    );
    if (item.attachments.length) {
      lines.push("Вкладення:", "");
      for (const attachment of item.attachments) lines.push(`- ${attachment}`);
      lines.push("");
    }
    lines.push("`````text", safeFence(item.prompt), "`````", "", "</details>", "");
  });
}

lines.push("## Повторно використані промпти", "");
const reused = [...unique.values()].filter((item) => item.count > 1);
if (!reused.length) {
  lines.push("Точних повторів після нормалізації пробілів не знайдено.", "");
} else {
  for (const item of reused.sort((a, b) => b.count - a.count)) {
    lines.push(
      `- **${item.count}×** — ${oneLine(item.prompt, 160)}`,
      `  - Використано: ${item.uses.map((use) => `\`${use}\``).join(", ")}`,
    );
  }
  lines.push("");
}

fs.writeFileSync(OUTPUT, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ output: OUTPUT, sessions: sessions.length, prompts: occurrences.length, unique: unique.size }));

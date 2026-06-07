import fs from "node:fs/promises";
import path from "node:path";

const SRC_ROOT = path.resolve(process.cwd(), "src");
const TARGET_EXTENSIONS = new Set([".ts", ".tsx", ".js"]);
const SKIP_DIRECTORIES = new Set(["node_modules", ".next"]);
const QUOTE_CAPTURE = "([\"'`])";

const RAW_MAPPINGS = [
  ["/VibhagRoute/AcademicCouncil24", "/departments/academic-council"],
  ["/VibhagRoute/Prabandhan24", "/departments/prabandhan"],
  ["/VibhagRoute/Prachar24", "/departments/prachar"],
  ["/VibhagRoute/Sampark24", "/departments/sampark"],
  ["/VibhagRoute/Vitt24", "/departments/vitt"],
  ["/shikshamahakumbh2024digitalmedia", "/media/shiksha-mahakumbh/2024/digital"],
  ["/shikshamahakumbh2023digitalmedia", "/media/shiksha-mahakumbh/2023/digital"],
  ["/shikshakumbh2024digitalmedia", "/media/shiksha-kumbh/2024/digital"],
  ["/shikshakumbh2023digitalmedia", "/media/shiksha-kumbh/2023/digital"],
  ["/printmediashikshamahakumbh2024", "/media/shiksha-mahakumbh/2024/print"],
  ["/printmediashikshamahakumbh2023", "/media/shiksha-mahakumbh/2023/print"],
  ["/printmediashikshakumbh2024", "/media/shiksha-kumbh/2024/print"],
  ["/printmediashikshakumbh2023", "/media/shiksha-kumbh/2023/print"],
  ["/shikshamahakumbh2024digitalmedia", "/media/shiksha-mahakumbh/2024/digital"],
  ["/shikshamahakumbh2023digitalmedia", "/media/shiksha-mahakumbh/2023/digital"],
  ["/upcomingevent", "/upcoming-events"],
  ["/Wishes_Received", "/wishes-received"],
  ["/committeepage", "/committees"],
  ["/Press_Release", "/press"],
  ["/commingsoon", "/coming-soon"],
  ["/Accomodation", "/accommodation"],
  ["/pastevent", "/past-events"],
  ["/ContactUs", "/contact-us"],
  ["/Best_Wishes", "/best-wishes"],
  ["/Press1", "/press/baton-ceremony-smk-4"],
  ["/Press2", "/press/shiksha-mahakumbh-4-0"],
  ["/Press3", "/press/residential-camp-success"],
  ["/Press4", "/press/residential-camp-hindi"],
  ["/Press5", "/press/national-coverage"],
  ["/Press6", "/press/education-summit-coverage"],
  ["/Press7", "/press/mahakumbh-programme-update"],
  ["/Press8", "/press/education-movement"],
  ["/Press9", "/press/summit-highlights"]
];

const deduped = Array.from(new Map(RAW_MAPPINGS.map((entry) => [entry[0], entry])).values());

const MAPPINGS = deduped
  .sort((a, b) => b[0].length - a[0].length)
  .map(([oldValue, newValue]) => ({
    oldValue,
    newValue,
    quotedPattern: new RegExp(QUOTE_CAPTURE + escapeRegExp(oldValue) + "\\1", "g"),
    hasNoSlashVariant: oldValue.startsWith("/") && newValue.startsWith("/") && oldValue.length > 1,
    noSlashOld: oldValue.startsWith("/") ? oldValue.slice(1) : oldValue,
    noSlashNew: newValue.startsWith("/") ? newValue.slice(1) : newValue
  }));

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
}

function isTargetFile(filePath) {
  return TARGET_EXTENSIONS.has(path.extname(filePath));
}

function isSitemapFile(filePath) {
  const normalized = filePath.replace(/\\\\/g, "/").toLowerCase();
  return normalized.includes("/sitemap") || normalized.endsWith("sitemap.ts") || normalized.endsWith("sitemap.js");
}

async function walkDirectory(dirPath, collectedFiles = []) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_DIRECTORIES.has(entry.name)) {
        continue;
      }
      await walkDirectory(fullPath, collectedFiles);
      continue;
    }

    if (entry.isFile() && isTargetFile(fullPath)) {
      collectedFiles.push(fullPath);
    }
  }

  return collectedFiles;
}

function replaceWithCounter(input, pattern, replacementBuilder) {
  let count = 0;
  const output = input.replace(pattern, (...args) => {
    count += 1;
    return replacementBuilder(...args);
  });
  return { output, count };
}

function applyReplacements(content, filePath) {
  let updated = content;
  const perMappingCounts = new Map();

  for (const mapping of MAPPINGS) {
    const quotedResult = replaceWithCounter(updated, mapping.quotedPattern, (match, quote) => {
      return `${quote}${mapping.newValue}${quote}`;
    });

    updated = quotedResult.output;

    if (quotedResult.count > 0) {
      perMappingCounts.set(mapping.oldValue, (perMappingCounts.get(mapping.oldValue) || 0) + quotedResult.count);
    }

    if (!isSitemapFile(filePath) || !mapping.hasNoSlashVariant || mapping.noSlashOld === mapping.noSlashNew) {
      continue;
    }

    const sitemapPattern = new RegExp(QUOTE_CAPTURE + escapeRegExp(mapping.noSlashOld) + "\\1", "g");
    const sitemapResult = replaceWithCounter(updated, sitemapPattern, (match, quote) => {
      return `${quote}${mapping.noSlashNew}${quote}`;
    });

    updated = sitemapResult.output;

    if (sitemapResult.count > 0) {
      perMappingCounts.set(mapping.oldValue, (perMappingCounts.get(mapping.oldValue) || 0) + sitemapResult.count);
    }
  }

  return { updated, perMappingCounts };
}

async function run() {
  const filePaths = await walkDirectory(SRC_ROOT);
  const filesChanged = [];
  const globalCounts = new Map();
  let totalReplacements = 0;

  for (const filePath of filePaths) {
    const original = await fs.readFile(filePath, "utf8");
    const { updated, perMappingCounts } = applyReplacements(original, filePath);

    if (updated === original) {
      continue;
    }

    await fs.writeFile(filePath, updated, "utf8");

    let fileReplacementCount = 0;
    for (const [oldValue, count] of perMappingCounts.entries()) {
      fileReplacementCount += count;
      globalCounts.set(oldValue, (globalCounts.get(oldValue) || 0) + count);
      totalReplacements += count;
    }

    filesChanged.push({
      filePath,
      fileReplacementCount
    });
  }

  console.log(`Scanned ${filePaths.length} files under src/.`);
  console.log(`Changed ${filesChanged.length} files.`);
  console.log(`Total replacements: ${totalReplacements}.`);

  if (filesChanged.length > 0) {
    console.log("\nFiles changed:");
    for (const item of filesChanged) {
      const relativePath = path.relative(process.cwd(), item.filePath).replace(/\\\\/g, "/");
      console.log(`- ${relativePath} (${item.fileReplacementCount})`);
    }
  }

  if (globalCounts.size > 0) {
    console.log("\nReplacement totals:");
    const sorted = [...globalCounts.entries()].sort((a, b) => b[1] - a[1]);
    for (const [oldValue, count] of sorted) {
      const mapping = MAPPINGS.find((entry) => entry.oldValue === oldValue);
      console.log(`- ${oldValue} -> ${mapping?.newValue ?? ""}: ${count}`);
    }
  }
}

run().catch((error) => {
  console.error("Migration failed:", error);
  process.exitCode = 1;
});

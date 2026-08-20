import { BUILD_VERSION } from "../config/build.js?v=0.13.72";
import { PROFILE_VERSION, migrateProfile } from "./profile.js?v=0.13.72";

export const SAVE_FORMAT = "wwe-legacy-save";
export const SAVE_FORMAT_VERSION = 1;
export const SAVE_FILENAME = "WWE-Legacy-Save.json";
export const IMPORT_ROLLBACK_KEY = "wwe-legacy-import-rollback-v1";
export const BACKUP_META_KEY = "wwe-legacy-backup-meta-v1";

const clone = value => JSON.parse(JSON.stringify(value));

export function createSaveEnvelope(profile, now = new Date()) {
  if (!profile) throw new Error("No WWE Legacy profile is available to back up.");
  return {
    format: SAVE_FORMAT,
    formatVersion: SAVE_FORMAT_VERSION,
    slot: "primary",
    exportedAt: now.toISOString(),
    buildVersion: BUILD_VERSION,
    profile: clone(profile)
  };
}

export function serializeSave(profile, now = new Date()) {
  return JSON.stringify(createSaveEnvelope(profile, now), null, 2);
}

function candidateProfile(parsed) {
  if (parsed?.format === SAVE_FORMAT) {
    if (Number(parsed.formatVersion) > SAVE_FORMAT_VERSION) throw new Error("This backup was created by a newer WWE Legacy save format.");
    return { profile: parsed.profile, envelope: parsed };
  }
  // Accept a raw historical profile export as a recovery convenience.
  return { profile: parsed, envelope: null };
}

export function validateAndMigrateSave(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("That file is not a WWE Legacy save.");
  const { profile: rawProfile, envelope } = candidateProfile(parsed);
  if (!rawProfile || typeof rawProfile !== "object" || Array.isArray(rawProfile)) throw new Error("The backup does not contain a WWE Legacy profile.");
  const sourceVersion = Number(rawProfile.version) || 0;
  if (sourceVersion > PROFILE_VERSION) throw new Error("This backup comes from a newer WWE Legacy build. Update the game before importing it.");
  const migrated = migrateProfile(rawProfile);
  if (!migrated) throw new Error("The profile could not be validated. No progress was changed.");
  if (!Array.isArray(migrated.unlockedSuperstars) || !migrated.unlockedSuperstars.includes(migrated.starterId)) throw new Error("The backup failed Superstar validation.");
  if (!migrated.ownedCards || typeof migrated.ownedCards !== "object") throw new Error("The backup failed Collection validation.");
  if (!migrated.savedDecks || typeof migrated.savedDecks !== "object") throw new Error("The backup failed Deck Lab validation.");
  return {
    profile: migrated,
    sourceProfileVersion: sourceVersion,
    exportedAt: envelope?.exportedAt ?? null,
    sourceBuildVersion: envelope?.buildVersion ?? null,
    formatVersion: envelope?.formatVersion ?? 0
  };
}

export function parseSaveText(text) {
  if (typeof text !== "string" || !text.trim()) throw new Error("The selected save file is empty.");
  if (text.length > 12_000_000) throw new Error("That file is too large to be a WWE Legacy save.");
  let parsed;
  try { parsed = JSON.parse(text); }
  catch { throw new Error("The selected file is not valid JSON."); }
  return validateAndMigrateSave(parsed);
}

export function saveImportRollback(profile, storage = globalThis.localStorage) {
  if (!storage || !profile) return false;
  storage.setItem(IMPORT_ROLLBACK_KEY, JSON.stringify({ createdAt: new Date().toISOString(), profile: clone(profile) }));
  return true;
}

export function loadImportRollback(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(IMPORT_ROLLBACK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const migrated = migrateProfile(parsed?.profile);
    return migrated ? { createdAt: parsed.createdAt ?? null, profile: migrated } : null;
  } catch { return null; }
}

export function clearImportRollback(storage = globalThis.localStorage) {
  storage?.removeItem(IMPORT_ROLLBACK_KEY);
}

export function backupMetadata(storage = globalThis.localStorage) {
  try { return JSON.parse(storage?.getItem(BACKUP_META_KEY) ?? "null"); }
  catch { return null; }
}

export function markBackupPrepared(method, storage = globalThis.localStorage) {
  const meta = { lastBackupAt: new Date().toISOString(), method: String(method || "file") };
  storage?.setItem(BACKUP_META_KEY, JSON.stringify(meta));
  return meta;
}

export async function exportSaveToFiles(profile, env = globalThis) {
  const text = serializeSave(profile);
  const blob = new Blob([text], { type: "application/json" });

  // Browsers with the explicit save picker can select the existing primary file
  // and replace it in place. Safari/iOS falls through to the native share sheet.
  if (typeof env.showSaveFilePicker === "function") {
    const handle = await env.showSaveFilePicker({
      suggestedName: SAVE_FILENAME,
      types: [{ description: "WWE Legacy Save", accept: { "application/json": [".json"] } }]
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    markBackupPrepared("file-picker", env.localStorage);
    return { method: "file-picker", filename: SAVE_FILENAME };
  }

  const file = new File([blob], SAVE_FILENAME, { type: "application/json" });
  if (env.navigator?.share && (!env.navigator.canShare || env.navigator.canShare({ files: [file] }))) {
    await env.navigator.share({ title: "WWE Legacy Save", text: "WWE Legacy primary save backup", files: [file] });
    markBackupPrepared("share-sheet", env.localStorage);
    return { method: "share-sheet", filename: SAVE_FILENAME };
  }

  const url = env.URL.createObjectURL(blob);
  try {
    const a = env.document.createElement("a");
    a.href = url;
    a.download = SAVE_FILENAME;
    a.rel = "noopener";
    env.document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    env.setTimeout?.(() => env.URL.revokeObjectURL(url), 1000);
  }
  markBackupPrepared("download", env.localStorage);
  return { method: "download", filename: SAVE_FILENAME };
}

export async function readSaveFile(file) {
  if (!file) throw new Error("No save file was selected.");
  const text = await file.text();
  return parseSaveText(text);
}

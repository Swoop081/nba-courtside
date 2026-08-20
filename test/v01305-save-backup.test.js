import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createProfile, PROFILE_VERSION } from '../js/data/profile.js?v=0.13.72';
import { SAVE_FILENAME, SAVE_FORMAT, SAVE_FORMAT_VERSION, createSaveEnvelope, serializeSave, parseSaveText, saveImportRollback, loadImportRollback, clearImportRollback } from '../js/data/save-backup.js?v=0.13.72';

class MemoryStorage {
  constructor(){ this.map=new Map(); }
  getItem(k){ return this.map.has(k)?this.map.get(k):null; }
  setItem(k,v){ this.map.set(k,String(v)); }
  removeItem(k){ this.map.delete(k); }
}

test('v0.13.5 uses one stable primary backup filename rather than timestamped exports',()=>{
  assert.equal(SAVE_FILENAME,'WWE-Legacy-Save.json');
  assert.doesNotMatch(SAVE_FILENAME,/\d{4}-\d{2}-\d{2}/);
  const p=createProfile('cm-punk');
  const env=createSaveEnvelope(p,new Date('2026-08-18T01:23:45.000Z'));
  assert.equal(env.format,SAVE_FORMAT);
  assert.equal(env.formatVersion,SAVE_FORMAT_VERSION);
  assert.equal(env.slot,'primary');
  assert.equal(env.exportedAt,'2026-08-18T01:23:45.000Z');
});

test('v0.13.5 exported save round-trips through validation and migration',()=>{
  const p=createProfile('roman-reigns');
  p.universePoints=4321;
  const parsed=parseSaveText(serializeSave(p,new Date('2026-08-18T02:00:00.000Z')));
  assert.equal(parsed.profile.starterId,'roman-reigns');
  assert.equal(parsed.profile.universePoints,4321);
  assert.equal(parsed.profile.version,PROFILE_VERSION);
  assert.equal(parsed.exportedAt,'2026-08-18T02:00:00.000Z');
});

test('v0.13.5 rejects malformed and future-version saves before current progress can be overwritten',()=>{
  assert.throws(()=>parseSaveText('{nope'),/not valid JSON/);
  const p=createProfile('cm-punk');
  p.version=PROFILE_VERSION+1;
  assert.throws(()=>parseSaveText(JSON.stringify({format:SAVE_FORMAT,formatVersion:SAVE_FORMAT_VERSION,profile:p})),/newer WWE Legacy build/);
});

test('v0.13.5 preserves a one-step rollback snapshot around imports',()=>{
  const storage=new MemoryStorage();
  const before=createProfile('cm-punk'); before.universePoints=100;
  assert.equal(saveImportRollback(before,storage),true);
  const rollback=loadImportRollback(storage);
  assert.equal(rollback.profile.starterId,'cm-punk');
  assert.equal(rollback.profile.universePoints,100);
  clearImportRollback(storage);
  assert.equal(loadImportRollback(storage),null);
});

test('v0.13.5 My Legacy exposes backup/import controls and fixed-file replacement guidance',()=>{
  const app=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');
  assert.match(app,/SAVE & BACKUP/);
  assert.match(app,/BACK UP TO FILES/);
  assert.match(app,/IMPORT FROM FILES/);
  assert.match(app,/REPLACE CURRENT SAVE/);
  assert.match(app,/replace the existing backup rather than create dated copies/);
  assert.match(css,/\.save-backup-panel/);
});

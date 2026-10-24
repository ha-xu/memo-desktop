const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const COLORS = ['cream', 'sage', 'lavender', 'rose', 'sky'];
const {translate}=require('./i18n.cjs');
const {languages}=require('./languages.cjs');
const defaults = { language:'system', theme: 'system', autoStart: false, startHidden: false, defaultColor: 'cream', defaultPinned: false, mcpEnabled: true, edgeDock: true };
class Store {
  constructor(file) {
    this.file = file;
    this.data = { notes: [], settings: { ...defaults } };
    if (fs.existsSync(file)) {
      const saved = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (!Array.isArray(saved.notes)) throw new Error(translate('errors.data'));
      this.data = { notes: saved.notes.map(note=>({...note,starred:note.starred===true})), settings: { ...defaults, ...saved.settings } };
    } else {
      this.create({title:translate('notes.heading',this.data.settings.language),content:translate('notes.emptyContent',this.data.settings.language),color:'cream'});
    }
  }
  save() { fs.mkdirSync(path.dirname(this.file), {recursive:true}); const temp = this.file + '.tmp'; fs.writeFileSync(temp, JSON.stringify(this.data, null, 2)); fs.renameSync(temp, this.file); }
  get(id) { const note = this.data.notes.find(n => n.id === id); if (!note) throw new Error(translate('errors.missing',this.data.settings.language)); return note; }
  fields(input) {
    const out = {};
    for (const key of ['title', 'content']) if (input[key] !== undefined) {
      if (typeof input[key] !== 'string' || input[key].length > (key === 'title' ? 200 : 1000000)) throw new Error(translate('errors.invalid',this.data.settings.language));
      out[key] = input[key];
    }
    if (input.color !== undefined) { if (!COLORS.includes(input.color)) throw new Error(translate('errors.invalid',this.data.settings.language)); out.color = input.color; }
    for (const key of ['pinned', 'locked', 'starred', 'visible']) if (input[key] !== undefined) { if (typeof input[key] !== 'boolean') throw new Error(translate('errors.invalid',this.data.settings.language)); out[key] = input[key]; }
    return out;
  }
  create(input = {}) {
    const note = { id: randomUUID(), title: translate('common.untitled',this.data.settings.language), content: '', color: this.data.settings.defaultColor, pinned: this.data.settings.defaultPinned, locked: false, starred: false, visible: false, createdAt: Date.now(), updatedAt: Date.now(), ...this.fields(input) };
    this.data.notes.unshift(note); this.save(); return note;
  }
  update(id, input) {
    const note = this.get(id); const fields = this.fields(input);
    if (input.expectedContent !== undefined && input.expectedContent !== note.content) throw new Error(translate('errors.conflict',this.data.settings.language));
    if (input.expectedTitle !== undefined && input.expectedTitle !== note.title) throw new Error(translate('errors.conflict',this.data.settings.language));
    if (note.locked && Object.keys(fields).some(k => ['title','content','color'].includes(k))) throw new Error(translate('errors.locked',this.data.settings.language));
    Object.assign(note, fields, {updatedAt: Date.now()}); this.save(); return note;
  }
  delete(id) { const note = this.get(id); if (note.locked) throw new Error(translate('errors.locked',this.data.settings.language)); this.data.notes = this.data.notes.filter(n => n.id !== id); this.save(); }
  settings(input) {
    const next = {...this.data.settings};
    if(input.language!==undefined){if(input.language!=='system'&&!languages.some(l=>l.code===input.language))throw new Error(translate('errors.invalid',this.data.settings.language));next.language=input.language;}
    for (const k of ['autoStart','startHidden','defaultPinned','mcpEnabled','edgeDock']) if (input[k] !== undefined) { if(typeof input[k] !== 'boolean') throw new Error(translate('errors.invalid',this.data.settings.language)); next[k] = input[k]; }
    if(input.theme !== undefined) { if(!['light','dark','system'].includes(input.theme)) throw new Error(translate('errors.invalid',this.data.settings.language)); next.theme = input.theme; }
    if(input.defaultColor !== undefined) { if(!COLORS.includes(input.defaultColor)) throw new Error(translate('errors.invalid',this.data.settings.language)); next.defaultColor = input.defaultColor; }
    this.data.settings = next; this.save(); return next;
  }
}
module.exports = { Store, COLORS };

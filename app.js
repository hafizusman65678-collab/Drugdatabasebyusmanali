/* PharmaDrug - Main Application Logic */
(function () {
  'use strict';

  // ========== STATE ==========
  let drugs = [];
  let userDrugs = [];
  let customClasses = []; // { id, name, type: 'drugClass'|'therapeuticClass', description }
  let favorites = [];
  let recent = [];
  let notes = {};
  let settings = { theme: 'cyber', allowEditBuiltIn: false };
  let currentView = 'home';
  let currentDrugId = null;
  let compareList = [];
  let quizState = { questions: [], current: 0, score: 0, answered: false, selectedIds: [], mode: 'quiz' };
  let lockedDrugClass = null; // class user started from when adding a drug
  let lockedTherapeuticClass = null;

  // ========== STORAGE ==========
  const STORAGE_KEYS = {
    userDrugs: 'pharmadrug_user_drugs',
    customClasses: 'pharmadrug_custom_classes',
    favorites: 'pharmadrug_favorites',
    recent: 'pharmadrug_recent',
    notes: 'pharmadrug_notes',
    settings: 'pharmadrug_settings'
  };

  function loadStorage() {
    try {
      userDrugs = JSON.parse(localStorage.getItem(STORAGE_KEYS.userDrugs) || '[]');
      customClasses = JSON.parse(localStorage.getItem(STORAGE_KEYS.customClasses) || '[]');
      favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '[]');
      recent = JSON.parse(localStorage.getItem(STORAGE_KEYS.recent) || '[]');
      notes = JSON.parse(localStorage.getItem(STORAGE_KEYS.notes) || '{}');
      settings = Object.assign({ theme: 'cyber', allowEditBuiltIn: false }, JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || '{}'));
    } catch (e) {
      console.warn('Storage load error', e);
      userDrugs = [];
      customClasses = [];
      favorites = [];
      recent = [];
      notes = {};
    }
  }

  function saveStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      showToast('Storage error: ' + e.message, 'error');
    }
  }


  function normalizeToExistingClass(name, type) {
    const raw = (name || '').trim();
    if (!raw) return raw;
    const lower = raw.toLowerCase();
    // Prefer exact case-insensitive match to an existing drug's class
    for (const d of drugs) {
      const candidate = type === 'therapeuticClass' ? d.therapeuticClass : d.drugClass;
      if (candidate && candidate.toLowerCase() === lower) return candidate;
    }
    // Custom classes
    for (const cc of (customClasses || [])) {
      if ((type === 'therapeuticClass' && cc.type === 'therapeuticClass') ||
          (type !== 'therapeuticClass' && cc.type !== 'therapeuticClass')) {
        if ((cc.name || '').toLowerCase() === lower) return cc.name;
      }
    }
    // Fuzzy: existing class contains or is contained by new name
    let best = null;
    let bestLen = 0;
    const pool = new Set();
    drugs.forEach(d => {
      const c = type === 'therapeuticClass' ? d.therapeuticClass : d.drugClass;
      if (c) pool.add(c);
    });
    (customClasses || []).forEach(cc => {
      if (type === 'therapeuticClass' ? cc.type === 'therapeuticClass' : cc.type !== 'therapeuticClass') {
        if (cc.name) pool.add(cc.name);
      }
    });
    pool.forEach(c => {
      const cl = c.toLowerCase();
      if (cl === lower) { best = c; bestLen = 9999; return; }
      if (cl.includes(lower) || lower.includes(cl)) {
        if (c.length > bestLen) { best = c; bestLen = c.length; }
      }
    });
    return best || raw;
  }


  // Cloud account bridge (used by auth.js)
  // Ensures user-added drugs, favorites, notes, classes follow the same profile on every device.
  window.__pharmaGetUserDrugs = function () { return userDrugs; };
  window.__pharmaGetCustomClasses = function () { return customClasses; };
  window.__pharmaGetFavorites = function () { return favorites; };
  window.__pharmaGetNotes = function () { return notes; };
  window.__pharmaGetSettings = function () { return settings; };

  /** Merge two drug arrays by id. Prefer the copy with the newer updatedAt (or local if equal). */
  function mergeDrugArrays(localArr, remoteArr) {
    const map = new Map();
    (Array.isArray(localArr) ? localArr : []).forEach(d => {
      if (d && d.id) map.set(d.id, d);
    });
    (Array.isArray(remoteArr) ? remoteArr : []).forEach(d => {
      if (!d || !d.id) return;
      const existing = map.get(d.id);
      if (!existing) {
        map.set(d.id, d);
        return;
      }
      const tLocal = existing.updatedAt ? Date.parse(existing.updatedAt) : 0;
      const tRemote = d.updatedAt ? Date.parse(d.updatedAt) : 0;
      if (tRemote >= tLocal) map.set(d.id, d);
    });
    return Array.from(map.values());
  }

  function mergeClassArrays(localArr, remoteArr) {
    const map = new Map();
    (Array.isArray(localArr) ? localArr : []).forEach(c => {
      if (c && c.id) map.set(c.id, c);
      else if (c && c.name) map.set((c.type || '') + '::' + c.name.toLowerCase(), c);
    });
    (Array.isArray(remoteArr) ? remoteArr : []).forEach(c => {
      if (!c) return;
      const key = c.id || ((c.type || '') + '::' + String(c.name || '').toLowerCase());
      if (!map.has(key)) map.set(key, c);
    });
    return Array.from(map.values());
  }

  /**
   * Apply cloud profile data onto this device.
   * - userDrugs / customClasses: merge (union) so offline adds on two devices are not lost
   * - favorites: union of ids
   * - notes: merge keys; longer/non-empty wins if conflict
   * - settings: remote wins for theme etc.
   * Does NOT push back immediately (avoids loops).
   */
  window.__pharmaApplyCloudData = function (data) {
    if (!data || typeof data !== 'object') return;
    try {
      window.__pharmaApplyingCloud = true;

      if (Array.isArray(data.userDrugs)) {
        userDrugs = mergeDrugArrays(userDrugs, data.userDrugs);
      }
      if (Array.isArray(data.customClasses)) {
        customClasses = mergeClassArrays(customClasses, data.customClasses);
      }
      if (Array.isArray(data.favorites)) {
        const set = new Set([...(favorites || []), ...data.favorites]);
        favorites = Array.from(set);
      }
      if (data.notes && typeof data.notes === 'object') {
        const merged = Object.assign({}, notes);
        Object.keys(data.notes).forEach(k => {
          const remote = data.notes[k];
          const local = merged[k];
          if (remote == null || remote === '') return;
          if (local == null || local === '' || String(remote).length >= String(local).length) {
            merged[k] = remote;
          }
        });
        notes = merged;
      }
      if (data.settings && typeof data.settings === 'object') {
        settings = Object.assign({ theme: 'cyber', allowEditBuiltIn: false }, settings, data.settings);
      }

      saveStorage(STORAGE_KEYS.userDrugs, userDrugs);
      saveStorage(STORAGE_KEYS.customClasses, customClasses);
      saveStorage(STORAGE_KEYS.favorites, favorites);
      saveStorage(STORAGE_KEYS.notes, notes);
      saveStorage(STORAGE_KEYS.settings, settings);

      mergeDrugs();
      applyTheme();

      // Refresh visible UI so drugs from the other device appear immediately
      try {
        if (currentView === 'home' && typeof renderHome === 'function') renderHome();
        else if (currentView === 'favorites' && typeof renderFavorites === 'function') renderFavorites();
        else if (currentView === 'classification' && typeof renderClassification === 'function') renderClassification();
        else if (currentView === 'drugclasses' && typeof renderDrugClasses === 'function') renderDrugClasses();
        else if (typeof renderHome === 'function') renderHome();
      } catch (_) {}

      const n = (userDrugs && userDrugs.length) || 0;
      showToast('Profile synced — ' + n + ' custom drug' + (n === 1 ? '' : 's') + ' available on this device');
    } catch (e) {
      console.warn(e);
      showToast('Failed to apply cloud data', 'error');
    } finally {
      window.__pharmaApplyingCloud = false;
    }
  };

  window.onPharmaAuthChanged = function (user) {
    if (user) {
      // auth.js already pulls; toast is handled there
    }
  };

  function scheduleCloudPush() {
    if (window.__pharmaApplyingCloud) return; // never push while applying remote data
    if (!(window.PharmaAuth && window.PharmaAuth.getUser && window.PharmaAuth.getUser())) return;
    if (window.PharmaAuth && typeof window.PharmaAuth.push === 'function') {
      clearTimeout(window.__pharmaPushTimer);
      window.__pharmaPushTimer = setTimeout(function () {
        window.PharmaAuth.push();
      }, 500);
    }
  }

  function mergeDrugs() {
    const builtIn = (window.builtInDrugs || []).map(d => ({ ...d, _source: 'built-in' }));
    const extra = (window.extraDrugs || []).map(d => ({ ...d, _source: 'built-in' }));
    const classD = (window.classDrugs || []).map(d => ({ ...d, _source: 'built-in' }));
    const user = userDrugs.map(d => ({ ...d, _source: 'user' }));
    const map = new Map();
    // Built-ins first, then user drugs overwrite same id (user edits win)
    [...builtIn, ...extra, ...classD].forEach(d => {
      if (d && d.id) map.set(d.id, d);
    });
    user.forEach(d => {
      if (d && d.id) map.set(d.id, d);
    });
    drugs = Array.from(map.values());
  }

  // ========== THEME ==========
  const THEME_OPTIONS = [
    { id: 'cyber', label: 'Cyber' },
    { id: 'aurora', label: 'Aurora' },
    { id: 'neon', label: 'Neon' },
    { id: 'solar', label: 'Solar' },
    { id: 'midnight', label: 'Midnight' },
    { id: 'crystal', label: 'Crystal' },
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' }
  ];

  function getSavedCustomThemes() {
    if (!Array.isArray(settings.customThemes)) settings.customThemes = [];
    return settings.customThemes;
  }

  function hexToRgb(hex) {
    const h = String(hex || '').replace('#', '');
    if (h.length !== 6) return { r: 0, g: 0, b: 0 };
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16)
    };
  }

  function readableText(bgHex) {
    const { r, g, b } = hexToRgb(bgHex);
    // relative luminance
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.55 ? '#0f172a' : '#e8f7ff';
  }

  function mutedFromText(textHex) {
    const { r, g, b } = hexToRgb(textHex);
    return `rgba(${r}, ${g}, ${b}, 0.65)`;
  }

  function applyCustomVars(cfg) {
    if (!cfg) return;
    const root = document.documentElement;
    const primary = cfg.primary || '#00f5d4';
    const accent = cfg.accent || '#7b61ff';
    const bg = cfg.bg || '#070b16';
    const card = cfg.card || '#0f172a';
    const text = cfg.text || readableText(bg);
    const mode = cfg.mode || 'dark';
    root.style.setProperty('--primary', primary);
    root.style.setProperty('--primary-dark', primary);
    root.style.setProperty('--primary-light', accent);
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--bg', bg);
    root.style.setProperty('--bg-card', card);
    root.style.setProperty('--card-bg', card);
    root.style.setProperty('--text', text);
    root.style.setProperty('--text-muted', mutedFromText(text));
    root.style.setProperty('--border', mode === 'light' ? 'rgba(15,23,42,0.12)' : 'rgba(255,255,255,0.14)');
    root.style.setProperty('--shadow', `0 0 24px ${primary}33`);
    root.style.setProperty('--shadow-hover', `0 0 36px ${accent}44`);
    root.style.setProperty('--glow', `0 0 20px ${primary}66`);
    root.style.setProperty('--bg-image',
      `radial-gradient(1000px 500px at 10% -10%, ${primary}33, transparent 55%),` +
      `radial-gradient(800px 400px at 100% 0%, ${accent}28, transparent 50%),` +
      `linear-gradient(180deg, ${bg}, ${card})`
    );
  }

  function clearCustomVars() {
    const root = document.documentElement;
    [
      '--primary','--primary-dark','--primary-light','--accent','--bg','--bg-card',
      '--text','--text-muted','--border','--shadow','--shadow-hover','--glow','--bg-image'
    ].forEach(v => root.style.removeProperty(v));
  }

  function applyTheme() {
    try {
      if (!settings || typeof settings !== 'object') settings = { theme: 'cyber' };
      let theme = settings.theme || 'cyber';
      const known = ['cyber','aurora','neon','solar','midnight','crystal','light','dark','custom'];
      if (!known.includes(theme)) theme = 'cyber';

      // Preset theme attribute; custom uses base + overrides
      const attr = theme === 'custom' ? 'cyber' : theme;
      document.documentElement.setAttribute('data-theme', attr);
      document.body.classList.toggle('theme-is-custom', theme === 'custom');

      if (theme === 'custom' && settings.customTheme) {
        applyCustomVars(settings.customTheme);
        const mode = settings.customTheme.mode || 'dark';
        document.body.classList.toggle('theme-custom-light', mode === 'light');
        document.body.classList.toggle('theme-custom-dark', mode !== 'light');
      } else {
        clearCustomVars();
        document.body.classList.remove('theme-custom-light', 'theme-custom-dark');
      }

      const btn = document.getElementById('themeToggle');
      if (btn) {
        btn.textContent = '🎨';
        btn.title = 'Theme: ' + theme;
      }
      document.querySelectorAll('.theme-swatch').forEach(sw => {
        sw.classList.toggle('active', sw.dataset.themeId === theme);
      });

      // Sync color inputs only if present (don't fight user while dragging if values match)
      const cfg = settings.customTheme || {};
      const map = {
        customPrimary: cfg.primary || '#00f5d4',
        customAccent: cfg.accent || '#7b61ff',
        customBg: cfg.bg || '#070b16',
        customCard: cfg.card || '#0f172a',
        customText: cfg.text || '#e8f7ff'
      };
      Object.keys(map).forEach(id => {
        const el = document.getElementById(id);
        if (el && el.value.toLowerCase() !== String(map[id]).toLowerCase()) el.value = map[id];
      });
      const modeEl = document.getElementById('customMode');
      if (modeEl && modeEl.value !== (cfg.mode || 'dark')) modeEl.value = (cfg.mode || 'dark');
      renderSavedCustomThemes();
    } catch (err) {
      console.warn('applyTheme error', err);
      document.documentElement.setAttribute('data-theme', 'cyber');
    }
  }

  function normalizeHex(v, fallback) {
    const s = String(v || '').trim();
    if (/^#[0-9a-fA-F]{6}$/.test(s)) return s.toLowerCase();
    if (/^[0-9a-fA-F]{6}$/.test(s)) return ('#' + s).toLowerCase();
    return fallback;
  }

  function readCustomForm() {
    return {
      primary: normalizeHex(document.getElementById('customPrimary')?.value, '#00f5d4'),
      accent: normalizeHex(document.getElementById('customAccent')?.value, '#7b61ff'),
      bg: normalizeHex(document.getElementById('customBg')?.value, '#070b16'),
      card: normalizeHex(document.getElementById('customCard')?.value, '#0f172a'),
      text: normalizeHex(document.getElementById('customText')?.value, '#e8f7ff'),
      mode: (document.getElementById('customMode')?.value === 'light') ? 'light' : 'dark'
    };
  }

  function setTheme(themeId) {
    settings.theme = themeId;
    saveStorage(STORAGE_KEYS.settings, settings);
    applyTheme();
    if (typeof scheduleCloudPush === 'function') scheduleCloudPush();
  }

  function applyCustomThemeFromForm(saveNamed) {
    const cfg = readCustomForm();
    settings.customTheme = cfg;
    settings.theme = 'custom';
    if (saveNamed) {
      const name = prompt('Name this custom theme:', 'My theme ' + (getSavedCustomThemes().length + 1));
      if (name && name.trim()) {
        const list = getSavedCustomThemes();
        list.push({ id: 'custom-' + Date.now(), name: name.trim(), ...cfg });
        settings.customThemes = list.slice(-12); // keep last 12
      }
    }
    saveStorage(STORAGE_KEYS.settings, settings);
    applyTheme();
    if (typeof scheduleCloudPush === 'function') scheduleCloudPush();
    showToast(saveNamed ? 'Custom theme saved' : 'Custom theme applied');
  }

  function renderSavedCustomThemes() {
    const box = document.getElementById('savedCustomThemes');
    if (!box) return;
    const safe = (typeof escapeHtml === 'function') ? escapeHtml : (str => String(str || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
    const list = getSavedCustomThemes();
    if (!list.length) {
      box.innerHTML = '<p class="text-muted" style="font-size:0.75rem;margin:0.4rem 0 0">No saved custom themes yet.</p>';
      return;
    }
    box.innerHTML = `<div class="saved-theme-list">${list.map(t => `
      <button type="button" class="saved-theme-chip" data-id="${safe(t.id)}" title="${safe(t.name)}">
        <span class="saved-theme-dots">
          <i style="background:${safe(t.primary)}"></i>
          <i style="background:${safe(t.accent)}"></i>
          <i style="background:${safe(t.bg)}"></i>
        </span>
        <span>${safe(t.name)}</span>
      </button>
    `).join('')}</div>`;
    box.querySelectorAll('.saved-theme-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = getSavedCustomThemes().find(x => x.id === btn.dataset.id);
        if (!t) return;
        settings.customTheme = {
          primary: t.primary, accent: t.accent, bg: t.bg, card: t.card, text: t.text, mode: t.mode || 'dark'
        };
        settings.theme = 'custom';
        saveStorage(STORAGE_KEYS.settings, settings);
        applyTheme();
        showToast('Loaded ' + t.name);
      });
    });
  }

  function buildThemePicker() {
    const grid = document.getElementById('themeGrid');
    const panel = document.getElementById('themePicker');
    if (!grid) return;

    // Prevent outside-click handler from closing while interacting inside
    if (panel && !panel.dataset.boundStop) {
      panel.dataset.boundStop = '1';
      panel.addEventListener('click', e => e.stopPropagation());
      panel.addEventListener('mousedown', e => e.stopPropagation());
    }

    grid.innerHTML = THEME_OPTIONS.map(t => `
      <button type="button" class="theme-swatch" data-theme-id="${t.id}" title="${t.label}">
        <span class="dot"></span>
        <span>${t.label}</span>
      </button>
    `).join('') + `
      <button type="button" class="theme-swatch" data-theme-id="custom" title="Custom">
        <span class="dot" style="background:conic-gradient(red, yellow, lime, aqua, blue, magenta, red)"></span>
        <span>Custom</span>
      </button>
    `;
    grid.querySelectorAll('.theme-swatch').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        if (btn.dataset.themeId === 'custom') {
          // Just mark custom active and apply current form colors; keep picker open
          applyCustomThemeFromForm(false);
          return;
        }
        setTheme(btn.dataset.themeId);
        // keep picker open so user can compare themes
      });
    });

    const applyBtn = document.getElementById('btnApplyCustomTheme');
    const saveBtn = document.getElementById('btnSaveCustomTheme');
    if (applyBtn && !applyBtn.dataset.bound) {
      applyBtn.dataset.bound = '1';
      applyBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        applyCustomThemeFromForm(false);
      });
    }
    if (saveBtn && !saveBtn.dataset.bound) {
      saveBtn.dataset.bound = '1';
      saveBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        applyCustomThemeFromForm(true);
      });
    }

    // Live preview (debounced) — do not persist on every pixel drag
    let previewTimer = null;
    ['customPrimary','customAccent','customBg','customCard','customText','customMode'].forEach(id => {
      const el = document.getElementById(id);
      if (!el || el.dataset.bound) return;
      el.dataset.bound = '1';
      el.addEventListener('input', () => {
        clearTimeout(previewTimer);
        previewTimer = setTimeout(() => {
          const cfg = readCustomForm();
          settings.theme = 'custom';
          settings.customTheme = cfg;
          // preview only — persist lightly
          saveStorage(STORAGE_KEYS.settings, settings);
          applyTheme();
        }, 50);
      });
      el.addEventListener('click', e => e.stopPropagation());
      el.addEventListener('mousedown', e => e.stopPropagation());
    });
  }

  function toggleThemePicker() {
    const panel = document.getElementById('themePicker');
    if (!panel) return;
    panel.classList.toggle('open');
  }

  function toggleTheme() {
    toggleThemePicker();
  }

  // ========== TOAST ==========
  function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  window.showToast = showToast;

  // ========== SEARCH ==========
  function searchDrugs(query) {
    if (!query || !query.trim()) return [];
    // Ensure latest user-added drugs are in the in-memory list
    mergeDrugs();
    const q = query.toLowerCase().trim();
    const terms = q.split(/\s+/).filter(Boolean);

    // General multi-field search with ranking (drug-name hits first)
    const scored = [];
    drugs.forEach(drug => {
      const generic = (drug.genericName || '').toLowerCase();
      const brands = (drug.brandNames || []).join(' ').toLowerCase();
      const dc = (drug.drugClass || '').toLowerCase();
      const tc = (drug.therapeuticClass || '').toLowerCase();
      const inds = (drug.indications || []).join(' ').toLowerCase();
      const mech = (drug.mechanismOfAction || '').toLowerCase();
      const blob = [generic, brands, dc, tc, inds, mech].join(' ');

      if (!terms.every(t => blob.includes(t))) return;

      let score = 0;
      terms.forEach(t => {
        if (generic === t) score += 100;
        else if (generic.startsWith(t)) score += 50;
        else if (generic.includes(t)) score += 30;
        if (brands.split(/\s+/).some(b => b === t) || brands.includes(t)) score += 20;
        if (dc === t || tc === t) score += 40;
        else if (dc.includes(t) || tc.includes(t)) score += 15;
        if (inds.includes(t)) score += 10;
        if (mech.includes(t)) score += 5;
      });
      // Exact full-query match on generic name
      if (generic === q) score += 80;
      scored.push({ drug, score });
    });

    scored.sort((a, b) => b.score - a.score || (a.drug.genericName || '').localeCompare(b.drug.genericName || ''));
    let found = scored.map(s => s.drug).slice(0, 100);

    // If query looks like a class name (and is not a strong drug-name hit), include class members
    const topScore = scored[0] ? scored[0].score : 0;
    const isStrongDrugHit = topScore >= 50; // starts-with or better on a drug name
    if (!isStrongDrugHit || found.length === 0) {
      const classNames = new Set();
      drugs.forEach(d => {
        if (d.drugClass) classNames.add(d.drugClass.toLowerCase());
        if (d.therapeuticClass) classNames.add(d.therapeuticClass.toLowerCase());
      });
      const exactClassMatches = [];
      classNames.forEach(cn => {
        // Prefer exact or class-contains-query; avoid query-contains-class for short noise
        if (cn === q || cn.startsWith(q) || (q.length >= 4 && cn.includes(q))) {
          exactClassMatches.push(cn);
        }
      });
      if (exactClassMatches.length > 0) {
        exactClassMatches.sort((a, b) => b.length - a.length);
        const best = exactClassMatches[0];
        const inClass = drugs.filter(d => {
          const dc = (d.drugClass || '').toLowerCase();
          const tc = (d.therapeuticClass || '').toLowerCase();
          return dc === best || tc === best || dc.includes(best) || tc.includes(best);
        });
        // Merge class members not already in found
        const seen = new Set(found.map(d => d.id));
        inClass.forEach(d => {
          if (!seen.has(d.id)) {
            found.push(d);
            seen.add(d.id);
          }
        });
      }
    }

    // If query matches a custom class name (even with no drugs yet), synthesize a placeholder hit
    // so the class block still appears in search results.
    if (!found.length) {
      const qlow = q.toLowerCase();
      (customClasses || []).forEach(cc => {
        if ((cc.name || '').toLowerCase().includes(qlow)) {
          found.push({
            id: 'placeholder-class-' + (cc.id || cc.name),
            genericName: cc.name,
            drugClass: cc.type === 'therapeuticClass' ? (cc.name) : cc.name,
            therapeuticClass: cc.type === 'therapeuticClass' ? cc.name : '',
            brandNames: [],
            indications: [cc.description || 'Custom classification'],
            mechanismOfAction: cc.description || '',
            _placeholder: true
          });
        }
      });
    }

    // Also: if user typed a class name that exists on any drug, include one seed drug from each matching class
    if (!found.length) {
      const seen = new Set();
      drugs.forEach(d => {
        const dc = (d.drugClass || '').toLowerCase();
        const tc = (d.therapeuticClass || '').toLowerCase();
        if ((dc && dc.includes(q)) || (tc && tc.includes(q))) {
          if (d.drugClass && !seen.has(d.drugClass)) {
            seen.add(d.drugClass);
            found.push(d);
          }
        }
      });
    }

    return found;
  }

  function getRelatedDrugs(drug, limit = 12) {
    if (!drug) return [];
    const dc = (drug.drugClass || '').toLowerCase();
    const tc = (drug.therapeuticClass || '').toLowerCase();
    return drugs.filter(d => {
      if (d.id === drug.id) return false;
      const ddc = (d.drugClass || '').toLowerCase();
      const dtc = (d.therapeuticClass || '').toLowerCase();
      return (dc && ddc === dc) || (tc && dtc === tc) ||
             (dc && ddc.includes(dc)) || (dc && dc.includes(ddc));
    }).sort((a, b) => (a.genericName || '').localeCompare(b.genericName || '')).slice(0, limit);
  }

  // ========== RENDER HELPERS ==========
  function escapeHtml(str) {
    if (str == null) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  function safe(val, fallback = 'Information not available in the current database.') {
    if (val == null || val === '' || (Array.isArray(val) && val.length === 0)) return fallback;
    return val;
  }

  // ========== VIEWS ==========

  function getGlossary() {
    return Array.isArray(window.PHARMADRUG_GLOSSARY) ? window.PHARMADRUG_GLOSSARY : [];
  }

  function renderGlossary(filter) {
    const el = document.getElementById('glossaryList');
    if (!el) return;
    const q = String(filter || '').trim().toLowerCase();
    let items = getGlossary().slice().sort((a, b) => a.term.localeCompare(b.term));
    if (q) {
      items = items.filter(it =>
        (it.term || '').toLowerCase().includes(q) ||
        (it.definition || '').toLowerCase().includes(q) ||
        (it.chapterHint || '').toLowerCase().includes(q)
      );
    }
    if (!items.length) {
      el.innerHTML = '<p class="text-muted">No matching terms. Try a simpler keyword.</p>';
      return;
    }
    el.innerHTML = items.map(it => `
      <article class="glossary-card" id="gloss-${escapeHtml((it.term || '').replace(/\s+/g, '-').toLowerCase())}">
        <h3 class="glossary-term">${escapeHtml(it.term)}</h3>
        ${it.chapterHint ? `<div class="glossary-hint">${escapeHtml(it.chapterHint)}</div>` : ''}
        <p class="glossary-def">${escapeHtml(it.definition)}</p>
      </article>
    `).join('');
  }

  function openGlossaryTerm(term) {
    showView('glossary');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === 'glossary'));
    const input = document.getElementById('glossarySearch');
    if (input) {
      input.value = term || '';
      renderGlossary(term || '');
    }
  }

  function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    const el = document.getElementById('view-' + viewId);
    if (el) el.classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.view === viewId);
    });
    currentView = viewId;
    window.scrollTo(0, 0);
  }

  function renderHome() {
    showView('home');
    const popular = ['furosemide', 'hydrochlorothiazide', 'spironolactone', 'mannitol', 'acetazolamide', 'metformin', 'amoxicillin', 'omeprazole'];
    const grid = document.getElementById('popularGrid');
    if (!grid) return;
    grid.innerHTML = popular.map(id => {
      const d = drugs.find(x => x.id === id);
      if (!d) return '';
      return `<div class="popular-card" tabindex="0" role="button" data-id="${d.id}">${escapeHtml(d.genericName)}</div>`;
    }).join('');
    grid.querySelectorAll('.popular-card').forEach(card => {
      card.addEventListener('click', () => openDrug(card.dataset.id));
      card.addEventListener('keydown', e => { if (e.key === 'Enter') openDrug(card.dataset.id); });
    });

    // Recent
    const recentEl = document.getElementById('recentList');
    if (recentEl) {
      if (recent.length === 0) {
        recentEl.innerHTML = '<p class="text-muted">No recently viewed drugs.</p>';
      } else {
        recentEl.innerHTML = recent.slice(0, 10).map(id => {
          const d = drugs.find(x => x.id === id);
          if (!d) return '';
          return `<div class="result-card" tabindex="0" role="button" data-id="${d.id}">
            <h3>${escapeHtml(d.genericName)}</h3>
            <div class="class">${escapeHtml(d.drugClass)}</div>
          </div>`;
        }).join('');
        recentEl.querySelectorAll('.result-card').forEach(c => {
          c.addEventListener('click', () => openDrug(c.dataset.id));
        });
      }
    }
  }

  /** Build unique class blocks from matched drugs (no individual drugs in search list). */
  function expandToClassGroups(matchedDrugs) {
    // Canonical class label map (case-insensitive → preferred existing spelling)
    const canon = new Map();
    drugs.forEach(d => {
      const cls = (d.drugClass || '').trim() || 'Other';
      const key = cls.toLowerCase();
      if (!canon.has(key)) canon.set(key, cls);
    });
    const classKeys = new Set();
    matchedDrugs.forEach(d => {
      const cls = (d.drugClass || '').trim() || 'Other';
      const key = cls.toLowerCase();
      if (!canon.has(key)) canon.set(key, cls);
      classKeys.add(key);
    });
    const groups = {};
    classKeys.forEach(key => {
      const label = canon.get(key) || key;
      groups[label] = drugs
        .filter(d => ((d.drugClass || '').trim() || 'Other').toLowerCase() === key)
        .slice()
        .sort((a, b) => (a.genericName || '').localeCompare(b.genericName || ''));
    });
    const matchedIds = new Set(matchedDrugs.map(d => d.id));
    const ordered = Object.keys(groups).sort((a, b) => {
      const aHit = groups[a].some(d => matchedIds.has(d.id));
      const bHit = groups[b].some(d => matchedIds.has(d.id));
      if (aHit !== bHit) return aHit ? -1 : 1;
      return a.localeCompare(b);
    });
    return ordered.map(cls => ({
      className: cls,
      drugs: groups[cls],
      matchedIds,
      sampleNames: groups[cls].slice(0, 4).map(d => d.genericName).filter(Boolean)
    }));
  }

  function renderSearchResults(results, query) {
    showView('search');
    hideSearchSuggestions();
    const container = document.getElementById('searchResults');
    const title = document.getElementById('searchTitle');
    if (!container) return;

    if (!results || results.length === 0) {
      if (title) title.textContent = query ? `Results for "${query}"` : 'Search Results';
      container.innerHTML = `<div class="empty-state"><div class="icon">🔍</div><p>No drugs found matching your search.</p><p class="text-muted">Try a drug name (e.g. "furosemide"), brand, or class (e.g. "statin").</p></div>`;
      return;
    }

    const q = (query || '').toLowerCase().trim();
    // Direct drug hits: name/brand matches the query strongly
    const directHits = results.filter(d => {
      const generic = (d.genericName || '').toLowerCase();
      const brands = (d.brandNames || []).join(' ').toLowerCase();
      if (!q) return false;
      return generic === q || generic.startsWith(q) || generic.includes(q) || brands.includes(q);
    }).slice(0, 24);

    const groups = expandToClassGroups(results);
    if (title) {
      const parts = [];
      if (directHits.length) parts.push(directHits.length + ' drug' + (directHits.length === 1 ? '' : 's'));
      if (groups.length) parts.push(groups.length + ' class' + (groups.length === 1 ? '' : 'es'));
      title.textContent = query
        ? `Results for "${query}"` + (parts.length ? ' — ' + parts.join(', ') : '')
        : 'Search Results';
    }

    function drugCardHtml(d) {
      return `
        <div class="result-card" tabindex="0" role="button" data-id="${d.id}">
          <h3>${escapeHtml(d.genericName)}</h3>
          <div class="result-class-row">
            <span class="class-chip">${escapeHtml(d.drugClass || '')}</span>
            ${d.therapeuticClass ? `<span class="class-chip therapeutic">${escapeHtml(d.therapeuticClass)}</span>` : ''}
          </div>
          <div class="desc">${escapeHtml((d.indications && d.indications[0]) || d.mechanismOfAction || '').slice(0, 120)}...</div>
        </div>`;
    }

    let html = '';
    if (directHits.length) {
      html += `
        <h3 class="section-title" style="margin-top:0">Matching drugs</h3>
        <div class="results-grid" id="directDrugHits">
          ${directHits.map(drugCardHtml).join('')}
        </div>`;
    }

    if (groups.length) {
      html += `
        <h3 class="section-title">${directHits.length ? 'Browse by class' : 'Drug classes'}</h3>
        <p class="search-group-note text-muted">Open a class to see all drugs in that group.</p>
        <div class="class-result-list">
          ${groups.map(g => `
            <button type="button" class="class-result-block" data-class="${escapeHtml(g.className)}" aria-expanded="false">
              <div class="class-result-main">
                <div class="class-result-icon">💊</div>
                <div class="class-result-text">
                  <h3>${escapeHtml(g.className)}</h3>
                  <p>${g.drugs.length} drug${g.drugs.length === 1 ? '' : 's'} in this class</p>
                  <p class="class-result-samples">${escapeHtml(g.sampleNames.join(' · '))}${g.drugs.length > g.sampleNames.length ? ' · …' : ''}</p>
                </div>
              </div>
              <span class="class-result-chevron">Open ▸</span>
            </button>
            <div class="class-result-drugs hidden" data-class-panel="${escapeHtml(g.className)}"></div>
          `).join('')}
        </div>`;
    }

    container.innerHTML = html;

    container.querySelectorAll('#directDrugHits .result-card, .results-grid .result-card').forEach(c => {
      if (c.closest('.class-result-drugs')) return;
      c.addEventListener('click', () => openDrug(c.dataset.id));
      c.addEventListener('keydown', e => { if (e.key === 'Enter') openDrug(c.dataset.id); });
    });

    container.querySelectorAll('.class-result-block').forEach(btn => {
      btn.addEventListener('click', () => {
        const cls = btn.dataset.class || '';
        const panel = [...container.querySelectorAll('.class-result-drugs')].find(p => p.getAttribute('data-class-panel') === cls);
        if (!panel) return;
        const isOpen = !panel.classList.contains('hidden');
        container.querySelectorAll('.class-result-drugs').forEach(p => {
          p.classList.add('hidden');
          p.innerHTML = '';
        });
        container.querySelectorAll('.class-result-block').forEach(b => {
          b.setAttribute('aria-expanded', 'false');
          const chev = b.querySelector('.class-result-chevron');
          if (chev) chev.textContent = 'Open ▸';
          b.classList.remove('open');
        });
        if (isOpen) return;

        const group = groups.find(g => g.className === cls);
        if (!group) return;
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('open');
        const chev = btn.querySelector('.class-result-chevron');
        if (chev) chev.textContent = 'Close ▾';
        panel.classList.remove('hidden');
        panel.innerHTML = `
          <div class="class-result-toolbar">
            <button type="button" class="btn btn-primary btn-sm btn-add-in-group" data-class="${escapeHtml(cls)}">+ Add drug to this class</button>
          </div>
          <div class="results-grid search-group-grid">
            ${group.drugs.map(drugCardHtml).join('')}
          </div>
        `;
        panel.querySelectorAll('.result-card').forEach(c => {
          c.addEventListener('click', () => openDrug(c.dataset.id));
          c.addEventListener('keydown', e => { if (e.key === 'Enter') openDrug(c.dataset.id); });
        });
        panel.querySelector('.btn-add-in-group')?.addEventListener('click', e => {
          e.stopPropagation();
          openAddForm({ drugClass: cls });
        });
      });
    });
  }

  function cssEscapeAttr(str) {
    return String(str || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function hideSearchSuggestions() {
    document.querySelectorAll('.search-suggestions').forEach(el => {
      el.classList.add('hidden');
      el.innerHTML = '';
    });
  }

  function showSearchSuggestions(inputEl, query) {
    if (!inputEl) return;
    let box = inputEl.parentElement?.querySelector('.search-suggestions');
    if (!box) {
      box = document.createElement('div');
      box.className = 'search-suggestions hidden';
      box.setAttribute('role', 'listbox');
      inputEl.parentElement.style.position = inputEl.parentElement.style.position || 'relative';
      inputEl.parentElement.appendChild(box);
    }
    const q = (query || '').trim();
    if (q.length < 1) {
      box.classList.add('hidden');
      box.innerHTML = '';
      return;
    }
    const results = searchDrugs(q).slice(0, 24);
    if (!results.length) {
      box.classList.add('hidden');
      box.innerHTML = '';
      return;
    }
    // Suggestions: drug classes only (never list individual drugs as the primary result)
    const classMap = new Map();
    results.forEach(d => {
      const cls = (d.drugClass || '').trim() || 'Other';
      if (!classMap.has(cls)) classMap.set(cls, []);
      classMap.get(cls).push(d);
    });
    const classItems = [...classMap.entries()].slice(0, 8).map(([cls, list]) => `
      <button type="button" class="suggestion-item suggestion-class-row" data-query="${escapeHtml(cls)}" role="option">
        <span class="suggestion-name">${escapeHtml(cls)}</span>
        <span class="suggestion-class">${list.length} drugs</span>
      </button>
    `).join('');
    box.innerHTML = `
      <div class="suggestion-section-label">Matching drug classes</div>
      ${classItems}
      <button type="button" class="suggestion-item suggestion-all" data-query="${escapeHtml(q)}">
        <span class="suggestion-name">Show class results for "${escapeHtml(q)}"</span>
        <span class="suggestion-class">Search</span>
      </button>
    `;
    box.classList.remove('hidden');
    box.querySelectorAll('.suggestion-item[data-query]').forEach(btn => {
      btn.addEventListener('click', () => {
        hideSearchSuggestions();
        const q2 = btn.dataset.query || q;
        renderSearchResults(searchDrugs(q2), q2);
      });
    });
  }

  function openDrug(id) {
    const drug = drugs.find(d => d.id === id);
    if (!drug) {
      showToast('Drug not found', 'error');
      return;
    }
    currentDrugId = id;
    // Set view first so favorite/notes handlers see currentView === 'profile'
    showView('profile');
    // Recent
    recent = [id, ...recent.filter(x => x !== id)].slice(0, 10);
    saveStorage(STORAGE_KEYS.recent, recent);
    renderProfile(drug);
  }

  function wrapText(ctx, text, maxWidth) {
    const words = String(text || '').split(/\s+/);
    const lines = [];
    let line = '';
    words.forEach(word => {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  function downloadProfileJpg(drug) {
    if (!drug) return;
    showToast('Preparing JPG…');

    const pk = drug.pharmacokinetics || {};
    const ae = drug.adverseEffects || {};
    const dose = drug.dosage || {};
    const width = 1200;
    const margin = 48;
    const contentWidth = width - margin * 2;
    const lineH = 22;
    const sectionGap = 18;

    // Measure height in a first pass
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;

    const sections = [];
    const addSection = (title, lines) => {
      const clean = (lines || []).filter(Boolean);
      if (!clean.length) return;
      sections.push({ title, lines: clean });
    };

    addSection('Drug Class', [
      drug.drugClass || '—',
      drug.therapeuticClass ? 'Therapeutic: ' + drug.therapeuticClass : ''
    ]);
    addSection('Brand names', [(drug.brandNames || []).join(', ') || '—']);
    addSection('Mechanism of Action', [drug.mechanismOfAction || 'Information not available.']);
    if (drug.mechanismFlow && drug.mechanismFlow.length) {
      addSection('Mechanism Flow', [drug.mechanismFlow.join('  →  ')]);
    }
    addSection('Pharmacokinetics (ADME)', [
      'Absorption: ' + (pk.absorption || '—'),
      'Distribution: ' + (pk.distribution || '—'),
      'Metabolism: ' + (pk.metabolism || '—'),
      'Excretion: ' + (pk.excretion || '—')
    ]);
    addSection('Indications', drug.indications && drug.indications.length ? drug.indications.map(i => '• ' + i) : ['—']);
    addSection('Dosing (educational only)', [
      'Routes: ' + ((dose.routes || []).join(', ') || '—'),
      'Adult: ' + (dose.adult || 'Refer to authoritative reference.'),
      'Pediatric: ' + (dose.pediatric || 'Refer to authoritative reference.'),
      dose.notes ? 'Notes: ' + dose.notes : ''
    ]);
    addSection('Adverse Effects — Common', (ae.common || []).length ? ae.common.map(i => '• ' + i) : ['—']);
    addSection('Adverse Effects — Serious', (ae.serious || []).length ? ae.serious.map(i => '• ' + i) : ['—']);
    addSection('Contraindications', (drug.contraindications || []).length ? drug.contraindications.map(i => '• ' + i) : ['—']);
    if (drug.interactions && drug.interactions.length) {
      addSection('Interactions', drug.interactions.map(i => '• ' + (i.drug || '') + ': ' + (i.interaction || '') + (i.significance ? ' [' + i.significance + ']' : '')));
    }
    addSection('Monitoring', (drug.monitoring || []).length ? drug.monitoring.map(i => '• ' + i) : ['—']);
    addSection('Patient Counseling', (drug.patientCounseling || []).length ? drug.patientCounseling.map(i => '• ' + i) : ['—']);
    addSection('Disclaimer', [
      'Educational use only. Not a substitute for professional medical advice or official prescribing information.'
    ]);

    // Height calculation
    ctx.font = '600 16px system-ui, sans-serif';
    let y = margin;
    y += 56; // title block
    y += 36; // subtitle
    sections.forEach(sec => {
      y += 28; // section title
      ctx.font = '15px system-ui, sans-serif';
      sec.lines.forEach(line => {
        const wrapped = wrapText(ctx, line, contentWidth);
        y += wrapped.length * lineH;
      });
      y += sectionGap;
    });
    y += margin;

    canvas.height = Math.max(y, 800);

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, canvas.height);
    // Accent bar
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(0, 0, width, 8);

    // Header
    let cy = margin + 8;
    ctx.fillStyle = '#0d9488';
    ctx.font = '700 18px system-ui, sans-serif';
    ctx.fillText('PharmaDrug · Pharmacological Profile', margin, cy);
    cy += 40;

    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 36px system-ui, sans-serif';
    const titleLines = wrapText(ctx, drug.genericName || 'Drug', contentWidth);
    titleLines.forEach(tl => {
      ctx.fillText(tl, margin, cy);
      cy += 40;
    });

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px system-ui, sans-serif';
    const brands = (drug.brandNames || []).join(', ') || 'No brand names listed';
    wrapText(ctx, brands, contentWidth).forEach(bl => {
      ctx.fillText(bl, margin, cy);
      cy += 24;
    });
    cy += 12;

    // Divider
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(margin, cy);
    ctx.lineTo(width - margin, cy);
    ctx.stroke();
    cy += 28;

    sections.forEach(sec => {
      // Section title
      ctx.fillStyle = '#0d9488';
      ctx.font = '700 18px system-ui, sans-serif';
      ctx.fillText(sec.title, margin, cy);
      cy += 26;

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '15px system-ui, sans-serif';
      sec.lines.forEach(line => {
        wrapText(ctx, line, contentWidth).forEach(wl => {
          ctx.fillText(wl, margin, cy);
          cy += lineH;
        });
      });
      cy += sectionGap;
    });

    // Footer
    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('Generated by PharmaDrug · Educational use only · ' + new Date().toLocaleDateString(), margin, canvas.height - 24);

    // Download
    const fileName = (drug.genericName || 'drug').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-profile.jpg';
    canvas.toBlob(blob => {
      if (!blob) {
        // Fallback via data URL
        const url = canvas.toDataURL('image/jpeg', 0.92);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        showToast('JPG downloaded');
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Profile JPG downloaded');
    }, 'image/jpeg', 0.92);
  }

  function renderProfile(drug) {

    const el = document.getElementById('drugProfile');
    if (!el) return;
    const isFav = favorites.includes(drug.id);
    const isUser = drug._source === 'user';
    const canEdit = isUser || settings.allowEditBuiltIn;

    const pk = drug.pharmacokinetics || {};
    const ae = drug.adverseEffects || {};
    const sp = drug.specialPopulations || {};
    const dose = drug.dosage || {};
    const profileInteractions = enrichDrugInteractions(drug);

    el.innerHTML = `
      <div class="profile-header">
        <div class="profile-actions">
          <button type="button" id="btnFavorite" title="${isFav ? 'Remove favorite' : 'Add favorite'}" aria-label="Favorite">${isFav ? '★' : '☆'}</button>
          <button type="button" id="btnDownloadJpg" title="Download profile as JPG" aria-label="Download JPG">📷 JPG</button>
          <button type="button" id="btnPrint" title="Print" aria-label="Print">🖨️</button>
          ${canEdit ? `<button type="button" id="btnEdit" title="Edit" aria-label="Edit">✏️</button>` : ''}
          ${isUser ? `<button type="button" id="btnDelete" title="Delete" aria-label="Delete">🗑️</button>` : ''}
        </div>
        <h1>${escapeHtml(drug.genericName)}</h1>
        <p>${escapeHtml((drug.brandNames || []).join(', ') || 'No brand names listed')}</p>
        <div class="profile-meta">
          <span class="badge">${escapeHtml(drug.drugClass)}</span>
          <span class="badge">${escapeHtml(drug.therapeuticClass || '')}</span>
        </div>
      </div>

      <div class="disclaimer">
        <strong>Educational use only.</strong> This website is intended for pharmacy/medical education and drug-information study. It is not a substitute for a qualified healthcare professional, official prescribing information, or a pharmacist/physician's advice. Always verify clinical information using authoritative references before making treatment decisions.
      </div>

      <div class="profile-section">
        <h2>Mechanism of Action</h2>
        <p>${escapeHtml(safe(drug.mechanismOfAction))}</p>
        ${drug.mechanismFlow && drug.mechanismFlow.length ? `
          <div class="mechanism-flow">
            ${drug.mechanismFlow.map((step, i) => `
              ${i > 0 ? '<span class="flow-arrow">↓</span>' : ''}
              <span class="flow-step">${escapeHtml(step)}</span>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="profile-section">
        <h2>Pharmacokinetics (ADME)</h2>
        <div class="adme-grid">
          <div class="adme-card"><h4>Absorption</h4><p>${escapeHtml(safe(pk.absorption))}</p></div>
          <div class="adme-card"><h4>Distribution</h4><p>${escapeHtml(safe(pk.distribution))}</p></div>
          <div class="adme-card"><h4>Metabolism</h4><p>${escapeHtml(safe(pk.metabolism))}</p></div>
          <div class="adme-card"><h4>Excretion</h4><p>${escapeHtml(safe(pk.excretion))}</p></div>
        </div>
      </div>

      <div class="profile-section">
        <h2>Indications</h2>
        <ul class="list-clean">
          ${(drug.indications || []).map(i => `<li>${escapeHtml(i)}</li>`).join('') || '<li>Information not available.</li>'}
        </ul>
      </div>

      <div class="profile-section">
        <h2>Dose & Route <small class="text-muted">(Educational information only)</small></h2>
        <p><strong>Routes:</strong> ${escapeHtml((dose.routes || []).join(', ') || 'Not specified')}</p>
        <p><strong>Adult:</strong> ${escapeHtml(safe(dose.adult, 'Refer to an authoritative prescribing reference for dosing.'))}</p>
        <p><strong>Pediatric:</strong> ${escapeHtml(safe(dose.pediatric, 'Refer to an authoritative prescribing reference for dosing.'))}</p>
        ${dose.notes ? `<p class="text-muted"><em>${escapeHtml(dose.notes)}</em></p>` : ''}
      </div>

      <div class="profile-section">
        <h2>Adverse Effects</h2>
        <p><strong>Common:</strong></p>
        <ul class="list-clean">${(ae.common || []).map(i => `<li>${escapeHtml(i)}</li>`).join('') || '<li>None listed.</li>'}</ul>
        <p class="mt-2"><strong>Serious:</strong></p>
        <ul class="list-clean">${(ae.serious || []).map(i => `<li>${escapeHtml(i)}</li>`).join('') || '<li>None listed.</li>'}</ul>
        ${(ae.important || []).length ? `<p class="mt-2"><strong>Important:</strong></p><ul class="list-clean">${ae.important.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>` : ''}
      </div>

      <div class="profile-section">
        <h2>Contraindications</h2>
        <ul class="list-clean">
          ${(drug.contraindications || []).map(i => `<li>${escapeHtml(i)}</li>`).join('') || '<li>Information not available.</li>'}
        </ul>
      </div>

      <div class="profile-section">
        <h2>Drug Interactions</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Drug/Class</th><th>Interaction</th><th>Significance</th></tr></thead>
            <tbody>
              ${(profileInteractions || []).map(i => `
                <tr>
                  <td>${escapeHtml(i.drug)}</td>
                  <td>${escapeHtml(i.interaction)}</td>
                  <td><span class="severity ${escapeHtml(i.significance || 'MODERATE')}">${escapeHtml(i.significance || 'MODERATE')}</span></td>
                </tr>
              `).join('') || '<tr><td colspan="3">No interactions listed.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <div class="profile-section">
        <h2>Monitoring</h2>
        <ul class="list-clean">
          ${(drug.monitoring || []).map(i => `<li>${escapeHtml(i)}</li>`).join('') || '<li>Information not available.</li>'}
        </ul>
      </div>

      <div class="profile-section">
        <h2>Patient Counseling</h2>
        <ul class="list-clean">
          ${(drug.patientCounseling || []).map(i => `<li>${escapeHtml(i)}</li>`).join('') || '<li>Information not available.</li>'}
        </ul>
      </div>

      <div class="profile-section">
        <h2>Special Populations</h2>
        <div class="adme-grid">
          <div class="adme-card"><h4>Pregnancy</h4><p>${escapeHtml(safe(sp.pregnancy))}</p></div>
          <div class="adme-card"><h4>Breastfeeding</h4><p>${escapeHtml(safe(sp.breastfeeding))}</p></div>
          <div class="adme-card"><h4>Pediatric</h4><p>${escapeHtml(safe(sp.pediatric))}</p></div>
          <div class="adme-card"><h4>Elderly</h4><p>${escapeHtml(safe(sp.elderly))}</p></div>
          <div class="adme-card"><h4>Renal Impairment</h4><p>${escapeHtml(safe(sp.renal))}</p></div>
          <div class="adme-card"><h4>Hepatic Impairment</h4><p>${escapeHtml(safe(sp.hepatic))}</p></div>
        </div>
      </div>

      <div class="profile-section">
        <h2>Storage</h2>
        <p>${escapeHtml(safe(drug.storage))}</p>
      </div>

      <div class="profile-section">
        <h2>Personal Notes</h2>
        <textarea id="drugNotes" rows="3" placeholder="Add your personal study notes here...">${escapeHtml(notes[drug.id] || '')}</textarea>
        <button type="button" class="btn btn-primary btn-sm mt-1" id="btnSaveNotes">Save Notes</button>
      </div>

      <div class="profile-section summary-card">
        <h2>Pharmacological Summary</h2>
        <div class="summary-grid">
          <div class="summary-item"><strong>Drug</strong>${escapeHtml(drug.genericName)}</div>
          <div class="summary-item"><strong>Class</strong>${escapeHtml(drug.drugClass)}</div>
          <div class="summary-item"><strong>Main Target</strong>${escapeHtml((drug.mechanismFlow && drug.mechanismFlow[1]) || '—')}</div>
          <div class="summary-item"><strong>Main Mechanism</strong>${escapeHtml((drug.mechanismFlow && drug.mechanismFlow[2]) || '—')}</div>
          <div class="summary-item"><strong>Main Indication</strong>${escapeHtml((drug.indications && drug.indications[0]) || '—')}</div>
          <div class="summary-item"><strong>Major Adverse Effect</strong>${escapeHtml((ae.serious && ae.serious[0]) || (ae.common && ae.common[0]) || '—')}</div>
          <div class="summary-item"><strong>Important Interaction</strong>${escapeHtml((profileInteractions[0] && profileInteractions[0].drug) || '—')}</div>
          <div class="summary-item"><strong>Main Monitoring</strong>${escapeHtml((drug.monitoring && drug.monitoring[0]) || '—')}</div>
        </div>
      </div>

      <div class="profile-section">
        <h2>References</h2>
        <ul class="list-clean">
          ${(drug.references || ['Standard educational pharmacology references']).map(r => `<li>${escapeHtml(r)}</li>`).join('')}
        </ul>
      </div>

      ${(() => {
        const related = getRelatedDrugs(drug);
        if (!related.length) return '';
        return `
          <div class="profile-section related-section">
            <h2>Related Drugs <small class="text-muted">(same class)</small></h2>
            <p class="text-muted" style="margin-bottom:0.75rem;">
              Other agents in <strong>${escapeHtml(drug.drugClass || drug.therapeuticClass || 'this class')}</strong>
              ${drug.therapeuticClass && drug.therapeuticClass !== drug.drugClass ? ` / <strong>${escapeHtml(drug.therapeuticClass)}</strong>` : ''}
            </p>
            <div class="related-grid">
              ${related.map(r => `
                <button type="button" class="related-card" data-id="${r.id}">
                  <span class="related-name">${escapeHtml(r.genericName)}</span>
                  <span class="related-class">${escapeHtml(r.drugClass || '')}</span>
                </button>
              `).join('')}
            </div>
            <div class="related-actions">
              <button type="button" class="btn btn-secondary btn-sm" id="btnBrowseClass">Browse full class</button>
              <button type="button" class="btn btn-primary btn-sm" id="btnAddToClass">+ Add drug to this class</button>
            </div>
          </div>
        `;
      })()}
    `;

    // Event listeners
    document.getElementById('btnFavorite')?.addEventListener('click', () => toggleFavorite(drug.id));
    document.getElementById('btnDownloadJpg')?.addEventListener('click', () => downloadProfileJpg(drug));
    document.getElementById('btnPrint')?.addEventListener('click', () => window.print());
    document.getElementById('btnEdit')?.addEventListener('click', () => openEditForm(drug));
    document.getElementById('btnDelete')?.addEventListener('click', () => confirmDelete(drug.id));
    document.getElementById('btnSaveNotes')?.addEventListener('click', () => {
      const val = document.getElementById('drugNotes')?.value || '';
      notes[drug.id] = val;
      saveStorage(STORAGE_KEYS.notes, notes);
      scheduleCloudPush();
      showToast('Notes saved');
    });

    el.querySelectorAll('.related-card').forEach(btn => {
      btn.addEventListener('click', () => openDrug(btn.dataset.id));
    });
    document.getElementById('btnBrowseClass')?.addEventListener('click', () => {
      const q = drug.drugClass || drug.therapeuticClass || '';
      if (q) {
        const input = document.getElementById('headerSearch');
        const hero = document.getElementById('heroSearch');
        if (input) input.value = q;
        if (hero) hero.value = q;
        renderSearchResults(searchDrugs(q), q);
      }
    });
    document.getElementById('btnAddToClass')?.addEventListener('click', () => {
      openAddForm({
        drugClass: drug.drugClass || '',
        therapeuticClass: drug.therapeuticClass || ''
      });
    });

    // Clickable class badges
    el.querySelectorAll('.profile-meta .badge').forEach(badge => {
      badge.style.cursor = 'pointer';
      badge.title = 'Search this class';
      badge.addEventListener('click', () => {
        const q = badge.textContent.trim();
        if (!q) return;
        const input = document.getElementById('headerSearch');
        const hero = document.getElementById('heroSearch');
        if (input) input.value = q;
        if (hero) hero.value = q;
        renderSearchResults(searchDrugs(q), q);
      });
    });
  }

  function toggleFavorite(id) {
    if (!id) return;
    const wasFav = favorites.includes(id);
    if (wasFav) {
      favorites = favorites.filter(x => x !== id);
      showToast('Removed from favorites');
    } else {
      favorites.push(id);
      showToast('Added to favorites');
    }
    saveStorage(STORAGE_KEYS.favorites, favorites);
    scheduleCloudPush();

    // Always update star button if present (do not rely only on currentView)
    const btn = document.getElementById('btnFavorite');
    if (btn && currentDrugId === id) {
      const nowFav = favorites.includes(id);
      btn.textContent = nowFav ? '★' : '☆';
      btn.title = nowFav ? 'Remove favorite' : 'Add favorite';
    }
    // Re-render profile when viewing this drug so header state stays consistent
    if (currentDrugId === id) {
      const drug = drugs.find(d => d.id === id);
      if (drug && document.getElementById('view-profile') &&
          !document.getElementById('view-profile').classList.contains('hidden')) {
        renderProfile(drug);
      }
    }
    if (currentView === 'favorites') renderFavorites();
  }

  function confirmDelete(id) {
    if (!confirm('Are you sure you want to delete this drug? This cannot be undone.')) return;
    userDrugs = userDrugs.filter(d => d.id !== id);
    saveStorage(STORAGE_KEYS.userDrugs, userDrugs);
    favorites = favorites.filter(x => x !== id);
    saveStorage(STORAGE_KEYS.favorites, favorites);
    delete notes[id];
    saveStorage(STORAGE_KEYS.notes, notes);
    mergeDrugs();
    scheduleCloudPush();
    showToast('Drug deleted');
    renderHome();
  }

  // ========== FAVORITES ==========
  function renderFavorites() {
    showView('favorites');
    const container = document.getElementById('favoritesList');
    if (!container) return;
    const favDrugs = favorites.map(id => drugs.find(d => d.id === id)).filter(Boolean);
    if (favDrugs.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="icon">★</div><p>No favorites yet. Star a drug to add it here.</p></div>';
      return;
    }
    container.innerHTML = `<div class="results-grid">${favDrugs.map(d => `
      <div class="result-card" tabindex="0" data-id="${d.id}">
        <h3>${escapeHtml(d.genericName)}</h3>
        <div class="class">${escapeHtml(d.drugClass)}</div>
      </div>
    `).join('')}</div>`;
    container.querySelectorAll('.result-card').forEach(c => {
      c.addEventListener('click', () => openDrug(c.dataset.id));
    });
  }

  // ========== ADD / EDIT ==========
  // ========== CHATGPT PROMPT + AUTO-FILL ==========
  function buildChatGptPrompt(drugName) {
    const name = (drugName || '').trim();
    return `You are a pharmacology educator. Create educational drug information for pharmacy students about "${name}".

Return ONLY valid JSON (no markdown, no commentary) using exactly this structure:
{
  "genericName": "${name}",
  "brandNames": ["Brand1", "Brand2"],
  "drugClass": "Pharmacological class (mechanism-based)",
  "therapeuticClass": "Therapeutic use class",
  "mechanismOfAction": "2-4 sentence mechanism of action",
  "mechanismFlow": ["Drug", "Target", "Cellular effect", "Physiological effect", "Therapeutic outcome"],
  "pharmacokinetics": {
    "absorption": "Brief absorption notes",
    "distribution": "Brief distribution notes",
    "metabolism": "Brief metabolism notes",
    "excretion": "Brief excretion / half-life notes"
  },
  "indications": ["Indication 1", "Indication 2"],
  "dosage": {
    "routes": ["Oral", "IV"],
    "adult": "Typical adult dosing summary (educational only)",
    "pediatric": "Pediatric notes or Not established",
    "notes": "Educational only. Verify with official prescribing information."
  },
  "adverseEffects": {
    "common": ["Common effect 1", "Common effect 2"],
    "serious": ["Serious effect 1", "Serious effect 2"],
    "important": ["Key safety note"]
  },
  "contraindications": ["Contraindication 1", "Contraindication 2"],
  "interactions": [
    {"drug": "Interacting drug/class", "interaction": "What happens", "significance": "HIGH"}
  ],
  "monitoring": ["Monitoring item 1", "Monitoring item 2"],
  "patientCounseling": ["Counseling point 1", "Counseling point 2"],
  "specialPopulations": {
    "pregnancy": "Brief note",
    "breastfeeding": "Brief note",
    "pediatric": "Brief note",
    "elderly": "Brief note",
    "renal": "Brief note",
    "hepatic": "Brief note"
  },
  "storage": "Storage note",
  "references": ["Standard educational pharmacology references"]
}

Rules:
- Educational content only; do not invent precise proprietary brand exclusivity claims.
- Keep dosing high-level and labeled educational.
- significance must be one of: HIGH, MODERATE, LOW.
- Output pure JSON only.`;
  }

  function extractJsonFromText(text) {
    if (!text || !String(text).trim()) return null;
    let t = String(text).trim();
    // Strip markdown code fences if present
    const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) t = fence[1].trim();
    // Direct parse
    try { return JSON.parse(t); } catch (_) {}
    // Find first { ... last }
    const start = t.indexOf('{');
    const end = t.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try { return JSON.parse(t.slice(start, end + 1)); } catch (_) {}
    }
    return null;
  }

  function generateAiPrompt() {
    const nameInput = document.getElementById('aiDrugName');
    const formName = document.getElementById('genericName');
    const name = (nameInput?.value || formName?.value || '').trim();
    if (!name) {
      showToast('Enter a drug name first', 'error');
      nameInput?.focus();
      return;
    }
    if (nameInput && !nameInput.value) nameInput.value = name;
    if (formName && !formName.value) formName.value = name;
    const prompt = buildChatGptPrompt(name);
    const box = document.getElementById('aiPromptBox');
    if (box) box.value = prompt;
    showToast('Prompt ready — click Copy Prompt');
  }

  async function copyAiPrompt() {
    const box = document.getElementById('aiPromptBox');
    const text = box?.value || '';
    if (!text.trim()) {
      generateAiPrompt();
    }
    const finalText = document.getElementById('aiPromptBox')?.value || '';
    if (!finalText.trim()) return;
    try {
      await navigator.clipboard.writeText(finalText);
      showToast('Prompt copied — paste into ChatGPT');
    } catch (_) {
      box.select();
      document.execCommand('copy');
      showToast('Prompt copied');
    }
  }

  function autoFillFromAiResponse() {
    const raw = document.getElementById('aiResponseBox')?.value || '';
    const data = extractJsonFromText(raw);
    if (!data || typeof data !== 'object') {
      showToast('Could not read JSON. Ask ChatGPT for JSON only, then paste again.', 'error');
      return;
    }
    const f = document.getElementById('addForm');
    if (!f) return;

    const setVal = (name, val) => {
      if (f[name] != null && val != null && val !== undefined) f[name].value = val;
    };
    const joinArr = (arr, sep) => Array.isArray(arr) ? arr.filter(Boolean).join(sep) : (arr || '');

    setVal('genericName', data.genericName || '');
    setVal('brandNames', joinArr(data.brandNames, ', '));
    // Keep the class the user started from — do not let ChatGPT create a new class box
    if (lockedDrugClass) {
      setVal('drugClass', lockedDrugClass);
    } else {
      setVal('drugClass', normalizeToExistingClass(data.drugClass || '', 'drugClass') || data.drugClass || '');
    }
    if (lockedTherapeuticClass) {
      setVal('therapeuticClass', lockedTherapeuticClass);
    } else {
      setVal('therapeuticClass', normalizeToExistingClass(data.therapeuticClass || '', 'therapeuticClass') || data.therapeuticClass || '');
    }
    setVal('mechanismOfAction', data.mechanismOfAction || '');
    setVal('mechanismFlow', joinArr(data.mechanismFlow, ' | '));

    const pk = data.pharmacokinetics || {};
    setVal('absorption', pk.absorption || '');
    setVal('distribution', pk.distribution || '');
    setVal('metabolism', pk.metabolism || '');
    setVal('excretion', pk.excretion || '');

    setVal('indications', joinArr(data.indications, '\n'));
    const dose = data.dosage || {};
    setVal('routes', joinArr(dose.routes, ', '));
    setVal('adultDose', dose.adult || '');
    setVal('pediatricDose', dose.pediatric || '');
    setVal('doseNotes', dose.notes || 'Educational only. Verify with official labeling.');

    const ae = data.adverseEffects || {};
    setVal('commonAE', joinArr(ae.common, '\n'));
    setVal('seriousAE', joinArr(ae.serious, '\n'));
    setVal('contraindications', joinArr(data.contraindications, '\n'));
    setVal('monitoring', joinArr(data.monitoring, '\n'));
    setVal('counseling', joinArr(data.patientCounseling, '\n'));
    setVal('storage', data.storage || '');

    // Store interactions / special populations on a hidden holding area via dataset for save enhancement
    f.dataset.aiInteractions = JSON.stringify(Array.isArray(data.interactions) ? data.interactions : []);
    f.dataset.aiSpecial = JSON.stringify(data.specialPopulations || {});
    f.dataset.aiImportantAE = JSON.stringify(Array.isArray(ae.important) ? ae.important : []);
    f.dataset.aiReferences = JSON.stringify(Array.isArray(data.references) ? data.references : ['User-added via ChatGPT assist']);

    const aiName = document.getElementById('aiDrugName');
    if (aiName && data.genericName) aiName.value = data.genericName;

    showToast('Form auto-filled — review and click Save Drug');
    f.querySelector('#genericName')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function clearAiHelper() {
    ['aiDrugName', 'aiPromptBox', 'aiResponseBox'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const f = document.getElementById('addForm');
    if (f) {
      delete f.dataset.aiInteractions;
      delete f.dataset.aiSpecial;
      delete f.dataset.aiImportantAE;
      delete f.dataset.aiReferences;
    }
  }

  function openAddForm(prefill) {
    showView('add');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === 'add'));
    document.getElementById('addForm')?.reset();
    document.getElementById('formTitle').textContent = 'Add New Drug';
    document.getElementById('editId').value = '';
    lockedDrugClass = null;
    lockedTherapeuticClass = null;
    document.getElementById('classLockNote')?.remove();
    const f = document.getElementById('addForm');
    if (f) {
      if (f.drugClass) { f.drugClass.readOnly = false; f.drugClass.title = ''; }
      if (f.therapeuticClass) { f.therapeuticClass.readOnly = false; f.therapeuticClass.title = ''; }
    }
    if (prefill && typeof prefill === 'object') {
      if (f) {
        if (prefill.drugClass) {
          f.drugClass.value = prefill.drugClass;
          lockedDrugClass = prefill.drugClass;
          f.drugClass.readOnly = true;
          f.drugClass.title = 'Locked to the class you started from';
        }
        if (prefill.therapeuticClass) {
          f.therapeuticClass.value = prefill.therapeuticClass;
          lockedTherapeuticClass = prefill.therapeuticClass;
          f.therapeuticClass.readOnly = true;
          f.therapeuticClass.title = 'Locked to the class you started from';
        }
        if (prefill.genericName) f.genericName.value = prefill.genericName;
      }
      if (prefill.drugClass || prefill.therapeuticClass) {
        const clsLabel = prefill.drugClass || prefill.therapeuticClass;
        showToast('Saving into class: ' + clsLabel);
        const form = document.getElementById('addForm');
        if (form && !document.getElementById('classLockNote')) {
          const note = document.createElement('p');
          note.id = 'classLockNote';
          note.className = 'class-lock-note';
          note.innerHTML = 'This drug will be saved under <strong>' + clsLabel + '</strong> (same class box). ChatGPT cannot change this class.';
          form.parentElement?.insertBefore(note, form);
        }
      }
    }
  }

  function openEditForm(drug) {
    showView('add');
    document.getElementById('formTitle').textContent = 'Edit Drug';
    document.getElementById('editId').value = drug.id;
    const f = document.getElementById('addForm');
    if (!f) return;
    f.genericName.value = drug.genericName || '';
    f.brandNames.value = (drug.brandNames || []).join(', ');
    f.drugClass.value = drug.drugClass || '';
    f.therapeuticClass.value = drug.therapeuticClass || '';
    f.mechanismOfAction.value = drug.mechanismOfAction || '';
    f.mechanismFlow.value = (drug.mechanismFlow || []).join(' | ');
    f.absorption.value = (drug.pharmacokinetics && drug.pharmacokinetics.absorption) || '';
    f.distribution.value = (drug.pharmacokinetics && drug.pharmacokinetics.distribution) || '';
    f.metabolism.value = (drug.pharmacokinetics && drug.pharmacokinetics.metabolism) || '';
    f.excretion.value = (drug.pharmacokinetics && drug.pharmacokinetics.excretion) || '';
    f.indications.value = (drug.indications || []).join('\n');
    f.routes.value = (drug.dosage && drug.dosage.routes || []).join(', ');
    f.adultDose.value = (drug.dosage && drug.dosage.adult) || '';
    f.pediatricDose.value = (drug.dosage && drug.dosage.pediatric) || '';
    f.doseNotes.value = (drug.dosage && drug.dosage.notes) || '';
    f.commonAE.value = (drug.adverseEffects && drug.adverseEffects.common || []).join('\n');
    f.seriousAE.value = (drug.adverseEffects && drug.adverseEffects.serious || []).join('\n');
    f.contraindications.value = (drug.contraindications || []).join('\n');
    f.monitoring.value = (drug.monitoring || []).join('\n');
    f.counseling.value = (drug.patientCounseling || []).join('\n');
    f.storage.value = drug.storage || '';
  }

  function saveDrug(e) {
    if (e && e.preventDefault) e.preventDefault();
    // Prevent double-submit (double-click / Enter + click)
    if (window.__pharmaSavingDrug) return;
    window.__pharmaSavingDrug = true;
    setTimeout(() => { window.__pharmaSavingDrug = false; }, 800);

    const f = (e && e.target && e.target.tagName === 'FORM')
      ? e.target
      : document.getElementById('addForm');
    if (!f) {
      window.__pharmaSavingDrug = false;
      return;
    }

    const genericName = (f.genericName && f.genericName.value || '').trim();
    if (!genericName) {
      showToast('Generic name is required', 'error');
      window.__pharmaSavingDrug = false;
      return;
    }

    // Reuse edit id, or existing user drug with same generic name, else new id
    let id = (document.getElementById('editId') && document.getElementById('editId').value || '').trim();
    if (!id) {
      const existingSame = userDrugs.find(d =>
        (d.genericName || '').toLowerCase() === genericName.toLowerCase()
      );
      if (existingSame) id = existingSame.id;
      else id = genericName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();
    }

    const drug = {
      id,
      genericName,
      brandNames: (f.brandNames && f.brandNames.value || '').split(',').map(s => s.trim()).filter(Boolean),
      drugClass: (f.drugClass && f.drugClass.value || '').trim(),
      therapeuticClass: (f.therapeuticClass && f.therapeuticClass.value || '').trim(),
      mechanismOfAction: (f.mechanismOfAction && f.mechanismOfAction.value || '').trim(),
      mechanismFlow: (f.mechanismFlow && f.mechanismFlow.value || '').split('|').map(s => s.trim()).filter(Boolean),
      pharmacokinetics: {
        absorption: (f.absorption && f.absorption.value || '').trim(),
        distribution: (f.distribution && f.distribution.value || '').trim(),
        metabolism: (f.metabolism && f.metabolism.value || '').trim(),
        excretion: (f.excretion && f.excretion.value || '').trim()
      },
      indications: (f.indications && f.indications.value || '').split('\n').map(s => s.trim()).filter(Boolean),
      dosage: {
        routes: (f.routes && f.routes.value || '').split(',').map(s => s.trim()).filter(Boolean),
        adult: (f.adultDose && f.adultDose.value || '').trim(),
        pediatric: (f.pediatricDose && f.pediatricDose.value || '').trim(),
        notes: (f.doseNotes && f.doseNotes.value || '').trim()
      },
      adverseEffects: {
        common: (f.commonAE && f.commonAE.value || '').split('\n').map(s => s.trim()).filter(Boolean),
        serious: (f.seriousAE && f.seriousAE.value || '').split('\n').map(s => s.trim()).filter(Boolean),
        important: (function(){ try { return JSON.parse(f.dataset.aiImportantAE || '[]'); } catch(err){ return []; } })()
      },
      contraindications: (f.contraindications && f.contraindications.value || '').split('\n').map(s => s.trim()).filter(Boolean),
      interactions: (function(){ try { return JSON.parse(f.dataset.aiInteractions || '[]'); } catch(err){ return []; } })(),
      monitoring: (f.monitoring && f.monitoring.value || '').split('\n').map(s => s.trim()).filter(Boolean),
      patientCounseling: (f.counseling && f.counseling.value || '').split('\n').map(s => s.trim()).filter(Boolean),
      specialPopulations: (function(){ try { return Object.assign({ pregnancy: '', breastfeeding: '', pediatric: '', elderly: '', renal: '', hepatic: '' }, JSON.parse(f.dataset.aiSpecial || '{}')); } catch(err){ return { pregnancy: '', breastfeeding: '', pediatric: '', elderly: '', renal: '', hepatic: '' }; } })(),
      storage: (f.storage && f.storage.value || '').trim(),
      references: (function(){ try { const r = JSON.parse(f.dataset.aiReferences || '[]'); return r.length ? r : ['User-added entry']; } catch(err){ return ['User-added entry']; } })()
    };

    // Always keep the class the user started adding into
    if (lockedDrugClass) {
      drug.drugClass = lockedDrugClass;
    } else {
      drug.drugClass = normalizeToExistingClass(drug.drugClass, 'drugClass') || drug.drugClass;
    }
    if (lockedTherapeuticClass) {
      drug.therapeuticClass = lockedTherapeuticClass;
    } else if (drug.therapeuticClass) {
      drug.therapeuticClass = normalizeToExistingClass(drug.therapeuticClass, 'therapeuticClass') || drug.therapeuticClass;
    }
    if (!drug.drugClass) {
      drug.drugClass = 'Unclassified';
    }

    // Reflect final class on the form fields
    if (f.drugClass) f.drugClass.value = drug.drugClass;
    if (f.therapeuticClass && drug.therapeuticClass) f.therapeuticClass.value = drug.therapeuticClass;

    drug.updatedAt = new Date().toISOString();
    const existingIdx = userDrugs.findIndex(d => d.id === id);
    if (existingIdx >= 0) {
      userDrugs[existingIdx] = drug;
    } else {
      // Drop accidental duplicates (same id or same generic name)
      userDrugs = userDrugs.filter(d =>
        d.id !== id &&
        (d.genericName || '').toLowerCase() !== genericName.toLowerCase()
      );
      userDrugs.push(drug);
    }
    saveStorage(STORAGE_KEYS.userDrugs, userDrugs);
    mergeDrugs();
    scheduleCloudPush();

    const targetClass = drug.drugClass;
    showToast('Saved in class: ' + targetClass);

    // Clear locks for next add
    lockedDrugClass = null;
    lockedTherapeuticClass = null;
    if (f.drugClass) { f.drugClass.readOnly = false; f.drugClass.title = ''; }
    if (f.therapeuticClass) { f.therapeuticClass.readOnly = false; }
    document.getElementById('classLockNote')?.remove();
    const editIdEl = document.getElementById('editId');
    if (editIdEl) editIdEl.value = '';

    // Show the SAME class box with this drug inside (Drug Classes view, focused/open)
    renderDrugClasses(targetClass);
  }

  // ========== CLASSIFICATION ==========
  function collectClassMaps() {
    const classes = {};
    const therapeutic = {};
    const classKeyToLabel = {};
    const therKeyToLabel = {};
    drugs.forEach(d => {
      const cRaw = (d.drugClass || 'Other').trim() || 'Other';
      const cKey = cRaw.toLowerCase();
      if (!classKeyToLabel[cKey]) classKeyToLabel[cKey] = cRaw;
      const c = classKeyToLabel[cKey];
      if (!classes[c]) classes[c] = [];
      classes[c].push(d);
      const tRaw = (d.therapeuticClass || 'Other').trim() || 'Other';
      const tKey = tRaw.toLowerCase();
      if (!therKeyToLabel[tKey]) therKeyToLabel[tKey] = tRaw;
      const t = therKeyToLabel[tKey];
      if (!therapeutic[t]) therapeutic[t] = [];
      therapeutic[t].push(d);
    });
    // Include custom classes even if empty
    customClasses.forEach(cc => {
      if (cc.type === 'therapeuticClass') {
        if (!therapeutic[cc.name]) therapeutic[cc.name] = [];
      } else {
        if (!classes[cc.name]) classes[cc.name] = [];
      }
    });
    return { classes, therapeutic };
  }

  function getClassMeta(name, type) {
    return customClasses.find(c => c.name === name && (c.type === type || !type)) ||
           customClasses.find(c => c.name === name) || null;
  }

  // ========== CLASSIFICATION (add / manage classes) ==========
  function renderClassification() {
    showView('classification');
    const container = document.getElementById('classificationTree');
    if (!container) return;
    const { classes, therapeutic } = collectClassMaps();

    function buildClassList(title, groupMap, type) {
      const wrap = document.createElement('div');
      const ht = document.createElement('div');
      ht.className = 'class-group-title';
      ht.textContent = title;
      wrap.appendChild(ht);

      Object.keys(groupMap).sort().forEach(cls => {
        const list = groupMap[cls] || [];
        const meta = getClassMeta(cls, type);
        const item = document.createElement('div');
        item.className = 'class-item class-item-manage';
        item.dataset.className = cls.toLowerCase();
        item.dataset.search = (cls + ' ' + (meta && meta.description || '')).toLowerCase();

        const header = document.createElement('div');
        header.className = 'class-header';
        header.innerHTML = `<span></span><span class="class-count-badge">${list.length} drug${list.length === 1 ? '' : 's'}</span>`;
        header.querySelector('span').textContent = cls;
        item.appendChild(header);

        const body = document.createElement('div');
        body.className = 'class-drugs open-always';
        if (meta && meta.description) {
          const desc = document.createElement('p');
          desc.className = 'class-desc text-muted';
          desc.textContent = meta.description;
          body.appendChild(desc);
        }
        const toolbar = document.createElement('div');
        toolbar.className = 'class-toolbar';
        const addDrugBtn = document.createElement('button');
        addDrugBtn.type = 'button';
        addDrugBtn.className = 'btn btn-primary btn-sm';
        addDrugBtn.textContent = '+ Add drug to this class';
        addDrugBtn.addEventListener('click', () => {
          const prefill = type === 'therapeuticClass' ? { therapeuticClass: cls } : { drugClass: cls };
          openAddForm(prefill);
        });
        const browseBtn = document.createElement('button');
        browseBtn.type = 'button';
        browseBtn.className = 'btn btn-secondary btn-sm';
        browseBtn.textContent = 'View drugs';
        browseBtn.addEventListener('click', () => {
          showView('drugclasses');
          document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === 'drugclasses'));
          renderDrugClasses(cls);
        });
        toolbar.appendChild(addDrugBtn);
        toolbar.appendChild(browseBtn);
        if (meta && meta.id) {
          const delBtn = document.createElement('button');
          delBtn.type = 'button';
          delBtn.className = 'btn btn-ghost btn-sm';
          delBtn.textContent = 'Remove class';
          delBtn.addEventListener('click', () => {
            if (!confirm(`Remove custom class "${cls}"? Drugs are not deleted.`)) return;
            customClasses = customClasses.filter(c => c.id !== meta.id);
            saveStorage(STORAGE_KEYS.customClasses, customClasses);
            scheduleCloudPush();
            showToast('Class removed');
            renderClassification();
          });
          toolbar.appendChild(delBtn);
        }
        body.appendChild(toolbar);
        item.appendChild(body);
        wrap.appendChild(item);
      });
      return wrap;
    }

    container.innerHTML = '';
    container.appendChild(buildClassList('Drug Classes (mechanism / pharmacology)', classes, 'drugClass'));
    container.appendChild(buildClassList('Therapeutic Classes', therapeutic, 'therapeuticClass'));

    const search = document.getElementById('classificationSearch');
    if (search) {
      search.oninput = () => {
        const q = search.value.toLowerCase().trim();
        container.querySelectorAll('.class-item-manage').forEach(item => {
          item.style.display = !q || (item.dataset.search || '').includes(q) ? '' : 'none';
        });
        container.querySelectorAll('.class-group-title').forEach(title => {
          const wrap = title.parentElement;
          const visible = [...wrap.querySelectorAll('.class-item-manage')].some(i => i.style.display !== 'none');
          title.style.display = visible ? '' : 'none';
        });
      };
    }

    const btnAdd = document.getElementById('btnAddClass');
    if (btnAdd) btnAdd.onclick = () => openAddClassModal();
  }

  function openAddClassModal() {
    // Prefer dedicated classification page context
    showView('classification');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === 'addclass' || b.dataset.view === 'classification'));
    const modal = document.getElementById('addClassModal');
    if (!modal) {
      showToast('Open Classification to add a class', 'error');
      return;
    }
    modal.classList.remove('hidden');
    const form = document.getElementById('addClassForm');
    form?.reset();
    document.getElementById('newClassName')?.focus();
  }

  function closeAddClassModal() {
    document.getElementById('addClassModal')?.classList.add('hidden');
  }

  function saveCustomClass(e) {
    e.preventDefault();
    const name = (document.getElementById('newClassName')?.value || '').trim();
    const type = document.getElementById('newClassType')?.value || 'drugClass';
    const description = (document.getElementById('newClassDesc')?.value || '').trim();
    if (!name) {
      showToast('Class name is required', 'error');
      return;
    }
    const exists = customClasses.some(c => c.name.toLowerCase() === name.toLowerCase() && c.type === type) ||
      drugs.some(d => (type === 'therapeuticClass' ? d.therapeuticClass : d.drugClass || '').toLowerCase() === name.toLowerCase());
    if (exists) {
      showToast('This class already exists', 'error');
      return;
    }
    customClasses.push({
      id: 'class-' + Date.now(),
      name,
      type,
      description
    });
    saveStorage(STORAGE_KEYS.customClasses, customClasses);
    scheduleCloudPush();
    closeAddClassModal();
    showToast('Drug class added');
    renderClassification();
  }

  // ========== DRUG CLASSES (browse / add specific drugs) ==========
  function renderDrugClasses(focusClass) {
    showView('drugclasses');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === 'drugclasses'));
    const container = document.getElementById('drugClassTree');
    if (!container) return;
    const { classes, therapeutic } = collectClassMaps();

    function buildGroup(title, groupMap, field) {
      const wrap = document.createElement('div');
      const ht = document.createElement('div');
      ht.className = 'class-group-title';
      ht.textContent = title;
      wrap.appendChild(ht);

      Object.keys(groupMap).sort().forEach(cls => {
        const list = (groupMap[cls] || []).slice().sort((a, b) => (a.genericName || '').localeCompare(b.genericName || ''));
        const item = document.createElement('div');
        item.className = 'class-item';
        item.dataset.search = (cls + ' ' + list.map(d => d.genericName || '').join(' ')).toLowerCase();
        if (focusClass && cls.toLowerCase() === String(focusClass).toLowerCase()) {
          item.classList.add('open');
        }

        const header = document.createElement('div');
        header.className = 'class-header';
        header.tabIndex = 0;
        header.setAttribute('role', 'button');
        header.innerHTML = `<span></span><span class="class-chevron">▾</span>`;
        header.querySelector('span').textContent = `${cls} (${list.length})`;
        item.appendChild(header);

        const body = document.createElement('div');
        body.className = 'class-drugs';

        const toolbar = document.createElement('div');
        toolbar.className = 'class-toolbar';
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'btn btn-primary btn-sm';
        addBtn.textContent = '+ Add drug to this class';
        addBtn.addEventListener('click', e => {
          e.stopPropagation();
          const prefill = field === 'therapeuticClass' ? { therapeuticClass: cls } : { drugClass: cls };
          openAddForm(prefill);
        });
        const searchBtn = document.createElement('button');
        searchBtn.type = 'button';
        searchBtn.className = 'btn btn-secondary btn-sm';
        searchBtn.textContent = 'Search class';
        searchBtn.addEventListener('click', e => {
          e.stopPropagation();
          const headerInp = document.getElementById('headerSearch');
          const hero = document.getElementById('heroSearch');
          if (headerInp) headerInp.value = cls;
          if (hero) hero.value = cls;
          renderSearchResults(searchDrugs(cls), cls);
        });
        toolbar.appendChild(addBtn);
        toolbar.appendChild(searchBtn);
        body.appendChild(toolbar);

        if (!list.length) {
          const empty = document.createElement('p');
          empty.className = 'text-muted';
          empty.textContent = 'No drugs in this class yet. Add one above.';
          body.appendChild(empty);
        }
        list.forEach(d => {
          const row = document.createElement('div');
          row.className = 'class-drug';
          row.dataset.id = d.id;
          row.textContent = d.genericName || d.id;
          row.addEventListener('click', () => openDrug(d.id));
          body.appendChild(row);
        });

        item.appendChild(body);
        wrap.appendChild(item);
      });
      return wrap;
    }

    container.innerHTML = '';
    container.appendChild(buildGroup('By Drug Class (mechanism / pharmacology)', classes, 'drugClass'));
    container.appendChild(buildGroup('By Therapeutic Class', therapeutic, 'therapeuticClass'));

    container.querySelectorAll('.class-header').forEach(h => {
      h.addEventListener('click', () => h.parentElement.classList.toggle('open'));
      h.addEventListener('keydown', e => { if (e.key === 'Enter') h.parentElement.classList.toggle('open'); });
    });

    const topAdd = document.getElementById('btnAddDrugFromClasses');
    if (topAdd) topAdd.onclick = () => openAddForm();

    const filterInput = document.getElementById('drugClassSearch');
    if (filterInput) {
      if (focusClass) filterInput.value = focusClass;
      filterInput.oninput = () => {
        const q = filterInput.value.toLowerCase().trim();
        container.querySelectorAll('.class-item').forEach(item => {
          const match = !q || (item.dataset.search || '').includes(q);
          item.style.display = match ? '' : 'none';
          if (match && q) item.classList.add('open');
        });
        container.querySelectorAll('.class-group-title').forEach(title => {
          const wrap = title.parentElement;
          const visible = [...wrap.querySelectorAll('.class-item')].some(i => i.style.display !== 'none');
          title.style.display = visible ? '' : 'none';
        });
      };
      if (focusClass) filterInput.dispatchEvent(new Event('input'));
    }
  }

  // ========== STUDY MODE ==========
  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function getQuizPool(selectedIds) {
    mergeDrugs();
    if (selectedIds && selectedIds.length) {
      const set = new Set(selectedIds);
      return drugs.filter(d => set.has(d.id));
    }
    return drugs.slice();
  }

  function generateQuiz(selectedIds) {
    const pool = getQuizPool(selectedIds).filter(d => d && d.genericName);
    const distractorPool = drugs.filter(d => d && d.genericName);
    if (!pool.length) return [];

    const questions = [];
    const maxQuestions = Math.min(12, Math.max(pool.length * 3, pool.length));

    function pickDistractors(correctName, count) {
      const opts = [correctName];
      const shuffled = shuffleArray(distractorPool);
      for (const d of shuffled) {
        if (opts.length >= count) break;
        if (d.genericName && !opts.includes(d.genericName)) opts.push(d.genericName);
      }
      // pad if needed
      while (opts.length < count) opts.push('Option ' + opts.length);
      return shuffleArray(opts);
    }

    // Build question candidates from each selected drug
    const templates = [];
    pool.forEach(d => {
      const name = d.genericName;
      if (d.drugClass) {
        templates.push({
          question: `Which drug belongs to the class: ${d.drugClass}?`,
          answer: name,
          options: pickDistractors(name, 4)
        });
        templates.push({
          question: `What is the drug class of ${name}?`,
          answer: d.drugClass,
          options: shuffleArray([
            d.drugClass,
            ...shuffleArray(drugs.map(x => x.drugClass).filter(c => c && c !== d.drugClass)).slice(0, 3)
          ]).slice(0, 4)
        });
      }
      if (d.mechanismOfAction) {
        const shortMech = d.mechanismOfAction.length > 140 ? d.mechanismOfAction.slice(0, 140) + '…' : d.mechanismOfAction;
        templates.push({
          question: `Which drug matches this mechanism?\n${shortMech}`,
          answer: name,
          options: pickDistractors(name, 4)
        });
      }
      if (d.mechanismFlow && d.mechanismFlow.length >= 2) {
        const target = d.mechanismFlow[1];
        templates.push({
          question: `Which drug primarily acts on / involves: ${target}?`,
          answer: name,
          options: pickDistractors(name, 4)
        });
      }
      if (d.indications && d.indications.length) {
        templates.push({
          question: `Which drug is indicated for: ${d.indications[0]}?`,
          answer: name,
          options: pickDistractors(name, 4)
        });
      }
      if (d.adverseEffects && d.adverseEffects.serious && d.adverseEffects.serious.length) {
        templates.push({
          question: `Which drug is most associated with this serious effect: ${d.adverseEffects.serious[0]}?`,
          answer: name,
          options: pickDistractors(name, 4)
        });
      } else if (d.adverseEffects && d.adverseEffects.common && d.adverseEffects.common.length) {
        templates.push({
          question: `Which drug commonly causes: ${d.adverseEffects.common[0]}?`,
          answer: name,
          options: pickDistractors(name, 4)
        });
      }
    });

    const shuffledQ = shuffleArray(templates);
    for (const q of shuffledQ) {
      if (questions.length >= maxQuestions) break;
      // ensure answer is in options
      if (!q.options.includes(q.answer)) {
        q.options = shuffleArray([q.answer, ...q.options.filter(o => o !== q.answer)].slice(0, 4));
      }
      questions.push(q);
    }
    // If still few questions (single drug), allow repeats with different templates already handled
    return questions;
  }

  function renderQuizSetup() {
    const setup = document.getElementById('quizSetup');
    const area = document.getElementById('quizArea');
    if (area) area.innerHTML = '';
    if (!setup) return;

    const selected = new Set(quizState.selectedIds || []);
    let mode = quizState.mode || 'quiz'; // quiz | viva | dialogue

    setup.innerHTML = `
      <div class="card card-body quiz-setup-card">
        <div class="study-mode-tabs">
          <button type="button" class="study-tab ${mode === 'quiz' ? 'active' : ''}" data-mode="quiz">Quiz</button>
          <button type="button" class="study-tab ${mode === 'viva' ? 'active' : ''}" data-mode="viva">Viva</button>
          <button type="button" class="study-tab ${mode === 'dialogue' ? 'active' : ''}" data-mode="dialogue">Dialogue</button>
        </div>
        <div id="studyModeHelp" class="text-muted" style="margin:0.5rem 0 0.75rem"></div>
        <h3 style="margin-top:0">Choose drug(s)</h3>
        <div class="form-group">
          <label for="quizDrugSearch">Search drugs</label>
          <input type="search" id="quizDrugSearch" placeholder="Type drug name or class..." autocomplete="off">
        </div>
        <div class="quiz-selected-bar">
          <span id="quizSelectedCount">${selected.size} selected</span>
          <button type="button" class="btn btn-ghost btn-sm" id="quizClearSelected">Clear</button>
          <button type="button" class="btn btn-secondary btn-sm" id="quizSelectAllVisible">Select visible</button>
        </div>
        <div class="quiz-drug-pick-list" id="quizDrugPickList"></div>
        <div class="quiz-setup-actions">
          <button type="button" class="btn btn-primary" id="quizStartBtn">Start</button>
          <button type="button" class="btn btn-secondary" id="quizStartAllBtn">Use all drugs</button>
        </div>
      </div>
    `;

    function updateHelp() {
      const help = document.getElementById('studyModeHelp');
      if (!help) return;
      if (mode === 'viva') {
        help.innerHTML = '<strong>Viva:</strong> Examiner-style questions about your selected drug(s). Reveal model answers after you think.';
      } else if (mode === 'dialogue') {
        help.innerHTML = '<strong>Dialogue:</strong> Conversational coach asks conceptual questions, gives feedback on your answer, then asks the next question.';
      } else {
        help.innerHTML = '<strong>Quiz:</strong> Multiple-choice questions generated from your selected drug(s).';
      }
      const startBtn = document.getElementById('quizStartBtn');
      if (startBtn) {
        startBtn.textContent = mode === 'viva' ? 'Start viva' : mode === 'dialogue' ? 'Start dialogue' : 'Start quiz';
      }
    }
    updateHelp();

    setup.querySelectorAll('.study-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        mode = tab.dataset.mode;
        setup.querySelectorAll('.study-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
        updateHelp();
      });
    });

    function renderList(filter) {
      const list = document.getElementById('quizDrugPickList');
      if (!list) return;
      const q = (filter || '').toLowerCase().trim();
      const items = drugs
        .filter(d => {
          if (!d.genericName) return false;
          if (!q) return true;
          const blob = [d.genericName, ...(d.brandNames || []), d.drugClass || '', d.therapeuticClass || ''].join(' ').toLowerCase();
          return blob.includes(q);
        })
        .sort((a, b) => a.genericName.localeCompare(b.genericName))
        .slice(0, 80);

      list.innerHTML = items.map(d => `
        <label class="quiz-pick-item">
          <input type="checkbox" data-id="${d.id}" ${selected.has(d.id) ? 'checked' : ''}>
          <span class="quiz-pick-name">${escapeHtml(d.genericName)}</span>
          <span class="quiz-pick-class">${escapeHtml(d.drugClass || '')}</span>
        </label>
      `).join('') || '<p class="text-muted">No drugs match.</p>';

      list.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
          if (cb.checked) selected.add(cb.dataset.id);
          else selected.delete(cb.dataset.id);
          const count = document.getElementById('quizSelectedCount');
          if (count) count.textContent = selected.size + ' selected';
        });
      });
    }

    renderList('');
    document.getElementById('quizDrugSearch')?.addEventListener('input', e => renderList(e.target.value));
    document.getElementById('quizClearSelected')?.addEventListener('click', () => {
      selected.clear();
      renderList(document.getElementById('quizDrugSearch')?.value || '');
      const count = document.getElementById('quizSelectedCount');
      if (count) count.textContent = '0 selected';
    });
    document.getElementById('quizSelectAllVisible')?.addEventListener('click', () => {
      document.querySelectorAll('#quizDrugPickList input[type="checkbox"]').forEach(cb => {
        cb.checked = true;
        selected.add(cb.dataset.id);
      });
      const count = document.getElementById('quizSelectedCount');
      if (count) count.textContent = selected.size + ' selected';
    });
    document.getElementById('quizStartBtn')?.addEventListener('click', () => {
      if (!selected.size) {
        showToast('Select at least one drug', 'error');
        return;
      }
      startStudyMode(mode, [...selected]);
    });
    document.getElementById('quizStartAllBtn')?.addEventListener('click', () => {
      startStudyMode(mode, null);
    });
  }

  function generateVivaCards(selectedIds) {
    const pool = getQuizPool(selectedIds).filter(d => d && d.genericName);
    const cards = [];
    pool.forEach(d => {
      const name = d.genericName;
      const pk = d.pharmacokinetics || {};
      const ae = d.adverseEffects || {};
      const dose = d.dosage || {};
      const items = [
        {
          prompt: `Define ${name} and state its pharmacological class.`,
          answer: `${name} is classified as ${d.drugClass || '—'}${d.therapeuticClass ? ' (therapeutic: ' + d.therapeuticClass + ')' : ''}.`
        },
        {
          prompt: `Explain the mechanism of action of ${name}.`,
          answer: d.mechanismOfAction || 'Information not available in the database.'
        },
        {
          prompt: `Outline the ADME (pharmacokinetics) of ${name}.`,
          answer: [
            'Absorption: ' + (pk.absorption || '—'),
            'Distribution: ' + (pk.distribution || '—'),
            'Metabolism: ' + (pk.metabolism || '—'),
            'Excretion: ' + (pk.excretion || '—')
          ].join('\n')
        },
        {
          prompt: `List major indications of ${name}.`,
          answer: (d.indications && d.indications.length) ? d.indications.map((x, i) => (i + 1) + '. ' + x).join('\n') : '—'
        },
        {
          prompt: `What adverse effects are important for ${name}? Mention common and serious effects.`,
          answer: [
            'Common: ' + ((ae.common || []).join('; ') || '—'),
            'Serious: ' + ((ae.serious || []).join('; ') || '—')
          ].join('\n')
        },
        {
          prompt: `State important contraindications and monitoring for ${name}.`,
          answer: [
            'Contraindications: ' + ((d.contraindications || []).join('; ') || '—'),
            'Monitoring: ' + ((d.monitoring || []).join('; ') || '—')
          ].join('\n')
        },
        {
          prompt: `How would you counsel a patient starting ${name}?`,
          answer: (d.patientCounseling && d.patientCounseling.length) ? d.patientCounseling.map((x, i) => (i + 1) + '. ' + x).join('\n') : '—'
        }
      ];
      if (dose.adult) {
        items.push({
          prompt: `Comment on the usual route(s) and adult dosing principles for ${name} (educational level).`,
          answer: 'Routes: ' + ((dose.routes || []).join(', ') || '—') + '\nAdult: ' + (dose.adult || '—') + (dose.notes ? '\nNotes: ' + dose.notes : '')
        });
      }
      if (d.interactions && d.interactions.length) {
        items.push({
          prompt: `Name an important drug interaction of ${name} and its significance.`,
          answer: d.interactions.slice(0, 3).map(ix =>
            (ix.drug || 'Drug') + ' — ' + (ix.interaction || '') + (ix.significance ? ' [' + ix.significance + ']' : '')
          ).join('\n')
        });
      }
      items.forEach(it => cards.push({ ...it, drugName: name, drugId: d.id }));
    });
    return shuffleArray(cards);
  }

  function tokenizeForMatch(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[^a-z0-9%\-\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3 && !['with','that','this','from','have','been','were','will','would','could','should','about','their','there','which','when','what','your','patient','drug','drugs','also','into','than','then','them','they','only','more','most','such','used','using','after','before','because','where','while','being','other','into'].includes(w));
  }

  function scoreDialogueAnswer(userText, expectedText, keywords) {
    const user = String(userText || '').trim();
    if (!user) return { ok: false, score: 0, matched: [], level: 'empty' };
    const userTokens = new Set(tokenizeForMatch(user));
    const expectedTokens = tokenizeForMatch(expectedText);
    const keys = (keywords && keywords.length)
      ? keywords.map(k => String(k).toLowerCase()).filter(Boolean)
      : expectedTokens.slice(0, 10);
    const matched = [];
    keys.forEach(k => {
      const parts = String(k).toLowerCase().split(/\s+/).filter(Boolean);
      const hit = parts.every(p => user.includes(p) || userTokens.has(p));
      if (hit) matched.push(k);
    });
    let overlap = 0;
    expectedTokens.forEach(t => { if (userTokens.has(t)) overlap++; });
    const keyScore = keys.length ? matched.length / keys.length : 0;
    const overlapScore = expectedTokens.length ? overlap / Math.min(expectedTokens.length, 14) : 0;
    const score = Math.max(keyScore, overlapScore * 0.95);
    let level = 'weak';
    if (score >= 0.72) level = 'strong';
    else if (score >= 0.4 || matched.length >= 2) level = 'partial';
    else if (score >= 0.34) level = 'partial';
    return {
      ok: level === 'strong' || level === 'partial',
      score,
      matched,
      level
    };
  }

  function buildConceptualBank(selectedIds) {
    const pool = getQuizPool(selectedIds).filter(d => d && d.genericName);
    const bank = [];

    const pushQ = (item) => {
      if (item && item.question && item.expected) bank.push(item);
    };

    pool.forEach(d => {
      const name = d.genericName;
      const cls = d.drugClass || 'its pharmacological class';
      const tcls = d.therapeuticClass || '';
      const mech = d.mechanismOfAction || '';
      const flow = (d.mechanismFlow || []).filter(Boolean);
      const pk = d.pharmacokinetics || {};
      const ind = d.indications || [];
      const aeC = (d.adverseEffects && d.adverseEffects.common) || [];
      const aeS = (d.adverseEffects && d.adverseEffects.serious) || [];
      const contra = d.contraindications || [];
      const mon = d.monitoring || [];
      const counsel = d.patientCounseling || [];
      const inter = d.interactions || [];
      const dose = d.dosage || {};

      pushQ({
        drugName: name,
        topic: 'Mechanism',
        opener: `Let's reason about ${name}.`,
        question: `Conceptually, how does ${name} produce its main therapeutic effect? Explain the mechanism in your own words.`,
        expected: mech || (flow.length ? flow.join(' → ') : `${name} acts as ${cls}.`),
        keywords: [name, cls].concat(tokenizeForMatch(mech).slice(0, 8), flow.slice(0, 4)),
        tip: 'Focus on target (receptor/enzyme/channel) and the physiological result.'
      });

      if (flow.length >= 2) {
        pushQ({
          drugName: name,
          topic: 'Mechanism pathway',
          opener: `Think about the chain of events for ${name}.`,
          question: `Outline the key steps from ${name} binding/acting on its target to the clinical effect.`,
          expected: flow.join(' → '),
          keywords: flow.concat(tokenizeForMatch(flow.join(' ')).slice(0, 6)),
          tip: 'A good answer is a short pathway: drug → target → cellular effect → clinical outcome.'
        });
      }

      pushQ({
        drugName: name,
        topic: 'Classification',
        opener: `Classification matters for predicting effects of ${name}.`,
        question: `What is the pharmacological class of ${name}, and what does that class membership imply about its actions?`,
        expected: `${name} is a ${cls}` + (tcls ? ` (therapeutic class: ${tcls}).` : '.') + (mech ? ' Mechanism context: ' + mech : ''),
        keywords: [name, cls, tcls].filter(Boolean).concat(tokenizeForMatch(cls)),
        tip: 'Name the class and one functional consequence of belonging to that class.'
      });

      if (ind.length) {
        pushQ({
          drugName: name,
          topic: 'Clinical use',
          opener: `Now connect ${name} to patient care.`,
          question: `For which clinical situations is ${name} particularly useful, and why does its mechanism fit those uses?`,
          expected: 'Indications: ' + ind.slice(0, 5).join('; ') + (mech ? ' Linked mechanism: ' + mech : ''),
          keywords: ind.slice(0, 5).concat(tokenizeForMatch(mech).slice(0, 5)),
          tip: 'Link at least one indication to the mechanism, not only a list of diseases.'
        });
      }

      const admeBits = [
        pk.absorption && ('Absorption: ' + pk.absorption),
        pk.distribution && ('Distribution: ' + pk.distribution),
        pk.metabolism && ('Metabolism: ' + pk.metabolism),
        pk.excretion && ('Excretion: ' + pk.excretion)
      ].filter(Boolean);
      if (admeBits.length) {
        pushQ({
          drugName: name,
          topic: 'Pharmacokinetics',
          opener: `Let's discuss ADME for ${name}.`,
          question: `What pharmacokinetic features of ${name} are clinically important (absorption, metabolism, or elimination)?`,
          expected: admeBits.join(' | '),
          keywords: tokenizeForMatch(admeBits.join(' ')).slice(0, 10),
          tip: 'Mention one ADME point that changes dosing, interactions, or use in organ impairment.'
        });
      }

      if (aeS.length || aeC.length) {
        pushQ({
          drugName: name,
          topic: 'Safety',
          opener: `Safety reasoning for ${name}.`,
          question: `Which adverse effects of ${name} are most important conceptually, and why should a clinician watch for them?`,
          expected: [
            aeC.length ? 'Common: ' + aeC.slice(0, 4).join(', ') : '',
            aeS.length ? 'Serious: ' + aeS.slice(0, 4).join(', ') : ''
          ].filter(Boolean).join(' / '),
          keywords: aeC.slice(0, 4).concat(aeS.slice(0, 4)),
          tip: 'Separate nuisance effects from serious toxicities that change monitoring or stop rules.'
        });
      }

      if (contra.length) {
        pushQ({
          drugName: name,
          topic: 'Contraindications',
          opener: `When should we avoid ${name}?`,
          question: `What major contraindications or high-risk situations make ${name} a poor choice?`,
          expected: contra.slice(0, 5).join('; '),
          keywords: tokenizeForMatch(contra.join(' ')).slice(0, 8),
          tip: 'Think disease states, organ failure, or concurrent conditions that amplify harm.'
        });
      }

      if (mon.length) {
        pushQ({
          drugName: name,
          topic: 'Monitoring',
          opener: `Monitoring is part of safe use of ${name}.`,
          question: `After starting ${name}, what should be monitored and what finding would concern you?`,
          expected: mon.slice(0, 5).join('; '),
          keywords: tokenizeForMatch(mon.join(' ')).slice(0, 8),
          tip: 'Name a parameter (lab, symptom, vital) and why it reflects benefit or toxicity.'
        });
      }

      if (counsel.length) {
        pushQ({
          drugName: name,
          topic: 'Counseling',
          opener: `Patient communication about ${name}.`,
          question: `What counseling points would you emphasize so the patient uses ${name} safely and effectively?`,
          expected: counsel.slice(0, 4).join(' '),
          keywords: tokenizeForMatch(counsel.join(' ')).slice(0, 8),
          tip: 'Include how to take it, what to expect, and when to seek help.'
        });
      }

      if (inter.length) {
        const top = inter.slice(0, 3);
        pushQ({
          drugName: name,
          topic: 'Interactions',
          opener: `Interaction thinking for ${name}.`,
          question: `Describe an important drug interaction concept involving ${name}. What happens and why does it matter?`,
          expected: top.map(ix => (ix.drug || 'Interacting agent') + ': ' + (ix.interaction || '') + (ix.significance ? ' [' + ix.significance + ']' : '')).join('; '),
          keywords: top.map(ix => ix.drug).filter(Boolean).concat(tokenizeForMatch(top.map(ix => ix.interaction || '').join(' ')).slice(0, 6)),
          tip: 'Name the partner drug/class, the clinical risk, and the mechanism if you know it.'
        });
      }

      if (dose.adult || (dose.routes && dose.routes.length)) {
        pushQ({
          drugName: name,
          topic: 'Dosing concepts',
          opener: `Dosing concepts for ${name} (educational level).`,
          question: `What route(s) and dosing principles are typical for ${name}, and what practical caveat should students remember?`,
          expected: [
            dose.routes && dose.routes.length ? 'Routes: ' + dose.routes.join(', ') : '',
            dose.adult ? 'Adult: ' + dose.adult : '',
            dose.notes || 'Verify with current official labeling before clinical use.'
          ].filter(Boolean).join(' | '),
          keywords: (dose.routes || []).concat(tokenizeForMatch(dose.adult || '').slice(0, 6)),
          tip: 'Routes + one dosing idea + a safety caveat is enough at student level.'
        });
      }
    });

    // Cross-drug conceptual prompts when multiple selected
    if (pool.length >= 2) {
      for (let i = 0; i < pool.length - 1 && i < 4; i++) {
        const a = pool[i];
        const b = pool[i + 1];
        pushQ({
          drugName: a.genericName + ' vs ' + b.genericName,
          topic: 'Compare & contrast',
          opener: `Compare two agents from your selection.`,
          question: `Conceptually, how do ${a.genericName} and ${b.genericName} differ in class or mechanism, and when might you prefer one?`,
          expected: `${a.genericName} (${a.drugClass || '—'}): ${(a.mechanismOfAction || '').slice(0, 160)} || ${b.genericName} (${b.drugClass || '—'}): ${(b.mechanismOfAction || '').slice(0, 160)}`,
          keywords: [a.genericName, b.genericName, a.drugClass, b.drugClass].filter(Boolean)
            .concat(tokenizeForMatch(a.mechanismOfAction).slice(0, 3), tokenizeForMatch(b.mechanismOfAction).slice(0, 3)),
          tip: 'Contrast class/mechanism first, then one patient factor that tips the choice.'
        });
      }
    }

    return shuffleArray(bank);
  }

  function feedbackForAnswer(result, expected, tip) {
    const level = result.level || (result.ok ? 'partial' : 'weak');
    if (level === 'strong') {
      return {
        title: 'Strong answer',
        tone: 'ok',
        text: (result.matched && result.matched.length
          ? 'You captured key concepts: ' + result.matched.slice(0, 8).join(', ') + '. '
          : 'Your explanation matches the important ideas. ') +
          'Solid conceptual reasoning.'
      };
    }
    if (level === 'partial') {
      return {
        title: 'Partially correct — here is a tighter version',
        tone: 'partial',
        text: 'You are on the right track' +
          (result.matched && result.matched.length ? ' (you included: ' + result.matched.slice(0, 6).join(', ') + ')' : '') +
          '. Model points:\n' + expected +
          (tip ? '\n\nCoach tip: ' + tip : '')
      };
    }
    return {
      title: 'Needs improvement — review this concept',
      tone: 'bad',
      text: 'Your answer missed the main conceptual points. Model answer:\n' + expected +
        (tip ? '\n\nCoach tip: ' + tip : '')
    };
  }

  function startAdvancedDialogue(selectedIds) {
    const bank = buildConceptualBank(selectedIds);
    if (!bank.length) {
      showToast('Not enough data to start dialogue on this selection', 'error');
      return;
    }
    quizState = {
      mode: 'dialogue',
      questions: bank,
      current: 0,
      score: 0,
      answered: false,
      selectedIds: selectedIds || [],
      dialogueHistory: [],
      dialoguePhase: 'ask' // ask | feedback
    };
    const setup = document.getElementById('quizSetup');
    if (setup) setup.innerHTML = '';
    renderDialogueCase();
  }

  function renderDialogueCase() {
    const setup = document.getElementById('quizSetup');
    if (setup) setup.innerHTML = '';
    const el = document.getElementById('quizArea');
    if (!el) return;

    const bank = quizState.questions || [];
    if (!bank.length) {
      el.innerHTML = '<p>No dialogue questions available.</p>';
      return;
    }

    // Support legacy case format if present
    if (bank[0] && bank[0].prompts && !bank[0].question) {
      const flat = [];
      bank.forEach(c => {
        (c.prompts || []).forEach(p => {
          flat.push({
            drugName: c.drugName,
            topic: 'Case',
            opener: c.scenario || c.title || '',
            question: p.question,
            expected: p.expected,
            keywords: p.keywords || [],
            tip: ''
          });
        });
      });
      quizState.questions = shuffleArray(flat);
    }

    const qIndex = quizState.current || 0;
    const q = quizState.questions[qIndex];
    const history = quizState.dialogueHistory || [];
    const phase = quizState.dialoguePhase || 'ask';
    const total = quizState.questions.length;
    const correctCount = history.filter(h => h.ok).length;

    if (!q) {
      el.innerHTML = `
        <div class="quiz-card dialogue-card">
          <h2>Dialogue session complete</h2>
          <p class="quiz-score">Accepted answers: ${correctCount} / ${history.length}</p>
          <p class="text-muted">You worked through conceptual questions with live feedback.</p>
          <div class="quiz-setup-actions">
            <button type="button" class="btn btn-primary" id="quizRestart2">New selection</button>
            <button type="button" class="btn btn-secondary" id="quizRetrySame">Continue with same drugs</button>
          </div>
        </div>`;
      document.getElementById('quizRestart2')?.addEventListener('click', () => {
        quizState = { questions: [], current: 0, score: 0, answered: false, selectedIds: [], mode: 'dialogue' };
        renderQuiz();
      });
      document.getElementById('quizRetrySame')?.addEventListener('click', () => {
        startAdvancedDialogue(quizState.selectedIds && quizState.selectedIds.length ? quizState.selectedIds : null);
      });
      return;
    }

    el.innerHTML = `
      <div class="quiz-card dialogue-card advanced-dialogue">
        <div class="quiz-score">
          Dialogue coach · Q ${qIndex + 1} / ${total} ·
          Score ${correctCount}/${history.length} ·
          ${escapeHtml(q.drugName || '')} · ${escapeHtml(q.topic || 'Concept')}
        </div>

        <div class="dialogue-thread" id="dialogueThread">
          ${history.slice(-6).map(h => `
            <div class="dialogue-turn clinician">
              <div class="dialogue-speaker">Coach</div>
              <div class="dialogue-text">${escapeHtml(h.question)}</div>
            </div>
            <div class="dialogue-turn student ${h.level === 'strong' ? 'answer-ok' : (h.level === 'partial' ? 'answer-partial' : 'answer-bad')}">
              <div class="dialogue-speaker">You</div>
              <div class="dialogue-text">${escapeHtml(h.user)}</div>
            </div>
            <div class="dialogue-turn feedback ${h.level === 'strong' ? 'feedback-ok' : (h.level === 'partial' ? 'feedback-partial' : 'feedback-bad')}">
              <div class="dialogue-speaker">${escapeHtml(h.feedbackTitle || 'Feedback')}</div>
              <div class="dialogue-text">${escapeHtml(h.feedbackText || '').replace(/\\n/g, '<br>')}</div>
            </div>
          `).join('')}

          ${phase === 'ask' ? `
            <div class="dialogue-turn clinician current-ask">
              <div class="dialogue-speaker">Coach</div>
              <div class="dialogue-text">
                ${q.opener ? `<div class="dialogue-opener">${escapeHtml(q.opener)}</div>` : ''}
                <div class="dialogue-question-line">${escapeHtml(q.question)}</div>
              </div>
            </div>
          ` : ''}
        </div>

        ${phase === 'ask' ? `
          <div class="dialogue-answer-panel">
            <label for="dialogueUserAnswer"><strong>Your answer</strong> <span class="text-muted">(explain the concept in your own words)</span></label>
            <textarea id="dialogueUserAnswer" rows="4" placeholder="Type your reasoning..."></textarea>
            <div class="dialogue-answer-actions">
              <button type="button" class="btn btn-primary btn-sm" id="dialogueSubmitAnswer">Submit answer</button>
              <button type="button" class="btn btn-ghost btn-sm" id="dialogueSkipReveal">I don't know — teach me</button>
            </div>
          </div>
        ` : `
          <div class="dialogue-answer-actions" style="margin-top:0.75rem">
            <button type="button" class="btn btn-primary" id="dialogueNextQuestion">Next question</button>
            <button type="button" class="btn btn-secondary btn-sm" id="dialogueEndSession">End session</button>
          </div>
        `}

        <div class="mt-2 flex gap-1 justify-between flex-wrap">
          <button type="button" class="btn btn-secondary btn-sm" id="quizRestart">Change drugs</button>
        </div>
      </div>
    `;

    const submit = (forceReveal) => {
      const userRaw = document.getElementById('dialogueUserAnswer')?.value || '';
      if (!forceReveal && !userRaw.trim()) {
        showToast('Type an answer first', 'error');
        return;
      }
      const result = forceReveal
        ? { ok: false, score: 0, matched: [], level: 'weak' }
        : scoreDialogueAnswer(userRaw, q.expected, q.keywords);
      const fb = feedbackForAnswer(result, q.expected, q.tip);
      const hist = quizState.dialogueHistory || [];
      hist.push({
        question: q.question,
        user: forceReveal ? '(Asked for teaching)' : userRaw.trim(),
        expected: q.expected,
        ok: result.ok,
        level: result.level,
        matched: result.matched || [],
        feedbackTitle: fb.title,
        feedbackText: fb.text
      });
      quizState.dialogueHistory = hist;
      if (result.ok) quizState.score = (quizState.score || 0) + 1;
      quizState.dialoguePhase = 'feedback';
      renderDialogueCase();
      // scroll to latest feedback
      setTimeout(() => {
        const thread = document.getElementById('dialogueThread');
        if (thread) thread.scrollTop = thread.scrollHeight;
      }, 30);
    };

    document.getElementById('dialogueSubmitAnswer')?.addEventListener('click', () => submit(false));
    document.getElementById('dialogueSkipReveal')?.addEventListener('click', () => submit(true));
    document.getElementById('dialogueUserAnswer')?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        submit(false);
      }
    });
    document.getElementById('dialogueNextQuestion')?.addEventListener('click', () => {
      quizState.current = (quizState.current || 0) + 1;
      quizState.dialoguePhase = 'ask';
      renderDialogueCase();
    });
    document.getElementById('dialogueEndSession')?.addEventListener('click', () => {
      quizState.current = (quizState.questions || []).length;
      quizState.dialoguePhase = 'ask';
      renderDialogueCase();
    });
    document.getElementById('quizRestart')?.addEventListener('click', () => {
      quizState = { questions: [], current: 0, score: 0, answered: false, selectedIds: [], mode: 'dialogue' };
      renderQuiz();
    });

    document.getElementById('dialogueUserAnswer')?.focus();
    const thread = document.getElementById('dialogueThread');
    if (thread) thread.scrollTop = thread.scrollHeight;
  }

  function startStudyMode(mode, selectedIds) {
    if (mode === 'viva') {
      const cards = generateVivaCards(selectedIds);
      if (!cards.length) {
        showToast('Not enough data for viva on this selection', 'error');
        return;
      }
      quizState = { mode: 'viva', questions: cards, current: 0, score: 0, answered: false, selectedIds: selectedIds || [], revealed: false };
      document.getElementById('quizSetup').innerHTML = '';
      renderVivaCard();
      return;
    }
    if (mode === 'dialogue') {
      startAdvancedDialogue(selectedIds);
      return;
    }
    // default quiz
    startCustomQuiz(selectedIds);
  }

  function startCustomQuiz(selectedIds) {
    const questions = generateQuiz(selectedIds);
    if (!questions.length) {
      showToast('Not enough data to build a quiz from this selection', 'error');
      return;
    }
    quizState = {
      mode: 'quiz',
      questions,
      current: 0,
      score: 0,
      answered: false,
      selectedIds: selectedIds || []
    };
    const setup = document.getElementById('quizSetup');
    if (setup) setup.innerHTML = '';
    renderQuizQuestion();
  }

  function renderQuiz() {
    showView('study');
    if (!quizState.questions || !quizState.questions.length) {
      renderQuizSetup();
      return;
    }
    if (quizState.mode === 'viva') {
      renderVivaCard();
      return;
    }
    if (quizState.mode === 'dialogue') {
      renderDialogueCase();
      return;
    }
    renderQuizQuestion();
  }

  function renderVivaCard() {
    const setup = document.getElementById('quizSetup');
    if (setup) setup.innerHTML = '';
    const el = document.getElementById('quizArea');
    const card = quizState.questions[quizState.current];
    if (!el || !card) {
      if (el) el.innerHTML = '<p>No viva questions available.</p>';
      return;
    }
    const revealed = !!quizState.revealed;
    el.innerHTML = `
      <div class="quiz-card viva-card">
        <div class="quiz-score">Viva · ${escapeHtml(card.drugName || '')} · ${quizState.current + 1} / ${quizState.questions.length}</div>
        <div class="viva-label">Examiner asks</div>
        <div class="quiz-question">${escapeHtml(card.prompt)}</div>
        <div class="viva-answer-box ${revealed ? '' : 'hidden'}" id="vivaAnswerBox">
          <div class="viva-label">Model answer</div>
          <div class="viva-answer-text">${escapeHtml(card.answer).replace(/\n/g, '<br>')}</div>
        </div>
        <div class="mt-2 flex gap-1 justify-between flex-wrap">
          <button type="button" class="btn btn-secondary btn-sm" id="quizRestart">Change drugs</button>
          <div class="flex gap-1 flex-wrap">
            <button type="button" class="btn btn-primary btn-sm" id="vivaReveal">${revealed ? 'Hide answer' : 'Reveal answer'}</button>
            <button type="button" class="btn btn-primary btn-sm" id="quizNext">Next question</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('vivaReveal')?.addEventListener('click', () => {
      quizState.revealed = !quizState.revealed;
      renderVivaCard();
    });
    document.getElementById('quizNext')?.addEventListener('click', () => {
      quizState.current++;
      quizState.revealed = false;
      if (quizState.current >= quizState.questions.length) {
        el.innerHTML = `<div class="quiz-card"><h2>Viva complete</h2>
          <p class="text-muted">You reviewed ${quizState.questions.length} examiner-style prompts.</p>
          <div class="quiz-setup-actions">
            <button type="button" class="btn btn-primary" id="quizRestart2">New selection</button>
            <button type="button" class="btn btn-secondary" id="quizRetrySame">Retry same drugs</button>
          </div></div>`;
        document.getElementById('quizRestart2')?.addEventListener('click', () => {
          quizState = { questions: [], current: 0, score: 0, answered: false, selectedIds: [], mode: 'viva' };
          renderQuiz();
        });
        document.getElementById('quizRetrySame')?.addEventListener('click', () => {
          startStudyMode('viva', quizState.selectedIds && quizState.selectedIds.length ? quizState.selectedIds : null);
        });
      } else {
        renderVivaCard();
      }
    });
    document.getElementById('quizRestart')?.addEventListener('click', () => {
      quizState = { questions: [], current: 0, score: 0, answered: false, selectedIds: [], mode: 'viva' };
      renderQuiz();
    });
  }

  function renderQuizQuestion() {
    const setup = document.getElementById('quizSetup');
    if (setup) setup.innerHTML = '';
    const el = document.getElementById('quizArea');
    const q = quizState.questions[quizState.current];
    if (!el || !q) {
      if (el) el.innerHTML = '<p>No questions available.</p>';
      return;
    }
    const scopeNote = (quizState.selectedIds && quizState.selectedIds.length)
      ? `Custom quiz · ${quizState.selectedIds.length} drug${quizState.selectedIds.length > 1 ? 's' : ''}`
      : 'All drugs';

    el.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-score">${escapeHtml(scopeNote)} · Question ${quizState.current + 1} / ${quizState.questions.length} · Score: ${quizState.score}</div>
        <div class="quiz-question">${escapeHtml(q.question)}</div>
        <div class="quiz-options">
          ${q.options.map(o => `<div class="quiz-option" data-answer="${escapeHtml(o)}">${escapeHtml(o)}</div>`).join('')}
        </div>
        <div id="quizFeedback" class="mt-2"></div>
        <div class="mt-2 flex gap-1 justify-between">
          <button type="button" class="btn btn-secondary btn-sm" id="quizRestart">Change drugs</button>
          <button type="button" class="btn btn-primary btn-sm hidden" id="quizNext">Next</button>
        </div>
      </div>
    `;
    el.querySelectorAll('.quiz-option').forEach(opt => {
      opt.addEventListener('click', () => {
        if (quizState.answered) return;
        quizState.answered = true;
        const correct = opt.dataset.answer === q.answer;
        if (correct) {
          opt.classList.add('correct');
          quizState.score++;
        } else {
          opt.classList.add('incorrect');
          el.querySelectorAll('.quiz-option').forEach(o => {
            if (o.dataset.answer === q.answer) o.classList.add('correct');
          });
        }
        document.getElementById('quizFeedback').textContent = correct ? 'Correct!' : `Incorrect. Answer: ${q.answer}`;
        document.getElementById('quizNext').classList.remove('hidden');
        document.querySelector('.quiz-score').textContent =
          `${scopeNote} · Question ${quizState.current + 1} / ${quizState.questions.length} · Score: ${quizState.score}`;
      });
    });
    document.getElementById('quizNext')?.addEventListener('click', () => {
      quizState.current++;
      quizState.answered = false;
      if (quizState.current >= quizState.questions.length) {
        el.innerHTML = `<div class="quiz-card"><h2>Quiz Complete!</h2>
          <p class="quiz-score">Score: ${quizState.score} / ${quizState.questions.length}</p>
          <div class="quiz-setup-actions">
            <button type="button" class="btn btn-primary" id="quizRestart2">New custom quiz</button>
            <button type="button" class="btn btn-secondary" id="quizRetrySame">Retry same drugs</button>
          </div>
        </div>`;
        document.getElementById('quizRestart2')?.addEventListener('click', () => {
          quizState = { questions: [], current: 0, score: 0, answered: false, selectedIds: [], mode: 'quiz' };
          renderQuiz();
        });
        document.getElementById('quizRetrySame')?.addEventListener('click', () => {
          startCustomQuiz(quizState.selectedIds && quizState.selectedIds.length ? quizState.selectedIds : null);
        });
      } else {
        renderQuizQuestion();
      }
    });
    document.getElementById('quizRestart')?.addEventListener('click', () => {
      quizState = { questions: [], current: 0, score: 0, answered: false, selectedIds: [], mode: 'quiz' };
      renderQuiz();
    });
  }


  // ========== DRUG INTERACTIONS ==========
  function getInteractionDB() {
    return Array.isArray(window.interactionKnowledge) ? window.interactionKnowledge : [];
  }

  function matchIxTerm(entry, term) {
    if (!term) return true;
    const t = term.toLowerCase().trim();
    if (!t) return true;
    const bag = [
      ...(entry.drugs || []),
      ...(entry.classes || []),
      entry.mechanism || '',
      entry.effect || '',
      entry.category || '',
      entry.management || ''
    ].join(' ').toLowerCase();
    return t.split(/\s+/).every(w => bag.includes(w));
  }

  function filterInteractions(termA, termB, severity, category) {
    return getInteractionDB().filter(ix => {
      if (severity && (ix.significance || '').toUpperCase() !== severity.toUpperCase()) return false;
      if (category && (ix.category || '') !== category) return false;
      const aOk = matchIxTerm(ix, termA);
      const bOk = !termB || matchIxTerm(ix, termB);
      // If both terms provided, require both to be reflected in the entry
      if (termA && termB) {
        const bag = [
          ...(ix.drugs || []),
          ...(ix.classes || [])
        ].join(' ').toLowerCase();
        const ta = termA.toLowerCase();
        const tb = termB.toLowerCase();
        return bag.includes(ta.split(/\s+/)[0]) && bag.includes(tb.split(/\s+/)[0]) || (matchIxTerm(ix, termA) && matchIxTerm(ix, termB));
      }
      return aOk && bOk;
    });
  }

  function interactionsForDrugName(name) {
    if (!name) return [];
    const n = name.toLowerCase();
    return getInteractionDB().filter(ix => {
      const bag = [...(ix.drugs || []), ...(ix.classes || [])].join(' ').toLowerCase();
      return bag.includes(n) || n.split(/\s+/).some(w => w.length > 3 && bag.includes(w));
    });
  }

  function enrichDrugInteractions(drug) {
    const existing = Array.isArray(drug.interactions) ? drug.interactions.slice() : [];
    const fromDb = interactionsForDrugName(drug.genericName).map(ix => ({
      drug: (ix.drugs || []).filter(d => d.toLowerCase() !== (drug.genericName || '').toLowerCase()).join(' + ') || (ix.classes || []).join(' / '),
      interaction: (ix.effect || '') + (ix.mechanism ? ' (' + ix.mechanism + ')' : ''),
      significance: ix.significance || 'MODERATE',
      management: ix.management || '',
      category: ix.category || ''
    }));
    // Merge by partner label
    const seen = new Set(existing.map(e => (e.drug || '').toLowerCase()));
    fromDb.forEach(row => {
      const key = (row.drug || '').toLowerCase();
      if (key && !seen.has(key)) {
        existing.push(row);
        seen.add(key);
      }
    });
    return existing;
  }

  function renderInteractions(prefill) {
    showView('interactions');
    const catSel = document.getElementById('ixCategory');
    if (catSel && catSel.options.length <= 1) {
      const cats = [...new Set(getInteractionDB().map(x => x.category).filter(Boolean))].sort();
      cats.forEach(c => {
        const o = document.createElement('option');
        o.value = c;
        o.textContent = c;
        catSel.appendChild(o);
      });
    }
    if (prefill) {
      const a = document.getElementById('ixSearchA');
      if (a) a.value = prefill;
    }
    const run = () => {
      const termA = document.getElementById('ixSearchA')?.value || '';
      const termB = document.getElementById('ixSearchB')?.value || '';
      const severity = document.getElementById('ixSeverity')?.value || '';
      const category = document.getElementById('ixCategory')?.value || '';
      const results = filterInteractions(termA, termB, severity, category);
      paintIxResults(results, termA, termB);
    };
    document.getElementById('btnIxSearch')?.removeEventListener('click', window.__ixRun);
    window.__ixRun = run;
    document.getElementById('btnIxSearch')?.addEventListener('click', run);
    document.getElementById('btnIxBrowse')?.addEventListener('click', () => {
      const a = document.getElementById('ixSearchA');
      const b = document.getElementById('ixSearchB');
      if (a) a.value = '';
      if (b) b.value = '';
      paintIxResults(getInteractionDB(), '', '');
    });
    ['ixSearchA', 'ixSearchB'].forEach(id => {
      document.getElementById(id)?.addEventListener('keydown', e => {
        if (e.key === 'Enter') run();
      });
    });
    if (prefill) run();
    else if (!(document.getElementById('ixResults')?.innerHTML || '').trim()) {
      paintIxResults(getInteractionDB().filter(x => (x.significance || '') === 'HIGH').slice(0, 20), '', '');
    }
  }

  function paintIxResults(results, termA, termB) {
    const el = document.getElementById('ixResults');
    if (!el) return;
    if (!results.length) {
      el.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>No interactions matched.</p><p class="text-muted">Try another drug name, class, or clear filters.</p></div>`;
      return;
    }
    const high = results.filter(r => (r.significance || '').toUpperCase() === 'HIGH').length;
    el.innerHTML = `
      <p class="text-muted">${results.length} interaction record${results.length === 1 ? '' : 's'}${high ? ` · <strong>${high} HIGH</strong>` : ''}</p>
      <div class="ix-list">
        ${results.map(ix => `
          <article class="ix-card significance-${(ix.significance || 'MODERATE').toLowerCase()}">
            <header class="ix-card-head">
              <div class="ix-pair">${escapeHtml((ix.drugs || []).join('  +  '))}</div>
              <span class="ix-badge ix-badge-${(ix.significance || 'MODERATE').toLowerCase()}">${escapeHtml(ix.significance || '—')}</span>
            </header>
            <div class="ix-meta">
              ${(ix.classes || []).map(c => `<span class="class-chip">${escapeHtml(c)}</span>`).join('')}
              ${ix.category ? `<span class="class-chip therapeutic">${escapeHtml(ix.category)}</span>` : ''}
            </div>
            <p><strong>Effect:</strong> ${escapeHtml(ix.effect || '—')}</p>
            <p><strong>Mechanism:</strong> ${escapeHtml(ix.mechanism || '—')}</p>
            <p><strong>Management:</strong> ${escapeHtml(ix.management || '—')}</p>
          </article>
        `).join('')}
      </div>
      <p class="disclaimer" style="margin-top:1rem"><strong>Educational use only.</strong> Interaction data are teaching summaries, not a complete clinical checker. Always confirm with current monographs and a pharmacist/physician.</p>
    `;
  }

  // ========== COMPARE ==========
  function renderCompare() {
    showView('compare');
    const selectArea = document.getElementById('compareSelect');
    const tableArea = document.getElementById('compareTable');
    if (!selectArea) return;

    selectArea.innerHTML = `
      <p>Select 2–4 drugs to compare:</p>
      <div class="flex flex-wrap gap-1 mb-2">
        ${drugs.slice(0, 40).map(d => `
          <label style="display:flex;align-items:center;gap:0.3rem;font-size:0.9rem;">
            <input type="checkbox" class="compare-check" value="${d.id}" ${compareList.includes(d.id) ? 'checked' : ''}>
            ${escapeHtml(d.genericName)}
          </label>
        `).join('')}
      </div>
      <button type="button" class="btn btn-primary btn-sm" id="btnRunCompare">Compare Selected</button>
    `;

    selectArea.querySelectorAll('.compare-check').forEach(cb => {
      cb.addEventListener('change', () => {
        compareList = Array.from(selectArea.querySelectorAll('.compare-check:checked')).map(c => c.value).slice(0, 4);
      });
    });

    document.getElementById('btnRunCompare')?.addEventListener('click', () => {
      if (compareList.length < 2) {
        showToast('Select at least 2 drugs');
        return;
      }
      const selected = compareList.map(id => drugs.find(d => d.id === id)).filter(Boolean);
      const features = [
        { key: 'genericName', label: 'Generic Name' },
        { key: 'drugClass', label: 'Drug Class' },
        { key: 'mechanism', label: 'Mechanism' },
        { key: 'indications', label: 'Main Indications' },
        { key: 'routes', label: 'Routes' },
        { key: 'ae', label: 'Major Adverse Effects' },
        { key: 'contra', label: 'Contraindications' },
        { key: 'monitor', label: 'Monitoring' }
      ];
      tableArea.innerHTML = `
        <div class="table-wrap">
          <table class="compare-table">
            <thead><tr><th>Feature</th>${selected.map(d => `<th>${escapeHtml(d.genericName)}</th>`).join('')}</tr></thead>
            <tbody>
              ${features.map(f => `<tr>
                <td><strong>${f.label}</strong></td>
                ${selected.map(d => {
                  let val = '—';
                  if (f.key === 'genericName') val = d.genericName;
                  else if (f.key === 'drugClass') val = d.drugClass;
                  else if (f.key === 'mechanism') val = (d.mechanismFlow && d.mechanismFlow.slice(0, 3).join(' → ')) || d.mechanismOfAction?.slice(0, 100);
                  else if (f.key === 'indications') val = (d.indications || []).slice(0, 3).join('; ');
                  else if (f.key === 'routes') val = (d.dosage && d.dosage.routes || []).join(', ');
                  else if (f.key === 'ae') val = (d.adverseEffects && (d.adverseEffects.serious || d.adverseEffects.common) || []).slice(0, 3).join('; ');
                  else if (f.key === 'contra') val = (d.contraindications || []).slice(0, 2).join('; ');
                  else if (f.key === 'monitor') val = (d.monitoring || []).slice(0, 3).join('; ');
                  return `<td>${escapeHtml(val || '—')}</td>`;
                }).join('')}
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      `;
    });
  }

  // ========== BACKUP ==========
  function exportData() {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      userDrugs,
      customClasses,
      favorites,
      notes,
      settings
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pharmadrug-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database exported');
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || typeof data !== 'object') throw new Error('Invalid format');
        if (data.userDrugs) userDrugs = data.userDrugs;
        if (data.customClasses) customClasses = data.customClasses;
        if (data.favorites) favorites = data.favorites;
        if (data.notes) notes = data.notes;
        if (data.settings) settings = Object.assign(settings, data.settings);
        saveStorage(STORAGE_KEYS.userDrugs, userDrugs);
        saveStorage(STORAGE_KEYS.customClasses, customClasses);
        saveStorage(STORAGE_KEYS.favorites, favorites);
        saveStorage(STORAGE_KEYS.notes, notes);
        saveStorage(STORAGE_KEYS.settings, settings);
        mergeDrugs();
        applyTheme();
        scheduleCloudPush();
        showToast('Import successful');
        renderHome();
      } catch (err) {
        showToast('Invalid JSON file: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  }

  // ========== ABOUT ==========
  function renderAbout() {
    showView('about');
    const root = document.getElementById('view-about');
    if (root && !root.dataset.bookNote) {
      root.dataset.bookNote = '1';
      const note = document.createElement('div');
      note.className = 'class-page-header';
      note.innerHTML = `<h2>About PharmaDrug</h2>
        <p><strong>Source basis:</strong> Teaching content is organized for pharmacy students using concepts from <em>Lippincott Illustrated Reviews: Pharmacology</em> (Whalen). Drug profiles, interactions, study tools, and the glossary are educational summaries for learning — not a reproduction of the book and not a clinical decision aid.</p>
        <p class="text-muted">Open <strong>Glossary</strong> for definitions of complicated terms (e.g., bioavailability, agonist, first-pass metabolism).</p>`;
      root.prepend(note);
    }
  }



  // ========== PWA INSTALL (1-click) ==========
  let deferredInstallPrompt = null;
  let swRegistered = false;

  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');
  }

  function canUseNativeInstall() {
    return location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol === 'file:') {
      setInstallHint('Open via start-windows.bat (or local server) so Install works in one click.');
      return;
    }
    navigator.serviceWorker.register('./sw.js').then(reg => {
      swRegistered = true;
      if (reg.waiting) reg.waiting.postMessage('SKIP_WAITING');
      console.log('PharmaDrug service worker ready');
      // After SW is ready, browsers may fire beforeinstallprompt shortly
      setTimeout(() => updateInstallButtons(), 500);
    }).catch(err => {
      console.warn('SW register failed', err);
      setInstallHint('Service worker failed. Use Chrome/Edge over http://127.0.0.1');
    });
  }

  function setInstallHint(text) {
    const el = document.getElementById('installBannerHint');
    if (el && text) el.textContent = text;
  }

  function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredInstallPrompt = e;
      showInstallUI(true);
      setInstallHint('Ready — tap Install App for one-click install.');
      // Auto-emphasize header button
      const headerBtn = document.getElementById('btnInstallHeader');
      if (headerBtn) {
        headerBtn.style.display = '';
        headerBtn.classList.add('install-ready');
      }
    });
    window.addEventListener('appinstalled', () => {
      deferredInstallPrompt = null;
      showInstallUI(false);
      showToast('PharmaDrug installed — open it from your home screen / Start menu');
    });
    if (isStandalone()) {
      showInstallUI(false);
    } else {
      showInstallUI(true);
      updateInstallButtons();
    }
  }

  function showInstallUI(show) {
    const banner = document.getElementById('installBanner');
    const headerBtn = document.getElementById('btnInstallHeader');
    if (isStandalone()) {
      if (banner) banner.style.display = 'none';
      if (headerBtn) headerBtn.style.display = 'none';
      return;
    }
    if (banner) banner.style.display = show ? '' : '';
    if (headerBtn) headerBtn.style.display = '';
  }

  function updateInstallButtons() {
    const btn = document.getElementById('btnInstallOneClick');
    if (!btn) return;
    if (isStandalone()) {
      btn.textContent = 'Installed';
      btn.disabled = true;
      return;
    }
    if (deferredInstallPrompt) {
      btn.textContent = 'Install App';
      btn.disabled = false;
      setInstallHint('Ready — tap Install App for one-click install.');
    } else if (location.protocol === 'file:') {
      btn.textContent = 'Enable Install';
      setInstallHint('Double-click start-windows.bat (Windows) or run start-android-or-mac.sh, then open the site and tap Install App.');
    } else if (!canUseNativeInstall()) {
      btn.textContent = 'Install Help';
      setInstallHint('Use Chrome or Edge. For phones, open this page in Chrome.');
    } else {
      btn.textContent = 'Install App';
      setInstallHint('If the install popup does not appear, use browser menu → Install app / Add to Home screen.');
    }
  }

  function downloadInstaller(kind) {
    const map = {
      windows: 'downloads/PharmaDrug-Windows-Setup.zip',
      android: 'downloads/PharmaDrug-Android-Install.zip'
    };
    const href = map[kind];
    if (!href) return;
    const a = document.createElement('a');
    a.href = href;
    a.download = kind === 'windows' ? 'PharmaDrug-Windows-Setup.zip' : 'PharmaDrug-Android-Install.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast(kind === 'windows' ? 'Windows Setup downloading…' : 'Android pack downloading…');
  }

  async function triggerInstall(platform) {
    platform = platform || detectPlatform();

    // True 1-click when browser provided the install prompt (best for Android Chrome / desktop)
    if (deferredInstallPrompt) {
      try {
        deferredInstallPrompt.prompt();
        const choice = await deferredInstallPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          showToast('Installing PharmaDrug…');
        } else {
          showToast('Install dismissed — you can still download the setup pack');
          if (platform === 'windows') downloadInstaller('windows');
          if (platform === 'android') downloadInstaller('android');
        }
      } catch (err) {
        console.warn(err);
        openInstallHelp(platform);
      }
      deferredInstallPrompt = null;
      updateInstallButtons();
      return;
    }

    // Platform-specific automatic download when native prompt is unavailable
    if (platform === 'windows') {
      downloadInstaller('windows');
      openInstallHelp('windows-setup');
      return;
    }
    if (platform === 'android') {
      downloadInstaller('android');
      openInstallHelp('android');
      return;
    }

    if (location.protocol === 'file:') {
      openInstallHelp('file');
      return;
    }

    openInstallHelp(platform);
  }

  function detectPlatform() {
    const ua = navigator.userAgent || '';
    if (/Android/i.test(ua)) return 'android';
    if (/Windows/i.test(ua)) return 'windows';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
    return 'desktop';
  }

  function openInstallHelp(platform) {
    const modal = document.getElementById('installModal');
    const body = document.getElementById('installModalBody');
    const title = document.getElementById('installModalTitle');
    if (!modal || !body) {
      showToast('Use Chrome/Edge menu → Install app', 'error');
      return;
    }
    let html = '';
    if (platform === 'windows-setup' || platform === 'windows') {
      html = `
        <p><strong>PC Setup is downloading</strong> (<code>PharmaDrug-Windows-Setup.zip</code>).</p>
        <ol>
          <li>Open your <strong>Downloads</strong> folder and extract the ZIP.</li>
          <li>Double-click <strong>Install-PharmaDrug.bat</strong>.</li>
          <li>If Windows shows a blue warning: click <em>More info</em> → <em>Run anyway</em>.</li>
          <li>Install creates a <strong>Desktop</strong> icon and a <strong>Start Menu</strong> entry named <strong>PharmaDrug</strong>.</li>
          <li>The app opens automatically. Next time: Start Menu → type <strong>PharmaDrug</strong>.</li>
        </ol>
        <p class="text-muted">No Python needed. Runs in an Edge/Chrome app window with a built-in local server.</p>
        <p><a class="btn btn-primary" href="downloads/PharmaDrug-Windows-Setup.zip" download="PharmaDrug-Windows-Setup.zip">⬇ Download PC Setup again</a></p>
      `;
      if (title) title.textContent = 'Install PharmaDrug on PC';
    } else if (platform === 'android') {
      html = `
        <p><strong>Best on Android (like installing an app):</strong></p>
        <ol>
          <li>Open this site in <strong>Chrome</strong>.</li>
          <li>Tap <strong>Install App</strong> (or Chrome menu → Install app / Add to Home screen).</li>
          <li>PharmaDrug appears on your home screen and works offline.</li>
        </ol>
        <p>An <strong>Android pack</strong> was also downloaded (web files + instructions). Chrome install is preferred over random APKs for safety.</p>
        <p><a class="btn btn-secondary btn-sm" href="downloads/PharmaDrug-Android-Install.zip" download>Download Android pack again</a></p>
      `;
      if (title) title.textContent = 'Install on Android';
    } else if (platform === 'file') {
      html = `
        <p>You opened the files directly. For install:</p>
        <ul>
          <li><strong>Windows:</strong> download Setup → run <code>Install-PharmaDrug.bat</code></li>
          <li><strong>Android:</strong> open the site in Chrome via network/server → Install App</li>
        </ul>
        <p>
          <a class="btn btn-primary btn-sm" href="downloads/PharmaDrug-Windows-Setup.zip" download>Windows Setup</a>
          <a class="btn btn-secondary btn-sm" href="downloads/PharmaDrug-Android-Install.zip" download>Android Pack</a>
        </p>
      `;
      if (title) title.textContent = 'Enable install';
    } else if (platform === 'ios') {
      html = `
        <ol>
          <li>Open in <strong>Safari</strong>.</li>
          <li>Share → <strong>Add to Home Screen</strong>.</li>
        </ol>
      `;
      if (title) title.textContent = 'Install on iPhone/iPad';
    } else {
      html = `
        <p>Use Chrome or Edge, then click <strong>Install App</strong>, or download the Windows Setup.</p>
        <p><a class="btn btn-primary btn-sm" href="downloads/PharmaDrug-Windows-Setup.zip" download>Windows Setup</a></p>
      `;
      if (title) title.textContent = 'Install PharmaDrug';
    }
    body.innerHTML = html;
    modal.classList.remove('hidden');
  }

  function closeInstallModal() {
    document.getElementById('installModal')?.classList.add('hidden');
  }

  // ========== INIT ==========
  function init() {
    loadStorage();
    mergeDrugs();
    buildThemePicker();
    applyTheme();
    if (window.PharmaAuth) window.PharmaAuth.init();
    registerServiceWorker();
    setupInstallPrompt();

    document.getElementById('btnInstallOneClick')?.addEventListener('click', () => triggerInstall(detectPlatform()));
    document.getElementById('btnInstallHeader')?.addEventListener('click', () => triggerInstall(detectPlatform()));
    document.getElementById('btnInstallAndroid')?.addEventListener('click', () => triggerInstall('android'));
    document.getElementById('btnInstallWindows')?.addEventListener('click', () => triggerInstall('windows'));
    document.getElementById('btnInstallDismiss')?.addEventListener('click', () => {
      const b = document.getElementById('installBanner');
      if (b) b.style.display = 'none';
      try { localStorage.setItem('pharmadrug_install_dismissed', '1'); } catch (_) {}
    });
    document.getElementById('installModalClose')?.addEventListener('click', closeInstallModal);
    document.getElementById('installModal')?.addEventListener('click', e => {
      if (e.target.id === 'installModal') closeInstallModal();
    });
    if (localStorage.getItem('pharmadrug_install_dismissed') === '1') {
      const b = document.getElementById('installBanner');
      if (b) b.style.display = 'none';
    }

    // Header search — live suggestions show drug name + class
    const headerSearch = document.getElementById('headerSearch');
    headerSearch?.addEventListener('input', e => {
      showSearchSuggestions(headerSearch, e.target.value);
    });
    headerSearch?.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        hideSearchSuggestions();
        const q = e.target.value;
        renderSearchResults(searchDrugs(q), q);
      } else if (e.key === 'Escape') {
        hideSearchSuggestions();
      }
    });
    headerSearch?.addEventListener('blur', () => {
      setTimeout(hideSearchSuggestions, 200);
    });

    // Hero search — live suggestions show drug name + class
    const heroSearch = document.getElementById('heroSearch');
    heroSearch?.addEventListener('input', e => {
      showSearchSuggestions(heroSearch, e.target.value);
    });
    heroSearch?.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        hideSearchSuggestions();
        const q = e.target.value;
        renderSearchResults(searchDrugs(q), q);
      } else if (e.key === 'Escape') {
        hideSearchSuggestions();
      }
    });
    heroSearch?.addEventListener('blur', () => {
      setTimeout(hideSearchSuggestions, 200);
    });
    document.getElementById('heroSearchBtn')?.addEventListener('click', () => {
      hideSearchSuggestions();
      const q = heroSearch?.value || '';
      renderSearchResults(searchDrugs(q), q);
    });

    // Theme
    document.getElementById('themeToggle')?.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      toggleThemePicker();
    });
    document.addEventListener('click', e => {
      const panel = document.getElementById('themePicker');
      const toggle = document.getElementById('themeToggle');
      if (!panel || !panel.classList.contains('open')) return;
      if (panel.contains(e.target) || (toggle && toggle.contains(e.target))) return;
      panel.classList.remove('open');
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') document.getElementById('themePicker')?.classList.remove('open');
    });


    document.getElementById('glossarySearch')?.addEventListener('input', e => renderGlossary(e.target.value));

    // Nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        if (view === 'home') renderHome();
        else if (view === 'favorites') renderFavorites();
        else if (view === 'add') openAddForm();
        else if (view === 'addclass') openAddClassModal();
        else if (view === 'classification') renderClassification();
        else if (view === 'drugclasses') renderDrugClasses();
        else if (view === 'study') renderQuiz();
        else if (view === 'compare') renderCompare();
        else if (view === 'interactions') renderInteractions();
        else if (view === 'glossary') {
          showView('glossary');
          renderGlossary(document.getElementById('glossarySearch')?.value || '');
        }
        else if (view === 'about') renderAbout();
        else if (view === 'backup') showView('backup');
      });
    });

    // Add form
    document.getElementById('addForm')?.addEventListener('submit', saveDrug);

    document.getElementById('btnGeneratePrompt')?.addEventListener('click', generateAiPrompt);
    document.getElementById('btnCopyPrompt')?.addEventListener('click', copyAiPrompt);
    document.getElementById('btnAutoFillForm')?.addEventListener('click', autoFillFromAiResponse);
    document.getElementById('btnClearAi')?.addEventListener('click', clearAiHelper);
    document.getElementById('aiDrugName')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); generateAiPrompt(); }
    });

    // Add Drug Class modal
    document.getElementById('addClassForm')?.addEventListener('submit', saveCustomClass);
    document.getElementById('addClassModalClose')?.addEventListener('click', closeAddClassModal);
    document.getElementById('addClassCancel')?.addEventListener('click', closeAddClassModal);
    document.getElementById('addClassModal')?.addEventListener('click', e => {
      if (e.target.id === 'addClassModal') closeAddClassModal();
    });



    // Backup
    document.getElementById('btnExport')?.addEventListener('click', exportData);
    document.getElementById('importFile')?.addEventListener('change', e => {
      if (e.target.files[0]) importData(e.target.files[0]);
    });

    // Settings
    document.getElementById('allowEditBuiltIn')?.addEventListener('change', e => {
      settings.allowEditBuiltIn = e.target.checked;
      saveStorage(STORAGE_KEYS.settings, settings);
      scheduleCloudPush();
    });

    renderHome();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

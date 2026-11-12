import { readLocalState, writeLocalState } from './storage.js';
(() => {
    'use strict';
    const STORE = 'urduspire_v1';
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const now = () => new Date().toISOString();
    const id = () => Date.now() + Math.floor(Math.random() * 1000);
    const dateLabel = (d) => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(d));
    const escapeHTML = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const safeURL = s => { try {
        const u = new URL(s);
        return ['http:', 'https:'].includes(u.protocol) ? u.href : '';
    }
    catch {
        return '';
    } };
    const sample = {
        sources: [
            { id: 1, name: 'BBC Urdu', url: 'https://www.bbc.com/urdu', enabled: true, status: 'Demo source' },
            { id: 2, name: 'Independent Urdu', url: 'https://www.independenturdu.com/', enabled: true, status: 'Demo source' },
            { id: 3, name: 'Dawn', url: 'https://www.dawn.com/', enabled: true, status: 'Demo source' }
        ],
        articles: [
            { id: 101, sourceId: 1, category: 'National', title: 'پاکستان میں شہری سہولیات بہتر بنانے کے لیے نئے منصوبوں پر غور', summary: 'شہری علاقوں میں پبلک ٹرانسپورٹ، صاف پانی اور بنیادی سہولیات سے متعلق تجاویز کا جائزہ لیا جا رہا ہے۔', body: 'شہری سہولیات کی بہتری کسی بھی شہر کی پائیدار ترقی کے لیے بنیادی اہمیت رکھتی ہے۔ ماہرین کے مطابق منصوبہ بندی میں شہریوں کی روزمرہ ضروریات، پبلک ٹرانسپورٹ اور صاف پانی کی فراہمی کو مرکزی حیثیت دینی چاہیے۔\n\nیہ صرف نمونہ تحریر ہے۔ اصل خبر اور مزید تفصیلات کے لیے متعلقہ ناشر کی ویب سائٹ ملاحظہ کریں۔', url: 'https://www.bbc.com/urdu', publishedAt: now(), readMinutes: 4 },
            { id: 102, sourceId: 2, category: 'Economy', title: 'ڈیجیٹل ادائیگیوں کا بڑھتا رجحان چھوٹے کاروباروں کے لیے نئے مواقع', summary: 'آن لائن ادائیگیوں کے بڑھتے استعمال سے چھوٹے کاروباروں کے لیے صارفین تک رسائی کے نئے راستے کھل رہے ہیں۔', body: 'ڈیجیٹل ادائیگیوں کے نظام نے چھوٹے کاروباروں کے لیے لین دین کو نسبتاً آسان بنایا ہے۔ تاہم اس تبدیلی کے ساتھ ڈیجیٹل خواندگی، صارفین کے اعتماد اور سائبر تحفظ جیسے سوالات بھی اہم ہیں۔\n\nیہ ایک فرضی ڈیمو مضمون ہے، حقیقی خبر نہیں۔', url: 'https://www.independenturdu.com/', publishedAt: now(), readMinutes: 5 },
            { id: 103, sourceId: 3, category: 'Education', title: 'تعلیم میں ٹیکنالوجی کے استعمال کے ساتھ ڈیجیٹل رسائی کا سوال', summary: 'تعلیمی اداروں میں ٹیکنالوجی کے استعمال سے پہلے طلبہ کی انٹرنیٹ اور آلات تک رسائی کو بھی دیکھنا ضروری ہے۔', body: 'تعلیم میں ٹیکنالوجی کے استعمال پر گفتگو صرف نئے آلات خریدنے تک محدود نہیں ہونی چاہیے۔ اساتذہ کی تربیت، نصاب، زبان اور طلبہ کی ڈیجیٹل رسائی بھی اتنی ہی اہم ہیں۔\n\nیہ ایک فرضی ڈیمو مضمون ہے، حقیقی خبر نہیں۔', url: 'https://www.dawn.com/', publishedAt: now(), readMinutes: 3 },
            { id: 104, sourceId: 1, category: 'Technology', title: 'اردو ڈیجیٹل مواد اور مقامی زبانوں کی آن لائن موجودگی', summary: 'مقامی زبانوں میں معیاری ڈیجیٹل مواد کی دستیابی علم اور معلومات تک رسائی بہتر بنا سکتی ہے۔', body: 'اردو میں معیاری ڈیجیٹل مواد کی تیاری کے لیے زبان، رسم الخط، تلاش، فونٹس اور اشاعتی معیار سب کو اہمیت دینا ہوگی۔\n\nیہ ایک فرضی ڈیمو مضمون ہے، حقیقی خبر نہیں۔', url: 'https://www.bbc.com/urdu', publishedAt: now(), readMinutes: 4 }
        ],
        projects: [
            { id: 201, title: 'پاکستانی معیشت', description: 'مہنگائی، روزگار اور چھوٹے کاروبار پر تحقیق', createdAt: now(), color: '#edf0ff' },
            { id: 202, title: 'تعلیم اور ڈیجیٹل تقسیم', description: 'تعلیم میں ٹیکنالوجی تک رسائی', createdAt: now(), color: '#e8f6f1' }
        ],
        notes: [
            { id: 301, title: 'مہنگائی اور متوسط طبقہ', body: 'گھریلو اخراجات اور قوتِ خرید کے اعداد و شمار تلاش کرنے ہیں۔', projectId: 201, articleId: 102, pinned: true, createdAt: now() },
            { id: 302, title: 'ڈیجیٹل تعلیم کا سوال', body: 'شہری اور دیہی علاقوں میں انٹرنیٹ تک رسائی کے فرق کو دیکھنا ہے۔', projectId: 202, articleId: 103, pinned: false, createdAt: now() }
        ],
        documents: [
            { id: 401, title: 'کیا ہمارے شہر انسانوں کے لیے بنائے گئے ہیں؟', subtitle: 'شہری منصوبہ بندی پر ایک ابتدائی خیال', excerpt: 'شہر کی ترقی کو صرف سڑکوں کی چوڑائی سے نہیں ناپا جا سکتا۔', body: '<p>شہر کی ترقی کو صرف سڑکوں کی چوڑائی سے نہیں ناپا جا سکتا۔ ایک اچھا شہر وہ ہے جہاں پیدل چلنے والوں، بچوں، بزرگوں اور عام شہریوں کے لیے جگہ موجود ہو۔</p><p>اس تحریر میں شہری منصوبہ بندی، پبلک ٹرانسپورٹ اور عوامی جگہوں پر مزید تحقیق شامل کی جائے گی۔</p>', category: 'Opinion', tags: ['شہر', 'منصوبہ بندی'], status: 'draft', createdAt: now(), updatedAt: now(), publishedAt: null },
            { id: 402, title: 'ڈیجیٹل معیشت میں چھوٹے کاروبار', subtitle: '', excerpt: 'ڈیجیٹل ادائیگیاں کاروبار کے طریقے بدل رہی ہیں۔', body: '<p>چھوٹے کاروباروں کے لیے ڈیجیٹل ادائیگیاں نئے امکانات پیدا کر سکتی ہیں، مگر ہر تبدیلی کے ساتھ نئے چیلنجز بھی آتے ہیں۔</p>', category: 'Analysis', tags: ['معیشت'], status: 'published', createdAt: now(), updatedAt: now(), publishedAt: now() }
        ],
        saved: [102], read: [], researchItems: [{ id: 501, projectId: 201, type: 'article', itemId: 102, createdAt: now() }, { id: 502, projectId: 202, type: 'article', itemId: 103, createdAt: now() }, { id: 503, projectId: 201, type: 'note', itemId: 301, createdAt: now() }], profile: { name: 'UrduSpire Writer', username: 'urduspire-writer', bio: 'Writing, researching and thinking in Urdu.', profession: 'Writer' }, theme: 'light'
    };
    function normalizeWorkspace(stored, defaults) {
        if (!stored || typeof stored !== 'object')
            return defaults;
        const value = stored;
        const safeArray = (candidate, fallback) => Array.isArray(candidate) ? candidate : fallback;
        const profile = value.profile && typeof value.profile === 'object' ? value.profile : {};
        const documents = safeArray(value.documents, defaults.documents).map(doc => ({
            ...doc,
            body: sanitizeEditor(String(doc?.body ?? '')),
            tags: Array.isArray(doc?.tags) ? doc.tags : [],
        }));
        return {
            ...defaults,
            ...value,
            sources: safeArray(value.sources, defaults.sources),
            articles: safeArray(value.articles, defaults.articles),
            projects: safeArray(value.projects, defaults.projects),
            notes: safeArray(value.notes, defaults.notes),
            documents,
            saved: safeArray(value.saved, defaults.saved),
            read: safeArray(value.read, defaults.read),
            researchItems: safeArray(value.researchItems, defaults.researchItems),
            profile: { ...defaults.profile, ...profile },
            theme: value.theme === 'dark' ? 'dark' : 'light',
        };
    }
    function load() {
        return readLocalState(STORE, sample, normalizeWorkspace);
    }
    let db = load(), view = 'home', activeCategory = 'all', searchTerm = '', editingDocId = null, toastTimer = null, activeArticleId = null;
    function save() { const result = writeLocalState(STORE, db); if (!result.ok)
        toast('Browser storage is full. Export your backup and remove large items.'); updateCounts(); }
    function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600); }
    const sourceName = id => db.sources.find(s => s.id === id)?.name || 'Unknown source';
    const projectName = id => db.projects.find(p => p.id === id)?.title || 'Personal';
    const wordCount = html => { const el = document.createElement('div'); el.innerHTML = html || ''; return (el.textContent || '').trim().split(/\s+/).filter(Boolean).length; };
    function updateCounts() { const draftCount = db.documents.filter(d => d.status === 'draft' || d.status === 'pending_review').length; $('#newsCount').textContent = db.articles.length; $('#publishedCount').textContent = db.documents.filter(d => d.status === 'published').length; $('#projectCount').textContent = db.projects.length; $('#noteCount').textContent = db.notes.length; $('#draftCount').textContent = draftCount; $('#statSaved').textContent = db.saved.length; $('#statProjects').textContent = db.projects.length; $('#statDrafts').textContent = draftCount; $('#statPublished').textContent = db.documents.filter(d => d.status === 'published').length; $('#sideName').textContent = db.profile.name || 'Writer'; $('#sideAvatar').textContent = (db.profile.name || 'U').trim().charAt(0).toUpperCase(); }
    function articleById(aid) { return db.articles.find(a => a.id === Number(aid)); }
    function docById(did) { return db.documents.find(d => d.id === Number(did)); }
    function empty(title, desc = 'There is nothing here yet.') { return `<div class="empty"><strong>${escapeHTML(title)}</strong>${escapeHTML(desc)}</div>`; }
    function itemActions(a) { const saved = db.saved.includes(a.id); return `<div class="item-actions"><button class="mini ${saved ? 'saved' : ''}" title="${saved ? 'Remove saved article' : 'Save article'}" data-action="save-article" data-id="${a.id}"><svg fill="none" stroke="currentColor" stroke-width="1.7"><use href="#i-bookmark"/></svg></button><button class="mini" title="Add to research" data-action="add-article-research" data-id="${a.id}"><svg fill="none" stroke="currentColor" stroke-width="1.7"><use href="#i-folder"/></svg></button><button class="mini" title="Create note" data-action="note-from-article" data-id="${a.id}"><svg fill="none" stroke="currentColor" stroke-width="1.7"><use href="#i-note"/></svg></button></div>`; }
    function renderArticle(a, compact = false) { return `<article class="item"><div class="item-main"><div class="item-kicker">${escapeHTML(a.category)} <span>· ${escapeHTML(sourceName(a.sourceId))} · ${a.readMinutes || 4} min read</span></div><h3 class="item-title urdu-title">${escapeHTML(a.title)}</h3><p class="item-summary urdu">${escapeHTML(a.summary)}</p><div class="item-meta"><span>${dateLabel(a.publishedAt)}</span><button class="text-link" data-action="open-article" data-id="${a.id}">Read article →</button>${itemActions(a)}</div></div></article>`; }
    function renderDocCard(d, showStatus = true) { const isPub = d.status === 'published'; return `<article class="item"><div class="item-main"><div class="item-kicker">${escapeHTML(d.category || 'Article')} <span>· ${showStatus ? `<span class="badge ${isPub ? 'green' : d.status === 'pending_review' ? 'amber' : 'gray'}">${escapeHTML(d.status.replace('_', ' '))}</span> · ` : ''}${dateLabel(isPub ? d.publishedAt : d.updatedAt)}</span></div><h3 class="item-title ${/[\u0600-\u06FF]/.test(d.title) ? 'urdu-title' : ''}">${escapeHTML(d.title || 'Untitled')}</h3>${d.excerpt ? `<p class="item-summary ${/[\u0600-\u06FF]/.test(d.excerpt) ? 'urdu' : ''}">${escapeHTML(d.excerpt)}</p>` : ''}<div class="item-meta"><span>${wordCount(d.body)} words</span>${(d.tags || []).slice(0, 3).map(t => `<span class="badge gray">${escapeHTML(t)}</span>`).join('')}<div class="item-actions">${isPub ? `<button class="mini" title="Preview" data-action="open-doc" data-id="${d.id}"><svg fill="none" stroke="currentColor" stroke-width="1.7"><use href="#i-book"/></svg></button>` : ''}<button class="mini" title="Edit" data-action="edit-doc" data-id="${d.id}"><svg fill="none" stroke="currentColor" stroke-width="1.7"><use href="#i-pen"/></svg></button></div></div></div></article>`; }
    function renderNewsList(items) { return items.length ? items.map(a => renderArticle(a)).join('') : empty('No articles found', 'Try another search or add a news source.'); }
    function renderDashboard() {
        $('#dashboard').hidden = false;
        $('#welcome').hidden = false;
        $('#stats').hidden = false;
        $('#viewHead').classList.remove('show');
        $('#viewContent').hidden = true;
        const news = db.articles.filter(a => activeCategory === 'all' || a.category === activeCategory).slice(0, 4);
        $('#dashboardNews').innerHTML = renderNewsList(news);
        $('#dashboardProjects').innerHTML = db.projects.slice(0, 4).map(p => `<div class="project-card" data-action="open-project" data-id="${p.id}"><div class="project-icon"><svg fill="none" stroke="currentColor" stroke-width="1.7"><use href="#i-folder"/></svg></div><div class="project-info"><strong>${escapeHTML(p.title)}</strong><small>${db.researchItems.filter(x => x.projectId === p.id).length} linked items</small><div class="progress"><span style="width:${Math.min(100, db.researchItems.filter(x => x.projectId === p.id).length * 18)}%"></span></div></div></div>`).join('') || empty('No research folders', 'Create your first research folder.');
        $('#recentNotes').innerHTML = db.notes.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3).map(n => `<div class="recent-note"><div class="pin"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7"><use href="#i-pin"/></svg></div><div><strong>${escapeHTML(n.title || 'Untitled note')}</strong><small>${escapeHTML(projectName(n.projectId))} · ${dateLabel(n.createdAt)}</small></div></div>`).join('') || empty('No notes yet', 'Use Quick note to capture your first idea.');
        updateCounts();
    }
    function renderGlobalSearch() {
        $('#welcome').hidden = true;
        $('#stats').hidden = true;
        $('#dashboard').hidden = true;
        $('#viewHead').classList.add('show');
        $('#viewContent').hidden = false;
        $('#viewTitle').textContent = 'Search results';
        $('#viewSubtitle').textContent = 'Search across news, research folders, notes, drafts, publications and sources.';
        $('#crumbText').textContent = 'Search';
        $('#viewActions').innerHTML = '';
        const q = searchTerm.trim().toLowerCase();
        const articles = db.articles.filter(a => [a.title, a.summary, a.body, a.category, sourceName(a.sourceId)].join(' ').toLowerCase().includes(q));
        const notes = db.notes.filter(n => [n.title, n.body, projectName(n.projectId)].join(' ').toLowerCase().includes(q));
        const projects = db.projects.filter(p => (p.title + ' ' + p.description).toLowerCase().includes(q));
        const docs = db.documents.filter(d => [d.title, d.subtitle, d.excerpt, stripHTML(d.body), d.category, (d.tags || []).join(' ')].join(' ').toLowerCase().includes(q));
        const sources = db.sources.filter(s => (s.name + ' ' + s.url).toLowerCase().includes(q));
        let html = '';
        if (articles.length)
            html += `<div class="panel-head"><div><div class="panel-title">News · ${articles.length}</div></div></div>${articles.map(a => renderArticle(a)).join('')}`;
        if (projects.length)
            html += `<div class="panel-head" style="margin-top:25px"><div><div class="panel-title">Research folders · ${projects.length}</div></div></div>${projects.map(renderProjectCard).join('')}`;
        if (notes.length)
            html += `<div class="panel-head" style="margin-top:25px"><div><div class="panel-title">Notes · ${notes.length}</div></div></div>${notes.map(renderNoteCard).join('')}`;
        if (docs.length)
            html += `<div class="panel-head" style="margin-top:25px"><div><div class="panel-title">Writing · ${docs.length}</div></div></div>${docs.map(d => renderDocCard(d)).join('')}`;
        if (sources.length)
            html += `<div class="panel-head" style="margin-top:25px"><div><div class="panel-title">News sources · ${sources.length}</div></div></div>${sources.map(s => `<div class="source-row"><div class="source-logo">${escapeHTML(s.name.slice(0, 1))}</div><div class="source-info"><strong>${escapeHTML(s.name)}</strong><small>${escapeHTML(s.url)}</small></div></div>`).join('')}`;
        $('#viewContent').innerHTML = html || empty('No results found', `Nothing matched “${searchTerm}”. Try another keyword.`);
        updateCounts();
    }
    function renderPage() {
        if (searchTerm.trim()) {
            renderGlobalSearch();
            return;
        }
        if (view === 'home') {
            renderDashboard();
            return;
        }
        $('#welcome').hidden = true;
        $('#stats').hidden = true;
        $('#dashboard').hidden = true;
        $('#viewHead').classList.add('show');
        $('#viewContent').hidden = false;
        const titles = { news: ['News', 'A reading desk for your selected sources.'], published: ['Published', 'Writing shared by the UrduSpire community.'], research: ['My Research', 'Organize articles, notes and references by topic.'], notes: ['My Notes', 'Capture and connect your thoughts.'], writing: ['Writing Studio', 'Draft, edit and publish your work.'], saved: ['Saved', 'Articles you want to return to.'], sources: ['News Sources', 'Manage the sources in your reading workspace.'], profile: ['Author Profile', 'Your public identity on UrduSpire.'], settings: ['Settings & Backup', 'Manage your workspace preferences and data.'] };
        $('#viewTitle').textContent = titles[view]?.[0] || 'Workspace';
        $('#viewSubtitle').textContent = titles[view]?.[1] || '';
        $('#crumbText').textContent = titles[view]?.[0] || 'Workspace';
        const actions = { news: `<button class="btn btn-primary" data-action="go-sources">Manage sources</button>`, published: `<button class="btn btn-primary" data-quick="writing">New writing</button>`, research: `<button class="btn btn-primary" data-action="new-project">＋ New folder</button>`, notes: `<button class="btn btn-primary" data-action="new-note">＋ New note</button>`, writing: `<button class="btn btn-primary" data-quick="writing">＋ New writing</button>`, saved: '', sources: `<button class="btn btn-primary" data-action="new-source">＋ Add source</button>`, profile: `<button class="btn" data-action="edit-profile">Edit profile</button>`, settings: '' };
        $('#viewActions').innerHTML = actions[view] || '';
        const q = searchTerm.trim().toLowerCase();
        let html = '';
        if (view === 'news' || view === 'saved') {
            let items = view === 'news' ? db.articles : db.articles.filter(a => db.saved.includes(a.id));
            if (q)
                items = items.filter(a => [a.title, a.summary, a.category, sourceName(a.sourceId)].join(' ').toLowerCase().includes(q));
            html = renderNewsList(items);
        }
        if (view === 'published') {
            let items = db.documents.filter(d => d.status === 'published');
            if (q)
                items = items.filter(d => [d.title, d.subtitle, d.excerpt, d.body, d.category, (d.tags || []).join(' ')].join(' ').toLowerCase().includes(q));
            html = items.length ? items.slice().sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()).map(d => renderPublishedCard(d)).join('') : empty('No published writing yet', 'Be the first to publish a piece from Writing Studio.');
        }
        if (view === 'research') {
            let items = db.projects;
            if (q)
                items = items.filter(p => (p.title + ' ' + p.description).toLowerCase().includes(q));
            html = items.length ? items.map(p => renderProjectCard(p)).join('') : empty('No research folders', 'Create a folder to start organizing your work.');
        }
        if (view === 'notes') {
            let items = db.notes;
            if (q)
                items = items.filter(n => (n.title + ' ' + n.body + ' ' + projectName(n.projectId)).toLowerCase().includes(q));
            html = items.length ? items.slice().sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(n => renderNoteCard(n)).join('') : empty('No notes yet', 'Create a note or capture an idea from a news article.');
        }
        if (view === 'writing') {
            let items = db.documents.filter(d => d.status !== 'published');
            if (q)
                items = items.filter(d => [d.title, d.excerpt, d.body, d.category].join(' ').toLowerCase().includes(q));
            html = items.length ? items.map(d => renderDocCard(d)).join('') : empty('No drafts yet', 'Start a new piece in Writing Studio.');
        }
        if (view === 'sources')
            html = renderSources();
        if (view === 'profile')
            html = renderProfile();
        if (view === 'settings')
            html = renderSettings();
        $('#viewContent').innerHTML = html;
        updateCounts();
    }
    function renderPublishedCard(d) { return `<article class="item"><div class="item-main"><div class="item-kicker">${escapeHTML(d.category || 'Article')} <span>· By ${escapeHTML(db.profile.name || 'Writer')} · ${dateLabel(d.publishedAt)}</span></div><h3 class="item-title ${/[\u0600-\u06FF]/.test(d.title) ? 'urdu-title' : ''}">${escapeHTML(d.title)}</h3>${d.excerpt ? `<p class="item-summary ${/[\u0600-\u06FF]/.test(d.excerpt) ? 'urdu' : ''}">${escapeHTML(d.excerpt)}</p>` : ''}<div class="item-meta"><span>${wordCount(d.body)} words</span><button class="text-link" data-action="open-doc" data-id="${d.id}">Read publication →</button><div class="item-actions"><button class="mini" title="Share publication" data-action="share-doc" data-id="${d.id}"><svg fill="none" stroke="currentColor" stroke-width="1.7"><use href="#i-share"/></svg></button><button class="mini" title="Edit publication" data-action="edit-doc" data-id="${d.id}"><svg fill="none" stroke="currentColor" stroke-width="1.7"><use href="#i-pen"/></svg></button></div></div></div></article>`; }
    function renderProjectCard(p) { const linked = db.researchItems.filter(x => x.projectId === p.id); return `<article class="item"><div class="item-main"><div class="item-kicker">Research folder <span>· ${linked.length} linked items</span></div><h3 class="item-title">${escapeHTML(p.title)}</h3><p class="item-summary">${escapeHTML(p.description || 'No description added.')}</p><div class="item-meta"><span>Created ${dateLabel(p.createdAt)}</span><button class="text-link" data-action="open-project" data-id="${p.id}">Open folder →</button><div class="item-actions"><button class="mini" data-action="edit-project" data-id="${p.id}" title="Edit folder"><svg fill="none" stroke="currentColor" stroke-width="1.7"><use href="#i-pen"/></svg></button><button class="mini" data-action="delete-project" data-id="${p.id}" title="Delete folder"><svg fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/></svg></button></div></div></div></article>`; }
    function renderNoteCard(n) { const article = articleById(n.articleId); return `<article class="item"><div class="item-main"><div class="item-kicker">${n.pinned ? 'PINNED · ' : ''}${escapeHTML(projectName(n.projectId))}<span>· ${dateLabel(n.createdAt)}</span></div><h3 class="item-title ${/[\u0600-\u06FF]/.test(n.title) ? 'urdu-title' : ''}">${escapeHTML(n.title || 'Untitled note')}</h3><p class="item-summary ${/[\u0600-\u06FF]/.test(n.body) ? 'urdu' : ''}">${escapeHTML(n.body || '')}</p><div class="item-meta">${article ? `<span>Linked: ${escapeHTML(article.title.slice(0, 45))}</span>` : '<span>Personal note</span>'}<div class="item-actions"><button class="mini" data-action="edit-note" data-id="${n.id}" title="Edit note"><svg fill="none" stroke="currentColor" stroke-width="1.7"><use href="#i-pen"/></svg></button><button class="mini" data-action="pin-note" data-id="${n.id}" title="Pin note"><svg fill="none" stroke="currentColor" stroke-width="1.7"><use href="#i-pin"/></svg></button><button class="mini" data-action="delete-note" data-id="${n.id}" title="Delete note">×</button></div></div></div></article>`; }
    function renderSources() { return `<div class="panel-subtitle" style="margin-bottom:12px">Sources added here are saved in this browser. Live RSS fetching requires the UrduSpire backend and will be connected later.</div>${db.sources.map(s => `<div class="source-row"><div class="source-logo">${escapeHTML(s.name.slice(0, 1).toUpperCase())}</div><div class="source-info"><strong>${escapeHTML(s.name)}</strong><small>${escapeHTML(s.url)}</small><small>${escapeHTML(s.status || 'Custom source')}</small></div><button class="switch ${s.enabled ? 'on' : ''}" data-action="toggle-source" data-id="${s.id}" aria-label="Toggle source"><span></span></button><button class="mini" data-action="delete-source" data-id="${s.id}" title="Remove source">×</button></div>`).join('') || empty('No sources added', 'Add an RSS or news website source to your workspace.')}`; }
    function renderProfile() { const p = db.profile; return `<div class="author-card"><div class="author-avatar">${escapeHTML((p.name || 'U').charAt(0).toUpperCase())}</div><div><h3>${escapeHTML(p.name || 'Writer')}</h3><p>@${escapeHTML(p.username || 'writer')} · ${escapeHTML(p.profession || 'Writer')}</p><p>${escapeHTML(p.bio || '')}</p></div></div><div class="panel-head"><div><div class="panel-title">Your published writing</div><div class="panel-subtitle">Publications associated with this local demo profile</div></div></div>${db.documents.filter(d => d.status === 'published').map(renderPublishedCard).join('') || empty('No publications yet', 'Publish a draft to build your author profile.')}`; }
    function renderSettings() { return `<div class="panel" style="max-width:650px"><div class="panel-head"><div><div class="panel-title">Appearance</div><div class="panel-subtitle">Choose how UrduSpire looks on this device.</div></div></div><div class="source-row"><div class="source-info"><strong>Theme</strong><small>Switch between light and dark mode</small></div><select id="themeSelect" class="field" style="width:130px;margin:0;padding:8px"><option value="light" ${db.theme === 'light' ? 'selected' : ''}>Light</option><option value="dark" ${db.theme === 'dark' ? 'selected' : ''}>Dark</option></select></div><div class="panel-head" style="margin-top:25px"><div><div class="panel-title">Data backup</div><div class="panel-subtitle">Export your workspace or restore it from a JSON backup.</div></div></div><div class="view-tools"><button class="btn btn-primary" data-action="export-data">Export backup</button><button class="btn" data-action="import-data">Import backup</button><input type="file" id="importFile" accept="application/json,.json" hidden></div><div class="panel-head" style="margin-top:28px"><div><div class="panel-title">Prototype information</div><div class="panel-subtitle">This version stores demo data locally in this browser. It does not yet sync across devices or fetch live RSS feeds.</div></div></div><button class="btn btn-danger" data-action="reset-demo">Reset demo data</button></div>`; }
    function openProject(id) {
        const p = db.projects.find(x => x.id === Number(id));
        if (!p)
            return;
        const items = db.researchItems.filter(x => x.projectId === p.id);
        const related = items.map(x => { if (x.type === 'article') {
            const a = articleById(x.itemId);
            return a ? `<article class="item"><div class="item-main"><div class="item-kicker">Article · ${escapeHTML(sourceName(a.sourceId))}</div><h3 class="item-title urdu-title">${escapeHTML(a.title)}</h3><p class="item-summary urdu">${escapeHTML(a.summary)}</p><div class="item-meta"><button class="text-link" data-action="open-article" data-id="${a.id}">Read article →</button><button class="text-link" data-action="remove-research-item" data-id="${x.id}">Remove</button></div></div></article>` : '';
        } if (x.type === 'note') {
            const n = db.notes.find(v => v.id === x.itemId);
            return n ? `<article class="item"><div class="item-main"><div class="item-kicker">Note</div><h3 class="item-title">${escapeHTML(n.title)}</h3><p class="item-summary">${escapeHTML(n.body)}</p><div class="item-meta"><button class="text-link" data-action="edit-note" data-id="${n.id}">Edit note</button><button class="text-link" data-action="remove-research-item" data-id="${x.id}">Remove</button></div></div></article>` : '';
        } return ''; }).join('');
        showModal('Research: ' + p.title, `<div class="panel-subtitle" style="margin-bottom:15px">${escapeHTML(p.description || '')}</div><div class="view-tools" style="margin-bottom:14px"><button class="btn btn-primary" data-action="add-existing-article" data-id="${p.id}">＋ Add an article</button><button class="btn" data-action="new-note-in-project" data-id="${p.id}">＋ Add a note</button><button class="btn" data-action="edit-project" data-id="${p.id}">Edit folder</button></div>${related || empty('This folder is empty', 'Add articles or notes to build your research collection.')}`, true);
    }
    function showModal(title, html, wide = false) { $('#modalTitle').textContent = title; $('#modalBody').innerHTML = html; $('#modal').classList.toggle('wide', wide); $('#modalOverlay').classList.add('open'); }
    function closeModal() { $('#modalOverlay').classList.remove('open'); $('#modal').classList.remove('wide'); }
    function noteForm(n = null, defaultProject = null, article = null) {
        const isEdit = !!n;
        showModal(isEdit ? 'Edit note' : article ? 'Note on article' : 'New note', `<div class="field"><label for="noteTitle">Title</label><input id="noteTitle" value="${escapeHTML(n?.title || article?.title || '')}" placeholder="Give your note a title"></div><div class="field"><label for="noteBody">Your note</label><textarea id="noteBody" placeholder="Capture an idea, question or observation...">${escapeHTML(n?.body || '')}</textarea></div><div class="field"><label for="noteProject">Research folder</label><select id="noteProject"><option value="">Personal notes</option>${db.projects.map(p => `<option value="${p.id}" ${(n?.projectId || defaultProject) === p.id ? 'selected' : ''}>${escapeHTML(p.title)}</option>`).join('')}</select></div>${article ? `<div class="field"><label>Related article</label><input value="${escapeHTML(article.title)}" readonly></div>` : ''}<div class="modal-actions"><button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="saveNoteForm">${isEdit ? 'Save changes' : 'Save note'}</button></div>`);
        $('#saveNoteForm').onclick = () => { const title = $('#noteTitle').value.trim(), body = $('#noteBody').value.trim(); if (!title && !body) {
            toast('Write something before saving.');
            return;
        } const projectId = $('#noteProject').value ? Number($('#noteProject').value) : null; if (isEdit) {
            Object.assign(n, { title: title || body.slice(0, 45), body, projectId, updatedAt: now() });
        }
        else {
            const nn = { id: id(), title: title || body.slice(0, 45), body, projectId, articleId: article?.id || null, pinned: false, createdAt: now() };
            db.notes.unshift(nn);
            if (projectId)
                linkResearch(projectId, 'note', nn.id);
        } save(); closeModal(); renderPage(); toast(isEdit ? 'Note updated.' : 'Note saved.'); };
    }
    function linkResearch(projectId, type, itemId) { if (!db.researchItems.some(x => x.projectId === Number(projectId) && x.type === type && x.itemId === Number(itemId)))
        db.researchItems.push({ id: id(), projectId: Number(projectId), type, itemId: Number(itemId), createdAt: now() }); }
    function addArticleToResearch(articleId, projectId = null) { if (!db.projects.length) {
        projectForm();
        return;
    } const options = db.projects.map(p => `<option value="${p.id}" ${projectId === p.id ? 'selected' : ''}>${escapeHTML(p.title)}</option>`).join(''); showModal('Add to research folder', `<div class="field"><label for="researchSelect">Choose a folder</label><select id="researchSelect">${options}</select></div><div class="modal-actions"><button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="confirmResearch">Add article</button></div>`); $('#confirmResearch').onclick = () => { const pid = Number($('#researchSelect').value); linkResearch(pid, 'article', articleId); save(); closeModal(); if (view === 'research')
        renderPage(); toast('Article added to research folder.'); }; }
    function projectForm(p = null) { const edit = !!p; showModal(edit ? 'Edit research folder' : 'New research folder', `<div class="field"><label for="projectName">Folder name</label><input id="projectName" value="${escapeHTML(p?.title || '')}" placeholder="e.g. Pakistan's economy"></div><div class="field"><label for="projectDescription">Description</label><textarea id="projectDescription" placeholder="What are you researching?">${escapeHTML(p?.description || '')}</textarea></div><div class="modal-actions"><button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="saveProject">${edit ? 'Save changes' : 'Create folder'}</button></div>`); $('#saveProject').onclick = () => { const title = $('#projectName').value.trim(); if (!title) {
        toast('Enter a folder name.');
        return;
    } if (edit)
        Object.assign(p, { title, description: $('#projectDescription').value.trim() });
    else
        db.projects.unshift({ id: id(), title, description: $('#projectDescription').value.trim(), createdAt: now(), color: '#edf0ff' }); save(); closeModal(); renderPage(); toast(edit ? 'Folder updated.' : 'Research folder created.'); }; }
    function sourceForm() { showModal('Add news source', `<div class="field"><label for="sourceName">Source name</label><input id="sourceName" placeholder="e.g. BBC Urdu"></div><div class="field"><label for="sourceURL">RSS feed or website URL</label><input id="sourceURL" type="url" placeholder="https://example.com/rss"></div><p class="panel-subtitle">This prototype saves source details only. Live RSS fetching and parsing will be connected through the backend later.</p><div class="modal-actions"><button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="saveSource">Add source</button></div>`); $('#saveSource').onclick = () => { const name = $('#sourceName').value.trim(), url = safeURL($('#sourceURL').value.trim()); if (!name || !url) {
        toast('Enter a source name and a valid http(s) URL.');
        return;
    } db.sources.push({ id: id(), name, url, enabled: true, status: 'Custom source · Sync not connected' }); save(); closeModal(); renderPage(); toast('Source added. Live syncing is not connected yet.'); }; }
    function editorForm(doc = null) {
        editingDocId = doc?.id || null;
        const d = doc || { title: '', subtitle: '', excerpt: '', body: '', category: 'Column', tags: [], status: 'draft' };
        showModal(doc ? 'Edit writing' : 'New writing', `<div class="field"><label for="docTitle">Title</label><input id="docTitle" value="${escapeHTML(d.title)}" placeholder="Give your piece a clear title"></div><div class="field"><label for="docSubtitle">Subtitle <span style="color:var(--muted);font-weight:400">(optional)</span></label><input id="docSubtitle" value="${escapeHTML(d.subtitle || '')}" placeholder="A short supporting line"></div><div class="field"><label for="docExcerpt">Short description</label><textarea id="docExcerpt" style="min-height:65px" placeholder="A short introduction shown in the Published Feed">${escapeHTML(d.excerpt || '')}</textarea></div><div class="field"><label>Article content</label><div class="editor-toolbar"><button type="button" data-format="bold"><b>B</b></button><button type="button" data-format="italic"><i>I</i></button><button type="button" data-format="insertUnorderedList">• List</button><button type="button" data-format="formatBlock" data-value="h2">H2</button><button type="button" data-format="formatBlock" data-value="blockquote">Quote</button><button type="button" id="rtlToggle">Urdu RTL</button><button type="button" id="insertImageBtn">＋ Insert image</button><input type="file" id="docImageInput" accept="image/png,image/jpeg,image/webp" hidden></div><div class="editor" id="docBody" contenteditable="true" spellcheck="true">${d.body || ''}</div><div class="image-hint">Upload JPG, PNG or WebP. The image will be embedded in your article and saved with the draft.</div></div><div class="field"><label for="docCategory">Category</label><select id="docCategory">${['Column', 'Article', 'Opinion', 'Analysis', 'Research', 'Literature', 'Story', 'Review', 'Other'].map(c => `<option ${d.category === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div><div class="field"><label for="docTags">Tags <span style="color:var(--muted);font-weight:400">(comma separated)</span></label><input id="docTags" value="${escapeHTML((d.tags || []).join(', '))}" placeholder="Politics, Economy, Society"></div><div class="modal-actions" style="justify-content:space-between"><span class="panel-subtitle" id="saveStatus">${doc ? 'Editing existing document' : 'New draft'}</span><span style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-close>Cancel</button><button class="btn" id="saveDraft">Save draft</button><button class="btn btn-primary" id="publishDoc">Publish</button></span></div>`, true);
        const editor = $('#docBody');
        $$('[data-format]', $('#modalBody')).forEach(b => b.onclick = () => { editor.focus(); const cmd = b.dataset.format, val = b.dataset.value || null; document.execCommand(cmd, false, val); });
        $('#rtlToggle').onclick = () => { const rtl = editor.getAttribute('dir') !== 'rtl'; editor.setAttribute('dir', rtl ? 'rtl' : 'ltr'); toast(rtl ? 'Urdu RTL writing enabled.' : 'Left-to-right writing enabled.'); };
        $('#insertImageBtn').onclick = () => $('#docImageInput').click();
        $('#docImageInput').onchange = async (e) => { const file = e.target.files?.[0]; if (!file)
            return; if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
            toast('Choose a JPG, PNG or WebP image.');
            e.target.value = '';
            return;
        } if (file.size > 10 * 1024 * 1024) {
            toast('Please choose an image smaller than 10 MB.');
            e.target.value = '';
            return;
        } try {
            const dataUrl = await optimizeImage(file);
            editor.focus();
            const html = `<figure><img src="${dataUrl}" alt="${escapeHTML(file.name.replace(/\.[^.]+$/, ''))}"><figcaption>Image caption (edit this text)</figcaption></figure><p><br></p>`;
            insertAtCursor(editor, html);
            toast('Image added to article.');
        }
        catch (err) {
            toast('Could not read this image. Try another file.');
        } e.target.value = ''; };
        let debounce;
        editor.addEventListener('input', () => { clearTimeout(debounce); $('#saveStatus').textContent = 'Unsaved changes'; debounce = setTimeout(() => $('#saveStatus').textContent = 'Changes ready to save', 700); });
        function getForm() { return { title: $('#docTitle').value.trim(), subtitle: $('#docSubtitle').value.trim(), excerpt: $('#docExcerpt').value.trim(), body: sanitizeEditor(editor.innerHTML), category: $('#docCategory').value, tags: $('#docTags').value.split(',').map(x => x.trim()).filter(Boolean) }; }
        function saveDoc(status) { const fields = getForm(); if (!fields.title) {
            toast('Add a title before saving.');
            return;
        } if (!stripHTML(fields.body).trim()) {
            toast('Write some content before saving.');
            return;
        } if (doc) {
            Object.assign(doc, fields, { status, updatedAt: now(), publishedAt: status === 'published' ? (doc.publishedAt || now()) : doc.publishedAt });
        }
        else {
            db.documents.unshift({ id: id(), ...fields, status, createdAt: now(), updatedAt: now(), publishedAt: status === 'published' ? now() : null });
        } save(); closeModal(); renderPage(); toast(status === 'published' ? 'Your writing is now in Published.' : 'Draft saved.'); }
        $('#saveDraft').onclick = () => saveDoc('draft');
        $('#publishDoc').onclick = () => { const f = getForm(); if (!f.title || !stripHTML(f.body).trim()) {
            toast('Add a title and content before publishing.');
            return;
        } if (!confirm('Publish this piece to the public Published Feed in this prototype?'))
            return; saveDoc('published'); };
    }
    function insertAtCursor(editor, html) { const sel = window.getSelection(); if (sel && sel.rangeCount && editor.contains(sel.anchorNode)) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const holder = document.createElement('div');
        holder.innerHTML = html;
        const frag = document.createDocumentFragment();
        let node, last;
        while ((node = holder.firstChild)) {
            last = frag.appendChild(node);
        }
        range.insertNode(frag);
        if (last) {
            range.setStartAfter(last);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    else
        editor.insertAdjacentHTML('beforeend', html); }
    function optimizeImage(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onerror = reject; reader.onload = () => { const img = new Image(); img.onerror = reject; img.onload = () => { const max = 1600, scale = Math.min(1, max / Math.max(img.width, img.height)), canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(img.width * scale)); canvas.height = Math.max(1, Math.round(img.height * scale)); const ctx = canvas.getContext('2d'); if (!ctx) {
        reject(new Error('Canvas unavailable'));
        return;
    } const type = 'image/jpeg'; ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0, canvas.width, canvas.height); resolve(canvas.toDataURL(type, 0.78)); }; img.src = String(reader.result || ''); }; reader.readAsDataURL(file); }); }
    function sanitizeEditor(html) { const parsed = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html'); const allowed = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'UL', 'OL', 'LI', 'H2', 'H3', 'BLOCKQUOTE', 'A', 'FIGURE', 'FIGCAPTION', 'IMG']); function clean(node) { [...node.childNodes].forEach(child => { if (child.nodeType === Node.TEXT_NODE)
        return; if (child.nodeType !== Node.ELEMENT_NODE) {
        child.remove();
        return;
    } if (!allowed.has(child.tagName)) {
        child.replaceWith(...child.childNodes);
        return;
    } if (child.tagName === 'A') {
        const href = safeURL(child.getAttribute('href'));
        if (href) {
            child.setAttribute('href', href);
            child.setAttribute('rel', 'noopener noreferrer');
        }
        else
            child.removeAttribute('href');
    } if (child.tagName === 'IMG') {
        const src = child.getAttribute('src') || '';
        if (!/^data:image\/(png|jpeg|webp);base64,/i.test(src)) {
            child.remove();
            return;
        }
        const alt = (child.getAttribute('alt') || '').slice(0, 180);
        [...child.attributes].forEach(attr => child.removeAttribute(attr.name));
        child.setAttribute('src', src);
        child.setAttribute('alt', alt);
        child.setAttribute('loading', 'lazy');
    }
    else
        [...child.attributes].forEach(attr => { if (!(child.tagName === 'A' && ['href', 'rel'].includes(attr.name)))
            child.removeAttribute(attr.name); }); clean(child); }); } const root = parsed.body.firstElementChild; clean(root); return root.innerHTML; }
    function stripHTML(html) { const e = document.createElement('div'); e.innerHTML = html || ''; return e.textContent || ''; }
    let activeReaderType = null, activeReaderId = null;
    function closeReader() { const root = $('#readerScreen'); root.hidden = true; root.innerHTML = ''; activeReaderType = null; activeReaderId = null; }
    function readerShell(meta, title, body, actions, rtl = false) {
        const root = $('#readerScreen');
        root.innerHTML = `<header class="reader-screen-head"><button class="btn" id="readerBack">← Back to workspace</button><div class="reader-screen-brand">URDUSPIRE · READER</div><div class="view-tools">${actions}</div></header><article class="reader-page"><div class="reader-top">${meta}</div><h1 class="reader-title ${rtl ? 'urdu' : ''}">${title}</h1>${body}</article>`;
        root.hidden = false;
        $('#readerBack').onclick = closeReader;
        root.scrollTop = 0;
    }
    function openArticle(a) {
        activeArticleId = a.id;
        a.read = true;
        if (!db.read.includes(a.id))
            db.read.push(a.id);
        save();
        activeReaderType = 'article';
        activeReaderId = a.id;
        const saved = db.saved.includes(a.id);
        readerShell(`${escapeHTML(sourceName(a.sourceId))} · ${dateLabel(a.publishedAt)} · ${a.readMinutes || 4} min read · Demo article`, escapeHTML(a.title), `<p class="reader-body urdu" style="font-weight:650">${escapeHTML(a.summary)}</p><div class="reader-body urdu" style="white-space:pre-line;margin-top:24px">${escapeHTML(a.body || a.summary)}</div><div class="modal-actions" style="justify-content:space-between;margin-top:34px"><a class="btn" href="${escapeHTML(safeURL(a.url) || '#')}" target="_blank" rel="noopener noreferrer">Open original source ↗</a><span class="view-tools"><button class="btn" data-action="note-from-article" data-id="${a.id}">Add note</button><button class="btn" data-action="add-article-research" data-id="${a.id}">Add to research</button><button class="btn btn-primary" data-action="save-article" data-id="${a.id}">${saved ? 'Remove from Saved' : 'Save article'}</button></span></div><p class="panel-subtitle" style="margin-top:18px">Demo content for interface testing; this is not a live news feed.</p>`, '', true);
    }
    function openDocument(d) {
        activeReaderType = 'document';
        activeReaderId = d.id;
        const rtl = /[\u0600-\u06FF]/.test(stripHTML(d.body) || d.title);
        const body = `${d.subtitle ? `<p class="reader-body">${escapeHTML(d.subtitle)}</p>` : ''}${d.excerpt ? `<p class="reader-body" style="font-weight:650">${escapeHTML(d.excerpt)}</p>` : ''}<div class="reader-body ${rtl ? 'urdu' : ''}" style="margin-top:22px">${sanitizeEditor(String(d.body || ''))}</div><div class="modal-actions" style="margin-top:36px"><button class="btn" data-action="share-doc" data-id="${d.id}">Share link</button><button class="btn btn-primary" data-action="edit-doc" data-id="${d.id}">Edit publication</button></div>`;
        readerShell(`${escapeHTML(d.category || 'Article')} · By ${escapeHTML(db.profile.name)} · Published ${dateLabel(d.publishedAt)}`, escapeHTML(d.title), body, '', rtl);
    }
    function profileForm() { const p = db.profile; showModal('Edit author profile', `<div class="field"><label for="profileName">Display name</label><input id="profileName" value="${escapeHTML(p.name)}"></div><div class="field"><label for="profileUsername">Username</label><input id="profileUsername" value="${escapeHTML(p.username)}"></div><div class="field"><label for="profileProfession">Profession</label><input id="profileProfession" value="${escapeHTML(p.profession)}"></div><div class="field"><label for="profileBio">Bio</label><textarea id="profileBio">${escapeHTML(p.bio)}</textarea></div><div class="modal-actions"><button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="saveProfile">Save profile</button></div>`); $('#saveProfile').onclick = () => { db.profile = { name: $('#profileName').value.trim() || 'Writer', username: $('#profileUsername').value.trim().replace(/\s+/g, '-'), profession: $('#profileProfession').value.trim(), bio: $('#profileBio').value.trim() }; save(); closeModal(); renderPage(); toast('Author profile updated.'); }; }
    function shareDoc(d) { const url = location.href.split('#')[0] + '#publication-' + d.id; if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url).then(() => toast('Demo publication link copied.')).catch(() => prompt('Copy this demo link:', url));
    }
    else
        prompt('Copy this demo link:', url); }
    function exportData() { const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' }), url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'urduspire-backup-' + new Date().toISOString().slice(0, 10) + '.json'; a.click(); URL.revokeObjectURL(url); toast('Workspace backup exported.'); }
    function importData(file) {
        if (file.size > 25 * 1024 * 1024) {
            toast('Backup file is too large (25 MB maximum).');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(String(reader.result));
                if (!data || typeof data !== 'object' || !Array.isArray(data.articles) || !Array.isArray(data.documents) || !Array.isArray(data.notes) || !Array.isArray(data.projects) || !Array.isArray(data.sources))
                    throw new Error('Invalid backup');
                db = normalizeWorkspace(data, sample);
                save();
                closeModal();
                renderPage();
                toast('Backup imported successfully.');
            }
            catch {
                toast('This file is not a valid UrduSpire backup.');
            }
        };
        reader.onerror = () => toast('Could not read this backup file.');
        reader.readAsText(file);
    }
    function handleAction(action, el) {
        const idv = Number(el.dataset.id);
        if (action === 'save-article') {
            const exists = db.saved.includes(idv);
            db.saved = exists ? db.saved.filter(x => x !== idv) : [...db.saved, idv];
            save();
            renderPage();
            if (activeReaderType === 'article' && activeReaderId === idv) {
                const a = articleById(idv);
                if (a)
                    openArticle(a);
            }
            toast(exists ? 'Removed from Saved.' : 'Article saved.');
        }
        if (action === 'open-article') {
            const a = articleById(idv);
            if (a)
                openArticle(a);
        }
        if (action === 'add-article-research') {
            addArticleToResearch(idv);
        }
        if (action === 'note-from-article') {
            const a = articleById(idv);
            if (a)
                noteForm(null, null, a);
        }
        if (action === 'open-project')
            openProject(idv);
        if (action === 'new-project')
            projectForm();
        if (action === 'edit-project') {
            const p = db.projects.find(x => x.id === idv);
            if (p)
                projectForm(p);
        }
        if (action === 'delete-project') {
            const p = db.projects.find(x => x.id === idv);
            if (p && confirm(`Delete "${p.title}"? Linked notes will remain, but folder links will be removed.`)) {
                db.projects = db.projects.filter(x => x.id !== idv);
                db.researchItems = db.researchItems.filter(x => x.projectId !== idv);
                db.notes.forEach(n => { if (n.projectId === idv)
                    n.projectId = null; });
                save();
                renderPage();
                toast('Research folder deleted.');
            }
        }
        if (action === 'new-note')
            noteForm();
        if (action === 'edit-note') {
            const n = db.notes.find(x => x.id === idv);
            if (n)
                noteForm(n);
        }
        if (action === 'delete-note') {
            if (confirm('Delete this note?')) {
                db.notes = db.notes.filter(n => n.id !== idv);
                db.researchItems = db.researchItems.filter(x => !(x.type === 'note' && x.itemId === idv));
                save();
                renderPage();
                toast('Note deleted.');
            }
        }
        if (action === 'pin-note') {
            const n = db.notes.find(x => x.id === idv);
            if (n) {
                n.pinned = !n.pinned;
                save();
                renderPage();
                toast(n.pinned ? 'Note pinned.' : 'Note unpinned.');
            }
        }
        if (action === 'remove-research-item') {
            db.researchItems = db.researchItems.filter(x => x.id !== idv);
            save();
            closeModal();
            toast('Removed from research folder.');
        }
        if (action === 'edit-doc') {
            const d = docById(idv);
            if (d) {
                closeModal();
                closeReader();
                editorForm(d);
            }
        }
        if (action === 'open-doc') {
            const d = docById(idv);
            if (d)
                openDocument(d);
        }
        if (action === 'share-doc') {
            const d = docById(idv);
            if (d)
                shareDoc(d);
        }
        if (action === 'go-sources') {
            navigate('sources');
        }
        if (action === 'new-source')
            sourceForm();
        if (action === 'toggle-source') {
            const s = db.sources.find(x => x.id === idv);
            if (s) {
                s.enabled = !s.enabled;
                save();
                renderPage();
                toast(s.enabled ? 'Source enabled.' : 'Source disabled.');
            }
        }
        if (action === 'delete-source') {
            if (confirm('Remove this source from your list? Existing articles will remain.')) {
                db.sources = db.sources.filter(x => x.id !== idv);
                save();
                renderPage();
                toast('Source removed.');
            }
        }
        if (action === 'edit-profile')
            profileForm();
        if (action === 'export-data')
            exportData();
        if (action === 'import-data')
            $('#importFile').click();
        if (action === 'reset-demo' && confirm('Reset all local UrduSpire demo data? This cannot be undone.')) {
            db = structuredClone(sample);
            save();
            navigate('home');
            toast('Demo workspace reset.');
        }
        if (action === 'add-existing-article') {
            const projectId = idv;
            closeModal();
            showModal('Add an article', `<div class="field"><label for="chooseArticle">Select article</label><select id="chooseArticle">${db.articles.map(a => `<option value="${a.id}">${escapeHTML(a.title)}</option>`).join('')}</select></div><div class="modal-actions"><button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="addChosenArticle">Add to folder</button></div>`);
            $('#addChosenArticle').onclick = () => { linkResearch(projectId, 'article', Number($('#chooseArticle').value)); save(); closeModal(); toast('Article linked to research folder.'); };
        }
        if (action === 'new-note-in-project') {
            closeModal();
            noteForm(null, idv);
        }
    }
    function navigate(v) { if (!['home', 'news', 'published', 'research', 'notes', 'writing', 'saved', 'sources', 'profile', 'settings'].includes(v))
        v = 'home'; view = v; searchTerm = ''; $('#globalSearch').value = ''; $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === v)); $('#sidebar').classList.remove('open'); $('#mobileBackdrop').classList.remove('show'); renderPage(); window.scrollTo({ top: 0, behavior: 'smooth' }); try {
        history.replaceState(null, '', v === 'home' ? location.pathname : ('#' + v));
    }
    catch { } }
    function searchAll() { searchTerm = $('#globalSearch').value; renderPage(); }
    // Events
    document.addEventListener('click', (e) => {
        const target = e.target;
        const nav = target.closest('[data-view]');
        if (nav) {
            navigate(nav.dataset.view);
            return;
        }
        const go = target.closest('[data-go]');
        if (go) {
            navigate(go.dataset.go);
            return;
        }
        const quick = target.closest('[data-quick]');
        if (quick) {
            if (quick.dataset.quick === 'writing')
                editorForm();
            else
                noteForm();
            return;
        }
        const act = target.closest('[data-action]');
        if (act) {
            handleAction(act.dataset.action, act);
            return;
        }
        if (target.closest('[data-close]')) {
            closeModal();
            return;
        }
        if (target.closest('[data-profile-open]')) {
            navigate('profile');
            return;
        }
    });
    $('#categoryTabs').addEventListener('click', (e) => { const b = e.target.closest('[data-category]'); if (!b)
        return; activeCategory = b.dataset.category || 'all'; $$('.tab').forEach(t => t.classList.toggle('active', t === b)); $('#dashboardNews').innerHTML = renderNewsList(db.articles.filter(a => activeCategory === 'all' || a.category === activeCategory).slice(0, 4)); });
    $('#globalSearch').addEventListener('input', searchAll);
    window.addEventListener('storage', (event) => { if (event.key === STORE && event.newValue) {
        db = load();
        applyTheme();
        renderPage();
        toast('Workspace updated in another tab.');
    } });
    $('#saveQuickNote').onclick = () => { const body = $('#quickNote').value.trim(); if (!body) {
        toast('Write a note first.');
        return;
    } db.notes.unshift({ id: id(), title: body.slice(0, 48), body, projectId: null, articleId: null, pinned: false, createdAt: now() }); save(); $('#quickNote').value = ''; renderDashboard(); toast('Quick note saved.'); };
    $('#quickNote').addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter')
        $('#saveQuickNote').click(); });
    $('#menuToggle').onclick = () => { $('#sidebar').classList.toggle('open'); $('#mobileBackdrop').classList.toggle('show'); };
    $('#mobileBackdrop').onclick = () => { $('#sidebar').classList.remove('open'); $('#mobileBackdrop').classList.remove('show'); };
    $('#modalClose').onclick = closeModal;
    $('#modalOverlay').addEventListener('click', (e) => { if (e.target.id === 'modalOverlay')
        closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') {
        closeModal();
        closeReader();
    } });
    $('#themeToggle').onclick = () => { db.theme = db.theme === 'dark' ? 'light' : 'dark'; applyTheme(); save(); };
    function applyTheme() { document.documentElement.dataset.theme = db.theme || 'light'; const t = $('#themeSelect'); if (t)
        t.value = db.theme || 'light'; }
    document.addEventListener('change', (e) => { const target = e.target; if (target.id === 'themeSelect') {
        db.theme = target.value;
        applyTheme();
        save();
        toast('Theme updated.');
    } if (target.id === 'importFile') {
        const file = target.files?.[0];
        if (file)
            importData(file);
        target.value = '';
    } });
    $('#todayLabel').textContent = new Intl.DateTimeFormat('en', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()) + ' · Your thinking desk';
    const hour = new Date().getHours();
    $('#welcomeTitle').textContent = (hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening') + ', ' + (db.profile.name || 'Writer').split(' ')[0] + '!';
    applyTheme();
    updateCounts();
    renderDashboard();
    if (location.hash && location.hash.length > 1) {
        const h = location.hash.slice(1);
        if (h.startsWith('publication-')) {
            const d = docById(Number(h.split('-')[1]));
            if (d && d.status === 'published')
                openDocument(d);
        }
        else
            navigate(h);
    }
})();

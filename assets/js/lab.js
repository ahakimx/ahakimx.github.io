// Interaksi komponen artikel lab (markup dibuat scripts/publish-post.mjs di vault quartz-notes):
// perkenalan + penanda bahasa + pilihan Daftar/Grid di halaman depan, tombol bagikan di atas post, halaman Explore, kuis, tombol salin di terminal, lipatan blok kode panjang, dan penanda "Langkah N/M" yang menempel saat membaca langkah-langkah.
document.addEventListener('DOMContentLoaded', () => {
  // Bahasa label mengikuti kartu lab (data-lang), lalu <html lang>; bawaan Indonesia.
  const card = document.querySelector('.lab-card[data-lang]');
  const en = (card ? card.dataset.lang : document.documentElement.lang || '').toLowerCase().startsWith('en');
  const T = en
    ? { perfect: ' · nice work!', review: ' · review the explanations', copy: 'Copy', copied: 'Copied ✓', failed: 'Failed', copyLabel: 'Copy terminal contents',
        showAll: (n) => `Show all (${n} lines)`, fold: 'Collapse', step: 'Step', stepPos: 'Step position', prev: 'Previous step', next: 'Next step', map: 'See the step map' }
    : { perfect: ' · mantap!', review: ' · cek pembahasannya', copy: 'Salin', copied: 'Tersalin ✓', failed: 'Gagal', copyLabel: 'Salin isi terminal',
        showAll: (n) => `Tampilkan semua (${n} baris)`, fold: 'Lipat', step: 'Langkah', stepPos: 'Posisi langkah', prev: 'Langkah sebelumnya', next: 'Langkah berikutnya', map: 'Lihat peta langkah' };

  /* ---------- halaman depan: perkenalan dan penanda bahasa di kartu post ---------- */
  // Datanya disiapkan _includes/metadata-hook.html: <template id="home-intro"> dan daftar URL post berbahasa Indonesia.
  const postList = document.getElementById('post-list');
  if (postList) {
    const intro = document.getElementById('home-intro');
    if (intro && !document.querySelector('.home-intro') && /^\/(index\.html)?$/.test(location.pathname)) postList.before(intro.content.cloneNode(true));
    const langs = document.getElementById('post-langs');
    if (langs) {
      let ids = [];
      try { ids = JSON.parse(langs.textContent || '[]'); } catch { ids = []; }
      const indo = new Set(ids);
      postList.querySelectorAll('a.post-preview[href]').forEach((a) => {
        const meta = a.querySelector('.post-meta .me-auto') || a.querySelector('.post-meta');
        if (!meta || meta.querySelector('.post-lang')) return;
        const id = indo.has(new URL(a.href, location.href).pathname);
        const badge = document.createElement('span');
        badge.className = 'post-lang';
        badge.textContent = id ? 'ID' : 'EN';
        badge.title = id ? 'Bahasa Indonesia' : 'English';
        meta.append(badge);
      });
    }
  }

  /* ---------- halaman depan: pilihan tampilan Daftar / Grid (diingat per browser, hanya di layar lebar) ---------- */
  if (postList && !document.querySelector('.home-view')) {
    const bar = document.createElement('div');
    bar.className = 'home-view';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Post layout');
    const mk = (v, label, icon) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.view = v;
      b.innerHTML = `<i class="fas ${icon} fa-fw" aria-hidden="true"></i>${label}`;
      bar.appendChild(b);
      return b;
    };
    // Di layar lebar pilihan kedua = grid kartu; di HP = daftar ringkas (gambar kecil + judul), supaya lebih banyak post terlihat per layar.
    const btns = [mk('list', '<span class="hv-wide">List</span><span class="hv-narrow">Cards</span>', 'fa-list'), mk('grid', '<span class="hv-wide">Grid</span><span class="hv-narrow">Compact</span>', 'fa-border-all')];
    const apply = (v) => {
      postList.classList.toggle('is-grid', v === 'grid');
      btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === v)));
    };
    let saved = 'list';
    try { saved = localStorage.getItem('home-view') === 'grid' ? 'grid' : 'list'; } catch { saved = 'list'; }
    apply(saved);
    bar.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      apply(b.dataset.view);
      try { localStorage.setItem('home-view', b.dataset.view); } catch { /* penyimpanan diblokir: pilihan berlaku untuk kunjungan ini saja */ }
    });
    // Judul kecil di kiri tombol, hanya di halaman pertama yang punya perkenalan ("Mulai dari sini" ada di atasnya).
    if (document.querySelector('.home-intro')) {
      const lt = document.createElement('p');
      lt.className = 'home-latest';
      lt.textContent = 'Latest posts';
      bar.prepend(lt);
    }
    postList.before(bar);
  }

  /* ---------- post: tombol bagikan juga di bagian atas (salinan dari yang di akhir post) ---------- */
  const shareBottom = document.querySelector('.post-tail-wrapper .share-wrapper, .share-wrapper');
  const postMeta = document.querySelector('article header .post-meta');
  if (shareBottom && postMeta && !document.querySelector('.share-top')) {
    const top = document.createElement('div');
    top.className = 'share-top';
    const label = document.createElement('span');
    label.className = 'share-top__label';
    label.textContent = (shareBottom.querySelector('.share-label')?.textContent || 'Share').trim();
    top.appendChild(label);
    if (navigator.share) {
      const nb = document.createElement('button');
      nb.type = 'button';
      nb.setAttribute('aria-label', 'Share via…');
      nb.title = 'Share via…';
      nb.innerHTML = '<i class="fa-fw fas fa-share-nodes" aria-hidden="true"></i>';
      nb.addEventListener('click', () => { navigator.share({ title: document.title, url: location.href }).catch(() => {}); });
      top.appendChild(nb);
    }
    shareBottom.querySelectorAll('.share-icons a[href]').forEach((a) => {
      const c = document.createElement('a');
      c.href = a.href;
      c.target = '_blank';
      c.rel = 'noopener';
      const name = a.getAttribute('aria-label') || a.getAttribute('data-bs-original-title') || a.title || 'Share';
      c.setAttribute('aria-label', name);
      c.title = name;
      c.innerHTML = a.innerHTML;
      top.appendChild(c);
    });
    const cp = document.createElement('button');
    cp.type = 'button';
    cp.setAttribute('aria-label', 'Copy link');
    cp.title = 'Copy link';
    cp.innerHTML = '<i class="fa-fw fas fa-link" aria-hidden="true"></i>';
    cp.addEventListener('click', async () => {
      let ok = true;
      try { await navigator.clipboard.writeText(location.href); } catch { ok = false; }
      cp.classList.toggle('is-done', ok);
      cp.title = ok ? 'Link copied' : 'Copy failed';
      setTimeout(() => { cp.classList.remove('is-done'); cp.title = 'Copy link'; }, 1600);
    });
    top.appendChild(cp);
    postMeta.after(top);
  }

  /* ---------- halaman Explore: saring semua post menurut topik, tag, bahasa, tahun, dan judul ---------- */
  const exList = document.getElementById('explore-list');
  const exUi = document.getElementById('explore-ui');
  if (exList && exUi) {
    const items = [...exList.querySelectorAll('li[data-year]')].map((li) => ({
      li, year: li.dataset.year, lang: (li.dataset.lang || 'en').toLowerCase().startsWith('id') ? 'id' : 'en',
      cats: (li.dataset.cats || '').split('|').map((x) => x.trim()).filter(Boolean),
      tags: (li.dataset.tags || '').split('|').map((x) => x.trim()).filter(Boolean),
      title: (li.querySelector('a')?.textContent || '').toLowerCase()
    }));
    const count = (key) => {
      const m = new Map();
      items.forEach((it) => it[key].forEach((v) => m.set(v, (m.get(v) || 0) + 1)));
      return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    };
    const state = { q: '', cat: '', tag: '', lang: '', year: '' };
    const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
    const chipRow = (title, key, entries, limit) => {
      const row = el('div', 'explore__row');
      row.appendChild(el('span', 'explore__label', title));
      const box = el('div', 'explore__chips');
      entries.forEach(([name, n, label], i) => {
        const b = el('button', 'explore__chip');
        b.type = 'button';
        b.dataset.key = key;
        b.dataset.value = name;
        b.setAttribute('aria-pressed', 'false');
        b.appendChild(document.createTextNode(label || name));
        if (n !== undefined) b.appendChild(el('small', '', String(n)));
        if (limit && i >= limit) b.classList.add('is-extra');
        box.appendChild(b);
      });
      if (limit && entries.length > limit) {
        const more = el('button', 'explore__more', `+${entries.length - limit} more`);
        more.type = 'button';
        more.addEventListener('click', () => { const open = box.classList.toggle('is-open'); more.textContent = open ? 'Show fewer' : `+${entries.length - limit} more`; });
        box.appendChild(more);
      }
      row.appendChild(box);
      return row;
    };
    const search = el('input', 'explore__search');
    search.type = 'search';
    search.placeholder = 'Search titles…';
    search.setAttribute('aria-label', 'Search post titles');
    const years = [...new Set(items.map((it) => it.year))].sort().reverse();
    const yearSel = el('select', 'explore__year');
    yearSel.setAttribute('aria-label', 'Year');
    yearSel.appendChild(new Option('All years', ''));
    years.forEach((y) => yearSel.appendChild(new Option(`${y} (${items.filter((it) => it.year === y).length})`, y)));
    const top = el('div', 'explore__top');
    top.append(search, yearSel);
    const status = el('p', 'explore__status');
    status.setAttribute('aria-live', 'polite');
    const reset = el('button', 'explore__reset', 'Clear filters');
    reset.type = 'button';
    const nId = items.filter((it) => it.lang === 'id').length;
    exUi.append(top,
      chipRow('Topic', 'cat', count('cats').filter(([, n]) => n >= 2)),
      chipRow('Language', 'lang', [['en', items.length - nId, 'English'], ['id', nId, 'Bahasa Indonesia']]),
      chipRow('Tag', 'tag', count('tags'), 14),
      status);
    const render = () => {
      const q = state.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
      let shown = 0;
      let lastYear = '';
      exList.querySelectorAll('.explore__yearhead').forEach((h) => h.remove());
      items.forEach((it) => {
        const ok = (!state.cat || it.cats.includes(state.cat)) && (!state.tag || it.tags.includes(state.tag)) && (!state.lang || it.lang === state.lang)
          && (!state.year || it.year === state.year) && q.every((w) => it.title.includes(w));
        it.li.hidden = !ok;
        if (!ok) return;
        shown += 1;
        if (it.year !== lastYear) { const h = el('li', 'explore__yearhead', it.year); h.setAttribute('role', 'presentation'); it.li.before(h); lastYear = it.year; }
      });
      const active = Boolean(state.q || state.cat || state.tag || state.lang || state.year);
      status.textContent = `${shown} of ${items.length} posts`;
      if (active) status.append(' · ', reset);
      exUi.querySelectorAll('.explore__chip').forEach((b) => b.setAttribute('aria-pressed', String(state[b.dataset.key] === b.dataset.value)));
    };
    exUi.addEventListener('click', (e) => {
      const b = e.target.closest('.explore__chip');
      if (!b) return;
      state[b.dataset.key] = state[b.dataset.key] === b.dataset.value ? '' : b.dataset.value;
      render();
    });
    search.addEventListener('input', () => { state.q = search.value; render(); });
    yearSel.addEventListener('change', () => { state.year = yearSel.value; render(); });
    reset.addEventListener('click', () => { Object.assign(state, { q: '', cat: '', tag: '', lang: '', year: '' }); search.value = ''; yearSel.value = ''; render(); });
    // Tautan dari luar boleh langsung menyaring: /explore/?tag=s3 atau ?topic=sre&lang=id
    const qs = new URLSearchParams(location.search);
    state.tag = qs.get('tag') || '';
    state.cat = qs.get('topic') || '';
    state.lang = /^(en|id)$/.test(qs.get('lang') || '') ? qs.get('lang') : '';
    render();
  }

  /* ---------- kuis: klik jawaban, tampilkan benar/salah dan pembahasan ---------- */
  document.querySelectorAll('.lab-quiz').forEach((quiz) => {
    const qs = quiz.querySelectorAll('.lab-q');
    const score = quiz.querySelector('.lab-quiz__score');
    let right = 0;
    let done = 0;
    qs.forEach((q) => {
      const btns = q.querySelectorAll('button');
      btns.forEach((b) => {
        b.addEventListener('click', () => {
          btns.forEach((x) => {
            x.disabled = true;
            if (x.dataset.right === '1') x.classList.add('is-right');
          });
          if (b.dataset.right === '1') right += 1;
          else b.classList.add('is-wrong');
          q.classList.add('is-done');
          done += 1;
          if (score) score.textContent = `${right}/${qs.length}` + (done === qs.length ? (right === qs.length ? T.perfect : T.review) : '');
        });
      });
    });
  });

  /* ---------- terminal: tombol salin (prompt "$ " / "# " di awal baris tidak ikut tersalin) ---------- */
  const termText = (body) =>
    [...body.querySelectorAll('.ln')]
      .map((ln) => {
        const c = ln.cloneNode(true);
        const prompt = c.querySelector('.p');
        if (prompt) prompt.remove();
        return c.textContent.replace(/ /g, ' ').replace(prompt ? /^ / : /^$/, '');
      })
      .join('\n');
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Clipboard API butuh HTTPS/izin: pakai cara lama sebagai cadangan.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
      return ok;
    }
  };
  document.querySelectorAll('.lab-term').forEach((term) => {
    const bar = term.querySelector('.lab-term__bar');
    const body = term.querySelector('.lab-term__body');
    if (!bar || !body || bar.querySelector('.lab-term__copy')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lab-term__copy';
    btn.textContent = T.copy;
    btn.setAttribute('aria-label', T.copyLabel);
    let timer;
    btn.addEventListener('click', async () => {
      const ok = await copyText(termText(body));
      btn.textContent = ok ? T.copied : T.failed;
      btn.classList.toggle('is-done', ok);
      clearTimeout(timer);
      timer = setTimeout(() => { btn.textContent = T.copy; btn.classList.remove('is-done'); }, 1600);
    });
    bar.appendChild(btn);
  });

  /* ---------- blok kode panjang: dilipat, dibuka dengan "Tampilkan semua (N baris)" ---------- */
  // Hanya di post lab (ada kartu lab), dan tidak untuk blok yang sudah berada di dalam output terlipat.
  const FOLD_AT = 22;
  if (document.querySelector('.lab-card')) {
    const blocks = [];
    document.querySelectorAll('.content div.highlighter-rouge, .content figure.highlight').forEach((box) => {
      const view = box.querySelector('.highlight') || box;
      const pre = box.querySelector('td.rouge-code pre') || box.querySelector('pre');
      if (pre) blocks.push({ box, view, lines: pre.textContent.replace(/\n$/, '').split('\n').length });
    });
    document.querySelectorAll('.content .lab-term').forEach((box) => {
      const view = box.querySelector('.lab-term__body');
      if (view) blocks.push({ box, view, lines: view.querySelectorAll('.ln').length });
    });
    blocks.forEach(({ box, view, lines }) => {
      if (lines <= FOLD_AT || box.closest('details') || box.querySelector('.lab-codefold')) return;
      view.classList.add('lab-foldable', 'is-folded');
      const foot = document.createElement('div');
      foot.className = 'lab-codefold';
      const btn = document.createElement('button');
      btn.type = 'button';
      const label = () => { btn.textContent = view.classList.contains('is-folded') ? T.showAll(lines) : T.fold; };
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', () => {
        const folded = view.classList.toggle('is-folded');
        btn.setAttribute('aria-expanded', String(!folded));
        label();
        if (folded) box.scrollIntoView({ block: 'nearest' });
      });
      label();
      foot.appendChild(btn);
      view.after(foot);
    });
  }

  /* ---------- penanda langkah: "Langkah 4/11 · judul" + ‹ › selama bagian langkah terlihat ---------- */
  const map = document.querySelector('.lab-steps');
  const steps = map
    ? [...map.querySelectorAll('a[href^="#"]')]
        .map((a) => ({ el: document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))), title: a.textContent.trim() }))
        .filter((s) => s.el)
    : [];
  if (steps.length >= 3) {
    const bar = document.createElement('nav');
    bar.className = 'lab-progress';
    bar.setAttribute('aria-label', T.stepPos);
    bar.hidden = true;
    bar.innerHTML =
      '<button type="button" class="lab-progress__nav" data-go="-1" aria-label="' + T.prev + '">‹</button>' +
      '<button type="button" class="lab-progress__label" title="' + T.map + '"><b></b><span></span></button>' +
      '<button type="button" class="lab-progress__nav" data-go="1" aria-label="' + T.next + '">›</button>' +
      '<i class="lab-progress__fill" aria-hidden="true"></i>';
    document.body.appendChild(bar);
    const num = bar.querySelector('b');
    const name = bar.querySelector('span');
    const fill = bar.querySelector('.lab-progress__fill');
    const [prev, , next] = bar.querySelectorAll('button');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const go = (el) => el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
    // Akhir bagian langkah = heading setingkat <h2> berikutnya setelah langkah terakhir (atau akhir artikel).
    const endOf = () => {
      let n = steps[steps.length - 1].el.nextElementSibling;
      while (n && !/^H[12]$/.test(n.tagName)) n = n.nextElementSibling;
      return n ? n.getBoundingClientRect().top : steps[steps.length - 1].el.parentElement.getBoundingClientRect().bottom;
    };
    let cur = -1;
    const update = () => {
      const line = window.innerHeight * 0.35;
      let i = -1;
      steps.forEach((s, k) => { if (s.el.getBoundingClientRect().top <= line) i = k; });
      const show = i >= 0 && endOf() > line;
      bar.hidden = !show;
      if (!show || i === cur) return;
      cur = i;
      num.textContent = `${T.step} ${i + 1}/${steps.length}`;
      name.textContent = steps[i].title;
      fill.style.width = `${((i + 1) / steps.length) * 100}%`;
      prev.disabled = i === 0;
      next.disabled = i === steps.length - 1;
    };
    bar.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.go) { const t = steps[cur + Number(b.dataset.go)]; if (t) go(t.el); }
      else go(map);
    });
    let tick = false;
    const onScroll = () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => { tick = false; update(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }
  /* ---------- post dua bahasa: pilihan English / Bahasa Indonesia di bawah judul ---------- */
  // Template-nya dibuat _includes/metadata-hook.html untuk post yang punya pasangan (lab.pair / pair).
  // Tautan lama di dalam artikel (p.lab-lang) disembunyikan karena sudah digantikan pilihan ini.
  const ls = document.getElementById('lang-switch');
  const postHead = document.querySelector('article header');
  if (ls && postHead && !postHead.querySelector('.lang-switch')) {
    const node = ls.content.cloneNode(true);
    const anchor = postHead.querySelector('.post-desc') || postHead.querySelector('h1');
    anchor.after(node);
    document.querySelectorAll('.content .lab-lang').forEach((p) => p.remove());
  }

  /* ---------- halaman Series: tiap bagian "## Nama series" jadi kartu ---------- */
  // Isi tetap ditulis biasa di _tabs/series.md: judul (h2, boleh diberi {: data-lang="id" }), deskripsi, tabel daftar
  // artikel (opsional), lalu tautan "Start the series". Di sini bagian itu dibungkus kartu; tabel dilipat ke
  // "Articles (N)", tautan terakhir jadi tombol, dan data-lang="id" menambah penanda "In Bahasa Indonesia".
  if (/^\/series\/?$/.test(location.pathname)) {
    const content = document.querySelector('article .content') || document.querySelector('.content');
    const heads = content ? [...content.querySelectorAll(':scope > h2')] : [];
    heads.forEach((h2) => {
      const card = document.createElement('section');
      card.className = 'series-card';
      h2.before(card);
      const parts = [];
      let n = h2.nextElementSibling;
      while (n && !['H2', 'HR'].includes(n.tagName) && !(n.tagName === 'BLOCKQUOTE' && n.className.includes('prompt-'))) {
        parts.push(n);
        n = n.nextElementSibling;
      }
      if (n && n.tagName === 'HR') n.remove();
      const prevHr = card.previousElementSibling;
      if (prevHr && prevHr.tagName === 'HR') prevHr.remove();
      const body = document.createElement('div');
      body.className = 'series-card__body';
      const list = [];
      let cta = null;
      parts.forEach((el) => {
        const links = el.matches('p') ? el.querySelectorAll('a') : [];
        if (el.matches('p') && links.length === 1 && el.textContent.trim() === links[0].textContent.trim()) cta = links[0];
        else if (el.matches('table, h3, .table-wrapper') || el.querySelector('table')) list.push(el);
        else body.append(el);
      });
      const nPosts = list.reduce((s, el) => s + (el.matches('h3') ? 0 : el.querySelectorAll('tbody a, td a').length), 0);
      const kicker = document.createElement('p');
      kicker.className = 'series-card__kicker';
      kicker.textContent = nPosts ? `Series · ${nPosts} posts` : 'Series';
      if (h2.dataset.lang === 'id') {
        const lang = document.createElement('span');
        lang.className = 'series-card__lang';
        lang.innerHTML = '<svg class="lang-flag" viewBox="0 0 3 2" aria-hidden="true"><rect width="3" height="1" fill="#CE1126"/><rect y="1" width="3" height="1" fill="#fff"/></svg>In Bahasa Indonesia';
        kicker.append(lang);
      }
      card.append(kicker, h2, body);
      if (list.length) {
        const det = document.createElement('details');
        det.className = 'series-card__list';
        const sum = document.createElement('summary');
        sum.textContent = nPosts ? `Articles (${nPosts})` : 'Articles';
        det.append(sum, ...list);
        card.append(det);
      }
      if (cta) {
        const a = cta.cloneNode(true);
        a.className = 'series-card__cta';
        a.textContent = a.textContent.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '').trim() || 'Start';
        card.append(a);
        cta.closest('p').remove();
      }
    });
  }
  /* ---------- akhir post: ajakan follow (template dari _includes/metadata-hook.html) ---------- */
  const cta = document.getElementById('post-cta');
  const tail = document.querySelector('article .post-tail-wrapper');
  if (cta && tail && !document.querySelector('.post-cta')) tail.before(cta.content.cloneNode(true));

  /* ---------- halaman 404: tombol "Search the blog" membuka kotak pencarian di bar atas ---------- */
  document.querySelectorAll('[data-open-search]').forEach((b) => b.addEventListener('click', () => {
    const trigger = document.getElementById('search-trigger');
    if (trigger && getComputedStyle(trigger).display !== 'none') trigger.click();
    const input = document.getElementById('search-input');
    if (input) { input.focus(); input.scrollIntoView({ block: 'center' }); }
  }));
  /* ================= fitur interaktif lab (nilai milikmu, progres, diagram) dan komponen umum ================= */
  const I = en
    ? { varsTitle: 'Your values', varsHint: 'Fill these in once: every command on this page updates, ready to copy.', reset: 'Reset',
        doneMark: (n) => `Mark step ${n} as done`, doneOk: (n) => `Step ${n} done`, progress: (d, n) => `${d}/${n} steps done`,
        diagHint: 'Click a component to see what it does and where it appears in the steps.', diagSteps: 'In the steps:', diagNone: 'Not used directly in the steps.',
        close: 'Close', perMonth: '/month', save: (p) => `${p}% cheaper`, more: (p) => `${p}% more`, base: 'baseline', unitDay: 'questions per day' }
    : { varsTitle: 'Nilai milikmu', varsHint: 'Isi sekali: semua perintah di halaman ini ikut berubah, siap disalin.', reset: 'Kembalikan',
        doneMark: (n) => `Tandai langkah ${n} selesai`, doneOk: (n) => `Langkah ${n} selesai`, progress: (d, n) => `${d}/${n} langkah selesai`,
        diagHint: 'Klik komponen untuk melihat fungsinya dan di langkah mana ia muncul.', diagSteps: 'Di langkah:', diagNone: 'Tidak dipakai langsung di langkah-langkah.',
        close: 'Tutup', perMonth: '/bulan', save: (p) => `${p}% lebih murah`, more: (p) => `${p}% lebih mahal`, base: 'pembanding', unitDay: 'pertanyaan per hari' };
  const store = {
    get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage off: fitur tetap jalan tanpa disimpan */ } },
  };
  const content = document.querySelector('article .content');
  const isLab = Boolean(document.querySelector('.lab-card'));
  const sectionOf = (i) => {
    // Elemen milik langkah ke-i: dari heading langkah sampai heading langkah berikutnya / heading <h2> berikutnya.
    const out = [];
    let n = steps[i].el.nextElementSibling;
    const stop = steps[i + 1] ? steps[i + 1].el : null;
    while (n && n !== stop && !/^H[12]$/.test(n.tagName)) { out.push(n); n = n.nextElementSibling; }
    return out;
  };

  /* ---------- 1. nilai milikmu: variabel literal di blok kode langkah 1 jadi isian ---------- */
  // Baris seperti `export AWS_REGION=ap-southeast-3` atau `PREFIX=rimba-lab` di blok kode pertama langkah 1.
  // Mengubah isian mengganti nilai itu di semua teks artikel (perintah, output, catatan), dan tersimpan di browser.
  if (isLab && content && steps.length) {
    const firstCode = sectionOf(0).find((el) => el.matches('div.highlighter-rouge, figure.highlight') || el.querySelector('pre'));
    const pre = firstCode && (firstCode.querySelector('td.rouge-code pre') || firstCode.querySelector('pre'));
    const assign = /^\s*(?:export\s+)?([A-Z][A-Z0-9_]*)=([A-Za-z0-9][A-Za-z0-9._:/-]{2,})\s*$/;
    const fields = [];
    if (pre) {
      pre.textContent.split('\n').forEach((line) => {
        const m = line.match(assign);
        if (!m) return;
        const same = fields.find((f) => f.value === m[2]);
        if (same) same.names.push(m[1]);
        else fields.push({ names: [m[1]], value: m[2], current: m[2] });
      });
    }
    if (fields.length) {
      const replaceText = (from, to) => {
        if (!from || from === to) return;
        const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
          acceptNode: (n) => (n.parentElement.closest('.lab-vars, script, style') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
        });
        const hits = [];
        while (walker.nextNode()) if (walker.currentNode.nodeValue.includes(from)) hits.push(walker.currentNode);
        hits.forEach((n) => { n.nodeValue = n.nodeValue.split(from).join(to); });
      };
      const saved = store.get('lab-vars', {});
      const box = document.createElement('div');
      box.className = 'lab-vars';
      box.innerHTML = `<p class="lab-vars__title">${I.varsTitle}</p><p class="lab-vars__hint">${I.varsHint}</p><div class="lab-vars__grid"></div>`;
      const grid = box.querySelector('.lab-vars__grid');
      const ok = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/;
      const apply = (f, v) => {
        if (!v || !ok.test(v) || v === f.current) return;
        replaceText(f.current, v);
        f.current = v;
      };
      fields.forEach((f) => {
        const label = document.createElement('label');
        label.innerHTML = `<span>${f.names.join(' / ')}</span>`;
        const input = document.createElement('input');
        input.type = 'text';
        input.spellcheck = false;
        input.autocomplete = 'off';
        input.value = f.value;
        input.placeholder = f.value;
        let t;
        input.addEventListener('input', () => {
          clearTimeout(t);
          t = setTimeout(() => {
            const v = input.value.trim();
            input.classList.toggle('is-bad', Boolean(v) && !ok.test(v));
            apply(f, v || f.value);
            const s = store.get('lab-vars', {});
            f.names.forEach((nm) => { if (v && ok.test(v) && v !== f.value) s[nm] = v; else delete s[nm]; });
            store.set('lab-vars', s);
          }, 250);
        });
        f.input = input;
        label.appendChild(input);
        grid.appendChild(label);
        const mine = f.names.map((nm) => saved[nm]).find(Boolean);
        if (mine && ok.test(mine)) { input.value = mine; apply(f, mine); }
      });
      const reset = document.createElement('button');
      reset.type = 'button';
      reset.className = 'lab-vars__reset';
      reset.textContent = I.reset;
      reset.addEventListener('click', () => {
        const s = store.get('lab-vars', {});
        fields.forEach((f) => { f.input.value = f.value; apply(f, f.value); f.names.forEach((nm) => delete s[nm]); });
        store.set('lab-vars', s);
      });
      box.appendChild(reset);
      firstCode.before(box);
    }
  }

  /* ---------- 2. progres lab: tandai langkah selesai, tersimpan di browser ---------- */
  if (isLab && map && steps.length >= 3) {
    const key = `lab-done:${location.pathname}`;
    const done = new Set(store.get(key, []));
    const items = [...map.querySelectorAll('li')];
    const head = document.createElement('div');
    head.className = 'lab-done';
    head.innerHTML = '<span class="lab-done__text"></span><span class="lab-done__bar"><i></i></span>';
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'lab-done__reset';
    resetBtn.textContent = I.reset;
    head.appendChild(resetBtn);
    map.before(head);
    const toggles = [];
    const paint = () => {
      head.querySelector('.lab-done__text').textContent = I.progress(done.size, steps.length);
      head.querySelector('.lab-done__bar i').style.width = `${(done.size / steps.length) * 100}%`;
      resetBtn.hidden = done.size === 0;
      steps.forEach((s, i) => {
        const on = done.has(i + 1);
        if (items[i]) items[i].classList.toggle('is-done', on);
        const b = toggles[i];
        b.setAttribute('aria-pressed', String(on));
        b.textContent = on ? `✓ ${I.doneOk(i + 1)}` : I.doneMark(i + 1);
      });
      store.set(key, [...done]);
    };
    steps.forEach((s, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'lab-done__toggle';
      b.addEventListener('click', () => { if (done.has(i + 1)) done.delete(i + 1); else done.add(i + 1); paint(); });
      toggles.push(b);
      const part = sectionOf(i);
      const last = part[part.length - 1] || s.el;
      last.after(b);
    });
    resetBtn.addEventListener('click', () => { done.clear(); paint(); });
    paint();
  }

  /* ---------- 3. diagram arsitektur: komponen bisa diklik ---------- */
  // Hanya untuk gambar SVG diagram arsitektur (nama berisi "-diagram-") dari exam-prep. Posisi komponen dibaca dari SVG-nya,
  // lalu tombol transparan diletakkan di atas gambar. Isi penjelasan: label dan keterangan di diagram + langkah yang menyebutnya.
  if (content) {
    const stop = new Set(['the', 'and', 'with', 'for', 'dan', 'yang', 'aws', 'amazon', 'ec2', 'az', 'sg', 'tcp', 'uid', 'gid']);
    const stepsFor = (label) => {
      if (!steps.length) return [];
      // Peringkat: judul langkah yang menyebut komponen dulu, lalu isi langkah; maksimal 3 langkah.
      const whole = label.toLowerCase();
      const words = whole.split(/[^a-z0-9-]+/).filter((w) => w.length >= 3 && !stop.has(w));
      const has = (t) => t.includes(whole) || (words.length > 0 && words.every((w) => t.includes(w)));
      const scored = steps.map((s, i) => {
        const title = s.title.toLowerCase();
        const body = sectionOf(i).map((e) => e.textContent).join(' ').toLowerCase();
        const score = has(title) ? 3 : (words.some((w) => title.includes(w)) && has(body) ? 2 : (has(body) ? 1 : 0));
        return { i, score };
      }).filter((x) => x.score > 0);
      scored.sort((a, b) => b.score - a.score || a.i - b.i);
      return scored.slice(0, 3).map((x) => x.i).sort((a, b) => a - b);
    };
    let pop = null;
    const closePop = () => { if (pop) { pop.remove(); pop = null; } };
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePop(); });
    document.addEventListener('click', (e) => { if (pop && !e.target.closest('.dg-pop, .dg-hot')) closePop(); });
    content.querySelectorAll('img[src*="-diagram-"][src$=".svg"]').forEach(async (img) => {
      let svgText;
      try { svgText = await fetch(img.getAttribute('src')).then((r) => (r.ok ? r.text() : Promise.reject())); } catch { return; }
      const holder = document.createElement('div');
      holder.style.cssText = 'position:absolute;left:-10000px;top:0;visibility:hidden';
      holder.innerHTML = svgText;
      document.body.appendChild(holder);
      const svg = holder.querySelector('svg');
      if (!svg) { holder.remove(); return; }
      const vb = (svg.getAttribute('viewBox') || '').split(/\s+/).map(Number);
      const [vx, vy, vw, vh] = vb.length === 4 ? vb : [0, 0, Number(svg.getAttribute('width')), Number(svg.getAttribute('height'))];
      svg.querySelectorAll('.dg-node').forEach((g) => { g.style.animation = 'none'; g.style.opacity = '1'; });
      const nodes = [...svg.querySelectorAll('g.dg-node')].map((g) => {
        const bb = g.getBBox();
        const texts = [...g.querySelectorAll('text')].map((t) => t.textContent.trim()).filter(Boolean);
        return { bb, label: texts[0] || '', sub: texts.slice(1).join(' · ') };
      }).filter((n) => n.label && n.bb.width > 0);
      holder.remove();
      if (!nodes.length) return;
      const anchor = img.closest('a.popup') || img;
      const wrap = document.createElement('span');
      wrap.className = 'dg-hotwrap';
      // Ikut kelas light/dark tautan gambarnya, supaya tombolnya ikut tersembunyi bersama gambar tema lain.
      ['light', 'dark'].forEach((c) => { if (anchor.classList.contains(c)) wrap.classList.add(c); });
      anchor.before(wrap);
      wrap.appendChild(anchor);
      nodes.forEach((n) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'dg-hot';
        b.setAttribute('aria-label', n.label);
        const pad = 4;
        b.style.left = `${((n.bb.x - pad - vx) / vw) * 100}%`;
        b.style.top = `${((n.bb.y - pad - vy) / vh) * 100}%`;
        b.style.width = `${((n.bb.width + pad * 2) / vw) * 100}%`;
        b.style.height = `${((n.bb.height + pad * 2) / vh) * 100}%`;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          closePop();
          const idx = stepsFor(n.label);
          pop = document.createElement('div');
          pop.className = 'dg-pop';
          pop.setAttribute('role', 'dialog');
          pop.innerHTML = `<button type="button" class="dg-pop__x" aria-label="${I.close}">×</button><b></b><p class="dg-pop__sub"></p><p class="dg-pop__steps"></p>`;
          pop.querySelector('b').textContent = n.label;
          pop.querySelector('.dg-pop__sub').textContent = n.sub;
          const sp = pop.querySelector('.dg-pop__steps');
          if (idx.length) {
            sp.textContent = `${I.diagSteps} `;
            idx.forEach((i, k) => {
              const a = document.createElement('a');
              a.href = `#${steps[i].el.id}`;
              a.textContent = `${i + 1}. ${steps[i].title}`;
              a.addEventListener('click', closePop);
              sp.append(a);
              if (k < idx.length - 1) sp.append(' · ');
            });
          } else sp.textContent = steps.length ? I.diagNone : '';
          pop.querySelector('.dg-pop__x').addEventListener('click', closePop);
          wrap.appendChild(pop);
          const r = b.getBoundingClientRect();
          const w = wrap.getBoundingClientRect();
          const left = Math.min(Math.max(r.left - w.left, 0), Math.max(w.width - pop.offsetWidth, 0));
          pop.style.left = `${left}px`;
          pop.style.top = `${r.bottom - w.top + 6}px`;
        });
        wrap.appendChild(b);
      });
      if (!wrap.parentElement.querySelector('.dg-hint')) {
        const hint = document.createElement('p');
        hint.className = 'dg-hint';
        hint.textContent = I.diagHint;
        wrap.after(hint);
      }
    });
  }

  /* ---------- 4. kalkulator biaya: <div class="cost-calc" data-scenarios='[...]'> di artikel ---------- */
  // data-scenarios: [{"name":"All to Nova 2 Lite","per1k":0.889}, ...] (biaya per 1.000 permintaan, USD).
  // Opsional: data-default (permintaan/hari, bawaan 1000), data-max (bawaan 100000), data-unit (teks satuan).
  document.querySelectorAll('.cost-calc[data-scenarios]').forEach((calc) => {
    let sc;
    try { sc = JSON.parse(calc.dataset.scenarios); } catch { return; }
    if (!Array.isArray(sc) || !sc.length) return;
    const max = Number(calc.dataset.max) || 100000;
    const unit = calc.dataset.unit || I.unitDay;
    const def = Number(calc.dataset.default) || 1000;
    const steps10 = (v) => Math.round(Math.pow(10, (v / 100) * Math.log10(max)));
    const toSlider = (q) => Math.round((Math.log10(Math.max(q, 1)) / Math.log10(max)) * 100);
    calc.innerHTML = `<label class="cost-calc__in"><span></span><input type="range" min="0" max="100" step="1"><input type="number" min="1" max="${max}"></label><div class="cost-calc__rows"></div>`;
    calc.querySelector('.cost-calc__in span').textContent = unit;
    const [range, num] = calc.querySelectorAll('input');
    const rows = calc.querySelector('.cost-calc__rows');
    const fmt = (v) => (v >= 100 ? `$${Math.round(v).toLocaleString('en-US')}` : v >= 1 ? `$${v.toFixed(2)}` : `$${v.toFixed(3)}`);
    const render = (q) => {
      const costs = sc.map((s) => (s.per1k * q * 30) / 1000);
      const top = Math.max(...costs);
      rows.innerHTML = '';
      sc.forEach((s, i) => {
        const r = document.createElement('div');
        r.className = 'cost-calc__row';
        const diff = i === 0 ? I.base : costs[i] <= costs[0] ? I.save(Math.round((1 - costs[i] / costs[0]) * 100)) : I.more(Math.round((costs[i] / costs[0] - 1) * 100));
        r.innerHTML = '<span class="cost-calc__name"></span><span class="cost-calc__bar"><i></i></span><b></b><em></em>';
        r.querySelector('.cost-calc__name').textContent = s.name;
        r.querySelector('i').style.width = `${top ? (costs[i] / top) * 100 : 0}%`;
        r.querySelector('b').textContent = `${fmt(costs[i])}${I.perMonth}`;
        r.querySelector('em').textContent = diff;
        rows.appendChild(r);
      });
    };
    const set = (q, from) => {
      q = Math.min(Math.max(Math.round(q) || 1, 1), max);
      if (from !== 'range') range.value = toSlider(q);
      if (from !== 'num') num.value = q;
      render(q);
    };
    range.addEventListener('input', () => set(steps10(Number(range.value)), 'range'));
    num.addEventListener('input', () => set(Number(num.value), 'num'));
    set(def);
  });

  /* ---------- 5. halaman About: chip skill menaut ke Explore bila ada post-nya ---------- */
  const tagData = document.getElementById('tag-counts');
  if (tagData && content) {
    let data = {};
    try { data = JSON.parse(tagData.textContent); } catch { data = {}; }
    const tags = data.tags || {};
    const cats = data.categories || {};
    const alias = { 'amazon eks': 'eks', 'elk stack': 'elk', 'ipsec/strongswan': 'ipsec', 'overlay networks': 'networking', 'apache kafka': 'kafka', 'github actions': 'ci-cd' };
    content.querySelectorAll('.skill-group i').forEach((chip) => {
      const name = chip.textContent.trim().toLowerCase();
      const slug = alias[name] || name.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      let href = '';
      let n = 0;
      // Pakai yang postnya lebih banyak: kategori (topik) atau tag. Contoh: "linux" lebih banyak sebagai kategori.
      if ((cats[slug] || 0) > (tags[slug] || 0)) { href = `/explore/?topic=${encodeURIComponent(slug)}`; n = cats[slug]; }
      else if (tags[slug]) { href = `/explore/?tag=${encodeURIComponent(slug)}`; n = tags[slug]; }
      if (!href) return;
      const a = document.createElement('a');
      a.href = href;
      a.className = 'skill-link';
      a.title = en ? `${n} post${n > 1 ? 's' : ''}` : `${n} post`;
      a.innerHTML = `${chip.innerHTML}<sup>${n}</sup>`;
      chip.replaceWith(a);
    });
  }

  /* ---------- 6. post: bilah progres baca di atas layar + sisa waktu baca di daftar isi ---------- */
  // Progres dihitung dari awal sampai akhir isi artikel (bukan seluruh halaman), sisa waktu dari "N min read" bawaan tema.
  const articleBody = document.querySelector('article .content');
  const readtime = document.querySelector('article header .readtime em, .post-meta .readtime em');
  if (articleBody && readtime && document.querySelector('article[data-toc]')) {
    const total = parseInt(readtime.textContent, 10) || 0;
    const bar = document.createElement('div');
    bar.className = 'read-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    const labels = [];
    const addLabel = (host, before) => {
      if (!host || !total) return;
      const s = document.createElement('span');
      s.className = 'read-left';
      host.insertBefore(s, before || null);
      labels.push(s);
    };
    // Panel daftar isi di layar lebar, dan bar judul yang muncul saat menggulir di layar sempit.
    addLabel(document.querySelector('#toc-wrapper .panel-heading'));
    const tocBar = document.getElementById('toc-bar');
    if (tocBar) addLabel(tocBar, tocBar.querySelector('.toc-trigger'));
    const leftText = (p) => {
      if (p >= 0.98) return en ? 'Done reading ✓' : 'Selesai dibaca ✓';
      const m = Math.max(1, Math.ceil(total * (1 - p)));
      return en ? `≈ ${m} min left` : `± ${m} menit lagi`;
    };
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = articleBody.getBoundingClientRect();
      const span = r.height - window.innerHeight * 0.6;
      const p = Math.min(Math.max((-r.top + window.innerHeight * 0.2) / Math.max(span, 1), 0), 1);
      bar.style.setProperty('--read', p.toFixed(4));
      const txt = leftText(p);
      labels.forEach((l) => { if (l.textContent !== txt) l.textContent = txt; });
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }
});

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
    // Tautan dari luar boleh langsung menyaring: /explore/?tag=aws-s3 atau ?topic=sre&lang=id
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
});

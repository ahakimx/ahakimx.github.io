// Interaksi komponen artikel lab (markup dibuat scripts/publish-post.mjs di vault quartz-notes):
// kuis, tombol salin di terminal, lipatan blok kode panjang, dan penanda "Langkah N/M" yang menempel saat membaca langkah-langkah.
document.addEventListener('DOMContentLoaded', () => {
  // Bahasa label mengikuti kartu lab (data-lang), lalu <html lang>; bawaan Indonesia.
  const card = document.querySelector('.lab-card[data-lang]');
  const en = (card ? card.dataset.lang : document.documentElement.lang || '').toLowerCase().startsWith('en');
  const T = en
    ? { perfect: ' · nice work!', review: ' · review the explanations', copy: 'Copy', copied: 'Copied ✓', failed: 'Failed', copyLabel: 'Copy terminal contents',
        showAll: (n) => `Show all (${n} lines)`, fold: 'Collapse', step: 'Step', stepPos: 'Step position', prev: 'Previous step', next: 'Next step', map: 'See the step map' }
    : { perfect: ' · mantap!', review: ' · cek pembahasannya', copy: 'Salin', copied: 'Tersalin ✓', failed: 'Gagal', copyLabel: 'Salin isi terminal',
        showAll: (n) => `Tampilkan semua (${n} baris)`, fold: 'Lipat', step: 'Langkah', stepPos: 'Posisi langkah', prev: 'Langkah sebelumnya', next: 'Langkah berikutnya', map: 'Lihat peta langkah' };

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

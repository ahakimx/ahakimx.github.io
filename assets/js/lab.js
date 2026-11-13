// Kuis interaktif di artikel lab: klik jawaban, tampilkan benar/salah dan pembahasan.
document.addEventListener('DOMContentLoaded', () => {
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
          if (score) score.textContent = `${right}/${qs.length}` + (done === qs.length ? (right === qs.length ? ' · mantap!' : ' · cek pembahasannya') : '');
        });
      });
    });
  });
});

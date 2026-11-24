/* ==========================================================================
   QuizCraft — quiz engine
   Draws 40 random questions from the 100-question bank, runs a timed test,
   scores it and renders a full answer review.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------ config */

  const TEST_SIZE = 40;
  const TEST_SECONDS = 30 * 60;
  const BEST_KEY = 'quizcraft.best.v1';
  const LETTERS = ['A', 'B', 'C', 'D'];
  const RING_CIRCUMFERENCE = 2 * Math.PI * 86; // r = 86 in the SVG

  const CATEGORY_META = {
    Science: { icon: 'flask', blurb: 'Physics, chemistry, biology and space.' },
    History: { icon: 'book', blurb: 'World events, leaders and turning points.' },
    Geography: { icon: 'globe', blurb: 'Capitals, rivers, oceans and landmarks.' },
    Technology: { icon: 'chip', blurb: 'Computing, the web and digital basics.' },
    'General Knowledge': { icon: 'spark', blurb: 'Arts, sport, music and everyday facts.' }
  };

  const ICONS = {
    flask: '<path d="M9 3h6"></path><path d="M10 3v5.5L5.5 17A2.5 2.5 0 0 0 7.8 21h8.4a2.5 2.5 0 0 0 2.3-4L14 8.5V3"></path><path d="M7 15h10"></path>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5z"></path><path d="M4 20.5V5.5"></path>',
    globe: '<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z"></path>',
    chip: '<rect x="7" y="7" width="10" height="10" rx="2"></rect><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"></path>',
    spark: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"></path>'
  };

  /* ------------------------------------------------------------ helpers */

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function shuffle(list) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  function formatClock(totalSeconds) {
    const safe = Math.max(0, Math.floor(totalSeconds));
    const mins = Math.floor(safe / 60);
    const secs = safe % 60;
    return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  }

  function iconSvg(name, size) {
    const s = size || 18;
    return (
      '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" ' +
      'stroke="currentColor" stroke-width="1.9" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.spark) + '</svg>'
    );
  }

  /* ------------------------------------------------------------ state */

  const state = {
    questions: [],
    answers: [],
    index: 0,
    remaining: TEST_SECONDS,
    timerId: null,
    submitted: false,
    result: null,
    best: 0
  };

  const els = {};

  /* ------------------------------------------------------------ storage */

  function loadBest() {
    try {
      const raw = window.localStorage.getItem(BEST_KEY);
      const parsed = raw === null ? 0 : parseInt(raw, 10);
      state.best = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    } catch (err) {
      state.best = 0;
    }
  }

  function saveBest(correct) {
    if (correct <= state.best) return;
    state.best = correct;
    try {
      window.localStorage.setItem(BEST_KEY, String(correct));
    } catch (err) {
      /* private mode / storage blocked — best score stays in-memory only */
    }
  }

  function renderBest() {
    if (!els.bestBox) return;
    if (state.best > 0) {
      els.bestBox.hidden = false;
      els.bestValue.textContent = String(state.best);
    } else {
      els.bestBox.hidden = true;
    }
  }

  /* ------------------------------------------------------------ screens */

  function showScreen(id) {
    $$('.screen').forEach(function (screen) {
      screen.classList.toggle('is-active', screen.id === id);
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  /* ------------------------------------------------------------ modal */

  let modalHandler = null;

  function openModal(options) {
    els.modalTitle.textContent = options.title;
    els.modalText.textContent = options.text;
    els.modalConfirm.textContent = options.confirmLabel || 'Confirm';
    els.modalCancel.textContent = options.cancelLabel || 'Cancel';
    modalHandler = options.onConfirm || null;
    els.modal.hidden = false;
    document.body.classList.add('modal-open');
    els.modalConfirm.focus();
  }

  function closeModal() {
    els.modal.hidden = true;
    document.body.classList.remove('modal-open');
    modalHandler = null;
  }

  /* ------------------------------------------------------------ home screen */

  function renderCategories() {
    const counts = {};
    QUIZ_QUESTIONS.forEach(function (q) {
      counts[q.category] = (counts[q.category] || 0) + 1;
    });

    const order = ['Science', 'History', 'Geography', 'Technology', 'General Knowledge'];
    els.catGrid.innerHTML = order
      .filter(function (name) { return counts[name]; })
      .map(function (name) {
        const meta = CATEGORY_META[name] || CATEGORY_META['General Knowledge'];
        return (
          '<article class="cat-card">' +
            '<span class="cat-icon">' + iconSvg(meta.icon, 18) + '</span>' +
            '<h3>' + escapeHtml(name) + '</h3>' +
            '<p>' + escapeHtml(meta.blurb) + '</p>' +
            '<p class="cat-count">' + counts[name] + ' questions</p>' +
          '</article>'
        );
      })
      .join('');
  }

  function goHome() {
    if (!state.submitted && state.questions.length && answeredCount() > 0) {
      openModal({
        title: 'Leave the test?',
        text: 'Your current answers will be discarded and this attempt will not be scored.',
        confirmLabel: 'Leave test',
        cancelLabel: 'Keep going',
        onConfirm: function () {
          stopTimer();
          state.questions = [];
          state.answers = [];
          state.submitted = false;
          showScreen('screen-home');
        }
      });
      return;
    }
    stopTimer();
    state.questions = [];
    state.answers = [];
    state.submitted = false;
    showScreen('screen-home');
  }

  /* ------------------------------------------------------------ question bank browser */

  function renderBank(category) {
    const list = category && category !== 'all'
      ? QUIZ_QUESTIONS.filter(function (q) { return q.category === category; })
      : QUIZ_QUESTIONS.slice();

    els.bankCount.textContent = list.length + ' question' + (list.length === 1 ? '' : 's');

    els.bankList.innerHTML = list.map(function (q, i) {
      const correctText = q.options[q.answer];
      return (
        '<article class="review-item is-correct">' +
          '<div class="review-top">' +
            '<span class="review-index">Q' + q.id + '</span>' +
            '<span class="tag cat">' + escapeHtml(q.category) + '</span>' +
            '<span class="tag correct">Answer ' + LETTERS[q.answer] + '</span>' +
          '</div>' +
          '<p class="review-q">' + escapeHtml(q.question) + '</p>' +
          '<dl class="review-answers">' +
            '<div><dt>Correct</dt><dd class="good">' + escapeHtml(correctText) + '</dd></div>' +
            '<div><dt>Options</dt><dd>' + q.options.map(escapeHtml).join(' &middot; ') + '</dd></div>' +
          '</dl>' +
        '</article>'
      );
    }).join('');

    $$('#bank-filters .chip').forEach(function (chip) {
      chip.classList.toggle('is-active', (chip.dataset.category || 'all') === (category || 'all'));
    });
  }

  function openBank() {
    if (!state.submitted && state.questions.length && answeredCount() > 0) {
      openModal({
        title: 'Leave the test?',
        text: 'Your current answers will be discarded and this attempt will not be scored.',
        confirmLabel: 'Leave test',
        cancelLabel: 'Keep going',
        onConfirm: function () {
          stopTimer();
          state.questions = [];
          state.answers = [];
          state.submitted = false;
          showScreen('screen-bank');
          renderBank('all');
        }
      });
      return;
    }
    showScreen('screen-bank');
    renderBank('all');
  }

  /* ------------------------------------------------------------ test flow */

  function answeredCount() {
    return state.answers.filter(function (a) { return a !== null && a !== undefined; }).length;
  }

  function startTest() {
    state.questions = shuffle(QUIZ_QUESTIONS).slice(0, TEST_SIZE);
    state.answers = new Array(state.questions.length).fill(null);
    state.index = 0;
    state.remaining = TEST_SECONDS;
    state.submitted = false;
    state.result = null;

    closeModal();
    els.modal.hidden = true;
    document.body.classList.remove('modal-open');

    buildNavigator();
    renderQuestion();
    updateProgress();
    updateTimerDisplay();
    startTimer();
    showScreen('screen-quiz');
    els.timer.classList.remove('is-low');
  }

  function startTimer() {
    stopTimer();
    const startedAt = Date.now();
    const startingRemaining = state.remaining;

    state.timerId = window.setInterval(function () {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      state.remaining = startingRemaining - elapsed;
      updateTimerDisplay();

      if (state.remaining <= 0) {
        stopTimer();
        state.remaining = 0;
        updateTimerDisplay();
        submitTest(true);
      }
    }, 250);
  }

  function stopTimer() {
    if (state.timerId !== null) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function updateTimerDisplay() {
    els.timerText.textContent = formatClock(state.remaining);
    els.timer.classList.toggle('is-low', state.remaining <= 120);
  }

  function buildNavigator() {
    els.navGrid.innerHTML = state.questions.map(function (q, i) {
      return '<button type="button" data-jump="' + i + '" aria-label="Go to question ' + (i + 1) + '">' + (i + 1) + '</button>';
    }).join('');
  }

  function syncNavigator() {
    $$('#nav-grid button').forEach(function (btn) {
      const i = Number(btn.dataset.jump);
      btn.classList.toggle('answered', state.answers[i] !== null);
      btn.classList.toggle('current', i === state.index);
      btn.setAttribute('aria-current', i === state.index ? 'true' : 'false');
    });
  }

  function renderQuestion() {
    const q = state.questions[state.index];
    if (!q) return;

    const chosen = state.answers[state.index];

    els.qCurrent.textContent = String(state.index + 1);
    els.qTotal.textContent = String(state.questions.length);
    els.qCategory.textContent = q.category;
    els.questionText.textContent = q.question;

    els.options.innerHTML = q.options.map(function (opt, i) {
      const selected = chosen === i;
      return (
        '<button type="button" class="option' + (selected ? ' is-selected' : '') + '"' +
          ' role="radio" aria-checked="' + (selected ? 'true' : 'false') + '"' +
          ' data-option="' + i + '">' +
          '<span class="opt-key" aria-hidden="true">' + LETTERS[i] + '</span>' +
          '<span class="opt-text">' + escapeHtml(opt) + '</span>' +
        '</button>'
      );
    }).join('');

    els.prevBtn.disabled = state.index === 0;
    els.nextBtn.textContent = state.index === state.questions.length - 1 ? 'Review & submit' : 'Next';
    if (state.index === state.questions.length - 1) {
      els.nextBtn.innerHTML = 'Review &amp; submit';
    } else {
      els.nextBtn.innerHTML = 'Next <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path></svg>';
    }

    syncNavigator();
    updateProgress();
  }

  function selectOption(i) {
    if (state.submitted) return;
    state.answers[state.index] = i;
    $$('#options .option').forEach(function (btn) {
      const isSel = Number(btn.dataset.option) === i;
      btn.classList.toggle('is-selected', isSel);
      btn.setAttribute('aria-checked', isSel ? 'true' : 'false');
    });
    syncNavigator();
    updateProgress();
  }

  function goTo(index) {
    if (index < 0 || index >= state.questions.length) return;
    state.index = index;
    renderQuestion();
  }

  function updateProgress() {
    const total = state.questions.length || TEST_SIZE;
    const answered = answeredCount();
    const percent = Math.round((answered / total) * 100);

    els.answeredCount.textContent = String(answered);
    els.sidePercent.textContent = percent + '%';
    els.progressFill.style.width = percent + '%';
    els.questionCount.innerHTML = 'Answered <strong>' + answered + '</strong> of ' + total;
  }

  /* ------------------------------------------------------------ submit + results */

  function submitTest(auto) {
    if (state.submitted) return;
    stopTimer();
    state.submitted = true;

    const details = state.questions.map(function (q, i) {
      const given = state.answers[i];
      let status = 'blank';
      if (given !== null) {
        status = given === q.answer ? 'correct' : 'wrong';
      }
      return { question: q, given: given, status: status };
    });

    const correct = details.filter(function (d) { return d.status === 'correct'; }).length;
    const wrong = details.filter(function (d) { return d.status === 'wrong'; }).length;
    const blank = details.filter(function (d) { return d.status === 'blank'; }).length;

    state.result = {
      details: details,
      correct: correct,
      wrong: wrong,
      blank: blank,
      total: details.length,
      timeUsed: TEST_SECONDS - Math.max(0, state.remaining),
      autoSubmitted: !!auto
    };

    saveBest(correct);
    renderBest();
    renderResults();
    showScreen('screen-result');
  }

  function gradeFor(percent) {
    if (percent >= 90) return { label: 'Outstanding — near perfect', ring: 'var(--accent)' };
    if (percent >= 75) return { label: 'Excellent work', ring: 'var(--accent)' };
    if (percent >= 60) return { label: 'Good — a solid pass', ring: 'var(--violet)' };
    if (percent >= 40) return { label: 'Getting there — keep practising', ring: 'var(--amber)' };
    return { label: 'Keep practising', ring: 'var(--danger)' };
  }

  function renderResults() {
    const r = state.result;
    if (!r) return;

    const percent = Math.round((r.correct / r.total) * 100);
    const answered = r.correct + r.wrong;
    const accuracy = answered ? Math.round((r.correct / answered) * 100) : 0;
    const grade = gradeFor(percent);

    els.scorePercent.textContent = percent + '%';
    els.scoreFraction.textContent = r.correct + ' / ' + r.total;
    els.tileCorrect.textContent = String(r.correct);
    els.tileWrong.textContent = String(r.wrong);
    els.tileSkip.textContent = String(r.blank);
    els.resultTime.textContent = formatClock(r.timeUsed);
    els.resultAccuracy.textContent = accuracy + '%';
    els.scoreGrade.textContent = grade.label;
    els.scoreGrade.style.color = grade.ring;

    els.resultVerdictPill.innerHTML = '<span class="dot" aria-hidden="true"></span>' +
      (r.autoSubmitted ? 'Time expired' : 'Result');

    els.resultSummary.textContent = r.autoSubmitted
      ? 'Time ran out, so your answers were submitted automatically. You scored ' + r.correct + ' out of ' + r.total + '.'
      : 'You answered ' + answered + ' of ' + r.total + ' questions and scored ' + r.correct + '. Review the answers to see what to revisit.';

    // score ring
    const offset = RING_CIRCUMFERENCE * (1 - r.correct / r.total);
    els.ringFg.style.stroke = grade.ring;
    els.ringFg.style.strokeDasharray = String(RING_CIRCUMFERENCE);
    els.ringFg.style.strokeDashoffset = String(RING_CIRCUMFERENCE);
    window.requestAnimationFrame(function () {
      els.ringFg.style.strokeDashoffset = String(offset);
    });

    // category breakdown
    const byCat = {};
    r.details.forEach(function (d) {
      const name = d.question.category;
      if (!byCat[name]) byCat[name] = { correct: 0, total: 0 };
      byCat[name].total += 1;
      if (d.status === 'correct') byCat[name].correct += 1;
    });

    els.breakdown.innerHTML = Object.keys(byCat).map(function (name) {
      const c = byCat[name];
      const pct = Math.round((c.correct / c.total) * 100);
      return (
        '<div class="bd-row">' +
          '<span class="bd-name">' + escapeHtml(name) + '</span>' +
          '<span class="bd-track"><span class="bd-fill" style="width:' + pct + '%"></span></span>' +
          '<span class="bd-score">' + c.correct + '/' + c.total + '</span>' +
        '</div>'
      );
    }).join('');
  }

  /* ------------------------------------------------------------ review */

  let reviewFilter = 'all';

  function renderReview() {
    const r = state.result;
    if (!r) return;

    const items = r.details.filter(function (d) {
      if (reviewFilter === 'all') return true;
      return d.status === reviewFilter;
    });

    els.reviewSummary.textContent = items.length === 0
      ? 'Nothing to show for this filter.'
      : items.length + ' question' + (items.length === 1 ? '' : 's') +
        ' · ' + r.correct + ' correct, ' + r.wrong + ' wrong, ' + r.blank + ' unanswered';

    if (items.length === 0) {
      els.reviewList.innerHTML = '<p class="muted">No questions match this filter — great sign!</p>';
      return;
    }

    els.reviewList.innerHTML = items.map(function (d) {
      const q = d.question;
      const position = state.questions.indexOf(q) + 1;
      const statusLabel = d.status === 'correct' ? 'Correct' : d.status === 'wrong' ? 'Wrong' : 'Unanswered';
      const givenText = d.given === null ? 'Not answered' : LETTERS[d.given] + '. ' + q.options[d.given];
      const correctText = LETTERS[q.answer] + '. ' + q.options[q.answer];

      return (
        '<article class="review-item is-' + d.status + '">' +
          '<div class="review-top">' +
            '<span class="review-index">Question ' + position + '</span>' +
            '<span class="tag ' + d.status + '">' + statusLabel + '</span>' +
            '<span class="tag cat">' + escapeHtml(q.category) + '</span>' +
          '</div>' +
          '<p class="review-q">' + escapeHtml(q.question) + '</p>' +
          '<dl class="review-answers">' +
            '<div><dt>Your answer</dt><dd class="' + (d.status === 'correct' ? 'good' : 'bad') + '">' + escapeHtml(givenText) + '</dd></div>' +
            '<div><dt>Correct</dt><dd class="good">' + escapeHtml(correctText) + '</dd></div>' +
          '</dl>' +
        '</article>'
      );
    }).join('');
  }

  /* ------------------------------------------------------------ wiring */

  function cacheElements() {
    els.catGrid = $('#cat-grid');
    els.bestBox = $('#best-score-box');
    els.bestValue = $('#best-score-value');

    els.qCurrent = $('#q-current');
    els.qTotal = $('#q-total');
    els.qCategory = $('#q-category');
    els.questionText = $('#question-text');
    els.questionCount = $('#question-count');
    els.answeredCount = $('#answered-count');
    els.options = $('#options');
    els.progressFill = $('#progress-fill');
    els.timer = $('#timer');
    els.timerText = $('#timer-text');
    els.navGrid = $('#nav-grid');
    els.sidePercent = $('#side-percent');
    els.prevBtn = $('#prev-btn');
    els.nextBtn = $('#next-btn');
    els.clearBtn = $('#clear-btn');

    els.scorePercent = $('#score-percent');
    els.scoreFraction = $('#score-fraction');
    els.tileCorrect = $('#tile-correct');
    els.tileWrong = $('#tile-wrong');
    els.tileSkip = $('#tile-skip');
    els.resultTime = $('#result-time');
    els.resultAccuracy = $('#result-accuracy');
    els.scoreGrade = $('#score-grade');
    els.resultSummary = $('#result-summary');
    els.resultVerdictPill = $('#result-verdict-pill');
    els.ringFg = $('#ring-fg');
    els.breakdown = $('#breakdown');

    els.reviewList = $('#review-list');
    els.reviewSummary = $('#review-summary');

    els.bankList = $('#bank-list');
    els.bankCount = $('#bank-count');

    els.modal = $('#modal');
    els.modalTitle = $('#modal-title');
    els.modalText = $('#modal-text');
    els.modalConfirm = $('#modal-confirm');
    els.modalCancel = $('#modal-cancel');
  }

  function bindEvents() {
    $('#start-test-btn').addEventListener('click', startTest);
    $('#nav-start').addEventListener('click', startTest);
    $('#retry-btn').addEventListener('click', startTest);
    $('#review-retry-btn').addEventListener('click', startTest);

    $('#browse-all-btn').addEventListener('click', openBank);
    $('#nav-browse-all').addEventListener('click', openBank);
    $('#bank-start-btn').addEventListener('click', startTest);

    $$('[data-home]').forEach(function (btn) {
      btn.addEventListener('click', function (evt) {
        evt.preventDefault();
        goHome();
      });
    });

    $('#home-btn').addEventListener('click', goHome);

    // options (event delegation)
    els.options.addEventListener('click', function (evt) {
      const btn = evt.target.closest('.option');
      if (!btn) return;
      selectOption(Number(btn.dataset.option));
    });

    els.navGrid.addEventListener('click', function (evt) {
      const btn = evt.target.closest('button[data-jump]');
      if (!btn) return;
      goTo(Number(btn.dataset.jump));
    });

    els.prevBtn.addEventListener('click', function () { goTo(state.index - 1); });

    els.nextBtn.addEventListener('click', function () {
      if (state.index === state.questions.length - 1) {
        requestSubmit();
      } else {
        goTo(state.index + 1);
      }
    });

    els.clearBtn.addEventListener('click', function () {
      if (state.submitted) return;
      state.answers[state.index] = null;
      renderQuestion();
    });

    $('#submit-btn').addEventListener('click', requestSubmit);

    $('#quit-btn').addEventListener('click', function () {
      openModal({
        title: 'Exit without submitting?',
        text: 'This attempt will not be scored or saved.',
        confirmLabel: 'Exit test',
        cancelLabel: 'Keep going',
        onConfirm: function () {
          stopTimer();
          state.questions = [];
          state.answers = [];
          showScreen('screen-home');
        }
      });
    });

    $('#review-btn').addEventListener('click', function () {
      reviewFilter = 'all';
      $$('#screen-review .chip').forEach(function (chip) {
        chip.classList.toggle('is-active', chip.dataset.filter === 'all');
      });
      renderReview();
      showScreen('screen-review');
    });

    $('#review-back-btn').addEventListener('click', function () {
      renderResults();
      showScreen('screen-result');
    });

    $$('#screen-review .chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        reviewFilter = chip.dataset.filter;
        $$('#screen-review .chip').forEach(function (c) {
          c.classList.toggle('is-active', c === chip);
        });
        renderReview();
      });
    });

    $$('#bank-filters .chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        renderBank(chip.dataset.category);
      });
    });

    els.modalCancel.addEventListener('click', closeModal);
    els.modalConfirm.addEventListener('click', function () {
      const handler = modalHandler;
      closeModal();
      if (handler) handler();
    });
    els.modal.addEventListener('click', function (evt) {
      if (evt.target === els.modal) closeModal();
    });

    document.addEventListener('keydown', function (evt) {
      if (!els.modal.hidden) {
        if (evt.key === 'Escape') closeModal();
        return;
      }
      if (!document.getElementById('screen-quiz').classList.contains('is-active')) return;
      if (state.submitted) return;

      const tag = (evt.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (/^[1-4]$/.test(evt.key)) {
        evt.preventDefault();
        const index = Number(evt.key) - 1;
        if (index < state.questions[state.index].options.length) selectOption(index);
      } else if (evt.key === 'ArrowLeft') {
        evt.preventDefault();
        goTo(state.index - 1);
      } else if (evt.key === 'ArrowRight') {
        evt.preventDefault();
        goTo(state.index + 1);
      }
    });
  }

  function requestSubmit() {
    const blank = state.questions.length - answeredCount();
    if (blank > 0) {
      openModal({
        title: 'Submit with ' + blank + ' unanswered?',
        text: 'Unanswered questions are scored as incorrect. You can go back and finish them first.',
        confirmLabel: 'Submit anyway',
        cancelLabel: 'Keep answering',
        onConfirm: function () { submitTest(false); }
      });
    } else {
      openModal({
        title: 'Submit your test?',
        text: 'All ' + state.questions.length + ' questions are answered. You cannot change answers after submitting.',
        confirmLabel: 'Submit',
        cancelLabel: 'Keep going',
        onConfirm: function () { submitTest(false); }
      });
    }
  }

  /* ------------------------------------------------------------ init */

  function applyHash() {
    // Deep links: #quiz / #bank / #result / #home, or ?view=quiz for simple links
    let view = '';
    try {
      const params = new URLSearchParams(window.location.search);
      view = (params.get('view') || '').toLowerCase();
    } catch (err) {
      view = '';
    }
    if (!view) {
      view = (window.location.hash || '').replace('#', '').toLowerCase();
    }

    if (view === 'quiz') {
      startTest();
    } else if (view === 'bank') {
      showScreen('screen-bank');
      renderBank('all');
    } else if (view === 'result' && state.result) {
      renderResults();
      showScreen('screen-result');
    } else if (view === 'home') {
      showScreen('screen-home');
    }
  }

  function init() {
    cacheElements();

    if (typeof QUIZ_QUESTIONS === 'undefined' || !Array.isArray(QUIZ_QUESTIONS) || QUIZ_QUESTIONS.length === 0) {
      els.questionText.textContent = 'Question bank failed to load.';
      return;
    }

    loadBest();
    renderBest();
    renderCategories();
    bindEvents();
    applyHash();

    if (!document.querySelector('.screen.is-active')) {
      showScreen('screen-home');
    }

    window.addEventListener('hashchange', applyHash);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

# QuizCraft — 100-Question Bank, 40-Question Test

A self-contained multiple-choice quiz website built with plain **HTML, CSS and JavaScript**
(no build step, no backend). The question bank holds **100 questions**; each test serves
**40 of them at random**. Every question has exactly **4 options** and **1 correct answer**.

## 🎯 Project Overview

QuizCraft is a timed knowledge test. Visitors start a test, answer up to 40 questions drawn
at random from the 100-question bank, submit, and get an instant score with a full answer
review. Everything runs in the browser and needs no server.

## ✨ Features (implemented)

1. **100-question bank** — 100 unique questions, each with exactly 4 options and 1 correct answer.
2. **40-question tests** — every attempt shuffles the bank and deals a fresh random set of 40.
3. **Timed test** — 30-minute countdown; auto-submits when time runs out. Timer turns red in the last 2 minutes.
4. **Free navigation** — jump between questions with Previous / Next or the 5-column question navigator grid.
5. **Change or clear answers** — before submitting, every answer can be changed or cleared.
6. **Progress tracking** — answered count, progress bar and a live percentage in the sidebar.
7. **Instant scoring** — score ring, percentage, grade label, correct / wrong / unanswered tiles.
8. **Category breakdown** — per-category performance bars (correct vs. total).
9. **Full answer review** — every question with your answer and the correct answer, filterable by All / Wrong / Unanswered / Correct.
10. **Question bank browser** — read all 100 questions with their correct answers, filterable by category.
11. **Personal best** — best score saved in `localStorage` and shown on the home screen.
12. **Keyboard support** — `1`–`4` select an option, `←` / `→` move between questions.
13. **Confirm dialogs** — warns before submitting with unanswered questions or leaving an attempt.
14. **Responsive + accessible** — mobile-first layout, semantic landmarks, ARIA roles on options and navigator, skip link, visible focus states, reduced-motion support.

## 📁 Project Structure

```
├── index.html          # All screens: home, quiz, result, review, question bank
├── css/
│   └── style.css       # Design system + responsive layout
├── js/
│   ├── questions.js    # QUIZ_QUESTIONS — the 100-question bank (data only)
│   └── app.js          # Quiz engine: draw, timer, scoring, results, review
├── legacy/             # Previous "Legal Advisory" site, preserved and unlinked
│   ├── index.html
│   ├── style.css
│   └── main.js
└── README.md
```

## 🧩 Question Bank Format

`js/questions.js` exports a single array, `QUIZ_QUESTIONS`. Each entry has this shape:

```js
{
  id: 1,                              // unique, 1–100
  category: "Science",                // Science | History | Geography | Technology | General Knowledge
  question: "What is the chemical symbol for gold?",
  options: ["Au", "Ag", "Gd", "Go"],  // exactly 4 options
  answer: 0                           // 0-based index of the correct option (here: "Au")
}
```

`answer` is the **0-based index** into `options` — `0` = A, `1` = B, `2` = C, `3` = D.

### Category distribution (100 total)

| Category | Questions |
| --- | --- |
| Science | 25 |
| History | 20 |
| Geography | 20 |
| Technology | 15 |
| General Knowledge | 20 |

To add or edit questions, edit `js/questions.js` only. Keep `id` values unique and keep
exactly 4 options with one valid `answer` index — the engine sizes tests automatically and
the home screen counts categories from the data.

## ⚙️ How It Works

- **Draw** — `shuffle(QUIZ_QUESTIONS).slice(0, 40)` picks the questions; option order is
  fixed per question so the bank stays authoritative.
- **Answer** — selecting an option stores its index in `state.answers`; only the final
  selection counts.
- **Score** — each answered question is `correct` or `wrong`; unset ones are `blank`.
  Score = correct out of 40. Accuracy = correct ÷ answered.
- **Timer** — a 250 ms interval compares elapsed wall-clock time against a 30-minute budget,
  so it stays accurate even if the tab throttles the timer.
- **Persistence** — only the personal best score is stored (`localStorage` key
  `quizcraft.best.v1`). Attempts themselves are not persisted.

## 🚀 Getting Started

Open `index.html` in any modern browser. No install, build or server required.

### Deep links

Add a query string or hash to open a screen directly:

| Link | Opens |
| --- | --- |
| `index.html` | Home screen |
| `index.html?view=quiz` or `index.html#quiz` | Starts a new test immediately |
| `index.html?view=bank` or `index.html#bank` | Question bank browser |
| `index.html?view=home` | Home screen |

## 🎨 Design

- **Palette** — deep indigo canvas (`#0b1020`), mint accent (`#35e0a1`), violet secondary
  (`#7c8cff`), plus red / amber for wrong and unanswered states.
- **Type** — Sora for display headings, Plus Jakarta Sans for body text.
- **Layout** — CSS Grid throughout; single-column stacked layout on phones, two-column
  quiz layout (questions + sticky navigator) on desktop.
- **Motion** — subtle screen fade-in, card lift on hover, animated score ring; all disabled
  under `prefers-reduced-motion`.

### Responsive Breakpoints

- **≥ 981px** — two-column quiz layout, sticky question navigator, side-by-side results.
- **721–980px** — single-column quiz layout, navigator moves below the question card.
- **≤ 720px** — compact header, full-width hero buttons, 2×2 stat grid, 8-column navigator,
  3-across result tiles, stacked review header.
- **≤ 420px** — 6-column navigator, tighter option padding.

## 📊 Screens

1. **Home** — headline, start / browse buttons, key stats, "How it works", category cards.
2. **Quiz** — question card, 4 options, Previous / Clear / Next, timer, navigator, Submit.
3. **Result** — score ring, grade, tiles (correct / wrong / unanswered), category breakdown.
4. **Review** — every question with your answer vs. the correct answer, with status filters.
5. **Question bank** — all 100 questions and answers, filterable by category.

## 💾 Data & Storage

| Item | Where |
| --- | --- |
| Question bank | `js/questions.js` (static data) |
| Personal best score | `localStorage` → `quizcraft.best.v1` |
| Attempts / answers | In memory only (`state` in `js/app.js`) |

No table schemas, no `fetch()` calls and no external APIs are used. All progress is
client-side and private to the visitor's browser.

## ℹ️ Notes

- The earlier "Legal Advisory Services" site is preserved in `legacy/` for reference and is
  not linked from the quiz. `legacy/index.html` uses the flat `style.css` / `main.js` paths
  and depends on the old Table API, so it is kept as read-only archive rather than a working page.
- Correct answers live in `js/questions.js`, which is readable by anyone who opens the file.
  That is fine for a practice quiz, but a graded assessment would need server-side checking.

## 🔮 Recommended Next Steps

1. **Save attempt history** — store past attempts (score, date, per-category results) to chart progress over time.
2. **Configurable test size** — let visitors choose 10 / 20 / 40 questions or a single category.
3. **Question bank editor** — a small form that adds questions to `localStorage` on top of the static bank.
4. **Per-question explanations** — add an `explanation` field to teach why an answer is right.
5. **Shareable results** — encode the score in the URL so results can be shared.

## 🛠 Technologies Used

- HTML5 (semantic landmarks, ARIA)
- CSS3 (Grid, Flexbox, custom properties, transitions)
- Modern vanilla JavaScript (ES6+, IIFE-scoped engine, no dependencies)
- Google Fonts (Sora, Plus Jakarta Sans)

## 📄 License

Demo project for a browser-based multiple-choice quiz.
# quiz
# quiz
# quiz

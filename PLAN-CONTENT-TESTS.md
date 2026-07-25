# Content checks to port upstream (Python)

## Context

`franksbooklog.com` renders its markdown with [Sätteri](https://satteri.bruits.org/), replacing
a hand-rolled remark/rehype pipeline. The two engines disagree in one way that matters here:

- **remark + `rehype-raw`** reparsed all raw HTML and re-serialized it, so malformed tags were
  silently repaired.
- **`remark-smartypants`** chose each quote's direction from the characters immediately around
  it, one text node at a time, so a mistyped quote still came out looking plausible.

Sätteri does neither. It re-emits raw HTML **verbatim** and pairs quotes with a real open/close
state machine. That's better — mistakes surface instead of hiding — but it means defects that
used to be invisible now reach the page.

The site has these checks as vitest specs
(`src/collections/markdown/contentIntegrity.spec.ts`), which is late: the content is generated
by a separate Python repo. Catching them at generation time is strictly better. This document
specifies the rules precisely enough to reimplement, including what _not_ to flag.

Every rule below was measured against all 286 current content files, so the "expected result"
figures double as acceptance criteria for the Python implementation.

---

## The rendering contract

Useful background for whatever generates the markdown. The site pipeline:

| Source             | Renders as           | Note                                           |
| ------------------ | -------------------- | ---------------------------------------------- |
| `--`               | `—` (em dash)        | custom plugin; `---` and `----` are left alone |
| `...`              | `…`                  | native                                         |
| `"` `'`            | `“” ‘’`              | native, paired across inline elements          |
| raw HTML           | **verbatim**         | not reparsed — tags must be well-formed        |
| `<!-- comment -->` | preserved in output  |                                                |
| frontmatter        | stripped from output | must be YAML, fence on line 1                  |
| `[^1]` + `[^1]:`   | GFM footnotes        | a definition with no reference renders nothing |

Two site-specific conventions:

- `<span data-title-id="…">Title</span>` is rewritten to a review link at render time (or
  unwrapped to plain text when the title has no review yet). `<span data-imdb-id="…">` is left
  as-is.
- A review's excerpt is its `synopsis` frontmatter if non-blank, otherwise **the first
  paragraph of the body**. Blocks _before_ the first paragraph are kept.

---

## Rule 1 — No smart quotes in markdown source

**Required.** Expected result on current content: **0 violations.**

Frank only ever types `'` and `"`, letting smart punctuation choose the glyph. So any curly
quote in the source arrived by copy/paste — and when this check was introduced it found **five
that were simply wrong**:

| File                        | Was                   | Should be             |
| --------------------------- | --------------------- | --------------------- |
| `brother-iron-sister-steel` | `spring of ‘63`       | `'63`                 |
| `carrie`                    | `‘Salem’s Lot`        | `'Salem's Lot`        |
| `coffin`                    | `There‘s`             | `There's`             |
| `sacculina`                 | `Keep ‘er coming`     | `Keep 'er coming`     |
| `the-shining`               | `it‘s`, `It‘s Jack‘s` | `it's`, `It's Jack's` |

Each had an **opening** quote where an apostrophe belonged. They had been live on the site.

Straight quotes render correctly in every one of those positions, including leading elisions —
`'63` renders `’63` and `'Salem's Lot` renders `’Salem’s Lot`. There is no case in this corpus
where an explicit curly quote in the source is necessary.

```python
SMART_QUOTES = {"‘", "’", "“", "”"}  # ‘ ’ “ ”

def find_smart_quotes(source: str) -> list[tuple[int, str]]:
    """Return (line_number, line) for each line containing a curly quote."""
    return [
        (i, line)
        for i, line in enumerate(source.split("\n"), start=1)
        if any(ch in line for ch in SMART_QUOTES)
    ]
```

Applies to the **whole file**, frontmatter included — `synopsis` and `editionNotes` are
rendered through the same pipeline.

---

## Rule 2 — Balanced double quotes within each paragraph

**Required.** Expected result on current content: **0 violations.**

Rule 1 guarantees the source is all-straight, but not that quotations are complete. A
quotation missing its closing `"` still renders as an unclosed `“`. That is how a missing quote
in `fright-night`'s film-dialogue passage went unnoticed:

```markdown
> "We've been going together for almost a year and all I ever hear is 'Charley, stop it!'
```

The site checks this on rendered output. The portable equivalent — **an even number of straight
double quotes per paragraph** — was verified to give the same answer with zero false positives
across the corpus.

Three things must be stripped first, or you will get false positives:

1. **Frontmatter** — delimiters and YAML values.
2. **Code** — fenced blocks and inline spans. Smart punctuation does not apply inside code, so
   quotes there are literal and need not balance.
3. **HTML tags** — `<span data-title-id="x">` contributes two straight quotes that are
   attribute syntax, not prose.

````python
import re

FRONTMATTER = re.compile(r"\A---\n.*?\n---\n", re.DOTALL)
FENCED_CODE = re.compile(r"```.*?```", re.DOTALL)
INLINE_CODE = re.compile(r"`[^`\n]*`")
HTML_TAG = re.compile(r"<[^>]*>")
PARAGRAPH_BREAK = re.compile(r"\n\s*\n")

def find_unbalanced_quotes(source: str) -> list[str]:
    body = FRONTMATTER.sub("", source)
    offenders = []
    for para in PARAGRAPH_BREAK.split(body):
        text = HTML_TAG.sub("", INLINE_CODE.sub("", FENCED_CODE.sub("", para)))
        if text.count('"') % 2 != 0:
            offenders.append(para.strip())
    return offenders
````

**Do not** try to balance single quotes. `'` is indistinguishable from an apostrophe
(`it's`, `'Salem's Lot`, `'63`), so any such check is pure noise.

**Nesting is fine** — `"He said 'hello' to me."` is correct and common. Only the outer double
quotes are counted, and they balance.

### Two nesting shapes that do not survive straight quotes

Both were found in the corpus and had to be rewritten. Worth rejecting at generation time:

- **Double quotes nested inside double quotes.** `"outer "inner" outer"` cannot be paired by
  any algorithm. Use single quotes for the inner quotation: `"outer 'inner' outer"`.
  (Rule 2 does not catch this — the count is even. Consider a separate check for a `"`
  immediately preceded by a word character _and_ followed by one.)
- **A space between nested quote marks**, e.g. `" 'Get your ass to a meeting,' "`. The trailing
  `"` follows a space and so reads as _opening_. Write it closed up: `"'Get your ass…,'"`.

---

## Rule 3 — Balanced `<span>` tags

**Recommended.** Expected result on current content: **0 violations.**

`rehype-raw` used to reparse and auto-close malformed HTML. Sätteri emits it verbatim, so this
typo in `on-writing-by-stephen-king.md` reached the page as an unclosed element:

```markdown
<span data-title-id="the-dead-zone-by-stephen-king">_The Dead Zone_<span>
```

The closing tag was `<span>` rather than `</span>`. Astro's parser now catches unclosed tags
downstream, so this is a convenience rather than the only line of defence — but the generator
is where the tag is written, so it is the cheapest place to check.

```python
def find_unbalanced_spans(source: str) -> tuple[int, int]:
    opens = len(re.findall(r"<span\b", source))
    closes = len(re.findall(r"</span>", source))
    return (opens, closes)  # flag when they differ
```

Only `<span>` and `<br>` appear in this corpus, and `<br>` is void. If more tags get
introduced, generalise accordingly.

---

## Rule 4 — Frontmatter fence opens on line 1

**Required.** Expected result on current content: **0 violations.**

Sätteri requires the `---` fence to open on the first line. The regex parser it replaced
tolerated a leading BOM or blank lines; that tolerance is gone. A file that violates this loses
its frontmatter entirely, and the site's loader raises `Frontmatter not found in <path>`.

```python
def has_valid_frontmatter_start(source: str) -> bool:
    return source.startswith("---\n")  # no BOM, no leading blank line
```

Reject a UTF-8 BOM explicitly if the generator ever writes one — `source.startswith("﻿")`.

---

## Rule 5 — No exotic whitespace

**Recommended.** Expected result on current content: **16 occurrences in 2 files** — decide
whether to fix these before turning the rule on.

Copy/paste brings in more than quotes. A U+200A HAIR SPACE in `doctor-sleep` was separating
nested quote marks, which (a) is invisible in review and (b) broke quote pairing once the
quotes were normalized.

Currently remaining: **16 × U+00A0 NO-BREAK SPACE** in
`fright-night-origins-by-tom-holland-a-jack-ulrich.md` and `hawk-mountain-by-conner-habib.md`.
These are harmless to rendering, but see Rule 6 for why they are worth removing anyway.

```python
import unicodedata

def find_exotic_whitespace(source: str) -> list[tuple[int, str]]:
    """Any whitespace or formatting character that isn't space, tab, or newline."""
    return [
        (i, f"U+{ord(ch):04X} {unicodedata.name(ch, '?')}")
        for i, ch in enumerate(source)
        if ch not in " \t\n" and unicodedata.category(ch) in {"Zs", "Zl", "Zp", "Cf"}
    ]
```

---

## Rule 6 — Ellipsis style

**Optional — needs a decision.** Current content has three spots that are inconsistent:

| File                                       | Line | Contains                                   |
| ------------------------------------------ | ---- | ------------------------------------------ |
| `fast-forward-by-stephen-morris`           | 27   | `thought . . .` (spaced)                   |
| `hawk-mountain-by-conner-habib`            | 35   | `"You're . . ."` (spaced, **with U+00A0**) |
| `fright-night-by-john-skipp-craig-spector` | 44   | `Fright Night....` (four dots)             |

Elsewhere the corpus uses `...` (15 occurrences) and a literal `…` (4).

Under the old pipeline `remark-smartypants` collapsed all of these to `…`. Sätteri only
converts exactly three dots, so `. . .` and `....` now render as typed. That may be _desirable_
— all three are inside quotations from books, where the spaced ellipsis is the printed style.

Note that hawk-mountain's spaces are **U+00A0**, so a naive `grep '\. \. \.'` will not find it.
Rule 5 is what surfaces this one.

If the decision is "always `...`", the check is a search for `\.\s*\.\s*\.` that isn't exactly
`...`.

---

## Not a rule: literal em and en dashes

Informational. The corpus contains **106 literal `—`** and **11 literal `–`** characters,
almost certainly copy/pasted from quoted book passages, alongside 182 uses of `--`.

These render fine — Sätteri passes them through untouched, and `--` becomes `—` anyway, so
source and output agree. Flagging them would be consistent with the "only type ASCII
punctuation" convention behind Rule 1, but unlike the curly quotes **none of them are wrong**.
Left alone deliberately; noted here so it is a decision rather than an oversight.

---

## Suggested test shape

One test per rule, collecting **all** offenders and asserting the list is empty, rather than
failing on the first. When a batch of content regenerates, seeing every violation at once is
what makes it fixable in one pass.

```python
import pytest

CONTENT_DIRS = ["pages", "readings", "reviews"]

def markdown_files(root):
    for directory in CONTENT_DIRS:
        yield from sorted((root / directory).glob("*.md"))

def test_no_smart_quotes(content_root):
    offenders = [
        f"{path.name}:{line_no}  {line.strip()[:120]}"
        for path in markdown_files(content_root)
        for line_no, line in find_smart_quotes(path.read_text(encoding="utf8"))
    ]
    assert offenders == []
```

Whatever you build, **verify each check actually fails** by reintroducing one of the real
defects above. A check that cannot fail is worse than no check, because it reads as coverage.
Each rule in this document was validated that way before being trusted.

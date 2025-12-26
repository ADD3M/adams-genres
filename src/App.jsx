import React, { useMemo, useState } from "react";

// Electric-guitar-friendly genres & subgenres.
// Edit/extend this list whenever you want.
const DATA = {
  Rock: [
    "Classic Rock",
    "Hard Rock",
    "Blues Rock",
    "Garage Rock",
    "Psychedelic Rock",
    "Alternative Rock",
    "Indie Rock",
    "Post-Rock",
    "Stoner Rock",
    "Southern Rock",
  ],
  Metal: [
    "Heavy Metal",
    "Thrash Metal",
    "Death Metal",
    "Black Metal",
    "Power Metal",
    "Doom Metal",
    "Sludge Metal",
    "Groove Metal",
    "Nu Metal",
    "Metalcore",
    "Deathcore",
    "Progressive Metal",
    "Djent",
    "Symphonic Metal",
  ],
  Blues: [
    "Chicago Blues",
    "Texas Blues",
    "Delta Blues",
    "British Blues",
    "Modern Blues",
    "Blues Shuffle",
  ],
  Punk: [
    "Punk Rock",
    "Hardcore Punk",
    "Pop Punk",
    "Skate Punk",
    "Post-Punk",
    "Crust Punk",
  ],
  "Jazz/Fusion": [
    "Jazz Fusion",
    "Jazz Rock",
    "Funk Fusion",
    "Modern Jazz Guitar",
    "Gypsy Jazz (Electric)",
  ],
  Funk: ["Classic Funk", "Funk Rock", "P-Funk", "Funk Metal", "Neo-Funk"],
  "Pop/Alt": [
    "Pop Rock",
    "Synth-Pop Guitar",
    "Dream Pop",
    "Indie Pop",
    "Electropop Guitar",
  ],
  "Country/Americana": [
    "Country Rock",
    "Americana",
    "Modern Country Lead",
    "Outlaw Country",
    "Rockabilly",
  ],
  "Ambient/Experimental": [
    "Ambient Guitar",
    "Shoegaze",
    "Noise Rock",
    "Math Rock",
    "Experimental Rock",
  ],
};

const randInt = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[randInt(arr.length)];

function SparkIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
      aria-hidden="true"
    >
      <path
        d="M12 2l1.2 6.2L20 12l-6.8 3.8L12 22l-1.2-6.2L4 12l6.8-3.8L12 2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function App() {
  const genres = useMemo(() => Object.keys(DATA), []);
  const [selectedGenre, setSelectedGenre] = useState("Any");
  const [history, setHistory] = useState([]); // newest first
  const [current, setCurrent] = useState({ genre: "—", sub: "—" });
  const [spin, setSpin] = useState(false);

  function reroll() {
    setSpin(true);
    const genre = selectedGenre === "Any" ? pick(genres) : selectedGenre;
    const sub = pick(DATA[genre]);

    const next = { genre, sub, at: new Date().toISOString() };
    setTimeout(() => {
      setCurrent(next);
      setHistory((h) => [next, ...h].slice(0, 12));
      setSpin(false);
    }, 120);
  }

  async function copyCurrent() {
    const text = `${current.genre} — ${current.sub}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Mobile browsers can be picky; ignore.
    }
  }

  const pill = (text) => (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/90">
      {text}
    </span>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 text-neutral-50">
      <div className="mx-auto max-w-3xl p-6">
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-2 shadow">
              <SparkIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                ADAMS GENRES
              </h1>
              <p className="mt-1 text-sm text-white/70">
                Reroll a genre + subgenre prompt that actually works on electric
                guitar.
              </p>
            </div>
          </div>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full">
              <label className="text-sm text-white/70">
                Lock a genre (optional)
              </label>
              <select
                className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950/60 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/25"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="Any">Any</option>
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-white/50">
                “Any” = chaos. Locking a genre = direction.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={reroll}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-2.5 font-semibold text-neutral-950 shadow hover:opacity-90 active:opacity-80"
              >
                <span className={spin ? "animate-spin" : ""}>⟲</span>
                Reroll
              </button>
              <button
                onClick={copyCurrent}
                className="rounded-2xl border border-white/15 bg-transparent px-5 py-2.5 font-medium text-white hover:bg-white/5"
                title="Copy current result"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-neutral-950/50 p-5">
            <div className="text-sm text-white/70">Current roll</div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {pill(current.genre)}
              <span className="text-white/40">→</span>
              {pill(current.sub)}
            </div>

            <div className="mt-4 grid gap-3 text-xs text-white/55 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-white/70">Quick prompt</div>
                <div className="mt-1">Pick 2 chords + 1 riff idea.</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-white/70">Tone target</div>
                <div className="mt-1">Clean / Crunch / High gain.</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-white/70">Rhythm</div>
                <div className="mt-1">Straight / Swing / Gallop.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent rolls</h2>
            <button
              onClick={() => setHistory([])}
              className="text-sm text-white/70 hover:text-white"
            >
              Clear
            </button>
          </div>

          {history.length === 0 ? (
            <p className="mt-3 text-sm text-white/60">
              Nothing yet. Hit Reroll.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {history.map((h, idx) => (
                <li
                  key={h.at + idx}
                  className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-neutral-950/40 px-3 py-2"
                >
                  {pill(h.genre)}
                  <span className="text-white/40">→</span>
                  {pill(h.sub)}
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="mt-8 text-xs text-white/45">
          To add more genres/subgenres, edit the{" "}
          <code className="rounded bg-white/10 px-1">DATA</code> list.
        </footer>
      </div>
    </div>
  );
}

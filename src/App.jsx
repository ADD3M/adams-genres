import { useCallback, useEffect, useMemo, useState } from "react";

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

const STORAGE_KEY = "adams-genres-state-v1";
const SUGGESTIONS = {
  Rock: {
    prompt: "Pick 2 chords + 1 riff idea.",
    tone: "Clean / Crunch",
    rhythm: "Straight / Groove",
  },
  Metal: {
    prompt: "Bring the gain and palm muting.",
    tone: "High gain",
    rhythm: "Gallop / D-beat",
  },
  Blues: {
    prompt: "Keep it soulful and bluesy.",
    tone: "Clean / Overdriven",
    rhythm: "Shuffle / Slow swing",
  },
  Punk: {
    prompt: "Play fast, loud, and aggressive.",
    tone: "Bright / Raw",
    rhythm: "Straight / Driving",
  },
  "Jazz/Fusion": {
    prompt: "Stretch out with chords and lead lines.",
    tone: "Warm / Smooth",
    rhythm: "Syncopated / Fluid",
  },
  Funk: {
    prompt: "Lock into a tight groove.",
    tone: "Clean / Punchy",
    rhythm: "Funky / 16th-note",
  },
  "Pop/Alt": {
    prompt: "Keep it melodic and atmospheric.",
    tone: "Bright / Slick",
    rhythm: "Steady / Dreamy",
  },
  "Country/Americana": {
    prompt: "Play with twang and open strings.",
    tone: "Clean / Twangy",
    rhythm: "Train beat / Shuffles",
  },
  "Ambient/Experimental": {
    prompt: "Focus on texture and space.",
    tone: "Atmospheric / Reverb-drenched",
    rhythm: "Loose / Free",
  },
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
  const genres = Object.keys(DATA);
  const [selectedGenre, setSelectedGenre] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      return saved?.selectedGenre ?? "Any";
    } catch {
      return "Any";
    }
  });
  const [history, setHistory] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved?.history) ? saved.history : [];
    } catch {
      return [];
    }
  });
  const [current, setCurrent] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      return saved?.current?.genre ? saved.current : { genre: "—", sub: "—", at: null };
    } catch {
      return { genre: "—", sub: "—", at: null };
    }
  });
  const [spin, setSpin] = useState(false);
  const [toast, setToast] = useState("");

  const activeGenre = useMemo(() => {
    if (current.genre !== "—") return current.genre;
    return selectedGenre === "Any" ? genres[0] : selectedGenre;
  }, [current.genre, selectedGenre, genres]);

  const suggestion = useMemo(
    () => SUGGESTIONS[activeGenre] || SUGGESTIONS.Rock,
    [activeGenre],
  );

  const showToast = useCallback((message) => {
    setToast(message);
  }, []);

  const reroll = useCallback(
    ({ subOnly = false } = {}) => {
      if (spin) return;
      setSpin(true);

      const genre = subOnly
        ? current.genre !== "—"
          ? current.genre
          : selectedGenre === "Any"
          ? pick(genres)
          : selectedGenre
        : selectedGenre === "Any"
        ? pick(genres)
        : selectedGenre;

      const sub = pick(DATA[genre]);
      const next = { genre, sub, at: new Date().toISOString() };

      setTimeout(() => {
        setCurrent(next);
        setHistory((h) => [next, ...h].slice(0, 12));
        setSpin(false);
        showToast(subOnly ? "Rolled subgenre only" : "New roll ready");
      }, 120);
    },
    [current, selectedGenre, showToast, spin, genres],
  );

  const copyCurrent = useCallback(async () => {
    if (current.genre === "—") {
      showToast("No roll to copy");
      return;
    }

    const text = `${current.genre} — ${current.sub}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied!");
    } catch {
      showToast("Copy failed");
    }
  }, [current, showToast]);

  function restoreRoll(roll) {
    setCurrent(roll);
    showToast("Roll restored");
  }

  function clearHistory() {
    setHistory([]);
    showToast("History cleared");
  }

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ selectedGenre, history, current }),
      );
    } catch {
      // storage may be unavailable on some browsers
    }
  }, [selectedGenre, history, current]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 1600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const handleKey = (event) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target.isContentEditable
      ) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        reroll();
      }

      if (event.key.toLowerCase() === "c" && current.genre !== "—") {
        event.preventDefault();
        copyCurrent();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current.genre, copyCurrent, reroll]);

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

            <div className="flex flex-wrap gap-3">
              <button
                onClick={reroll}
                disabled={spin}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-2.5 font-semibold text-neutral-950 shadow hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className={spin ? "animate-spin" : ""}>⟲</span>
                Reroll
              </button>
              <button
                onClick={() => reroll({ subOnly: true })}
                disabled={spin}
                className="rounded-2xl border border-white/15 bg-transparent px-5 py-2.5 font-medium text-white hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reroll subgenre
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
                <div className="text-white/70">Prompt</div>
                <div className="mt-1">{suggestion.prompt}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-white/70">Tone target</div>
                <div className="mt-1">{suggestion.tone}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-white/70">Rhythm</div>
                <div className="mt-1">{suggestion.rhythm}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Recent rolls</h2>
            <button
              onClick={clearHistory}
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
                  onClick={() => restoreRoll(h)}
                  className="cursor-pointer flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-neutral-950/40 px-3 py-2 transition hover:border-white/20 hover:bg-neutral-950/60"
                  title="Restore this roll"
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

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-white/10 bg-neutral-950/95 px-4 py-2 text-sm text-white shadow-xl shadow-black/20">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

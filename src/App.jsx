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
const DEFAULT_THEME = "dark";
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

const SUGGESTION_FALLBACK = {
  prompt: "Build a riff with attitude.",
  tone: "Balanced",
  rhythm: "Whatever feels good",
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
  const [theme, setTheme] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      return saved?.theme ?? DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });
  const [selectedGenre, setSelectedGenre] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      return saved?.selectedGenre ?? "Any";
    } catch {
      return "Any";
    }
  });
  const [customGenreData, setCustomGenreData] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      return saved?.customGenreData ?? {};
    } catch {
      return {};
    }
  });
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved?.favorites) ? saved.favorites : [];
    } catch {
      return [];
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
  const [customGenreName, setCustomGenreName] = useState("");
  const [customSubgenreName, setCustomSubgenreName] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const customGenres = useMemo(
    () => Object.keys(customGenreData),
    [customGenreData],
  );

  const allGenres = useMemo(
    () => [...genres, ...customGenres],
    [genres, customGenres],
  );

  const activeGenre = useMemo(() => {
    if (current.genre !== "—") return current.genre;
    return selectedGenre === "Any" ? allGenres[0] : selectedGenre;
  }, [current.genre, selectedGenre, allGenres]);

  const availableGenres = useMemo(
    () => allGenres,
    [allGenres],
  );

  const suggestion = useMemo(
    () => SUGGESTIONS[activeGenre] || SUGGESTION_FALLBACK,
    [activeGenre],
  );

  const currentThemeClasses = theme === "light"
    ? "bg-gradient-to-b from-slate-100 via-slate-100 to-slate-200 text-slate-950"
    : "bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 text-neutral-50";

  const getGenreSubgenres = useCallback(
    (genre) => {
      const base = DATA[genre] || [];
      const customExtras = customGenreData[genre] || [];
      const merged = [...base, ...customExtras];
      return merged.length > 0 ? merged : ["Create a custom subgenre"];
    },
    [customGenreData],
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
          ? pick(availableGenres)
          : selectedGenre
        : selectedGenre === "Any"
        ? pick(availableGenres)
        : selectedGenre;

      const sub = pick(getGenreSubgenres(genre));
      const next = { genre, sub, at: new Date().toISOString() };

      setTimeout(() => {
        setCurrent(next);
        setHistory((h) => [next, ...h].slice(0, 12));
        setSpin(false);
        showToast(subOnly ? "Rolled subgenre only" : "New roll ready");
      }, 120);
    },
    [current, selectedGenre, showToast, spin, availableGenres, getGenreSubgenres],
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

  const shareCurrent = useCallback(async () => {
    if (current.genre === "—") {
      showToast("No roll to share");
      return;
    }

    const text = `Practice prompt: ${current.genre} — ${current.sub}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Adams Genres prompt",
          text,
        });
        showToast("Shared!");
        return;
      } catch {
        // share canceled or unsupported
      }
    }
    setShareMessage(text);
    showToast("Share ready");
  }, [current, showToast]);

  function restoreRoll(roll) {
    setCurrent(roll);
    showToast("Roll restored");
  }

  function clearHistory() {
    setHistory([]);
    showToast("History cleared");
  }

  function toggleFavorite() {
    if (current.genre === "—") {
      showToast("No roll to favorite");
      return;
    }

    const existing = favorites.some(
      (item) => item.genre === current.genre && item.sub === current.sub,
    );

    setFavorites((list) => {
      if (existing) {
        showToast("Removed from favorites");
        return list.filter(
          (item) => item.genre !== current.genre || item.sub !== current.sub,
        );
      }
      showToast("Added to favorites");
      return [current, ...list].slice(0, 12);
    });
  }

  function addCustomGenre() {
    const genre = customGenreName.trim();
    const subgenre = customSubgenreName.trim();
    if (!genre || !subgenre) {
      showToast("Fill both fields");
      return;
    }

    const existingGenre = customGenres.includes(genre) || genres.includes(genre);
    setCustomGenreData((data) => {
      const existingSubs = data[genre] || [];
      return {
        ...data,
        [genre]: [...existingSubs, subgenre],
      };
    });
    setCustomGenreName("");
    setCustomSubgenreName("");
    showToast(existingGenre ? "Subgenre added to existing genre" : "Custom genre added");
  }

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          theme,
          selectedGenre,
          customGenreData,
          favorites,
          history,
          current,
        }),
      );
    } catch {
      // storage may be unavailable on some browsers
    }
  }, [theme, selectedGenre, customGenreData, favorites, history, current]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 1600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

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
    <div className={`${currentThemeClasses} min-h-screen`}>
      <div className="mx-auto max-w-3xl p-6">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-2 shadow">
                <span role="img" aria-label="guitar" className="text-2xl">🎸</span>
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
            <div>
              <button
                onClick={() => setSettingsOpen(true)}
                className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-white hover:bg-white/5"
                title="Open settings"
                aria-label="Open settings"
              >
                <div className="flex flex-col items-center justify-center space-y-1">
                  <span className="block h-0.5 w-5 bg-white/90" />
                  <span className="block h-0.5 w-5 bg-white/90" />
                  <span className="block h-0.5 w-5 bg-white/90" />
                </div>
              </button>
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
                {customGenres.length > 0 ? (
                  <optgroup label="Your genres">
                    {customGenres.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
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
              <button
                onClick={shareCurrent}
                className="rounded-2xl border border-white/15 bg-transparent px-5 py-2.5 font-medium text-white hover:bg-white/5"
                title="Share current result"
              >
                Share
              </button>
              <button
                onClick={toggleFavorite}
                className="rounded-2xl border border-white/15 bg-transparent px-5 py-2.5 font-medium text-white hover:bg-white/5"
                title="Add or remove this roll from favorites"
              >
                {favorites.some(
                  (item) => item.genre === current.genre && item.sub === current.sub,
                )
                  ? "Unfavorite"
                  : "Favorite"}
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent rolls</h2>
              <p className="text-sm text-white/60">
                Tap a roll to restore it.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={clearHistory}
                className="rounded-2xl border border-white/15 bg-transparent px-4 py-2 text-sm text-white hover:bg-white/5"
              >
                Clear
              </button>
            </div>
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

        {/* Favorites moved to Settings modal */}

        <footer className="mt-8 text-xs text-white/45">
          To add more genres/subgenres, use the custom genre form or edit the
          <code className="rounded bg-white/10 px-1">DATA</code> list.
        </footer>
      </div>

      {settingsOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-neutral-950/95 p-6 shadow-xl shadow-black/40">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Settings</h2>
                <p className="text-sm text-white/60">Quick access for theme, history, and custom genres.</p>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="rounded-2xl border border-white/15 bg-transparent px-4 py-2 text-sm text-white hover:bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
                className="rounded-2xl border border-white/15 bg-transparent px-5 py-3 text-left text-sm text-white hover:bg-white/5"
              >
                <div className="font-semibold">Theme</div>
                <div className="text-white/60">Current: {theme === "dark" ? "Dark" : "Light"}</div>
              </button>
              <button
                onClick={() => setSelectedGenre("Any")}
                className="rounded-2xl border border-white/15 bg-transparent px-5 py-3 text-left text-sm text-white hover:bg-white/5"
              >
                <div className="font-semibold">Reset genre</div>
                <div className="text-white/60">Unlock genre selection</div>
              </button>
              <button
                onClick={clearHistory}
                className="rounded-2xl border border-white/15 bg-transparent px-5 py-3 text-left text-sm text-white hover:bg-white/5"
              >
                <div className="font-semibold">Clear history</div>
                <div className="text-white/60">Remove recent rolls</div>
              </button>
              <div className="col-span-2">
                <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Favorites</div>
                      <div className="text-xs text-white/60">Saved prompts you can restore.</div>
                    </div>
                    <button
                      onClick={() => setFavorites([])}
                      className="rounded-2xl border border-white/15 bg-transparent px-3 py-1 text-xs text-white hover:bg-white/5"
                    >
                      Clear favorites
                    </button>
                  </div>

                  {favorites.length === 0 ? (
                    <p className="mt-3 text-sm text-white/60">No favorites yet. Reroll and tap Favorite.</p>
                  ) : (
                    <ul className="mt-3 space-y-2 max-h-48 overflow-auto">
                      {favorites.map((item, idx) => (
                        <li
                          key={`${item.genre}-${item.sub}-${idx}`}
                          onClick={() => { restoreRoll(item); setSettingsOpen(false); }}
                          className="cursor-pointer flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-neutral-950/40 px-3 py-2 transition hover:border-white/20 hover:bg-neutral-950/60"
                          title="Restore this favorite"
                        >
                          {pill(item.genre)}
                          <span className="text-white/40">→</span>
                          {pill(item.sub)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Custom genre</h3>
                  <p className="text-sm text-white/60">Create a genre and subgenre for future rolls.</p>
                </div>
                <button
                  onClick={addCustomGenre}
                  className="rounded-2xl border border-white/15 bg-transparent px-4 py-2 text-sm text-white hover:bg-white/5"
                >
                  Add custom genre
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input
                  value={customGenreName}
                  onChange={(event) => setCustomGenreName(event.target.value)}
                  placeholder="Genre name"
                  className="w-full rounded-2xl border border-white/10 bg-neutral-950/60 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/25"
                />
                <input
                  value={customSubgenreName}
                  onChange={(event) => setCustomSubgenreName(event.target.value)}
                  placeholder="Subgenre name"
                  className="w-full rounded-2xl border border-white/10 bg-neutral-950/60 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/25"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-white/10 bg-neutral-950/95 px-4 py-2 text-sm text-white shadow-xl shadow-black/20">
          {toast}
        </div>
      ) : null}
      {shareMessage ? (
        <div className="fixed inset-x-6 bottom-24 rounded-3xl border border-white/10 bg-neutral-950/95 p-4 text-sm text-white shadow-xl shadow-black/20">
          <div className="flex items-start justify-between gap-3">
            <div className="max-w-xl text-xs text-white/70">
              Share text ready. Tap to copy if native sharing is not available.
            </div>
            <button
              onClick={() => setShareMessage("")}
              className="rounded-2xl border border-white/15 bg-transparent px-3 py-1 text-xs text-white hover:bg-white/5"
            >
              Close
            </button>
          </div>
          <div className="mt-3 break-words rounded-2xl border border-white/10 bg-neutral-950/60 p-3 text-sm">
            {shareMessage}
          </div>
        </div>
      ) : null}
    </div>
  );
}

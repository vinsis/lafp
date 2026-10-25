// Icons for the header links and the homepage's feature list.
// Drawn with `currentColor`, so CSS sets their color.

/** Open book: the eBook. */
export function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 6.5C10 5 7.5 4.5 3 4.5v14c4.5 0 7 .5 9 2 2-1.5 4.5-2 9-2v-14c-4.5 0-7 .5-9 2z" />
      <path d="M12 6.5v14" />
    </svg>
  );
}

/** A pen writing on a page: the blog. */
export function ArticleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
    </svg>
  );
}

/** A stack of cards, one behind another: the series. */
export function SeriesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M7.5 3h9" />
      <path d="M5 6.5h14" />
      <rect x="3" y="10" width="18" height="11" rx="2" />
    </svg>
  );
}

// Feature-list icons, as on tinyvolt-web's `/lafp`.

/** Cursor arrow with a click spark: interactive. */
export function InteractiveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M5 3v2" />
      <path d="M3 5h2" />
      <path d="M4 8.5 5.4 7.1" />
      <path d="M9 8.5 20 13l-5 1.8L13 20z" />
    </svg>
  );
}

/** `</>`: programmable. */
export function ProgrammableIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="8 7 3 12 8 17" />
      <polyline points="16 7 21 12 16 17" />
      <line x1="13.5" y1="5" x2="10.5" y2="19" />
    </svg>
  );
}

/** Git branch: open-source. */
export function OpenSourceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="6" y1="7.5" x2="6" y2="18.5" />
      <circle cx="6" cy="5" r="2.5" />
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="21" r="2.5" />
      <path d="M18 7.5v1.5a6.5 6.5 0 0 1-6.5 6.5H6" />
    </svg>
  );
}

// Line icons for event cards, rule groups, prizes and round markers.
const PATHS: Record<string, string> = {
  terminal: "M3 4h18v16H3zM7 9l3 3-3 3M12 15h5",
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  film: "M4 4h16v16H4zM8 4v16M16 4v16M4 9h4M4 15h4M16 9h4M16 15h4",
  list: "M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9.5 12l2 2 3.5-4",
  handshake: "M12 6.5 9.5 9a2 2 0 0 0 0 3 2 2 0 0 0 3 0l1-1 3.5 3.5a2 2 0 0 1-3 2.5 2 2 0 0 1-3 1.5 2 2 0 0 1-3-1.5 2 2 0 0 1-2.5-3L3 11l4-5h4zM13 6.5h4l4 4.5-2.5 2.5",
  trophy: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 5h3a3 3 0 0 1-3 4M7 5H4a3 3 0 0 0 3 4",
  medal: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.2 13.5 7 22l5-3 5 3-1.2-8.5M12 6.5l.9 1.8 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2L9 8.6l2-.3z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  scoreboard: "M4 4h16v13H4zM8 17v3M16 17v3M6 20h12M8 13V8M12 13V6M16 13v-3",
  gamepad: "M6 11h4M8 9v4M15 12h.01M18 10h.01M17.3 5H6.7a4 4 0 0 0-4 3.6L2 15a3 3 0 0 0 5.4 2l1.6-2h6l1.6 2A3 3 0 0 0 22 15l-.7-6.4a4 4 0 0 0-4-3.6z",
  flag: "M4 22V4M4 5h14l-2.5 4L18 13H4",
};

export default function EventIcon({ name, size = 22 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name] ?? PATHS.list} />
    </svg>
  );
}

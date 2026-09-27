// Line icons used across the level cards, rules groups and prize table.
const PATHS: Record<string, string> = {
  bug: "M8 6a4 4 0 0 1 8 0M5 11h14M12 10v10M19 9a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v4a7 7 0 0 0 14 0zM2 10h3M19 10h3M3 5l2.5 2M21 5l-2.5 2M3 18l2.5-1.5M21 18l-2.5-1.5",
  eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  buzzer: "M12 3a7 7 0 0 0-7 7v3H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1v-3a7 7 0 0 0-7-7zM9 21h6M12 3V1M4.5 5.5 3 4M19.5 5.5 21 4",
  list: "M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9.5 12l2 2 3.5-4",
  handshake: "M12 6.5 9.5 9a2 2 0 0 0 0 3 2 2 0 0 0 3 0l1-1 3.5 3.5a2 2 0 0 1-3 2.5 2 2 0 0 1-3 1.5 2 2 0 0 1-3-1.5 2 2 0 0 1-2.5-3L3 11l4-5h4zM13 6.5h4l4 4.5-2.5 2.5",
  trophy: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 5h3a3 3 0 0 1-3 4M7 5H4a3 3 0 0 0 3 4",
  medal: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.2 13.5 7 22l5-3 5 3-1.2-8.5M12 6.5l.9 1.8 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2L9 8.6l2-.3z",
  flag: "M4 22V4M4 5h14l-2.5 4L18 13H4",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  layout: "M3 4h18v16H3zM3 9h18M9 9v11",
  arrowDown: "M12 5v14M6 13l6 6 6-6",
};

export default function LevelIcon({ name, size = 22 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name] ?? PATHS.list} />
    </svg>
  );
}

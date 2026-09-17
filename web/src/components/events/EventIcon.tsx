// Line icons keyed by the `svgIcon` field of each event in config.js.
const PATHS: Record<string, string> = {
  document: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6",
  circuit: "M13 2L4 14h7l-1 8 9-12h-7z",
  briefcase: "M4 7h16v12H4zM9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M4 12h16",
  map: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  wrench: "M14.7 6.3a4 4 0 0 0-5.4 5.1L3 17.7 6.3 21l6.3-6.3a4 4 0 0 0 5.1-5.4l-2.6 2.6-2.4-.6-.6-2.4z",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  rocket: "M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2M14 4c3-1 6-1 6-1s0 3-1 6l-7 7-5-5zM9 11l-3-.5L4 13l3 1M13 15l.5 3L11 20l-1-3",
  link: "M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1",
  gamepad: "M6 11h4M8 9v4M15 12h.01M18 10h.01M17.3 5H6.7a4 4 0 0 0-4 3.6L2 15a3 3 0 0 0 5.4 2l1.6-2h6l1.6 2A3 3 0 0 0 22 15l-.7-6.4a4 4 0 0 0-4-3.6z",
  film: "M4 4h16v16H4zM8 4v16M16 4v16M4 9h4M4 15h4M16 9h4M16 15h4",
  recycle: "M7 19H4.8a2 2 0 0 1-1.7-3l1.2-2M11 19h8.2a2 2 0 0 0 1.7-3l-1.2-2M14 16l-3 3 3 3M8.3 9.6L6 5.6a2 2 0 0 1 1.7-3h2.6M7 2.6l4.3 0M16 9l2 3.5M9 9L5 8l1-4M16 9l1-4 4 1",
  dumbbell: "M6.5 6.5l11 11M3 10l7-7M14 21l7-7M5.5 12.5l7-7M11.5 18.5l7-7",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  pyramid: "M12 3L2 20h20zM12 3v17M7 12h10",
  dice: "M4 4h16v16H4zM8.5 8.5h.01M15.5 8.5h.01M12 12h.01M8.5 15.5h.01M15.5 15.5h.01",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4M12 15v2",
  tv: "M3 7h18v13H3zM8 2l4 5 4-5",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5",
  brain: "M9 3a3 3 0 0 0-3 3 3 3 0 0 0-3 3c0 1.2.7 2.2 1.7 2.7A3 3 0 0 0 6 17a3 3 0 0 0 3 3 3 3 0 0 0 3-2V5a2 2 0 0 0-3-2zM15 3a3 3 0 0 1 3 3 3 3 0 0 1 3 3c0 1.2-.7 2.2-1.7 2.7A3 3 0 0 1 18 17a3 3 0 0 1-3 3 3 3 0 0 1-3-2",
  terminal: "M3 4h18v16H3zM7 9l3 3-3 3M12 15h5",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  key: "M15 3a6 6 0 1 1-5.7 7.9L3 17v4h4v-2h2v-2h2l1.1-1.3A6 6 0 0 1 15 3zM16.5 7.5h.01",
  lifebuoy: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.9 4.9l4.3 4.3M14.8 14.8l4.3 4.3M14.8 9.2l4.3-4.3M4.9 19.1l4.3-4.3",
  scale: "M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z",
  door: "M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17M3 21h18M15 12h.01",
  flame: "M12 2c1.5 3 5 4.5 5 9a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.3 1.5 1 2.5 2 3 0-3 .5-5.5 1-7.5z",
  bat: "M19 3l2 2-10 10-3 1 1-3zM7 17l-4 4M17 13.5a2 2 0 1 0 0 .01",
  laugh: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 14s1.5 3 4 3 4-3 4-3zM9 9h.01M15 9h.01",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  palette: "M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A5.6 5.6 0 0 0 22 10c0-4.4-4.5-8-10-8zM6.5 11.5h.01M9.5 7.5h.01M14.5 7.5h.01M17.5 11.5h.01",
  gavel: "M14 13l-7.5 7.5a2.1 2.1 0 0 1-3-3L11 10M16 16l6-6M8 8l6-6M9 7l8 8M21 11l-8-8",
  megaphone: "M3 11v2a1 1 0 0 0 1 1h3l6 5V5L7 10H4a1 1 0 0 0-1 1zM17 9a4 4 0 0 1 0 6M20 6a8 8 0 0 1 0 12",
  dna: "M4 2c0 6 16 6 16 12M20 2c0 6-16 6-16 12M4 22c0-3 4-5 8-6M20 22c0-3-4-5-8-6M7 5h10M7 19h10",
};

export default function EventIcon({ name, size = 22 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name] ?? PATHS.document} />
    </svg>
  );
}

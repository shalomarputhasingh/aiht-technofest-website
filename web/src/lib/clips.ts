// The cinematic shot list. Each clip was generated keyframe-to-keyframe
// (clip N's last frame == clip N+1's first frame), so switching clips at a
// boundary is visually seamless in both scroll directions.
export type ClipId =
  | "c01_awakening"
  | "c02_approach"
  | "c03_mount"
  | "c04_ignition"
  | "c05_ride_city"
  | "c06_ride_future"
  | "c07_stop"
  | "c08_watch"
  | "c09_return"
  | "c10_highway"
  | "c11_highway_stop"
  | "c12_skull";

export type Clip = {
  id: ClipId;
  title: string;
  /** object-position used on narrow (portrait) screens so the rider stays in frame. */
  mobileFocus: string;
};

export const CLIPS: Clip[] = [
  { id: "c01_awakening", title: "The Awakening", mobileFocus: "38% 50%" },
  { id: "c02_approach", title: "The Machine", mobileFocus: "55% 50%" },
  { id: "c03_mount", title: "The Engine", mobileFocus: "30% 50%" },
  { id: "c04_ignition", title: "Ignition", mobileFocus: "32% 50%" },
  { id: "c05_ride_city", title: "The Ride", mobileFocus: "40% 50%" },
  { id: "c06_ride_future", title: "The Ride", mobileFocus: "45% 50%" },
  { id: "c07_stop", title: "The Mission", mobileFocus: "55% 50%" },
  { id: "c08_watch", title: "The Intel", mobileFocus: "60% 50%" },
  { id: "c09_return", title: "The Final Ride", mobileFocus: "55% 50%" },
  { id: "c10_highway", title: "The Dark Highway", mobileFocus: "40% 50%" },
  { id: "c11_highway_stop", title: "The Stop", mobileFocus: "50% 50%" },
  { id: "c12_skull", title: "The Skull", mobileFocus: "50% 50%" },
];

export const CLIP_INDEX = Object.fromEntries(CLIPS.map((c, i) => [c.id, i])) as Record<ClipId, number>;

export const posterSrc = (id: ClipId, edge: "start" | "end") => `/media/posters/${id}_${edge}.webp`;

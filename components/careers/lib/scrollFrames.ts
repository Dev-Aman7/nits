/** JPEG sequence behind the careers hero and job brief. */

export const FRAME_COUNT = 150;
export const FRAME_DIR = "/ezgif-8531331ccf67ba2a-jpg";

/** 1-based frame path, matching `ezgif-frame-001.jpg` … `150.jpg`. */
export function frameUrl(n: number): string {
  return `${FRAME_DIR}/ezgif-frame-${String(n).padStart(3, "0")}.jpg`;
}

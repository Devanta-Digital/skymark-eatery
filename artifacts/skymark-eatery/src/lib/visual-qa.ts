/** True when `?visualQa=1` is present — visual capture / QA pipeline. */
export function isVisualQaCapture(): boolean {
  if (typeof document === "undefined") return false;
  if (document.documentElement.dataset.visualQa === "1") return true;
  try {
    const q = new URLSearchParams(window.location.search);
    return q.has("visualQa") || q.get("visualQa") === "1";
  } catch {
    return false;
  }
}

export function initHeroVideo() {
  const video = document.getElementById("hero-video");

  // Stop if the video doesn't exist
  if (!video) return;

  // Detect device and connection
  const isDesktop = window.innerWidth > 768;

  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  const saveData = connection?.saveData ?? false;

  const networkType = connection?.effectiveType ?? "4g";

  const isSlowNetwork =
    networkType === "slow-2g" ||
    networkType === "2g";

  // Desktop + good connection
  if (isDesktop && !saveData && !isSlowNetwork) {
    video.style.display = "block";
    video.play().catch(() => {});
  }

  // Mobile or slow connection
  else {
    video.pause();
    video.style.display = "none";
  }
}
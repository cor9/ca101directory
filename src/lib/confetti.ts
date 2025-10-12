import confetti from "canvas-confetti";

/**
 * Trigger a confetti celebration
 */
export function celebrateSuccess() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: ReturnType<typeof setInterval> = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Fire from two locations
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

/**
 * Simple burst of confetti
 */
export function confettiBurst() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    zIndex: 9999,
  });
}

/**
 * Checkmark animation with confetti
 */
export function checkmarkCelebration() {
  // First a small burst
  confetti({
    particleCount: 30,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: ["#26C281", "#FF6B35", "#FFD369"],
    zIndex: 9999,
  });
  confetti({
    particleCount: 30,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: ["#26C281", "#FF6B35", "#FFD369"],
    zIndex: 9999,
  });
}


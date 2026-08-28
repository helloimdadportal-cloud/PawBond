import confetti from 'canvas-confetti';

export const triggerCozyConfetti = () => {
  try {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#10B981', '#F43F5E', '#FBBF24', '#6EE7B7'],
      disableForReducedMotion: true
    });
  } catch (e) {
    console.error(e);
  }
};

export const triggerStreakConfetti = () => {
  try {
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#EA580C', '#FEF08A', '#FB923C'],
      disableForReducedMotion: true
    });
  } catch (e) {
    console.error(e);
  }
};

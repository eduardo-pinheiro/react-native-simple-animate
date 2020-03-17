export class AnimateConfig {
  static millisecondTransitionFast: number = 100;
  static millisecondTransitionRegular: number = 350;
  static millisecondTransitionSlow: number = 500;
  static animeDirection = {
    just_opacity: {
      opacity: 0,
      pointerEvents: 'none',
    },
    up: {
      opacity: 0,
      transform: "translateY(50px)",
      pointerEvents: 'none',
    },
    down: {
      opacity: 0,
      transform: "translateY(-50px)",
      pointerEvents: 'none',
    },
    right: {
      opacity: 0,
      transform: "translateX(-50px)",
      pointerEvents: 'none',
    },
    left: {
      opacity: 0,
      transform: "translate(50px)",
      pointerEvents: 'none',
    },
  }
}
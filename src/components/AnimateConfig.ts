export class AnimateConfig {
  static millisecondTransitionFast: number = 100;
  static millisecondTransitionRegular: number = 350;
  static millisecondTransitionSlow: number = 500;
  static animeDirection = {
    appear: {
      translateX: 0,
      translateY: 0,
      opacity: 1,
    },
    just_opacity: {
      translateX: 0,
      translateY: 0,
      opacity: 0,
    },
    up: {
      translateX: 0,
      translateY: 50,
      opacity: 0,
    },
    down: {
      translateX: 0,
      translateY: -50,
      opacity: 0,
    },
    right: {
      translateX: -50,
      translateY: 0,
      opacity: 0,
    },
    left: {
      translateX: 50,
      translateY: 0,
      opacity: 0,
    },
  };
}
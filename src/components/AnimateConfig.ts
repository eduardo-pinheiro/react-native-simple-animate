export class AnimateConfig {
  static millisecondTransitionFast: number = 100;
  static millisecondTransitionRegular: number = 350;
  static millisecondTransitionSlow: number = 500;
  static animationType = {
    appear: {
      translateX: 0,
      translateY: 0,
      opacity: 1,
    },
    opacity: {
      translateX: 0,
      translateY: 0,
      opacity: 0,
    },
    slideUp: {
      translateX: 0,
      translateY: 50,
      opacity: 0,
    },
    slideDown: {
      translateX: 0,
      translateY: -50,
      opacity: 0,
    },
    slideRight: {
      translateX: -50,
      translateY: 0,
      opacity: 0,
    },
    slideLeft: {
      translateX: 50,
      translateY: 0,
      opacity: 0,
    },
  };
}
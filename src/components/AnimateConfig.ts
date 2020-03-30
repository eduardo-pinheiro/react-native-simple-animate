import { IConfigMilissecondOptions } from './AnimateTypes';

export class AnimateConfig {
  static millisecondTransitionFast = 100;
  static millisecondTransitionRegular = 350;
  static millisecondTransitionSlow = 500;
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

  static getMilissecondTransitionByKey(milissecondOption: IConfigMilissecondOptions | string | number | undefined) {
    switch (milissecondOption) {
      case 'slow':
        return AnimateConfig.millisecondTransitionSlow;
      case 'regular':
        return AnimateConfig.millisecondTransitionRegular;
        break;
      case 'fast':
        return AnimateConfig.millisecondTransitionFast;
      default:
        return undefined;
    }
  }
}

import { IConfigMilissecondOptions, IAnimationType } from './AnimateTypes';

export class AnimateConfig {
  static millisecondTransitionFast = 100;
  static millisecondTransitionRegular = 350;
  static millisecondTransitionSlow = 500;
  static onScreenAxisValue = 0;
  static outScreenAxisValue = 50;

  static getAnimationType(
    animationType: IAnimationType | 'appear',
    onScreenAxisValue: number,
    outScreenAxisValue: number,
  ) {
    const animationsTypeObject = {
      appear: {
        axisX: onScreenAxisValue,
        axisY: onScreenAxisValue,
        opacity: 1,
      },
      opacity: {
        axisX: onScreenAxisValue,
        axisY: onScreenAxisValue,
        opacity: 0,
      },
      slideUp: {
        axisX: onScreenAxisValue,
        axisY: outScreenAxisValue,
        opacity: 0,
      },
      slideDown: {
        axisX: onScreenAxisValue,
        axisY: outScreenAxisValue * -1,
        opacity: 0,
      },
      slideRight: {
        axisX: outScreenAxisValue * -1,
        axisY: onScreenAxisValue,
        opacity: 0,
      },
      slideLeft: {
        axisX: outScreenAxisValue,
        axisY: onScreenAxisValue,
        opacity: 0,
      },
    };
    return animationsTypeObject[animationType];
  }

  static getMilissecondTransitionByKey(milissecondOption: IConfigMilissecondOptions | string | number | undefined) {
    switch (milissecondOption) {
      case 'slow':
        return AnimateConfig.millisecondTransitionSlow;
      case 'regular':
        return AnimateConfig.millisecondTransitionRegular;
      case 'fast':
        return AnimateConfig.millisecondTransitionFast;
      default:
        return undefined;
    }
  }
}

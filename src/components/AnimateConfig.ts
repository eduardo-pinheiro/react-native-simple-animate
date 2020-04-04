import { IConfigMilissecondOptions, IAnimationType } from './AnimateTypes';

export class AnimateConfig {
  static millisecondTransitionFast = 100;
  static millisecondTransitionRegular = 350;
  static millisecondTransitionSlow = 500;
  static movePoints = 50;

  static getAnimationType(animationType: IAnimationType | 'appear', movePoints: number) {
    const animationsTypeObject = {
      appear: {
        axisX: 0,
        axisY: 0,
        opacity: 1,
      },
      opacity: {
        axisX: 0,
        axisY: 0,
        opacity: 0,
      },
      slideUp: {
        axisX: 0,
        axisY: movePoints,
        opacity: 0,
      },
      slideDown: {
        axisX: 0,
        axisY: movePoints * -1,
        opacity: 0,
      },
      slideRight: {
        axisX: movePoints * -1,
        axisY: 0,
        opacity: 0,
      },
      slideLeft: {
        axisX: movePoints,
        axisY: 0,
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

import { IConfigMilissecondOptions, IAnimationType, IAnimationMode } from './AnimateTypes';

export class AnimateConfig {
  static millisecondTransitionFast = 100;
  static millisecondTransitionRegular = 350;
  static millisecondTransitionSlow = 500;
  static regularAxisValue = 0;
  static finalAxisValue = 50;

  static getAnimationType(
    animationType: IAnimationType | 'appear',
    animationMode: IAnimationMode,
    regularAxisValue: number,
    finalAxisValue: number,
  ) {
    const animationsTypeObject = {
      appear: {
        axisX: regularAxisValue,
        axisY: regularAxisValue,
        opacity: 1,
      },
      opacity: {
        axisX: regularAxisValue,
        axisY: regularAxisValue,
        opacity: 0,
      },
      slideUp: {
        axisX: regularAxisValue,
        axisY: animationMode === 'pushFlex' ? finalAxisValue * -1 : finalAxisValue,
        opacity: 0,
      },
      slideDown: {
        axisX: regularAxisValue,
        axisY: finalAxisValue * -1,
        opacity: 0,
      },
      slideRight: {
        axisX: finalAxisValue * -1,
        axisY: regularAxisValue,
        opacity: 0,
      },
      slideLeft: {
        axisX: animationMode === 'pushFlex' ? finalAxisValue * -1 : finalAxisValue,
        axisY: regularAxisValue,
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

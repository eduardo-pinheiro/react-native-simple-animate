export type IAnimationType = 'opacity' | 'slideDown' | 'slideUp' | 'slideLeft' | 'slideRight';
export type ITransitionSpeed = number | IConfigMilissecondOptions;
export type IAnimationDelay = 'equalTransitionSpeed' | number | IConfigMilissecondOptions;
export type IConfigMilissecondOptions = 'slow' | 'regular' | 'fast';
export type IAxisValues = { onScreen: number; outScreen: number };

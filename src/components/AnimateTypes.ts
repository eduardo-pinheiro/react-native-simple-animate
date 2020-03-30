export type IAnimationType = 'opacity' | 'slideDown' | 'slideUp' | 'slideLeft' | 'slideRight';
export type ITransitionSpeed = number | IConfigMilissecondOptions;
export type IAnimationDelay = 'equalTransitionSpeed' | number | IConfigMilissecondOptions;
export type IAnimationMode = 'translate' | 'pushFlex' | undefined;
export type IConfigMilissecondOptions = 'slow' | 'regular' | 'fast';
export type IAxisValues = { regular: number; final: number };

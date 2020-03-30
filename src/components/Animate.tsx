import React from 'react';
import { AnimateConfig } from './AnimateConfig';
import { Animated, ViewProps } from 'react-native';
import { IAnimationType, ITransitionSpeed, IAnimationDelay, IAnimationMode } from './AnimateTypes';

export interface AnimateProps {
  isVisible?: boolean;
  animationType?: IAnimationType;
  animationMode?: IAnimationMode;
  animationDelay?: IAnimationDelay;
  transitionSpeed?: ITransitionSpeed;
  animateCallbackFn?: (isVisibleInRender?: boolean) => void;
  unmountComponentWhenInvisible?: boolean;
}

type Props = AnimateProps & ViewProps;

interface State {
  isVisibleInRender: boolean;
  transitionMillisecond: number;
  delayMillisecond: number | undefined;
}

export class Animate extends React.Component<Props, State> {
  styleOpacityValue: Animated.Value = new Animated.Value(0);
  styleTranslateYValue: Animated.Value = new Animated.Value(0);
  styleTranslateXValue: Animated.Value = new Animated.Value(0);

  constructor(props: Props) {
    super(props);
    this.state = {
      isVisibleInRender: false,
      transitionMillisecond: AnimateConfig.millisecondTransitionRegular,
      delayMillisecond: undefined,
    };
  }

  componentDidMount = async () => {
    this.setInitialPositionByStyle();

    if (this.props.isVisible !== undefined) {
      const isVisibleInRender = this.props.isVisible;
      this.updateIsVisibleByStyle(isVisibleInRender);
      this.setState({ isVisibleInRender });
      await this.setMillisecondTransition();
      this.setMillisecondDelay();
    } else {
      this.updateIsVisibleByStyle(true);
    }
  };

  componentDidUpdate = async (prevProps: Props) => {
    if (this.props.isVisible !== undefined && prevProps.isVisible !== this.props.isVisible) {
      this.updateIsVisibleByStyle(this.props.isVisible);
    }

    if (prevProps.transitionSpeed !== this.props.transitionSpeed) {
      this.setMillisecondTransition();
    }
  };

  async setMillisecondTransition() {
    const { transitionSpeed } = this.props;
    let transitionMillisecond: number;

    if (typeof transitionSpeed === 'number') {
      transitionMillisecond = transitionSpeed;
    } else {
      const configMilissecondOption = AnimateConfig.getMilissecondTransitionByKey(transitionSpeed);
      if (configMilissecondOption !== undefined) transitionMillisecond = configMilissecondOption;
      else transitionMillisecond = AnimateConfig.millisecondTransitionRegular;
    }
    await this.setState({ transitionMillisecond });
  }

  async setMillisecondDelay() {
    const { animationDelay } = this.props;
    let delayMillisecond: number | undefined;

    if (typeof animationDelay === 'number') {
      delayMillisecond = animationDelay;
    } else {
      if (animationDelay === 'equalTransitionSpeed') {
        delayMillisecond = this.state.transitionMillisecond;
      } else {
        const configMilissecondOption = AnimateConfig.getMilissecondTransitionByKey(animationDelay);
        if (configMilissecondOption !== undefined) delayMillisecond = configMilissecondOption;
        else delayMillisecond = undefined;
      }
    }
    await this.setState({ delayMillisecond });
  }

  async updateIsVisibleByStyle(isVisible: boolean) {
    if (!isVisible) {
      if (this.props.animationType) this.triggerAnimation(this.props.animationType);
      else this.triggerAnimation('opacity');
    } else {
      await this.setState({ isVisibleInRender: true });
      this.triggerAnimation('appear');
    }
  }

  setInitialPositionByStyle() {
    let animationType: 'appear' | IAnimationType;

    if (this.props.isVisible) animationType = 'appear';
    else animationType = 'opacity' || this.props.animationType;

    const newStyles = AnimateConfig.animationType[animationType];
    this.styleOpacityValue.setValue(newStyles.opacity);
    this.styleTranslateXValue.setValue(newStyles.translateX);
    this.styleTranslateYValue.setValue(newStyles.translateY);
  }

  triggerAnimation(animationType: 'appear' | IAnimationType) {
    const { transitionMillisecond, delayMillisecond } = this.state;
    const { styleOpacityValue, styleTranslateXValue, styleTranslateYValue } = this;
    const newStyles = AnimateConfig.animationType[animationType];

    Animated.timing(styleOpacityValue, {
      delay: delayMillisecond,
      toValue: newStyles.opacity,
      duration: transitionMillisecond,
    }).start();

    Animated.timing(styleTranslateXValue, {
      delay: delayMillisecond,
      toValue: newStyles.translateX,
      duration: transitionMillisecond,
    }).start();

    Animated.timing(styleTranslateYValue, {
      delay: delayMillisecond,
      toValue: newStyles.translateY,
      duration: transitionMillisecond,
    }).start(() => {
      /*This callback could be stayed in any of before Animated.timing functions*/
      this.updateIsVisibleInRender();
    });
  }

  updateIsVisibleInRender() {
    if (this.props.isVisible !== undefined) {
      const isVisibleInRender = this.props.isVisible;
      if (this.props.animateCallbackFn) this.props.animateCallbackFn(isVisibleInRender);
      this.setState({ isVisibleInRender });
    }
  }

  render() {
    if (!this.state.isVisibleInRender && this.props.unmountComponentWhenInvisible === true) return null;
    return (
      <Animated.View
        {...this.props}
        style={[
          this.props.style || {},
          {
            opacity: this.styleOpacityValue,
            translateX: this.styleTranslateXValue,
            translateY: this.styleTranslateYValue,
          },
          !this.state.isVisibleInRender && { display: 'none' },
        ]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

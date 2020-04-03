import React from 'react';
import { AnimateConfig } from './AnimateConfig';
import { Animated, ViewProps } from 'react-native';
import { IAnimationType, ITransitionSpeed, IAnimationDelay, IAnimationMode, IAxisValues } from './AnimateTypes';

export interface AnimateProps {
  isVisible?: boolean; // Default appear behavior
  animationType?: IAnimationType; // Default "opacity"
  animationMode?: IAnimationMode; // Default "translate"
  animationDelay?: IAnimationDelay; // Default undefined
  transitionSpeed?: ITransitionSpeed; // Default "regular"
  animateCallbackFn?: (isVisibleInRender?: boolean) => void; // Default undefined
  axisValues?: IAxisValues; // Default {onScreen: 0, outScreen: 50}
}

type Props = AnimateProps & ViewProps;

interface State {
  isVisibleInRender: boolean;
  transitionMillisecond: number;
  delayMillisecond: number | undefined;
  axisValues: IAxisValues;
}

export class Animate extends React.Component<Props, State> {
  styleOpacityValue: Animated.Value = new Animated.Value(0);
  styleAxisYValue: Animated.Value = new Animated.Value(0);
  styleAxisXValue: Animated.Value = new Animated.Value(0);

  constructor(props: Props) {
    super(props);
    this.state = {
      isVisibleInRender: false,
      transitionMillisecond: AnimateConfig.millisecondTransitionRegular,
      delayMillisecond: undefined,
      axisValues: {
        onScreen: AnimateConfig.onScreenAxisValue,
        outScreen: AnimateConfig.outScreenAxisValue,
      },
    };
  }

  componentDidMount = async () => {
    await this.setAxisValues();
    this.setInitialPositionByStyle();

    if (this.props.isVisible !== undefined) {
      const isVisibleInRender = this.props.isVisible;
      this.updateIsVisibleByStyle(isVisibleInRender);
      this.setState({ isVisibleInRender });
      this.setMillisecondTransition();
      this.setMillisecondDelay();
    } else {
      this.updateIsVisibleByStyle(true);
    }
  };

  componentDidUpdate = async (prevProps: Props) => {
    if (prevProps.transitionSpeed !== this.props.transitionSpeed) this.setMillisecondTransition();
    if (prevProps.animationDelay !== this.props.animationDelay) this.setMillisecondDelay();
    if (prevProps.axisValues !== this.props.axisValues) this.setAxisValues();
    if (this.props.isVisible !== undefined && prevProps.isVisible !== this.props.isVisible)
      this.updateIsVisibleByStyle(this.props.isVisible);
  };

  setMillisecondTransition() {
    const { transitionSpeed } = this.props;
    let transitionMillisecond: number;

    if (typeof transitionSpeed === 'number') {
      transitionMillisecond = transitionSpeed;
    } else {
      const configMilissecondOption = AnimateConfig.getMilissecondTransitionByKey(transitionSpeed);
      if (configMilissecondOption !== undefined) transitionMillisecond = configMilissecondOption;
      else transitionMillisecond = AnimateConfig.millisecondTransitionRegular;
    }
    this.setState({ transitionMillisecond });
  }

  setMillisecondDelay() {
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
    this.setState({ delayMillisecond });
  }

  updateIsVisibleByStyle(isVisible: boolean) {
    if (!isVisible) {
      if (this.props.animationType) this.triggerAnimation(this.props.animationType);
      else this.triggerAnimation('opacity');
    } else {
      this.setState({ isVisibleInRender: true });
      this.triggerAnimation('appear');
    }
  }

  setInitialPositionByStyle() {
    const { animationMode, isVisible } = this.props;
    const { axisValues } = this.state;
    let animationType: 'appear' | IAnimationType;

    if (isVisible) animationType = 'appear';
    else animationType = 'opacity' || this.props.animationType;

    const newStyles = AnimateConfig.getAnimationType(
      animationType,
      animationMode,
      axisValues.onScreen,
      axisValues.outScreen,
    );
    this.styleOpacityValue.setValue(newStyles.opacity);
    this.styleAxisXValue.setValue(newStyles.axisX);
    this.styleAxisYValue.setValue(newStyles.axisY);
  }

  async setAxisValues() {
    let { axisValues } = this.props;
    if (axisValues === undefined) {
      axisValues = {
        onScreen: AnimateConfig.onScreenAxisValue,
        outScreen: AnimateConfig.outScreenAxisValue,
      };
    }
    await this.setState({ axisValues });
  }

  triggerAnimation(animationType: 'appear' | IAnimationType) {
    const { animationMode } = this.props;
    const { transitionMillisecond, delayMillisecond, axisValues } = this.state;
    const { styleOpacityValue, styleAxisXValue, styleAxisYValue } = this;
    const newStyles = AnimateConfig.getAnimationType(
      animationType,
      animationMode,
      axisValues.onScreen,
      axisValues.outScreen,
    );

    Animated.timing(styleOpacityValue, {
      delay: delayMillisecond,
      toValue: newStyles.opacity,
      duration: transitionMillisecond,
    }).start();

    Animated.timing(styleAxisXValue, {
      delay: delayMillisecond,
      toValue: newStyles.axisX,
      duration: transitionMillisecond,
    }).start();

    Animated.timing(styleAxisYValue, {
      delay: delayMillisecond,
      toValue: newStyles.axisY,
      duration: transitionMillisecond,
    }).start(({ finished }) => {
      /*This callback could be stayed in any of before Animated.timing functions*/
      if (finished) this.updateIsVisibleInRender();
    });
  }

  updateIsVisibleInRender() {
    if (this.props.isVisible !== undefined) {
      const isVisibleInRender = this.props.isVisible;
      if (this.props.animateCallbackFn) this.props.animateCallbackFn(isVisibleInRender);
      this.setState({ isVisibleInRender });
    }
  }

  getAxisStyleByAnimationMode() {
    const { animationMode, animationType } = this.props;

    switch (animationMode) {
      case 'pushFlex':
        switch (animationType) {
          case 'slideDown':
            return { marginTop: this.styleAxisYValue };
          case 'slideUp':
            return { marginBottom: this.styleAxisYValue };
          case 'slideLeft':
            return { marginRight: this.styleAxisXValue };
          case 'slideRight':
            return { marginLeft: this.styleAxisXValue };
          default:
            return {};
        }
      default:
        return {
          translateX: this.styleAxisXValue,
          translateY: this.styleAxisYValue,
        };
    }
  }

  render() {
    if (!this.state.isVisibleInRender) return null;
    const axisStyle = this.getAxisStyleByAnimationMode();

    return (
      <Animated.View
        {...this.props}
        style={[
          this.props.style || {},
          {
            opacity: this.styleOpacityValue,
            ...axisStyle,
          },
        ]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

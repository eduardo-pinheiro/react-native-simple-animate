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
}

type Props = AnimateProps & ViewProps;

interface State {
  isVisibleInRender: boolean;
  transitionMillisecond: number;
  delayMillisecond: number | undefined;
  axisValues: {
    regular: number;
    final: number;
  };
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
        regular: AnimateConfig.regularAxisValue,
        final: AnimateConfig.finalAxisValue,
      },
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
    const { axisValues } = this.state;
    let animationType: 'appear' | IAnimationType;

    if (this.props.isVisible) animationType = 'appear';
    else animationType = 'opacity' || this.props.animationType;

    const newStyles = AnimateConfig.getAnimationType(animationType, axisValues.regular, axisValues.final);
    this.styleOpacityValue.setValue(newStyles.opacity);
    this.styleAxisXValue.setValue(newStyles.axisX);
    this.styleAxisYValue.setValue(newStyles.axisY);
  }

  triggerAnimation(animationType: 'appear' | IAnimationType) {
    const { transitionMillisecond, delayMillisecond, axisValues } = this.state;
    const { styleOpacityValue, styleAxisXValue, styleAxisYValue } = this;
    const newStyles = AnimateConfig.getAnimationType(animationType, axisValues.regular, axisValues.final);

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

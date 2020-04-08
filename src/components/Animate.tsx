import React from 'react';
import { AnimateConfig } from './AnimateConfig';
import { Animated, ViewProps } from 'react-native';
import { IAnimationType, ITransitionSpeed, IAnimationDelay, IAnimationMode } from './AnimateTypes';

export interface AnimateProps {
  isVisible?: boolean; // Default appear behavior
  animationType?: IAnimationType; // Default "opacity"
  animationDelay?: IAnimationDelay; // Default undefined
  transitionSpeed?: ITransitionSpeed; // Default "regular"
  animateCallbackFn?: (isVisibleInRender?: boolean) => void; // Default undefined
  movePoints?: number; // Default AnimateConfig.movePoints
  disableOpacityAnimation?: boolean; // Default false
  neverRemove?: boolean; // Default false
  animationMode?: IAnimationMode;
}

type Props = AnimateProps & ViewProps;

interface State {
  isVisibleInRender: boolean;
  transitionMillisecond: number;
  delayMillisecond: number | undefined;
  movePoints: number;
}

export class Animate extends React.Component<Props, State> {
  styleOpacityValue: Animated.Value = new Animated.Value(this.props.disableOpacityAnimation ? 1 : 0);
  styleAxisYValue: Animated.Value = new Animated.Value(0);
  styleAxisXValue: Animated.Value = new Animated.Value(0);

  constructor(props: Props) {
    super(props);
    this.state = {
      isVisibleInRender: false,
      transitionMillisecond: AnimateConfig.millisecondTransitionRegular,
      delayMillisecond: undefined,
      movePoints: AnimateConfig.movePoints,
    };
  }

  componentDidMount = async () => {
    await this.setMovePoints();
    await this.setInitialPositionByStyle();
    await this.setMillisecondTransition();
    await this.setMillisecondDelay();

    if (this.props.isVisible !== undefined) {
      const isVisibleInRender = this.props.isVisible;
      this.updateIsVisibleByStyle(isVisibleInRender);
    } else {
      this.updateIsVisibleByStyle(true);
    }
  };

  componentDidUpdate = async (prevProps: Props) => {
    if (prevProps.transitionSpeed !== this.props.transitionSpeed) this.setMillisecondTransition();
    if (prevProps.animationDelay !== this.props.animationDelay) this.setMillisecondDelay();
    if (prevProps.movePoints !== this.props.movePoints) this.setMovePoints();
    if (this.props.isVisible !== undefined && prevProps.isVisible !== this.props.isVisible)
      this.updateIsVisibleByStyle(this.props.isVisible);
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

  updateIsVisibleByStyle(isVisible: boolean) {
    if (!isVisible) {
      if (this.props.animationType) this.triggerAnimation(this.props.animationType);
      else this.triggerAnimation('opacity');
    } else {
      this.setState({ isVisibleInRender: true });
      this.triggerAnimation('appear');
    }
  }

  async setInitialPositionByStyle() {
    const { isVisible, disableOpacityAnimation, animationMode } = this.props;
    const { movePoints } = this.state;
    let animationType: 'appear' | IAnimationType;

    if (isVisible) animationType = 'appear';
    else animationType = this.props.animationType || 'opacity';

    const newStyles = AnimateConfig.getAnimationType(animationType, movePoints, animationMode);
    await this.styleOpacityValue.setValue(disableOpacityAnimation ? 1 : newStyles.opacity);
    await this.styleAxisXValue.setValue(newStyles.axisX);
    await this.styleAxisYValue.setValue(newStyles.axisY);
  }

  async setMovePoints() {
    let { movePoints } = this.props;
    if (movePoints === undefined) movePoints = AnimateConfig.movePoints;
    await this.setState({ movePoints });
  }

  triggerAnimation(animationType: 'appear' | IAnimationType) {
    const { transitionMillisecond, delayMillisecond, movePoints } = this.state;
    const { styleOpacityValue, styleAxisXValue, styleAxisYValue } = this;
    const { animationMode, disableOpacityAnimation } = this.props;
    const newStyleValues = AnimateConfig.getAnimationType(animationType, movePoints, animationMode);
    const useNativeDriver = animationMode !== 'pushFlex';

    if (!disableOpacityAnimation) {
      Animated.timing(styleOpacityValue, {
        toValue: newStyleValues.opacity,
        delay: delayMillisecond,
        duration: transitionMillisecond,
        useNativeDriver,
      }).start();
    }

    Animated.timing(styleAxisXValue, {
      toValue: newStyleValues.axisX,
      delay: delayMillisecond,
      duration: transitionMillisecond,
      useNativeDriver,
    }).start();

    Animated.timing(styleAxisYValue, {
      toValue: newStyleValues.axisY,
      delay: delayMillisecond,
      duration: transitionMillisecond,
      useNativeDriver,
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
    } else {
      if (this.props.animateCallbackFn) this.props.animateCallbackFn(true);
    }
  }

  getAnimatedStyle() {
    const { animationMode, animationType } = this.props;
    let animatedStyle: Record<string, any> = {};

    switch (animationMode) {
      case 'pushFlex':
        switch (animationType) {
          case 'slideDown':
            animatedStyle = { marginTop: this.styleAxisYValue };
            break;
          case 'slideUp':
            animatedStyle = { marginBottom: this.styleAxisYValue };
            break;
          case 'slideLeft':
            animatedStyle = { marginRight: this.styleAxisXValue };
            break;
          case 'slideRight':
            animatedStyle = { marginLeft: this.styleAxisXValue };
            break;
          default:
            return {};
        }
        break;

      default:
        animatedStyle = { transform: [{ translateX: this.styleAxisXValue }, { translateY: this.styleAxisYValue }] };
    }

    animatedStyle.opacity = this.styleOpacityValue;
    return animatedStyle;
  }

  render() {
    const animatedStyle = this.getAnimatedStyle();
    let invisibleStyle = {};
    let pointerEvents = undefined;

    if (!this.state.isVisibleInRender && !this.props.neverRemove) {
      invisibleStyle = { display: 'none' };
      pointerEvents = 'none';
    }

    return (
      <Animated.View
        {...this.props}
        pointerEvents={pointerEvents}
        style={[this.props.style || {}, animatedStyle, invisibleStyle]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

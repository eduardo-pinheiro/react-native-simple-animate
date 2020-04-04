import React from 'react';
import { AnimateConfig } from './AnimateConfig';
import { Animated, ViewProps } from 'react-native';
import { IAnimationType, ITransitionSpeed, IAnimationDelay } from './AnimateTypes';

export interface AnimateProps {
  isVisible?: boolean; // Default appear behavior
  animationType?: IAnimationType; // Default "opacity"
  animationDelay?: IAnimationDelay; // Default undefined
  transitionSpeed?: ITransitionSpeed; // Default "regular"
  animateCallbackFn?: (isVisibleInRender?: boolean) => void; // Default undefined
  movePoints?: number; // Default AnimateConfig.movePoints
  neverRemoveFromRender?: boolean; // Default false
}

type Props = AnimateProps & ViewProps;

interface State {
  isVisibleInRender: boolean;
  transitionMillisecond: number;
  delayMillisecond: number | undefined;
  movePoints: number;
}

export class Animate extends React.Component<Props, State> {
  styleOpacityValue: Animated.Value = new Animated.Value(this.props.neverRemoveFromRender ? 1 : 0);
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
    const { isVisible, neverRemoveFromRender } = this.props;
    const { movePoints } = this.state;
    let animationType: 'appear' | IAnimationType;

    if (isVisible) animationType = 'appear';
    else animationType = this.props.animationType || 'opacity';

    const newStyles = AnimateConfig.getAnimationType(animationType, movePoints);
    await this.styleOpacityValue.setValue(neverRemoveFromRender ? 1 : newStyles.opacity);
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
    const newStyleValues = AnimateConfig.getAnimationType(animationType, movePoints);

    if (!this.props.neverRemoveFromRender) {
      Animated.timing(styleOpacityValue, {
        toValue: newStyleValues.opacity,
        delay: delayMillisecond,
        duration: transitionMillisecond,
        useNativeDriver: true,
      }).start();
    }

    Animated.timing(styleAxisXValue, {
      toValue: newStyleValues.axisX,
      delay: delayMillisecond,
      duration: transitionMillisecond,
      useNativeDriver: true,
    }).start();

    Animated.timing(styleAxisYValue, {
      toValue: newStyleValues.axisY,
      delay: delayMillisecond,
      duration: transitionMillisecond,
      useNativeDriver: true,
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

  render() {
    if (!this.state.isVisibleInRender && !this.props.neverRemoveFromRender) return null;
    return (
      <Animated.View
        {...this.props}
        style={[
          this.props.style || {},
          {
            opacity: this.styleOpacityValue,
            transform: [{ translateX: this.styleAxisXValue }, { translateY: this.styleAxisYValue }],
          },
        ]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

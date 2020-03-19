import React from 'react';
import { AnimateConfig } from './AnimateConfig';
import { Animated, ViewStyle } from 'react-native';
import { IAnimationType, ITransitionSpeed } from './AnimationTypes';

interface Props {
  isVisible?: boolean;
  animationType?: IAnimationType;
  transitionSpeed?: ITransitionSpeed;
  transitionMillisecond?: number;
  style?: ViewStyle;
  tagName?: string;
  animateCallbackFn?: Function | any;
}

interface State {
  isVisibleByDom: boolean;
  transitionMillisecond: number;
}

export class Animate extends React.Component<Props, State>{

  styleOpacityValue: Animated.Value = new Animated.Value(1);
  styleTranslateYValue: Animated.Value = new Animated.Value(0);
  styleTranslateXValue: Animated.Value = new Animated.Value(0);

  constructor(props: Props) {
    super(props);
    this.state = {
      isVisibleByDom: false,
      transitionMillisecond: AnimateConfig.millisecondTransitionRegular,
    }
  }

  componentDidMount = async () => {
    this.setInitialPositionByStyle();

    if (this.props.isVisible !== undefined) {
      const isVisibleByDom = this.props.isVisible;
      this.updateIsVisibleByStyle(isVisibleByDom);
      this.setState({ isVisibleByDom });
      this.setMillisecondTransition();
    } else {
      this.updateIsVisibleByStyle(true);
    }
  }

  componentDidUpdate = async (prevProps: Props) => {
    if (this.props.isVisible !== undefined && prevProps.isVisible !== this.props.isVisible) {
      this.updateIsVisibleByStyle(this.props.isVisible);
    }

    if (
      prevProps.transitionSpeed !== this.props.transitionSpeed ||
      prevProps.transitionMillisecond !== this.props.transitionMillisecond
    ) {
      this.setMillisecondTransition();
    }
  }

  setMillisecondTransition() {
    let transitionMillisecond = this.props.transitionMillisecond;
    if (!transitionMillisecond && transitionMillisecond !== 0) {
      switch (this.props.transitionSpeed) {
        case 'slow':
          transitionMillisecond = AnimateConfig.millisecondTransitionSlow;
          break;
        case 'regular':
          transitionMillisecond = AnimateConfig.millisecondTransitionRegular;
          break;
        case 'fast':
          transitionMillisecond = AnimateConfig.millisecondTransitionFast;
          break;
        default:
          transitionMillisecond = AnimateConfig.millisecondTransitionRegular;
      }
    }
    this.setState({ transitionMillisecond });
  }

  async updateIsVisibleByStyle(isVisible: boolean) {
    if (!isVisible) {
      if (this.props.animationType) this.triggerAnimation(this.props.animationType);
      else this.triggerAnimation("opacity");
    } else {
      await this.setState({ isVisibleByDom: true });
      this.triggerAnimation("appear");
    }
  }

  setInitialPositionByStyle() {
    let animationType: 'appear' | IAnimationType;

    if (this.props.isVisible) animationType = 'appear';
    else animationType = "opacity" || this.props.animationType;

    const newStyles = AnimateConfig.animationType[animationType];
    this.styleOpacityValue.setValue(newStyles.opacity);
    this.styleTranslateXValue.setValue(newStyles.translateX);
    this.styleTranslateYValue.setValue(newStyles.translateY);
  }

  triggerAnimation(animationType: 'appear' | IAnimationType) {
    const { transitionMillisecond } = this.state;

    let {
      styleOpacityValue,
      styleTranslateXValue,
      styleTranslateYValue,
    } = this;

    const newStyles = AnimateConfig.animationType[animationType];

    Animated.timing(styleOpacityValue, {
      toValue: newStyles.opacity,
      duration: transitionMillisecond,
    }).start();

    Animated.timing(styleTranslateXValue, {
      toValue: newStyles.translateX,
      duration: transitionMillisecond,
    }).start();

    Animated.timing(styleTranslateYValue, {
      toValue: newStyles.translateY,
      duration: transitionMillisecond,
    }).start(() => {
      //Esse callback poderia estar em qualquer uma das funções de start acima
      this.updateIsVisibleByDom();
    });
  }

  updateIsVisibleByDom() {
    if (this.props.isVisible !== undefined) {
      const isVisibleByDom = this.props.isVisible;
      if (this.props.animateCallbackFn) this.props.animateCallbackFn(isVisibleByDom);
      this.setState({ isVisibleByDom });
    }
  }

  render() {
    if (!this.state.isVisibleByDom) return null;
    return (
      <Animated.View style={[this.props.style || {}, {
        opacity: this.styleOpacityValue,
        translateX: this.styleTranslateXValue,
        translateY: this.styleTranslateYValue,
      }]}>
        {this.props.children}
      </Animated.View>
    )
  }
}
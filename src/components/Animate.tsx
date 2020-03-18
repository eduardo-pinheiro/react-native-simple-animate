import React from 'react';
import { AnimateConfig } from './AnimateConfig';
import { View, Animated, ViewStyle } from 'react-native';

interface Props {
  isVisible?: boolean;
  animeDirection?: 'just_opacity' | 'down' | 'up' | 'left' | 'right';
  transitionType?: 'slow' | 'regular' | 'fast';
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
  
  styleOpacityValue: Animated.Value;
  styleTranslateYValue: Animated.Value;
  styleTranslateXValue: Animated.Value;
  
  constructor(props: Props) {
    super(props);

    this.styleOpacityValue = new Animated.Value(0),
    this.styleTranslateYValue = new Animated.Value(0),
    this.styleTranslateXValue = new Animated.Value(0),

    this.state = {
      isVisibleByDom: false,
      transitionMillisecond: AnimateConfig.millisecondTransitionRegular,
    }
  }

  componentDidMount = async () => {
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
      prevProps.transitionType !== this.props.transitionType ||
      prevProps.transitionMillisecond !== this.props.transitionMillisecond
    ) {
      this.setMillisecondTransition();
    }
  }

  setMillisecondTransition() {
    let transitionMillisecond = this.props.transitionMillisecond;
    if (!transitionMillisecond && transitionMillisecond !== 0) {
      switch (this.props.transitionType) {
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
      if (this.props.animeDirection) this.triggerAnimation(this.props.animeDirection);
      else this.triggerAnimation("just_opacity");
    } else {
      await this.setState({ isVisibleByDom: true });
      //Testar se funciona sem o Timeout
      setTimeout(() => {
        this.triggerAnimation("appear");
      });
    }
  }

  triggerAnimation(animeDirection: 'appear' | 'just_opacity' | 'down' | 'up' | 'left' | 'right') {
    const { transitionMillisecond } = this.state;

    let {
      styleOpacityValue,
      styleTranslateXValue,
      styleTranslateYValue,
    } = this;

    const newStyles = AnimateConfig.animeDirection[animeDirection];

    console.log("Antes");
    console.log("animeDirection", animeDirection);
    console.log("newStyles", newStyles);
    console.log("toValue", newStyles.opacity);
    console.log("duration", transitionMillisecond);
    
    Animated.timing(styleOpacityValue, {
      toValue: newStyles.opacity,
      duration: transitionMillisecond,
    }).start();

    console.log("Depois");

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
      //@ts-ignore
      <View style={[ this.props.style || {}, {
        opacity: this.styleOpacityValue,
        translateX: this.styleTranslateXValue,
        translateY: this.styleTranslateYValue,
      }]}>
        {this.props.children}
      </View>
    )
  }
}
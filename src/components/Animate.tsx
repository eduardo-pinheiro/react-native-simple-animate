import React from 'react';
import { AnimateConfig } from './AnimateConfig';

interface Props {
  isVisible?: boolean;
  animeDirection?: 'just_opacity' | 'down' | 'up' | 'left' | 'right';
  transitionType?: 'slow' | 'regular' | 'fast';
  transitionMillisecond?: number;
  style?: Object;
  tagName?: string;
  animateCallbackFn?: Function | any;
}

interface State {
  isVisibleByDom: boolean;
  visibleStyle: Object;
  transitionMillisecond: number;
}

export class Animate extends React.Component<Props, State>{

  constructor(props: Props) {
    super(props);
    this.state = {
      isVisibleByDom: false,
      transitionMillisecond: AnimateConfig.millisecondTransitionRegular,
      visibleStyle: {},
    }
  }

  componentDidMount = async () => {
    if (this.props.isVisible !== undefined) {
      const isVisibleByDom = this.props.isVisible;
      this.updateIsVisibleByStyle(isVisibleByDom);
      this.setState({ isVisibleByDom });
      this.setMillisecondTransition();
    } else {
      this.updateIsVisibleByStyle(false);
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
      let visibleStyle = AnimateConfig.animeDirection.just_opacity;
      if (this.props.animeDirection) visibleStyle = AnimateConfig.animeDirection[this.props.animeDirection];
      this.setState({ visibleStyle });
    } else {
      await this.setState({ isVisibleByDom: true });
      setTimeout(() => {
        this.setState({ visibleStyle: {} });
      });
    }
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
    const Tag = this.props.tagName || 'div';
    return (
      //@ts-ignore
      <Tag
        onTransitionEnd={() => this.updateIsVisibleByDom()}
        style={Object.assign(
          { 'transition': this.state.transitionMillisecond / 1000 + 's' },
          this.state.visibleStyle,
          this.props.style || {},
        )}
      >
        {this.props.children}
      </Tag>
    )
  }
}
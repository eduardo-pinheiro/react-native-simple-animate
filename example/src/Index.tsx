import React from 'react';
import { Animate } from './reactComponentLib';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default class Index extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { isVisible: false };
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.setState({ isVisible: !this.state.isVisible })}>
          <Text>{`click to ${this.state.isVisible ? 'hide' : 'show'}`}</Text>
        </TouchableOpacity>
        <View style={styles.wrapperAnimate}>
          <Animate
            isVisible={this.state.isVisible}
            animationType="slideUp"
            transitionSpeed="fast"
            animateCallbackFn={isVisibleInRender => console.log('isVisibleInRender:', isVisibleInRender)}
            unmountComponentWhenInvisible={true}
            /*View Props*/
            style={styles.animate}
          >
            <Text style={styles.text}>CONTEND</Text>
          </Animate>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  wrapperAnimate: {
    height: 50,
  },
  animate: {
    backgroundColor: '#333333',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    color: '#ffffff',
  },
});

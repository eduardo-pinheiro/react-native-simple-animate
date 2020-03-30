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
            // animationDelay={500}
            transitionSpeed="fast"
            animateCallbackFn={isVisibleInRender => console.log('isVisibleInRender:', isVisibleInRender)}
            /*View Props*/
            style={styles.animate}
          >
            <View style={styles.textWrapper}>
              <Text style={styles.text}>CONTEND</Text>
            </View>
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
    flex: 1,
    backgroundColor: '#333333',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textWrapper: {
    flex: 1,
  },
  text: {
    color: '#ffffff',
  },
});

import React from 'react';
import { Animate } from './reactComponentLib';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default class Index extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.setState({ isVisible: !this.state.isVisible })}>
          <Text>{`click to ${this.state.isVisible ? 'hide' : 'show'}`}</Text>
        </TouchableOpacity>
        <View style={styles.wrapperAnimate}>
          <Animate
            isVisible={this.state.isVisible} // Default appear behavior
            animationType="slideUp" // Default "opacity"
            animationDelay={undefined} // Default undefined
            transitionSpeed="slow" // Default "regular"
            animateCallbackFn={isVisibleInRender => console.log('isVisibleInRender:', isVisibleInRender)} // Default undefined
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

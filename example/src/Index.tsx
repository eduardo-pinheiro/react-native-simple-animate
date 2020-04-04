import React from 'react';
import { Animate } from './reactComponentLib';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default class Index extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isVisibleOne: false,
      isVisibleTwo: false,
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => this.setState({ isVisibleOne: !this.state.isVisibleOne })}>
            <Text>{`click to ${this.state.isVisible ? 'hide' : 'show'}`}</Text>
          </TouchableOpacity>
          <View style={styles.wrapperAnimate}>
            <Animate
              isVisible={this.state.isVisibleOne}
              animationType="slideUp"
              animationDelay="slow"
              transitionSpeed={2000}
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
        <View style={{ flex: 1, padding: 15, flexDirection: 'row' }}>
          <Animate
            isVisible={this.state.isVisibleTwo}
            animationType="slideRight"
            animationDelay={0}
            animationMode="translate"
            transitionSpeed="regular"
            animateCallbackFn={isVisibleInRender => console.log('isVisibleInRender:', isVisibleInRender)}
            axisValues={{ onScreen: 0, outScreen: 15 }}
            /*View Props*/
            style={{ height: 50, width: 10, backgroundColor: '#000', marginRight: 5 }}
          />
          <TouchableOpacity
            style={{ flex: 1, maxHeight: 50, backgroundColor: '#c7c7c7' }}
            onPress={() => this.setState({ isVisibleTwo: !this.state.isVisibleTwo })}
          >
            <Text>{`click to ${this.state.isVisible ? 'hide' : 'show'}`}</Text>
          </TouchableOpacity>
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

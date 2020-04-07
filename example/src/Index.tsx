import React from 'react';
import { Animate } from './reactComponentLib';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';

export default class Index extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isVisibleTranslate: false,
      isVisiblePushFlex: false,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.translateWrapper}>
          <TouchableOpacity
            style={styles.translateButton}
            onPress={() => this.setState({ isVisibleTranslate: !this.state.isVisibleTranslate })}
          >
            <Text>{`click to ${this.state.isVisibleTranslate ? 'hide' : 'show'}`}</Text>
          </TouchableOpacity>
          <Animate
            isVisible={this.state.isVisibleTranslate} // Default appear behavior
            animationType="slideUp" // Default "opacity"
            animationDelay="equalTransitionSpeed" // Default undefined
            transitionSpeed="fast" // Default "regular"
            movePoints={undefined} // Default AnimateConfig.movePoints
            disableOpacityAnimation={undefined} // Default false
            neverRemoveFromRender={undefined} // Default false
            animateCallbackFn={isVisibleInRender => console.log('isVisibleInRender:', isVisibleInRender)} // Default undefined
          >
            <View style={styles.translateContent}>
              <Text style={styles.translateContentText}>CONTEND</Text>
            </View>
          </Animate>
        </View>

        <View style={styles.pushFlexWrapper}>
          <TouchableOpacity
            style={styles.pushFlexButton}
            onPress={() => this.setState({ isVisiblePushFlex: !this.state.isVisiblePushFlex })}
          >
            <Text>{`click to ${this.state.isVisiblePushFlex ? 'hide' : 'show'}`}</Text>
          </TouchableOpacity>
          <Animate
            isVisible={this.state.isVisiblePushFlex} // Default appear behavior
            animationType="slideLeft" // Default "opacity"
            // animationDelay="equalTransitionSpeed" // Default undefined
            // transitionSpeed="slow" // Default "regular"
            movePoints={110} // Default AnimateConfig.movePoints
            disableOpacityAnimation={undefined} // Default false
            neverRemoveFromRender={undefined} // Default false
            animateCallbackFn={isVisibleInRender => console.log('isVisibleInRender:', isVisibleInRender)} // Default undefined
          >
            <View style={styles.pushFlexContent}>
              <Text style={styles.pushFlexContentText}>CONTEND</Text>
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
    paddingTop: StatusBar.currentHeight,
  },

  translateWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  translateButton: {
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf1f4',
  },
  translateContent: {
    width: 100,
    height: 100,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  translateContentText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  pushFlexWrapper: {
    flex: 1,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pushFlexButton: {
    flex: 1,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf1f4',
  },
  pushFlexContent: {
    width: 100,
    marginLeft: 10,
    height: 100,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pushFlexContentText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

import React from 'react';
import { SimpleTest } from './reactComponentLib';
import { View, StyleSheet } from 'react-native';

export default class Index extends React.Component<any, any>{
  render() {
    return (
      <View style={styles.container}>
        <SimpleTest
          text="Funcionaaandu"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }
});
import React from 'react';
import { Animate } from './reactComponentLib';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default class Index extends React.Component<any, any>{

  constructor(props: any) {
    super(props);
    this.state = {
      isVisible: true,
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.setState({ isVisible: !this.state.isVisible })}>
          <Text>{this.state.isVisible ? 'Esconder' : 'Mostrar'}</Text>
        </TouchableOpacity>
        <Animate 
          isVisible={this.state.isVisible}
          animeDirection="just_opacity"
        >
          <Text>conteudo a ser animado</Text>
        </Animate>
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
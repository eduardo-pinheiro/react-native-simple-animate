import React, { Component } from 'react';
import { Animate } from './reactComponentLib';

interface State {
  isVisible: boolean;
}

class App extends Component<any, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      isVisible: false,
    }
  }

  render() {
    return (
      <div>
        <Animate
          isVisible={this.state.isVisible}
        >
          conteudo a ser animado
        </Animate>
        <div onClick={() => this.setState({ isVisible: !this.state.isVisible })}>
          {this.state.isVisible ? 'Esconder' : 'Mostrar'}
        </div>
      </div>
    );
  }
}

export default App;
import React from 'react';
import { Text } from 'react-native';

interface Props {
  text: string;
}

export class SimpleTest extends React.Component<Props, any>{

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Text>{this.props.text}</Text>
    )
  }
}
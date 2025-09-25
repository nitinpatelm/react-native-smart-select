import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

// Define the type for our component props
interface MyComponentProps { }

// Define the type for our component state
interface MyComponentState {
  country: any[];
}

// Class component
class MyComponent extends React.Component<MyComponentProps, MyComponentState> {
  constructor(props: MyComponentProps) {
    super(props);
    this.state = {
      country: [],
    };
  }

  // Event handler
  setCountry(country: any) {
    this.setState({
      country,
    });
  }

  render() {
    const { country } = this.state;

    return (
      <View style={styles.container}>
        <Text>{country.length}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyComponent;

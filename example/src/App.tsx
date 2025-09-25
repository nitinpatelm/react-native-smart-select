/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { CustomComponent } from 'react-native-smart-select';

export default function App() {

  return (
    <SafeAreaView>
      <ScrollView>
        <CustomComponent></CustomComponent>
      </ScrollView>
    </SafeAreaView>
  );
}

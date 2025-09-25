
[![NPM](https://nodei.co/npm/react-native-smart-select.png?downloads=true)](https://nodei.co/npm/react-native-smart-select/)

[![npm version](https://badge.fury.io/js/react-native-smart-select.svg)](https://badge.fury.io/js/react-native-smart-select) [![GitHub stars](https://img.shields.io/github/stars/nitinpatelm/react-native-smart-select?style=social)](https://github.com/nitinpatelm/react-native-smart-select/stargazers)

# react-native-smart-select

Smart and flexible select component for React Native with support for single and multiple selections.


## Installation

With npm

```sh
npm install react-native-smart-select
```

With yarn

```sh
yarn add react-native-smart-select
```

## Authors

- [@nitinpatelm](https://www.github.com/nitinpatelm)


## Usage/Examples

```javascript
import { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SelectField, MultiSelectField } from 'react-native-smart-select';

const App = () => {
  // Single select - string values
  const [selectedFruit, setSelectedFruit] = useState<string | null>(null);

  // Single select - number values
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Multi select - string values
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);

  // Multi select - number values
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fruitOptions = [
    { label: '🍎 Apple', value: 'apple' },
    { label: '🍌 Banana', value: 'banana' },
    { label: '🍊 Orange', value: 'orange' },
  ];

  const idOptions = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
  ];

  const hobbyOptions = [
    { label: 'Reading', value: 'reading' },
    { label: 'Gaming', value: 'gaming' },
    { label: 'Sports', value: 'sports' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Single Select with string values */}
      <SelectField
        options={fruitOptions}
        selectedValue={selectedFruit}
        onValueChange={(v: any) => setSelectedFruit(v)}
        placeholder="Choose a fruit"
        label="Single Select (String)"
      />

      {/* Single Select with number values */}
      <SelectField
        options={idOptions}
        selectedValue={selectedId}
        onValueChange={(v: any) => setSelectedId(v)}
        placeholder="Choose an option"
        label="Single Select (Number)"
      />

      {/* Multi Select with string values */}
      <MultiSelectField
        multiple={true}
        options={hobbyOptions}
        selectedValue={selectedHobbies}
        onValueChange={(v: any) => setSelectedHobbies(v)}
        placeholder="Select hobbies"
        label="Multi Select (String)"
      />

      {/* Multi Select with number values */}
      <MultiSelectField
        options={idOptions}
        selectedValue={selectedIds}
        onValueChange={(v: any) => setSelectedIds(v)}
        placeholder="Select options"
        label="Multi Select (Number)"
        multiple={true}
      />

      {/* Inline multi select (using multiple prop directly) */}
      <SelectField
        multiple={true}
        options={hobbyOptions}
        selectedValue={selectedHobbies}
        onValueChange={(v: any) => setSelectedHobbies(v)}
        placeholder="Inline multi select"
        label="Inline Multi Select"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f5f5f5',
  },
});

export default App;

```


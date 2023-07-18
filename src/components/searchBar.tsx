import {View, TextInput, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import GlobalSizes from '../constants/sizes/globalSizes';

export default function SearchBar(props: {onChangeTextFunc: any}) {
  const text = '';
  return (
    <View style={styles.textInputView}>
      <Icon name="search" color={'gray'} style={{marginLeft: 10}} size={15} />
      <TextInput
        style={styles.input}
        onChangeText={newText => props.onChangeTextFunc(newText)}
        placeholder="Search"
        value={text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textInputView: {
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    height: GlobalSizes.heightAllScreen / 25,
    width: GlobalSizes.widthAllScreen - GlobalSizes.widthAllScreen / 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
    marginVertical: 10,
    backgroundColor: 'black',
    marginRight: GlobalSizes.widthAllScreen / 22,
  },
});

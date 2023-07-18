import {View, Text, Image} from 'react-native';
import React from 'react';

export default function CustomImageComponent(props: {imageUri: String}) {
  return (
    <View>
      <Image
        source={{uri: props.imageUri}}
        style={{height: 61, width: 61, borderRadius: 30}}
      />
    </View>
  );
}

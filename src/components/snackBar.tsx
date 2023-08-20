import {View, Text, Alert} from 'react-native';
import React from 'react';

export default function snackBar(
  header: string,
  subtitle: string,
  getPurchaseFunction?: Function,
) {
  return Alert.alert(header, subtitle, [
    {
      text: 'Cancel',
      onPress: () => {},
      style: 'cancel',
    },
    {text: 'Get Purchase', onPress: () => getPurchaseFunction},
  ]);
}

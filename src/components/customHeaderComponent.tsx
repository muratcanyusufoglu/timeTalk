import {View, Dimensions, Image, Text} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
const window = Dimensions.get('window');
export default function CustomHeaderComponent() {
  return (
    <View style={{
        padding: 10,
      }}>
      <View
        style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,
            flexDirection: 'row',
          }}>
        <Icon
          name="search"
          color={'white'}
          style={{marginLeft: 10}}
          size={18}
        />
        <Image
          source={require('../assets/photos/appIcon.png')}
          style={{height: window.height / 19, width: window.height / 20}}
        />
        <Icon name="bars" color={'white'} style={{marginLeft: 10}} size={18} />
      </View>
      <View
          style={{
            borderWidth: 0.9,
            borderColor: '#4B4B4B',
          }}
        />
    </View>
  );
}

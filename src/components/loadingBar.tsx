import {View, StyleSheet} from 'react-native';
import React from 'react';
import Lottie from 'lottie-react-native';
import GlobalSizes from '../constants/sizes/globalSizes';

export default function LoadingBar() {
  return (
    <View>
      <Lottie
        source={require('../assets/animations/messageLoad.json')}
        style={styles.animationLoading}
        autoPlay
        loop
      />
    </View>
  );
}

const styles = StyleSheet.create({
  animationLoading: {
    width: 50,
    height: 50,
  },
});

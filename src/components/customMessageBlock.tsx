import {View, Text, Dimensions, StyleSheet} from 'react-native';
import React from 'react';
import CustomImageComponent from './customImageComponent';
import {GlobalColors} from '../constants/colors/globalColors';

const window = Dimensions.get('window');

export default function CustomMessageBlock(item: any) {
  return (
    <View style={styles.messageSection}>
      <View style={styles.sendingMessageStyle}>
        <View style={styles.sendedSection}>
          <Text style={styles.messageTextStyle}>{item.message}</Text>
        </View>
        <View style={{justifyContent: 'flex-end'}}>
          <CustomImageComponent
            imageUri={'https://reactnative.dev/img/tiny_logo.png'}
          />
        </View>
      </View>
      <View style={styles.incomingMessageStyle}>
        <View style={{justifyContent: 'flex-start'}}>
          <CustomImageComponent
            imageUri={'https://reactnative.dev/img/tiny_logo.png'}
          />
        </View>
        <View style={styles.responsSection}>
          <Text style={styles.messageTextStyle}>{item.response}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageSection: {
    margin: 5,
  },
  sendedSection: {
    backgroundColor: GlobalColors.sendingMessageSectionColor,
    marginLeft: window.width / 2.5,
    padding: 15,
    marginBottom: 30,
    borderRadius: 10,
    borderBottomRightRadius: 0,
    marginHorizontal: 5,
  },
  responsSection: {
    backgroundColor: GlobalColors.incomingMessageSectionColor,
    marginRight: window.width / 2.5,
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    borderTopLeftRadius: 0,
  },
  messageTextStyle: {
    color: GlobalColors.messageTextColor,
  },
  incomingMessageStyle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  sendingMessageStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

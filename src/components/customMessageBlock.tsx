import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomImageComponent from './customImageComponent';
import {GlobalColors} from '../constants/colors/globalColors';
import Share from 'react-native-share';
import localusers from '../assets/localusers';

const window = Dimensions.get('window');

const shareContent = async (item: any, person: string) => {
  try {
    const shareOptions = {
      message: `${person} : ${item.response}`,
      url: 'https://apps.apple.com/',
    };
    await Share.open(shareOptions);
  } catch (error) {
    console.error('Error sharing:', error);
  }
};

export default function CustomMessageBlock(
  item: any,
  person: string,
  userPhoto: string,
  wisdomPhoto: string,
) {
  console.log('imaaaaaggeeeeuuurrrll', wisdomPhoto);
  return (
    <View style={styles.messageSection}>
      <View style={styles.sendingMessageStyle}>
        <View style={styles.sendedSection}>
          <Text style={styles.messageTextStyle}>{item.message}</Text>
        </View>
        <View style={{justifyContent: 'flex-end'}}>
          <CustomImageComponent imageUri={userPhoto} />
        </View>
      </View>
      <View style={styles.incomingMessageStyle}>
        <View style={{justifyContent: 'flex-start'}}>
          <CustomImageComponent imageUri={wisdomPhoto} />
        </View>
        <Pressable
          style={styles.responsSection}
          onLongPress={() => shareContent(item, person)}>
          <Text style={styles.messageTextStyle}>{item.response}</Text>
        </Pressable>
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

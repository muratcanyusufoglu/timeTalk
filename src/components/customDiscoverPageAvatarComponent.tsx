import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
const window = Dimensions.get('window');

export default function CustomDiscoverPageAvatarComponent(item: any) {
  const navigation = useNavigation();
  const data = item.item;
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ChatPage', {whom: data.username})}>
      <View style={styles.photoSection}>
        <ImageBackground
          source={{uri: data.photoUrl}}
          imageStyle={{borderRadius: 6}}
          style={
            data.userId % 4 == 1 || data.userId % 4 == 0
              ? styles.flatlistImages
              : styles.flatlistImagesOne
          }>
          <View style={styles.textSection}>
            <Text style={styles.userNameText}>{data.username}</Text>
            <Text style={styles.userInfoText}>{data.userInfo}</Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  userNameText: {
    color: 'black',
    fontSize: 12,
    textAlign: 'right',
    fontWeight: '600',
    marginRight: 2,
  },
  userInfoText: {
    color: 'black',
    fontSize: 10,
    textAlign: 'right',
    marginRight: 2,
  },
  textSection: {
    position: 'absolute',
    bottom: 0,
    height: window.height / 20,
    width: window.width / 2.4,
    backgroundColor: '#D9D9D9',
    opacity: 0.7,
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  photoSection: {
    marginVertical: 20,
    alignItems: 'center',
  },
  flatlistImagesOne: {
    width: window.width / 2.4,
    height: window.height / 4,
  },
  flatlistImages: {
    width: window.width / 2.4,
    height: window.height / 3,
  },
});

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ImageBackground,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import nameList from '../assets/localusers';
import {categories} from '../assets/categories';
import Icon from 'react-native-vector-icons/FontAwesome';
import {MasonryFlashList} from '@shopify/flash-list/dist/MasonryFlashList';
import {FlatList} from 'react-native-gesture-handler';
import {TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import storage from '../storage/storage';
import {messageInterface, UserInfoProp} from '../props/generalProp';
import ChatService from '../services/chatService';

const window = Dimensions.get('window');

interface messageInfo {
  whom: number;
  user: string;
  response: string;
  date: string;
}

export default function TimeLine() {
  const [bool, setBool] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);
  const [messageData, setmessageData] = useState<Array<messageInfo>>();
  const [userInfo, setUserInfo] = useState<UserInfoProp>();

  const chatServices = new ChatService();
  const navigation = useNavigation();

  const messageDataArray: {
    message: string;
    user: string;
    date: string;
    whom: string;
    response: string;
  }[] = [];

  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      storage
        .load({
          key: 'userInfo',
        })
        .then(async resp => {
          setUserInfo(resp);
          console.log('respaaa', userInfo);
          await chatServices
            .getLastMessages(resp.user.id)
            .then(respChat => {
              respChat.data.map((mes: messageInterface) =>
                messageDataArray.push(mes),
              );
              setmessageData(messageDataArray.reverse());
            })
            .catch(error => console.log('error', error));
        });
    };
    setLoading(false);

    fetch();
  }, [bool]);

  return (
    <SafeAreaView style={styles.container}>
      <MasonryFlashList
        extraData={messageData}
        data={messageData}
        refreshing={bool}
        style={{flex: 1}}
        estimatedItemSize={200}
        renderItem={({item}) => (
          <>
            <View>
              <TouchableOpacity
                onPress={
                  () => console.log('object') //navigation.navigate('Chat', {whom: item.username})
                }>
                <View style={styles.viewMessages}>
                  <Image
                    source={require('../assets/photos/mariecurie.png')}
                    style={styles.photoStyle}
                  />
                  <View style={styles.messageSlot}>
                    <View style={styles.textSection}>
                      <Text style={styles.userNameText}>{item.whom}</Text>
                      <Text style={styles.dateInfoText}>{item.date}</Text>
                    </View>
                    <View>
                      <Text numberOfLines={2} style={styles.responseInfoText}>
                        {item.response}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  alignItems: 'center',
                }}
              />
              <View
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  width: window.width / 1.1,
                }}
              />
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23242B',
    width: window.width,
    height: window.height,
  },
  photoStyle: {
    height: window.width / 6,
    width: window.width / 6,
    borderRadius: window.width / 12,
    alignItems: 'center',
  },
  messageSlot: {
    flex: 1,
  },

  messageSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  userNameText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 5,
  },
  dateInfoText: {
    color: 'white',
    fontSize: 13,
    textAlign: 'right',
    marginRight: 2,
  },
  responseInfoText: {
    color: 'white',
    fontSize: 13,
    textAlign: 'left',
    marginLeft: 5,
  },
  textSection: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
  },
  animation: {
    alignItems: 'center',
    justifyContent: 'center',
    width: window.width / 15,
    height: window.height / 15,
  },
  sendMessageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
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
    height: window.height / 25,
    width: window.width - window.width / 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
    marginVertical: 10,
    backgroundColor: 'black',
    marginRight: window.width / 22,
  },
  sendMessageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: window.width / 8,
    height: 48,
    borderWidth: 1,
    borderColor: '#D6DAE2',
    borderRadius: 4,
  },
  photoPrompt: {
    width: window.width / 2,
    borderWidth: 1,
    color: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 0,
  },
  photoDescription: {
    borderWidth: 1,
    color: 'black',
    flex: 4,
  },
  viewMessages: {
    margin: 10,
    alignItems: 'center',
    flexDirection: 'row',
    width: window.width / 1.1,
  },
  flatlistImagesOne: {
    width: window.width / 2.4,
    height: window.height / 4,
  },
  flatlistImages: {
    width: window.width / 2.4,
    height: window.height / 3,
  },
  categoriesStyle: {
    width: window.width / 4,
    height: window.height / 20,
    backgroundColor: '#E1CEF4',
    borderRadius: 7,
  },
  categoriesView: {
    marginHorizontal: window.width / 24,
  },
});

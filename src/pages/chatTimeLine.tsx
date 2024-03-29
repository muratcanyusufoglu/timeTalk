import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {messageInterface, UserInfoProp} from '../props/generalProp';
import ChatService from '../services/chatService';
import {GlobalColors} from '../constants/colors/globalColors';
import storage from '../storage/storage';
import SearchBar from '../components/searchBar';
import {useIsFocused} from '@react-navigation/native';
import localusers from '../assets/localusers';
import Toast from 'react-native-toast-message';
import CustomImageComponent from '../components/customImageComponent';
import CustomHeaderComponent from '../components/customHeaderComponent';
import {SafeAreaView} from 'react-native-safe-area-context';

const window = Dimensions.get('window');

interface messageInfo {
  whom: number;
  user: string;
  response: string;
  date: string;
}

export default function TimeLine() {
  const [bool, setBool] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>();
  const [messageData, setmessageData] = useState<Array<messageInfo>>();
  const [userInfo, setUserInfo] = useState<UserInfoProp>();
  const [searchText, setSearchText] = useState<String>();

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const chatServices = new ChatService();

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
    fetch();
    setLoading(false);
  }, [loading, isFocused]);

  let imageAdress: string;
  function insideFlatlist(item: any) {
    const dateFormat = new Date(parseInt(item.date));

    localusers.nameList.map(localUsers => {
      if (localUsers.username == item.whom) {
        imageAdress = localUsers.photoUrl;
      }
    });
    console.log(imageAdress);

    return (
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate('ChatPage', {whom: item.whom})}>
          <View style={styles.viewMessages}>
            <Image source={{uri: imageAdress}} style={styles.photoStyle} />
            <View style={styles.messageSlot}>
              <View style={styles.textSection}>
                <Text numberOfLines={1} style={styles.userNameText}>
                  {item.whom}
                </Text>
                <Text numberOfLines={1} style={styles.dateInfoText}>
                  {dateFormat.toDateString()}
                </Text>
              </View>
              <View style={styles.textSection}>
                <Text numberOfLines={2} style={styles.responseInfoText}>
                  {item.response}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            borderWidth: 0.8,
            borderColor: '#4B4B4B',
            marginLeft: window.width / 5 + 10,
            marginRight: window.width / 14,
            marginVertical: 10,
          }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'top', 'left']}>
      <StatusBar barStyle="light-content" />

      <View style={{flex: 1, marginTop:-20}}>
        <FlatList
          extraData={messageData}
          data={messageData}
          refreshing={bool}
          style={{flex: 1}}
          ListHeaderComponent={<CustomHeaderComponent />}
          renderItem={({item}) => insideFlatlist(item)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:GlobalColors.black
  },
  photoStyle: {
    height: window.width / 6.5,
    width: window.width / 6.5,
    borderRadius: window.width / 13,
    alignItems: 'center',
  },
  messageSlot: {
    flex: 1,
    justifyContent: 'center',
  },

  messageSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  userNameText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 20,
    flex: 6,
    alignItems: 'center',
  },
  dateInfoText: {
    color: 'white',
    fontSize: 13,
    textAlign: 'right',
    marginRight: 2,
    flex: 4,
    alignItems: 'center',
  },
  responseInfoText: {
    color: 'white',
    fontSize: 13,
    textAlign: 'left',
    marginLeft: 20,
  },
  textSection: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 10,
    //backgroundColor: 'white',
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
    marginHorizontal: 10,
    marginVertical: 5,
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

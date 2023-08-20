import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import storage from '../storage/storage';
import ChatService from '../services/chatService';
import {messageInterface, UserInfoProp} from '../props/generalProp';
import {useNavigation} from '@react-navigation/native';
import LoadingBar from '../components/loadingBar';
import CustomImageComponent from '../components/customImageComponent';
import {GlobalColors} from '../constants/colors/globalColors';
import {ErrorMessages} from '../constants/serviceMessages/errorMessages';
const window = Dimensions.get('window');

export default function ChatPage(prop) {
  const [data, setData] = useState([]);
  const [input, setInput] = useState<string>();
  const [bool, setBool] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfoProp>();
  const chatServices = new ChatService();

  const messageData: [] = [];

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      storage
        .load({
          key: 'userInfo',
        })
        .then(async resp => {
          setUserInfo(resp);
          await chatServices
            .getChatHistory(resp.user.id, prop.route.params.whom)
            .then(respChat => {
              console.log('respChatttt', respChat);
              respChat.map(mes => messageData.push(mes));
              setData(messageData.reverse());
            })
            .catch(error => console.log('error', error));
        });
      setLoading(false);
    };

    fetch();
  }, [bool]);

  const addArray = async () => {
    setBool(true);
    var items;
    await chatServices
      .getGptAnswer(input, userInfo, prop.route.params.whom)
      .then(response => {})
      .catch(error => {
        console.log('error getGptAnswer : ', error);
      });

    await chatServices
      .getChatHistory(userInfo?.idToken, prop.route.params.whom)
      .then(respChat => {
        respChat.map(mes => messageData.push(mes));
        setData(messageData.reverse());
      })
      .catch(error => console.log('error', error));
    setInput('');
    setBool(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.loadingView}>{loading ? <LoadingBar /> : null}</View>
      <FlatList
        inverted
        extraData={data}
        data={data}
        refreshing={bool}
        renderItem={({item}) => messageBlock(item)}
      />
      <View style={{alignItems: 'center'}}>{bool ? <LoadingBar /> : null}</View>
      <View style={styles.sendMessageSection}>
        <TextInput
          style={styles.input}
          onChangeText={(text: string) => setInput(text)}
          value={input}
          placeholder="Message..."
          multiline
        />
        <TouchableOpacity
          style={styles.sendMessageButton}
          onPress={() => addArray()}>
          <Icon name="send-o" size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function messageBlock(item: any) {
  //const image = item.whom.split(' ').join('').toLowerCase();
  //const imageAdress = `../assets/photos/${image}.png`;

  //console.log('image', imageAdress);
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
  container: {
    flex: 1,
    backgroundColor: GlobalColors.backGroundColor,
  },
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
  responseSectionText: {},
  animation: {
    width: window.width / 20,
    height: window.height / 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingView: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  animationLoading: {
    width: window.width / 12,
    height: window.height / 12,
  },
  sendMessageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 90,
  },
  input: {
    height: 48,
    width: window.width / 1.25,
    marginHorizontal: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: '#D6DAE2',
    borderRadius: 4,
    color: 'white',
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

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import storage from '../storage/storage';
import ChatService from '../services/chatService';
import {UserInfoProp} from '../props/generalProp';
import LoadingBar from '../components/loadingBar';
import {GlobalColors} from '../constants/colors/globalColors';
import CustomMessageBlock from '../components/customMessageBlock';
import CustomWriteMessageComponent from '../components/customWriteMessageComponent';
import PackageModal from '../components/customSubscriptionModal';
const window = Dimensions.get('window');

export default function ChatPage(prop: any) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfoProp>();
  const [visible, setVisible] = useState(false);

  const chatServices = new ChatService();

  const messageData: any = [];

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      storage
        .load({
          key: 'userInfo',
        })
        .then(async resp => {
          console.log('respppppppppppp', resp.idToken);
          setUserInfo(resp);
          await chatServices
            .getChatHistory(resp.idToken, prop.route.params.whom)
            .then((respChat: any) => {
              console.log('respChatttt', respChat);
              respChat.map((mes: any) => messageData.push(mes));
              setData(messageData.reverse());
            })
            .catch(error => console.log('error', error));
        });
      setLoading(false);
    };

    fetch();
  }, [loading]);

  const pushMessage = async (question: string) => {
    setLoading(true);
    await chatServices
      .getGptAnswer(question, userInfo, prop.route.params.whom)
      .then(response => console.log('xxxxxxx: ', response))
      .catch(error => {
        console.log('error getGptAnswer : ', error);
      });
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <FlatList
        inverted
        extraData={data}
        data={data}
        renderItem={({item}) =>
          CustomMessageBlock(item, prop.route.params.whom)
        }
      />
      <View style={{alignItems: 'center'}}>
        {loading ? <LoadingBar /> : null}
      </View>
      <CustomWriteMessageComponent addMessage={pushMessage} />
      {/* <PackageModal
        isVisible={visible}
        onClose={() => setVisible(!visible)}
        onPurchase={() => {}}
      /> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.backGroundColor,
  },
  loadingView: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
});

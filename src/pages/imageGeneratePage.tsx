import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  PermissionsAndroid,
  Alert,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Config from 'react-native-config';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {MasonryFlashList} from '@shopify/flash-list';
import {Modal} from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';
import {AsyncStorage} from 'react-native';
import storage from '../storage/storage';

const window = Dimensions.get('window');

export default function ImagePage() {
  const [data, setData] = useState([]);
  const [input, setInput] = useState<string>();
  const [bool, setBool] = useState<boolean>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string>('');
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState<boolean>(false);

  const messageData: {
    message: string;
    user: string;
    response: string;
    _id: string;
  }[] = [];

  const ADRESS = Config.ADRESS;

  useEffect(() => {
    storage
      .load({
        key: 'userInfo',
      })
      .then(async resp => {
        setUserInfo(resp);
        console.log('respaaa', userInfo);
        await axios
          .get(`${ADRESS}/dalle/findPersonalImages/${resp.user.id}`)
          .then(item => {
            item.data.map(mes => messageData.push(mes));
            setData(messageData.reverse());
            console.log('itemss', messageData);
          })
          .catch(error => console.log('error', error));
      });
  }, []);

  const addArray = async () => {
    setBool(true);
    var items;
    if (userInfo.freeToken > 0 || userInfo.dalleToken > 0) {
      const freeTokenCount = userInfo.freeToken;
      const dalleTokenCount = userInfo.dalleToken;

      await axios
        .get(`${ADRESS}/dalle/${input}`)
        .then(async item => {
          items = item.data;
          console.log(items);
          if (items) {
            if (freeTokenCount) {
              console.log('ftk', freeTokenCount);
              await axios.patch(`${ADRESS}/users/${userInfo.idToken}`, {
                freeToken: freeTokenCount - 1,
              });
            } else {
              await axios.patch(`${ADRESS}/users/${userInfo.idToken}`, {
                dalleToken: dalleTokenCount - 1,
              });
            }
          }
        })
        .catch(error => console.log('error', error));

      await axios
        .post(`${ADRESS}/dalle`, {
          prompt: `${input}`,
          user: `${userInfo.user.name}`,
          userId: `${userInfo.user.id}`,
          userPhoto: `${userInfo.user.photo}`,
          response: `${items}`,
          likeNumber: 0,
        })
        .then(resp => {
          console.log('resp', resp);
        })
        .catch(error => {
          console.log('error', error);
        });

      await axios
        .get(`${ADRESS}/dalle`)
        .then(item => {
          const messages = item.data;
          messageData.push(messages);
        })
        .catch(error => console.log('error', error));
    } else {
      Alert.alert('Your Dalle token run out.', 'Please buy coin.');
    }
    setInput('');
    setBool(false);
  };

  const modalFunc = (uri: string) => {
    setModalOpen(true);
    setImageUri(uri);
  };

  const checkPermission = async () => {
    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission

    if (Platform.OS === 'ios') {
      downloadImage();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download Photos',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          console.log('Storage Permission Granted.');
          downloadImage();
        } else {
          // If permission denied then show alert
          Alert.alert('Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }
    }
  };

  const downloadImage = async () => {
    const pathToWrite = `${RNFetchBlob.fs.dirs.DownloadDir}/'downnn.png'`;

    await RNFetchBlob.config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      fileCache: true,
      path: pathToWrite,

      addAndroidDownloads: {
        title: 'download.jpg',
        description: 'Download.jpg',
        useDownloadManager: false,
        notification: true,
      },
    })
      .fetch('GET', imageUri, {
        Authorization: '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',
        //some headers ..
      })
      .then(res => {
        // the temp file path
        RNFetchBlob.ios.openDocument(res.path());
        Alert.alert('Fotograf indirildi.', res.toString());
        console.log('res', res);
      });
  };

  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loadingView}>
        {loading ? (
          <Lottie
            source={require('../assets/animations/messageLoad.json')}
            style={styles.animationLoading}
            autoPlay
            loop
          />
        ) : null}
      </View>
      <MasonryFlashList
        extraData={data}
        data={data}
        refreshing={bool}
        numColumns={2}
        style={{flex: 1}}
        estimatedItemSize={200}
        renderItem={({item}) => (
          <>
            <TouchableOpacity onPress={() => modalFunc(item.response)}>
              <View style={styles.messageSection}>
                <View style={styles.photoSection}>
                  <Image
                    source={{
                      uri: item.response,
                    }}
                    style={styles.flatlistImages}
                    resizeMode="cover"
                  />
                  <View style={styles.photoPrompt}>
                    <Text style={styles.sendedSection}>{item.prompt}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </>
        )}
      />
      <Modal
        theme={{colors: {backdrop: 'rgba(255, 255, 255, 0.8)'}}}
        visible={modalOpen}
        onDismiss={() => setModalOpen(false)}
        contentContainerStyle={styles.containerModalStyle}>
        <Image
          source={{
            uri: imageUri,
          }}
          style={{
            height: window.height / 1.6,
            width: window.width / 1,
          }}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={{
            alignItems: 'center',
            backgroundColor: 'red',
          }}
          onPress={checkPermission}>
          <Text>Download</Text>
          <Icon name="download" size={40} />
        </TouchableOpacity>
      </Modal>
      <View style={{alignItems: 'center'}}>
        {bool ? (
          <Lottie
            source={require('../assets/animations/messageLoad.json')}
            style={styles.animation}
            autoPlay
            loop
          />
        ) : null}
      </View>
      {modalOpen ? null : (
        <View style={styles.sendMessageSection}>
          <TextInput
            style={styles.input}
            onChangeText={(text: string) => setInput(text)}
            value={input}
            placeholder="Create a picture..."
            multiline
          />
          <TouchableOpacity
            style={styles.sendMessageButton}
            onPress={() => addArray()}>
            <Icon name="send-o" size={20} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageSection: {
    margin: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  sendedSection: {
    padding: 5,
    fontWeight: '500',
    fontSize: 15,
  },
  responsSection: {
    backgroundColor: '#E9EEF8',
    marginRight: window.width / 3,
    marginLeft: window.width / 20,
    padding: 15,
    marginVertical: 2,
    borderRadius: 10,
  },
  animation: {
    width: window.width / 20,
    height: window.height / 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingView: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  animationLoading: {
    width: window.width / 12,
    height: window.height / 12,
  },
  sendMessageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    height: 48,
    width: window.width / 1.25,
    marginHorizontal: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: '#D6DAE2',
    borderRadius: 4,
    alignItems: 'center',
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
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 20,
    width: window.width / 2.2,
    color: 'black',
  },
  photoSection: {
    padding: 0,
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    alignItems: 'center',
  },
  containerModalStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backdrop: 'transparent',
  },
  flatlistImages: {
    width: window.width / 2.2,
    height: window.height / 3,
    borderWidth: 1,
    borderColor: 'transparent',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});

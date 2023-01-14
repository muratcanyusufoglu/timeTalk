import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Config from 'react-native-config';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {MasonryFlashList} from '@shopify/flash-list';

const window = Dimensions.get('window');

export default function ImagePage() {
  const [data, setData] = useState([]);
  const [input, setInput] = useState<string>();
  const [bool, setBool] = useState<boolean>();

  const messageData: {
    message: string;
    user: string;
    response: string;
    _id: string;
  }[] = [];

  const ADRESS = Config.ADRESS;

  useEffect(() => {
    console.log('asd');

    const fetch = async () => {
      console.log('asdb');
      await axios
        .get(`${ADRESS}/dalle`)
        .then(item => {
          console.log('item', item, item.data[0]._id);
          item.data.map(mes => messageData.push(mes));
          setData(messageData.reverse());
          console.log('itemm', data[0]._id);
        })
        .catch(error => console.log('error', error));
    };
    fetch();
  }, [bool]);

  const addArray = async () => {
    setBool(true);
    var items;
    await axios
      .get(`${ADRESS}/dalle/${input}`)
      .then(item => {
        items = item.data;
      })
      .catch(error => console.log('error', error));

    await axios
      .post(`${ADRESS}/dalle`, {
        prompt: `${input}`,
        user: 'crazy_61',
        response: `${items}`,
      })
      .then(resp => {
        console.log('resp', resp, input);
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
    setInput('');
    setBool(false);
  };

  return (
    <View style={styles.container}>
      <MasonryFlashList
        extraData={data}
        data={data}
        refreshing={bool}
        numColumns={2}
        style={{flex: 1}}
        estimatedItemSize={200}
        renderItem={({item}) => (
          <>
            <View style={styles.messageSection}>
              <View style={styles.photoSection}>
                <Image
                  source={{
                    uri: item.response,
                  }}
                  style={{
                    width: window.width / 2.2,
                    height:
                      item._id.slice(-1) == '1' ||
                      item._id.slice(-1) == '2' ||
                      item._id.slice(-1) == '3' ||
                      item._id.slice(-1) == '4' ||
                      item._id.slice(-1) == '5'
                        ? window.height / 5
                        : window.height / 3,
                    borderWidth: 1,
                    borderColor: 'transparent',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                  resizeMode="cover"
                />
                <View style={styles.photoPrompt}>
                  <Text style={styles.sendedSection}>{item.prompt}</Text>
                </View>
              </View>
            </View>
          </>
        )}
      />
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
      <View style={styles.sendMessageSection}>
        <TextInput
          style={styles.input}
          onChangeText={(text: string) => setInput(text)}
          value={input}
          placeholder="Image Text..."
          multiline
        />
        <TouchableOpacity
          style={styles.sendMessageButton}
          onPress={() => addArray()}>
          <Icon name="send-o" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageSection: {
    margin: 5,
    alignItems: 'center',
  },
  sendedSection: {
    padding: 5,
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
  sendIcon: {},
  photoPrompt: {
    backgroundColor: 'white',
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
    alignItems: 'center',
  },
});

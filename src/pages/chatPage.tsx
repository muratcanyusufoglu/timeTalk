import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {FlashList} from '@shopify/flash-list';
import Config from 'react-native-config';

interface Data {
  id: number;
  name: string;
  brand: string;
  flavors: any;
}
const window = Dimensions.get('window');

export default function ChatPage() {
  const [data, setData] = useState([]);
  const [input, setInput] = useState();
  const [bool, setBool] = useState<boolean>();

  const messageData: {message: string; user: string; date: string}[] = [];
  const ADRESS = Config.ADRESS;

  useEffect(() => {
    axios
      .get(`${ADRESS}/messages`)
      .then(item => {
        console.log(item);
        item.data.map(mes => messageData.push(mes));
        setData(messageData);
      })
      .catch(error => console.log('error', error));
  }, [bool]);

  console.log('data', `${ADRESS}/messages/`);

  const addArray = async () => {
    setBool(true);
    var items;
    await axios
      .get(`${ADRESS}/messages/${input}`)
      .then(item => {
        items = item.data;
        console.log('data', `${ADRESS}/messages/${input}`);
      })
      .catch(error => console.log('error', error));

    await axios
      .post(`${ADRESS}/messages`, {
        message: `${input}`,
        user: 'crazy_61',
        date: `${items}`,
      })
      .then(resp => {
        console.log('resp', resp);
      })
      .catch(error => {
        console.log('error', error);
      });

    await axios
      .get(`${ADRESS}/messages`)
      .then(item => {
        const messages = item.data;
        messageData.push(messages);
      })
      .catch(error => console.log('error', error));
    setBool(false);
  };

  return (
    <View style={styles.container}>
      <Text>chatPage</Text>
      <TextInput
        style={styles.input}
        onChangeText={setInput}
        value={input}
        placeholder="useless placeholder"
      />
      <TouchableOpacity onPress={() => addArray()}>
        <Text>Ekle</Text>
      </TouchableOpacity>
      <FlatList
        inverted
        extraData={data}
        data={data}
        refreshing={bool}
        renderItem={({item}) => (
          <>
            <View style={styles.messageSection}>
              <Text style={styles.sendedSection}>{item.message}</Text>
              <Text style={styles.responsSection}>{item.date}</Text>
            </View>
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  messageSection: {
    margin: 5,
  },
  sendedSection: {
    backgroundColor: '#E0ECFF',
    marginLeft: window.width / 3,
    marginRight: window.width / 20,
    padding: 15,
    marginVertical: 2,
    borderRadius: 10,
  },
  responsSection: {
    backgroundColor: '#E9EEF8',
    marginRight: window.width / 3,
    marginLeft: window.width / 20,
    padding: 15,
    marginVertical: 2,
    borderRadius: 10,
  },
});

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
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
        extraData={data}
        data={data}
        refreshing={bool}
        renderItem={({item}) => (
          <>
            <View style={styles.messageSection}>
              <Text>{item.message}</Text>
              <Text>{item.date}</Text>
            </View>
          </>
        )}
      />
      {/* {data.map((key, index) => (
        <>
          <Text numberOfLines={2} style={{color: 'black'}}>
            {key.message}
          </Text>
          <Text numberOfLines={2} style={{color: 'black'}}>
            {key.date}
          </Text>
        </>
      ))} */}
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
    backgroundColor: 'gray',
    margin: 25,
    flex: 1,
  },
});

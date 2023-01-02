import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

interface Data {
  id: number;
  name: string;
  brand: string;
  flavors: any;
}
export default function ChatPage() {
  const [data, setData] = useState();

  useEffect(() => {
    axios
      .get('http://localhost:3000/socket/API')
      .then(item => {
        console.log('data', item);
        setData(item);
      })
      .catch(error => console.log('error', error));
    console.log('dataaa', data);
  });

  const addArray = () => {};

  return (
    <View>
      <Text>chatPage</Text>
      <FlatList
        style={{flex: 0}}
        numColumns={1}
        data={data}
        extraData={data}
        keyExtractor={item => `${item.id}`}
        renderItem={({item}) => (
          <>
            <View style={{flex: 1}}>
              <Text
                style={{
                  alignSelf: 'center',
                  textAlign: 'center',
                  color: 'red',
                }}>
                {item.message}
              </Text>
            </View>
          </>
        )}
        contentContainerStyle={{}}
        showsHorizontalScrollIndicator={false}
      />
      <TouchableOpacity onPress={() => addArray()}>
        <Text>Ekle</Text>
      </TouchableOpacity>
    </View>
  );
}

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import storage from '../storage/storage';
import axios from 'axios';
import Config from 'react-native-config';

const window = Dimensions.get('window');
export default function Profile() {
  const ADRESS = Config.ADRESS;

  //const [userInfo, setUserInfo] = useState();
  const [data, setData] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [refresh, setRefresh] = useState<boolean>();

  const userData: {
    follower: string;
    followerId: string;
    following: string;
    followingId: number;
    followingPhoto: string;
    _id: string;
  }[] = [];

  useEffect(() => {
    storage
      .load({
        key: 'userInfo',
      })
      .then(async resp => {
        setData(resp.user);
        console.log('user', data);
        await axios
          .get(`${ADRESS}/follower/${resp.user.id}`)
          .then(item => {
            setFollowers(item.data);
          })
          .catch(error => console.log('error', error));
      });
  }, []);

  useEffect(() => {
    async function getUser() {}
    getUser();
  }, []);

  return (
    <View>
      <View style={styles.userInfos}>
        <Image
          source={{
            uri: data.photo,
          }}
          style={styles.profileImage}
          resizeMode="cover"
        />
        <Text>{data.name}</Text>
      </View>
      {/* <FlatList
        extraData={followers}
        data={followers}
        refreshing={refresh}
        numColumns={1}
        style={{}}
        renderItem={({item}) => <InsideFlatlist item={item} />}
      /> */}
    </View>
  );
}

function InsideFlatlist({item}) {
  console.log('itemitem', item);
  return (
    <View style={styles.messageSection}>
      <Image
        source={{
          uri: item.followingPhoto,
        }}
        style={styles.profileImage}
        resizeMode="cover"
      />
      <View style={styles.photoDescription}>
        <Text style={styles.sendedSection}>{item.followingId}</Text>
      </View>
      {/* <TouchableOpacity
        onPress={{}}
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <Text style={styles.likedNumber}>likes</Text>
      </TouchableOpacity> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  messageSection: {
    alignItems: 'center',
    marginBottom: 30,
    flex: 1,
    flexDirection: 'row',
  },
  sendedSection: {
    padding: 5,
    color: 'black',
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
    width: window.width,
    borderWidth: 1,
    color: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 0,
  },
  photoDescription: {
    borderWidth: 1,
    color: 'black',
  },
  profileImage: {
    width: window.height / 11,
    height: window.height / 11,
    borderRadius: window.height / 5.5,
    borderColor: 'transparent',
  },
  userInfos: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

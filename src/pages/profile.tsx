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
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';

const window = Dimensions.get('window');
export default function Profile() {
  const ADRESS = Config.ADRESS;

  //const [userInfo, setUserInfo] = useState();
  const [data, setData] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [refresh, setRefresh] = useState<boolean>();
  const [index, setIndex] = useState<number>(1);

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
    <SafeAreaView>
      <View style={styles.userInfos}>
        <Image
          source={{
            uri: data.photo,
          }}
          style={styles.profileImage}
          resizeMode="cover"
        />
        <View>
          <Text style={styles.userNameText}>{data.name}</Text>
        </View>
      </View>
      <View style={styles.altTextsView}>
        <TouchableOpacity
          style={
            index == 1
              ? styles.altBarsButtonsActive
              : styles.altBarsButtonsInactive
          }
          onPress={() => setIndex(1)}>
          <Text style={styles.userNameText}>Contents</Text>
          <Icon name="camera-retro" size={15} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={
            index == 2
              ? styles.altBarsButtonsActive
              : styles.altBarsButtonsInactive
          }
          onPress={() => setIndex(2)}>
          <Text style={styles.userNameText}>Followers</Text>
          <Icon name="user-alt" size={15} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={
            index == 3
              ? styles.altBarsButtonsActive
              : styles.altBarsButtonsInactive
          }
          onPress={() => setIndex(3)}>
          <Text style={styles.userNameText}>Following</Text>
          <Icon name="users" size={15} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={
            index == 4
              ? styles.altBarsButtonsActive
              : styles.altBarsButtonsInactive
          }
          onPress={() => setIndex(4)}>
          <Text style={styles.userNameText}>Packages</Text>
          <Icon name="box-open" size={15} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.line} />

      {index == 1 ? (
        <FlatList
          extraData={followers}
          data={followers}
          refreshing={refresh}
          numColumns={1}
          style={{}}
          renderItem={({item}) => <InsideFlatlist item={item} />}
        />
      ) : null}
    </SafeAreaView>
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
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  userNameText: {
    marginTop: 10,
  },
  altTextsView: {
    margin: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: window.height / 25,
  },
  altBarsButtonsActive: {
    backgroundColor: '#E0ECFF',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  altBarsButtonsInactive: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  line: {
    margin: 10,
    borderWidth: 0.2,
  },
});

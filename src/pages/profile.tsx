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
import {MasonryFlashList} from '@shopify/flash-list';

const window = Dimensions.get('window');
export default function Profile() {
  const ADRESS = Config.ADRESS;

  //const [userInfo, setUserInfo] = useState();
  const [data, setData] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [refresh, setRefresh] = useState<boolean>();
  const [index, setIndex] = useState<number>(1);
  const [photos, setPhotos] = useState<any>();

  const messageData: {
    message: string;
    user: string;
    response: string;
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
          .get(`${ADRESS}/follower/withInfos/${resp.user.id}`)
          .then(item => {
            setFollowers(item.data);
          })
          .catch(error => console.log('error', error));
        await axios
          .get(`${ADRESS}/dalle/findPersonalImages/${resp.user.id}`)
          .then(item => {
            item.data.map(mes => messageData.push(mes));
            setPhotos(messageData.reverse());
            console.log('itemss', messageData);
          })
          .catch(error => console.log('error', error));
      });
  }, []);

  useEffect(() => {
    async function getUser() {}
    getUser();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
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
          <Text style={styles.userNameText}>Purchases</Text>
          <Icon name="box-open" size={15} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.line} />

      {index == 1 ? (
        <MasonryFlashList
          extraData={photos}
          data={photos}
          numColumns={2}
          style={{flex: 1}}
          estimatedItemSize={100}
          renderItem={({item}) => (
            <>
              <TouchableOpacity onPress={() => {}}>
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
      ) : null}

      {index == 3 ? (
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
    <TouchableOpacity style={styles.followingUserContent}>
      <Image
        source={{
          uri: item.followingPhoto,
        }}
        style={styles.profileImagesFollowers}
        resizeMode="cover"
      />
      <View style={styles.photoDescription}>
        <Text style={styles.sendedSection}>{item.following}</Text>
        <Text style={styles.sendedSection}>Content Number</Text>
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
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  messageSection: {
    alignItems: 'center',
    margin: 20,
  },
  followingUserContent: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 15,
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
    width: window.width / 2.2,
    borderWidth: 1,
    color: 'black',
    flexDirection: 'row',
    padding: 0,
  },
  photoDescription: {
    color: 'black',
    flexDirection: 'column',
  },
  profileImage: {
    width: window.height / 11,
    height: window.height / 11,
    borderRadius: window.height / 5.5,
    borderColor: 'transparent',
  },
  profileImagesFollowers: {
    width: window.height / 15,
    height: window.height / 15,
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
    marginTop: window.height / 40,
  },
  altBarsButtonsActive: {
    backgroundColor: '#E0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  altBarsButtonsInactive: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    borderRadius: 8,
  },
  line: {
    margin: 10,
    borderWidth: 0.2,
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
  flatlistImages: {
    width: window.width / 2.2,
    height: window.height / 4,
    borderWidth: 1,
    borderColor: 'transparent',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});

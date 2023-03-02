import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Config from 'react-native-config';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AsyncStorage} from 'react-native';
import storage from '../storage/storage';
import Lottie from 'lottie-react-native';

const window = Dimensions.get('window');

export default function DiscoverPage() {
  const [data, setData] = useState([]);
  const [bool, setBool] = useState<boolean>();
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  //const [followerId, setFollowerIds] = useState([]);

  const messageData: {
    message: string;
    user: string;
    response: string;
    likeNumber: number;
    _id: string;
  }[] = [];

  const followerId: {
    follower: string;
    followerId: string;
    following: string;
    followingId: number;
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
        console.log('resp info', userInfo);
        await axios
          .get(`${ADRESS}/follower/${resp.idToken}`)
          .then(item => {
            console.log('item follower', item);
            item.data.map(usersId => followerId.push(usersId.followingId));
            followerId.push(userInfo.idToken);
            console.log('followerIds', followerId);
          })
          .catch(error => console.log('error', error));
      });
  });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      await axios
        .get(`${ADRESS}/dalle`)
        .then(item => {
          console.log('itemmm', item);
          const filterList = item.data.filter(
            mes => !followerId.includes(mes.userId),
          );
          console.log('filterList', filterList);

          filterList.map(mes => messageData.push(mes));
          setData(messageData.reverse());
          console.log('filterList2', data);
        })
        .catch(error => console.log('error', error));

      storage
        .load({
          key: 'userInfo',
        })
        .then(async resp => {
          setUserInfo(resp.token);
          console.log('respaaa', userInfo.idToken);
        });
      setLoading(false);
    };
    fetch();
  }, [bool]);

  return (
    <View style={styles.container}>
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
      <FlatList
        extraData={data}
        data={data}
        refreshing={bool}
        numColumns={1}
        style={{}}
        renderItem={({item}) => <InsideFlatlist item={item} />}
      />
    </View>
  );
}

function InsideFlatlist({item}) {
  const [following, setFollowing] = useState(false);
  const [liked, isLiked] = useState<number>(0);
  const [userInfo, setUserInfo] = useState();
  const [likeNumber, setLikeNumber] = useState(item.likeNumber);

  const ADRESS = Config.ADRESS;

  useEffect(() => {
    storage
      .load({
        key: 'userInfo',
      })
      .then(async resp => {
        setUserInfo(resp);
        console.log('respaaa', userInfo);
      });
  });

  const follow = async user => {
    console.log('object', user);
    if (following == false) {
      await axios
        .post(`${ADRESS}/follower`, {
          follower: userInfo.user.name,
          following: item.user,
          followerId: userInfo.idToken,
          followingId: item.userId,
        })
        .then(resp => {
          console.log('resp post', resp);
          setFollowing(true);
        })
        .catch(error => {
          console.log('error post', error);
        });
    } else {
      axios
        .delete(
          `${ADRESS}/follower/deleteUser/${item.userId}/${userInfo.idToken}`,
        )
        .then(resp => {
          setFollowing(false);
        });
    }
  };

  const progress = useRef(new Animated.Value(0)).current;

  const handleLikeAnimation = async () => {
    setLikeNumber(likeNumber - 1);

    console.log('begenildi');
    await axios.patch(`${ADRESS}/dalle/${item._id}`, {
      likeNumber: item.likeNumber - 1,
    });
    Animated.timing(progress, {
      toValue: 0.3,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  const handleUnLikeAnimation = async () => {
    console.log('begenilmedi');
    setLikeNumber(likeNumber + 1);

    await axios.patch(`${ADRESS}/dalle/${item._id}`, {
      likeNumber: item.likeNumber + 1,
    });
    Animated.timing(progress, {
      toValue: 0.54,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    console.log('objectliked', liked);
    if (liked == 0) {
      Animated.timing(progress, {
        toValue: 0.3,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      liked % 2 ? handleUnLikeAnimation() : handleLikeAnimation();
    }
  }, [liked]);

  return (
    <View style={styles.messageSection}>
      <View style={styles.photoSection}>
        <View style={styles.photoPrompt}>
          <Text style={styles.sendedSection}>user/ {item.userId}</Text>
          <TouchableOpacity onPress={() => follow(item.user)}>
            <Text style={styles.sendedSection}>
              {following ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
        <Image
          source={{
            uri: item.response,
          }}
          style={styles.imageStyle}
          resizeMode="cover"
        />
        <View style={styles.likeAndDescription}>
          <View style={styles.photoDescription}>
            <Text style={styles.sendedSection}>{item.prompt}</Text>
          </View>
          <TouchableOpacity
            onPress={() => isLiked(liked + 1)}
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
            <LottieView
              progress={progress}
              source={require('../assets/animations/like-animation.json')}
              style={styles.animation}
            />
            <Text style={styles.likedNumber}>
              {likeNumber ? likeNumber : null} likes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  },
  sendedSection: {
    padding: 5,
    color: 'white',
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
    alignItems: 'center',
    justifyContent: 'center',
    width: window.width / 15,
    height: window.height / 15,
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
    flex: 4,
  },
  photoSection: {
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'flex-start',
  },
  imageStyle: {
    width: window.width,
    height: window.height / 2.5,
    borderColor: 'transparent',
  },
  likeAndDescription: {
    width: window.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  likedNumber: {
    color: 'white',
    alignItems: 'center',
  },
});

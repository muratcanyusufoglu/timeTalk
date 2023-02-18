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

const window = Dimensions.get('window');

export default function DiscoverPage() {
  const [data, setData] = useState([]);
  const [bool, setBool] = useState<boolean>();
  const [userInfo, setUserInfo] = useState();

  const messageData: {
    message: string;
    user: string;
    response: string;
    _id: string;
  }[] = [];

  const ADRESS = Config.ADRESS;

  useEffect(() => {
    const fetch = async () => {
      await axios
        .get(`${ADRESS}/dalle`)
        .then(item => {
          item.data.map(mes => messageData.push(mes));
          setData(messageData.reverse());
        })
        .catch(error => console.log('error', error));

      storage
        .load({
          key: 'isLogin',
        })
        .then(async resp => {
          setUserInfo(resp.token);
          console.log('respaaa', userInfo.id);
        });
    };
    fetch();
  }, [bool]);

  return (
    <View style={styles.container}>
      <FlatList
        extraData={data}
        data={data}
        refreshing={bool}
        numColumns={1}
        style={{flex: 1}}
        renderItem={({item}) => <InsideFlatlist item={item} />}
      />
    </View>
  );
}

function InsideFlatlist({item}) {
  const [following, setFollowing] = useState(false);
  const [liked, isLiked] = useState<boolean>(false);

  const follow = async user => {
    await axios
      .post(`${ADRESS}/follower`, {
        follower: userInfo.familyName,
        following: user,
        followerId: userInfo.id,
        followingId: userInfo.id,
      })
      .then(resp => {
        console.log('resp post', resp);
        setFollowing(true);
      })
      .catch(error => {
        console.log('error post', error);
      });
  };

  const progress = useRef(new Animated.Value(0)).current;

  const handleLikeAnimation = () => {
    console.log('begenildi');
    Animated.timing(progress, {
      toValue: 0.3,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  const handleUnLikeAnimation = () => {
    console.log('begenilmedi');
    Animated.timing(progress, {
      toValue: 0.46,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    liked ? handleUnLikeAnimation() : handleLikeAnimation();
  }, [liked]);

  return (
    <View style={styles.messageSection}>
      <View style={styles.photoSection}>
        <View style={styles.photoPrompt}>
          <Text style={styles.sendedSection}>user/ {item.user}</Text>
          <TouchableOpacity onPress={() => follow(item.user)}>
            <Text style={styles.sendedSection}>
              {following ? 'Follow' : 'following'}
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
          <TouchableOpacity onPress={() => isLiked(!liked)}>
            <LottieView
              progress={progress}
              source={require('../assets/animations/like-animation.json')}
              style={styles.animation}
            />
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
});

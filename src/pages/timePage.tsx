import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Config from 'react-native-config';
import LottieView from 'lottie-react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import {AsyncStorage} from 'react-native';
import storage from '../storage/storage';
import Lottie from 'lottie-react-native';

const window = Dimensions.get('window');

export default function TimePage() {
  const [data, setData] = useState([]);
  const [bool, setBool] = useState<boolean>();
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<number>(4);
  //const [followerId, setFollowerIds] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const followerId: [] = [];
  const filterList: [] = [];
  const ADRESS = Config.ADRESS;

  useEffect(() => {
    setLoading(true);
    storage
      .load({
        key: 'userInfo',
      })
      .then(async resp => {
        setUserInfo(resp);
        console.log('resp info', userInfo);
      });
    setLoading(false);
  }, [userInfo, ADRESS, pagination]);

  const handleOnEndReached = () => {
    console.log('endReaced', pagination);
    setPagination(pagination + 5);
  };

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
        onEndReached={handleOnEndReached}
        numColumns={1}
        style={{}}
        renderItem={({item}) => <InsideFlatlist item={item} />}
        ListFooterComponent={
          <View style={styles.loadingView}>
            <Lottie
              source={require('../assets/animations/messageLoad.json')}
              style={styles.animationLoading}
              autoPlay
              loop
            />
          </View>
        }
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
    <SafeAreaView>
      <View style={styles.messageSection}>
        <View style={styles.photoSection}>
          <View style={styles.photoPrompt}>
            <Text style={styles.sendedSection}>user/ {item.userId}</Text>
          </View>
          <View style={styles.imageView}>
            <Image
              source={{
                uri: item.response,
              }}
              style={styles.imageStyle}
              resizeMode="cover"
            />
          </View>
          <View style={styles.likeAndDescription}>
            <TouchableOpacity
              onPress={() => isLiked(liked + 1)}
              style={styles.likeSection}>
              <LottieView
                progress={progress}
                source={require('../assets/animations/like-animation.json')}
                style={styles.animation}
              />
              <Text style={styles.likedNumber}>
                {likeNumber ? likeNumber : null} likes
              </Text>
            </TouchableOpacity>
            <View style={styles.photoDescription}>
              <Text style={styles.sendedSection}>{item.prompt}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
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
    height: window.height / 15,
    //padding: window.height / 25,
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
    width: window.width / 1.1,
    borderWidth: 1,
    color: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 0,
  },
  photoDescription: {
    borderWidth: 1,
    color: 'black',
    flex: 1,
    alignItems: 'flex-start',
    marginHorizontal: window.width * 0.04,
  },
  photoSection: {
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  imageStyle: {
    width: window.width / 1.1,
    height: window.height / 2.5,
    borderColor: 'transparent',
    alignItems: 'center',
    borderRadius: 8,
  },
  likeAndDescription: {
    width: window.width / 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
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
  likeSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: window.width * 0.01,
  },
  imageView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

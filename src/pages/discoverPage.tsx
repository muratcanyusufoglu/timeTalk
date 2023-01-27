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

const window = Dimensions.get('window');

export default function DiscoverPage() {
  const [data, setData] = useState([]);
  const [liked, isLiked] = useState<boolean>();
  const [bool, setBool] = useState<boolean>();
  const [progress, setProgress] = useState(new Animated.Value(0));

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
          console.log('item', item, item.data[0]._id);
          item.data.map(mes => messageData.push(mes));
          setData(messageData.reverse());
          console.log('itemm', data[0]._id);
        })
        .catch(error => console.log('error', error));
    };
    fetch();
  }, [bool]);

  const animation = useRef(null);

  //   useEffect(() => {
  //     if (liked) {
  //       animation.current.play(66, 66);
  //     } else {
  //       animation.current.play(19, 19);
  //     }
  //   }, [liked]);

  return (
    <View style={styles.container}>
      <FlatList
        extraData={data}
        data={data}
        refreshing={bool}
        numColumns={1}
        style={{flex: 1}}
        renderItem={({item}) => (
          <>
            <View style={styles.messageSection}>
              <View style={styles.photoSection}>
                <View style={styles.photoPrompt}>
                  <Text style={styles.sendedSection}>user/ {item.user}</Text>
                </View>
                <Image
                  source={{
                    uri: item.response,
                  }}
                  style={styles.imageStyle}
                  resizeMode="cover"
                />
                <View style={styles.photoPrompt}>
                  <Text style={styles.sendedSection}>{item.prompt}</Text>
                </View>
                <LottieView
                  ref={animation}
                  source={require('../assets/animations/like-animation.json')}
                  style={styles.animation}
                  autoPlay={false}
                  loop={false}
                />
              </View>
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
    width: window.width / 20,
    height: window.height / 20,
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
    backgroundColor: 'black',
    borderWidth: 1,
    margin: 5,
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
});

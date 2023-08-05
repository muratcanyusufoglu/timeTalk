import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import nameList from '../assets/localusers';
import {categories} from '../assets/categories';
import Icon from 'react-native-vector-icons/FontAwesome';
import {MasonryFlashList} from '@shopify/flash-list/dist/MasonryFlashList';
import {FlatList} from 'react-native-gesture-handler';
import {TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import CustomIcon from '../assets/icons/customIcons';
import SearchBar from '../components/searchBar';
import GlobalSizes from '../constants/sizes/globalSizes';

const window = Dimensions.get('window');

interface userInfos {
  userId: number;
  username: string;
  photoUrl: string;
  userInfo: string;
  category: string;
}

export default function DiscoverPage() {
  const [bool, setBool] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [userData, setUserData] = useState<Array<userInfos>>(nameList.nameList);
  const [categoryInfo, setCategoryInfo] = useState<String>('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      setLoading(false);
    };
    fetch();
  }, [bool]);

  const onChangeText = (key: String) => {
    if (key.length >= 1) {
      const filterUsers = nameList.nameList.filter(item => {
        if (item.username.toLowerCase().indexOf(key.toLowerCase()) > -1) {
          return item;
        }
      });
      setUserData(filterUsers);
      setText(key);
    } else {
      setText('');
      setUserData(nameList.nameList);
    }
  };

  const setCategory = (category: String) => {
    if (category != categoryInfo) {
      setCategoryInfo(category);
      const filterUsers = nameList.nameList.filter(item => {
        if (item.category == category) {
          return item;
        }
      });
      setUserData(filterUsers);
    } else {
      setCategoryInfo('');
      setUserData(nameList.nameList);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MasonryFlashList
        extraData={userData}
        data={userData}
        refreshing={bool}
        numColumns={2}
        style={{flex: 1}}
        estimatedItemSize={200}
        ListHeaderComponent={
          <View
            style={{
              marginHorizontal: GlobalSizes.widthAllScreen / 24,
            }}>
            <SearchBar
              onChangeTextFunc={onChangeText}
              value={text}
              placeHolder={'Search'}
            />
            <FlatList
              data={categories}
              refreshing={bool}
              style={{}}
              horizontal={true}
              alwaysBounceHorizontal
              renderItem={({item}) => (
                <>
                  <TouchableOpacity
                    style={{
                      width: window.width / 4,
                      height: window.height / 25,
                      backgroundColor: item.color,
                      borderRadius: 7,
                      borderWidth: item.category === categoryInfo ? 4 : 0,
                      borderColor:
                        item.category === categoryInfo
                          ? 'black'
                          : 'transparent',
                      marginHorizontal: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => setCategory(item.category)}>
                    <Text>{item.category}</Text>
                  </TouchableOpacity>
                </>
              )}
            />
          </View>
        }
        renderItem={({item}) => (
          <>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ChatPage', {whom: item.username})
              }>
              <View style={styles.photoSection}>
                <ImageBackground
                  source={require('../assets/photos/mariecurie.png')}
                  imageStyle={{borderRadius: 6}}
                  style={
                    item.userId % 4 == 1 || item.userId % 4 == 0
                      ? styles.flatlistImages
                      : styles.flatlistImagesOne
                  }>
                  <View style={styles.textSection}>
                    <Text style={styles.userNameText}>{item.username}</Text>
                    <Text style={styles.userInfoText}>{item.userInfo}</Text>
                  </View>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          </>
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23242B',
    width: window.width,
    height: window.height,
  },

  messageSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  userNameText: {
    color: 'black',
    fontSize: 12,
    textAlign: 'right',
    fontWeight: '600',
    marginRight: 2,
  },
  userInfoText: {
    color: 'black',
    fontSize: 10,
    textAlign: 'right',
    marginRight: 2,
  },
  textSection: {
    position: 'absolute',
    bottom: 0,
    height: window.height / 20,
    width: window.width / 2.4,
    backgroundColor: '#D9D9D9',
    opacity: 0.7,
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
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
  textInputView: {
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    height: window.height / 25,
    width: window.width - window.width / 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
    marginVertical: 10,
    backgroundColor: 'black',
    marginRight: window.width / 22,
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
    width: window.width / 2,
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
    marginVertical: 20,
    alignItems: 'center',
  },
  flatlistImagesOne: {
    width: window.width / 2.4,
    height: window.height / 4,
  },
  flatlistImages: {
    width: window.width / 2.4,
    height: window.height / 3,
  },
  categoriesStyle: {
    width: window.width / 4,
    height: window.height / 20,
    backgroundColor: '#E1CEF4',
    borderRadius: 7,
  },
  categoriesView: {
    marginHorizontal: window.width / 24,
  },
});

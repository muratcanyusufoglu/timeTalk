/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StyleSheet, Text, View, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {SegmentedButtons} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';

const window = Dimensions.get('window');

const App = () => {
  const [value, setValue] = React.useState('');
  const userInfo = useSelector((store: any) => store.userReducer.userInfo);

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Toast position="bottom" bottomOffset={0} type="success" />
      <View style={styles.coinHeader}>
        <View>
          <Text>Logo</Text>
        </View>
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          <Text style={{color: '#000A1A'}}>Token</Text>
          <Icon name="money" size={18} style={{color: '#75839D'}} />
        </View>
      </View>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        style={styles.segmentedButtons}
        buttons={[
          {
            value: 'chats',
            label: 'Chats',
            onPress: () => navigation.navigate('Chat' as never),
            style: {
              borderRadius: 6,
            },
          },
          {
            value: 'dalle',
            label: 'Dalle',
            onPress: () => navigation.navigate('Chat' as never),
            style: {
              borderRadius: 6,
            },
          },
          {
            value: 'all',
            label: 'All',
            onPress: () => navigation.navigate('Dalle' as never),
            style: {
              borderRadius: 6,
            },
          },
        ]}
      />
      <Text style={{color: '#000A1A'}}>{userInfo.user.email}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  coinHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: (window.width - window.width / 1.2) / 3,
  },
  sectionsBar: {
    marginTop: 20,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  sectionsBarMinimal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    paddingHorizontal: 10,
    backgroundColor: '#E0ECFF',
    height: 48,
    width: window.width / 2.4,
    borderRadius: 6,
    marginLeft: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#D6DAE2',
    fontSize: 24,
    fontWeight: '600',
  },
  searchBar: {
    backgroundColor: '#EAECF0',
    marginHorizontal: (window.width - window.width / 1.2) / 3,
    borderRadius: 6,
    marginTop: 20,
    padding: 10,
  },
  questionBelow: {
    marginLeft: (window.width - window.width / 1.2) / 3,
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textHeaders: {
    fontSize: 14,
    color: '#000A1A',
    margin: 5,
  },
  questionSection: {
    backgroundColor: '#EAECF0',
    fontSize: 18,
    fontWeight: '400',
    height: window.height / 12,
    width: window.width / 2.4,
    borderRadius: 12,
  },
  questionMarks: {
    marginTop: 30,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  segmentedButtons: {
    marginTop: 10,
    marginHorizontal: (window.width - window.width / 1.2) / 3,
    borderRadius: 6,
  },
});

export default App;

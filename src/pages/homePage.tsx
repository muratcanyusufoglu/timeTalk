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
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Touchable,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

const window = Dimensions.get('window');

const App = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search"
        placeholderTextColor={'#D6DAE2'}>
        <Icon name="search" size={18} style={{color: '#D6DAE2'}} />
        <Text style={{color: '#D6DAE2'}}>Search</Text>
      </TextInput>
      <View style={styles.sectionsBar}>
        <TouchableOpacity style={styles.sectionsBarMinimal} on>
          <Icon name="bolt" size={18} style={{color: '#75839D'}} />
          <Text style={styles.textHeaders}>Quick Question</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sectionsBarMinimal}>
          <Icon name="bolt" size={18} style={{color: '#75839D'}} />
          <Text style={styles.textHeaders}>Nostradamus</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionsBar}>
        <TouchableOpacity
          style={styles.sectionsBarMinimal}
          onPress={() => navigation.navigate('Chat')}>
          <Icon name="wechat" size={18} style={{color: '#75839D'}} />
          <Text style={styles.textHeaders}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sectionsBarMinimal}>
          <Icon name="file-image-o" size={18} style={{color: '#75839D'}} />
          <Text style={styles.textHeaders}>Image to Text Question</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.questionBelow}>
        <Text style={styles.textHeaders}>Recent Questions</Text>
        <Icon name="search" size={15} />
      </View>
      <View style={styles.questionMarks}>
        <View style={styles.questionSection} />
        <View style={styles.questionSection} />
      </View>
      <View style={styles.questionMarks}>
        <View style={styles.questionSection} />
        <View style={styles.questionSection} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#FFFFFF',
    marginHorizontal: (window.width - window.width / 1.2) / 3,
    borderRadius: 6,
    marginTop: 50,
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
    height: window.height / 4.2,
    width: window.width / 2.4,
    borderRadius: 12,
  },
  questionMarks: {
    marginTop: 10,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

export default App;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {type PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const window = Dimensions.get('window');

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionsBar}>
        <View style={styles.sectionsBarMinimal}>
          <Text style={styles.textHeaders}>Quick Question</Text>
        </View>
        <View style={styles.sectionsBarMinimal}>
          <Text style={styles.textHeaders}>Nostradamus</Text>
        </View>
      </View>
      <View style={styles.sectionsBar}>
        <View style={styles.sectionsBarMinimal}>
          <Text style={styles.textHeaders}>Chat</Text>
        </View>
        <View style={styles.sectionsBarMinimal}>
          <Text style={styles.textHeaders}>Image to Text Question</Text>
        </View>
      </View>
      <View style={styles.questionBelow}>
        <Text style={styles.textHeaders}>Recent Questions</Text>
        <Icon name="home" size={80} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionsBar: {
    marginTop: 20,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  sectionsBarMinimal: {
    justifyContent: 'center',
    marginTop: 0,
    paddingHorizontal: 24,
    backgroundColor: '#E0ECFF',
    height: 48,
    width: window.width / 2.4,
    borderRadius: 6,
  },
  container: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: '600',
  },
  questionBelow: {
    marginTop: 50,
  },
  textHeaders: {
    fontSize: 14,
    color: '#000A1A',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

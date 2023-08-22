import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Button,
  SafeAreaView,
} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {useRevenueCat} from '../providers/reveneuCatProvider';
import {useNavigation} from '@react-navigation/native';
import {PurchasesPackage} from 'react-native-purchases';
import User from './user';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import storage from '../storage/storage';

const Profile = () => {
  const navigation = useNavigation();
  const {user, packages, purchasePackage, restorePermissions} = useRevenueCat();

  // Add a restore button to the top bar
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={restorePermissions}
          title="Restore"
          color={'#EA3C4A'}></Button>
      ),
    });

    GoogleSignin.configure({
      webClientId:
        '515496165016-cl5voj2dcqnv0g9ucqhmur7dck0bioho.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    });
  }, []);

  const onPurchase = (pack: PurchasesPackage) => {
    // Purchase the package
    purchasePackage!(pack);
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await storage
        .remove({key: 'userInfo'})
        .then(() => navigation.navigate('Login' as never));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {/* Display the packages */}
        <View style={styles.container}>
          {packages.map(pack => (
            <TouchableOpacity
              key={pack.identifier}
              onPress={() => onPurchase(pack)}
              style={styles.button}>
              <View style={styles.text}>
                <Text>{pack.product.title}</Text>
                <Text style={styles.desc}>{pack.product.description}</Text>
              </View>
              <View style={styles.price}>
                <Text>{pack.product.priceString}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Display the user state */}
        <User user={user} />
        <TouchableOpacity
          onPress={() => signOut()}
          style={styles.button}></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
  button: {
    padding: 12,
    borderRadius: 4,
    margin: 4,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#fff',
  },
  text: {
    flexGrow: 1,
  },
  desc: {
    color: '#B6B7C0',
    paddingVertical: 4,
  },
  price: {
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    borderColor: '#EA3C4A',
  },
});

export default Profile;

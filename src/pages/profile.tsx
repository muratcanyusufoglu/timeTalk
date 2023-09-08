import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Button,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useRevenueCat} from '../providers/reveneuCatProvider';
import {useNavigation} from '@react-navigation/native';
import {PurchasesPackage} from 'react-native-purchases';
import User from './user';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import storage from '../storage/storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const window = Dimensions.get('window');

const Profile = () => {
  const navigation = useNavigation();
  const {getCustomerInfo, user, packages, purchasePackage, restorePermissions} =
    useRevenueCat();
  const [selectedPack, setSelectedPack] = useState<PurchasesPackage>();

  useEffect(() => {
    const customerInfo = restorePermissions;
    console.log('customer', customerInfo);
  }),
    [];
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
    purchasePackage!(pack).then(resp => {
      if (resp == true) {
        navigation.navigate('Home' as never);
      }
    });
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
    <SafeAreaView style={{backgroundColor: 'black', flex: 1}}>
      <ScrollView>
        {/* Display the packages */}
        <View style={{padding: 12}}>
          <Text style={styles.mainText}>Choose a plan</Text>
          <Text style={styles.altText}>
            Select the offer best suits your need
          </Text>
        </View>
        <View style={styles.container}>
          {packages.map(pack => (
            <TouchableOpacity
              key={pack.identifier}
              onPress={() => {
                setSelectedPack(pack);
              }}
              style={
                pack.identifier == selectedPack?.identifier
                  ? styles.buttonSelected
                  : styles.button
              }>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <Icon
                    name="check-circle-o"
                    size={20}
                    color={
                      pack.identifier == selectedPack?.identifier
                        ? '#BB86FC'
                        : 'white'
                    }
                  />
                </View>
                <View style={styles.text}>
                  <Text style={styles.header}>{pack.product.title}</Text>
                  <Text style={styles.desc}>{pack.product.description}</Text>
                </View>
                <View style={styles.price}>
                  <Text style={styles.priceText}>
                    {pack.product.priceString}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.contunieButton}
            onPress={() => {
              onPurchase(selectedPack);
            }}>
            <Text style={styles.googleButtonText}>Continue </Text>
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity
          onPress={() => signOut()}
          style={styles.button}></TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
  },
  button: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'gray',
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  buttonSelected: {
    padding: 15,
    borderRadius: 20,
    borderWidth: 5,
    borderColor: '#BB86FC',
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  text: {
    flex: 8,
  },
  header: {
    color: 'white',
    paddingVertical: 4,
    fontSize: 18,
    fontWeight: '600',
  },
  priceText: {
    color: 'white',
    paddingVertical: 4,
    fontSize: 18,
    fontWeight: '600',
  },
  desc: {
    color: 'white',
    paddingVertical: 4,
    fontSize: 14,
  },
  price: {
    paddingHorizontal: 8,
    flex: 2,
  },
  mainText: {
    fontSize: 34,
    color: 'white',
    fontFamily: 'ShareTechMono-Regular',
  },
  altText: {
    fontSize: 15,
    color: 'white',
    fontFamily: 'ShareTechMono-Regular',
  },
  contunieButton: {
    marginTop: 10,
    backgroundColor: '#BB86FC',
    borderRadius: 28,
    width: window.width / 1.5,
    height: window.height / 15,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleButtonText: {
    marginLeft: 0,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Profile;

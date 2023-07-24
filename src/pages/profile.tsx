import React, {createContext, useState, useContext, useEffect} from 'react';
import {Alert, Platform, Text} from 'react-native';
import Purchases, {LOG_LEVEL} from 'react-native-purchases';
import Config from 'react-native-config';

const itemSkus = Platform.select({
  ios: ['com.replicachat.monthlypremium', '61', '38'],
});

export const IApController = () => {
  useEffect(() => {
    const init = async () => {
      Purchases.configure({apiKey: 'appl_FhNofUrKTZfKeJGLEmJTsgBPojr'});
      await loadOfferings();
    };
    //Purchases.setLogLevel(LOG_LEVEL.DEBUG)
    init();
  }, []);

  const loadOfferings = async () => {
    const offerings = await Purchases.getOfferings();
    console.log(offerings);
  };
  return <Text>asd</Text>;
};

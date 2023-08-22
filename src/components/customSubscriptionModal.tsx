import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {Button} from 'react-native-elements';

const PackageModal = (
  isVisible: boolean,
  onClose: () => void,
  onPurchase: () => void,
) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Package 3</Text>
        <Text style={styles.description}>
          Unlock amazing features with Package 3.
        </Text>
        <Text style={styles.price}>$4.99</Text>
        <Button
          title="Purchase"
          onPress={onPurchase}
          buttonStyle={styles.purchaseButton}
        />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    marginBottom: 15,
    textAlign: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  purchaseButton: {
    backgroundColor: 'green',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: 'blue',
    fontSize: 16,
  },
});

export default PackageModal;

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
const window = Dimensions.get('window');

export default function CustomWriteMessageComponent({
  addMessage,
}: {
  addMessage: Function;
}) {
  const [message, setMessage] = useState<string>();

  return (
    <View style={styles.sendMessageSection}>
      <TextInput
        style={styles.input}
        onChangeText={(text: string) => setMessage(text)}
        value={message}
        placeholder="Write a message..."
        placeholderTextColor={'white'}
        multiline
      />
      <TouchableOpacity
        style={styles.sendMessageButton}
        onPress={() => {
          addMessage(message), setMessage('');
        }}>
        <Icon name="send-o" size={20} color={'white'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sendMessageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  input: {
    height: 48,
    width: window.width / 1.25,
    marginHorizontal: 12,
    padding: 10,
    borderColor: '#D6DAE2',
    color: 'white',
    backgroundColor: '#343a40',
    borderRadius: 10,
    paddingVertical: 0, // Remove vertical padding to align text better
    textAlignVertical: 'center', // Vertical alignment
  },
  sendMessageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: window.width / 8,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#343a40',
  },
});

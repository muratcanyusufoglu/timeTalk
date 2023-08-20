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
        placeholder="Message..."
        multiline
      />
      <TouchableOpacity
        style={styles.sendMessageButton}
        onPress={() => {
          addMessage(message), setMessage('');
        }}>
        <Icon name="send-o" size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sendMessageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 90,
  },
  input: {
    height: 48,
    width: window.width / 1.25,
    marginHorizontal: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: '#D6DAE2',
    borderRadius: 4,
    color: 'white',
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
});

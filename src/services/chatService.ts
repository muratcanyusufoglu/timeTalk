import axios, {AxiosResponse} from 'axios';
import Config from 'react-native-config';
import {messageInterface} from '../props/generalProp';
import {ErrorMessages} from '../constants/serviceMessages/errorMessages';
import snackBar from '../components/snackBar';

class ChatService {
  ADRESS = Config.ADRESS;

  async getChatHistory(user: string, whom: string) {
    let urlPersonal = `${this.ADRESS}/messagesWhom/getPersonalChat/${user}/${whom}`;
    console.log('urlPersonal', urlPersonal);
    let response;
    response = await axios
      .get<messageInterface>(urlPersonal)
      .then(resp => {
        response = resp.data[0].messageArray;
        return resp.data[0].messageArray;
      })
      .catch(error => console.log(error));
    return response;
  }

  async getGptAnswer(input: string, userInfo: any, whom: string) {
    let urlGpt = this.ADRESS + `/messagesWhom/gpt`;
    await axios
      .post(urlGpt, {
        userId: userInfo.idToken,
        userPhoto: userInfo.user.photo,
        whom: whom,
        question: input,
      })
      .then(async item => {
        if (item.data == ErrorMessages.gptUnlimitedMessage) {
          return snackBar(
            ErrorMessages.gptUnlimitedMessage,
            ErrorMessages.getPurchase,
            () => {
              return false;
            },
          );
        }
        return true;
      })
      .catch(error => {
        return snackBar(error, '', () => {});
      });
  }

  async getLastMessages(user: string) {
    let urlPersonal = `${this.ADRESS}/lastmessage/${user}`;
    let chatHistory: any;
    chatHistory = await axios
      .get(urlPersonal)
      .then(resp => {
        return resp;
      })
      .catch(error => console.log(error));

    return chatHistory;
  }
}

export default ChatService;

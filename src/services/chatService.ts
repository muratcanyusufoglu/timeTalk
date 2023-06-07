import axios from 'axios';
import Config from 'react-native-config';
import storage from '../storage/storage';

class ChatService {
  ADRESS = Config.ADRESS;

  async getChatHistory(user: string) {
    let urlPersonal = `${this.ADRESS}/messages/${user}`;
    let chatHistory: any;
    console.log('urlurl ', `${this.ADRESS}/messages/getPersonalChat/${user}`);
    chatHistory = await axios
      .get(urlPersonal)
      .then(resp => {
        console.log('resppp', resp);
        return resp;
      })
      .catch(error => console.log(error));

    return chatHistory;
  }

  async sendMessage(
    user: string,
    message: string,
    response: string,
    whom: string,
  ) {
    let url = this.ADRESS + '/messages';
    let date = new Date();

    await axios
      .post(url, {
        user: user,
        messageInfo: {
          user: 'crazy_61',
          whom: whom,
          message: message,
          response: response,
          date: date,
        },
      })
      .then(resp => {
        console.log('resp post', resp);
      })
      .catch(error => {
        console.log('error post', error);
      });
  }

  async getGptAnswer(input: String, userInfo: any, whom: string) {
    let urlGpt = this.ADRESS + `/messages/gpt/${whom}/${input}`;
    //let urlUser = this.ADRESS + '/users/' + userInfo.idToken;
    let answerGpt: any;

    console.log('URLGPT', urlGpt);
    await axios
      .get(urlGpt)
      .then(async item => {
        console.log('urlGPTT', item);
        answerGpt = item.data.content;
        if (answerGpt) {
          if (userInfo.freeToken > 0) {
            console.log('ftk', userInfo.freeToken);
            await axios
              .patch(urlUser, {
                freeToken: userInfo.freeToken - 1,
              })
              .then(resp => {
                console.log('insideInternet', resp);
                storage.save({
                  key: 'userInfo',
                  data: {
                    //token: Platform.OS === 'ios' ? apnToken : fcmToken,
                    accessToken: userInfo.accessToken,
                    idToken: userInfo.idToken,
                    user: userInfo.user,
                    gptToken: userInfo.gptToken,
                    freeToken: userInfo.freeToken - 1,
                    dalleToken: userInfo.dalleToken,
                  },
                  expires: null,
                });
              });
          } else {
            await axios
              .patch(urlUser, {
                gptToken: userInfo.gptTokenCount - 1,
              })
              .then(resp => {
                console.log('insideInternet', resp);
                storage.save({
                  key: 'userInfo',
                  data: {
                    //token: Platform.OS === 'ios' ? apnToken : fcmToken,
                    accessToken: userInfo.accessToken,
                    idToken: userInfo.idToken,
                    user: userInfo.user,
                    gptToken: userInfo.gptToken - 1,
                    freeToken: userInfo.freeToken,
                    dalleToken: userInfo.dalleToken,
                  },
                  expires: null,
                });
              });
          }
        }
        return answerGpt;
      })
      .catch(error => console.log('errorGPT', error));
    return answerGpt;
  }
}

export default ChatService;

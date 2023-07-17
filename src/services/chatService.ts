import axios from 'axios';
import Config from 'react-native-config';
import storage from '../storage/storage';

class ChatService {
  ADRESS = Config.ADRESS;

  async getChatHistory(user: string, whom: string) {
    let urlPersonal = `${this.ADRESS}/messagesWhom/getPersonalChat/${user}/${whom}`;
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

  async getLastMessages(user: string) {
    let urlPersonal = `${this.ADRESS}/lastmessage/${user}`;
    let chatHistory: any;
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
    let url = this.ADRESS + '/messagesWhom';
    let sendedDate = new Date().toLocaleString();

    await axios
      .post(url, {
        user: user,
        whom: whom,
        message: message,
        response: response,
        date: sendedDate,
      })
      .then(async resp => {
        console.log('resp post', resp);
        let lastmessageurl = this.ADRESS + '/lastmessage';
        await axios
          .post(lastmessageurl, {
            user: user,
            whom: whom,
            response: response,
            date: sendedDate,
          })
          .then(resplastmessage => {
            console.log('resp post', resplastmessage);
          })
          .catch(error => {
            console.log('error post', error);
          });
      })
      .catch(error => {
        console.log('error post', error);
      });
  }

  async getGptAnswer(input: String, userInfo: any, whom: string) {
    let urlGpt = this.ADRESS + `/messagesWhom/gpt/${whom}/${input}`;
    let urlUser = this.ADRESS + '/users/' + userInfo.idToken;
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

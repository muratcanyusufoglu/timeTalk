import axios, {AxiosResponse} from 'axios';
import Config from 'react-native-config';
import storage from '../storage/storage';
import {messageInterface} from '../props/generalProp';

class ChatService {
  ADRESS = Config.ADRESS;

  async getChatHistory(user: string, whom: string) {
    let urlPersonal = `${this.ADRESS}/messagesWhom/getPersonalChat/${user}/${whom}`;
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

  async getLastMessages(user: string) {
    let urlPersonal = `${this.ADRESS}/lastmessage/${user}`;
    console.log('urlpersonal', urlPersonal);
    let chatHistory: any;
    chatHistory = await axios
      .get(urlPersonal)
      .then(resp => {
        return resp;
      })
      .catch(error => console.log(error));

    return chatHistory;
  }

  async sendMessage(
    userId: string,
    userPhoto: string,
    message: string,
    response: string,
    whom: string,
    date: string,
  ) {
    let url = this.ADRESS + '/messagesWhom';
    let sendedDate = new Date().toLocaleString();

    await axios
      .post(url, {
        userId: userId,
        userPhoto: userPhoto,
        whom: whom,
        messageArray: [{message: message, response: response, date: date}],
      })
      .then(async resp => {
        console.log('resp post', resp);
        let lastmessageurl = this.ADRESS + '/lastmessage';
        await axios
          .post(lastmessageurl, {
            user: userId,
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
            await axios
              .patch(urlUser, {
                freeToken: userInfo.freeToken - 1,
              })
              .then(resp => {
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

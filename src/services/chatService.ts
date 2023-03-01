import axios from 'axios';
import Config from 'react-native-config';

class ChatService {
  ADRESS = Config.ADRESS;

  async getChatHistory() {
    let url = this.ADRESS + '/messages';
    let chatHistory: any;

    chatHistory = await axios
      .get(url)
      .then(resp => {
        console.log('resppp', resp);
        return resp;
      })
      .catch(error => console.log(error));

    return chatHistory;
  }

  async senMessage(user: string, message: string, response: string) {
    let url = this.ADRESS + '/messages';
    let date = new Date();

    await axios
      .post(url, {
        user: user,
        messageInfo: {
          message: message,
          user: 'crazy_61',
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

  async getGptAnswer(
    input: string,
    freeTokenCount: number,
    gptTokenCount: number,
    userInfo: string,
  ) {
    let urlGpt = this.ADRESS + '/messages/' + input;
    let urlUser = this.ADRESS + '/user/' + userInfo;
    let answerGpt: any;

    await axios
      .get(urlGpt)
      .then(async item => {
        answerGpt = item.data.content;
        console.log('answer', answerGpt);
        if (answerGpt) {
          if (freeTokenCount) {
            console.log('ftk', freeTokenCount);
            await axios.patch(urlUser, {
              freeToken: freeTokenCount - 1,
            });
          } else {
            await axios.patch(urlUser, {
              gptToken: gptTokenCount - 1,
            });
          }
        }
        return answerGpt;
      })
      .catch(error => console.log('error', error));
    return answerGpt;
  }
}

export default ChatService;

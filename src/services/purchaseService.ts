import axios, {AxiosResponse} from 'axios';
import Config from 'react-native-config';
import storage from '../storage/storage';
import {messageInterface} from '../props/generalProp';

class PurchaseService {
  ADRESS = Config.ADRESS;

  async getUserInfo(packageName: string, messageCoin?: number, finishDate: any) {
    await storage
      .load({
        key: 'userInfo',
      })
      .then(async resp => {
        console.log('customerInfo22', resp);
        let urlUser = this.ADRESS + '/users/' + resp.idToken;
        await axios
          .get(urlUser)
          .then(resp => {
            if(resp.data.finishDate == finishDate){
                
            }
            // storage.save({
            //   key: 'userInfo',
            //   data: {
            //     //token: Platform.OS === 'ios' ? apnToken : fcmToken,
            //     accessToken: userInfo.accessToken,
            //     idToken: userInfo.idToken,
            //     user: userInfo.user,
            //     gptToken: userInfo.gptToken,
            //     freeToken: userInfo.freeToken - 1,
            //     dalleToken: userInfo.dalleToken,
            //   },
            //   expires: null,
            // });
          })
          .catch(error => console.log('customerInfo3', error));
      });
  }
}

export default PurchaseService;

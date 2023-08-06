import axios, {AxiosResponse} from 'axios';
import Config from 'react-native-config';
import storage from '../storage/storage';
import {messageInterface} from '../props/generalProp';

class PurchaseService {
  ADRESS = Config.ADRESS;

  async getUserInfo(
    packageName: string,
    messageCoin?: number,
    finishDate?: string,
  ) {
    await storage
      .load({
        key: 'userInfo',
      })
      .then(async resp => {
        let urlUser = this.ADRESS + '/users/' + resp.idToken;
        console.log(urlUser);
        await axios
          .get(urlUser)
          .then(async resp => {
            if (packageName != undefined) {
              const messageCoin =
                packageName == 'rc_monthly_500'
                  ? 500
                  : packageName == 'rc_mothly_1000'
                  ? 1000
                  : 5000;
              if (resp.data.packageName == packageName) {
                if (resp.data.finishDate == finishDate) {
                  return null;
                } else {
                  await axios
                    .patch(urlUser, {
                      finishDate: finishDate,
                      messageCoin: messageCoin,
                    })
                    .then(resp => {
                      storage.load({key: 'userInfo'}).then(resp => {
                        storage.save({
                          key: 'userInfo',
                          data: {
                            accessToken: resp.accessToken,
                            idToken: resp.idToken,
                            user: resp.user,
                            messageCoin: messageCoin,
                            packageName: packageName,
                            finishDate: finishDate,
                          },
                          expires: null,
                        });
                      });
                    });
                }
              } else {
                await axios
                  .patch(urlUser, {
                    finishDate: finishDate,
                    messageCoin: messageCoin,
                    packageName: packageName,
                  })
                  .then(resp => {
                    storage.load({key: 'userInfo'}).then(resp => {
                      storage.save({
                        key: 'userInfo',
                        data: {
                          accessToken: resp.accessToken,
                          idToken: resp.idToken,
                          user: resp.user,
                          messageCoin: messageCoin,
                          packageName: packageName,
                          finishDate: finishDate,
                        },
                        expires: null,
                      });
                    });
                  });
              }
            } else {
              storage.load({key: 'userInfo'}).then(resp => {
                storage.save({
                  key: 'userInfo',
                  data: {
                    accessToken: resp.accessToken,
                    idToken: resp.idToken,
                    user: resp.user,
                    messageCoin: messageCoin,
                    packageName: '',
                    finishDate: finishDate,
                  },
                  expires: null,
                });
              });
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
          .catch(error => console.log('customerInfo333333', error));
      });
  }
}

export default PurchaseService;

import {Dimensions} from 'react-native';

export default class GlobalSizes {
  static widthAllScreen: number = Dimensions.get('window').width;;
  static heightAllScreen: number =Dimensions.get('window').height;;
  static loadingBarSizes: number;

  loadingBarSizes = GlobalSizes.widthAllScreen / 12;
}

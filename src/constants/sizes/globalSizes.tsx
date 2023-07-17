import {Dimensions} from 'react-native';

export default class GlobalSizes {
  static widthAllScreen: number;
  static heightAllScreen: number;
  static loadingBarSizes: number;

  widthAllScreen = Dimensions.get('window').width;
  heightAllScreen = Dimensions.get('window').width;
  loadingBarSizes = this.widthAllScreen / 12;
}

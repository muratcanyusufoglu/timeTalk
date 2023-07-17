import {useNavigation} from '@react-navigation/native';

export default class RouteFunction {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  navigation = useNavigation();
  static navigateChat: Function;

  navigateChat(this: any, whom: String) {
    return this.navigation.navigate('ChatPage', {whom: whom});
  }
}

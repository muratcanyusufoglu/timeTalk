export interface UserInfoProp {
  accessToken: string;
  idToken: string;
  user: any;
  userPhoto: string;
  freeCoin: number;
  messageCoin: number;
  packageName: string;
  notificationToken: string;
}

export interface messageInterface {
  [index: number]: {
    whom: string;
    userId: string;
    userPhoto: string;
    messageArray: {
      message: string;
      date: string;
      response: string;
    };
  };
}

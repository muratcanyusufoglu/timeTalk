export interface UserInfoProp {
  accessToken: string;
  idToken: string;
  user: any;
  gptToken: number;
  freeToken: number;
  dalleToken: number;
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

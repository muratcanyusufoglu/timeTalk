export interface UserInfoProp {
  accessToken: string;
  idToken: string;
  user: any;
  gptToken: number;
  freeToken: number;
  dalleToken: number;
}

export interface messageInterface {
  message: string;
  user: string;
  date: string;
  messageData: {
    message: string;
    user: string;
    date: string;
    response: string;
  };
}

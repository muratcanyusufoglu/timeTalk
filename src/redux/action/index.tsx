export function increment() {
  return {
    type: 'LOGIN_USER',
  };
}
export function decrement() {
  return {
    type: 'LOGOUT_USER',
  };
}
export function reset() {
  return {type: 'RESET'};
}
export function onUpdateLogin(userInfo: any) {
  return {type: 'ON_UPDATE_LOCATION', payload: userInfo};
}

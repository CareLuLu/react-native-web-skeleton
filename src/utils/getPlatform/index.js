import { Platform } from 'react-native';

const getPlatform = () => {
  if (Platform.OS === 'ios') {
    return 'ios';
  }
  if (Platform.OS === 'android') {
    return 'android';
  }
  if (Platform.OS === 'web') {
    if (typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1) {
      return 'web-mobile';
    }
    return 'web-desktop';
  }
  return Platform.OS;
};

export default getPlatform;

import {Navigation} from 'react-native-navigation';

import Connect from './Connect';
import Devices from './Devices';

export function registerScreens() {
  Navigation.registerComponent(`Connect`, () => Connect);
  Navigation.registerComponent(`Devices`, () => Devices);
}

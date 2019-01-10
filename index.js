/** @format */

import {Navigation} from 'react-native-navigation';
import {registerScreens} from './src/screen/';

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [{
          component: {
            name: 'Devices',
            options: {
              bottomTab: {
                text: 'Devices',
                icon: require('./assets/images/iot.png')
              }
            }
          }
        },
          {
            component: {
              name: 'Connect',
              options: {
                bottomTab: {
                  text: 'Connect',
                  icon: require('./assets/images/ble.png')
                }
              }
            }
          }]
      }
    }
  });
});

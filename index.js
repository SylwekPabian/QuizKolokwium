/** @format */

import {Navigation} from 'react-native-navigation';
import {Dimensions} from 'react-native';

import App from './App';
import Test from './screens/Test.js';
import Results from './screens/Results.js';
import Drawer from './screens/Drawer.js';

Navigation.registerComponent('Welcome', () => App)
Navigation.registerComponent('Test', () => Test)
Navigation.registerComponent('Results', () => Results)
Navigation.registerComponent('Drawer', () => Drawer)

const { width } = Dimensions.get('window');
Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setDefaultOptions({
    layout: {
      orientation: ['portrait']
    },
    topBar: {
      elevation: 0,
      visible: true,
      drawBehind: false,
      animate: false,
      buttonColor: 'white',
      title: {
        color: 'white',
        alignment: 'center'
      },
      background: {
        color: '#F3B31E'
      }
    }
  });

  Navigation.setRoot({
    root: {
      sideMenu: {
        left: {
          component: {
            id: 'drawerID',
            name: 'Drawer',
            fixedWidth: width
          }
        },
        center: {
          stack: {
            id: 'MAIN_STACK',
            children: [
              {
                component: {
                  name: 'Welcome',
                  options: {
                    topBar: {
                      title: {
                        text: 'Strona główna'
                      }
                    }
                  }
                },
              },
            ]
          }
        }
      },
    }
  });
});

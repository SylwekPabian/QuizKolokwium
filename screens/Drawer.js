import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {Navigation} from 'react-native-navigation';

import SQLite from 'react-native-sqlite-storage';
let DB;
const getDB = () => DB ? DB : DB = SQLite.openDatabase({ name: 'sqlitedb.db', createFromLocation: 1 });

type Props = {};
export default class Drawer extends Component<Props> {

  constructor(props) {
    super(props);
    getDB();
    this.state = {
      tests: []
    };
    //this.getAlltestData(DB);
  }

  goToScreen = (screenName, screenTitle) => {
    Navigation.mergeOptions('drawerID', {
      sideMenu: {
        left: {
          visible: false
        }
      }
    })
    Navigation.push('MAIN_STACK', {
      component: {
        name: screenName,
        options: {
          topBar: {
            title: {
              text: screenTitle
            }
          }
        }
      }
    })
  }
  
  goToTest = (screenName, testId) => {
    Navigation.mergeOptions('drawerID', {
      sideMenu: {
        left: {
          visible: false
        }
      }
    })
    Navigation.push('MAIN_STACK', {
      component: {
        name: screenName,
        options: {
          topBar: {
            title: {
              text: screenName
            }
          }
        },
        passProps: {
          testId: testId
        },
      }
    })
  }
  
  /* getAlltestData = (DB) => {
    DB.transaction((tx) => {
      tx.executeSql('SELECT * FROM tests;', [], (tx, results) => {
        let tests = [];
        for(let i = 0; i < results.rows.length; i++) {
            tests[i] = results.rows.item(i);
        }
        this.setState({
          tests: tests
        });
      });
    });
  } */

  render() {
    /* rows = []
    for(let i = 0; i < this.state.tests.length; i++) {
      rows.push(
        <View key={i} style={styles.view}>
          <TouchableOpacity key={i} onPress={() => this.goToTest('Test', this.state.tests[i].id)}>
            <Text style={styles.text}>{this.state.tests[i].name}</Text>
          </TouchableOpacity>
        </View>
      )
    } */
    
    return (
      <View style={styles.container}>
        <Text style={styles.topTitle}>
          Quiz APP
        </Text>
        <View style={styles.imageTitle}>
          <Image style={styles.image} 
                 source={{url: 'https://cdn.pixabay.com/photo/2016/11/05/11/10/quiz-1799937_960_720.png'}}/>
        </View>

        <View style={styles.button}>
          <TouchableOpacity onPress={() => this.goToScreen('Welcome', 'Home Page')}>
            <Text style={styles.text}>Strona główna</Text>
          </TouchableOpacity>
        </View>
        
        {/* {rows} */}
        
        <View style={styles.button}>
          <TouchableOpacity onPress={() => this.goToScreen('Results', 'Results')}>
            <Text style={styles.text}>Ekran wyników</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'space-around',
    alignItems: 'stretch',
    backgroundColor: '#414C51',
  },
  view: {
    justifyContent: 'center',
    alignItems: 'stretch',
    margin: 2,
    borderColor: '#2A4944',
    borderWidth: 1,
    backgroundColor: '#48BE84',
	  borderRadius: 20,
  },
  text: {
    textAlign: 'center',
    color: 'white',
    padding: 30,
    fontSize: 20,
    fontFamily: 'RobotoMono-Regular',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'stretch',
    margin: 2,
    borderColor: '#696D76',
    borderWidth: 1,
    backgroundColor: '#48BE84',
	  borderRadius: 10,
  },
  image: {
    width: 300,
    height: 200,
  },
  imageTitle: {
    marginTop: 10,
    alignItems: 'center',
  },
  topTitle: {
    backgroundColor: '#434957',
    color: 'white',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    fontSize: 40,
    fontFamily: 'RobotoMono-Bold',
  }
});

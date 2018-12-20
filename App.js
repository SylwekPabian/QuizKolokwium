import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity, AsyncStorage} from 'react-native';
import {Navigation} from 'react-native-navigation';
import FirstScreen from './screens/FirstScreen.js';

import SQLite from 'react-native-sqlite-storage';
let DB;
const getDB = () => DB ? DB : DB = SQLite.openDatabase({ name: 'sqlitedb.db', createFromLocation: 1 });

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    getDB();
    this.state = {
      internetConnection: true,
      tests: []
    };
  }
  
  componentWillMount = async() => {
    try {
      const value = await AsyncStorage.getItem('databaseDownloadDate');
      if (value == null) {
        this.downloadTests();
      } else {
        let now = new Date();
        let then = new Date(JSON.parse(value).value);
        const utc1 = Date.UTC(then.getFullYear(), then.getMonth(), then.getDate());
        const utc2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
        if( Math.floor((utc2 - utc1) / 86400000) >= 1 ) {
          this.downloadTests();
        } else {
          this.downloadDataFromDatabase(DB);
        }
      }
    } catch (error) {}
  }
  
  downloadTests = () => {
    fetch('https://pwsz-quiz-api.herokuapp.com/api/tests')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({tests: responseJson});
      this.addTestsToDatabase(DB, responseJson);
      this.downloadTestData();
    })
    .catch((error) => {
      this.setState({internetConnection: false});
      alert('Błąd połączenia');
    });
  }
  
  addTestsToDatabase = (DB, data) => {
    DB.transaction((tx) => {
      tx.executeSql('DELETE FROM tests; DELETE FROM test; VACUUM;', [], (tx, results) => {});
      for(let i = 0; i < data.length; i++) {
        tx.executeSql(
          'INSERT INTO tests (id, name, description, tags, level, numberOfTasks) VALUES (?, ?, ?, ?, ?, ?);',
          [data[i].id, data[i].name, data[i].description, JSON.stringify(data[i].tags), data[i].level, data[i].numberOfTasks]
        );
      }
    });
  }
  
  downloadTestData = () => {
    for(let i = 0; i < this.state.tests.length; i++) {
      fetch('https://pwsz-quiz-api.herokuapp.com/api/test/' + this.state.tests[i].id)
      .then((data) => data.json())
      .then((d) => {
        DB.transaction((tx) => {
          tx.executeSql(
            'INSERT INTO test (id, name, description, level, tasks, tags) VALUES (?, ?, ?, ?, ?, ?);',
            [d.id, d.name, d.description, JSON.stringify(d.level), JSON.stringify(d.tasks), JSON.stringify(d.tags)]
          );
        });
        AsyncStorage.setItem('databaseDownloadDate', JSON.stringify({"value":Date()}));
      })
      .catch((error) => {
        this.setState({internetConnection: false});
        alert('Błąd połączenia!');
      });
    }
  }
  
  downloadDataFromDatabase = (DB) => {
    DB.transaction((tx) => {
      tx.executeSql('SELECT * FROM tests;', [], (tx, results) => {
        var tests = [];
        for(let i = 0; i < results.rows.length; i++) {
          tests[i] = results.rows.item(i);
        }
        this.setState({ tests: tests });
      });
    });
  }

  goToScreen = (screenName, testId) => {
    Navigation.push(this.props.componentId, {
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

  render() {
    if( !this.state.internetConnection ) {
      return(
        <View style={styles.container}>
          <Text style={styles.text}>Włącz internet. Inaczej nie pobierzesz testów!</Text>
        </View>
      );
    } else {

      let rows = []
      for(let i = 0; i < this.state.tests.length; i++) {
        rows.push(
          <View key={i} style={styles.view}>
            <TouchableOpacity key={i} onPress={() => this.goToScreen('Test', this.state.tests[i].id)}>
              <Text style={styles.text}>{this.state.tests[i].name}</Text>
            </TouchableOpacity>
          </View>
        )
      }
      
      return (
        <View style={styles.container}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="#F3B31E"
          />
          <FirstScreen />
          <View style={styles.testsview}>
            <ScrollView>
              {rows}
            </ScrollView>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => this.goToScreen('Results')}>
              <Text style={styles.text}>Ekran wyników</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#434957',
    flexDirection: 'column',
  },
  testsview: {
    flex: 11,
  },
  footer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#F3B31E',
    padding: 10,
    borderColor: '#414852',
    borderWidth: 1,
    borderRadius: 10,
  },
  view: {
    justifyContent: 'center',
    alignItems: 'stretch',
    margin: 2,
    borderColor: '#2A4944',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#50B2BE',
  },
  text: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    fontFamily: 'RobotoMono-Regular',
    padding: 30,
  }
});

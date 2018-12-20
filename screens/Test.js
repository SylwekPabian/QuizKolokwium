import React, {Component} from 'react';
import {AsyncStorage, ScrollView, Platform, StyleSheet, Text, View, TouchableOpacity, TextInput, StatusBar} from 'react-native';
import {Navigation} from 'react-native-navigation';

import SQLite from 'react-native-sqlite-storage';
let DB;
const getDB = () => DB ? DB : DB = SQLite.openDatabase({ name: 'sqlitedb.db', createFromLocation: 1 });

type Props = {};
export default class Test extends Component<Props> {
  constructor(props) {
    super(props);
    getDB();
    this.state = {
      refreshing: false,
      id: '',
      name: '',
      description: '',
      tasks: [{
        question: '',
        answers: []
      }],
      tags: [],
      currentQuestion: 0,
      score: 0,
      nick: ''
    };
    this.getAlltestData(DB);
  }

  getAlltestData = (DB) => {
    DB.transaction((tx) => {
      tx.executeSql('SELECT * FROM test WHERE id = ?;', [this.props.testId], (tx, results) => {
        let t = results.rows.item(0);
        this.setState({
          id: t.id,
          name: t.name,
          description: t.description,
          tasks: JSON.parse(t.tasks),
          tags: JSON.parse(t.tags)
        });
      });
    });
  }

  saveTestResults = () => {
    fetch('https://pwsz-quiz-api.herokuapp.com/api/result', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nick: this.state.nick,
        score: this.state.score,
        total: this.state.tasks.length,
        type: this.state.name,
        date: new Date().toISOString().split('T')[0]
      }),
    })
    .then(() => {
      Navigation.pop('MAIN_STACK');
    })
    .catch((error) => {
      alert('Błąd połączenia!');
    });
  }
  
  buttonPress = (correctAnswer) => {
    if( correctAnswer ) {
      this.setState({score: this.state.score + 1});
    }
    this._onRefresh();
  }
  
  _onRefresh = () => {
    this.setState({
      refreshing: true,
      currentQuestion: this.state.currentQuestion + 1
    });
    this.setState({refreshing: false});
  };

  render() {
    if( this.state.currentQuestion === this.state.tasks.length ) {
      return(
        <View style={styles.container}>
          <Text style={styles.answerText}>Wynik testu:</Text>
          <Text style={styles.answerText}>{this.state.score} / {this.state.tasks.length}</Text>

          <Text style={styles.answerText}>Podaj nick:</Text>
          <TextInput
           style={styles.textInput}
           onChangeText={(nick) => this.setState({nick})}
           value={this.state.nick}
          />
          
          <TouchableOpacity style={styles.button} onPress={() => this.saveTestResults()}>
            <Text style={styles.answerText}>Wyślij wyniki</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      let answers = []
      for(let j = 0; j < this.state.tasks[this.state.currentQuestion].answers.length; j++) {
        answers.push(
          <TouchableOpacity key={j} style={styles.button} onPress={() => this.buttonPress(this.state.tasks[this.state.currentQuestion].answers[j].isCorrect)}>
            <Text style={styles.answerText}>{this.state.tasks[this.state.currentQuestion].answers[j].content}</Text>
          </TouchableOpacity>
        );
      }

      return (
        <View style={styles.container}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="#F3B31E"
          />
          <View>
            <Text style={styles.textHeader}>{this.state.name}</Text>
          </View>
          <ScrollView>
            <View style={styles.testView}>
              <View style={styles.testHeader}>
                <Text style={styles.questionText}>Pytanie {this.state.currentQuestion+1} / {this.state.tasks.length}:</Text>
                <Text style={styles.questionText}>{this.state.tasks[this.state.currentQuestion].question}</Text>
              </View>
              <View>
                {answers}
              </View>
            </View>
          </ScrollView>
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
    backgroundColor: '#414C51',
  },
  testView: {
    padding: 20,
    margin: 10,
  },
  testHeader: {
    backgroundColor: '#434957',
    borderColor: '#F3B31E',
    borderWidth: 3,
    color: 'white',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#696D76',
    color: 'white',
    padding: 20,
    margin: 2,
    borderRadius: 20,
  },
  answerText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 13,
    fontFamily: 'Mukta-Regular',
  },
  questionText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontFamily: 'RobotoMono-Regular',
  },
  textHeader: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'RobotoMono-Bold',
  },
  textInput: {
    height: 40, 
    borderColor: '#696D76', 
    color: 'white', 
    borderWidth: 1, 
    fontSize: 20,
    marginTop: 5,
  }
});

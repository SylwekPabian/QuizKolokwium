import React, { Component, PropTypes } from "react";
import {AsyncStorage, Modal, View, Text, TouchableHighlight, StyleSheet} from "react-native";

export default class FirstScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }
 
  componentWillMount = async () => {
    try {
      const value = await AsyncStorage.getItem('termsOfUseAccepted');
      if (value == null) {
        this.setModalVisible(true);
      }
      await AsyncStorage.setItem('termsOfUseAccepted', JSON.stringify({"value":"true"}));
    } catch (error) {}
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={true}
          style={styles.container}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert("Zatwierdź regulamin!");
          }}
        >
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Regulamin</Text>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>Tutaj jest treść regulaminu</Text>
            </View>
            <View style={styles.exitContainer}>
              <TouchableHighlight onPress={() => {this.setModalVisible(false)}}>
                <View style={styles.acceptButtonContainer}>
                  <Text style={styles.acceptButtonText}>Akceptuję</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#364A6A',
    flex: 1,
    marginTop: 80,
    marginBottom: 100,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: '#F5B11E'
  },
  title: {
    fontWeight: 'bold',
    color: '#DD7A36',
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
  description: {
    fontSize: 25,
    marginRight: 20,
    marginLeft: 20,
    color: '#DD7A36'
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  descriptionContainer: {
    flex: 6.5
  },
  exitContainer: {
    flex: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  acceptButtonContainer: {
    width: 200,
    height: 40,
    backgroundColor: '#F5B11E',
    borderRadius: 10,
    justifyContent: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

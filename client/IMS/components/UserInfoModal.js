import React, { useState } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";

const UserInfoModal = props => {
  const [modalVisible, setModalVisible] = useState(true);
  return (
    <View style={styles.centeredView}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
            setModalVisible(!modalVisible);
            props.navigation.navigate({routeName: 'Dashboard'})
            }}
        > 
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>User Information</Text>
                    <View style={styles.modalBody}>
                        <Text style={styles.bodyText}>Name: Raahem</Text>
                        <Text style={styles.bodyText}>Email: raahemasghar97@gmail.com</Text>
                        <Text style={styles.bodyText}>Status: Admin</Text>
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                            <View style={styles.buttonContainer}>
                                <Text style={styles.buttonText}>Back</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => props.navigation.navigate({routeName: 'Dashboard'})}>
                            <View style={styles.buttonContainer}>
                                <Text style={styles.buttonText}>Logout</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                
            
            </View>
        </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalBody:{
    backgroundColor:"#fff",
    paddingVertical:Dimensions.get('window').height * 0.13,
    paddingHorizontal:10
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.6 : Dimensions.get('window').width * 0.80,
    height: Dimensions.get('window').height > 900 ? Dimensions.get('window').height* 0.5 : Dimensions.get('window').height * 0.60
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default UserInfoModal;
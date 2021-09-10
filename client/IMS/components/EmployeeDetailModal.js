import React, { useState, useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback } from "react-native";
import ProductUpdateModal from "./ProductUpdateModal";
import { uri } from '../api.json'
import axios from "axios"
import ShowAlert from './ShowAlert'
import EmployeeChangePasswordModal from "./EmployeeChangePasswordModal";

const EmployeeDetailModal = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = React.useState(false);
  const [alertState, setAlertState] = useState(false)

  useEffect(() => {
    setModalVisible(props.state);
  }, [props.state]);

  const handleCloseUpdate = () => {
    setUpdateModalVisible(false)
  }

  function handleClose() {
    setModalVisible(false);
  }

  const deleteEmployee = (id) => {
    axios.delete(`${uri}/api/auth/employee/${id}`).then(() => props.getEmployees())
    props.handleClose()
    show()

  }
  const show = () => {
    setAlertState(!alertState)
}
  return (
    <KeyboardAvoidingView>
        <ShowAlert state={alertState} handleClose={show} alertTitle={'Success'} alertMsg={'Employee has been deleted successfully! Press OK to go back.'}/>
        <EmployeeChangePasswordModal state={isUpdateModalVisible} initialModalClose={props.handleClose} handleClose={handleCloseUpdate} title='Change Details' getEmployees={props.getEmployees} object={props.object} occupation={props.occupation} />
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          swipeDirection="left"
          visible={modalVisible}
          onSwipeComplete={() => props.handleClose()}
          onRequestClose={() => {
            props.handleClose();
          }}
        >
          <TouchableWithoutFeedback onPress={() => props.handleClose()}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.centeredView}>
            {console.log("printing object ", props.object)}
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>{props.title}</Text>
              <ScrollView>
                <View style={styles.modalBody}>
                  {props.object !== [] && (<View><Text style={styles.bodyText}>Username: {props.object.userName}</Text>
                    <Text style={styles.bodyText}>Occupation: {props.occupation === 'Admin' ? 'Admin' : 'Employee'}</Text>
                    <Text style={styles.bodyText}>Date: {props.object.date === undefined ? '---' : `${props.object.date.toLocaleString().split('T')[0]} - ${props.object.date.toLocaleString().split('T')[1].slice(0,8)}` }</Text>
                    </View>)}
                </View>
              </ScrollView>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => props.handleClose()}>
                  <View style={styles.buttonModalContainer}>
                    <Text style={styles.buttonModalText}>Back</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setUpdateModalVisible(true) }}>
                  <View style={styles.backButtonModalContainer}>
                    <Text style={styles.buttonModalText}>Update</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() =>
                  Alert.alert(
                    "Confirmation",
                    "Are you sure you want to delete?",
                    [
                      {
                        text: "No",
                        style: "cancel"
                      },
                      { text: "Yes", onPress: () => deleteEmployee(props.object._id) }
                    ],
                    { cancelable: true }

                  )
                }>
                  <View style={styles.deleteButtonModalContainer}>
                    <Text style={styles.buttonModalText}>Delete</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>


          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  bodyText: {
    fontFamily: 'Roboto',
    fontSize: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 24 : 18) : 14,
    paddingTop: Dimensions.get('window').height > 900 ? 25 : 16
  },
  modalTitle: {
    color: '#006270',
    //fontSize: Dimensions.get('window').height > 900 ? 30 : 20,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 28 : 21) : 24,
    top: 15,
  },
  //Dimensions.get('window').height < 900 ? Dimensions.get('window').height * 0.11 : Dimensions.get('window').height * 0.1
  buttonModalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius: 40,
    backgroundColor: '#00E0C7',
    paddingVertical: 8,
    paddingHorizontal: 24,
    top: Dimensions.get('window').height > 900 ? 5 : 15,
    margin: 20,
    display: 'flex',

  },
  backButtonModalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius: 40,
    backgroundColor: '#008394',
    paddingVertical: 8,
    paddingHorizontal: 24,
    top: Dimensions.get('window').height > 900 ? 5 : 15,
    margin: 20,
    display: 'flex',

  },
  deleteButtonModalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius: 40,
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 24,
    top: Dimensions.get('window').height > 900 ? 5 : 15,
    margin: 20,
    display: 'flex',

  },
  buttonModalText: {
    color: '#ffffff',
    fontSize: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 24 : 14) : 14,
    fontFamily: 'Roboto',
    fontWeight: 'bold'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalBody: {
    paddingVertical: '30%',
    paddingHorizontal: 10
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    //shadowColor: "#000",
    borderColor: "#008394",
    borderWidth: 2,
    //
    //shadowOpacity: 0.25,
    //shadowRadius: 4,
    //elevation: 5,
    width: '80%',
    height: Dimensions.get('window').height > 900 ? '65%' : Dimensions.get('window').height * 0.60
  },

});

export default EmployeeDetailModal;
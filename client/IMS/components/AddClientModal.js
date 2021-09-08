import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, TouchableWithoutFeedback } from "react-native";
import { uri } from '../api.json'
import axios from 'axios'
import { FontAwesome } from "@expo/vector-icons";
import ShowAlert from "./ShowAlert";

const AddClientModal = props => {

    // make a sale variables below:
    const [name, setName] = React.useState(``)
    
    const [phoneNumber, setPhoneNumber] = React.useState(0)


    const onChangeName = (supplierName) => {
        setName(supplierName);
    }

    const onChangePhoneNumber = (phNumber) => {
        setPhoneNumber(phNumber);
    }


    const addClient = () => {
        if(name === `` || phoneNumber === ``){
          setAlertTitle('Warning')
          setAlertMsg('Input fields may be empty. Request could not be processed.')
          show()
        }
        else {
          const data = {
          userName: name,
          phone: phoneNumber
        }
    
        axios.post(`${uri}/api/client`, data,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        ).then(res => {

          setAlertTitle('Success');
          props.getPreFormValues()
          setAlertMsg('Client added successfully!');
          show()
        })
          .catch(err => {
            setError()
          })
    
        props.handleClose(); //closing modal on done for now}
      }
    }

    const [alertState, setAlertState] = useState(false)
    const [alertTitle, setAlertTitle] = useState(``)
    const [alertMsg, setAlertMsg] = useState(``)
    const [modalVisible, setModalVisible] = useState(false);

    const show = () => {
        setAlertState(!alertState)
    }
    const setError = () => {
        setAlertTitle('Error')
        setAlertMsg('Client with this name already exists.')
        show()
    }



    return (
        <View>
            <ShowAlert state={alertState} handleClose={show} alertTitle={alertTitle} alertMsg={alertMsg} style={styles.buttonModalContainer} />
            <Modal
            onSwipeComplete={() => props.handleClose()}
            swipeDirection="left"
            animationType="slide"
            presentationStyle="overFullScreen"
            transparent
            visible={props.state}>
            <TouchableWithoutFeedback onPress={() => props.handleClose()}>
            <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.modalStyle}>
                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <View style = {{flexDirection: 'row'}}>
                    <View style = {{ right: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.16 : Dimensions.get('window').width * 0.1, top: Dimensions.get('window').height > 900 ? 26 :28}}>
                        <TouchableOpacity onPress = {() => props.handleClose()}>
                        <FontAwesome
                            name = {"arrow-left"}
                            size = {Dimensions.get('window').height > 900 ? 36:25}
                            color = {"#008394"}
                        />
                        </TouchableOpacity>
                        
                    </View>
                        <Text style={styles.modalTitle}>Add Client</Text>
                    </View>
                <View>
                    <TextInput onChangeText={onChangeName} style={styles.input} placeholder="Name" autoCorrect={false} />
                    <TextInput keyboardType = 'numeric' onChangeText={onChangePhoneNumber} style={styles.input} placeholder="Phone Number" autoCorrect={false} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', top: 45 }}>
                    <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { props.handleClose() }}>
                    <View>
                        <View style={styles.buttonModalContainerCross}>
                        <View>
                            <Text style={styles.buttonModalText}>Cancel</Text>
                        </View>
                        </View>
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { addClient() }}>
                    <View>
                        <View style={styles.buttonModalContainer}>
                        <View>
                            <Text style={styles.buttonModalText}>Done</Text>
                        </View>
                        </View>
                    </View>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
            </View>
        </Modal>
      </View>
    )
}

export default AddClientModal



const styles = StyleSheet.create({
    bodyText: {
      fontFamily: 'Roboto',
      fontSize: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 24 : 18): 14,
      paddingTop: Dimensions.get('window').height > 900 ? 25 : 16
    },  
    modalTitle : {
      color: '#006270',
      //fontSize: Dimensions.get('window').height > 900 ? 30 : 20,
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      fontSize: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 28 : 21): 24,
      top: 25,
    },
    //Dimensions.get('window').height < 900 ? Dimensions.get('window').height * 0.11 : Dimensions.get('window').height * 0.1
    buttonModalContainer : {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'space-between',
        borderRadius: 40,
        backgroundColor: '#00E0C7',
        paddingVertical: 8,
        paddingHorizontal: 24,
        
        margin: 20,
        display: 'flex'
  
    },
    buttonModalContainerCross: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'space-between',
        borderRadius: 40,
        backgroundColor: '#ff0000',
        paddingVertical: 8,
        paddingHorizontal: 24,
        //top: 45, //here is the problem
        margin: 20,
        display: 'flex'
    },
    buttonModalText :{
      color: '#ffffff',
      fontSize: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 24 : 16): 16,
      fontFamily: 'Roboto',
      fontWeight: 'bold'
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalBody:{
      paddingVertical:'30%',
      paddingHorizontal:10
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
      width: Dimensions.get('window').height > 900 ? '80%' : '98%',
      height: Dimensions.get('window').height > 900 ? '65%' : Dimensions.get('window').height * 0.60,
      borderColor: "#008394",
      borderWidth: 2,
    },
    modalStyle: {
        backgroundColor: "#fff",
        width: Dimensions.get('window').height > 900 ? 600 : 320,
        height: Dimensions.get('window').height > 900 ? 380 : 360,
        borderWidth: 2,
        borderRadius: 20,
        marginBottom: 20,
        borderColor: "#008394",
    },
    input: {
        width: Dimensions.get('window').width * 0.65,
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 40,
        marginBottom: 20,
        fontSize: 12,
        borderColor: "#008394",
        top: 60,
        height: 40,
        padding: 10,
      },
    
  });
  

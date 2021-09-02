import React, { useState, useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback } from "react-native";
import { uri } from '../api.json'
import axios from "axios"
import ShowAlert from '../components/ShowAlert';
import { FontAwesome } from "@expo/vector-icons";
const SaleDetailModal= props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = React.useState(false);
  const [alertState, setAlertState] = useState(false)
  const [alertTitle, setAlertTitle] = useState(``)
  const [alertMsg, setAlertMsg] = useState(``)

  const show = () => {
    setAlertState(!alertState)
  }
  const setError = () => {
    setAlertTitle('Error')
    setAlertMsg('Something Went Wrong')
    show()
  }
  useEffect(() => {
    setModalVisible(props.state);
  }, [props.state]);

  const handleCloseUpdate = ()=>{
    setUpdateModalVisible(false)
  }

  function handleClose() {
    setModalVisible(false);
  }

  const deleteWarehouse = (id) =>{
    axios.delete(`${uri}/api/warehouse/${id}`)
    .then(() => {
      props.handleClose();
      setAlertTitle('Success');
      setAlertMsg('Warehouse deleted successfully');
      show()})
      .catch(err => setError())
      .finally(() =>  props.getWarehouses())
      
  }
  
  return (
    <KeyboardAvoidingView>
    <View style={styles.centeredView}>
    <ShowAlert state={alertState} handleClose={show} alertTitle={alertTitle} alertMsg={alertMsg} style={styles.buttonModalContainer} />

        <Modal
            animationType="slide"
            transparent={true}
            swipeDirection="left"
            avoidKeyboard={false}
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
                     <View style={styles.modalView}>
                     <View style = {{flexDirection: 'row'}}>
                    <View style = {{ right: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.1 : Dimensions.get('window').width * 0.04, top: 18}}>
                      <TouchableOpacity onPress = {() => props.handleClose()}>
                        <FontAwesome
                          name = {"arrow-left"}
                          size = {Dimensions.get('window').height > 900 ? 30:25}
                          color = {"#008394"}
                        />
                      </TouchableOpacity>
                      
                    </View>
                    <Text style={styles.modalTitle}>{props.title}</Text>
                  </View> 
                    <ScrollView>
                    <View>
                    <View style={styles.modalBody}>
                    {props.object !== [] && (<View> 
                            <Text style={styles.bodyText}>Product: {props.object.product === undefined ? '--' : props.object.product.title}</Text>
                          <Text style={styles.bodyText}>Quantity: {props.object.quantity}</Text>
                          <Text style={styles.bodyText}>Total: {props.object.total}</Text>
                            <Text style={styles.bodyText}>Delivery Status: {props.object.deliveryStatus}</Text>
                            <Text style={styles.bodyText}>payment: {props.object.payment}</Text>
                      
                            <Text style={styles.bodyText}>Client: {props.object.client === undefined ? '--' : props.object.client.userName}</Text>
                            <Text style={styles.bodyText}>note: {props.object.note}</Text>
                            <Text style={styles.bodyText}>date: {props.object.date}</Text>
                            <Text style={styles.bodyText}>Received: {props.object.received}</Text>
                            </View>
                          )}
                    </View>
                    </View>
                    </ScrollView>
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems : 'center'}}>
                        <TouchableOpacity onPress={() => props.handleClose()}>
                            <View style={styles.buttonModalContainer}>
                                <Text style={styles.buttonModalText}>Back</Text>
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
    fontSize: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 24 : 18): 14,
    paddingTop: Dimensions.get('window').height > 900 ? 25 : 16
  },  
  modalTitle : {
    color: '#006270',
    //fontSize: Dimensions.get('window').height > 900 ? 30 : 20,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 28 : 21): 24,
    top: 15,
  },
  //Dimensions.get('window').height < 900 ? Dimensions.get('window').height * 0.11 : Dimensions.get('window').height * 0.1
  buttonModalContainer : {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius : 40,
    backgroundColor: '#00E0C7',
    paddingVertical: 8,
    paddingHorizontal: 24,
    top: Dimensions.get('window').height > 900 ? 5 : 15,
    margin: 20,
    display: 'flex',

  },
  backButtonModalContainer : {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius : 40,
    backgroundColor: '#008394',
    paddingVertical: 8,
    paddingHorizontal: 24,
    top: Dimensions.get('window').height > 900 ? 5 : 15,
    margin: 20,
    display: 'flex',
    
  },
  deleteButtonModalContainer : {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius : 40,
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 24,
    top: Dimensions.get('window').height > 900 ? 5 : 15,
    margin: 20,
    display: 'flex',
    
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  
});

export default SaleDetailModal;
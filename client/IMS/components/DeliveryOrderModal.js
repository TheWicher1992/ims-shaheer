import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import UpdateModal from "./UpdateModal";
import axios from 'axios'
import { uri } from '../api.json'
const DeliveryOrderModal = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = React.useState(false);
  const [warehouses, setWarehouses] = useState([])
  
  useEffect(() => {
    setModalVisible(props.state);
  }, [props.state]);

  const handleCloseUpdate = ()=>{
    setUpdateModalVisible(false)
  }

  function handleClose() {
    setModalVisible(false);
  }
  return (
    
    <View style={styles.centeredView}>
        <UpdateModal state={isUpdateModalVisible} handleClose={handleCloseUpdate} title='Select Warehouse' id={props.object !== [] ? props.object._id : ``} prodID = {props.object.product!==undefined ? props.object.product._id : ``} quantity={props.object !== [] ? props.object.quantity : 0}/>
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
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>{props.title}</Text>
                    <View style={styles.modalBody}>
                      {
                        props.object !== [] ? (
                          <View>
                          <Text style={styles.bodyText}>Date: {props.object.date}</Text>
                          <Text style={styles.bodyText}>Product: {props.object.product === undefined ? '--' : props.object.product.title}</Text>
                          <Text style={styles.bodyText}>Client: {props.object.client === undefined ? '--' : props.object.client.userName}</Text>
                          <Text style={styles.bodyText}>Quantity: {props.object.quantity}</Text>
                          <Text style={styles.bodyText}>Location: {props.object.location}</Text>
                          <Text style={styles.bodyText}>Note: {props.object.note}</Text>
                          <Text style={styles.bodyText}>Status: {props.object.status === true ? 'Delivered' : 'Pending'}</Text>
                          </View>
                        ) : (null)
                      }
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems : 'center'}}>
                        <TouchableOpacity onPress={() => props.handleClose()}>
                            <View style={styles.buttonModalContainer}>
                                <Text style={styles.buttonModalText}>Back</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress = {() => {setUpdateModalVisible(true)}}>
                            <View style={styles.backButtonModalContainer}>
                                <Text style={styles.buttonModalText}>Shift to Warehouse</Text>
                            </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => props.handleClose()}>
                            <View style={styles.deleteButtonModalContainer}>
                                <Text style={styles.buttonModalText}>Delete</Text>
                            </View>
                        </TouchableOpacity> */}
                    </View>
                </View>
                
            
            </View>
        </Modal>
    </View>
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
    top: Dimensions.get('window').height > 900 ? 15 : 0,
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
    top: Dimensions.get('window').height > 900 ? 35 : 25,
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
    top: Dimensions.get('window').height > 900 ? 35 : 25,
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
    top: Dimensions.get('window').height > 900 ? 35 : 15,
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
    paddingVertical: Dimensions.get('window').height > 900 ? "15%" : null,
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
    width: '80%',
    height: Dimensions.get('window').height > 900 ? '65%' : Dimensions.get('window').height * 0.60
  },
  
});

export default DeliveryOrderModal;
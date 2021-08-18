import React, { useState, useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, KeyboardAvoidingView, ScrollView } from "react-native";
import ShiftWarehouseModal from "./ShiftWarehouseModal";
import { uri } from '../api.json'
import axios from "axios"

const WarehouseDetailModal= props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = React.useState(false);
  console.log('hete', Dimensions.get('window').width)
  useEffect(() => {
    setModalVisible(props.state);
  }, [props.state]);

  const handleCloseUpdate = ()=>{
    setUpdateModalVisible(false)
  }

  function handleClose() {
    setModalVisible(false);
  }

  const deleteProduct = (id) =>{
    axios.delete(`${uri}/api/product/${id}`).then(() => props.getProducts())
    props.handleClose()
      
  }
  return (
    <KeyboardAvoidingView>
    <View style={styles.centeredView}>
        <ShiftWarehouseModal state={isUpdateModalVisible} handleClose={handleCloseUpdate} title='Shift Warehouse' name='Raahem Asghar' email='raahemasghar97@gmail.com' occupation="Employee" occupation={props.occupation}/>
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
            <View style={styles.centeredView}>
                {props.occupation === 'Admin' ? (<View style={styles.modalView}>
                    <Text style={styles.modalTitle}>{props.title}</Text>
                    <View>
                    <View style={styles.modalBody}>
                          {props.object !== [] && (<View> 
                          <Text style={styles.bodyText}>Warehouse name: {props.object.name}</Text>
                          <Text style={styles.bodyText}>Total Products: {props.object.totalProducts}</Text>
                          <Text style={styles.bodyText}>Total Stock: {props.object.totalStock}</Text></View>)}
                    </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems : 'center'}}>
                        <TouchableOpacity onPress={() => props.handleClose()}>
                            <View style={styles.buttonModalContainer}>
                                <Text style={styles.buttonModalText}>Back</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress = {() => {setUpdateModalVisible(true)}}>
                            <View style={styles.backButtonModalContainer}>
                                <Text style={styles.buttonModalText}>Shift</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>) : (<View style={styles.modalView}>
                    <Text style={styles.modalTitle}>{props.title}</Text>
                    <View>
                    <View style={styles.modalBody}>
                          {props.object !== [] && (<View> 
                          <Text style={styles.bodyText}>Warehouse name: {props.object.name}</Text>
                          <Text style={styles.bodyText}>Total Products: {props.object.totalProducts}</Text>
                          <Text style={styles.bodyText}>Total Stock: {props.object.totalStock}</Text></View>)}
                    </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems : 'center'}}>
                        <TouchableOpacity onPress={() => props.handleClose()}>
                            <View style={styles.buttonModalContainer}>
                                <Text style={styles.buttonModalText}>Back</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress = {() => {setUpdateModalVisible(true)}}>
                            <View style={styles.backButtonModalContainer}>
                                <Text style={styles.buttonModalText}>Shift</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>)}
                
                
            
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
  
});

export default WarehouseDetailModal;
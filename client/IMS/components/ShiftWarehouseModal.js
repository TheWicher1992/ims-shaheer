import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput ,TouchableWithoutFeedback } from "react-native";
import {Picker} from '@react-native-picker/picker';
import axios from 'axios'
import { uri } from '../api.json'
import ShowAlert from '../components/ShowAlert';
import { FontAwesome } from "@expo/vector-icons";

const ShiftWarehouseModal = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [warehouses, setWarehouses] = useState([])
  const [id, setID] = useState(``)
  const [selectedWarehouse, setSelectedWarehouse] = useState()
  const [filters, setFilters] = useState({
    page: 1,
    query: '*',
    sort: '*',
    sortBy: '*'
  })
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
  const catchWarning = () => {
    setAlertState(!alertState) 
    setAlertTitle('Attention')
    setAlertMsg('Something went wrong. Please restart')
  }
  const getWarehouses = async () => {
    try{

    
    const res = await axios.get(
      `${uri}/api/warehouse/${filters.page}/${filters.query}/${filters.sort}/${filters.sortBy}`
    )
    setWarehouses(res.data.warehouse.reverse())
    setSelectedWarehouse(res.data.warehouse[0]._id)
    }
    catch(err){
      catchWarning()
    }
  }
  useEffect(() => {
    getWarehouses()
  }, [])
  const shiftOnSubmit = () => {
    // props.handleClose()
    const body = {
      sourceID: props.obj.warehouse === undefined ? null : props.obj.warehouse._id,
      destID: selectedWarehouse,
      productID: props.obj.product === undefined ? null : props.obj.product._id,
      quantity: props.obj.stock,
      type: 'warehouse'
    }

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    axios.post(`${uri}/api/product/move`, body, config)
    .then(() => {
      props.handleClose();
      setAlertTitle('Success');
      setAlertMsg('Stock transferred successfully');
      show()})
      .catch(err => setError())
      .finally(() =>  props.getStock())

  }
  useEffect(() => {
    setModalVisible(props.state);
  }, [props.state]);

  function handleClose() {
    setModalVisible(false);
  }
  return (
    
    <View style={styles.centeredView}>
      <ShowAlert state={alertState} handleClose={show} alertTitle={alertTitle} alertMsg={alertMsg} style={styles.buttonModalContainer} />
      {console.log(props.id)}
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
               {
                  props.occupation==='Employee' ? (<View style={styles.modalView}>
                    <Text style={styles.modalTitle}>{props.title}</Text>
                    <View style={styles.modalBody}>
                        <TextInput value={props.obj.warehouse === undefined ? null : props.obj.warehouse.name} style={styles.input}/>
                        <TextInput value={props.obj.product === undefined ? null : props.obj.product.title} style={styles.input}/>
                        <View style={{ borderWidth: 2, borderRadius: 40, borderColor: "#008394", width: Dimensions.get('window').width * 0.65, top: Dimensions.get('window').height * 0.005, height: 40, fontSize: 8, }}>
                  <Picker style={{ top: 6, color: 'grey', fontFamily: 'Roboto' }} selectedValue={selectedWarehouse} onValueChange={(itemValue, itemIndex) =>
                    setSelectedWarehouse(itemValue)
                  } >
                    {warehouses.map((warehouse, i) => (
                      <Picker.Item label={warehouses === [] ? null : warehouse.name} value={warehouse._id} key={i} />
                    ))}
                  </Picker>
                </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems : 'center'}}>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <View style={styles.buttonModalContainer}>
                                <Text style={styles.buttonModalText}>Back</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => shiftOnSubmit()}>
                            <View style={styles.backButtonModalContainer}>
                                <Text style={styles.buttonModalText}>Done</Text>
                            </View>
                        </TouchableOpacity>
                        
                    </View>
                </View>) : (<View style={styles.modalView}>
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
                    <View style={styles.modalBody}>
                        <TextInput value={props.obj.warehouse === undefined ? null : props.obj.warehouse.name} style={styles.input}/>
                        <TextInput value={props.obj.product === undefined ? null : props.obj.product.title} style={styles.input}/>
                        <View style={{ borderWidth: 2, borderRadius: 40, borderColor: "#008394", width: Dimensions.get('window').width * 0.65, top: Dimensions.get('window').height * 0.005, height: 40, fontSize: 8, }}>
                  <Picker style={{ top: 6, color: 'grey', fontFamily: 'Roboto' }} selectedValue={selectedWarehouse} onValueChange={(itemValue, itemIndex) =>
                    setSelectedWarehouse(itemValue)
                  } >
                    {warehouses.map((warehouse, i) => (
                      <Picker.Item label={warehouses === [] ? null : warehouse.name} value={warehouse._id} key={i} />
                    ))}
                  </Picker>
                </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems : 'center'}}>
                        <TouchableOpacity onPress={() => props.handleClose()}>
                            <View style={styles.buttonModalContainer}>
                                <Text style={styles.buttonModalText}>Back</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => shiftOnSubmit()}>
                            <View style={styles.backButtonModalContainer}>
                                <Text style={styles.buttonModalText}>Done</Text>
                            </View>
                        </TouchableOpacity>
                        
                    </View>
                </View>)
                }
            </View>
        </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  bodyText: {
    fontFamily: 'Roboto',
    fontSize: Dimensions.get('window').height > 900 ? 22 : 14,
    paddingTop: Dimensions.get('window').height > 900 ? 25 : 16
  },  
  modalTitle : {
    color: '#006270',
    //fontSize: Dimensions.get('window').height > 900 ? 30 : 20,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 28 : 24): 24,
    top: 15,
  },
  buttonModalContainer : {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius : 40,
    backgroundColor: '#00E0C7',
    paddingVertical: 8,
    paddingHorizontal: 24,
    top: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 35 : null): null,
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
    top: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 35 : null): null,
    margin: 20,
    display: 'flex',
    
  },
  buttonModalContainer2 : {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius : 40,
    backgroundColor: '#00E0C7',
    paddingVertical: 8,
    paddingHorizontal: 24,
    top: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 60 : 35): 35,
    margin: 20,
    display: 'flex',

  },
  backButtonModalContainer2 : {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius : 40,
    backgroundColor: '#008394',
    paddingVertical: 8,
    paddingHorizontal: 24,
    top: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 60 : 35): 35,
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
    paddingVertical:'30%',
    paddingHorizontal:10
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    borderColor: "#008394",
    borderWidth: 2,
    width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.7 : Dimensions.get('window').width * 0.80,
    height: Dimensions.get('window').height > 900 ? Dimensions.get('window').height* 0.5 : Dimensions.get('window').height * 0.60
    // width: '80%',
    // height: Dimensions.get('window').height > 900 ? '65%' : Dimensions.get('window').height * 0.60
  },

  input: {
    height: 40,
    width: Dimensions.get('window').width * 0.65,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 20,
    marginTop: Dimensions.get('window').height > 900 ? 5 : 5,
    fontSize: 12,
    borderColor: "#008394",
    padding: 13
    
},
modalOverlay: {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
},
  
});

export default ShiftWarehouseModal;
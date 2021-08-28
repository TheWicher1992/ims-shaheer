import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, TouchableWithoutFeedback } from "react-native";
import { Picker } from '@react-native-picker/picker';
import axios from 'axios'
import { uri } from '../api.json'
import ShowAlert from '../components/ShowAlert';

const UpdateModal = props => {
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
  useEffect(() => {
    setModalVisible(props.state);
  }, [props.state]);

  function handleClose() {
    setModalVisible(false);
  }

  const shiftOnSubmit = () => {
    // props.handleClose()
    const body = {
      sourceID: props.id,
      destID: selectedWarehouse,
      productID: props.prodID,
      quantity: props.quantity,
      type: 'delivery'
    }

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    axios.post(`${uri}/api/product/move`, body, config)
      .then(res => {

        setAlertTitle('Success')
        setAlertMsg('Request has been processed, Product has been shifted to the warehouse.')
        show()
        props.handleClose()
        props.initialModalClose()
        props.getOrders()
      })
      .catch(err => {
        setAlertTitle('Warning')
        setAlertMsg('Request could not be processed.')
        show()
      })
      

  }

  return (

    <View style={styles.centeredView}>
      <ShowAlert state={alertState} handleClose={show} alertTitle={alertTitle} alertMsg={alertMsg} style={styles.buttonModalContainer} />
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
            props.title === 'Select Warehouse' ? (<View style={styles.modalView}>
              <Text style={styles.modalTitle}>{props.title}</Text>
              <View style={styles.modalBody}>
                <View style={{ borderWidth: 2, borderRadius: 40, borderColor: "#008394", width: Dimensions.get('window').width * 0.65, top: Dimensions.get('window').height * 0.03, height: 40, fontSize: 8, }}>
                  <Picker style={{ top: 6, color: 'grey', fontFamily: 'Roboto' }} selectedValue={selectedWarehouse} onValueChange={(itemValue, itemIndex) =>
                    setSelectedWarehouse(itemValue)
                  } >
                    {warehouses.map((warehouse, i) => (
                      <Picker.Item label={warehouses === [] ? null : warehouse.name} value={warehouse._id} key={selectedWarehouse} />
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', justifyContent: 'flex-end' }}>
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
            </View>) : (<View style={styles.modalView}>
              <Text style={styles.modalTitle}>{props.title}</Text>
              <View style={styles.modalBody}>
                <TextInput placeholder="Username" style={styles.input} />
                <TextInput placeholder="Email" style={styles.input} />
                <TextInput placeholder="Status" style={styles.input} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => props.handleClose()}>
                  <View style={styles.buttonModalContainer}>
                    <Text style={styles.buttonModalText}>Back</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.handleClose()}>
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
  modalTitle: {
    color: '#006270',
    //fontSize: Dimensions.get('window').height > 900 ? 30 : 20,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 28 : 24) : 24,
    top: 15,
  },
  buttonModalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius: 40,
    backgroundColor: '#00E0C7',
    paddingVertical: 8,
    paddingHorizontal: 24,
    top: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 35 : null) : null,
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
    top: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 35 : null) : null,
    margin: 20,
    display: 'flex',

  },
  buttonModalContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius: 40,
    backgroundColor: '#00E0C7',
    paddingVertical: 8,
    paddingHorizontal: 24,
    top: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 60 : 35) : 35,
    margin: 20,
    display: 'flex',

  },
  backButtonModalContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius: 40,
    backgroundColor: '#008394',
    paddingVertical: 8,
    paddingHorizontal: 24,
    top: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 60 : 35) : 35,
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
    top: Dimensions.get('window').height > 900 ? 35 : 15,
    margin: 20,
    display: 'flex',

  },
  buttonModalText: {
    color: '#ffffff',
    fontSize: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 24 : 16) : 16,
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
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    borderColor: "#008394",
    borderWidth: 2,
    width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.7 : Dimensions.get('window').width * 0.80,
    height: Dimensions.get('window').height > 900 ? Dimensions.get('window').height * 0.5 : Dimensions.get('window').height * 0.60
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

export default UpdateModal;
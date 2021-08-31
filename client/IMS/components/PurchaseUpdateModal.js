import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView, ScrollView, Switch, TouchableWithoutFeedback } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { uri } from '../api.json'
import axios from "axios"
import ShowAlert from '../components/ShowAlert';

const PurchaseUpdateModal = props => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [addBrandModal, setAddBrandModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false)
  const [quantityVal, setQuantityVal] = useState(0)
  const [serialNo, setSerialNo] = React.useState(``)
  const [productName, setProductName] = React.useState(``)
  const [clientName, setClientName] = React.useState(``)
  const [amountVal, setAmountVal] = React.useState(0)
  const [color, setColor] = React.useState(``)
  const [brand, setBrand] = React.useState(``)
  const [description, setDescription] = React.useState(``)
  const [id, setID] = useState(``)
  const [paymentType, setPaymentType] = useState(``)
  const [isWarehouse, setIsWarehouse ] = useState(false)
  const [warehouse, setWarehouse] = useState(``)
  const [totalAmount, setTotalAmount] = useState(0)
  const [location, setLocation] = useState(``)
  const [notes, setNotes] = useState(``)
  const [amountRecieved,setAmountReceived] = useState(0)
  const [alertState, setAlertState] = useState(false)
  const [alertTitle, setAlertTitle] = useState(``)
  const [alertMsg, setAlertMsg] = useState(``)

  useEffect(() => {
    props.warehouse === undefined ? null : setWarehouse(props.warehouse._id)
    setSerialNo(props.obj.serial)
    setID(props.obj._id)
    props.obj.product === undefined ? null : setProductName(props.obj.product._id)
    setAmountVal(props.obj.price)
    props.obj.payment === '' ? setPaymentType('Partial') : setPaymentType(props.obj.payment)
    setDescription(props.obj.description)
    setQuantityVal(props.obj.quantity !== undefined && props.obj.quantity)
    setNotes(props.obj.note !== undefined && props.obj.note)
    setTotalAmount(props.obj.amount !== undefined ? props.obj.amount : ``)
    props.obj.received === undefined ? 0 : setAmountReceived(props.obj.received);
    props.obj.client === undefined ? null : setClientName(props.obj.client._id)
  }, [props.obj])

  const toggleSwitch = () => {
    setIsWarehouse(!isWarehouse); 
  };
  useEffect(() => {
    setModalVisible(props.state);
  }, [props.state]);
  

  function handleClose() {
    setModalVisible(false);
  }
  const onChangeQuantity = (quant) => {
    setQuantityVal(quant);
  }

  const onChangeAmountReceived = (amount) => {
    setAmountReceived(amount);
  }

  const onChangeTotalAmount = (amount) => {
    setTotalAmount(amount);
  }

  const onChangeNotes = (noteVal) => {
    setNotes(noteVal);
  }

  const onChangeLocation = (loc) => {
    setLocation(loc);
  }

  const pressDone = () => {
    if(totalAmount === '' || amountRecieved === '' || location === ''){
      setAlertTitle('Warning')
      setAlertMsg('Input fields may be empty. Request could not be processed.')
      show()
    }
    else{
    const body = {
      product : productName,
      quantity: quantityVal,
      client : clientName,
      payment : paymentType,
      total: totalAmount,
      received : amountRecieved,
      note : notes,
      isDeliveryOrder : !isWarehouse,
      location : location,
      warehouseID : warehouse
    }

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    axios.put(`${uri}/api/purchase/${id}`, body, config)
        .then(() => {
          setAlertTitle('Success')
          setAlertMsg('Request has been processed, purchase updated.')
          show()
          props.handleClose()
          props.initialModalClose()
          props.getPurchases()
        })
        .catch(err =>{
          catchWarning()
        })
      }
  }
  const show = () => {
    setAlertState(!alertState)
  }
  const catchWarning = () => {
    setAlertState(!alertState) 
    setAlertTitle('Attention')
    setAlertMsg('Something went wrong. Please restart')
  }

  return (
    <KeyboardAvoidingView>
      <ShowAlert state={alertState} handleClose={show} alertTitle={alertTitle} alertMsg={alertMsg} style={styles.buttonModalContainer} />
      <Modal
      animationType="slide"
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="left"
        presentationStyle="overFullScreen"
        transparent
        visible={isModalVisible}>
          <TouchableWithoutFeedback onPress={() => props.handleClose()}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
        <View style={styles.centeredView}>
        <ScrollView style={{paddingVertical: 10}} showsVerticalScrollIndicator={false}>
          <View style={styles.modalView}>
            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
              <Text style={styles.modalTitle}>Update Purchase</Text>
              <View>

                <View style={{ borderWidth: 2, borderRadius: 40, borderColor: "#008394", width: Dimensions.get('window').width * 0.65, top: 50, height: 40, fontSize: 8, }}>
                  <Picker
                    style={{ top: 6, color: 'grey', fontFamily: 'Roboto' }}
                    itemStyle={{ fontWeight: '100' }}
                    selectedValue={productName}
                    onValueChange={(itemValue, itemIndex) =>
                      setProductName(itemValue)
                    }
                  >
                    {
                      props.formInputs.products.map(p => (
                        <Picker.Item key={p._id} label={p.title} value={p._id} />

                      ))
                    }

                  </Picker>
                </View>
                <View style={{ marginTop: 10 }}>
                  <TextInput onChangeText={onChangeQuantity} style={styles.input} placeholder="Quantity" autoCorrect={false} value={props.obj.quantity === undefined ? '0' : quantityVal.toString()} />
                  {paymentType === 'Partial' && <TextInput onChangeText={onChangeAmountReceived} style={styles.input} placeholder="Amount Received" value={props.obj.received === undefined ? '0' : amountRecieved.toString()} autoCorrect={false} />
                  }
                  <TextInput onChangeText={onChangeTotalAmount} style={styles.input} placeholder="Total Amount" value={props.obj.total === undefined ? '0' : totalAmount.toString()} autoCorrect={false} />
                  <TextInput onChangeText={onChangeNotes} style={styles.input} placeholder="Notes" value={props.obj.note === undefined ? '0' : notes} autoCorrect={false} />
                </View>

                <View style={{ borderWidth: 2, borderRadius: 40, borderColor: "#008394", width: Dimensions.get('window').width * 0.65, top: 60, height: 40, fontSize: 8, }}>
                  <Picker
                    style={{ top: 6, color: 'grey', fontFamily: 'Roboto' }}
                    itemStyle={{ fontWeight: '100' }}
                    placeholder="Select a Payment Type"
                    selectedValue={paymentType}
                    onValueChange={(itemValue, itemIndex) =>
                      setPaymentType(itemValue)
                    }
                  >
                    <Picker.Item label="Partial" value="Partial" />
                    <Picker.Item label="Credit" value="Credit" />
                    <Picker.Item label="Full" value="Full" />
                  </Picker>
                </View>

                <View style={{ borderWidth: 2, borderRadius: 40, borderColor: "#008394", width: Dimensions.get('window').width * 0.65, top: 80, height: 40, fontSize: 8, }}>
                  <Picker
                    style={{ top: 6, color: 'grey', fontFamily: 'Roboto' }}
                    itemStyle={{ fontWeight: '100' }}
                    selectedValue={clientName}
                    onValueChange={(itemValue, itemIndex) =>
                      setClientName(itemValue)
                    }
                  >
                    {
                      props.formInputs.clients.map(c => (
                        <Picker.Item key={c._id} label={c.userName} value={c._id} />

                      ))
                    }
                  </Picker>
                </View>


                <View style={{ marginTop: 90, }}>
                  <View style={styles.label}>
                    <Text style={styles.switch}>D/O</Text>
                    <Switch
                      trackColor={{ false: "#00E0C7", true: "#006270" }}
                      thumbColor={isEnabled ? "white" : "#006270"}
                      onValueChange={toggleSwitch}
                      value={isWarehouse}
                    />
                    <Text style={styles.switch}>W</Text>
                  </View>
                </View>

                {/* DELIVERY ORDER LOCATION OR  */}
                <View>
                  {/* this is for either warehouse selection  */}
                  {isWarehouse ?
                    <View style={{ borderWidth: 2, borderRadius: 40, borderColor: "#008394", width: Dimensions.get('window').width * 0.65, height: 40, fontSize: 8, marginBottom: 20 }}>
                      <Picker
                        style={{ top: 6, color: 'grey', fontFamily: 'Roboto' }}
                        itemStyle={{ fontWeight: '100' }}
                        selectedValue={warehouse}
                        onValueChange={(itemValue, itemIndex) =>
                          setWarehouse(itemValue)
                        }
                      >

                        {
                          props.formInputs.warehouses.map(w => (
                            <Picker.Item key={w._id} label={w.name} value={w._id} />
                          ))
                        }
                        {/* <Picker.Item label="W1" value="W1" />
                        <Picker.Item label="W2" value="W2" />
                        <Picker.Item label="W3" value="W3" /> */}

                      </Picker>
                    </View>

                    :
                    <TextInput onChangeText={onChangeLocation} style={styles.inputLast} placeholder="Location" autoCorrect={false} />
                  }</View>


              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', bottom: Dimensions.get('window').height < 700 ? 25 : 15, }}>
                <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { props.handleClose() }}>
                  <View>
                    <View style={styles.buttonModalContainerCross}>
                      <View>
                        <Text style={styles.buttonModalText}>Cancel</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { pressDone() }}>
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
          </ScrollView>
        </View>
      </Modal>



</KeyboardAvoidingView >
  );
};


const styles = StyleSheet.create({
  title: {
    color: '#006270',
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height > 900 ? 36 : 28,
  },
  modalTitle: {
    color: '#006270',
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height > 900 ? 36 : 28,
    top: 20,
  },
  modalStyle: {
    backgroundColor: "#fff",
    width: Dimensions.get('window').height > 900 ? 600 : 320,
    height: Dimensions.get('window').height > 900 ? 680 : 600,
    borderWidth: 2,
    borderRadius: 20,
    //marginBottom: 20,
    borderColor: "#008394",
    marginTop: Dimensions.get('window').height > 750 ? Dimensions.get('window').height * 0.25 : 0
  },
  subtitle: {
    color: '#008394',
    fontSize: 25,
    marginTop: 50,
    fontFamily: 'Roboto',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: Dimensions.get('window').height > 900 ? 80 : 60,
    borderRadius: 40,
    backgroundColor: '#00E0C7',
    paddingVertical: 12,
    paddingHorizontal: 32,
    left: 15
    // right: Dimensions.get('window').width / 5
    // we can also change the container to center and implement the right styling
  },
  buttonModalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius: 40,
    backgroundColor: '#00E0C7',
    paddingVertical: 8,
    paddingHorizontal: 24,
    //top: 45,
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
  buttonModalText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  buttonText: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerButton: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
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
  filterInput: {
    width: Dimensions.get('window').width * 0.35,
    height: 1000,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 4,
    marginBottom: 20,
    fontSize: 12,
    borderColor: "#008394",
  },
  searchBar: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    bottom: 30,
    left: Dimensions.get('window').height > 900 ? Dimensions.get('window').width / 11 : 0,

  },
  searchButton: {
    flexDirection: 'row',
    marginTop: Dimensions.get('window').height > 600 ? 15 : 8,
    borderRadius: 25,
    backgroundColor: '#008394',
    paddingVertical: 12,
    paddingHorizontal: 30,
    //top: 43, //HERE IS THE ISSUE
    right: 20,
  },
  searchButtonText: {
    fontSize: 15,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  buttonInput: {
    width: Dimensions.get('window').width * 0.65,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 40,
    marginBottom: 20,
    fontSize: 14,
    borderColor: "#008394",
    top: 60,
    height: 44,
    padding: 15,
    left: 30,
    paddingBottom: 13,
  },
  cells: {
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    //paddingRight: 40,
    alignItems: 'center',
    alignContent: 'center',
  },
  tableText: {
    fontSize: Dimensions.get('window').height > 900 ? 18 : 14,
  },
  tableTitleText: {
    fontSize: Dimensions.get('window').height > 900 ? 18 : 14,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalBody: {
    paddingVertical: Dimensions.get('window').height < 900 ? Dimensions.get('window').height * 0.11 : Dimensions.get('window').height * 0.1,
    paddingHorizontal: 10
  },
  modalView: {
    // margin: 20,
    backgroundColor: "white",
    borderColor: "#008394",
    borderWidth: 2,
    borderRadius: 20,
    // padding: 35,
    alignItems: "center",
    width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.7 : Dimensions.get('window').width * 0.80,
    height: Dimensions.get('window').height > 900 ? Dimensions.get('window').height * 0.5 : Dimensions.get('window').height * 0.85,
    borderColor: "#008394",

  },
  addButton: {
    borderRadius: 40,
    backgroundColor: '#00E0C7',
    height: 24,
    width: 80,

  },
  modalbuttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 12,
    marginTop: 3.5,
  },
  switch: {
    color: '#008394',
    fontSize: Dimensions.get('window').height > 900 ? 18 : 16,
    fontFamily: 'Roboto',
  },
  modalBody: {
    paddingVertical: '30%',
    paddingHorizontal: 10
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
  inputLast: {
    width: Dimensions.get('window').width * 0.65,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 40,
    marginBottom: 20,
    fontSize: 12,
    borderColor: "#008394",
    top: 0,
    height: 40,
    padding: 10,
  },
  label: {
    alignSelf: 'center',
    flexDirection: 'row',
    fontWeight: 'bold',
    marginRight: Dimensions.get('window').width * 0.80 / 2
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

});

export default PurchaseUpdateModal;
import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, Switch, TouchableWithoutFeedback } from "react-native";
import { uri } from '../api.json'
import axios from "axios"
import ShowAlert from '../components/ShowAlert';
import { FontAwesome } from "@expo/vector-icons";

const ClientPaymentModal = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setID] = useState(``)
  const [isEnabled, setIsEnabled] = useState(false);
  const [amount, setAmount] = useState(0)
  const [amountGiven, setAmountGiven] = useState(0)
  const [alertState, setAlertState] = useState(false)
  const [alertTitle, setAlertTitle] = useState(``)
  const [alertMsg, setAlertMsg] = useState(``)

  const show = () => {
    setAlertState(!alertState)
  }
  const setError = () => {
    setAlertTitle('Error')
    //setAlertMsg('Client already exists.')
    show()
  }
  const onChangeAmountReceived = (amount) => {
    setAmount(amount)
  }
  const onChangeAmountGiven = (amounts) => {
    setAmountGiven(amounts)
  }
  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
  };
  const makePaymentOrTakePayment = () => {
    const body = {
      clientId: id,
      cash: isEnabled ? Number.parseInt(amount, 10) : Number.parseInt(amountGiven, 10),
      type: isEnabled ? 'Received' : 'Payed',
    }
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }
    
    axios.post(`${uri}/api/payment`, body, config)
    .then(() => {
      props.getClients()
      setAlertTitle('Success');
      setAlertMsg(isEnabled ? 'Payment has been received!' : 'Payment has been made');
      props.initialModalClose();
      show()})
    .catch(err => console.log(err.response))
    .finally(() => {
      props.handleClose()
    })
}
  
  useEffect(() => {
    setID(props.object._id)
  }, [props.object])
  
  useEffect(() => {
    setModalVisible(props.state);
  }, [props.state]);


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
                
                <View style={styles.modalBody}>
                  <View style={styles.label}>
                    <Text style={styles.switch}>Make Payment</Text>
                    <Switch
                      trackColor={{ false: "#00E0C7", true: "#006270" }}
                      thumbColor={isEnabled ? "white" : "#006270"}
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                    />
                    <Text style={styles.switch}>Receive Payment</Text>
                  </View>
                  {
                      isEnabled ? (<View>
                          <Text style={styles.placeholder}>Amount to be Added:</Text>
                          <TextInput placeholder="Amount" onChangeText={onChangeAmountReceived} style={styles.input}/>
                          </View>) : 
                        (<View>
                            <Text style={styles.placeholder}>Amount to be Deducted:</Text>
                        <TextInput placeholder="Amount" onChangeText={onChangeAmountGiven} style={styles.input}/>
                        </View>)
                  }
                  
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems : 'center'}}>
                    <TouchableOpacity onPress={() => props.handleClose()}>
                        <View style={styles.buttonModalContainer}>
                            <Text style={styles.buttonModalText}>Back</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => makePaymentOrTakePayment()}>
                        <View style={styles.backButtonModalContainer}>
                            <Text style={styles.buttonModalText}>Done</Text>
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
    margin: 10,
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
    margin: 10,
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
    paddingVertical:'25%',
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    height: 40,
    width: Dimensions.get('window').width * 0.5,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 20,
    marginTop: Dimensions.get('window').height > 900 ? 5 : 5,
    fontSize: 12,
    borderColor: "#008394",
    padding: 13
    
},
switch: {
    color: '#008394',
    fontSize: Dimensions.get('window').height > 900 ? 18 : 16,
    fontFamily: 'Roboto',
  },
label: {
    alignSelf: 'center',
    flexDirection: 'row',
    fontWeight: 'bold',
},
placeholder: {
    flexDirection: 'row',
    marginTop: Dimensions.get('window').height > 900 ? 30 : 5,
    padding: 13
},
  
});

export default ClientPaymentModal;
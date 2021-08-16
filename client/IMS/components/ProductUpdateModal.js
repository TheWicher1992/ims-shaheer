import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView } from "react-native";
import {Picker} from '@react-native-picker/picker';
import { uri } from '../api.json'
import axios from "axios"
const UpdateModal = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [color, setColor] = React.useState()
  const [brand, setBrand] = React.useState(``)
  const [brandsAndColours, setBrandAndColours] = useState({
    brands: [],
    colours: []
  })
  //console.log('hete')
  useEffect(() => {
    setModalVisible(props.state);
    getBrandColours()
  }, [props.state]);

  function handleClose() {
    setModalVisible(false);
  }
  const onChangeSerialNo = (serial) => {
    setSerialNo(serial);
  }

  const onChangeProductName = (prodName) => {
    setProductName(prodName);
  }


  const onChangeAmount = (amount) => {
    setAmountVal(amount);
  }

  const onChangeDescription = (desc) => {
    setDescription(desc);
  }
  const getBrandColours = async () => {
    const res = await axios.get(
      `${uri}/api/product/cb`
    )

    setBrandAndColours(res.data)

    setColor(res.data.colours[0]._id)
    setBrand(res.data.brands[0]._id)

    console.log(res.data)


  }
  return (
    <KeyboardAvoidingView>
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
       
            <View style={styles.centeredView}>
               {
                  props.obj === [] ? (null) : (<View style={styles.modalView}>
                    <Text style={styles.modalTitle}>{props.title}</Text>
                    <View style={styles.modalBody}>
                        <TextInput placeholder="Serial" style={styles.input} onChangeText={onChangeSerialNo}/>
                        <TextInput placeholder="Title" style={styles.input} onChangeText={onChangeProductName}/>
                        <TextInput placeholder="Name" style={styles.input} onChangeText={onChangeAmount}/>
                        <TextInput placeholder="Description" style={styles.input} onChangeText={onChangeDescription}/>
                        <View style={{borderWidth: 2, borderRadius: 40,borderColor: "#008394",width: Dimensions.get('window').width * 0.65, top: Dimensions.get('window').height * 0.01, height: 40, fontSize: 8,  }}> 
                        <Picker selectedValue='wa' style={{top:6, color: 'grey', fontFamily: 'Roboto'}}>
                        {
                        brandsAndColours.brands.map((b => (
                          <Picker.Item key={b._id} label={b.title} value={b._id} />
                        )))
                      }
                        </Picker>
                        </View>
                        <View style={{borderWidth: 2, borderRadius: 40,borderColor: "#008394",width: Dimensions.get('window').width * 0.65, top: Dimensions.get('window').height * 0.02, height: 40, fontSize: 8,  }}> 
                        <Picker selectedValue='wa' style={{top:6, color: 'grey', fontFamily: 'Roboto'}}>
                        {
                        brandsAndColours.colours.map((c => (
                          <Picker.Item key={c._id} label={c.title} value={c._id} />
                        )))
                      }
                        </Picker>
                        </View>
                        

                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems : 'center'}}>
                        <TouchableOpacity onPress={() => props.handleClose()}>
                            <View style={styles.buttonModalContainer}>
                                <Text style={styles.buttonModalText}>Back</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => props.handleClose()}>
                            <View style={styles.backButtonModalContainer}>
                                <Text style={styles.buttonModalText}>Update</Text>
                            </View>
                        </TouchableOpacity>
                        
                    </View>
                </View>)
                }
                
                
            
            </View>
        </Modal>
    </View>
    </KeyboardAvoidingView>
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
    top: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 5 : 15): 15,
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
    top: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 5 : 15): 15,
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
    top: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 5 : 15): 15,
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
    top: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 5 : 15): 15,
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
  
});

export default UpdateModal;
import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { uri } from '../api.json'
import axios from "axios"
import ShowAlert from '../components/ShowAlert';

const ProductUpdateModal = props => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [addBrandModal, setAddBrandModal] = useState(false);
  const [serialNo, setSerialNo] = React.useState(``)
  const [productName, setProductName] = React.useState(``)
  const [amountVal, setAmountVal] = React.useState(0)
  const [color, setColor] = React.useState(``)
  const [brand, setBrand] = React.useState(``)
  const [description, setDescription] = React.useState(``)
  const [id, setID] = useState(``)

  const [alertState, setAlertState] = useState(false)
  const [alertTitle, setAlertTitle] = useState(``)
  const [alertMsg, setAlertMsg] = useState(``)
  const show = () => {
    setAlertState(!alertState)
  }

  const updateProduct = () => {
    if(serialNo === '' || productName === '' || amountVal === '' || description === ''){
      setAlertTitle('Warning')
      setAlertMsg('Input fields may be empty. Request could not be processed.')
      show()
    }
    else {
      const body = {
        title: productName,
        serial: serialNo,
        brandID: brand,
        colourID: color,
        description,
        price: amountVal
      }
  
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      }
  
      axios.put(`${uri}/api/product/${id}`, body, config)
        .then(() => {
          props.getProducts()
          setAlertTitle('Success')
          setAlertMsg('Request has been processed, Product updated.')
          show()
          props.handleClose()
        })
        .catch(err =>{
          setAlertTitle('Warning')
          setAlertMsg('Request could not be processed.')
          show()
        })
  
    }


  }

  useEffect(() => {

    setSerialNo(props.obj.serial)
    setID(props.obj._id)
    setProductName(props.obj.title)
    setAmountVal(props.obj.price)
    setDescription(props.obj.description)
    setColor(props.obj.colour !== undefined && props.obj.colour._id)
    setBrand(props.obj.brand !== undefined && props.obj.brand._id)

  }, [props.obj])


  const brandModal = () => { //to toggle model on and off -- function
    setAddBrandModal(!addBrandModal);
  };
  const [addBrand, setAddBrand] = useState(``);
  const [brandsAndColours, setBrandAndColours] = useState({
    brands: [],
    colours: []
  })
  useEffect(() => {
    setModalVisible(props.state);
    getBrandColours()
  }, [props.state]);
  const [addColorModal, setAddColorModal] = useState(false);

  const colorModal = () => {
    setAddColorModal(!addColorModal);
  }
  const onChangeNewBrand = (newBrandd) => {
    setAddBrand(newBrandd);
  }
  const [addColor, setAddColor] = useState(``);
  const addNewBrand = () => {
    if(addBrand === ''){
      setAlertTitle('Warning')
      setAlertMsg('Input fields may be empty. Request could not be processed.')
      show()
    }
    else{
      axios.post(`${uri}/api/product/brand`, {
        brand: addBrand
      }, {
        headers: {
          "Content-Type": 'application/json'
        }
      }).then(res => {
        setAlertTitle('Success')
        setAlertMsg('Request has been processed, Brand added.')
        show()
      })
      .catch(err => {
        setAlertTitle('Warning')
        setAlertMsg('Request could not be processed.')
        show()
      })
  
      getBrandColours().then(() => setAddBrandModal(false))
    }
    

  }
  const onChangeNewColor = (newColor => {
    setAddColor(newColor);
  })
  const addNewColor = () => {
    if(addColor === ''){
      setAlertTitle('Warning')
      setAlertMsg('Input fields may be empty. Request could not be processed.')
      show()
    }
    else{
      axios.post(`${uri}/api/product/colour`, {
        colour: addColor
      }, {
        headers: {
          "Content-Type": 'application/json'
        }
      }).then(res => {
        setAlertTitle('Success')
        setAlertMsg('Request has been processed, Colour added.')
        show()
      })
      .catch(err => {
        setAlertTitle('Warning')
        setAlertMsg('Request could not be processed.')
        show()
      })
  
      getBrandColours().then(() => setAddColorModal(false))
    }
    
  }
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
  }
  return (
    <KeyboardAvoidingView>
      <ShowAlert state={alertState} handleClose={show} alertTitle={alertTitle} alertMsg={alertMsg} style={styles.buttonModalContainer} />
      <Modal
        onSwipeComplete={() => props.handleClose()}
        swipeDirection="left"
        presentationStyle="overFullScreen"
        transparent
        visible={props.state}>

        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
          <ScrollView>
            <View style={styles.modalStyle}>
              <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <Text style={styles.modalTitle}>Update Product</Text>
                <View style={{ marginTop: 50 }}>
                  <TextInput onChangeText={onChangeSerialNo} style={styles.input} placeholder="Serial" value={serialNo} autoCorrect={false} />
                  <TextInput onChangeText={onChangeProductName} style={styles.input} placeholder="Product" value={productName} autoCorrect={false} />
                  <TextInput onChangeText={onChangeAmount} style={styles.input} placeholder="Amount" value={amountVal === undefined ? '0' : amountVal.toString()} autoCorrect={false} />
                  <TextInput multiline={true} numberOfLines={5} onChangeText={onChangeDescription} value={description} style={styles.input} placeholder="Description" autoCorrect={false} />

                  <View style={{ borderWidth: 2, borderRadius: 40, borderColor: "#008394", width: Dimensions.get('window').width * 0.65, height: 40, fontSize: 8, justifyContent: 'space-between' }}>
                    <Picker
                      style={{ top: 6, color: 'grey', fontFamily: 'Roboto' }}
                      itemStyle={{ fontWeight: '100' }}
                      placeholder="Select a brand"
                      selectedValue={color}
                      onValueChange={(itemValue, itemIndex) =>
                        setColor(itemValue)
                      }
                    >

                      <Picker.Item label={props.obj.colour === undefined ? "" : props.obj.colour.title} value={props.obj.colour === undefined ? "" : props.obj.colour._id} />

                      {
                        brandsAndColours.colours.map((c => (
                          c.title !== (props.obj.colour === undefined ? "" : props.obj.colour.title) && <Picker.Item key={c._id} label={c.title} value={c._id} />
                        )))
                      }
                    </Picker>
                    <View>
                      <TouchableOpacity onPress={() => { setAddColorModal(true) }}>
                        <View style={styles.addButton}>
                          <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', }}>
                            <Text style={styles.modalbuttonText}>
                              + Add
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ borderWidth: 2, borderRadius: 40, borderColor: "#008394", width: Dimensions.get('window').width * 0.65, marginTop: 40, height: 40, fontSize: 8, }}>
                    <Picker
                      style={{ top: 6, color: 'grey', fontFamily: 'Roboto' }}
                      itemStyle={{ fontWeight: '100' }}

                      selectedValue={brand}
                      onValueChange={(itemValue, itemIndex) =>
                        setBrand(itemValue)
                      }
                    >
                      <Picker.Item label={props.obj.brand === undefined ? "" : props.obj.brand.title} value={props.obj.brand === undefined ? "" : props.obj.brand._id} />

                      {
                        brandsAndColours.brands.map((b => (
                          b.title !== (props.obj.brand === undefined ? "" : props.obj.brand.title) && <Picker.Item key={b._id} label={b.title} value={b._id} />
                        )))
                      }
                    </Picker>
                    <TouchableOpacity onPress={() => { setAddBrandModal(true) }}>
                      <View style={styles.addButton}>
                        <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                          <Text style={styles.modalbuttonText}>
                            + Add
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, }}>
                  <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { props.handleClose() }}>
                    <View>
                      <View style={styles.buttonModalContainerCross}>
                        <View>
                          <Text style={styles.buttonModalText}>Cancel</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { updateProduct() }}>
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

      {/* modal for adding brand*/}
      <View>
        <Modal
          onSwipeComplete={() => setAddBrandModal(false)}
          swipeDirection="left"
          presentationStyle="overFullScreen"
          visible={addBrandModal}
          transparent
        >
          <View styles={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Add a Brand</Text>
              <View style={styles.modalBody}>
                <TextInput onChangeText={onChangeNewBrand} placeholder="Add a Brand" style={styles.input} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => brandModal()}>
                  <View style={styles.buttonModalContainer}>
                    <Text style={styles.buttonModalText}>Back</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => addNewBrand()}>
                  <View style={styles.backButtonModalContainer}>
                    <Text style={styles.buttonModalText}>Done</Text>
                  </View>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        </Modal>
      </View>

      {/* modal for adding color */}
      <View>
        <Modal
          onSwipeComplete={() => setAddColorModal(false)}
          swipeDirection="left"
          presentationStyle="overFullScreen"
          visible={addColorModal}
          transparent
        >
          <View styles={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Add a Color</Text>
              <View style={styles.modalBody}>
                <TextInput onChangeText={onChangeNewColor} placeholder="Add a Color" style={styles.input} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => colorModal()}>
                  <View style={styles.buttonModalContainer}>
                    <Text style={styles.buttonModalText}>Back</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => addNewColor()}>
                  <View style={styles.backButtonModalContainer}>
                    <Text style={styles.buttonModalText}>Done</Text>
                  </View>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        </Modal>
      </View>


    </KeyboardAvoidingView >
  );
};


const styles = StyleSheet.create({
  title: {
    color: '#006270',
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height === 1232 ? 36 : 28,
  },
  modalTitle: {
    color: '#006270',
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height === 1232 ? 36 : 28,
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
    fontSize: 15,
    borderColor: "#008394",
    //top: 60,
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
    width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.7 : Dimensions.get('window').width * 0.80,
    height: Dimensions.get('window').height > 900 ? Dimensions.get('window').height * 0.5 : Dimensions.get('window').height * 0.60
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

});

export default ProductUpdateModal;
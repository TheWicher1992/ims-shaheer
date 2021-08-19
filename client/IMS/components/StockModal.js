import React, { useState, useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, KeyboardAvoidingView, ScrollView } from "react-native";
import ShiftWarehouseModal from "./ShiftWarehouseModal";
import { uri } from '../api.json'
import axios from "axios"

const StockModal = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = React.useState(false);
  const [stock, setStock] = useState([])
  useEffect(() => {
    setModalVisible(props.state);
  }, [props.state]);
  const getStock = async () => {
    
    const res = await axios.get(
      `${uri}/api/product/stock/${props.object._id}`
    )
    setStock(res.data.stocks.reverse())
    console.log('idddd', res.data)
    //setSelectedProduct(res.data.warehouse[0]._id)
  }
//   useEffect(() => {
//     getStock()
//   }, [])
  const handleCloseUpdate = () => {
    setUpdateModalVisible(false)
    props.handleClose()
  }

  function handleClose() {
    setModalVisible(false);
  }
  return (
    <KeyboardAvoidingView>
      <View style={styles.centeredView}>
        <ShiftWarehouseModal state={isUpdateModalVisible} handleClose={handleCloseUpdate} title='Update Information' name='Raahem Asghar' email='raahemasghar97@gmail.com' occupation="Employee" getProducts={props.getProducts} obj={props.object} />
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
            {/* {console.log("printing object ", props.object)} */}
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>{props.title}</Text>
              <ScrollView>
                <View style={styles.modalBody}>
                  {props.object !== [] && (<View><Text style={styles.bodyText}>Product Name: {props.object.title}</Text>
                    <Text style={styles.bodyText}>Serial: {props.object.serial}</Text>
                    <Text style={styles.bodyText}>Brand: {props.object.brand === undefined ? '--' : props.object.brand.title}</Text>
                    {/* <Text style={styles.bodyText}>Price: {props.object.price}</Text> */}
                    <Text style={styles.bodyText}>Stock: {props.object.totalStock}</Text>
                    <Text style={styles.bodyText}>Date Added: {props.object.date}</Text>
                    </View>)}
                </View>
              </ScrollView>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => props.handleClose()}>
                  <View style={styles.buttonModalContainer}>
                    <Text style={styles.buttonModalText}>Back</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setUpdateModalVisible(true) }}>
                  <View style={styles.backButtonModalContainer}>
                    <Text style={styles.buttonModalText}>Shift</Text>
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
    fontSize: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 24 : 18) : 14,
    paddingTop: Dimensions.get('window').height > 900 ? 25 : 16
  },
  modalTitle: {
    color: '#006270',
    //fontSize: Dimensions.get('window').height > 900 ? 30 : 20,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 28 : 21) : 24,
    top: 15,
  },
  //Dimensions.get('window').height < 900 ? Dimensions.get('window').height * 0.11 : Dimensions.get('window').height * 0.1
  buttonModalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius: 40,
    backgroundColor: '#00E0C7',
    paddingVertical: 8,
    paddingHorizontal: 24,
    top: Dimensions.get('window').height > 900 ? 5 : 15,
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
    top: Dimensions.get('window').height > 900 ? 5 : 15,
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
    top: Dimensions.get('window').height > 900 ? 5 : 15,
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
    paddingVertical: '10%',
    paddingHorizontal: 10
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

export default StockModal;
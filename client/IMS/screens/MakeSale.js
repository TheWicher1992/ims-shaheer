import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Switch, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Modal, Touchable } from 'react-native';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { FontAwesome } from '@expo/vector-icons';
import { DataTable } from 'react-native-paper';
import SaleDetailModal from '../components/SaleDetailModal';
import FilterButton from '../components/FilterButton';
import { Picker } from '@react-native-picker/picker';
import { uri } from '../api.json'
import { connect } from 'react-redux'
import axios from "axios"
import Spinner from '../components/Spinner';
import ExportButton from '../components/ExportAsExcel'
import ShowAlert from '../components/ShowAlert';
import AddClientModal from '../components/AddClientModal';
import SearchableDropdown from 'react-native-searchable-dropdown';



const optionsPerPage = [2, 3, 4];

const MakeSale = props => {

  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [clients, setClients] = useState([])


  const getPreFormValues = async () => {
    try {
      const res = await axios.get(`${uri}/api/sale/form-inputs`)
      setProducts(res.data.products)
      setProductName(res.data.products[0]._id)
      setClients(res.data.clients)
      setClientName(res.data.clients[0]._id)
      let arr = []
      res.data.products.forEach(e => {
        let obj = {
          "id": e._id,
          "name": e.title
        }

        arr.push(obj)
      })

      let clientArr = []
      res.data.clients.forEach(e => {
        let obj = {
          "id": e._id,
          "name": e.userName
        }

        clientArr.push(obj)
      })

      setProductList(arr)
      setClientList(clientArr)
      

      
    } catch (err) {
      catchWarning()
    }

    
  }


  

  const getSales = async () => {
    setLoading(true)
    let q = search.trim()

    const getURI =
      `${uri}/api/sale` +
      `/${props.filters.page}` +
      `/${(q === '' ? '*' : q)}` +
      `/${props.filters.product.join(',')}` +
      `/${props.filters.client.join(',')}` +
      `/${props.filters.payment}` +
      `/${props.filters.date}` +
      `/${props.filters.maxQuantity}` +
      `/${props.filters.maxTotal}`
    try {



      const res = await axios.get(getURI)
      res.data.sales.length === 0 ? searchWarning() : null
      setSales(res.data.sales)

    }
    catch (err) {
      catchWarning()
    }
    setLoading(false)
  }




  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      getSales()
      getPreFormValues()
    })


  }, [])




  const handleConfirm = (pItems) => { // temporary for picker
    // console.log('pItems =>', pItems);
    setSelectedWarehouse(pItems);
  }

  const [page, setPage] = React.useState(0); //for pages of table
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]); //for items per page on table

  const [isModalVisible, setModalVisible] = React.useState(false); //to set modal on and off

  const toggleModal = () => { //to toggle model on and off -- function
    setModalVisible(!isModalVisible);
  };



  React.useEffect(() => { //for table
    setPage(0);
  }, [itemsPerPage]);


  const [search, setSearch] = React.useState(`*`) //for keeping track of search
  const onChangeSearch = (searchVal) => { //function to keep track of search as the user types
    setSearch(searchVal);
    console.log(search);
  }

  const searchFunc = () => {
    getSales()
  }

  const searchWarning = () => {
    setAlertState(!alertState)
    setAlertTitle('Attention')
    setAlertMsg('No Sales found!')
  }
  const catchWarning = () => {
    setAlertState(!alertState)
    setAlertTitle('Attention')
    setAlertMsg('Something went wrong. Please restart')
  }


  // make a sale variables below:
  const [productName, setProductName] = React.useState(``)
  const [quantityVal, setQuantityVal] = React.useState(0)
  const [totalAmount, setTotalAmount] = React.useState(0) //this is total amount
  const [amountReceived, setAmountReceived] = React.useState(0) //this is amount received
  const [paymentType, setPaymentType] = React.useState(`Partial`) //this is the type of payment
  const [clientName, setClientName] = React.useState(``)
  const [notes, setNotes] = React.useState(``)
  const [selectDOrderQuantity, setSelectDOrderQuantity] = React.useState(0)


  const onChangeProductName = (prodName) => {
    setProductName(prodName);
  }

  const onChangeQuantity = (quant) => {
    setQuantityVal(quant);
  }

  const onChangeAmountReceived = (amount) => { //for amount received
    setAmountReceived(amount);
  }

  const onChangeTotalAmount = (amount) => { // for total amount
    setTotalAmount(amount);
  }

  const onChangeClientName = (clName) => {
    setClientName(clName);
  }

  const onChangeNotes = (noteVal) => {
    setNotes(noteVal);
  }

  function sum(obj) {
    var sum = 0;
    for (var el in obj) {
      if (obj.hasOwnProperty(el)) {
        sum += parseFloat(obj[el]);
      }
    }
    return sum;
  }

  const addSale = () => {
    if (quantityVal === '' || totalAmount === '' || amountReceived === '' || notes === '') {
      setAlertTitle('Warning')
      setAlertMsg('Input fields may be empty. Request could not be processed.')
      show()
    }
    else {
      // setModalVisible(false); //closing modal on done for now
      const body = {
        productID: productName,
        quantity: quantityVal,
        total: totalAmount,
        payment: paymentType,
        clientID: clientName,

        note: notes,
        received: amountReceived,
        isWarehouse: isWarehouse,
        deliveryOrder: selectedDOrder,
        warehouses: warehouseIdTicksQuant,
        note: notes
      }

      console.log(body)


      let totalQuant = 0
      if (body.isWarehouse) {
        totalQuant = sum(body.warehouses.quant)
        if (totalQuant != body.quantity) {
          setAlertTitle('Warning')
          setAlertMsg('Quantities do not match. Request could not be processed.')
          show()
          return
        }
        else if (Number.parseInt(totalAmount, 10) <= Number.parseInt(amountReceived, 10) && body.payment === "Partial") {
          setAlertTitle('Warning')
          setAlertMsg('Payment type partial but amount greater then total. Request could not be processed.')
          show()
          return
        }
        else if (Number.parseInt(amountReceived, 10) != 0 && body.payment === "Full") {
          setAlertTitle('Warning')
          setAlertMsg('Payment type FULL but amount recieved is not ZERO. Request could not be processed.')
          show()
          return
        }
      }
      else {
        if (quantityVal !== selectDOrderQuantity) {
          setAlertTitle('Warning')
          setAlertMsg('Quantities do not match. Request could not be processed.')
          show()
          return
        }
      }


      axios.post(`${uri}/api/sale`, body, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          setAlertTitle('Success')
          setAlertMsg('Request has been processed, Sale added.')
          getSales()
          show()
          setModalVisible(false)
        })
        .catch(err => {
          setAlertTitle('Warning')
          setAlertMsg('Request could not be processed.')
          show()
        })
        .finally(() => {
          getSales()
        })
    }



  }


  const [isTableDetailModalVisible, setTableDetailModalVisible] = React.useState(false);

  const [isWarehouse, setIsWarehouse] = useState(false)
  const [touchedSale, setTouchedSale] = useState({})
  const [warehouseModal, setWarehouseModal] = useState(false);
  const [dOrderModal, setDOrderModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [modelRefresh, setModelRefresh] = useState(false);
  const [selectedDOrder, setSelectedDOrder] = useState(``)
  const [warehouseIdTicksQuant, setWarehouseIdTicksQuant] = useState({
    ticks: {},
    quant: {},
    ids: []
  })
  const [warehousesID, setWarehousesID] = useState([]) //keep track of warehouses

  const onPressModal = (prod) => {
    setTableDetailModalVisible(true),
      setTouchedSale(prod)
  }







  const handleClose = () => {
    setTableDetailModalVisible(false)
  }

  const [stock, setStock] = useState([])



  const getStock = async () => {
    try {


      const res = await axios.get(
        `${uri}/api/product/stock/${productName}`
      )

      setStock(res.data.stocks)


      const wareMap = {}
      const quantMap = {}
      const wareIDs = []
      res.data.stocks.warehouseStock.forEach(e => {
        if (e.stock !== 0) {
          wareMap[e.warehouse._id] = false
          quantMap[e.warehouse._id] = 0
          wareIDs.push(e.warehouse._id)
        }

      })
      // console.log("here pp ", wareMap)
      // console.log("here qq ", quantMap)
      setWarehouseIdTicksQuant({
        ticks: { ...wareMap },
        quant: { ...quantMap },
        ids: [...wareIDs]
      })
    }
    catch (err) {
      catchWarning()
    }

  }

  const openModals = (modal) => {
    getStock().then(() => {
      if (modal === "Warehouse") {
        setWarehouseModal(true)
      }
      else if (modal === "D-Order") {
        setDOrderModal(true)
      }
    })
  }


  const setQuantityWarehouses = (q, s, e) => {
   // console.log(q, s, e)
    if (e < s) {
      warehouseIdTicksQuant["quant"][q] = e
    }
    else {
      console.log("not enough stock in selected warehouse")
      return
    }
  }



  const toggleSwitch = () => {
    setIsWarehouse(!isWarehouse);
    // console.log(`switched`);
  };


  const refresh = () => {
    setModelRefresh(!modelRefresh);
  }

  const warehouseClicked = (e) => {
    if (warehouseIdTicksQuant["ticks"][e] === false) {
      // console.log("False")
      setWarehousesID([...warehousesID, e])
      warehouseIdTicksQuant["ticks"][e] = true
      refresh()
    }
    else {
      let index = warehousesID.indexOf(e)
      warehousesID.splice(index, 1)
      warehouseIdTicksQuant["ticks"][e] = false
      refresh()
    }

  }

  const setProductAndStock = (prod) => {
    setProductName(prod)
    getStock()
  }

  const [alertState, setAlertState] = useState(false)
  const [alertTitle, setAlertTitle] = useState(``)
  const [alertMsg, setAlertMsg] = useState(``)
  const show = () => {
    setAlertState(!alertState)
  }

  const [addClientModal, setAddClientModal] = useState(false);
  const closeClientModal = () => {
    setAddClientModal(false)
  }

  const [productListModal, setProductListModal] = useState(false)
  const [productList, setProductList] = useState([])
  const [prod, setProd] = useState(``)

  const [clientListModal, setClientListModal] = useState(false)
  const [clientList, setClientList] = useState([])
  const [selectedClientName, setSelectedClientName] = useState(``)
  



  return (
    
  
    <ScrollView keyboardShouldPersistTaps = 'always'>
      <ShowAlert state={alertState} handleClose={show} alertTitle={alertTitle} alertMsg={alertMsg} style={styles.buttonModalContainer} />
      <View style = {styles.centeredView}>

        {/* modal for productlist show */}
        <Modal
          onSwipeComplete= {() => setProductListModal(false)}
          animationType = "slide"
          transparent = {true}
          swipeDirection = "left"
          visible = {productListModal}
          >
            <TouchableWithoutFeedback onPress={() => setProductListModal(false)}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>

            <View style = {styles.centeredView}>
              <View style = {styles.modalView}>
                <View style = {{flexDirection: 'row'}}>
                    <View style = {{ right: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.1 : Dimensions.get('window').width * 0.04, top: 7}}>
                      <TouchableOpacity onPress = {() => setProductListModal(false)}>
                        <FontAwesome
                          name = {"arrow-left"}
                          size = {Dimensions.get('window').height > 900 ? 30:25}
                          color = {"#008394"}
                        />
                      </TouchableOpacity>
                      
                    </View>
                    
                    <Text style={styles.modalTitleNew}>Select Product</Text>

                    
                </View>
                <View style = {styles.modalBody}>
                  <SearchableDropdown
                    onTextChange={(text) => {
                      console.log(text)
                    }}
                    //On text change listner on the searchable input
                    onItemSelect={(item) => {
                      console.log(item)
                      setProd(item.name)
                      setProductName(item.id)
                    }}
                    //onItemSelect called after the selection from the dropdown
                    containerStyle={{ padding: 5, width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.6 : Dimensions.get('window').width * 0.70,}}
                    //suggestion container style
                    textInputStyle={{
                      //inserted text style
                      padding: 12,
                      borderWidth: 1,
                      borderColor: "#008394",
                      backgroundColor: '#FAF7F6',
                    }}
                    itemStyle={{
                      //single dropdown item style
                      padding: 10,
                      marginTop: 2,
                      backgroundColor: '#FAF9F8',
                      borderColor: "#008394",
                      borderWidth: 1,
                    }}
                    itemTextStyle={{
                      //text style of a single dropdown item
                      color: '#222',
                    }}
                    itemsContainerStyle={{
                      //items container style you can pass maxHeight
                      //to restrict the items dropdown hieght
                      maxHeight: '80%',
                    }}
                    items={productList}
                    //mapping of item array
                    defaultIndex={0}
                    //default selected item index
                    placeholder={prod === `` ? "Type here.." : prod}
                    //place holder for the search input
                    resetValue={false}
                    //reset textInput Value with true and false state
                    underlineColorAndroid="transparent"
                    //To remove the underline from the android input
                  />
              </View>
            </View>
          </View>
        </Modal>
        {/* modal for product ends here  */}


        {/* modal for client selection dropdown starts here */}
        <Modal
          onSwipeComplete= {() => setClientListModal(false)}
          animationType = "slide"
          transparent = {true}
          swipeDirection = "left"
          visible = {clientListModal}
          >
            <TouchableWithoutFeedback onPress={() => setClientListModal(false)}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>

            <View style = {styles.centeredView}>
              <View style = {styles.modalView}>
                <View style = {{flexDirection: 'row'}}>
                    <View style = {{ right: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.1 : Dimensions.get('window').width * 0.04, top: 7}}>
                      <TouchableOpacity onPress = {() => setClientListModal(false)}>
                        <FontAwesome
                          name = {"arrow-left"}
                          size = {Dimensions.get('window').height > 900 ? 30:25}
                          color = {"#008394"}
                        />
                      </TouchableOpacity>
                      
                    </View>
                    
                    <Text style={styles.modalTitleNew}>Select Client</Text>

                    
                </View>
                <View style = {styles.modalBody}>
                  <SearchableDropdown
                    onTextChange={(text) => {
                      console.log(text)
                    }}
                    //On text change listner on the searchable input
                    onItemSelect={(item) => {
                      console.log(item)
                      setSelectedClientName(item.name)
                      setClientName(item.id)
                    }}
                    //onItemSelect called after the selection from the dropdown
                    containerStyle={{ padding: 5, width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.6 : Dimensions.get('window').width * 0.70,}}
                    //suggestion container style
                    textInputStyle={{
                      //inserted text style
                      padding: 12,
                      borderWidth: 1,
                      borderColor: "#008394",
                      backgroundColor: '#FAF7F6',
                    }}
                    itemStyle={{
                      //single dropdown item style
                      padding: 10,
                      marginTop: 2,
                      backgroundColor: '#FAF9F8',
                      borderColor: "#008394",
                      borderWidth: 1,
                    }}
                    itemTextStyle={{
                      //text style of a single dropdown item
                      color: '#222',
                    }}
                    itemsContainerStyle={{
                      //items container style you can pass maxHeight
                      //to restrict the items dropdown hieght
                      maxHeight: '80%',
                    }}
                    items={clientList}
                    //mapping of item array
                    defaultIndex={0}
                    //default selected item index
                    placeholder={selectedClientName === `` ? "Type here.." : selectedClientName}
                    //place holder for the search input
                    resetValue={false}
                    //reset textInput Value with true and false state
                    underlineColorAndroid="transparent"
                    //To remove the underline from the android input
                  />
              </View>
            </View>
          </View>
        </Modal>
        {/* modal for client selection dropdown ends here */}



      <Modal
        onSwipeComplete={() => setWarehouseModal(false)}
        animationType="slide"
        transparent={true}
        swipeDirection="left"
        visible={warehouseModal}
      >
        <TouchableWithoutFeedback onPress={() => setWarehouseModal(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style = {{flexDirection: 'row'}}>
                  <View style = {{ right: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.1 : Dimensions.get('window').width * 0.04, top: 7}}>
                    <TouchableOpacity onPress = {() => setWarehouseModal(false)}>
                      <FontAwesome
                        name = {"arrow-left"}
                        size = {Dimensions.get('window').height > 900 ? 30:25}
                        color = {"#008394"}
                      />
                    </TouchableOpacity>
                    
                  </View>
                  
                  <Text style={styles.modalTitleNew}>Select Warehouse</Text>

                  
                </View>
            <ScrollView style={styles.modalWarehouse}>
              <View>
                {
                  stock.warehouseStock !== undefined && stock.warehouseStock !== [] && stock.warehouseStock.map((record, i) => (
                    <View key={i}>
                      <TouchableOpacity onPress={() => warehouseClicked(record.warehouse._id)}>
                        <View style={styles.inputWarehouse}>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 12, }}>
                              {record.warehouse.name} - Quantity: {record.stock}
                            </Text>
                            <View style={{ bottom: Dimensions.get('window').height > 900 ? 10 : 5, left: 10 }}>
                              {warehouseIdTicksQuant["ticks"][record.warehouse._id] === true ? (<FontAwesome
                                name={"check"}
                                size={Dimensions.get('window').height > 900 ? 30 : 25}
                                color={"#008394"}
                              />
                              ) : (null)}
                            </View>
                          </View>


                        </View>
                      </TouchableOpacity>
                      <View>
                        {warehouseIdTicksQuant["ticks"][record.warehouse._id] === true ? (
                          <TextInput onChangeText={(e) => setQuantityWarehouses(record.warehouse._id, record.stock, e)} style={styles.inputWarehouse} placeholder="Quantity" autoCorrect={false} />
                        ) : (null)}
                      </View>

                    </View>


                  ))
                }
                {
                  (stock.warehouseStock === undefined || stock.warehouseStock.length === 0) ?
                    <Text style={styles.inputWarehouse}>
                      Nothing to show
                    </Text>
                    : (null)
                }
              </View>


            </ScrollView>
          </View>

        </View>
      </Modal>


      {/* d order ---  */}
      <Modal
        onSwipeComplete={() => setDOrderModal(false)}
        animationType="slide"
        transparent={true}
        swipeDirection="left"
        visible={dOrderModal}
      >
        <TouchableWithoutFeedback onPress={() => setDOrderModal(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style = {{flexDirection: 'row'}}>
              <View style = {{ right: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.1 : Dimensions.get('window').width * 0.04, top: 7}}>
                <TouchableOpacity onPress = {() => setDOrderModal(false)}>
                  <FontAwesome
                    name = {"arrow-left"}
                    size = {Dimensions.get('window').height > 900 ? 30:25}
                    color = {"#008394"}
                  />
                </TouchableOpacity>
               
              </View>
          
              <Text style={styles.modalTitleNew}>Select Order</Text>              
            </View>
          
            
            <ScrollView style={styles.modalWarehouse}>
              {
                stock.deliverOrderStocks !== undefined && stock.deliverOrderStocks !== [] && stock.deliverOrderStocks.map((record, i) => (
                  !record.status &&
                  <TouchableOpacity key={i} onPress={() => { setSelectedDOrder(record._id); setSelectDOrderQuantity(record.quantity) }}>
                    <View style={styles.inputWarehouse}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 12, }}>
                          {record.location} - Quantity: {record.quantity}
                        </Text>
                        <View style={{ bottom: Dimensions.get('window').height > 900 ? 10 : 5, left: 10 }}>
                          {selectedDOrder === record._id ? (<FontAwesome
                            name={"check"}
                            size={Dimensions.get('window').height > 900 ? 30 : 25}
                            color={"#008394"}

                          />
                          ) : (null)}
                        </View>

                      </View>



                    </View>
                  </TouchableOpacity>



                ))
              }
              {
                (stock.deliverOrderStocks === undefined || stock.deliverOrderStocks.length === 0) ?
                  <Text style={styles.inputWarehouse}>
                    Nothing to show
                  </Text>
                  : (null)
              }

            </ScrollView>
          </View>

        </View>
      </Modal>
      
      <Modal
        onSwipeComplete={() => setModalVisible(false)}
        animationType="slide"
        transparent={true}
        swipeDirection="left"
        visible={isModalVisible}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style = {styles.centeredView}>
          {/* <ScrollView  showsVerticalScrollIndicator={false}> */}
            <View style={styles.modalStyle}>
              <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <View style = {{flexDirection: 'row'}}>
                  <View style = {{ right: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.16 : Dimensions.get('window').width * 0.1, top: Dimensions.get('window').height > 900 ? 26 :28}}>
                    <TouchableOpacity onPress = {() => setModalVisible(false)}>
                      <FontAwesome
                        name = {"arrow-left"}
                        size = {Dimensions.get('window').height > 900 ? 36:25}
                        color = {"#008394"}
                      />
                    </TouchableOpacity>
                    
                  </View>
                  
                  <Text style={styles.modalTitle}>Make a Sale</Text>
                  
                </View>
                
                <View style = {styles.modalBody}>
                  <TouchableOpacity onPress = {() => setProductListModal(true)}>
                    <View style={styles.input}>
                      <Text>
                        {prod === '' ? "Click to select a product" : `${prod} selected`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress = {() => setClientListModal(true)}>
                    <View style={styles.input}>
                      <Text>
                        {selectedClientName === '' ? "Click to select a Client" : `${selectedClientName} selected`}
                      </Text>
                    </View>
                  </TouchableOpacity>

                <View>
                  <TouchableOpacity style={{ bottom: 20 }} onPress = {() => setAddClientModal(true)} >
                    <View style={styles.addButton}>
                      <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', }}>
                        <Text style={styles.modalbuttonText}>
                          + Add
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

      
                <View style={{}}>
                  <TextInput onChangeText={onChangeQuantity} style={styles.input} placeholder="Quantity" autoCorrect={false} />
                  <TextInput onChangeText={onChangeTotalAmount} style={styles.input} placeholder="Total Amount" autoCorrect={false} />
                  {paymentType === 'Partial' && <TextInput onChangeText={onChangeAmountReceived} style={styles.input} placeholder="Amount Received" autoCorrect={false} />}
                  <TextInput multiline={true} numberOfLines={5} onChangeText={onChangeNotes} style={styles.input} placeholder="Notes" autoCorrect={false} />

                  <View style={styles.input}>
                  <View style = {{bottom: 10}}>

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

                  </View>

                  <View>
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

                  {
                    isWarehouse ?
                      <View>
                        <TouchableOpacity style={styles.buttonModalContainer} onPress={() => openModals("Warehouse")}>
                          <Text style={styles.buttonModalText}>Select Warehouse</Text>
                        </TouchableOpacity>
                      </View>

                      :

                      <View>
                        <TouchableOpacity style={styles.buttonModalContainer} onPress={() => openModals("D-Order")} >
                          <Text style={styles.buttonModalText}>Select D-Order</Text>
                        </TouchableOpacity>
                      </View>
                  }

                </View>


                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', bottom: 25 }}>
                  <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { setModalVisible(false) }}>
                    <View>
                      <View style={styles.buttonModalContainerCross}>
                        <View>
                          <Text style={styles.buttonModalText}>Cancel</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { addSale() }}>
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
            </View>
          {/* </ScrollView> */}
        </View>

      </Modal>
      </View>
      <AddClientModal state = {addClientModal} handleClose = {closeClientModal}  getPreFormValues = {getPreFormValues} />
      <SaleDetailModal state={isTableDetailModalVisible} handleClose={handleClose} title="Sale Information" object={touchedSale} occupation="Admin" />
      <View style={styles.screen}>
        <View>
          <Text style={styles.title}>Sales</Text>
        </View>
      </View>
      <View style={styles.containerButton}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'stretch' }}>
          <View>
            <TouchableOpacity onPress={() => { setModalVisible(true) }}>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Make a Sale</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
          <View style={styles.searchBar}>
            <TextInput onChangeText={onChangeSearch} style={styles.buttonInput} placeholder="type here..." autoCorrect={false} />
          </View>
          <View style={{ top: 14 }}>
            <TouchableOpacity onPress={() => { searchFunc() }}>
              <View style={styles.searchButton}>
                <FontAwesome
                  name={"search"}
                  size={16}
                  color={"#006270"}
                  style={{ right: 10, top: 3 }}
                />
                <Text style={styles.searchButtonText}>Search</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', paddingRight: 60 }}>
        <View>
          <FilterButton page="sale" getSales={getSales} />
        </View>
        <View style={{ marginTop: 25 }}>
          <ExportButton data={sales} title={'sales.xlsx'} />
        </View>
      </View>
      <Spinner loading={loading} />


      <DataTable style={{ marginTop: 15 }}>
        <DataTable.Header>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Product</Text></DataTable.Title>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Quantity</Text></DataTable.Title>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Amount</Text></DataTable.Title>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Client</Text></DataTable.Title>
        </DataTable.Header>
        {!loading && <ScrollView>
          <View>
            {
              sales.map((sale, i) => (
                <TouchableOpacity key={i} onPress={() => onPressModal(sale)}>
                  <DataTable.Row>
                    <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{sale.product === null ? '--' : sale.product.title}</Text></DataTable.Cell>
                    <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{sale.quantity === undefined ? '--' : sale.quantity}</Text></DataTable.Cell>
                    <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{sale.total === undefined ? '--' : sale.total}</Text></DataTable.Cell>
                    <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{sale.client === null ? '--' : sale.client.userName}</Text></DataTable.Cell>
                  </DataTable.Row>
                </TouchableOpacity>
              ))

            }
          </View>
        </ScrollView>}
      </DataTable>
    </ScrollView>
  


  )
}


MakeSale.navigationOptions = navigationData => {
  return {
    headerTitle: 'Zaki Sons',
    headerTitleAlign: 'center',
    headerTitleStyle: { color: 'white' },
    headerStyle: {
      backgroundColor: '#008394',
    },
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="ios-menu"
          onPress={() => {
            navigationData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};


const mapStateToProps = (state) => (
  {
    filters: state.saleFilters
  }
)

export default connect(mapStateToProps)(MakeSale)


const styles = StyleSheet.create({
  title: {
    color: '#006270',
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height > 900 ? 36 : 28,
    bottom: 25,
  },
  modalTitle: {
    color: '#006270',
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height > 900 ? 36 : 28,
    top: 20,
  },
  modalTitleNew: {
    color: '#006270',
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height > 900 ? 36 : 28,
    top: 0,
  },
  modalStyle: {
    padding: 35,
    backgroundColor: "#fff",
    width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.80 : Dimensions.get('window').width * 0.80,
    height: Dimensions.get('window').height > 900 ? Dimensions.get('window').height * 0.60 : Dimensions.get('window').height * 0.85,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#008394",
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
    marginTop: Dimensions.get('window').height > 900 ? 30 : 15,
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
    height: 40,
    padding: 10,
  },
  inputWarehouse: {
    width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.60 : Dimensions.get('window').width * 0.6,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 40,
    marginBottom: 20,
    fontSize: 12,
    borderColor: "#008394",
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
    flex: 1
  },
  tableText: {
    fontSize: Dimensions.get('window').height > 900 ? 18 : 14,
  },
  tableTitleText: {
    fontSize: Dimensions.get('window').height > 900 ? 18 : 14,
    fontWeight: 'bold'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },

  modalBody: {
    paddingVertical: Dimensions.get('window').height < 900 ? Dimensions.get('window').height * 0.05 : Dimensions.get('window').height * 0.05,
    paddingHorizontal: 10
  },
  modalWarehouse: {
    paddingVertical: Dimensions.get('window').height < 900 ? Dimensions.get('window').height * 0.05 : Dimensions.get('window').height * 0.05,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#008394",
    padding: 35,
    alignItems: "center",
    width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.7 : Dimensions.get('window').width * 0.80,
    height: Dimensions.get('window').height > 900 ? Dimensions.get('window').height * 0.5 : Dimensions.get('window').height * 0.80
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
    marginRight: Dimensions.get('window').width * 0.80 / 2
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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
})
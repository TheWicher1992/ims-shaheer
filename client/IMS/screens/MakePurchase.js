import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Switch, TouchableWithoutFeedback, Modal } from 'react-native';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { FontAwesome } from '@expo/vector-icons';
import { DataTable } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import PurchaseDetailModal from '../components/PurchaseDetailModal';
import FilterButton from '../components/FilterButton';
import axios from 'axios'
import { uri } from '../api.json'
import { connect } from 'react-redux'
import Spinner from '../components/Spinner';
import ShowAlert from '../components/ShowAlert';
import ExportButton from '../components/ExportAsExcel'
import SearchableDropdown from 'react-native-searchable-dropdown';


const optionsPerPage = [2, 3, 4];
const MakePurchase = props => {

  const [page, setPage] = React.useState(0); //for pages of table
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]); //for items per page on table

  const [isModalVisible, setModalVisible] = React.useState(false); //to set modal on and off
  const [formInputs, setFormInputs] = useState({
    clients: [],
    products: [],
    warehouses: []
  })
  const toggleModal = () => { //to toggle model on and off -- function
    setModalVisible(!isModalVisible);
  };

  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const getPurchases = async () => {
    setLoading(true)

    try {


      const getURI =
        `${uri}/api/purchase` +
        `/${props.filters.page}` +
        `/${search}` +
        `/${props.filters.product.join(',')}` +
        `/${props.filters.client.join(',')}` +
        `/${props.filters.payment}` +
        `/${props.filters.date}` +
        `/${props.filters.maxQuantity}` +
        `/${props.filters.maxTotal}`

      const res = await axios.get(getURI)
      res.data.purchases.length === 0 ? searchWarning() : null
      setPurchases(res.data.purchases)
    }
    catch (err) {
      catchWarning()
    }
    setLoading(false)
  }
  const catchWarning = () => {
    setAlertState(!alertState)
    setAlertTitle('Attention')
    setAlertMsg('Something went wrong. Please restart')
  }

  const getPreFormValues = async () => {
    try {


      const res = await axios.get(`${uri}/api/purchase/form-inputs`)
      setFormInputs(res.data)
      setProductName(res.data.products[0]._id)
      setWarehouse(res.data.warehouses[0]._id)
      setClientName(res.data.clients[0]._id)

      let arr = []
      res.data.products.forEach(e => {
        let obj = {
          "id": e._id,
          "name": e.serial + " " + e.title
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


    }
    catch (err) {
      catchWarning()
    }
  }


  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      getPurchases()
      getPreFormValues()
    })

  }, [])



  React.useEffect(() => { //for table
    setPage(0);
  }, [itemsPerPage]);


  const [search, setSearch] = React.useState(`*`) //for keeping track of search
  const onChangeSearch = (searchVal) => { //function to keep track of search as the user types
    let q = searchVal.trim()

    setSearch(q === '' ? '*' : q);
    console.log(search);
  }

  const searchFunc = () => {
    getPurchases() //printing search value for now
  }

  const searchWarning = () => {
    setAlertState(!alertState)
    setAlertTitle('Attention')
    setAlertMsg('No Purchases found!')
  }



  // make a sale variables below:
  const [productName, setProductName] = useState(``)
  const [quantityVal, setQuantityVal] = useState(0)
  const [amountReceived, setAmountReceived] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [clientName, setClientName] = useState(``)
  const [notes, setNotes] = useState(``)
  const [paymentType, setPaymentType] = useState(`Partial`) //this is the type of payment
  const [warehouse, setWarehouse] = useState(``)
  const [location, setLocation] = useState(``)



  const [isWarehouse, setIsWarehouse] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false);


  const addPurchase = () => {
    if (quantityVal === '' || totalAmount === '' || notes === '' || amountReceived === '' || (isWarehouse && warehouse === '') || (!isWarehouse && location === '')) {
      setAlertTitle('Warning')
      setAlertMsg('Input fields may be empty. Request could not be processed.')
      show()
    }
    else {
      const body = {
        product: productName,
        quantity: Number.parseInt(quantityVal,10),
        client: clientName,
        payment: paymentType,
        total: Number.parseInt(totalAmount,10),
        received: Number.parseInt(amountReceived, 10),
        note: notes,
        isDeliveryOrder: !isWarehouse,
        location,
        warehouseID: warehouse
      }
      // console.log(body)
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      }
      axios.post(`${uri}/api/purchase`, body, config)
        .then(res => {
          setAlertTitle('Success')
          setAlertMsg('Request has been processed, Purchase added.')
          show()
          setModalVisible(false)

        })
        .catch(err => {
          setAlertTitle('Warning')
          setAlertMsg('Request could not be processed.')
          show()
        })
        .finally(() => getPurchases())
    }





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



  const [isTableDetailModalVisible, setTableDetailModalVisible] = React.useState(false);

  const handleClose = () => {
    setTableDetailModalVisible(false)
  }


  const toggleSwitch = () => {
    setIsWarehouse(!isWarehouse);
  };

  const [touchedPurchase, setTouchedPurchase] = useState([])

  const selectedPurchaseRecord = (purchase) => {
    setTouchedPurchase(purchase)
    setTableDetailModalVisible(true)
  }

  const [alertState, setAlertState] = useState(false)
  const [alertTitle, setAlertTitle] = useState(``)
  const [alertMsg, setAlertMsg] = useState(``)
  const show = () => {
    setAlertState(!alertState)
  }

  const [productListModal, setProductListModal] = useState(false)
  const [productList, setProductList] = useState([])
  const [prod, setProd] = useState(``)

  const [clientListModal, setClientListModal] = useState(false)
  const [clientList, setClientList] = useState([])
  const [selectedClientName, setSelectedClientName] = useState(``)



  return (
    // <KeyboardAvoidingView style = {styles.containerView} behavior = "padding">

    <ScrollView keyboardShouldPersistTaps = 'always'>
      <ShowAlert state={alertState} handleClose={show} alertTitle={alertTitle} alertMsg={alertMsg} style={styles.buttonModalContainer} />
      <KeyboardAvoidingView>

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
                    onTextChange={(text) => console.log(text)}
                    
                    //On text change listner on the searchable input
                    onItemSelect={(item) => {
                      // console.log(item)
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
                    onTextChange={(text) => console.log(text)}
                    //On text change listner on the searchable input
                    onItemSelect={(item) => {
                      // console.log(item)
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
          onSwipeComplete={() => setModalVisible(false)}
          animationType="slide"
          transparent={true}
          swipeDirection="left"
          visible={isModalVisible}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {/* <ScrollView style={{ paddingVertical: 10 }} showsVerticalScrollIndicator={false}> */}
              <View style={styles.modalStyle}>
                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                  

                <View style = {{flexDirection: 'row'}}>
                <View style = {{ right: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.16 : Dimensions.get('window').width * 0.05, top: Dimensions.get('window').height > 900 ? 38 : 35}}>
                    <TouchableOpacity onPress = {() => setModalVisible(false)}>
                      <FontAwesome
                        name = {"arrow-left"}
                        size = {Dimensions.get('window').height > 900 ? 30:25}
                        color = {"#008394"}
                      />
                    </TouchableOpacity>
                    
                  </View>
                  
                  <Text style={styles.modalTitle}>Make a Purchase</Text>

                  
                </View>
                {Dimensions.get('window').height < 900 ? (<ScrollView>
                  <View style={{alignItems:'center'}}>
                    <View>
                      <TouchableOpacity style = {{marginTop: 60}} onPress = {() => setProductListModal(true)}>
                        <View style={styles.input2}>
                          <Text style = {{fontSize: 15, color: 'grey'}}>
                            {prod === '' ? "Click to select a Product" : `${prod}`}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    
                    <View >
                      <TouchableOpacity style = {{}} onPress = {() => setClientListModal(true)}>
                        <View style={styles.input2}>
                          <Text style = {{fontSize: 15, color: 'grey'}}>
                            {selectedClientName === '' ? "Click to select a Client" : `${selectedClientName}`}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>


                    <View style={{ }}>
                      <TextInput keyboardType = 'numeric' onChangeText={onChangeQuantity} style={styles.input} placeholder="Quantity" autoCorrect={false} />
                      {paymentType === 'Partial' && <TextInput keyboardType = 'numeric' onChangeText={onChangeAmountReceived} style={styles.input} placeholder="Amount Sent" autoCorrect={false} />
                      }
                      <TextInput keyboardType = 'numeric' onChangeText={onChangeTotalAmount} style={styles.input} placeholder="Total Amount" autoCorrect={false} />
                      <TextInput onChangeText={onChangeNotes} style={styles.input} placeholder="Notes" autoCorrect={false} />
                    </View>

                    <View style={{ borderWidth: 2, borderRadius: 40, borderColor: "#008394", width: Dimensions.get('window').width * 0.65, height: 40, fontSize: 8, }}>
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

                  
                    <View style={{ marginTop: 20 }}>
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
                              formInputs.warehouses.map(w => (
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
                  

                    <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent: 'center', bottom: Dimensions.get('window').height < 700 ? 25 : 15, }}>
                      <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { setModalVisible(false) }}>
                        <View>
                          <View style={styles.buttonModalContainerCross}>
                            <View>
                              <Text style={styles.buttonModalText}>Cancel</Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { addPurchase() }}>
                        <View>
                          <View style={styles.buttonModalContainer}>
                            <View>
                              <Text style={styles.buttonModalText}>Done</Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    </ScrollView>) 
                    : 
                    (<View style={{alignItems:'center'}}>
                      <View>
                        <View>
                          <TouchableOpacity style = {{marginTop: 60}} onPress = {() => setProductListModal(true)}>
                            <View style={styles.input2}>
                              <Text style = {{fontSize: 15, color: 'grey'}}>
                                {prod === '' ? "Click to select a Product" : `${prod}`}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>

                    
                        <View >
                          <TouchableOpacity style = {{}} onPress = {() => setClientListModal(true)}>
                            <View style={styles.input2}>
                              <Text style = {{fontSize: 15, color: 'grey'}}>
                                {selectedClientName === '' ? "Click to select a Client" : `${selectedClientName}`}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View style={{  }}>
                          <TextInput keyboardType = 'numeric' onChangeText={onChangeQuantity} style={styles.input} placeholder="Quantity" autoCorrect={false} />
                          {paymentType === 'Partial' && <TextInput keyboardType = 'numeric' onChangeText={onChangeAmountReceived} style={styles.input} placeholder="Amount Sent" autoCorrect={false} />
                          }
                          <TextInput keyboardType = 'numeric' onChangeText={onChangeTotalAmount} style={styles.input} placeholder="Total Amount" autoCorrect={false} />
                          <TextInput onChangeText={onChangeNotes} style={styles.input} placeholder="Notes" autoCorrect={false} />
                        </View>
    
                        <View style={{ borderWidth: 2, borderRadius: 40, borderColor: "#008394", width: Dimensions.get('window').width * 0.65, height: 40, fontSize: 8, }}>
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
    
  
                        <View style={{ marginTop: 20, }}>
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
                                  formInputs.warehouses.map(w => (
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
                      
    
                        <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent: 'center', bottom: Dimensions.get('window').height < 700 ? 25 : 15, }}>
                          <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { setModalVisible(false) }}>
                            <View>
                              <View style={styles.buttonModalContainerCross}>
                                <View>
                                  <Text style={styles.buttonModalText}>Cancel</Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => { addPurchase() }}>
                            <View>
                              <View style={styles.buttonModalContainer}>
                                <View>
                                  <Text style={styles.buttonModalText}>Done</Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                        </View>)}
                  
                </View>
              </View>
            {/* </ScrollView> */}
          </View>
        </Modal>
      </KeyboardAvoidingView>
      <PurchaseDetailModal state={isTableDetailModalVisible} handleClose={handleClose} title='Purchase Detail' object={touchedPurchase} getPurchase={getPurchases} />
      <View style={styles.screen}>
        <View>
          <Text style={styles.title}>Purchases</Text>
        </View>
      </View>
      <View style={styles.containerButton}>
        <TouchableOpacity onPress={() => { setModalVisible(true) }}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Add Purchase</Text>
          </View>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
          <View style={styles.searchBar}>
            <TextInput onChangeText={onChangeSearch} style={styles.buttonInput} placeholder="type here..." autoCorrect={false} />
          </View>
          <View style={{ top: 15 }}>
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
          <FilterButton getPurchases={getPurchases} page="purchase" />
        </View>
        <View style={{ marginTop: 25 }}>
          <ExportButton data={purchases} title={'purchases.xlsx'} screenName='purchases'/>
        </View>
      </View>
      <Spinner loading={loading} />
      {

        <DataTable style={{ marginTop: 15 }}>
          <DataTable.Header>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Product</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Quantity</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Price</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Client</Text></DataTable.Title>
          </DataTable.Header>

          {!loading && <ScrollView>
            <View>


              {purchases.map((p, i) => (
                <TouchableOpacity key={i} onPress={() => selectedPurchaseRecord(p)}>
                  <DataTable.Row>
                    <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{p.product.title}</Text></DataTable.Cell>
                    <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{p.quantity}</Text></DataTable.Cell>
                    <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{p.total}</Text></DataTable.Cell>
                    <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{p.client.userName}</Text></DataTable.Cell>
                  </DataTable.Row>
                </TouchableOpacity>
              ))}
            </View>

          </ScrollView>}


        </DataTable>

      }
    </ScrollView>
    // </KeyboardAvoidingView>


  )
}


MakePurchase.navigationOptions = navigationData => {
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
    filters: state.purchaseFilters
  }
)

export default connect(mapStateToProps)(MakePurchase)


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
    top: 30,
  },
  modalStyle: {
    backgroundColor: "#fff",
    width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.80 : Dimensions.get('window').width * 0.80,
    height: Dimensions.get('window').height > 900 ? Dimensions.get('window').height * 0.60 : Dimensions.get('window').height* 0.86,
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
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
    marginTop: Dimensions.get('window').height > 900 ? 40 : 30,
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
    // top: 60,
    height: 40,
    padding: 10,
  },
  input2: {
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
  modalTitleNew: {
    color: '#006270',
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height > 900 ? 36 : 28,
    top: 0,
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
    paddingVertical: Dimensions.get('window').height < 900 ? Dimensions.get('window').height * 0.11 : Dimensions.get('window').height * 0.1,
    paddingHorizontal: 10
  },
  modalView: {
    borderColor: "#008394",
    borderWidth: 2,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.7 : Dimensions.get('window').width * 0.80,
    height: Dimensions.get('window').height > 900 ? Dimensions.get('window').height * 0.5 : Dimensions.get('window').height * 0.60
  },
  switch: {
    color: '#008394',
    fontSize: Dimensions.get('window').height === 1232 ? 18 : 16,
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
})
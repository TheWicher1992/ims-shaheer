import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Modal, Touchable } from 'react-native';
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
import { Card, Button, Icon } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';



const optionsPerPage = [2, 3, 4];

const MakeSale = props => {

  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(false)
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
      console.log("sales", res.data.sales)

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
      getWarehouses()
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
    // console.log(search);
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
    if (multipleProducts.length === 0) {
      setAlertTitle('Warning')
      setAlertMsg('No Products selected.')
      show()
      return
    }
    if(selectedClientName === ''){
      setAlertTitle('Warning')
      setAlertMsg('No Client selected.')
      show()
      return
    }
    if ( (amountReceived === '' && paymentType === 'Partial') || notes === '') {
      setAlertTitle('Warning')
      setAlertMsg('Input fields may be empty. Request could not be processed.')
      show()
    }
    else {
      const body = {
        products: multipleProducts,
        payment: paymentType,
        clientID: clientName,
        note: notes,
        received: Number.parseInt(amountReceived, 10),
      }


      console.log("body", body)


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
          setMultipleProducts([])
          setSelectedClientName('')
          setProductIdList([])
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
    names: {},
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
        setIsWarehouse(true)
        setWarehouseModal(true)
      }
      else if (modal === "D-Order") {
        setDOrderModal(true)
        setIsWarehouse(false)
      }
    })
  }



  const setQuantityWarehouses = (q, s, e) => {

    if (e < 1) {
      setAlertTitle('Warning')
      setAlertMsg('Please select a quantity greater than 0.')
      show()
      setWarehouseModal(false)
      return
    }
    else if (e <= s) {
      warehouseIdTicksQuant["quant"][q] = e
    }
    else {
      setAlertTitle('Warning')
      setAlertMsg('The quantity you are trying to select is not available in the selected warehouse.')
      show()
      setWarehouseModal(false)
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

  //to store warehouses
  const [warehouses, setWarehouses] = useState({})

  // to get warehouses
  const getWarehouses = async () => {
    try {
      const res = await axios.get(
        `${uri}/api/warehouse/${1}/${'*'}/${'*'}/${'*'}`
      )
      // console.log(res.data.warehouse)
      let wareObj = {}
      res.data.warehouse.forEach(e => {
        wareObj[e._id] = e.name
      })
      setWarehouses(wareObj)
      // console.log("warehouse data", wareObj)
    }
    catch (err) {
      catchWarning()
    }

  }


  // for selection of warehouse or delivery order modal
  const [selectWorDModal, setSelectWorDModal] = useState(false);

  // multiple products
  const [multipleProducts, setMultipleProducts] = useState([])

  // product ids checker for the condition where a product is selected again
  const [productIdList, setProductIdList] = useState([])

  // on selection of single product with warehouse
  const selectionOfProduct = () => {
    if(priceIndividual === ''){
      setAlertTitle('Warning')
      setAlertMsg('Please enter a price for the selected product')
      show()
      return
    }
    setProductIdList([...productIdList, productName])
    if (isWarehouse === true) { //if sale is being done from a warehouse
      //for warehouse
      let wareArray = []
      let count = 0
      let totalQuantity = 0
      warehouseIdTicksQuant.ids.forEach(e => {
        if (warehouseIdTicksQuant["ticks"][e] === true) {
          //increasing count here because of another check which doesnt work directly
          count = count + 1
          totalQuantity = totalQuantity + parseInt(warehouseIdTicksQuant["quant"][e])
          if (warehouseIdTicksQuant["quant"][e] === 0) { // empty quantity condition
            setAlertTitle('Warning')
            setAlertMsg('Atleast 1 of the quantities is not filled.')
            show()
            return
          }
          let obj = {
            id: e,
            quantity: parseInt(warehouseIdTicksQuant["quant"][e])
          }
          wareArray.push(obj)
        }
      })

      if (count === 0) {
        //empty array nothing selected
        setAlertTitle('Warning')
        setAlertMsg('Please select atleast 1 or more warehouses')
        show()
        return
      }

      const body = {
        name: prod,
        price: parseInt(priceIndividual),
        id: productName,
        typeOfSale: isWarehouse === true ? 'Warehouse' : 'DeliveryOrder',
        deliveryOrderId: '',
        warehouses: wareArray,
        quantity: totalQuantity,
      }
      setMultipleProducts([...multipleProducts, body])
      // console.log(body)
      setWarehouseModal(false)
      setPriceModal(false)
      setSelectWorDModal(false)
      setPriceIndividual('')

    }
    else {
      //for deliveryOrder
      if (selectedDOrder === '') {
        //show alert that you need to select 1 delivery order
        setAlertTitle('Warning')
        setAlertMsg('Please select a Delivery Order.')
        show()
        return
      }
      const body = {
        name: prod,
        price: parseInt(priceIndividual),
        id: productName,
        typeOfSale: isWarehouse === true ? 'Warehouse' : 'DeliveryOrder',
        deliveryOrderId: selectedDOrder,
        warehouses: [],
        quantity: selectDOrderQuantity,
      }
      setMultipleProducts([...multipleProducts, body])
      setDOrderModal(false)
      setSelectWorDModal(false)
      setPriceModal(false)
      setPriceIndividual('')




    }





  }


  const printWarehouseDetails = (record) => {
    return (
      <View>
        {record.warehouses.map((e, i) => (
          <View key={i}>
            <Text>
              Warehouse Name: {warehouses[e.id]}
            </Text>
            <Text style={{}}>
              Quantity: {e.quantity}
            </Text>
          </View>
        ))}
        <Text>
          Price: {record.price}
        </Text>
      </View>
      
    )
  }


  const deleteRecord = (record) => {
    let id = ''
    multipleProducts.map((e, i) => {
      if (e === record) { // delete the index i of multiple products array
        multipleProducts.splice(i, 1)
        id = e.id
      }
    })
    productIdList.splice(productIdList.indexOf(id), 1)
    refresh()

  }

  const itemSelected = (item) => {
    // console.log(productIdList)
    if (productIdList.includes(item.id) === true) {
      // then it already exists
      setAlertTitle('Warning')
      setAlertMsg('This product has already been selected. Please remove it to select it again')
      show()
    }
    else {
      setProd(item.name)
      setProductName(item.id)
      setSelectWorDModal(true)
    }
  }

  const [priceIndividual, setPriceIndividual] = useState('');
  const [priceModal, setPriceModal] = useState(false);
  const onChangePriceIndividual = (val) => {
    setPriceIndividual(val)
  }

  const checkForSelection = () => {
    let count = 0
    if(isWarehouse === true){
      warehouseIdTicksQuant.ids.forEach(e => {
        if (warehouseIdTicksQuant["ticks"][e] === true) {
          //increasing count here because of another check which doesnt work directly
          count = count + 1
          if (warehouseIdTicksQuant["quant"][e] === 0) { // empty quantity condition
            setAlertTitle('Warning')
            setAlertMsg('Atleast 1 of the quantities is not filled.')
            show()
            return
          }
        }
      })
      if (count === 0) {
        //empty array nothing selected
        setAlertTitle('Warning')
        setAlertMsg('Please select atleast 1 or more warehouses')
        show()
        return
      }
    }

    
    if(isWarehouse === false && selectedDOrder === ''){
      //show alert that you need to select 1 delivery order
      setAlertTitle('Warning')
      setAlertMsg('Please select a Delivery Order.')
      show()
      return
    }
    else{
      setPriceModal(true);
    }
  }


  return (


    <ScrollView keyboardShouldPersistTaps='always'>
      <ShowAlert state={alertState} handleClose={show} alertTitle={alertTitle} alertMsg={alertMsg} style={styles.buttonModalContainer} />
      <View style={styles.centeredView}>

        {/* modal for selecting price */}
        <Modal
          onSwipeComplete={() => setPriceModal(false)}
          animationType="slide"
          transparent={true}
          swipeDirection="left"
          visible={priceModal}
        >
          <TouchableWithoutFeedback onPress={() => setPriceModal(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.centeredView}>
            <View style={styles.modalViewSelection}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ right: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.02 : Dimensions.get('window').width * 0.02, top: 30 }}>
                  <TouchableOpacity onPress={() => setPriceModal(false)}>
                    <FontAwesome
                      name={"arrow-left"}
                      size={Dimensions.get('window').height > 900 ? 30 : 25}
                      color={"#008394"}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalTitle}>
                  Enter Price
                </Text>
              </View>
              <View style = {styles.modalBody}>
                <View style = {{marginTop: 20}}>
                  <TextInput keyboardType='numeric' onChangeText = {setPriceIndividual}  style = {styles.input2} placeholder = "Enter Price"></TextInput>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop:0 }}>
                    <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { setPriceModal(false) }}>
                      <View>
                        <View style={styles.buttonModalContainer}>
                          <View>
                            <Text style={styles.buttonModalText}>Back</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { selectionOfProduct() }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
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
          </View>
        </Modal>



        {/* modal for selecting either delivery order or warehouse */}
        <Modal
          onSwipeComplete={() => setSelectWorDModal(false)}
          animationType="slide"
          transparent={true}
          swipeDirection="left"
          visible={selectWorDModal}
        >
          <TouchableWithoutFeedback onPress={() => setSelectWorDModal(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.centeredView}>
            <View style={styles.modalViewSelection}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ right: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.02 : Dimensions.get('window').width * 0.02, top: 30 }}>
                  <TouchableOpacity onPress={() => setSelectWorDModal(false)}>
                    <FontAwesome
                      name={"arrow-left"}
                      size={Dimensions.get('window').height > 900 ? 30 : 25}
                      color={"#008394"}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalTitle}>
                  Warehouse / D - Order
                </Text>
              </View>
              {
                Dimensions.get('window').height > 900 &&
                <View style={styles.modalBodySelection}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                    <TouchableOpacity style={styles.buttonModalContainerNew} onPress={() => openModals("Warehouse")}>
                      <Text style={styles.buttonModalText}>Select Warehouse</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonModalContainerNew} onPress={() => openModals("D-Order")} >
                      <Text style={styles.buttonModalText}>Select D-Order</Text>
                    </TouchableOpacity>

                  </View>
                </View>
              }
              {
                Dimensions.get('window').height < 900 &&
                <View style={styles.modalBodySelection}>
                  <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                    <TouchableOpacity style={styles.buttonModalContainerNew} onPress={() => openModals("Warehouse")}>
                      <Text style={styles.buttonModalText}>Select Warehouse</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonModalContainerNew} onPress={() => openModals("D-Order")} >
                      <Text style={styles.buttonModalText}>Select D-Order</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              }

              <TouchableOpacity onPress={() => { setSelectWorDModal(false) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <View style={styles.buttonModalContainer}>
                    <View>
                      <Text style={styles.buttonModalText}>Back</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

        {/* modal for productlist show */}
        <Modal
          onSwipeComplete={() => setProductListModal(false)}
          animationType="slide"
          transparent={true}
          swipeDirection="left"
          visible={productListModal}
        >
          <TouchableWithoutFeedback onPress={() => setProductListModal(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>

          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ right: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.1 : Dimensions.get('window').width * 0.04, top: 7 }}>
                  <TouchableOpacity onPress={() => setProductListModal(false)}>
                    <FontAwesome
                      name={"arrow-left"}
                      size={Dimensions.get('window').height > 900 ? 30 : 25}
                      color={"#008394"}
                    />
                  </TouchableOpacity>

                </View>

                <Text style={styles.modalTitleNew}>Select Product</Text>


              </View>
              {Dimensions.get('window').height > 900 ? <ScrollView keyboardShouldPersistTaps='always'>
                <View style={styles.modalBody}>
                  <SearchableDropdown
                    onTextChange={(text) => console.log(text)}

                    //On text change listner on the searchable input
                    onItemSelect={(item) => {
                      itemSelected(item)

                    }}
                    //onItemSelect called after the selection from the dropdown
                    containerStyle={{ padding: 5, width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.6 : Dimensions.get('window').width * 0.70, }}
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
                  {
                    multipleProducts.length === 0 &&
                    <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                      <Text style={styles.modalTitleNewMultiple}>
                        no products selected
                      </Text>
                    </View>
                  }
                  {
                    multipleProducts.length !== 0 && multipleProducts.map((record, index) => (
                      <View key={index}>
                        <Card>
                          <Card.Title>{record.name}</Card.Title>

                          <Card.Divider />
                          {
                            record.typeOfSale === 'DeliveryOrder' ?
                              <View>
                                <Text>
                                  Type: Delivery Order
                                </Text>
                                <Text style={{}}>
                                  Quantity: {record.quantity}
                                </Text>
                                <Text style= {{}}>
                                  Price: {record.price}
                                </Text>
                              </View>

                              :
                              printWarehouseDetails(record)
                          }
                          <TouchableOpacity onPress={() => deleteRecord(record)} style={{ flexDirection: 'row-reverse', justifyContent: 'flex-end', marginRight: '90%' }}>
                            <View >
                              <MaterialCommunityIcons name="delete" size={36} color="black" />
                            </View>
                          </TouchableOpacity>

                        </Card>
                      </View>
                    ))
                  }
                </View>
              </ScrollView>
                :
                // here is for phone
                <ScrollView keyboardShouldPersistTaps='always'>
                  <View style={styles.modalBody}>
                    <SearchableDropdown
                      onTextChange={(text) => console.log(text)}

                      //On text change listner on the searchable input
                      onItemSelect={(item) => {
                        itemSelected(item)

                      }}
                      //onItemSelect called after the selection from the dropdown
                      containerStyle={{ padding: 5, width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.6 : Dimensions.get('window').width * 0.60, }}
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
                    {
                      multipleProducts.length === 0 &&
                      <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                        <Text style={styles.modalTitleNewMultiple}>
                          no products selected
                        </Text>
                      </View>
                    }
                    {
                      multipleProducts.length !== 0 && multipleProducts.map((record, index) => (
                        <View key={index}>
                          <Card>
                            <Card.Title>{record.name}</Card.Title>

                            <Card.Divider />
                            {
                              record.typeOfSale === 'DeliveryOrder' ?
                                <View>
                                  <Text>
                                    Type: Delivery Order
                                  </Text>
                                  <Text style={{}}>
                                    Quantity: {record.quantity}
                                  </Text>
                                  <Text style= {{}}>
                                    Price: {record.price}
                                  </Text>

                                </View>

                                :
                                printWarehouseDetails(record)
                            }
                            <TouchableOpacity onPress={() => deleteRecord(record)} style={{ flexDirection: 'row-reverse', justifyContent: 'flex-end', marginRight: Dimensions.get('window').height > 900 ? '90%' : '80%' }}>
                              <View >
                                <MaterialCommunityIcons name="delete" size={24} color="black" />
                              </View>
                            </TouchableOpacity>
                          </Card>
                        </View>
                      ))
                    }
                  </View>
                </ScrollView>

              }
              <TouchableOpacity onPress={() => { setProductListModal(false) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <View style={styles.buttonModalContainer}>
                    <View>
                      <Text style={styles.buttonModalText}>Back</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
        {/* modal for product ends here  */}


        {/* modal for client selection dropdown starts here */}
        <Modal
          onSwipeComplete={() => setClientListModal(false)}
          animationType="slide"
          transparent={true}
          swipeDirection="left"
          visible={clientListModal}
        >
          <TouchableWithoutFeedback onPress={() => setClientListModal(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>

          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ right: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.1 : Dimensions.get('window').width * 0.04, top: 7 }}>
                  <TouchableOpacity onPress={() => setClientListModal(false)}>
                    <FontAwesome
                      name={"arrow-left"}
                      size={Dimensions.get('window').height > 900 ? 30 : 25}
                      color={"#008394"}
                    />
                  </TouchableOpacity>

                </View>

                <Text style={styles.modalTitleNew}>Select Client</Text>


              </View>
              <View style={styles.modalBody}>
                <SearchableDropdown
                  onTextChange={(text) => console.log(text)}

                  //On text change listner on the searchable input
                  onItemSelect={(item) => {
                    // console.log(item)
                    setSelectedClientName(item.name)
                    setClientName(item.id)
                  }}
                  //onItemSelect called after the selection from the dropdown
                  containerStyle={{ padding: 5, width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.6 : Dimensions.get('window').width * 0.70, }}
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
              <View style={{ flexDirection: 'row' }}>
                <View style={{ right: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.1 : Dimensions.get('window').width * 0.04, top: 7 }}>
                  <TouchableOpacity onPress={() => setWarehouseModal(false)}>
                    <FontAwesome
                      name={"arrow-left"}
                      size={Dimensions.get('window').height > 900 ? 30 : 25}
                      color={"#008394"}
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
                            <TextInput keyboardType='numeric' onChangeText={(e) => setQuantityWarehouses(record.warehouse._id, record.stock, e)} style={styles.inputWarehouse} placeholder="Quantity" autoCorrect={false} />
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
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', bottom: 25 }}>
                  <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { setWarehouseModal(false) }}>
                    <View>
                      <View style={styles.buttonModalContainerCross}>
                        <View>
                          <Text style={styles.buttonModalText}>Cancel</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { checkForSelection() }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
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
              <View style={{ flexDirection: 'row' }}>
                <View style={{ right: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.1 : Dimensions.get('window').width * 0.04, top: 7 }}>
                  <TouchableOpacity onPress={() => { setDOrderModal(false); setSelectedDOrder('') }}>
                    <FontAwesome
                      name={"arrow-left"}
                      size={Dimensions.get('window').height > 900 ? 30 : 25}
                      color={"#008394"}
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
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', bottom: 25 }}>
                  <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { setDOrderModal(false) }}>
                    <View>
                      <View style={styles.buttonModalContainerCross}>
                        <View>
                          <Text style={styles.buttonModalText}>Cancel</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { checkForSelection() }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
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
          <View style={styles.centeredView}>
            {/* <ScrollView  showsVerticalScrollIndicator={false}> */}
            <View style={styles.modalStyle}>
              <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ right: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.16 : Dimensions.get('window').width * 0.1, top: Dimensions.get('window').height > 900 ? 26 : 28 }}>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <FontAwesome
                        name={"arrow-left"}
                        size={Dimensions.get('window').height > 900 ? 36 : 25}
                        color={"#008394"}
                      />
                    </TouchableOpacity>

                  </View>

                  <Text style={styles.modalTitle}>Make a Sale</Text>

                </View>
                {Dimensions.get('window').height < 900 ? (<ScrollView>
                  <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <View style={styles.modalBody}>
                      <TouchableOpacity onPress={() => setProductListModal(true)}>
                        <View style={styles.input}>
                          <Text style={{ fontSize: 15, color: 'grey' }}>
                            {productIdList.length > 0 ? 'Click to view Product(s)' : 'Click to select Product(s)'}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setClientListModal(true)}>
                        <View style={styles.input}>
                          <Text style={{ fontSize: 15, color: 'grey' }}>
                            {selectedClientName === '' ? "Click to select a Client" : `${selectedClientName}`}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <View>
                        <TouchableOpacity style={{ bottom: 20 }} onPress={() => setAddClientModal(true)} >
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
                        {/* <TextInput keyboardType='numeric' onChangeText={onChangeTotalAmount} style={styles.input} placeholder="Total Amount" autoCorrect={false} /> */}
                        {paymentType === 'Partial' && <TextInput keyboardType='numeric' onChangeText={onChangeAmountReceived} style={styles.input} placeholder="Amount Received" autoCorrect={false} />}
                        <TextInput multiline={true} numberOfLines={5} onChangeText={onChangeNotes} style={styles.input} placeholder="Notes" autoCorrect={false} />

                        <View style={styles.input}>
                          <View style={{ bottom: 10 }}>

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

                      </View>


                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', bottom: 25 }}>
                        <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { setModalVisible(false); setMultipleProducts([]); setProductIdList([]); setSelectedClientName(``); }}>
                          <View>
                            <View style={styles.buttonModalContainerCross}>
                              <View>
                                <Text style={styles.buttonModalText}>Cancel</Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { addSale() }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginRight: 35 }}>
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
                </ScrollView>)
                  :
                  (<View style={{ alignItems: 'center' }}>
                    <View style={styles.modalBody}>
                      <TouchableOpacity onPress={() => setProductListModal(true)}>
                        <View style={styles.input}>
                          <Text style={{ fontSize: 15, color: 'grey' }}>
                            {productIdList.length > 0 ? 'Click to view Product(s)' : 'Click to select Product(s)'}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setClientListModal(true)}>
                        <View style={styles.input}>
                          <Text style={{ fontSize: 15, color: 'grey' }}>
                            {selectedClientName === '' ? "Click to select a Client" : `${selectedClientName}`}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <View>
                        <TouchableOpacity style={{ bottom: 20 }} onPress={() => setAddClientModal(true)} >
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
                        {/* <TextInput keyboardType='numeric' onChangeText={onChangeTotalAmount} style={styles.input} placeholder="Total Amount" autoCorrect={false} /> */}
                        {paymentType === 'Partial' && <TextInput keyboardType='numeric' onChangeText={onChangeAmountReceived} style={styles.input} placeholder="Amount Received" autoCorrect={false} />}
                        <TextInput multiline={true} numberOfLines={5} onChangeText={onChangeNotes} style={styles.input} placeholder="Notes" autoCorrect={false} />

                        <View style={styles.input}>
                          <View style={{ bottom: 10 }}>

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
                      </View>


                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', bottom: Dimensions.get('window').height < 700 ? 25 : 15, }}>
                        <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { setModalVisible(false); setSelectedClientName(``); setMultipleProducts([]); setProductIdList([]) }}>
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
                  </View>)}

              </View>
            </View>
            {/* </ScrollView> */}
          </View>

        </Modal>
      </View>
      <AddClientModal state={addClientModal} handleClose={closeClientModal} getPreFormValues={getPreFormValues} />
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
          <ExportButton data={sales} title={'sales.xlsx'} screenName='sales' />
        </View>
      </View>
      <Spinner loading={loading} />


      <DataTable style={{ marginTop: 15 }}>
        <DataTable.Header>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Product</Text></DataTable.Title>
          {/* <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Quantity</Text></DataTable.Title> */}
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Price</Text></DataTable.Title>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Client</Text></DataTable.Title>
        </DataTable.Header>
        {!loading && <ScrollView>
          <View>
            {
              sales.map((sale, i) => (
                <TouchableOpacity key={i} onPress={() => onPressModal(sale)}>
                  <DataTable.Row>
                    <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{sale.products === undefined ? '--' : sale.products.map((p,k) => (<Text key = {k}>{p.quantity} x {p.product.title}{"\n"}</Text>))}</Text></DataTable.Cell>
                    {/* <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{sale.quantity === undefined ? '--' : sale.quantity}</Text></DataTable.Cell> */}
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
    textAlign: 'center'
  },
  modalTitleNewMultiple: {
    color: '#006270',
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height > 900 ? 36 : 24,
    top: 20,
    textAlign: 'center'
  },
  modalStyle: {
    padding: 35,
    backgroundColor: "#fff",
    width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.80 : Dimensions.get('window').width * 0.80,
    height: Dimensions.get('window').height > 900 ? Dimensions.get('window').height * 0.50 : Dimensions.get('window').height * 0.80,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#008394",
    alignItems: 'center'
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
  buttonModalContainerNew: {
    justifyContent: 'center',
    width: Dimensions.get('window').height > 900 ? '45%' : '80%',
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
    fontSize: Dimensions.get('window').height > 900 ? 16 : 12,
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
    width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.65 : Dimensions.get('window').width * 0.55,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 40,
    marginBottom: 20,
    fontSize: 15,
    borderColor: "#008394",
    height: 40,
    padding: 10,
  },
  input2: {
      width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.55 : Dimensions.get('window').width * 0.55,
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
  modalViewSelection: {
    margin: 20,
    backgroundColor: "white",
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#008394",
    padding: 35,
    alignItems: "center",
    width: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.6 : Dimensions.get('window').width * 0.70,
    height: Dimensions.get('window').height > 900 ? Dimensions.get('window').height * 0.25 : Dimensions.get('window').height * 0.50
  },
  modalBodySelection: {
    paddingHorizontal: 10
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

import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, CheckBox } from 'react-native';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { FontAwesome } from '@expo/vector-icons';
import { DataTable } from 'react-native-paper';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import DeliveryOrderModal from '../components/DeliveryOrderModal';
import FilterButton from '../components/FilterButton';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { uri } from '../api.json'
import axios from "axios"
import Spinner from '../components/Spinner';

const optionsPerPage = [2, 3, 4];

const DeliveryOrders = props => {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [clients, setClients] = useState([])
  const [query, setQuery] = useState('*')
  const [loading, setLoading] = useState(true)
  const [Pfilters, setPFilters] = useState({
    page: 1,
    query: '*',
    colour: '*',
    brand: '*',
    ware: '*',
    client: '*',
    product: '*',
    sort: '*',
    sortBy: '*'
  })


  const getOrders = async () => {
    setLoading(true)
    const res = await axios.get(
      `${uri}/api/order/${Pfilters.page}/${query}/${Pfilters.client}/${Pfilters.product}/${Pfilters.sort}/${Pfilters.sortBy}`
    )

    // console.log('logging arriving order', res.data.deliveryOrder)
    setOrders(res.data.deliveryOrder)
    setLoading(false)
  }

  const getProducts = async () => {
    const res = await axios.get(
      `${uri}/api/product/${Pfilters.page}/${Pfilters.query}/${Pfilters.colour}/${Pfilters.brand}/${Pfilters.ware}/${Pfilters.sort}/${Pfilters.sortBy}`
    )


    setProducts(res.data.products)



  }


  const getClients = async () => {
    const res = await axios.get(
      `${uri}/api/client/*`
    )


    setClients(res.data.clients)


  }

  useEffect(() => {
    console.log('deli')
    getClients()
    getProducts()
    getOrders()

  }, [])





  // useEffect(() => {
  // 


  const handleConfirm = (pItems) => { // temporary for picker
    console.log('pItems =>', pItems);
  }

  const items = [ //temporary for picker for filter
    {
      itemKey: 1,
      itemDescription: 'Item 1'
    },
    {
      itemKey: 2,
      itemDescription: 'Item 2'
    },
    {
      itemKey: 3,
      itemDescription: 'Item 3'
    }
  ];

  const [page, setPage] = React.useState(0); //for pages of table
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]); //for items per page on table
  const [isSelected, setSelection] = React.useState(false);
  const [isModalVisible, setModalVisible] = React.useState(false); //to set modal on and off
  const [touchedOrder, setTouchedOrder] = React.useState([])
  const toggleModal = () => { //to toggle model on and off -- function
    setModalVisible(!isModalVisible);
  };

  const onPressModal = (order) => {
    setTableDetailModalVisible(true)
    setTouchedOrder(order)
  }


  React.useEffect(() => { //for table
    setPage(0);
  }, [itemsPerPage]);


  const [search, setSearch] = React.useState(``) //for keeping track of search
  const onChangeSearch = (searchVal) => { //function to keep track of search as the user types
    if (searchVal.trim() === '') {
      setQuery('*')
    }
    else { setQuery(searchVal.trim()) }
  }

  const searchFunc = () => {
    //printing search value for now
    getClients()
    getProducts()
    getOrders()
  }


  // make a sale variables below:
  const [productName, setProductName] = React.useState(``)
  const [quantityVal, setQuantityVal] = React.useState(0)
  const [location, setLocation] = React.useState(``)
  const [clientName, setClientName] = React.useState(``)
  const [notes, setNotes] = React.useState(``)


  const onChangeProductName = (prodName) => {
    setProductName(prodName);
  }

  const onChangeQuantity = (quant) => {
    setQuantityVal(quant);
  }


  const onChangeLocation = (locationVal) => {
    setLocation(locationVal);
  }
  const onChangeClientName = (clName) => {
    setClientName(clName);
  }

  const onChangeNotes = (noteVal) => {
    setNotes(noteVal);
  }


  const addDeliveryOrder = () => {
    setModalVisible(false); //closing modal on done for now
    console.log('Printing productName', productName)
    const body = {
      productID: productName,
      quantity: quantityVal,
      location: location,
      clientID: clientName,
      note: notes
    }

    console.log(body)

    axios.post(`${uri}/api/order`, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => getOrders())
      .catch(err => console.log(err))
  }


  const [isTableDetailModalVisible, setTableDetailModalVisible] = React.useState(false);

  const handleClose = () => {
    setTableDetailModalVisible(false)
  }




  return (
    // <KeyboardAvoidingView style = {styles.containerView} behavior = "padding">

    <View>
      <Modal
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="left"
        presentationStyle="overFullScreen"
        transparent
        visible={isModalVisible}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.modalStyle}>
            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
              <Text style={styles.modalTitle}>Add Order</Text>
              <View>
                <View style={{ marginTop: 40, borderWidth: 2, borderRadius: 40, borderColor: "#008394", width: Dimensions.get('window').width * 0.65, height: 40, fontSize: 8, justifyContent: 'space-between' }}>

                  <Picker
                    style={{ top: 6, color: 'grey', fontFamily: 'Roboto' }}
                    itemStyle={{ fontWeight: '100' }}
                    placeholder="Select a Product"
                    selectedValue={productName}
                    onValueChange={(itemValue, itemIndex) =>
                      setProductName(itemValue)
                    }
                  >
                    {
                      products.map((product, i) => (

                        <Picker.Item label={product.title === undefined ? 0 : product.title} value={product._id === undefined ? 0 : product._id} key={product._id === undefined ? 0 : product._id} />

                      ))}
                  </Picker>

                </View>
                <TextInput onChangeText={onChangeQuantity} style={styles.input} placeholder="Quantity" autoCorrect={false} />
                <TextInput onChangeText={onChangeLocation} style={styles.input} placeholder="Location" autoCorrect={false} />
                <TextInput multiline={true} numberOfLines={5} onChangeText={onChangeNotes} style={styles.input} placeholder="Notes" autoCorrect={false} />

                <View style={{ borderWidth: 2, borderRadius: 40, borderColor: "#008394", width: Dimensions.get('window').width * 0.65, height: 40, fontSize: 8, justifyContent: 'space-between', marginTop: 60 }}>
                  <Picker
                    style={{ top: 6, color: 'grey', fontFamily: 'Roboto' }}
                    itemStyle={{ fontWeight: '100' }}
                    placeholder="Select a Client"
                    selectedValue={clientName}
                    onValueChange={(itemValue, itemIndex) =>
                      setClientName(itemValue)
                    }
                  >
                    {
                      clients.map((client, i) => (
                        <Picker.Item label={client.userName === undefined ? 0 : client.userName} value={client._id === undefined ? 0 : client._id} />
                      ))}
                  </Picker>
                </View>


              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { setModalVisible(false) }}>
                  <View>
                    <View style={styles.buttonModalContainerCross}>
                      <View>
                        <Text style={styles.buttonModalText}>Cancel</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { addDeliveryOrder() }}>
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
      </Modal>
      <DeliveryOrderModal state={isTableDetailModalVisible} handleClose={handleClose} title='Delivery Information' object={touchedOrder === [] ? [] : touchedOrder} getOrders={getOrders} />
      <View style={styles.screen}>
        <View>
          <Text style={styles.title}>Delivery Orders</Text>
        </View>
      </View>
      <View style={styles.containerButton}>
        <TouchableOpacity onPress={() => { setModalVisible(true) }}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Add a Order</Text>
          </View>
        </TouchableOpacity>
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

      <FilterButton />
      <Spinner loading={loading} />
      {!loading && <ScrollView>

        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Product</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Client</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Quantity</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Location</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Status</Text></DataTable.Title>
          </DataTable.Header>

          {
            orders.map((order, i) => (
              <TouchableOpacity key={i} onPress={() => onPressModal(order)}>
                <DataTable.Row>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{order.product.title === null ? '--' : order.product.title}</Text></DataTable.Cell>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{order.client.userName === undefined ? '--' : order.client.userName}</Text></DataTable.Cell>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{order.quantity === undefined ? '--' : order.quantity}</Text></DataTable.Cell>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{order.location === undefined ? '--' : order.location}</Text></DataTable.Cell>
                  {order.status === true ? <DataTable.Cell style={styles.cells}><Ionicons name={'checkmark'} size={25} color={'#006270'} /></DataTable.Cell> : <DataTable.Cell style={styles.cells}><Entypo name={'cross'} size={25} color={'red'} /></DataTable.Cell>}
                </DataTable.Row>
              </TouchableOpacity>
            ))

          }

          <DataTable.Pagination
            page={page}
            numberOfPages={3}
            onPageChange={(page) => setPage(page)}
            label="1-2 of 6"
            optionsPerPage={optionsPerPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            showFastPagination
            optionsLabel={'Rows per page'}
          />
        </DataTable>

      </ScrollView>
      }
    </View>
    // </KeyboardAvoidingView>


  )
}

DeliveryOrders.navigationOptions = navigationData => {
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


export default DeliveryOrders


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
    height: Dimensions.get('window').height > 900 ? 540 : 480,
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: 20,
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
  checkbox: {
    alignSelf: "center",
  },
})

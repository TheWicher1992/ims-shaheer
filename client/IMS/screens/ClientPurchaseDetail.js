import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Switch } from 'react-native';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { DataTable } from 'react-native-paper';
import PurchaseDetailModal from '../components/PurchaseDetailModal';
import axios from 'axios'
import { uri } from '../api.json'
import Spinner from '../components/Spinner';
import ExportButton from '../components/ExportAsExcel'

const optionsPerPage = [2, 3, 4];
const ClientPurchaseDetail = props => {

  const [page, setPage] = React.useState(0); //for pages of table
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]); //for items per page on table
  const [productName, setProductName] = useState(``)
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
    const res = await axios.get(`${uri}/api/purchase/${props.navigation.getParam('clientID')}`
    )
    setPurchases(res.data.purchases)
    setLoading(false)
  }

  useEffect(() => {
    getPurchases()
  }, [])



  React.useEffect(() => { //for table
    setPage(0);
  }, [itemsPerPage]);

  const [filters, setFilters] = useState({
    page: 1,
    query: '*',
    products: '*',
    clients: props.navigation.getParam('clientID'), 
    payment: '*',
    date: '*',
    quantity: '*',
    amount: '*',
  })


  const [isWarehouse, setIsWarehouse] = useState(false)
  // const [isDeliveryOrder, setIsDeliveryOrder] = useState(!isWarehouse)
  const [isEnabled, setIsEnabled] = useState(false);




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
    console.log(`switched`);
  };

  const [touchedPurchase, setTouchedPurchase] = useState([])

  const selectedPurchaseRecord = (purchase) => {
    setTouchedPurchase(purchase)
    setTableDetailModalVisible(true)
    console.log("hello", touchedPurchase)
  }



  return (
    // <KeyboardAvoidingView style = {styles.containerView} behavior = "padding">

    <View>
      <PurchaseDetailModal state={isTableDetailModalVisible} handleClose={handleClose} title='Purchase Detail' object={touchedPurchase} screen='new' />
      <View style={styles.screen}>
        <View>
          <Text style={styles.title}>Purchases</Text>
        </View>
      </View>
      <View style={styles.containerButton}>
         
        <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
          <View style={styles.searchBar}>
          </View>
          <View style={{ top: 14 }}>
              <View style={styles.searchButton}>
                
              </View>
          </View>
        </View>

      </View>
      <ExportButton data={purchases} title={`Purchases.xlsx`}/>

      <View style={{marginTop: 20}}/>
      <Spinner loading={loading} />
      {!loading && <ScrollView>

        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Product</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Quantity</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Amount</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Client</Text></DataTable.Title>
          </DataTable.Header>

          {
            purchases.map(p => (
              <TouchableOpacity onPress={() => selectedPurchaseRecord(p)}>
                <DataTable.Row>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{p.product.title}</Text></DataTable.Cell>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{p.quantity}</Text></DataTable.Cell>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{p.total}</Text></DataTable.Cell>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{p.client.userName}</Text></DataTable.Cell>
                </DataTable.Row>
              </TouchableOpacity>
            ))
          }
        </DataTable>

      </ScrollView>}
    </View>
    // </KeyboardAvoidingView>


  )
}


ClientPurchaseDetail.navigationOptions = navigationData => {
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


export default ClientPurchaseDetail


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
    top: 30,
  },
  modalStyle: {
    backgroundColor: "#fff",
    width: Dimensions.get('window').height > 900 ? 600 : 320,
    height: Dimensions.get('window').height > 900 ? 720 : 640,
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
  searchButton: {
    flexDirection: 'row',
    marginTop: Dimensions.get('window').height > 600 ? 15 : 8,
    borderRadius: 25,
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
})
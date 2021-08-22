import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { FontAwesome } from '@expo/vector-icons';
import { DataTable } from 'react-native-paper';
import Modal from 'react-native-modal';
import PickerCheckBox from 'react-native-picker-checkbox';
import TableDetailModal from '../components/TableDetailModal';
import FilterButton from '../components/FilterButton';
import { Picker } from '@react-native-picker/picker';
import { uri } from '../api.json'
import axios from "axios"
import Spinner from '../components/Spinner';
const optionsPerPage = [2, 3, 4];

const MakeSale = props => {

  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [clients, setClients] = useState([])

  const getSales = async () => {
    setLoading(true)

    const res = await axios.get(
      `${uri}/api/sale/${props.navigation.getParam('clientID')}`
    )
    console.log(props.navigation.getParam('clientID'))
    setSales(res.data.sales)
    setLoading(false)

  }

  useEffect(() => {
    getSales()

  }, [])




  const [page, setPage] = React.useState(0); //for pages of table
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]); //for items per page on table

  const [isModalVisible, setModalVisible] = React.useState(false); //to set modal on and off

  const toggleModal = () => { //to toggle model on and off -- function
    setModalVisible(!isModalVisible);
  };



  React.useEffect(() => { //for table
    setPage(0);
  }, [itemsPerPage]);


  const [search, setSearch] = React.useState(``) //for keeping track of search


  // make a sale variables below:
  const [productName, setProductName] = React.useState(``)
  const [quantityVal, setQuantityVal] = React.useState(0)
  const [totalAmount, setTotalAmount] = React.useState(0) //this is total amount
  const [amountReceived, setAmountReceived] = React.useState(0) //this is amount received
  const [paymentType, setPaymentType] = React.useState(``) //this is the type of payment
  const [clientName, setClientName] = React.useState(``)
  const [notes, setNotes] = React.useState(``)
  const [selectedWarehouse, setSelectedWarehouse] = useState({})

  const [isTableDetailModalVisible, setTableDetailModalVisible] = React.useState(false);

  const handleClose = () => {
    setTableDetailModalVisible(false)
  }


  return (
    // <KeyboardAvoidingView style = {styles.containerView} behavior = "padding">

    <View>
      
      <TableDetailModal state={isTableDetailModalVisible} handleClose={handleClose} title='Employee Information' name='Raahem Asghar' email='raahemasghar97@gmail.com' occupation="Employee" />
      <View style={styles.screen}>
        <View>
          <Text style={styles.title}>Sales</Text>
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
            sales.map((sale, i) => (
              <TouchableOpacity onPress={() => setTableDetailModalVisible(true)}>
                <DataTable.Row>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{sale.product === undefined ? '--' : sale.product.title}</Text></DataTable.Cell>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{sale.quantity === undefined ? '--' : sale.quantity}</Text></DataTable.Cell>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>69000</Text></DataTable.Cell>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{sale.client === undefined ? '--' : sale.client.userName}</Text></DataTable.Cell>
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

export default MakeSale


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
    height: Dimensions.get('window').height > 900 ? 700 : 620,
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
})
import * as React from 'react';
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Pressable, Image } from 'react-native';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { FontAwesome } from '@expo/vector-icons';
import { DataTable } from 'react-native-paper';
import Modal from 'react-native-modal';
import ProductDetailModal from '../components/ProductDetailModal';
import FilterButton from '../components/FilterButton';
import { Picker } from '@react-native-picker/picker';
import { uri } from '../api.json'
import axios from "axios"
import { connect } from 'react-redux'
import Spinner from '../components/Spinner';
import ShowAlert from '../components/ShowAlert';


const optionsPerPage = [2, 3, 4];

const Product = props => {


  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [brandsAndColours, setBrandAndColours] = useState({
    brands: [],
    colours: []
  })



  const [touchedProduct, setTouchedProduct] = useState([])
  const catchWarning = () => {
    setAlertState(!alertState) 
    setAlertTitle('Attention')
    setAlertMsg('Something went wrong. Please restart')
  }
  const [query, setQuery] = useState('*')

  const getProducts = async () => {
    setLoading(true)
    try{

    
    const res = await axios.get(
      `${uri}/api/product` +
      `/${props.filters.page}` +
      `/${query}` +
      `/${props.filters.colour.join(',')}` +
      `/${props.filters.brand.join(',')}` +
      `/${props.filters.ware.join(',')}` +
      `/${props.filters.date}/${props.filters.quantity}` +
      `/${props.filters.price}/${props.filters.sort}` +
      `/${props.filters.sortBy}`
    )

    setProducts(res.data.products.reverse())
    }
    catch(err){
      catchWarning()
    }
    setLoading(false)
  }


  const getBrandColours = async () => {
    try{
    
    
    const res = await axios.get(
      `${uri}/api/product/cb`
    )

    setBrandAndColours(res.data)

    setColor(res.data.colours[0]._id)
    setBrand(res.data.brands[0]._id)
    }
    catch(err){
      catchWarning()
    }

    //console.log(res.data)


  }


  useEffect(() => {
    getProducts()
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
  const onChangeSearch = (searchVal) => { //function to keep track of search as the user types
    setSearch(searchVal);
    let q = searchVal.trim()
    setQuery(q === '' ? '*' : q)
    // setFilters({ ...filters, query: searchVal })
    // console.log(search);
  }

  const searchFunc = () => {
    //printing search value for now
    getProducts()
  }


  // make a sale variables below:
  const [serialNo, setSerialNo] = React.useState(``)
  const [productName, setProductName] = React.useState(``)
  const [amountVal, setAmountVal] = React.useState(0)
  const [color, setColor] = React.useState(``)
  const [brand, setBrand] = React.useState(``)
  const [description, setDescription] = React.useState(``)
  const addProduct = () => {
    // setModalVisible(false); //closing modal on done for now
    // // console.log(color, brand)
    if(serialNo === '' || productName === '' || amountVal === '' || description === ''){
      setAlertTitle('Warning')
      setAlertMsg('Input fields may be empty. Request could not be processed.')
      show()
    }
    else{
      const body = {
        title: productName,
        serial: serialNo,
        brandID: brand,
        colourID: color,
        description,
        price: amountVal
      }
  
      axios.post(`${uri}/api/product`, body, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          getProducts()
          setAlertTitle('Success')
          setAlertMsg('Request has been processed, Product added.')
          show()
          setModalVisible(false)
        })
        .catch(err => {
          setAlertTitle('Warning')
          setAlertMsg('Request could not be processed.')
          show()
        })
    }
    

  }





  const [isTableDetailModalVisible, setTableDetailModalVisible] = React.useState(false);

  const onPressModal = (prod) => {
    setTableDetailModalVisible(true),
      setTouchedProduct(prod)
  }

  const handleClose = () => {
    setTableDetailModalVisible(false)
  }


  
  
  


  

  const showAddProductForm = () => {

    getBrandColours().then(() => setModalVisible(true))
  }

  const [alertState, setAlertState] = useState(false)
  const [alertTitle, setAlertTitle] = useState(``)
  const [alertMsg, setAlertMsg] = useState(``)
  const show = () => {
    setAlertState(!alertState)
  }


  return (
    <ScrollView>
      <ShowAlert state={alertState} handleClose={show} alertTitle={alertTitle} alertMsg={alertMsg} style={styles.buttonModalContainer} />
      <ProductDetailModal state={isTableDetailModalVisible} handleClose={handleClose} object={touchedProduct} title='Product Detail' getProducts={getProducts} occupation="Employee"/>
      <View style={styles.screen}>
        <View>
          <Text style={styles.title}>Products</Text>
        </View>
      </View>
      <View style={styles.containerButton}>
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
      <FilterButton getProducts={getProducts} page="product" />
      <Spinner loading={loading} />
      
        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Serial No.</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Product</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Brand</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Color</Text></DataTable.Title>
           

          </DataTable.Header>

          {!loading && <ScrollView>
            <View>
          {
            products.map((product, i) => (
              <TouchableOpacity key={i} onPress={() => onPressModal(product)}>
                <DataTable.Row>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{product.serial === undefined ? 0 : product.serial}</Text></DataTable.Cell>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{product.title}</Text></DataTable.Cell>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{product.brand.title === undefined ? '--' : product.brand.title}</Text></DataTable.Cell>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{product.colour.title === undefined ? '--' : product.colour.title}</Text></DataTable.Cell>
                  {/* <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{product.price === undefined ? 0 : product.price}</Text></DataTable.Cell> */}
                  {/* <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{product.serial}</Text></DataTable.Cell> */}
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


Product.navigationOptions = navigationData => {
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
    filters: state.productFilters
  }
)

export default connect(mapStateToProps)(Product)


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
    marginBottom: 20,
    borderColor: "#008394",
    marginTop: Dimensions.get('window').height > 750 ? Dimensions.get('window').height * 0.1 : 0
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
    marginTop: Dimensions.get('window').height > 900 ? 50 : 40,
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
    borderColor: "#008394",
    borderWidth: 2,
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
})
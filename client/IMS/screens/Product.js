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
import ExportButton from '../components/ExportAsExcel'

const optionsPerPage = [2, 3, 4];

const Product = props => {


  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [brandsAndColours, setBrandAndColours] = useState({
    brands: [],
    colours: []
  })



  const [touchedProduct, setTouchedProduct] = useState([])
  // const [filters, setFilters] = useState({
  //   page: 1,
  //   query: '*',
  //   colour: '*',
  //   brand: '*',
  //   ware: '*',
  //   sort: '*',
  //   sortBy: '*'
  // })

  const [query, setQuery] = useState('*')

  const getProducts = async () => {
    setLoading(true)
    try {

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
    catch (err) {
      console.log(err)
    }
    setLoading(false)

  }


  const getBrandColours = async () => {
    try {
      const res = await axios.get(
        `${uri}/api/product/cb`
      )

      setBrandAndColours(res.data)

      setColor(res.data.colours[0]._id)
      setBrand(res.data.brands[0]._id)

    }
    catch (err) {
      console.log(err)
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
    if (serialNo === '' || productName === '' || amountVal === '' || description === '') {
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




  const [isTableDetailModalVisible, setTableDetailModalVisible] = React.useState(false);

  const onPressModal = (prod) => {
    setTableDetailModalVisible(true),
      setTouchedProduct(prod)
  }

  const handleClose = () => {
    setTableDetailModalVisible(false)
  }


  const [openColor, setOpenColor] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [openWarehouse, setOpenWarehouse] = useState(false);
  const [itemsColor, setItemsColor] = useState([
    { label: 'Transparent', value: 'Transparent' },
    { label: 'White', value: 'transparent' }
  ]);
  const [itemsBrand, setItemsBrand] = useState([
    { label: 'PVC', value: 'PVC' },
    { label: 'PVCC', value: 'PVCC' }
  ]);
  const [itemsWarehouse, setItemsWarehouse] = useState([
    { label: '1b', value: '1b' },
    { label: '1c', value: '1c' },
    { label: '1d', value: '1d' },
  ]);

  const [addBrandModal, setAddBrandModal] = useState(false);
  const brandModal = () => { //to toggle model on and off -- function
    setAddBrandModal(!addBrandModal);
  };

  const [addBrand, setAddBrand] = useState(``);
  const onChangeNewBrand = (newBrandd) => {
    setAddBrand(newBrandd);
  }

  const addNewBrand = () => {
    if (addBrand === '') {
      setAlertTitle('Warning')
      setAlertMsg('Input fields may be empty. Request could not be processed.')
      show()
    }
    else {
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
        .catch(res => {
          setAlertTitle('Warning')
          setAlertMsg('Request could not be processed.')
          show()
        })

      getBrandColours().then(() => setAddBrandModal(false))

    }


  }



  const [addColorModal, setAddColorModal] = useState(false);
  const colorModal = () => {
    setAddColorModal(!addColorModal);
  }

  const [addColor, setAddColor] = useState(``);
  const onChangeNewColor = (newColor => {
    setAddColor(newColor);
  })
  const addNewColor = () => {
    if (addColor === '') {
      setAlertTitle('Warning')
      setAlertMsg('Input fields may be empty. Request could not be processed.')
      show()
    }
    else {
      axios.post(`${uri}/api/product/colour`, {
        colour: addColor
      }, {
        headers: {
          "Content-Type": 'application/json'
        }
      }).then(res => {
        setAlertTitle('Success')
        setAlertMsg('Request has been processed, Color added.')
        show()
      })
        .catch(res => {
          setAlertTitle('Warning')
          setAlertMsg('Request could not be processed.')
          show()
        })

      getBrandColours().then(() => setAddColorModal(false))

    }

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
      <Modal
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="left"
        presentationStyle="overFullScreen"
        transparent
        visible={isModalVisible}>

        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
          <ScrollView>
            <View style={styles.modalStyle}>
              <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <Text style={styles.modalTitle}>Add a Product</Text>
                <View style={{ marginTop: 50 }}>
                  <TextInput onChangeText={onChangeSerialNo} style={styles.input} placeholder="Serial" autoCorrect={false} />
                  <TextInput onChangeText={onChangeProductName} style={styles.input} placeholder="Product" autoCorrect={false} />
                  <TextInput onChangeText={onChangeAmount} style={styles.input} placeholder="Amount" autoCorrect={false} />
                  <TextInput multiline={true} numberOfLines={5} onChangeText={onChangeDescription} style={styles.input} placeholder="Description" autoCorrect={false} />

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

                      {
                        brandsAndColours.colours.map((c => (
                          <Picker.Item key={c._id} label={c.title} value={c._id} />
                        )))
                      }

                    </Picker>

                  </View>
                  <View>
                    <TouchableOpacity style={{ marginTop: 10 }} onPress={() => { setAddColorModal(true) }}>
                      <View style={styles.addButton}>
                        <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', }}>
                          <Text style={styles.modalbuttonText}>
                            + Add
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ borderWidth: 2, borderRadius: 40, borderColor: "#008394", width: Dimensions.get('window').width * 0.65, marginTop: 15, height: 40, fontSize: 8, }}>
                    <Picker
                      style={{ top: 6, color: 'grey', fontFamily: 'Roboto' }}
                      //itemStyle={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]}}
                      itemStyle={{ fontWeight: '100' }}

                      selectedValue={brand}
                      onValueChange={(itemValue, itemIndex) =>
                        setBrand(itemValue)
                      }
                    >
                      {
                        brandsAndColours.brands.map((b => (
                          <Picker.Item key={b._id} label={b.title} value={b._id} />
                        )))
                      }

                    </Picker>


                  </View>
                  <View>
                    <TouchableOpacity style={{ marginTop: 10 }} onPress={() => { setAddBrandModal(true) }}>
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

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, }}>
                  <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { setModalVisible(false) }}>
                    <View>
                      <View style={styles.buttonModalContainerCross}>
                        <View>
                          <Text style={styles.buttonModalText}>Cancel</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { addProduct() }}>
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



      <ProductDetailModal occupation="Admin" state={isTableDetailModalVisible} handleClose={handleClose} object={touchedProduct} title='Product Detail' getProducts={getProducts} />
      <View style={styles.screen}>
        <View>
          <Text style={styles.title}>Products</Text>
        </View>
      </View>
      <View style={styles.containerButton}>
        <TouchableOpacity onPress={() => { showAddProductForm() }}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Add Product</Text>
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
          <FilterButton getProducts={getProducts} page="product" />
        </View>
        <View style={{ marginTop: 25 }}>
          <ExportButton data={products} title={'products.xlsx'} />
        </View>
      </View>
      <Spinner loading={loading} />

      <DataTable style={{ marginTop: 15 }}>
        <DataTable.Header>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Serial No.</Text></DataTable.Title>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Product</Text></DataTable.Title>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Brand</Text></DataTable.Title>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Color</Text></DataTable.Title>
          {/* <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Quantity</Text></DataTable.Title> */}
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Amount</Text></DataTable.Title>
          {/* <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Warehouse</Text></DataTable.Title> */}

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
                    <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{product.price === undefined ? 0 : product.price}</Text></DataTable.Cell>
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
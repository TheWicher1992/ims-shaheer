import * as React from 'react';
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { FontAwesome } from '@expo/vector-icons';
import { DataTable } from 'react-native-paper';
import Modal from 'react-native-modal';
import TableDetailModal from '../components/TableDetailModal';
import FilterButton from '../components/FilterButton';
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { uri } from '../api.json'
import axios from "axios"


const optionsPerPage = [2, 3, 4];

const Product = props => {


  const [products, setProducts] = useState([])

  const [filters, setFilters] = useState({
    page: 1,
    query: '*',
    colour: '*',
    brand: '*',
    ware: '*',
    sort: '*',
    sortBy: '*'
  })

  const getProducts = async () => {
    const res = await axios.get(
      `${uri}/api/product/${filters.page}/${filters.query}/${filters.colour}/${filters.brand}/${filters.ware}/${filters.sort}/${filters.sortBy}`
    )

    setProducts(res.data.products)
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
    console.log(search);
  }

  const searchFunc = () => {
    console.log(search); //printing search value for now
  }


  // make a sale variables below:
  const [serialNo, setSerialNo] = React.useState(``)
  const [productName, setProductName] = React.useState(``)
  const [quantityVal, setQuantityVal] = React.useState(0)
  const [amountVal, setAmountVal] = React.useState(0)
  const [color, setColor] = React.useState(``)
  const [brand, setBrand] = React.useState(``)
  const [warehouse, setWarehouse] = React.useState(``)
  const [description, setDescription] = React.useState(``)

  const onChangeSerialNo = (serial) => {
    setSerialNo(serial);
  }

  const onChangeProductName = (prodName) => {
    setProductName(prodName);
  }

  const onChangeQuantity = (quant) => {
    setQuantityVal(quant);
  }

  const onChangeAmount = (amount) => {
    setAmountVal(amount);
  }

  const onChangeColor = (colorName) => {
    console.log(colorname)
    setColor(colorName);
  }

  const onChangeBrand = (brandName) => {
    setBrand(brandName);
  }

  const onChangeWarehouse = (warehouseName) => {
    setWarehouse(warehouseName);
  }

  const onChangeDescription = (desc) => {
    setDescription(desc);
  }

  const addProduct = () => {
    setModalVisible(false); //closing modal on done for now
  }


  const [isTableDetailModalVisible, setTableDetailModalVisible] = React.useState(false);

  const handleClose = () => {
    setTableDetailModalVisible(false)
  }

  
  const [openColor, setOpenColor] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);  
  const [openWarehouse, setOpenWarehouse] = useState(false);
  const [itemsColor, setItemsColor] = useState([
    {label: 'Transparent', value: 'Transparent'},
    {label: 'White', value: 'transparent'}
  ]);
  const [itemsBrand, setItemsBrand] = useState([
    {label: 'PVC', value: 'PVC'},
    {label: 'PVCC', value: 'PVCC'}
  ]);
  const [itemsWarehouse, setItemsWarehouse] = useState([
    {label: '1b', value: '1b'},
    {label: '1c', value: '1c'},
    {label: '1d', value: '1d'},
  ]);


  return (
    // <KeyboardAvoidingView style = {styles.containerView} behavior = "padding">

    <View>
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
                <View>
                  <TextInput onChangeText={onChangeSerialNo} style={styles.input} placeholder="Serial" autoCorrect={false} />
                  <TextInput onChangeText={onChangeProductName} style={styles.input} placeholder="Product" autoCorrect={false} />
                  <TextInput onChangeText={onChangeAmount} style={styles.input} placeholder="Amount" autoCorrect={false} />
                    <TextInput multiline={true} numberOfLines={5} onChangeText={onChangeDescription} style={styles.input} placeholder="Description" autoCorrect={false} />
                  {/* dropdown */}
                  {/* <TextInput onChangeText={onChangeBrand} style={styles.input} placeholder="Brand" autoCorrect={false} /> */}
                  {/* dropdown */}
                  {/* <TextInput onChangeText={onChangeColor} style={styles.input} placeholder="Color" autoCorrect={false} /> */}
                  {/* <TextInput onChangeText={onChangeQuantity} style={styles.input} placeholder="Quantity" autoCorrect={false} /> */}
                  
                  {/* dropdown */}
                  {/* <TextInput onChangeText={onChangeWarehouse} style={styles.input} placeholder="Warehouse" autoCorrect={false} /> */}
                  {/* <DropDownPicker
                    defaultIndex={0}
                    placeholder = "Select a Color"
                    dropDownContainerStyle = {{widht : 10,}}
                    containerStyle = {{height: 40,width: Dimensions.get('window').width * 0.65,}}
                    style = {{borderWidth: 2, borderRadius: 40,borderColor: "#008394",width: Dimensions.get('window').width * 0.65, top: 60, height: 40, fontSize: 8,  }}
                    labelStyle={{fontSize: 12, color: 'grey'}}
                    placeholderStyle={{ color: 'grey',}}
                    open={openColor}
                    value={color}
                    items={itemsColor}
                    setOpen={setOpenColor}
                    setValue={setColor}
                    setItems={setItemsColor}                    
                  />
                  <DropDownPicker
                    defaultIndex={0}
                    placeholder = "Select a Brand"
                    containerStyle = {{height: 40,width: Dimensions.get('window').width * 0.65,}}
                    style = {{borderWidth: 2, borderRadius: 40,borderColor: "#008394",width: Dimensions.get('window').width * 0.65, top: 80, height: 40, fontSize: 8,  }}
                    labelStyle={{fontSize: 12, color: 'grey'}}
                    placeholderStyle={{ color: 'grey',}}
                    open={openBrand}
                    value={brand}
                    items={itemsBrand}
                    setOpen={setOpenBrand}
                    setValue={setBrand}
                    setItems={setItemsBrand}                    
                  />
                  <DropDownPicker
                    defaultIndex={0}
                    placeholder = "Select a Warehouse"
                    dropDownContainerStyle = {{}}
                    containerStyle = {{height: 40,width: Dimensions.get('window').width * 0.65,}}
                    style = {{borderWidth: 2, borderRadius: 40,borderColor: "#008394",width: Dimensions.get('window').width * 0.65, top: 100, height: 40, fontSize: 8,  }}
                    labelStyle={{fontSize: 12, color: 'grey'}}
                    placeholderStyle={{ color: 'grey',}}
                    open={openWarehouse}
                    value={warehouse}
                    items={itemsWarehouse}
                    defaultIndex = {1}
                    setOpen={setOpenWarehouse}
                    setValue={setWarehouse}
                    setItems={setItemsWarehouse}                    
                  /> */}
                  
                  <View style = {{borderWidth: 2, borderRadius: 40,borderColor: "#008394",width: Dimensions.get('window').width * 0.65, top: 60, height: 40, fontSize: 8,  }}>
                    <Picker
                      style = {{top:6, color: 'grey', fontFamily: 'Roboto'}}
                      itemStyle={{ fontWeight: '100' }}
                      selectedValue = {color}
                      onValueChange={(itemValue, itemIndex) =>
                        setColor(itemValue)
                      }
                    >
                      <Picker.Item label="Transparent" value="Transparent" />
                      <Picker.Item label="White" value="White" />
                      <Picker.Item label="Black" value="Black" />
                      <Picker.Item label="Blue" value="Blue" />
                      <Picker.Item label="Brown" value="Brown" />
                      <Picker.Item label="Pink" value="Pink" />
                    </Picker>

                  </View>
                  <View style = {{borderWidth: 2, borderRadius: 40,borderColor: "#008394",width: Dimensions.get('window').width * 0.65, top: 80, height: 40, fontSize: 8,  }}>
                    <Picker
                      style = {{top:6, color: 'grey', fontFamily: 'Roboto'}}
                      //itemStyle={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]}}
                      itemStyle={{ fontWeight: '100' }}
                      
                      selectedValue = {brand}
                      onValueChange={(itemValue, itemIndex) =>
                        setBrand(itemValue)
                      }
                    >
                      <Picker.Item label="PVC" value="PVC" />
                      <Picker.Item label="PVCC" value="PVCC" />
                      
                    </Picker>

                  </View>
                  <View style = {{borderWidth: 2, borderRadius: 40,borderColor: "#008394",width: Dimensions.get('window').width * 0.65, top: 100, height: 40, fontSize: 8,  }}>
                    <Picker
                      style = {{top:6, color: 'grey', fontFamily: 'Roboto'}}
                      //itemStyle={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]}}
                      itemStyle={{  }}
                      selectedValue = {warehouse}
                      onValueChange={(itemValue, itemIndex) =>
                        setWarehouse(itemValue)
                      }
                    >
                      <Picker.Item label="1b" value="1b" />
                      <Picker.Item label="1c" value="1c" />
                      <Picker.Item label="1d" value="1d" />
                      
                    </Picker>

                  </View>
                  
                  
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', top: 105 }}>
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

      <TableDetailModal state={isTableDetailModalVisible} handleClose={handleClose} title='Employee Information' name='Raahem Asghar' email='raahemasghar97@gmail.com' occupation="Employee" />
      <View style={styles.screen}>
        <View>
          <Text style={styles.title}>Products</Text>
        </View>
      </View>
      <View style={styles.containerButton}>
        <TouchableOpacity onPress={() => { setModalVisible(true) }}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Add Product</Text>
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
      <View style={{ flexDirection: 'row', }}>
        {/* <ScrollView horizontal = {true}> */}
        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Serial No.</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Product</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Brand</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Color</Text></DataTable.Title>
            {/* <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Quantity</Text></DataTable.Title> */}
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Amount</Text></DataTable.Title>
            {/* <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Warehouse</Text></DataTable.Title> */}

          </DataTable.Header>


          {
            products.map((product, i) => (
              <TouchableOpacity key={i} onPress={() => setTableDetailModalVisible(true)}>
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
          {/* <DataTable.Row>
              <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>122</Text></DataTable.Cell>
              <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>Abcdecec</Text></DataTable.Cell>
              <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>PVC</Text></DataTable.Cell>
              <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>Transparent</Text></DataTable.Cell>
              <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>59</Text></DataTable.Cell>
              <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>69000</Text></DataTable.Cell>
              <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>11-B</Text></DataTable.Cell>
            </DataTable.Row> */}
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

        {/* </ScrollView> */}
      </View>
    </View>
    // </KeyboardAvoidingView>


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

export default Product


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
})
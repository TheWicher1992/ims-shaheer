import * as React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView} from 'react-native'; 
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { FontAwesome } from '@expo/vector-icons';
import { DataTable } from 'react-native-paper';
import Modal from 'react-native-modal';
import PickerCheckBox from 'react-native-picker-checkbox';
import TableDetailModal from '../components/TableDetailModal';
import { Icon } from 'react-native-elements'


const optionsPerPage = [2, 3, 4];

const MakeSale = props => {


  const handleConfirm = (pItems) => { // temporary for picker
    console.log('pItems =>', pItems);
  }
 
  const items = [ //temporary for picker for filter
    {
      itemKey:1,
      itemDescription:'Item 1'
      },
    {
      itemKey:2,
      itemDescription:'Item 2'
      },
    {
      itemKey:3,
      itemDescription:'Item 3'
      }
  ];

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
  const [productName, setProductName] = React.useState(``)
  const [quantityVal, setQuantityVal] = React.useState(0)
  const [amountVal, setAmountVal] = React.useState(0)
  const [clientName, setClientName] = React.useState(``)
  const [notes, setNotes] = React.useState(``)


  const onChangeProductName = (prodName) => {
    setProductName(prodName);
  }

  const onChangeQuantity = (quant) => {
    setQuantityVal(quant);
  }

  const onChangeAmount = (amount) => {
    setAmountVal(amount);
  }

  const onChangeClientName = (clName) => {
    setClientName(clName);
  }

  const onChangeNotes = (noteVal) => {
    setNotes(noteVal);
  }

  const addSale = () => {
    console.log(productName);
    console.log(quantityVal);
    console.log(amountVal);
    console.log(clientName);
    console.log(notes);
    setModalVisible(false); //closing modal on done for now
  }
  

  const [isTableDetailModalVisible, setTableDetailModalVisible] = React.useState(false);

  const handleClose = ()=>{
    setTableDetailModalVisible(false)
  }




    return(
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
                  <View style = {{justifyContent: 'center', alignItems : 'center', }}>
                      <Text style = {styles.modalTitle}>Make a Sale</Text>
                      <View>
                        <TextInput onChangeText={onChangeProductName} style={styles.input} placeholder="Product" autoCorrect={false} />
                        <TextInput onChangeText={onChangeQuantity} style={styles.input} placeholder="Quantity" autoCorrect={false} />
                        <TextInput onChangeText={onChangeAmount} style={styles.input} placeholder="Amount" autoCorrect={false} />
                        <TextInput onChangeText={onChangeClientName} style={styles.input} placeholder="Client" autoCorrect={false} />
                        <TextInput onChangeText={onChangeNotes} style={styles.input} placeholder="Notes" autoCorrect={false} />
                      </View>
                      <View style = {{flexDirection: 'row',  alignItems : 'center', top: 45}}>
                        <TouchableOpacity style={{alignSelf: 'flex-start'}} onPress = {() => {setModalVisible(false)}}>
                          <View>
                            <View style={styles.buttonModalContainerCross}>
                              <View>
                                <Text style={styles.buttonModalText}>Cancel</Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>   
                        <TouchableOpacity onPress = {() => {addSale()}}>
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
        <TableDetailModal state={isTableDetailModalVisible} handleClose={handleClose} title='Employee Information' name='Raahem Asghar' email='raahemasghar97@gmail.com' occupation="Employee" />
        <View style = {styles.screen}>
          <View>
            <Text style={styles.title}>Sales</Text>
          </View>
        </View>
        <View style = {styles.containerButton}>
          <TouchableOpacity onPress = {() => {setModalVisible(true)}}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Make a Sale</Text>
            </View>
          </TouchableOpacity>
          <View style = {{flexDirection: 'row', justifyContent: 'center',}}>
            <View style = {styles.searchBar}>
              <TextInput onChangeText={onChangeSearch}  style={styles.buttonInput} placeholder="type here..." autoCorrect={false} />
            </View>
            <View style = {{top:14}}>
            <TouchableOpacity onPress = {() => { searchFunc() }}>
              <View style = {styles.searchButton}>   
                  <FontAwesome
                    name = {"search"}
                    size = {16}
                    color = {"#006270"}
                    style = {{right: 10, top: 3}}
                  />                  
                  <Text style = {styles.searchButtonText}>Search</Text>             
              </View>
            </TouchableOpacity>
            </View> 
          </View>

        </View>
        <View style = {{flexDirection: 'row', top: 35, justifyContent: 'space-around',alignItems: 'stretch'}}>
          <PickerCheckBox
            data={items}
            headerComponent={<Text style={{fontSize:25}} >Items</Text>}
            OnConfirm={(pItems) => {handleConfirm(pItems)}}
            ConfirmButtonTitle='OK'
            DescriptionField='itemDescription' 
            KeyField='itemKey'
            placeholder='Quantity'
            arrowColor='#006270'
            arrowSize={20}
            placeholderSelectedItems ='$count selected item(s)'
            containerStyle = {styles.filterInput}
          />
          <PickerCheckBox
            data={items}
            headerComponent={<Text style={{fontSize:25}} >Items</Text>}
            OnConfirm={(pItems) => {handleConfirm(pItems)}}
            ConfirmButtonTitle='OK'
            DescriptionField='itemDescription' 
            KeyField='itemKey'
            placeholder='Amount'
            arrowColor='#006270'
            arrowSize={20}
            placeholderSelectedItems ='$count selected item(s)'
            containerStyle = {styles.filterInput}
          />
        </View>
        <View style = {{flexDirection: 'row', top: 35, justifyContent: 'space-around',alignItems: 'stretch'}}>
          <PickerCheckBox
            data={items}
            headerComponent={<Text style={{fontSize:25}} >Items</Text>}
            OnConfirm={(pItems) => {handleConfirm(pItems)}}
            ConfirmButtonTitle='OK'
            DescriptionField='itemDescription' 
            KeyField='itemKey'
            placeholder='Time'
            arrowColor='#006270'
            arrowSize={20}
            placeholderSelectedItems ='$count selected item(s)'
            containerStyle = {styles.filterInput}
          />          
        </View>
        <ScrollView>
        
          <DataTable style = {{top: 30}}>
            <DataTable.Header>
              <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Product</Text></DataTable.Title>
              <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Quantity</Text></DataTable.Title>
              <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Amount</Text></DataTable.Title>
              <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Client</Text></DataTable.Title>
            </DataTable.Header>

            <TouchableOpacity onPress={() => setTableDetailModalVisible(true)}>
              <DataTable.Row>
                <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>ABC34013-133</Text></DataTable.Cell>
                <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>59</Text></DataTable.Cell>
                <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>69000</Text></DataTable.Cell>
                <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>Ahmed Ateeq</Text></DataTable.Cell>
              </DataTable.Row>
            </TouchableOpacity>
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
  modalTitle : {
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
    height: Dimensions.get('window').height > 900 ? 540: 480,
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
  buttonModalContainer : {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius : 40,
    backgroundColor: '#00E0C7',
    paddingVertical: 8,
    paddingHorizontal: 24,
    //top: 45,
    margin: 20,
    display: 'flex'
  },
  buttonModalContainerCross : {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius : 40,
    backgroundColor: '#ff0000',
    paddingVertical: 8,
    paddingHorizontal: 24,
    //top: 45, //here is the problem
    margin: 20,
    display: 'flex'
  },
  buttonModalText :{
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  buttonText: {
    fontSize: 24,
    textAlign: 'center',
    color:'white',
    fontWeight: 'bold'
  },
  container :{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerButton:{
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  input: {
    width: Dimensions.get('window').width * 0.65,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 40,
    marginBottom:20,
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
    marginBottom:20,
    fontSize: 12,
    borderColor: "#008394",
  },
  searchBar: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    bottom: 30,
    left: Dimensions.get('window').height > 900 ? Dimensions.get('window').width /11:0,
    
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
    fontSize:15,
    textAlign: 'center',
    color:'white',
    fontWeight: 'bold',
  },
  buttonInput: {
    width: Dimensions.get('window').width * 0.65,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 40,
    marginBottom:20,
    fontSize: 14,
    borderColor: "#008394",
    top: 60,
    height: 44,
    padding: 15,
    left: 30,
    paddingBottom: 13,
  },
  cells: {
    justifyContent:'center', 
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
  modalBody:{
    paddingVertical:Dimensions.get('window').height < 900 ? Dimensions.get('window').height * 0.11 : Dimensions.get('window').height * 0.1,
    paddingHorizontal:10
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
    height: Dimensions.get('window').height > 900 ? Dimensions.get('window').height* 0.5 : Dimensions.get('window').height * 0.60
  },
})
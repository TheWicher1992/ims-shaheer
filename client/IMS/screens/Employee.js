import * as React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, useWindowDimensions } from 'react-native'; 
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { FontAwesome } from '@expo/vector-icons';
import { DataTable } from 'react-native-paper';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import TableDetailModal from '../components/TableDetailModal'
import UpdateModal from '../components/UpdateModal'

const optionsPerPage = [2, 3, 4];

const Employee = props => {

  const [page, setPage] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]);
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [isTableDetailModalVisible, setTableDetailModalVisible] = React.useState(false);
  const [selectedOccupation, setSelectedOccupation] = React.useState(``);
  const [userName, setUserName] = React.useState(``)
  const [password, setPassword] = React.useState(``)


  const onChangePassword = (pass) => { // setting password on change
      setPassword(pass)
      //console.log(pass)
  }
  const handleClose = ()=>{
    setTableDetailModalVisible(false)
  }

  

  const onChangeUserName = (userName) => { //setting username on change
      setUserName(userName)
      //console.log(userName)
  }

  const addEmployee = () => { //when add button is clicked
      console.log(password)
      console.log(userName)
      console.log(selectedOccupation)
  }


  const toggleModal = () => { //to switch modal on
    setModalVisible(!isModalVisible);
  };



  React.useEffect(() => { //table stuff, might be useless
    setPage(0);
  }, [itemsPerPage]);


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
                    <View style = {{top:30, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                      <View>
                        <FontAwesome
                            name = {"user"}
                            size = {Dimensions.get('window').height > 900 ? 160: 100}
                            color = {'#006270'}
                            style = {{}}
                        />
                      </View>
                      <View>
                        <Text style = {styles.title}>Add Employee</Text>
                      </View>
                    </View>
                    <View>
                      <TextInput onChangeText={onChangeUserName} style={styles.input} placeholder="Username" autoCorrect={false} />
                      <TextInput onChangeText={onChangePassword} style={styles.input} placeholder="Password" secureTextEntry={true} autoCorrect={false} />
                    </View>


                    <View>
                      <View style={{ borderWidth: 2, borderRadius: 40,borderColor: "#008394",width: Dimensions.get('window').width * 0.65, top: 60, height: 40 }}>
                        <Picker
                            // style = {{width: 200, height: 100, top: 28}}
                            style = {{top: 6, color: 'grey', fontSize: 8}}
                            selectedValue={selectedOccupation}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedOccupation(itemValue)
                            }>
                            <Picker.Item label="Manager" value="Manager" fontSize = {8}/>
                            <Picker.Item label="Receptionist" value="Receptionist" />
                        </Picker>
                      </View>
                    </View>



                    <View style = {{flexDirection: 'row', justifyContent: 'space-evenly', alignItems : 'center', top: 20}}>
                      <TouchableOpacity onPress = {() => {setModalVisible(false)}}>
                        <View style={styles.buttonModalContainerCross}>
                          <View>
                            
                              <Text style={styles.buttonModalText}>Cancel</Text>
                          
                          </View>
                          
                        </View>
                      </TouchableOpacity> 
                      <TouchableOpacity onPress={() => { addEmployee() }}>
                        <View style={styles.buttonModalContainer}>
                          <View>
                            <Text style={styles.buttonModalText}>Done</Text>
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
            <Text style={styles.title}>Employees</Text>
          </View>
        </View>
        <View style = {styles.containerButton}>
          <TouchableOpacity onPress = {() => {setModalVisible(true)}}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Add Employee</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <DataTable style = {{top: 30}}>
            <DataTable.Header>
              <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Email</Text></DataTable.Title>
              <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Name</Text></DataTable.Title>
              <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Occupation</Text></DataTable.Title>
            </DataTable.Header>

            <TouchableOpacity onPress={() => setTableDetailModalVisible(true)}>
              <DataTable.Row>
                <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>raahemasghar97@gmail.com</Text></DataTable.Cell>
                <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>Raahem Asghar</Text></DataTable.Cell>
                <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>Employee</Text></DataTable.Cell>
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

        </View>
      </View>        
      // </KeyboardAvoidingView>
        
        
    )
}


Employee.navigationOptions = navigationData => {
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
        headerRight: (
          <HeaderButtons HeaderButtonComponent = {HeaderButton}>
            <FontAwesome
              name = {"user"}
              size = {24}
              color = {"white"}
              style = {{right: 10}}
            />
          </HeaderButtons>
        )
    };
  };

export default Employee;


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
    height: Dimensions.get('window').height > 900 ? 560: 460,
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
    marginTop: Dimensions.get('window').height * 0.015
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    top: 45,
    margin: 20
  },
  buttonModalContainerCross : {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius : 40,
    backgroundColor: '#ff0000',
    paddingVertical: 8,
    paddingHorizontal: 24,
    top: 45,
    margin: 20
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
  }

})
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, useWindowDimensions } from 'react-native';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { FontAwesome } from '@expo/vector-icons';
import { DataTable } from 'react-native-paper';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import EmployeeDetailModal from '../components/EmployeeDetailModal'
import UpdateModal from '../components/UpdateModal'
import { uri } from '../api.json'
import axios from "axios"
import Spinner from '../components/Spinner';

const optionsPerPage = [2, 3, 4];

const Employee = props => {

  const [page, setPage] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]);
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [isTableDetailModalVisible, setTableDetailModalVisible] = React.useState(false);
  const [selectedOccupation, setSelectedOccupation] = React.useState(``);
  const [userName, setUserName] = React.useState(``)
  const [password, setPassword] = React.useState(``)
  const [touchedEmployee, setTouchedEmployee] = React.useState([])
  const [touchedAdmin, setTouchedAdmin] = React.useState([])
  const [occupation, setSelectedOccupationModal] = React.useState(``)
  const [loading, setLoading] = useState(true)

  const addEmployee = () => {
    setModalVisible(false); //closing modal on done for now

    const body = {
      userName: userName,
      password: password,
    }

    axios.post(`${uri}/api/auth/add-employee`, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => getEmployees())
      .catch(err => console.log(err))
  }

  const addAdmin = () => {
    setModalVisible(false); //closing modal on done for now

    const body = {
      userName: userName,
      password: password,
    }

    axios.post(`${uri}/api/auth/add-admin`, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => getEmployees())
      .catch(err => console.log(err))
  }

  const onPressModal = (emp) => {
    setTableDetailModalVisible(true),
      setTouchedEmployee(emp)
    setSelectedOccupationModal('Employee')
  }

  const onPressModalAdmin = (admin) => {
    setTableDetailModalVisible(true),
      setTouchedEmployee(admin)
    setSelectedOccupationModal('Admin')
  }

  const onChangePassword = (pass) => { // setting password on change
    setPassword(pass)
    //console.log(pass)
  }
  const handleClose = () => {
    setTableDetailModalVisible(false)
  }



  const onChangeUserName = (userName) => { //setting username on change
    setUserName(userName)
  }

  const toggleModal = () => { //to switch modal on
    setModalVisible(!isModalVisible);
  };

  const [employees, setEmployees] = useState([])
  const [admins, setAdmins] = useState([])

  const getEmployees = async () => {
    setLoading(true)
    const res = await axios.get(`${uri}/api/auth/all`)
    setEmployees(res.data.employees)
    setAdmins(res.data.admins)
    setLoading(false)
  }

  useEffect(() => {
    getEmployees()
  }, [])



  React.useEffect(() => { //table stuff, might be useless
    setPage(0);
  }, [itemsPerPage]);


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
              <View style={{ top: 30, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                <View>
                  <FontAwesome
                    name={"user"}
                    size={Dimensions.get('window').height > 900 ? 160 : 100}
                    color={'#006270'}
                    style={{}}
                  />
                </View>
                <View>
                  <Text style={styles.title}>Add Employee</Text>
                </View>
              </View>
              <View>
                <TextInput onChangeText={onChangeUserName} style={styles.input} placeholder="Username" autoCorrect={false} />
                <TextInput onChangeText={onChangePassword} style={styles.input} placeholder="Password" secureTextEntry={true} autoCorrect={false} />
              </View>


              <View>
                <View style={{ borderWidth: 2, borderRadius: 40, borderColor: "#008394", width: Dimensions.get('window').width * 0.65, top: 60, height: 40 }}>
                  <Picker
                    // style = {{width: 200, height: 100, top: 28}}
                    style={{ top: 6, color: 'grey', fontSize: 8 }}
                    selectedValue={selectedOccupation}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelectedOccupation(itemValue)
                    }>
                    <Picker.Item label="Admin" value="Admin" fontSize={8} />
                    <Picker.Item label="Employee" value="Employee" />
                  </Picker>
                </View>
              </View>



              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', top: 20 }}>
                <View style={{ top: 45 }}>
                  <TouchableOpacity onPress={() => { setModalVisible(false) }}>
                    <View style={styles.buttonModalContainerCross}>
                      <View>

                        <Text style={styles.buttonModalText}>Cancel</Text>

                      </View>

                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ top: 45 }}>
                  <TouchableOpacity onPress={() => { selectedOccupation === 'Employee' ? addEmployee() : addAdmin() }}>
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
        </View>
      </Modal>
      <EmployeeDetailModal state={isTableDetailModalVisible} handleClose={handleClose} title='Employee Information' object={touchedEmployee} occupation={occupation} getEmployees={getEmployees} />
      <View style={styles.screen}>
        <View>
          <Text style={styles.title}>Employees</Text>
        </View>
      </View>
      <View style={styles.containerButton}>
        <TouchableOpacity onPress={() => { setModalVisible(true) }}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Add Employee</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Spinner loading={loading} />
      {!loading && <View>
        <DataTable style={{ top: 30 }}>
          <DataTable.Header>
            {/* <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Email</Text></DataTable.Title> */}
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Username</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Occupation</Text></DataTable.Title>
          </DataTable.Header>

          {
            employees.map((employee, i) => (
              <TouchableOpacity key={i} onPress={() => onPressModal(employee)}>
                <DataTable.Row>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{employees === undefined ? 'Empty' : employee.userName}</Text></DataTable.Cell>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>Employee</Text></DataTable.Cell>
                </DataTable.Row>
              </TouchableOpacity>

            ))
          }
          {
            admins === undefined ? (null) : (admins.map((admin, i) => (
              <TouchableOpacity key={i} onPress={() => onPressModalAdmin(admin)}>
                <DataTable.Row>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{admin.userName === undefined ? 'Empty' : admin.userName}</Text></DataTable.Cell>
                  <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>Admin</Text></DataTable.Cell>
                </DataTable.Row>
              </TouchableOpacity>

            )))
          }

          {/* <DataTable.Pagination
              page={page}
              numberOfPages={3}
              onPageChange={(page) => setPage(page)}
              label="1-2 of 6"
              optionsPerPage={optionsPerPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              showFastPagination
              optionsLabel={'Rows per page'}
            /> */}
        </DataTable>

      </View>}
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
    height: Dimensions.get('window').height > 900 ? 560 : 460,
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
  buttonModalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius: 40,
    backgroundColor: '#00E0C7',
    paddingVertical: 8,
    paddingHorizontal: 24,
    //top: 45,
    margin: 20
  },
  buttonModalContainerCross: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius: 40,
    backgroundColor: '#ff0000',
    paddingVertical: 8,
    paddingHorizontal: 24,
    //top: 45,
    margin: 20
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
  }

})
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
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
import ShowAlert from '../components/ShowAlert';
import ExportButton from '../components/ExportAsExcel';
import * as Print from 'expo-print';


const optionsPerPage = [2, 3, 4];

const Employee = props => {

  const print = async () => {
    let options = {
      html: html,
  };

try {
  file = await Print.printAsync(options);
}
catch(error) {console.error(error)}

  }

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
  const [alertState, setAlertState] = useState(false)
  const [alertTitle, setAlertTitle] = useState(``)
  const [alertMsg, setAlertMsg] = useState(``)

  const addEmployee = () => {
    if (userName === `` || password === ``) {
      console.log('inside if')
      setAlertTitle('Warning')
      setAlertMsg('Some of the input fields may be empty. Request could not be processed.')
      show()
    }
    else {
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
        .then(res => {
          getEmployees()
          setAlertTitle('Success')
          setAlertMsg('Request has been processed and admin has been added.')
          show()
        })
        .catch(err => setError())
        .finally(() => setUserName(``), setPassword(``))
    }

  }
  const show = () => {
    setAlertState(!alertState)
  }
  const catchWarning = () => {
    setAlertState(!alertState)
    setAlertTitle('Attention')
    setAlertMsg('Something went wrong. Please restart')
  }
  const setError = () => {
    setAlertTitle('Error')
    setAlertMsg('User already exists.')
    show()
  }
  const addAdmin = () => {
    if (userName === `` || password === ``) {
      setAlertTitle('Warning')
      setAlertMsg('Some of the input fields may be empty. Request could not be processed.')
      show()
    }
    else {
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
        .then(res => {
          console.log(res.status)
          getEmployees();
          setAlertTitle('Success');
          setAlertMsg('Request has been processed and admin has been added.');
          show();
        })
        .catch(err => setError())
        .finally(() => setUserName(``), setPassword(``))

    }
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
  const [html, setHTML] = useState(``)

  const getEmployees = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${uri}/api/auth/all`)
      setEmployees(res.data.employees)
      setAdmins(res.data.admins)
      let infoString = ''
      res.data.employees.map(e => {
        infoString = infoString + `<tr><td>${e.userName}</td><td>Employee</td></tr>`
      })
      res.data.admins.map(a => {
        infoString = infoString + `<tr><td>${a.userName}</td><td>Admin</td></tr>`
      })
    const htmlcontent = `<html><body><table><tr><th>Name</th><th>Occupation</th></tr>${infoString}</table></body></html>`;
    setHTML(htmlcontent)
    }
    catch (err) {
      catchWarning()
    }

    setLoading(false)
  }

  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      getEmployees()
    })
  }, [])



  React.useEffect(() => { //table stuff, might be useless
    setPage(0);
  }, [itemsPerPage]);


  return (
    // <KeyboardAvoidingView style = {styles.containerView} behavior = "padding">
    <ScrollView>
      <ShowAlert state={alertState} handleClose={show} alertTitle={alertTitle} alertMsg={alertMsg} style={styles.buttonModalContainer} />
      <Modal
        animationType="slide"
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="left"
        presentationStyle="overFullScreen"
        transparent
        visible={isModalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

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
      <ExportButton data={employees} title="Employee.xlsx" screenName='employees'/>
      <Spinner loading={loading} />
      <View>
        <DataTable style={{ top: 10 }}>
          <DataTable.Header>
            {/* <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Email</Text></DataTable.Title> */}
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Username</Text></DataTable.Title>
            <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Occupation</Text></DataTable.Title>
          </DataTable.Header>
          {!loading && <ScrollView>
            <View>
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
            </View>
          </ScrollView>}
        </DataTable>

      </View>
    </ScrollView>
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
    fontSize: Dimensions.get('window').height > 900 ? 36 : 28,
  },
  modalTitle: {
    color: '#006270',
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height > 900 ? 36 : 28,
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
    // marginTop: Dimensions.get('window').height * 0.015
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Dimensions.get('window').height > 900 ? 40 : 30,
    borderRadius: 40,
    backgroundColor: '#00E0C7',
    paddingVertical: 12,
    paddingHorizontal: 32,
    left: 15
    // right: Dimensions.get('window').width / 5
    // we can also change the container to center and implement the right styling
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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
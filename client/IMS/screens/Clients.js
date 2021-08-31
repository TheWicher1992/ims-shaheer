import React from 'react';
import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback } from 'react-native';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { FontAwesome } from '@expo/vector-icons';
import { DataTable } from 'react-native-paper';
import Modal from 'react-native-modal';
import { ToastAndroid } from 'react-native'
import PickerCheckBox from 'react-native-picker-checkbox';
import ClientDetailModal from '../components/ClientDetailModal';
import ExportButton from '../components/ExportAsExcel';
import { uri } from '../api.json'
import axios from 'axios'
import ShowAlert from '../components/ShowAlert'
import Spinner from '../components/Spinner';
const optionsPerPage = [2, 3, 4];

const Clients = props => {

  const [page, setPage] = React.useState(0); //for pages of table
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]); //for items per page on table
  const [touchedClient, setTouchedClient] = useState([])
  const [isModalVisible, setModalVisible] = React.useState(false); //to set modal on and off
  const [alertState, setAlertState] = useState(false)
  const [alertTitle, setAlertTitle] = useState(``)
  const [alertMsg, setAlertMsg] = useState(``)

  const show = () => {
    setAlertState(!alertState)
  }
  const setError = () => {
    setAlertTitle('Error')
    setAlertMsg('Client with this name already exists.')
    show()
  }

  const toggleModal = () => { //to toggle model on and off -- function
    setModalVisible(!isModalVisible);
  };

  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const getClients = async () => {
    setLoading(true)
    try {
      const query = search.trim() === '' ? '*' : search.trim()
      const res = await axios.get(`${uri}/api/client/${query}`)
      res.data.clients.length === 0 ? searchWarning() : null
      setClients(res.data.clients)
    }
    catch (err) {
      catchWarning()
    }

    setLoading(false)
  }

  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      getClients()
    })
  }, [])

  React.useEffect(() => { //for table
    setPage(0);
  }, [itemsPerPage]);


  const [search, setSearch] = React.useState(`*`) //for keeping track of search
  const onChangeSearch = (searchVal) => { //function to keep track of search as the user types
    setSearch(searchVal);
  }

  const searchFunc = () => {
    getClients()
  }

  const searchWarning = () => {
    setAlertState(!alertState)
    setAlertTitle('Attention')
    setAlertMsg('No clients found!')
  }


  // make a sale variables below:
  const [name, setName] = React.useState(``)
  // const [balance, setBalance] = React.useState(``)
  const [phoneNumber, setPhoneNumber] = React.useState(0)


  const onChangeName = (supplierName) => {
    setName(supplierName);
  }

  const onChangeBalnace = (bal) => {
    setBalance(bal);
  }

  const onChangePhoneNumber = (phNumber) => {
    setPhoneNumber(phNumber);
  }
  const catchWarning = () => {
    setAlertState(!alertState)
    setAlertTitle('Attention')
    setAlertMsg('Something went wrong. Please restart')
  }


  const addClient = () => {
    const data = {
      userName: name,
      phone: phoneNumber
    }

    axios.post(`${uri}/api/client`, data,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    ).then(res => {
      getClients();
      setAlertTitle('Success');
      setAlertMsg('Client added successfully!');
      show()
    })
      .catch(err => {
        setError()
      })

    setModalVisible(false); //closing modal on done for now
  }


  const [isTableDetailModalVisible, setTableDetailModalVisible] = React.useState(false);

  const handleClose = () => {
    setTableDetailModalVisible(false)
  }

  const onPressRecord = (client) => {
    setTableDetailModalVisible(true),
      setTouchedClient(client)
  }




  return (
    // <KeyboardAvoidingView style = {styles.containerView} behavior = "padding">
    // <ScrollView >
    <ScrollView>
      <ShowAlert state={alertState} handleClose={show} alertTitle={alertTitle} alertMsg={alertMsg} style={styles.buttonModalContainer} />
      <Modal
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="left"
        animationType="slide"
        presentationStyle="overFullScreen"
        transparent
        visible={isModalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.modalStyle}>
            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
              <Text style={styles.modalTitle}>Add Supplier</Text>
              <View>
                <TextInput onChangeText={onChangeName} style={styles.input} placeholder="Name" autoCorrect={false} />
                <TextInput onChangeText={onChangePhoneNumber} style={styles.input} placeholder="Phone Number" autoCorrect={false} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', top: 45 }}>
                <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { setModalVisible(false) }}>
                  <View>
                    <View style={styles.buttonModalContainerCross}>
                      <View>
                        <Text style={styles.buttonModalText}>Cancel</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { addClient() }}>
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
      <ClientDetailModal navigator={props.navigation} state={isTableDetailModalVisible} handleClose={handleClose} object={touchedClient} title='Client Details' getClients={getClients} />
      <View style={styles.screen}>
        <View>
          <Text style={styles.title}>Clients</Text>
        </View>
      </View>
      <View style={styles.containerButton}>
        <TouchableOpacity onPress={() => { setModalVisible(true) }}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Add Client</Text>
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
      <View style={{ marginTop: 20 }}>
        <ExportButton data={clients} title={'clients.xlsx'} />
      </View>

      <Spinner loading={loading} />
      <DataTable style={{ marginTop: 10 }}>
        <DataTable.Header>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Name</Text></DataTable.Title>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Balance</Text></DataTable.Title>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Phone Number</Text></DataTable.Title>
        </DataTable.Header>


        {!loading && <ScrollView >
          <View>
            {
              clients.map(c => (
                <TouchableOpacity key={c._id} onPress={() => onPressRecord(c)}>

                  <DataTable.Row>
                    <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{c.userName}</Text></DataTable.Cell>
                    <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{c.balance}</Text></DataTable.Cell>
                    <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{c.phone}</Text></DataTable.Cell>
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


Clients.navigationOptions = navigationData => {
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

export default Clients


const styles = StyleSheet.create({
  p2: {
    paddingTop: 40
  },
  title: {
    color: '#006270',
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height > 900 ? 36 : 28,
    bottom: 35
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
    height: Dimensions.get('window').height > 900 ? 380 : 360,
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
    borderRadius: 40,
    backgroundColor: '#00E0C7',
    paddingVertical: 12,
    paddingHorizontal: 32,
    left: 15
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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
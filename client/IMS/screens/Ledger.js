import React from 'react';
import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback } from 'react-native';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { uri } from '../api.json'
import axios from "axios"
import { DataTable } from 'react-native-paper';
import { Card, ListItem, Button, Icon } from 'react-native-elements'


const Ledger = props => {
    const [ledgerData, setLedgerData] = useState([])
    const [balance, setBalance] = useState(0)
    const getClientDetail = async () => {
        try{
            const res = await axios.get(`${uri}/api/client/ledger/${props.navigation.getParam('clientID')}`)
            console.log('overhere', res.data.ledger)
            setLedgerData(res.data.ledger.reverse())
        }
        catch(err){
            console.log(err)
        }

    }

    useEffect(()=> {
        getClientDetail()
    }, [])



    return(
        <ScrollView>
        <View style={styles.screen}>
            <View>
            <Text style={styles.title}>Ledger</Text>
            </View>
            
            {/* {
                ledgerData.map( l=> (
                    <Card containerStyle={{width: '95%'}}>
                        <Card.Title>{l.type === 'Payed' || l.type === 'Received' ? `Payment ${l.type}` : l.type}</Card.Title>
                        <Card.Divider />
                        <View>
                            <Text>Date: {l.date}</Text>
                        </View>
                    </Card>
                ))

            } */}
            
            <DataTable style={{ marginTop: 10 }}>
        <DataTable.Header>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Date</Text></DataTable.Title>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Description</Text></DataTable.Title>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Debit</Text></DataTable.Title>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Credit</Text></DataTable.Title>
          <DataTable.Title style={styles.cells}><Text style={styles.tableTitleText}>Balance</Text></DataTable.Title>
        </DataTable.Header>


        <ScrollView >
          <View>
            {
              ledgerData.map(l => (

                        (l.type === 'Purchase' && 
                        <View>
                          <DataTable.Row>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{l.date.toLocaleString().split('T')[0]}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{`${l.type} - ${l.payment}`}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}></Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{l.total}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}></Text></DataTable.Cell>
                          </DataTable.Row>
                          <DataTable.Row>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}></Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}></Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{l.payment === 'Partial' ? l.received : l.total}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}></Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{l.type === 'Partial' ? (balance - parseInt(l.total) - parseInt(l.received)): balance}</Text></DataTable.Cell>
                          </DataTable.Row>
                      </View>)
                      ||
                        (l.type === 'Sale' && 
                        <View>
                          <DataTable.Row>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{l.date.toLocaleString().split('T')[0]}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{`${l.type} - ${l.payment}`}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{l.total}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}></Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}></Text></DataTable.Cell>
                          </DataTable.Row>
                          <DataTable.Row>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}></Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}></Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}></Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{l.payment === 'Partial' ? l.received : l.total}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{l.type === 'Partial' ? 10 : balance}</Text></DataTable.Cell>
                          </DataTable.Row>
                        </View>
                      )
                      || 
                      (l.type === 'Payed' && 
                        <View>
                          <DataTable.Row>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{l.date.toLocaleString().split('T')[0]}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>Payment Paid</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{l.cash}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}></Text></DataTable.Cell>
                            <DataTable.Cell style={styles.cells}><Text style={styles.tableText}></Text></DataTable.Cell>
                          </DataTable.Row>
                          
                        </View>

                      )
                    ||
                    (l.type === 'Received' &&
                      <View>
                        <DataTable.Row>
                          <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{l.date.toLocaleString().split('T')[0]}</Text></DataTable.Cell>
                          <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>Payment Received</Text></DataTable.Cell>
                          <DataTable.Cell style={styles.cells}><Text style={styles.tableText}></Text></DataTable.Cell>
                          <DataTable.Cell style={styles.cells}><Text style={styles.tableText}>{l.cash}</Text></DataTable.Cell>
                          <DataTable.Cell style={styles.cells}><Text style={styles.tableText}></Text></DataTable.Cell>
                        </DataTable.Row>
                      </View>

                    )

                     
  
              ))
            }
          </View>
        </ScrollView>
      </DataTable>
            
        </View>
        </ScrollView>
    )
}

Ledger.navigationOptions = navigationData => {
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
  
const styles = StyleSheet.create({
    title: {
        color: '#006270',
        fontSize: 30,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height > 900 ? 36 : 28,
        bottom: 35
      },
      screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      tableText: {
        fontSize: Dimensions.get('window').height > 900 ? 18 : 14,
      },
      tableTitleText: {
        fontSize: Dimensions.get('window').height > 900 ? 18 : 14,
        fontWeight: 'bold'
      },
      cells: {
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1
      },
})
  export default Ledger
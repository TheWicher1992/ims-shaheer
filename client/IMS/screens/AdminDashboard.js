import React, { useState } from 'react'
import { Alert, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { DrawerActions } from 'react-navigation-drawer';
import { EvilIcons } from '@expo/vector-icons';

const AdminDashboard = props => {
    return(
      <View style={{marginTop: Dimensions.get('window').height < 900 ? 5 : 60}}>
        <View style={{justifyContent: 'center', alignSelf: 'center',}}>
          <Text style={styles.titleText}>Admin Dashboard</Text>
        </View>
        <TouchableOpacity>
          <View style={styles.containers}>
            <Text style={styles.containerText}>Goods out of stock 8</Text>
          </View>
        </TouchableOpacity>        
        <TouchableOpacity>
          <View style={styles.containers}>
            <Text style={styles.containerText}>Today's Revenue 458,000</Text>
          </View>
        </TouchableOpacity>  
        <TouchableOpacity>
          <View style={styles.containers}>
            <Text style={styles.containerText}>Pending Deliveries 9</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => props.navigation.navigate({routeName: 'Sales'})}>
            <View elevation={5} style={styles.buttons}>
                <Text style={styles.buttonContainerText}>Make a Sale</Text>
            </View>
          </TouchableOpacity>
          <View style={{paddingLeft: 20}}></View>
          <TouchableOpacity onPress={() => props.navigation.navigate({routeName: 'MakePurchase'})}>
            <View elevation={5} style={styles.buttons}>
                <Text style={styles.buttonContainerText}>Make a Purchase</Text>
            </View>
          </TouchableOpacity>
        </View>  
      </View>
      
    )
}

const userInfo = () =>{
  return(
    <UserInfo />
  )
    
}
 
AdminDashboard.navigationOptions = navigationData => {
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
              <EvilIcons
                name={"user"}
                size={36}
                color = {"white"}
                style = {{right: 10}}
                onPress={() => {

                  Alert.alert(
                    "User Information",
                    "My Alert Msg",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      },
                      { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                  )

                  }}
                  
              />
            </HeaderButtons>
          )
    };
  };
  
const styles = StyleSheet.create({
  titleText: {
    color: '#008394',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height === 1232 ? 32 : 24

  },
  containers: {
    borderColor: '#00E0C7',
    borderRadius: 30,
    width: Dimensions.get('window').width * 0.65,
    height: Dimensions.get('window').height * 0.15,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: Dimensions.get('window').height < 900 ? Dimensions.get('window').height * 0.06 : Dimensions.get('window').height * 0.045,
  },
  containerText: {
    color: '#008394',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height === 1232 ? 26 : 20
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingVertical: Dimensions.get('window').height < 900 ? 30 : Dimensions.get('window').height * 0.045,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 5
  },

  buttons: {
    width: Dimensions.get('window').width * 0.65 / 2,
    height: Dimensions.get('window').height * 0.15,
    borderColor: '#00E0C7',
    backgroundColor: '#00E0C7',
    borderRadius: 30,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  buttonContainerText: {
    color: 'white',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height === 1232 ? 26 : 20,
    textAlign: 'center'

  },
})


export default AdminDashboard
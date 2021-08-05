import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer'
import { Dimensions } from 'react-native';
import React from 'react'
import AdminDashboard from '../screens/AdminDashboard';
import AdminLogin from '../screens/AdminLogin';
import EmployeeLogin from '../screens/EmployeeLogin';
import MakeSale from '../screens/MakeSale';
import MakePurchase from '../screens/MakePurchase';
import AddEmployee from '../screens/addEmployee';


const dash = createStackNavigator({
  Dashboard: {
    screen: AdminDashboard
  },
  Sales: {
    screen: MakeSale,
  },
  MakePurchase: {
    screen: MakePurchase,
  },
  Products: {
    screen: MakeSale
  },
  Delivery: {
    screen: MakeSale
  },
}, {initialRouteName: 'Dashboard'});

// Drawer Navigator
const Drawer = createDrawerNavigator({
  dashboard: {
    screen: dash,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
    })
  },
  Dashboard: {
    screen: AdminDashboard,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Dashboard',
    })
  },
  Sales: {
    screen: MakeSale,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Sales',
    })
  },
  MakePurchase: {
    screen: MakePurchase,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Purchases',
    })
  },
  Products: {
    screen: MakeSale,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Products',
    })
  },
  Warehouses: {
    screen: MakeSale,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Warehouses',
    })
  },
  Delivery: {
    screen: MakeSale,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Delivery Orders',
    })
  },
  Suppliers: {
    screen: MakeSale,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Suppliers',
    })
  },
  Clients: {
    screen: MakeSale,
    navigationOptions: ({ navigation }) => ({ 
      drawerLabel: 'Clients',
    })
  },
  Cheques: {
    screen: MakeSale,
    navigationOptions: ({ navigation }) => ({ 
      drawerLabel: 'Cheques',
    })
  },
  AddEmployee: {
    screen: AddEmployee,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Employees',
    })
  }, 

  },
  {
    contentOptions: {
      activeTintColor: 'none',
      activeBackgroundColor :'none',
      
      headerTitleStyle: {
        color: 'white'
      },
      headerStyle: {
        backgroundColor: '#006270'
      },
      itemsContainerStyle: {
        paddingVertical: Dimensions.get('window').height < 900 ? 95 : 120, 
      },
      labelStyle: {
        color: 'white',   
      }
    },
    drawerBackgroundColor: '#008394',

  }
);


// Main App Navigation
const AppNavigation = createStackNavigator({
  Login: {
    screen: AdminLogin,
  },
  employeeLogin : {
    screen: EmployeeLogin,
  },

  Drawer: {
    screen: Drawer,
  }
}, { headerMode: 'none' } );


export default createAppContainer(AppNavigation)
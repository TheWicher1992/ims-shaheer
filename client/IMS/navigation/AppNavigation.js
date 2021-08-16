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
import Employee from '../screens/Employee';
import Product from '../screens/Product'
import Warehouse from '../screens/Warehouses';
import DeliveryOrders from '../screens/DeliveryOrders';
import Suppliers from '../screens/Suppliers';
import Clients from '../screens/Clients';
import EmployeeDashboard from '../screens/EmployeeDashboard'
import EmployeeWarehouses from '../screens/EmployeeWarehouses'
import EmployeeProducts from '../screens/EmployeeProducts'
import EmployeeOrders from '../screens/EmployeeOrders'

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
    screen: Product
  },
  Warehouse: {
    screen: Warehouse
  },
  Delivery: {
    screen: DeliveryOrders
  },
  Suppliers: {
    screen: Suppliers
  },
  Employee: {
    screen: Employee
  },
  Clients: {
    screen: Clients
  }
}, {initialRouteName: 'Dashboard'});

const employeeDash = createStackNavigator({
  EmployeeDashboard: {
    screen: EmployeeDashboard
  },
  EmployeeProducts: {
    screen: EmployeeProducts
  },
  EmployeeWarehouses: {
    screen: EmployeeWarehouses
  },
  EmployeeOrders: {
    screen: EmployeeOrders
  }
}, {initialRouteName: 'EmployeeDashboard'});

// Drawer Navigator
const AdminSide = createDrawerNavigator({
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
    screen: Product,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Products',
    })
  },
  Warehouse: {
    screen: Warehouse,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Warehouses',
    })
  },
  Delivery: {
    screen: DeliveryOrders,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Delivery Orders',
    })
  },
  Suppliers: {
    screen: Suppliers,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Suppliers',
    })
  },
  Clients: {
    screen: Clients,
    navigationOptions: ({ navigation }) => ({ 
      drawerLabel: 'Clients',
    })
  },
  Employee: {
    screen: Employee,
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
        fontSize: Dimensions.get('window').height > 900 ? 20: 15,
        marginTop: Dimensions.get('window').height > 900 ? "16%": "8%",
      },
      


    },
    drawerBackgroundColor: '#008394',

  }
);

const EmployeeSide = createDrawerNavigator({
  employeedashboard: {
    screen: employeeDash,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
    })
  },
  EmployeeDashboard: {
    screen: EmployeeDashboard,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Dashboard',
    })
  }, 
  EmployeeProducts: {
    screen: EmployeeProducts, 
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Products',
    })
  },
  EmployeeWarehouses: {
    screen: EmployeeWarehouses,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Warehouses', 
    })
  },
  EmployeeOrders: {
    screen: EmployeeOrders,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Delivery Orders',
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
        fontSize: Dimensions.get('window').height > 900 ? 20: 15,
        marginTop: Dimensions.get('window').height > 900 ? "16%": "8%",
      },
      


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
  adminSide: {
    screen: AdminSide,
  },
  employeeSide: {
    screen: EmployeeSide 
  }
}, { headerMode: 'none' } );


export default createAppContainer(AppNavigation)
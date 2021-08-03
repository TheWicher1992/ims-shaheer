import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer'
// import { createBottomTabNavigator } from 'react-navigation-tabs'
import React from 'react'
import AdminDashboard from '../screens/AdminDashboard';
import AdminLogin from '../screens/AdminLogin';
import EmployeeLogin from '../screens/EmployeeLogin';
import MakeSale from '../screens/MakeSale';
import MakePurchase from '../screens/MakePurchase';


const defaultStackNavOptions = {
    mode: 'modal'
}

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
}, { headerMode: 'screen' } );

// Drawer Navigator
export const Drawer = createDrawerNavigator({
  dashboard: {
    screen: dash,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Dashboard',
      activeTintColor: 'black'
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
  screen: MakeSale,
  navigationOptions: ({ navigation }) => ({
    drawerLabel: 'Add Employees',
  })
},

},
{
  contentOptions: {
    activeTintColor: 'none',
    activeBackgroundColor :'none',
    style: {
      backgroundColor: '#008394',
      flex: 1
    },
    
    labelStyle: {
      //color: 'white'
    }
  }
}
);


// Main App Navigation
export const AppNavigation = createStackNavigator({
  Login: {
    screen: AdminLogin,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  employeeLogin : {
    screen: EmployeeLogin,
    navigationOptions: {
        drawerLabel: () => null, // hides from the drawer
        drawerLockMode: 'locked-closed', // prevent user from opening the drawer in Bar
      }, 
},

  Drawer: {
    screen: Drawer,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  }
}, { headerMode: 'none' } );
         
// const MainStack = createStackNavigator({
//     Login : {
//         screen: AdminLogin, 
//         navigationOptions: {
//             drawerLabel: () => null, // hides from the drawer
//             drawerLockMode: 'locked-closed', // prevent user from opening the drawer in Bar 
//           },
//     },
//     employeeLogin : {
//         screen: EmployeeLogin,
//         navigationOptions: {
//             drawerLabel: () => null, // hides from the drawer
//             drawerLockMode: 'locked-closed', // prevent user from opening the drawer in Bar
//           }, 
//     },
//     Dashboard: {
//         screen: AdminDashboard,
//     },
//     Sales: {
//         screen: MakeSale,
        
//           navigationOptions: ({ navigation }) => ({
//             headerMode: 'screen',
//           }),
        
//     },
//     MakePurchase: {
//       screen: MakePurchase,
      
//         navigationOptions: ({ navigation }) => ({
//           headerMode: 'screen',
//         }),
      
//     },
//     Products: {
//       screen: MakeSale
//     },
//     Sales: {
//       screen: MakeSale,
//     },
//     Delivery: {
//       screen: MakeSale
//     },

    
//   }, defaultStackNavOptions );  
// const AppNavigation = createDrawerNavigator({
     
//     main: {
//         screen: MainStack,
//         navigationOptions: {
//             drawerLabel: () => null, // hides from the drawer
//           },
//     },
//     Sales: {
//         screen: MakeSale,
//       },
//     MakePurchase: {
//       screen: MakePurchase,
//     },
//     Products: {
//       screen: MakeSale
//     },
//     Warehouses: {
//       screen: MakeSale
//     },
//     Delivery: {
//       screen: MakeSale
//     },
//     Suppliers: {
//       screen: MakeSale
//     },
//     Clients: {
//       screen: MakeSale
//     },
//     Cheques: {
//       screen: MakeSale
//     },
//     AddEmployee: {
//       screen: MakeSale
//     },
// }, defaultStackNavOptions)

export default createAppContainer(AppNavigation)
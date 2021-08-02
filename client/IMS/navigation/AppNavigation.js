import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer'
// import { createBottomTabNavigator } from 'react-navigation-tabs'
import React from 'react'
import AdminDashboard from '../screens/AdminDashboard';
import AdminLogin from '../screens/AdminLogin';
import MakeSale from '../screens/MakeSale';
import MakePurchase from '../screens/MakePurchase';


const defaultStackNavOptions = {
    mode: 'modal'
}
// const MainStack = createStackNavigator({
//     Dashboard: {
//         screen: AdminDashboard,
//     },
//     Sales: {
//       screen: MakeSale,
//     },
//     MakePurchase: {
//       screen: MakePurchase,
//     }, 
//   }, { headerMode: 'screen' } );  

// const Drawer = createDrawerNavigator({ 
//     MainStack: {
//       screen: MainStack  
//     },
//     Dashboard: {
//         screen: AdminDashboard,
//     },      
//   });

// const AppNavigation = createStackNavigator({
//     Login : {
//         screen: AdminLogin,
//     },
//     Dashboard: {
//         screen: AdminDashboard,
//     },
//     Drawer: {
//         screen: Drawer,   
//     } 
// }, defaultStackNavOptions)

//Testing           
const MainStack = createStackNavigator({
    
    Dashboard: {
        screen: AdminDashboard,
    },
    Sales: {
        screen: MakeSale,
      }, 
    
  }, defaultStackNavOptions );  
const AppNavigation = createDrawerNavigator({
    Login : {
        screen: AdminLogin,
        navigationOptions: {
            drawerLabel: () => null, // hides from the drawer
            drawerLockMode: 'locked-closed', // prevent user from opening the drawer in Bar
          },
    },
    main: {
        screen: MainStack,
        navigationOptions: {
            drawerLabel: () => null, // hides from the drawer
          },
    },
    Sales: {
        screen: MakeSale,
      },
      MakePurchase: {
        screen: MakePurchase,
      }, 
}, defaultStackNavOptions)

export default createAppContainer(AppNavigation)
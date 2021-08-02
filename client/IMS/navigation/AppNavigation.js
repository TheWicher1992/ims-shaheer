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

const AppNavigation = createStackNavigator({
    Login : {
        screen: AdminLogin,
    },
    Dashboard: {
        screen: AdminDashboard,
    },
    Sales: {
        screen: MakeSale,
    },
    Purchases: {
        screen: MakePurchase
    }
}, defaultStackNavOptions)

//Testing           
//Test commit dashboard


export default createAppContainer(AppNavigation)
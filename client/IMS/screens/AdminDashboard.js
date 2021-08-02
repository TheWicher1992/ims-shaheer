import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import HeaderButton from '../components/HeaderButton';
const AdminDashboard = () => {
    return(
        <Text>Admin Dashboard</Text>
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
    };
  };
  


export default AdminDashboard
import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'; 


const AdminLogin = props => {
    return(
        <View>
            <Text>Admin Login!</Text>
            <Button title='Dashboard' onPress={() => props.navigation.navigate({routeName: 'Dashboard'})}/>
        </View>
        
        
    )
}

export default AdminLogin
import React from 'react'
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity } from 'react-native'; 


const AdminLogin = props => {
    return(
        <View>
            <View style={styles.circleNumber1}>

            </View>
            <View style={styles.screen}>
                <View>
                    <Text style={styles.title}>LOGIN</Text>
                </View>
                        
                        <View>
                            <Text style={styles.subtitle}>Sign in to your account</Text>
                        </View>
                    </View>
                <View style={styles.circleNumber2}>
                    
                    
                </View>
                    <View style={styles.circleNumber3}>

                    </View>
                    <View style={styles.container}>
                        <TextInput style={styles.input} placeholder="Email" />
                        <TextInput style={styles.input} placeholder="Password"/>
                        <View >
                            <TouchableOpacity onPress={() => props.navigation.navigate({routeName: 'Dashboard'})}>
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.buttonText}>Login</Text>
                                </View>
                                </TouchableOpacity>
                        </View>
                        
                    </View>
                        <View style={styles.circleNumber4}>

                        </View>
                        <View style={styles.circleNumber5}>
                                
                            </View>
                        
                            
                            
                                
            
            

        
        </View>
        
        
    )
}

AdminLogin.navigationOptions = () =>{
    return{
        header: null
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Dimensions.get('window').height * 0.05
    },
    title: {
        color: '#006270',
        fontSize: 36,
        fontFamily: 'Roboto',
        fontWeight: 'bold'
    },  
    subtitle: {
        color: '#008394',
        fontSize: 25,
        marginTop: 50,
        fontFamily: 'Roboto',
    },
    container:{
        alignItems: 'center',
        justifyContent: 'center',

    },
    containerF:{
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    input: {
        height: 40,
        width: Dimensions.get('window').width * 0.65,
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 20,
        marginBottom: 20,
        fontSize: 12,
        borderColor: "#008394",
        padding: 13
        
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: Dimensions.get('window').height > 600 ? 15 : 8,
        borderRadius: 25,
        backgroundColor: '#00E0C7',
        paddingVertical: 12,
        paddingHorizontal: 30,
    },
    buttonText: {
        fontSize:18,
        textAlign: 'center',
        color:'white',
        fontWeight: 'bold'

    },
    circleNumber1 :{
        height : 30 ,
        width :30,
        borderRadius: 1000,
        backgroundColor: '#006270',
        margin: Dimensions.get('window').width * 0.10,

       },
    circleNumber2 :{
        height : 50 ,
        width :50,
        borderRadius: 1000,
        backgroundColor: '#008394',
        marginTop: Dimensions.get('window').height * 0.10,
        marginLeft: Dimensions.get('window').width * 0.88

       },
    circleNumber3 :{
        height : 60 ,
        width :60,
        borderRadius: 1000,
        borderColor: '#00E0C7',
        borderWidth: 3,
        marginTop: Dimensions.get('window').height * 0,
        marginRight: Dimensions.get('window').width * 0.95,
        

       },
    circleNumber4 :{
        height : 45 ,
        width :45,
        borderRadius: 1000,
        backgroundColor: '#008394',
        marginTop: Dimensions.get('window').width * 0.20,
        marginLeft: Dimensions.get('window').width * 0.2

       },

    circleNumber5 :{
        height : 180 ,
        width : 180,
        borderRadius: 1000,
        backgroundColor: '#00E0C7',
        marginTop: Dimensions.get('window').width * 0.0,
        marginLeft: Dimensions.get('window').width * 0.8

    }

})

export default AdminLogin
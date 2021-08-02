import React, {useState} from 'react'
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, Switch } from 'react-native';
import styles from '../components/LoginStyles' 

const AdminLogin = props => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => {
        props.navigation.navigate({routeName: 'employeeLogin', params: {switchVal1: true}})
    };
    return(
        <KeyboardAvoidingView style = {styles.containerView} behavior = "padding">
            <View>
                <View style={styles.circleNumber1}>

                </View>
                
                <View style={styles.label}>
                    <Text>Admin Login</Text>
                    <Switch
                        trackColor={{ false: "#00E0C7", true: "#006270" }}
                        thumbColor={isEnabled ? "white" : "#006270"}
                        onValueChange={toggleSwitch}
                        value={props.navigation.getParam('switchVal')}
                    />
                    <Text>Employee Login</Text>
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
                        <TextInput style={styles.input} placeholder="Email" autoCorrect={false}/>
                        <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} autoCorrect={false}/>
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
                    <View style={styles.container}>
                        {Dimensions.get('window').height === 1232 ? <Text style={styles.footer}>Zaki Sons</Text> : console.log(Dimensions.get('window').height)}
                    </View>
            </View>
        </KeyboardAvoidingView>
        
        
    )
}

AdminLogin.navigationOptions = () =>{
    return{
        header: null,
        swipeEnabled: false,
    }
}



export default AdminLogin
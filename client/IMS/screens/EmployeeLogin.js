import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, Switch } from 'react-native';
import styles from '../components/LoginStyles'
import { connect } from 'react-redux'
import { login, loadUser } from '../actions/auth'

const EmployeeLogin = props => {
    useEffect(() => {
        props.loadUser(props.navigation)
    }, [])
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => {
        props.navigation.navigate({ routeName: 'Login', params: { switchVal: false } })
    };

    const [userName, setUserName] = useState(``)
    const [password, setPassword] = useState(``)


    const onChangePassword = (pass) => {
        setPassword(pass)
    }


    const onChangeUserName = (userName) => {
        setUserName(userName)
    }

    const login = () => {
        props.login(userName, password, props.navigation, 'employee')
    }


    return (
        <View>
            <KeyboardAvoidingView style={styles.containerView} behavior="padding">
                <View>
                    <View style={styles.circleNumber1}>

                    </View>
                    <View style={styles.label}>
                        <Text style={styles.switch}>A</Text>
                        <Switch
                            trackColor={{ false: "#00E0C7", true: "#006270" }}
                            thumbColor={isEnabled ? "white" : "#00E0C7"}
                            onValueChange={toggleSwitch}
                            value={props.navigation.getParam('switchVal1')}
                        />
                        <Text style={styles.switch}>E</Text>
                    </View>
                    <View style={styles.screen}>
                        <View>
                            <Text style={styles.title}>EMPLOYEE LOGIN</Text>
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
                        <TextInput onChangeText={onChangeUserName} style={styles.input} placeholder="Email" autoCorrect={false} />
                        <TextInput onChangeText={onChangePassword} style={styles.input} placeholder="Password" secureTextEntry={true} autoCorrect={false} />
                        <View >
                            <TouchableOpacity onPress={() => { login() }}>

                                {/* <TouchableOpacity onPress={() => props.navigation.navigate({ routeName: 'EmployeeDashboard' })}> */}
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.buttonText}>Login</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingTop: 20 }}>
                            <Text style={styles.note}>Note: To switch between logins, press the toggle</Text>
                        </View>

                    </View>
                </View>
            </KeyboardAvoidingView>
            <View style={styles.circleNumber4}>

            </View>
            <View style={styles.circleNumber5}>

            </View>
            <View style={styles.container}>
                {Dimensions.get('window').height === 1232 ? <Text style={styles.footer}>Zaki Sons</Text> : console.log(Dimensions.get('window').height)}
            </View>
        </View>


    )
}

EmployeeLogin.navigationOptions = () => {
    return {
        header: null,
        swipeEnabled: false,
    }
}




export default connect(null, { login, loadUser })(EmployeeLogin)
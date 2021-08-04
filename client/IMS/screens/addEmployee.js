
import React, { useState } from 'react'
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, Switch, Keyboard } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
// import DropDownPicker from 'react-native-dropdown-picker';
import {Picker} from '@react-native-picker/picker';



const AddEmployee = props => {

    const [selectedOccupation, setSelectedOccupation] = useState(``);
    const [userName, setUserName] = useState(``)
    const [password, setPassword] = useState(``)


    const onChangePassword = (pass) => {
        setPassword(pass)
        //console.log(pass)
    }


    const onChangeUserName = (userName) => {
        setUserName(userName)
        //console.log(userName)
    }

    const add = () => {
        console.log(password)
        console.log(userName)
        console.log(selectedOccupation)
    }

    return (
        <View style = {styles.container}>
            <View>
                <FontAwesome
                    name = {"user"}
                    size = {120}
                    color = {'#006270'}
                    style = {{right: 1}}
                />
            </View>
            <View>
                <Text style = {styles.title}>Add Employee</Text>
            </View>
            <View>
                <TextInput onChangeText={onChangeUserName} style={styles.input} placeholder="Username" autoCorrect={false} />
                <TextInput onChangeText={onChangePassword} style={styles.input} placeholder="Password" secureTextEntry={true} autoCorrect={false} />
            </View>
            <View>
                <View style={{ borderWidth: 2, borderRadius: 40,borderColor: "#008394",width: Dimensions.get('window').width * 0.65, top: 60, height: 40 }}>
                <Picker
                    // style = {{width: 200, height: 100, top: 28}}
                    style = {{top: 6, color: 'grey', fontSize: 8}}
                    selectedValue={selectedOccupation}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedOccupation(itemValue)
                    }>
                    <Picker.Item label="Manager" value="Manager" fontSize = {8}/>
                    <Picker.Item label="Receptionist" value="Receptionist" />
                </Picker>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => { add() }}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
            
        </View> 
    )

}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: Dimensions.get('window').height / 12,
    }, 
    title: {
        color: '#006270',
        fontSize: 30,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        top: 10,
    },
    forms: {
        top:55,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignContent: 'center',
    },
    input: {
        width: Dimensions.get('window').width * 0.65,
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 40,
        marginBottom:20,
        fontSize: 12,
        borderColor: "#008394",
        top: 60,
        height: 40,
        padding: 10,
    },
    buttonContainer: {
        justifyContent: 'center',
        top: 90,
        borderRadius: 40,
        backgroundColor: '#00E0C7',
        paddingVertical: 12,
        paddingHorizontal: 32,
        // right: Dimensions.get('window').width / 5
        // we can also change the container to center and implement the right styling
    },
    buttonText: {
        fontSize: 26,
        textAlign: 'center',
        color:'white',
        fontWeight: 'bold'
    },
})

AddEmployee.navigationOptions = () => {
    return {
        header: null,
        swipeEnabled: false,
    }
}


export default AddEmployee
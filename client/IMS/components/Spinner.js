import React from 'react'
import { View, Image, StyleSheet } from 'react-native'

const Spinner = ({ loading }) => {
    return (

        <View style={styles.spinnerContainer} >
            {loading && <Image style={styles.spinner} source={require('../assets/spinner.gif')} />}
        </View >
    )
}

const styles = StyleSheet.create({
    spinnerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        top: 50
    },
    spinner: {
        height: 50,
        width: 50
    },
})


export default Spinner
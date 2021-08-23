import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, Button, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { connect } from 'react-redux'
import { setPurchasePayment, resetPurchasePayment } from '../../actions/purchaseFilters';
import { setSalePayment, resetSalePayment } from "../../actions/saleFilters";
const PaymentTypeFilterModal = props => {

    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setModalVisible(props.state);
    }, [props.state]);

    function handleClose() {
        setModalVisible(false);
    }

    const setPaymentType = (record) => {
        if(props.title === "purchase"){
            props.setPurchasePayment(record)
        }
        else if(props.title === "sale"){
            props.setSalePayment(record)
        }
        

    }

    const clearPaymentType = () => {
        if(props.title === "purchase"){
            props.resetPurchasePayment()
        }
        if(props.title === "sale"){
            props.resetSalePayment()
        }
    }
    return (

        <View style={styles.centeredView}>
            <Modal
                // animationType="fade"
                onSwipeComplete={() => setModalVisible(false)}
                swipeDirection="left"
                presentationStyle="overFullScreen"
                transparent
                visible={modalVisible}>
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.modalStyle}>
                            
                        <View style={styles.topTextBox}>
                            <View style= {{flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center'}}>
                                <TouchableOpacity onPress = {() => props.handleClose()} style = {{marginTop: Dimensions.get('window').height > 900 ? '7%':'7%', paddingLeft: '5%'}}>
                                    <FontAwesome
                                    name = {"arrow-left"}
                                    size = {Dimensions.get('window').height > 900 ? 40:25}
                                    color = {"#008394"}
                                    />
                                </TouchableOpacity>
                                
                                <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginTop: '6.25%',}}>
                                
                                    <Text style={styles.topText}>
                                        Payment Type
                                    </Text>
                                </View>
                                <View style = {{justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                    <TouchableOpacity onPress={() => clearPaymentType()}>
                                        <View style = {styles.clearButton}>
                                            <Text style = {styles.clearButtonText}>
                                                Clear 
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                        
                                </View>
                            </View>
                            
                        </View>
                        
                        <View>

                            <TouchableOpacity style = {styles.TextBox} onPress = {() => setPaymentType("Partial")}>
                                <View style={{ paddingLeft: '5%' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-start' }}>
                                            <Text style={styles.normalText}>
                                                Partial
                                            </Text>
                                        </View>
                                        <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                            <View style={styles.sideText}>
                                            {props.title === "purchase" && props.paymentType === "Partial" ? (<FontAwesome
                                                    name = {"check"}
                                                    size = {Dimensions.get('window').height > 900 ? 40:25}
                                                    color = {"#008394"}
                                                    />
                                            ) : (null)}
                                            {props.title === "sale" && props.salePaymentType === "Partial" ? (<FontAwesome
                                                    name = {"check"}
                                                    size = {Dimensions.get('window').height > 900 ? 40:25}
                                                    color = {"#008394"}
                                                    />
                                            ) : (null)}

                                            
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>


                       
                        </View>

                        <View>

                            <TouchableOpacity style = {styles.TextBox} onPress = {() => setPaymentType("Credit")}>
                                <View style={{ paddingLeft: '5%' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-start' }}>
                                            <Text style={styles.normalText}>
                                                Credit
                                            </Text>
                                        </View>
                                        <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                            <View style={styles.sideText}>
                                            {props.title === "purchase" && props.paymentType === "Credit" ? (<FontAwesome
                                                    name = {"check"}
                                                    size = {Dimensions.get('window').height > 900 ? 40:25}
                                                    color = {"#008394"}
                                                    />
                                            ) : (null)}
                                            {props.title === "sale" && props.salePaymentType === "Credit" ? (<FontAwesome
                                                    name = {"check"}
                                                    size = {Dimensions.get('window').height > 900 ? 40:25}
                                                    color = {"#008394"}
                                                    />
                                            ) : (null)}
                                            
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>


                       
                        </View>

                        <View>

                            <TouchableOpacity style = {styles.TextBox} onPress = {() => setPaymentType("Full")}>
                                <View style={{ paddingLeft: '5%' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-start' }}>
                                            <Text style={styles.normalText}>
                                                Full
                                            </Text>
                                        </View>
                                        <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                            <View style={styles.sideText}>
                                            {props.title === "purchase" && props.paymentType === "Full" ? (<FontAwesome
                                                    name = {"check"}
                                                    size = {Dimensions.get('window').height > 900 ? 40:25}
                                                    color = {"#008394"}
                                                    />
                                            ) : (null)}
                                            {props.title === "sale" && props.salePaymentType === "Full" ? (<FontAwesome
                                                    name = {"check"}
                                                    size = {Dimensions.get('window').height > 900 ? 40:25}
                                                    color = {"#008394"}
                                                    />
                                            ) : (null)}
                                            
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>


                       
                        </View>


                       
                    </View>
                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    modalStyle: {
        backgroundColor: "#fff",
        width: '80%',
        height: '100%',
        alignSelf: 'flex-end',
        borderWidth: 2,
        borderColor: "#008394",
    },
    topText: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height > 900 ? 36:24,
        color: "#008394",
    },
    normalText: {
        fontSize: Dimensions.get('window').height > 900 ? 26:18,
        fontWeight: '600',
        color: "#008394",

    },
    sideText: {
        textAlign: 'right',
        alignItems: 'flex-end',
        flexDirection: 'row',
        ///alignSelf: 'flex-end',
        //alignItems: 'flex-end',
        // marginLeft: '65%',
    },
    topTextBox: {
        width: '100%',
        height: '10%',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 22,
        shadowRadius: 10,
        elevation: 10,
    },
    TextBox: {
        width: '100%',
        padding: 20,
        // height: '22%',
        shadowColor: '#000000',
        backgroundColor: '#fff',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2,
        marginTop: 1,
    },
    bottomBox: {
        width: '100%',
        height: '100%',
        backgroundColor: '#D3D3D3',
        alignItems: 'center',

    },
    bottomButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00E0C7',
        width: '100%',
        // marginTop: '40%',
        height: Dimensions.get('window').height * 0.08,
        borderWidth: 2,
        borderRadius: 20,
        marginBottom: 20,
        borderColor: "#008394"

    },
    footerText: {
        fontSize: Dimensions.get('window').height > 900 ? 36:22,
        fontWeight: 'bold',
        color: "#008394",

    },
    clearButtonText :{
        fontSize: Dimensions.get('window').height > 900 ? 26:16,
        fontWeight: 'bold',
        color: "#008394",
    },
    clearButton : {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00E0C7',
        width: Dimensions.get('window').height > 900 ? 100:70,
        height: Dimensions.get('window').height > 900 ? 50:30,
        borderWidth: 2,
        borderRadius: 20,
        borderColor: "#008394",
        marginTop: Dimensions.get('window').height > 900 ? 30: 0,
        // left: Dimensions.get('window').width * 0.4,

    },
    sliderDummy: {
        backgroundColor: '#d3d3d3',
        width: 300,
        height:30,
        borderRadius: 50,
        position: 'absolute',                
    },
    sliderReal: {
        backgroundColor: '#119EC2',
        // width: {(amountVal/50) * 300},
        height:30,
    }

});

const mapStateToProps = (state) => {
    console.log(state.productFilters)
    return {
        paymentType: state.purchaseFilters.payment,
        salePaymentType: state.saleFilters.payment
    }
}

export default connect(mapStateToProps, { setPurchasePayment, resetPurchasePayment, setSalePayment, resetSalePayment })(PaymentTypeFilterModal);
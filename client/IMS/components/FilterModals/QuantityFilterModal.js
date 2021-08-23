import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, Button, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { connect } from 'react-redux'
import { setProdQuant,resetProdQuant } from '../../actions/productFilters'
import { setPurchaseEMaxQuant, resetPurchaseMaxQuant } from '../../actions/purchaseFilters'
import { setSaleMaxQuant, resetSaleMaxQuant } from "../../actions/saleFilters"; 
import Slider from '@react-native-community/slider';
const QuantityFilterModal = props => {

    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setModalVisible(props.state);
    }, [props.state]);

    function handleClose() {
        setModalVisible(false);
    }
    const setQuantity = (sliderValue) => {
        if (props.title === "product"){
            props.setProdQuant(sliderValue);
        }
        else if(props.title === "purchase"){
            props.setPurchaseEMaxQuant(sliderValue);
        }
        else if(props.title === "sale"){
            props.setSaleMaxQuant(sliderValue);
        }
    }

    const clearQuantity = () => {
        if (props.title === "product"){
            props.resetProdQuant()
        }
        else if(props.title === "purchase"){
            props.resetPurchaseMaxQuant()
        }
        else if(props.title === "sale"){
            props.resetSaleMaxQuant()
        }
        
    }
    const showQuantity = () => {
        if(props.maxStock !== undefined && props.title === "product"){
            return (
                <View style={styles.container}>
                    <Text style = {styles.normalText}>
                    Value of slider is : {props.quantFilter}
                    </Text>

                    <Slider
                    maximumValue={props.maxStock}
                    minimumValue={0}
                    minimumTrackTintColor="#008394"
                    maximumTrackTintColor="#000000"
                    step={1}
                    value={ props.quantFilter === '*' ? 0: props.quantFilter}
                        
                    onValueChange={
                        (sliderValue) => setQuantity(sliderValue)
                    }
                    />
                </View>
            )
       }
       else if(props.maxStock !== undefined && props.title === "purchase"){
        return (
            <View style={styles.container}>
                <Text style = {styles.normalText}>
                Value of slider is : {props.quantPurchaseFilter}
                </Text>

                <Slider
                maximumValue={props.maxStock}
                minimumValue={0}
                minimumTrackTintColor="#008394"
                maximumTrackTintColor="#000000"
                step={1}
                value={ props.quantPurchaseFilter === '*' ? 0: props.quantPurchaseFilter}
                    
                onValueChange={
                    (sliderValue) => setQuantity(sliderValue)
                }
                />
            </View>
        )
       }
       else if(props.maxStock !== undefined && props.title === "sale"){
            return (
                <View style={styles.container}>
                    <Text style = {styles.normalText}>
                    Value of slider is : {props.quantSaleFilter}
                    </Text>

                    <Slider
                    maximumValue={props.maxStock}
                    minimumValue={0}
                    minimumTrackTintColor="#008394"
                    maximumTrackTintColor="#000000"
                    step={1}
                    value={ props.quantSaleFilter === '*' ? 0: props.quantSaleFilter}
                        
                    onValueChange={
                        (sliderValue) => setQuantity(sliderValue)
                    }
                    />
                </View>
            )
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
                                        Quantity
                                    </Text>
                                </View>
                                <View style = {{justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                    <TouchableOpacity onPress = {() => clearQuantity()}>
                                        <View style = {styles.clearButton}>
                                            <Text style = {styles.clearButtonText}>
                                                Clear 
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                        
                                </View>
                            </View>
                            
                        </View>
                        
                        {
                            showQuantity()
                        }
                   

                       
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
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },

});

const mapStateToProps = (state) => {
    console.log(state.productFilters)
    return {
        quantFilter: state.productFilters.quantity,
        quantPurchaseFilter: state.purchaseFilters.maxQuantity,
        quantSaleFilter: state.saleFilters.maxQuantity
    }
}

export default connect(mapStateToProps, { setProdQuant,resetProdQuant, setPurchaseEMaxQuant, resetPurchaseMaxQuant, setSaleMaxQuant, resetSaleMaxQuant, setSaleMaxQuant, resetSaleMaxQuant   })(QuantityFilterModal);
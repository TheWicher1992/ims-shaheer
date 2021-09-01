import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, TouchableWithoutFeedback, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Slider from '@react-native-community/slider';
import { connect } from 'react-redux'
import { setProdPrice, resetProdPrice } from '../../actions/productFilters'
import { setPurchaseMaxTotal, resetPurchaseMaxTotal } from "../../actions/purchaseFilters";
import { setSaleMaxTotal, resetSaleMaxTotal } from "../../actions/saleFilters";

const PriceFilterModal = props => {

    const [modalVisible, setModalVisible] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [valueSales,setValueSales] = useState(0)
    const [valuePurchases,setValuePurchases] = useState(0)
    const [valueProducts,setValueProducts] = useState(0)

    const onChangeValueSales = (val) => {
        setValueSales(val)
    }
    const onChangeValueProduct = (val) => {
        setValueProducts(val)
    }
    const onChangeValuePurchases = (val) => {
        setValuePurchases(val)
    }

    useEffect(() => {
        setModalVisible(props.state);
    }, [props.state]);

    function handleClose() {
        setModalVisible(false);
    }

    const setPrice = () => {
        if(props.title === "product" && valueProducts !== 0){
            props.setProdPrice(valueProducts);
        }
        else if(props.title === "purchase" && valuePurchases !== 0){
            props.setPurchaseMaxTotal(valuePurchases);
        }
        else if(props.title === "sale" && valueSales !== 0){
            props.setSaleMaxTotal(valueSales);
        }
    }

    const clearPrice = () => {
        if(props.title === "product"){
            props.resetProdPrice()
            setValueProducts(0)
        }
        else if(props.title === "purchase"){
            props.resetPurchaseMaxTotal()
            setValuePurchases(0)
        }
        else if(props.title === "sale"){
            props.resetPurchaseMaxTotal()
            setValueSales(0)
        }


    }

    const getPrice = () => {
        if (props.maxPrice !== undefined && props.title === "product") {
            return (
                <View style={styles.container}>
                    {/*Text to show slider value*/}
                    <Text style={styles.normalText}>
                        Value applied is : {props.priceFilter}
                    </Text>

                    <View style = {{marginTop: 20}}>
                        <TextInput onChangeText = {onChangeValueProduct} placeholder = "quantity" style = {styles.input}></TextInput>
                    </View> 

                    <View style = {{justifyContent: 'center', alignContent:'center'}}>
                        <TouchableOpacity onPress = {() => setQuantity()}>
                            <View style = {styles.clearButton}>
                                <Text style = {styles.clearButtonText}>
                                    Apply
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else if (props.maxPrice !== undefined && props.title === "purchase") {
            return (
                <View style={styles.container}>
                    {/*Text to show slider value*/}
                    <Text style={styles.normalText}>
                        Value applied is : {props.pricePurchaseFilter}
                    </Text>
                    <View style = {{marginTop: 20}}>
                        <TextInput onChangeText = {onChangeValuePurchases} placeholder = "quantity" style = {styles.input}></TextInput>
                    </View> 

                    <View style = {{justifyContent: 'center', alignContent:'center'}}>
                        <TouchableOpacity onPress = {() => setPrice()}>
                            <View style = {styles.clearButton}>
                                <Text style = {styles.clearButtonText}>
                                    Apply
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else if (props.maxPrice !== undefined && props.title === "sale") {
            return (
                <View style={styles.container}>
                    {/*Text to show slider value*/}
                    <Text style={styles.normalText}>
                        Value applied is : {props.priceSaleFilter}
                    </Text>

                    <View style = {{marginTop: 20}}>
                        <TextInput onChangeText = {onChangeValueSales} placeholder = "quantity" style = {styles.input}></TextInput>
                    </View> 

                    <View style = {{justifyContent: 'center', alignContent:'center'}}>
                        <TouchableOpacity onPress = {() => setPrice()}>
                            <View style = {styles.clearButton}>
                                <Text style = {styles.clearButtonText}>
                                    Apply
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
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
                    <TouchableWithoutFeedback onPress={() => props.handleClose()}>
                        <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.modalStyle}>

                        <View style={styles.topTextBox}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center',  marginTop: Dimensions.get('window').height * 0.03 }}>
                                <TouchableOpacity onPress={() => props.handleClose()} style={{ marginTop: Dimensions.get('window').height>900 ? 10:5, paddingLeft: '5%' }}>
                                    <FontAwesome
                                        name={"arrow-left"}
                                        size={Dimensions.get('window').height > 900 ? 40 : 25}
                                        color={"#008394"}
                                    />
                                </TouchableOpacity>

                                <View style={{ justifyContent: 'center', alignItems: 'flex-start', }}>

                                    <Text style={styles.topText}>
                                        Price
                                    </Text>
                                </View>
                                <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                    <TouchableOpacity onPress={() => clearPrice()}>
                                        <View style={styles.clearButton}>
                                            <Text style={styles.clearButtonText}>
                                                Clear
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>
                            </View>

                        </View>


                        {
                            getPrice()
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
        fontSize: Dimensions.get('window').height > 900 ? 36 : 24,
        color: "#008394",
    },
    normalText: {
        fontSize: Dimensions.get('window').height > 900 ? 26 : 18,
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
        fontSize: Dimensions.get('window').height > 900 ? 36 : 22,
        fontWeight: 'bold',
        color: "#008394",

    },
    clearButtonText: {
        fontSize: Dimensions.get('window').height > 900 ? 26 : 16,
        fontWeight: 'bold',
        color: "#008394",
    },
    clearButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00E0C7',
        width: Dimensions.get('window').height > 900 ? 100 : 70,
        height: Dimensions.get('window').height > 900 ? 50 : 30,
        borderWidth: 2,
        borderRadius: 20,
        borderColor: "#008394",
        marginTop: Dimensions.get('window').height > 900 ? 10 : 0,
        // left: Dimensions.get('window').width * 0.4,

    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    input: {
        width: Dimensions.get('window').width * 0.65,
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 40,
        marginBottom: 20,
        fontSize: 15,
        borderColor: "#008394",
        height: 40,
        padding: 10,
      },

});

const mapStateToProps = (state) => {
    // console.log(state.productFilters)
    return {
        priceFilter: state.productFilters.price,
        pricePurchaseFilter: state.purchaseFilters.maxTotal,
        priceSaleFilter: state.saleFilters.maxTotal
    }
}

export default connect(mapStateToProps, { setProdPrice, resetProdPrice,setPurchaseMaxTotal, resetPurchaseMaxTotal, setSaleMaxTotal, resetSaleMaxTotal  })(PriceFilterModal);
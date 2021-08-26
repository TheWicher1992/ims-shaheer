import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, Button } from "react-native";
import DateFilterModal from "./FilterModals/DateFilterModal";
import ClientFilterModal from "./FilterModals/ClientFilterModal";
import ProductNameFilterModal from "./FilterModals/ProductNameFilterModal";
import QuantityFilterModal from "./FilterModals/QuantityFilterModal";
import PriceFilterModal from "./FilterModals/PriceFilterModal";
import PaymentTypeFilterModal from "./FilterModals/PaymentTypeFilterModal";
import { uri } from '../api.json'
import axios from "axios"
import { connect } from 'react-redux'
import { clearSaleFilters } from "../actions/saleFilters";


const SaleFilterModal = props => {

    const [modalVisible, setModalVisible] = useState(false);
    const [clientFilterModal, setClientFilterModal] = useState(false);
    const [dateFilterModal, setDateFilterModal] = useState(false);
    const [productNameFilterModal, setProductNameFilterModal] = useState(false);
    const [quantityFilterModal, setQuantityFilterModal] = useState(false);
    const [priceFilterModal, setPriceFilterModal] = useState(false);
    const [paymentTypeFilterModal, setPaymentTypeFilterModal] = useState(false);
    useEffect(() => {
        setModalVisible(props.state);
    }, [props.state]);

    function handleClose() {
        setModalVisible(false);
    }

    const closeClientFilterModal = () => {
        setClientFilterModal(false);
    }
    const closeDateFilterModal = () => {
        setDateFilterModal(false);
    }
    const closeProductNameFilterModal = () => {
        setProductNameFilterModal(false);
    }
    const closeQuantityFilterModal = () => {
        setQuantityFilterModal(false);
    }
    const closePriceFilterModal = () => {
        setPriceFilterModal(false);
    }
    const closePaymentTypeFilterModal = () => {
        setPaymentTypeFilterModal(false);
    }
    const [filterMap, setFilterMap] = useState({
        clients: {},
        products: {}
    })
    const [filters, setFilters] = useState([])

    const getFilters = async () => {
        try{

        
        const res = await axios.get(
            `${uri}/api/sale/filters`
        )
        setFilters(res.data.filters);

        const productMap = {}
        res.data.filters.products.forEach(p => {
            productMap[p._id] = p.title
        })

        const clientMap = {}
        res.data.filters.clients.forEach(c => {
            clientMap[c._id] = c.userName
        })

        setFilterMap({
            clients: {
                ...clientMap
            },
            products: {
                ...productMap
            }
        })
    } 
    catch(err) {
        catchWarning()
    }
        
    }
    const catchWarning = () => {
        setAlertState(!alertState) 
        setAlertTitle('Attention')
        setAlertMsg('Something went wrong. Please restart')
    }


    useEffect(() => {
        getFilters()
    }, [])
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
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginTop: '6.25%', paddingLeft: '5%' }}>
                                    <Text style={styles.topText}>
                                        Filter
                                    </Text>
                                </View>
                                <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                    <TouchableOpacity onPress={props.clearSaleFilters}>
                                        <View style={styles.clearButton}>
                                            <Text style={styles.clearButtonText}>
                                                Clear
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>
                            </View>

                        </View>


                        <TouchableOpacity style={styles.TextBox} onPress={() => setProductNameFilterModal(true)}>
                            <View style={{ marginTop: '9.5%', paddingLeft: '5%' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-start' }}>
                                        <Text style={styles.normalText}>
                                            Products
                                        </Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                        <Text style={styles.sideText}>
                                            {props.filters.product.length === 1 && 'All'}
                                            {
                                                props.filters.product.length !== 1 && 
                                                <Text style = {styles.sideText}>
                                                    {`(${props.filters.product.length -1}) Item(s)`}
                                                    </Text>
                                            }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>




                        <TouchableOpacity style={styles.TextBox} onPress={() => setClientFilterModal(true)}>
                            <View style={{ marginTop: '9.5%', paddingLeft: '5%' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-start' }}>
                                        <Text style={styles.normalText}>
                                            Clients
                                        </Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                        <Text style={styles.sideText}>
                                            {props.filters.client.length === 1 && 'All'}
                                            {
                                                props.filters.client.length !== 1 && 
                                                <Text style = {styles.sideText}>
                                                    {`(${props.filters.client.length -1}) Item(s)`}
                                                    </Text>
                                            }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity style={styles.TextBox} onPress={() => setPaymentTypeFilterModal(true)}>
                            <View style={{ marginTop: '9.5%', paddingLeft: '5%' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-start' }}>
                                        <Text style={styles.normalText}>
                                            Payment Type
                                        </Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                        <Text style={styles.sideText}>
                                            {props.filters.payment === '*' ? 'All' : props.filters.payment}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.TextBox} onPress={() => setDateFilterModal(true)}>
                            <View style={{ marginTop: '9.5%', paddingLeft: '5%' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-start' }}>
                                        <Text style={styles.normalText}>
                                            Date
                                        </Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                        <Text style={styles.sideText}>
                                            {props.filters.date === '*' ? 'All' : props.filters.date}

                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.TextBox} onPress={() => setQuantityFilterModal(true)}>
                            <View style={{ marginTop: '9.5%', paddingLeft: '5%' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-start' }}>
                                        <Text style={styles.normalText}>
                                            Quantity
                                        </Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                        <Text style={styles.sideText}>
                                            {props.filters.maxQuantity === '*' ? 'All' : props.filters.maxQuantity}

                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.TextBox} onPress={() => setPriceFilterModal(true)}>
                            <View style={{ marginTop: '9.5%', paddingLeft: '5%' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-start' }}>
                                        <Text style={styles.normalText}>
                                            Amount
                                        </Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                        <Text style={styles.sideText}>
                                            {props.filters.maxTotal === '*' ? 'All' : props.filters.maxTotal}

                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.bottomBox}>
                            <TouchableOpacity onPress={() => { props.handleClose() ; props.getSales() }} style={{ width: '90%', position: "absolute", top: '5%' }}>
                                <View style={styles.bottomButton}>
                                    <View>
                                        <Text style={styles.footerText}>
                                            View Sales
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>


                    </View>
                </View>
            </Modal>
            <DateFilterModal state={dateFilterModal} handleClose={closeDateFilterModal} title="sale" />
            <ClientFilterModal state={clientFilterModal} handleClose={closeClientFilterModal} object={filters.clients} title="sale" />
            <ProductNameFilterModal state={productNameFilterModal} handleClose={closeProductNameFilterModal} object={filters.products} title="sale" />
            <QuantityFilterModal state={quantityFilterModal} handleClose={closeQuantityFilterModal} title="sale" maxStock={filters.maxQuantity} />
            <PriceFilterModal state={priceFilterModal} handleClose={closePriceFilterModal} title="sale" maxPrice={filters.maxTotal} />
            <PaymentTypeFilterModal state={paymentTypeFilterModal} handleClose={closePaymentTypeFilterModal} title = "sale" />
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
        fontSize: Dimensions.get('window').height > 900 ? 26 : 18,
        fontWeight: '600',
        color: "#008394",
        textAlign: 'right',
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
        height: '12%',
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
        marginTop: Dimensions.get('window').height > 900 ? 30 : 0,
        // left: Dimensions.get('window').width * 0.4,

    }

});

const mapStateToProps = (state) => ({
    filters: state.saleFilters
})
export default connect(mapStateToProps, { clearSaleFilters })(SaleFilterModal);
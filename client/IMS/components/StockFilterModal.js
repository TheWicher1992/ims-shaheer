import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, TouchableWithoutFeedback } from "react-native";
import WarehouseFilterModal from "./FilterModals/WarehouseFilterModal";
import QuantityFilterModal from "./FilterModals/QuantityFilterModal";
import ProductNameFilterModal from "./FilterModals/ProductNameFilterModal";
import { uri } from '../api.json'
import axios from "axios"
import { connect } from "react-redux";
import { clearSTOCKFilters } from "../actions/stockFilters";


const StockFilterModal = props => {

    const [modalVisible, setModalVisible] = useState(false);
    const [productNameFilterModal, setProductNameFilterModal] = useState(false);
    const [warehouseFilterModal, setWarehouseFilterModal] = useState(false);
    const [quantityFilterModal, setQuantityFilterModal] = useState(false);
    useEffect(() => {
        setModalVisible(props.state);

    }, [props.state]);

    function handleClose() {
        setModalVisible(false);
    }

   
    const closeWarehouseFilterModal = () => {
        setWarehouseFilterModal(false);
    }
    const closeQuantityFilterModal = () => {
        setQuantityFilterModal(false);
    }
    const closeProductNameFilterModal = () => {
        setProductNameFilterModal(false);
    }
    const clearAll = () => {
        props.clearSTOCKFilters()
    }

    const [filters, setFilters] = useState([]) // for warehouses and max stock

    const getFilters = async () => { // for warehouses and max stock 
        try{
            const res = await axios.get(
                `${uri}/api/product/filters`
            )
            setFilters(res.data.filters);
    
        }
        catch(err){
            catchWarning()
        }
        
    }

    const [filtersProductName, setFilterProductName] = useState([]) //for product names 

    const getFiltersProductName = async () => { //for product names
        try{
        const res = await axios.get(
            `${uri}/api/sale/filters`
        )
        setFilterProductName(res.data.filters);
        } 
        catch(err) {
            catchWarning()
        }
        
    }



    useEffect(() => {
        getFilters()
        getFiltersProductName()
    }, [])

    const [alertState, setAlertState] = useState(false)
    const [alertTitle, setAlertTitle] = useState(``)
    const [alertMsg, setAlertMsg] = useState(``)

    const catchWarning = () => {
        setAlertState(!alertState) 
        setAlertTitle('Attention')
        setAlertMsg('Something went wrong. Please restart')
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
                    <TouchableWithoutFeedback onPress={() => {props.handleClose(); props.getStock()}}>
                        <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.modalStyle}>

                        <View style={styles.topTextBox}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginTop: Dimensions.get('window').height * 0.03, paddingLeft: '5%' }}>
                                    <Text style={styles.topText}>
                                        Filter
                                    </Text>
                                </View>
                                <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                    <TouchableOpacity onPress={() => clearAll()}>
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
                            <View style={{ marginTop: Dimensions.get('window').height * 0.05, paddingLeft: '5%' }}>
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


                        <TouchableOpacity style={styles.TextBox} onPress={() => setQuantityFilterModal(true)}>
                            <View style={{ marginTop: Dimensions.get('window').height * 0.05, paddingLeft: '5%' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-start' }}>
                                        <Text style={styles.normalText}>
                                            Stock
                                        </Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                        <Text style={styles.sideText}>
                                            {props.filters.stock === '*' ? 'All' : props.filters.stock}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.TextBox} onPress={() => setWarehouseFilterModal(true)}>
                            <View style={ {marginTop: Dimensions.get('window').height * 0.05, paddingLeft: '5%' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-start' }}>
                                        <Text style={styles.normalText}>
                                            Warehouses
                                        </Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                        {
                                            props.filters.ware.length === 1 ? (<Text style={styles.sideText}>
                                                All
                                            </Text>)
                                            : (
                                                <Text style = {styles.sideText}>
                                                    {`(${props.filters.ware.length -1}) Item(s)`}
                                                </Text>
                                            )
                                        }
                                        
                                       
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.bottomBox}>
                            <TouchableOpacity onPress={() => { props.handleClose(); props.getStock() }} style={{ width: '90%', position: "absolute", top: '40%' }}>
                                <View style={styles.bottomButton}>
                                    <View>
                                        <Text style={styles.footerText}>
                                            View Stock
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>


                    </View>
                </View>
            </Modal>
            <WarehouseFilterModal state={warehouseFilterModal} handleClose={closeWarehouseFilterModal} title="stock" object={filters.warehouses} />
            <QuantityFilterModal state={quantityFilterModal} handleClose={closeQuantityFilterModal} title="stock" maxStock={filters.maxStock} />
            <ProductNameFilterModal state={productNameFilterModal} handleClose={closeProductNameFilterModal} object={filtersProductName.products} title="stock" />
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

    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },

});

const mapStateToProps = (state) => {
    console.log("stock filterS" , state.stockFilters)
    return {
        filters: state.stockFilters
    }
}

export default connect(mapStateToProps, { clearSTOCKFilters })(StockFilterModal);
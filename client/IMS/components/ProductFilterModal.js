import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, Button } from "react-native";
import ColorFilterModal from "./FilterModals/ColorFilterModal";
import BrandFilterModal from "./FilterModals/BrandFilterModal";
import WarehouseFilterModal from "./FilterModals/WarehouseFilterModal";
import DateFilterModal from "./FilterModals/DateFilterModal";
import QuantityFilterModal from "./FilterModals/QuantityFilterModal";
import PriceFilterModal from "./FilterModals/PriceFilterModal";
import { uri } from '../api.json'
import axios from "axios"
import { connect } from "react-redux";
import { clearProductFilters } from "../actions/productFilters";


const ProductFilterModal = props => {

    const [modalVisible, setModalVisible] = useState(false);
    const [colorFilterModal, setColorFilterModal] = useState(false);
    const [filterMap, setFilterMap] = useState({
        colour: {},
        warehouse: {},
        brand: {},
    })
    const [brandFilterModal, setBrandFilterModal] = useState(false);
    const [warehouseFilterModal, setWarehouseFilterModal] = useState(false);
    const [dateFilterModal, setDateFilterModal] = useState(false);
    const [quantityFilterModal, setQuantityFilterModal] = useState(false);
    const [priceFilterModal, setPriceFilterModal] = useState(false);
    useEffect(() => {
        setModalVisible(props.state);

    }, [props.state]);

    function handleClose() {
        setModalVisible(false);
    }

    const closeColorFilterModal = () => {
        setColorFilterModal(false);
    }
    const closeBrandFilterModal = () => {
        setBrandFilterModal(false);
    }
    const closeWarehouseFilterModal = () => {
        setWarehouseFilterModal(false);
    }
    const closeDateFilterModal = () => {
        setDateFilterModal(false);
    }
    const closeQuantityFilterModal = () => {
        setQuantityFilterModal(false);
    }
    const closePriceFilterModal = () => {
        setPriceFilterModal(false);
    }
    const clearAll = () => {
        props.clearProductFilters()
    }

    const [filters, setFilters] = useState([])

    const getFilters = async () => {
        const res = await axios.get(
            `${uri}/api/product/filters`
        )
        setFilters(res.data.filters);
        console.log("res--->", res.data.filters)
        let colourMap = {};
        (res.data.filters.colours).forEach(element => {
            colourMap[element._id] = element.title
        });
        console.log(colourMap)
        // setFilterMap({...filterMap,colour : {
        //     ...colourMap
        // }})

        let wareMap = {};
        (res.data.filters.warehouses).forEach(element => {
            wareMap[element._id] = element.name
        });
        // setFilterMap({...filterMap,warehouse : {
        //     ...wareMap
        // }})
        console.log(wareMap)

        let brandMap = {};
        (res.data.filters.brands).forEach(element => {
            brandMap[element._id] = element.title
        });
        // setFilterMap({...filterMap,brand : {
        //     ...brandMap
        // }})      
        console.log(brandMap)

        setFilterMap(
            {
                colour: {
                    ...colourMap
                },
                warehouse: {
                    ...wareMap
                },
                brand: {
                    ...brandMap
                }
            }
        )

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


                        <TouchableOpacity style={styles.TextBox} onPress={() => setColorFilterModal(true)}>
                            <View style={{ marginTop: '9.5%', paddingLeft: '5%' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-start' }}>
                                        <Text style={styles.normalText}>
                                            Color
                                        </Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>

                                        {
                                            props.filters.colour.map((record, i) => (
                                                <Text style={styles.sideText}>
                                                    {filterMap["colour"][record]}
                                                </Text>
                                            ))
                                        }
                                        {
                                            props.filters.colour.length === 1 && (<Text style={styles.sideText}>
                                                All
                                            </Text>)
                                        }
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>




                        <TouchableOpacity style={styles.TextBox} onPress={() => setBrandFilterModal(true)}>
                            <View style={{ marginTop: '9.5%', paddingLeft: '5%' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-start' }}>
                                        <Text style={styles.normalText}>
                                            Brand
                                        </Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                        {
                                            props.filters.brand.map((record, i) => (
                                                <Text style={styles.sideText}>
                                                    {filterMap["brand"][record]}
                                                </Text>
                                            ))
                                        }
                                        {
                                            props.filters.brand.length === 1 && (<Text style={styles.sideText}>
                                                All
                                            </Text>)
                                        }
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity style={styles.TextBox} onPress={() => setPriceFilterModal(true)}>
                            <View style={{ marginTop: '9.5%', paddingLeft: '5%' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-start' }}>
                                        <Text style={styles.normalText}>
                                            Price
                                        </Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                        <Text style={styles.sideText}>
                                            {props.filters.price}
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
                                            {/* {props.filters.date} */}
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
                                            {props.filters.quantity === '*' ? 'All' : props.filters.quantity}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.TextBox} onPress={() => setWarehouseFilterModal(true)}>
                            <View style={{ marginTop: '9.5%', paddingLeft: '5%' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-start' }}>
                                        <Text style={styles.normalText}>
                                            Warehouse
                                        </Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%' }}>
                                        {
                                            props.filters.ware.map((record, i) => (
                                                <Text style={styles.sideText}>
                                                    {filterMap["warehouse"][record]}
                                                </Text>
                                            ))
                                        }
                                        {
                                            props.filters.ware.length === 1 && (<Text style={styles.sideText}>
                                                All
                                            </Text>)
                                        }
                                        {/* {
                                            console.log(filterMap)
                                        } */}
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.bottomBox}>
                            <TouchableOpacity onPress={() => { props.handleClose(); props.getProducts() }} style={{ width: '90%', position: "absolute", top: '5%' }}>
                                <View style={styles.bottomButton}>
                                    <View>
                                        <Text style={styles.footerText}>
                                            View Products
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>


                    </View>
                </View>
            </Modal>
            <ColorFilterModal state={colorFilterModal} handleClose={closeColorFilterModal} title="product" object={filters.colours} />
            <BrandFilterModal state={brandFilterModal} handleClose={closeBrandFilterModal} title="product" object={filters.brands} />
            <WarehouseFilterModal state={warehouseFilterModal} handleClose={closeWarehouseFilterModal} title="product" object={filters.warehouses} />
            <DateFilterModal state={dateFilterModal} handleClose={closeDateFilterModal} title="product" />
            <QuantityFilterModal state={quantityFilterModal} handleClose={closeQuantityFilterModal} title="product" maxStock={filters.maxStock} />
            <PriceFilterModal state={priceFilterModal} handleClose={closePriceFilterModal} title="product" maxPrice={filters.maxPrice} />

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
        fontSize: Dimensions.get('window').height > 900 ? 24 : 16,
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

const mapStateToProps = (state) => {
    console.log(state.productFilters)
    return {
        filters: state.productFilters
    }
}

export default connect(mapStateToProps, { clearProductFilters })(ProductFilterModal);
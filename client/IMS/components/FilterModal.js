import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, Button } from "react-native";

const FilterModal = props => {

  const [modalVisible, setModalVisible] = useState(false);
  

  useEffect(() => {
    setModalVisible(props.state);
  }, [props.state]);

  function handleClose() {
    setModalVisible(false);
  }
  return (
    
    <View style={styles.centeredView}>
        <Modal
            animationType="fade"
            onSwipeComplete={() => setModalVisible(false)}
            swipeDirection="left"
            presentationStyle="overFullScreen"
            transparent
            visible={modalVisible}> 
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <View style = {styles.modalStyle}>
                <View style = {styles.topTextBox}>
                    <View style = {{justifyContent: 'center', alignItems: 'flex-start', marginTop: '6.25%', paddingLeft: '5%'}}>
                        <Text style = {styles.topText}>
                            Filter
                        </Text>
                    </View>
                </View>
                    
                <View style = {styles.TextBox}>
                    <View style = {{marginTop: '9.5%', paddingLeft: '5%'}}>
                        <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-start'}}>
                            <Text style = {styles.sideText}>
                                Colors
                            </Text>
                            </View>
                            <View style={{justifyContent: 'space-evenly', flexDirection: 'row', alignSelf: 'flex-end', paddingRight: '8%'}}>
                            <Text style = {styles.sideText}>
                                All
                            </Text>
                            </View>
                            
                        </View>
                        
                    </View>
                </View>

                <View style = {styles.TextBox}>
                    <View style = {{justifyContent: 'center', alignItems: 'flex-start', marginTop: '9.5%', paddingLeft: '5%'}}>
                        <View style = {{flexDirection: 'row', justifyContent:'space-between', alignItems: 'stretch', }}>
                            <Text style = {styles.normalText}>
                                Brand
                            </Text>
                            <Text style = {styles.sideText}>
                                All
                            </Text>
                                
                        </View>
                    </View>
                </View>

                <View style = {styles.TextBox}>
                    <View style = {{justifyContent: 'center', alignItems: 'flex-start', marginTop: '9.5%', paddingLeft: '5%'}}>
                        <Text style = {styles.normalText}>
                            Amount
                        </Text>
                    </View>
                </View>

                <View style = {styles.TextBox}>
                    <View style = {{justifyContent: 'center', alignItems: 'flex-start', marginTop: '9.5%', paddingLeft: '5%'}}>
                        <Text style = {styles.normalText}>
                            Warehouse
                        </Text>
                    </View>
                </View>
                
                {/* <View style = {styles.TextBox}>
                    <View style = {{justifyContent: 'center', alignItems: 'flex-start', marginTop: '9.5%', paddingLeft: '5%'}}>
                        <Text style = {styles.normalText}>
                            Ahmed is great
                        </Text>
                    </View>
                </View> */}

                <View style = {styles.bottomBox}>
                    {/* <View style = {{ justifyContent: 'center', alignItems: 'center',}}> */}
                    <TouchableOpacity>
                        <View style = {styles.bottomButton}>  
                            <Text style = {styles.footerText}>
                                View Items
                            </Text>
                        </View>
                    </TouchableOpacity>
                       
                        
                        
                    {/* </View> */}
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
        fontSize: 24,
        color: "#008394",
    },
    normalText: {
        fontSize: 18,
        fontWeight: '600',
        color: "#008394",
        
    },
    sideText: {
        fontSize: 18,
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
        shadowOpacity:  22,
        shadowRadius: 10,
        elevation: 10,
    },
    TextBox: {
        width: '100%',
        height: '12%',
        shadowColor: '#000000',
        backgroundColor: '#fff',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity:  0.4,
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
        height: Dimensions.get('window').height*0.08,
        marginTop: Dimensions.get('window').height*0.18,
        borderWidth: 2,
        borderRadius: 20,
        marginBottom: 20,
        borderColor: "#008394"

    },
    footerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: "#008394",
        
    },

});

export default FilterModal;
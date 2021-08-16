import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import FilterModal from "./FilterModal";

const FilterButton = (props) => {

  // filter modal 
  const [isFilterModalVisible, setFilterModalVisible] = React.useState(false);

  const closeFilterModal = () => { //turn off
    setFilterModalVisible(false);
  }

  const openFilterModal = () => { // turn on 
    setFilterModalVisible(true);
  }

    return (
        <View style = {{flexDirection: 'row', justifyContent: 'center',marginTop: 35,left: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.36 : Dimensions.get('window').width * 0.34,}}>
          <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
            <View style = {styles.buttonFilter} >
              <View style = {{flexDirection: 'row',}}>
                <FontAwesome
                  name = {"filter"}
                  size = {16}
                  color = {"white"}
                  style = {{right: 4,top: 1.5}}
                />
                <Text style = {{color: 'white',fontSize: 14, fontWeight:'bold' }}>
                  Filter
                </Text>
              </View>
            </View>
          </TouchableOpacity> 
          <View>
            <FilterModal state = {isFilterModalVisible} handleClose = {closeFilterModal} filters = {props}/>
          </View> 
        </View>
        

    )
};

export default FilterButton

const styles = StyleSheet.create({
    buttonFilter : {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        // marginTop: Dimensions.get('window').height > 900 ? 80 : 80,
        borderRadius: 40,
        backgroundColor: '#00E0C7',
        //left: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.36 : Dimensions.get('window').width * 0.34,
        height: 30,
        width: 80,
        //top: 35,
    },
})






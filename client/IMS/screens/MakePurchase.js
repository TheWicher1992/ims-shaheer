import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'; 
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { FontAwesome } from '@expo/vector-icons';
const MakePurchase = props => {
    return(
        <View>
            <Text>Make a Purchase</Text>
        </View>
        
        
    )
}

MakePurchase.navigationOptions = navigationData => {
    return {
        headerTitle: 'Zaki Sons',
        headerTitleAlign: 'center',
        headerTitleStyle: { color: 'white' },
        headerStyle: {
            backgroundColor: '#008394', 
        },
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
              <Item
                title="Menu"
                iconName="ios-menu"
                onPress={() => {
                    navigationData.navigation.toggleDrawer();
                  }}
              />
            </HeaderButtons>
          ),
          headerRight: (
            <HeaderButtons HeaderButtonComponent = {HeaderButton}>
              <FontAwesome
                name = {"user"}
                size = {24}
                color = {"white"}
                style = {{right: 10}}
              />
            </HeaderButtons>
          )
    };
  };

export default MakePurchase
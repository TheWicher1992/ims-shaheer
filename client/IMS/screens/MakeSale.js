import * as React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, TouchableOpacity, KeyboardAvoidingView } from 'react-native'; 
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { FontAwesome } from '@expo/vector-icons';
import { DataTable } from 'react-native-paper';


const optionsPerPage = [2, 3, 4];

const MakeSale = props => {

  const [page, setPage] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]);


  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);


    return(
      // <KeyboardAvoidingView style = {styles.containerView} behavior = "padding">
      <View>
        <View style = {styles.screen}>
          <View>
            <Text style={styles.title}>Sales</Text>
          </View>
        </View>
        <View style = {styles.containerButton}>
          <TouchableOpacity>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Make a Sale</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Product</DataTable.Title>
              <DataTable.Title>Quantity</DataTable.Title>
              <DataTable.Title>Amount</DataTable.Title>
              <DataTable.Title>Client</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell>yogurt</DataTable.Cell>
              <DataTable.Cell>159</DataTable.Cell>
              <DataTable.Cell>6.0</DataTable.Cell>
              <DataTable.Cell>Raaking</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Pagination
              page={page}
              numberOfPages={3}
              onPageChange={(page) => setPage(page)}
              label="1-2 of 6"
              optionsPerPage={optionsPerPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              showFastPagination
              optionsLabel={'Rows per page'}
            />
          </DataTable>

        </View>
      </View>        
      // </KeyboardAvoidingView>
        
        
    )
}


MakeSale.navigationOptions = navigationData => {
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

export default MakeSale


const styles = StyleSheet.create({
  title: {
    color: '#006270',
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#008394',
    fontSize: 25,
    marginTop: 50,
    fontFamily: 'Roboto',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Dimensions.get('window').height === 1232 ? Dimensions.get('window').height * 0.2 : Dimensions.get('window').height * 0.02
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Dimensions.get('window').height > 600 ? 60 : 30,
    borderRadius: 40,
    backgroundColor: '#00E0C7',
    paddingVertical: 12,
    paddingHorizontal: 32,
    left: 15
    // right: Dimensions.get('window').width / 5
    // we can also change the container to center and implement the right styling
  },
  buttonText: {
    fontSize: 26,
    textAlign: 'center',
    color:'white',
    fontWeight: 'bold'
  },
  container :{
    flex: 1,
  },
  containerButton:{
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
})
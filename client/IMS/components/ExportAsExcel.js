import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const ExportButton = (props) => {
  const [exportData, setExportData] = useState([])
  useEffect(() =>{
    if(props.screenName === 'employees' ){
      props.data.map(d => {
      exportData.push({...d, date: d.date.toLocaleString().split('T')[0]})
    })
    }
    else if(props.screenName === 'deliveryOrders'){
      props.data.map(d => {
        exportData.push({...d, client: d.client.userName, product: d.product.title, date: d.date.toLocaleString().split('T')[0]})
      })
    }
    else if(props.screenName === 'purchases'){
      props.data.map(d => {
        exportData.push({...d, client: d.client.userName, product: d.product.title, quantity: d.quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','), received: d.received === null ? '' : d.received.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','), total: d.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','), date: d.date.toLocaleString().split('T')[0]})
      })
    }
    else if(props.screenName === 'warehouses'){
      props.data.map(d => {
        exportData.push({...d, date: d.date.toLocaleString().split('T')[0], totalStock: d.totalStock.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')})
      })
    }
    else if(props.screenName === 'stocks'){
      props.data.map(d => {
        exportData.push({...d, product: d.product.title, warehouse: d.warehouse === undefined ? 'No Name' : d.warehouse.name})
      })
    }
    else if(props.screenName === 'clients'){
      props.data.map(d => {
        exportData.push({...d, date: d.date.toLocaleString().split('T')[0], balance: d.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')})
      })
    }
    else if(props.screenName === 'products'){
      props.data.map(d => {
        exportData.push({...d, brand: d.brand.title, colour: d.colour.title, price: d.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','), date: d.date.toLocaleString().split('T')[0]})
      })
    }
    else if(props.screenName === 'ledger'){
      setExportData(props.data)
    }
    else if(props.screenName === 'sales'){
      props.data.map(d => {
        let str = ''
        d.products.map((p,i) => 
          ( str = str + `${p.quantity} x ${p.product.title}` + ' -- '))
        exportData.push({...d, client: d.client.userName, products: str, received: d.received === null ? '' : d.received.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','), total: d.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),date: d.date.toLocaleString().split('T')[0]})
      })
    }
    
    // console.log(exportData)


  }, [props.data])

  const excelTest = async () => {
  var ws = XLSX.utils.json_to_sheet(exportData);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, props.title);
  const wbout = XLSX.write(wb, {
    type: 'base64',
    bookType: "xlsx"
  });
  const uri = FileSystem.cacheDirectory + props.title;
  await FileSystem.writeAsStringAsync(uri, wbout, {
    encoding: FileSystem.EncodingType.Base64
  });
  
  await Sharing.shareAsync(uri, {
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    dialogTitle: `${props.title}`,
    UTI: 'com.microsoft.excel.xlsx'
  });
  }
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, left: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.36 : Dimensions.get('window').width * 0.34, }}>
      <TouchableOpacity onPress= {() => excelTest()}>
        <View style={styles.buttonFilter} >
          <View style={{ flexDirection: 'row', }}>
            <FontAwesome5
              name={"file-excel"}
              size={16}
              color={"white"}
              style={{ right: 4, top: 1.5 }}
            />
            <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
              Export
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>


  )
};

export default ExportButton

const styles = StyleSheet.create({
  buttonFilter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: '#00E0C7',
    height: 30,
    width: 80,
  },
})






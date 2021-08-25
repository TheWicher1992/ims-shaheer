import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const ExportButton = (props) => {
  const excelTest = async () => {
  var ws = XLSX.utils.json_to_sheet(props.data);
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
    dialogTitle: 'MyWater data',
    UTI: 'com.microsoft.excel.xlsx'
  });
  }
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 35, left: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.36 : Dimensions.get('window').width * 0.34, }}>
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






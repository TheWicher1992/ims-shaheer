import React, { useState, useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback } from "react-native";
import { uri } from '../api.json'
import axios from "axios"
import ShowAlert from '../components/ShowAlert';
import { FontAwesome } from "@expo/vector-icons";
import * as Print from 'expo-print';
import moment from 'moment';

const SaleDetailModal = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = React.useState(false);
  const [alertState, setAlertState] = useState(false)
  const [alertTitle, setAlertTitle] = useState(``)
  const [alertMsg, setAlertMsg] = useState(``)
  const [html, setHTML] = useState(``)
  const [obj, setObj] = useState([])

  const show = () => {
    setAlertState(!alertState)
  }
  const setError = () => {
    setAlertTitle('Error')
    setAlertMsg('Something Went Wrong')
    show()
  }
  useEffect(() => {
    setModalVisible(props.state);
  }, [props.state]);

  useEffect(() => {
    let infoString = ''
    props.object.products !== undefined && props.object.products.map((p,k) => {
      infoString = infoString + `<tr class="service"><td><h3>${p.product.title}</h3></td><td><h3>${p.quantity}</h3></td><td><h3>${p.salePrice * p.quantity}</h3></td></tr>`
    })
    
    // infoString = infoString + `<tr><td>${props.object.products !== undefined && props.object.products.map((p,k) => `${`${p.quantity}` + 'x' + `${p.product.title}` + `${props.object.products.length - k - 1 === 0 ? ' ': "\n" }`}`)}</td><td>${props.object.total}</td><td>${props.object.payment}</td><td>${props.object.client === undefined ? '--' : props.object.client.userName}</td><td>${props.object.received}</td></tr>`
    const htmlcontent = `

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
      <body>
        <style>
        #invoice-POS {
          
          padding: 2mm;
          margin: 0 auto;
          width: 57mm;
          background: #fff;
       }
        #invoice-POS ::selection {
          background: #f31544;
          color: #fff;
       }
        #invoice-POS ::moz-selection {
          background: #f31544;
          color: #fff;
       }
        #invoice-POS h1 {
          font-size: 0.8em;
          color: #222;
       }
        #invoice-POS h2 {
          font-size: 0.9em;
       }
        #invoice-POS h3 {
          font-size: 0.5em;
          font-weight: 300;
          line-height: 2em;
          color: #000000;
       }
        #invoice-POS p {
          font-size: 0.7em;
          color: #666;
          line-height: 1.2em;
       }
        #invoice-POS #top, #invoice-POS #mid, #invoice-POS #bot {
         /* Targets all id with 'col-' */
          border-bottom: 1px solid #eee;
       }
        #invoice-POS #top {
          min-height: 100px;
       }
        #invoice-POS #mid {
          min-height: 80px;
       }
        #invoice-POS #bot {
          min-height: 50px;
       }
        #invoice-POS #top .logo {
          height: 60px;
          width: 60px;
          background: url(http://michaeltruong.ca/images/logo1.png) no-repeat;
          background-size: 60px 60px;
       }
        #invoice-POS .clientlogo {
          float: left;
          height: 60px;
          width: 60px;
          background: url(http://michaeltruong.ca/images/client.jpg) no-repeat;
          background-size: 60px 60px;
          border-radius: 50px;
       }
        #invoice-POS .info {
          display: block;
          margin-left: 0;
       }
        #invoice-POS .title {
          float: right;
       }
        #invoice-POS .title p {
          text-align: right;
       }
        #invoice-POS table {
          width: 100%;
          border-collapse: collapse;
       }
        #invoice-POS .tabletitle {
          font-size: 0.5em;
          background: #eee;
       }
        #invoice-POS .service {
          border-bottom: 1px solid #eee;
       }
        #invoice-POS .item {
          width: 24mm;
       }
        #invoice-POS .itemtext {
          font-size: 0.5em;
       }
        #invoice-POS #legalcopy {
          margin-top: 5mm;
       }
          </style>
          <div id="invoice-POS">
            
            <center id="top">
              <div class="info"> 
                <h2>Zaki Sons</h2>
              </div><!--End Info-->
              <div class = "Info">
                <p>
                  Client: ${props.object.client === undefined ? '---' : props.object.client.userName}
                </p>
                <p>
                  Date: ${props.object.date === undefined ? '---' : moment(props.object.date).local().format('YYYY-MM-DD HH:mm:ss')}
                </p>
                <p>
                  Payment Type: ${props.object === undefined ? '---' : props.object.payment}
                </p>
              </div>
            </center><!--End InvoiceTop-->
            
            <div id="bot">

                  <div id="table">
                    <table>
                      <tr class="tabletitle">
                        <td class="item"><h2>Product</h2></td>
                        <td class="Hours"><h2>Qty</h2></td>
                        <td class="Rate"><h2>Price</h2></td>
                      </tr>
                      ${infoString}
                      <tr class="tabletitle">
                        <td></td>
                        <td class="Rate"><h2>Total</h2></td>
                        <td class="payment"><h2>Rs ${props.object.total}</h2></td>
                      </tr>
                      <tr class="tabletitle">
								      <td></td>
							      	<td class="Rate"><h2>Received</h2></td>
								      <td class="payment"><h2>Rs ${props.object.payment === 'Partial' ? props.object.received : (props.object.payment=== 'Credit' ? 0 : props.object.total)}</h2></td>
							        </tr>

                    </table>
                  </div><!--End Table-->


                </div><!--End InvoiceBot-->
          </div><!--End Invoice-->
        </body>
      </html>`
    

    // <html><body><h1 style="text-align:center;">Zaki Sons</h1><h1 style="text-align:center;">Sales Receipt</h1><h1 style="text-align:center;">Date: ${props.object.date === undefined ? '---' : `${props.object.date.toLocaleString().split('T')[0]} - ${props.object.date.toLocaleString().split('T')[1].slice(0, 8)}`}</h1><h1 style="text-align:center;">Client: ${props.object.client === undefined ? '---' : props.object.client.userName}</h1><table style="border: 1px solid black;"><tr><th>Product(s)</th><th>Total</th><th>Payment</th></tr>${infoString}</table></body></html>`;
    setHTML(htmlcontent)
  }, [props.object]);

  const print = async() => {
    let options = {
      html: html,
  };

try {
  file = await Print.printAsync(options);
}
catch(error) {console.error(error)}
  }

  const handleCloseUpdate = () => {
    setUpdateModalVisible(false)
  }

  function handleClose() {
    setModalVisible(false);
  }


  return (
    <KeyboardAvoidingView>
      <View style={styles.centeredView}>
        <ShowAlert state={alertState} handleClose={show} alertTitle={alertTitle} alertMsg={alertMsg} style={styles.buttonModalContainer} />

        <Modal
          animationType="slide"
          transparent={true}
          swipeDirection="left"
          avoidKeyboard={false}
          visible={modalVisible}
          onSwipeComplete={() => props.handleClose()}
          onRequestClose={() => {
            props.handleClose();
          }}
        >
          <TouchableWithoutFeedback onPress={() => props.handleClose()}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ right: Dimensions.get('window').height > 900 ? Dimensions.get('window').width * 0.1 : Dimensions.get('window').width * 0.04, top: 18 }}>
                  <TouchableOpacity onPress={() => props.handleClose()}>
                    <FontAwesome
                      name={"arrow-left"}
                      size={Dimensions.get('window').height > 900 ? 30 : 25}
                      color={"#008394"}
                    />
                  </TouchableOpacity>

                </View>
                <Text style={styles.modalTitle}>{props.title}</Text>
              </View>
              <ScrollView>
                <View>
                  <View style={styles.modalBody}>
                    <Text style = {styles.bodyText}>Products: </Text>
                    {props.object !== [] && (<View>
                      <Text style={styles.bodyText}>{props.object.products === undefined ? '--' : props.object.products.map((p,k) => (<Text key = {k}>{'\t'}{p.quantity} x {p.product.title} x {p.salePrice}{props.object.products.length - k - 1 === 0 ? null: "\n" }</Text>))}</Text>
                      {/* <Text style={styles.bodyText}>Quantity: {props.object.quantity}</Text> */}
                      <Text style={styles.bodyText}>Total: {props.object.total}</Text>
                      <Text style={styles.bodyText}>Payment: {props.object.payment}</Text>

                      <Text style={styles.bodyText}>Client: {props.object.client === undefined ? '--' : props.object.client.userName}</Text>
                      <Text style={styles.bodyText}>note: {props.object.note}</Text>
                      <Text style={styles.bodyText}>date: {props.object.date === undefined ? '---' : moment(props.object.date).local().format('YYYY-MM-DD HH:mm:ss')}</Text>
                      {props.object.payment === 'Partial' && <Text style={styles.bodyText}>Received: {props.object.received}</Text>}
                    </View>
                    )}
                  </View>
                </View>
              </ScrollView>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => props.handleClose()}>
                  <View style={styles.buttonModalContainer}>
                    <Text style={styles.buttonModalText}>Back</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => print()}>
                  <View style={styles.buttonModalContainer}>
                    <Text style={styles.buttonModalText}>Print</Text>
                  </View>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  bodyText: {
    fontFamily: 'Roboto',
    fontSize: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 24 : 18) : 14,
    paddingTop: Dimensions.get('window').height > 900 ? 25 : 16
  },
  modalTitle: {
    color: '#006270',
    //fontSize: Dimensions.get('window').height > 900 ? 30 : 20,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 28 : 21) : 24,
    top: 15,
  },
  //Dimensions.get('window').height < 900 ? Dimensions.get('window').height * 0.11 : Dimensions.get('window').height * 0.1
  buttonModalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius: 40,
    backgroundColor: '#00E0C7',
    paddingVertical: 8,
    paddingHorizontal: 24,
    top: Dimensions.get('window').height > 900 ? 5 : 15,
    margin: 20,
    display: 'flex',

  },
  backButtonModalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius: 40,
    backgroundColor: '#008394',
    paddingVertical: 8,
    paddingHorizontal: 24,
    top: Dimensions.get('window').height > 900 ? 5 : 15,
    margin: 20,
    display: 'flex',

  },
  deleteButtonModalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    borderRadius: 40,
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 24,
    top: Dimensions.get('window').height > 900 ? 5 : 15,
    margin: 20,
    display: 'flex',

  },
  buttonModalText: {
    color: '#ffffff',
    fontSize: Dimensions.get('window').height > 900 ? (Dimensions.get('window').width > 480 ? 24 : 16) : 16,
    fontFamily: 'Roboto',
    fontWeight: 'bold'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalBody: {
    paddingVertical: '30%',
    paddingHorizontal: 10
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    //shadowColor: "#000",
    borderColor: "#008394",
    borderWidth: 2,
    //
    //shadowOpacity: 0.25,
    //shadowRadius: 4,
    //elevation: 5,
    width: '80%',
    height: Dimensions.get('window').height > 900 ? '65%' : Dimensions.get('window').height * 0.60
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

});

export default SaleDetailModal;

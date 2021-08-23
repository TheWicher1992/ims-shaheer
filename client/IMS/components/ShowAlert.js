import React from 'react'
import AwesomeAlert from 'react-native-awesome-alerts';
import { useState } from 'react';

const ShowAlert = props => {
    
    
    return(
        <AwesomeAlert
          show={props.state}
          title={props.alertTitle}
          message={props.alertMsg}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor="#00E0C7"
          onConfirmPressed={() => {
            props.handleClose();
          }}
          titleStyle={{color:'black'}}
        />
    )

}

export default ShowAlert
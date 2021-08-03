import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigation from './navigation/AppNavigation';
import { Provider } from 'react-redux'
import store from "./store";
import { loadUser } from './actions/auth'


if (localStorage.token) {
  setAuthToken(localStorage.token);
}


export default function App() {

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  return (

    <Provider store={store}>

      {/* // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View> */}
      <AppNavigation />

    </Provider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

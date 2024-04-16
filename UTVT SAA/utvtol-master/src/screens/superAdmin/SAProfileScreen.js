import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome5 } from '@expo/vector-icons'; 

export const SAProfileScreen = () => {
  return (
    <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={PrestamosView} />
          }>
          <View>
            <View style={styles.targets}>
              <Text style={styles.h1}>Tus Prestamos</Text>
            </View>
          </View>

          <View style={styles.containerDatable}>
            {/* <DataTable
              data={Prestamos}
              colNames={colNames}
              colSettings={colSettings}
              backgroundColor={'#ffffffe1'}
              headerLabelStyle={{ color: 'black', fontSize: 12 }}
              noOfPages={10}
            /> */}
            {/* <DataTable
              columns={columns}
              data={data}
            /> */}
          </View>
        </ScrollView>
      </SafeAreaView >
  )
}



const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f2f7',
  },
  welcome: {
    fontSize: 18,
    marginBottom: 8,
  },
  targets: {
    padding: 30,
    backgroundColor: 'white',
  },
  footer: {
    flex: 2,
  },
  h1: {
    fontSize: 20,
  },
  column: {
    flex: 3,
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
  },
  col: {
    flex: 3,
    flexDirection: 'row-reverse',
    paddingTop: 10,
    padding: 30,
  },
  p: {
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  icons: {
    paddingTop: 17,
    paddingLeft: 50,
    position: 'absolute',
  }
});
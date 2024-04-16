import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome5 } from '@expo/vector-icons'; 


export const SAHomeScreen = () => {
  const { userInfo, isLoading, logout } = useContext(AuthContext);
  const [dataInfromacion, setdataInfromacion] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  var myDate = new Date();
  var hrs = myDate.getHours();

  var saludar;

  if (hrs < 12)
    saludar = 'Buenos días';
  else if (hrs >= 12 && hrs <= 18)
    saludar = 'Buenas tardes';
  else if (hrs >= 18 && hrs <= 24)
    saludar = 'Buenas noches';

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [panel]);
  const panel = () => {
    axios
      .get(`${BASE_URL}/admin/panel`, {
        headers: { "Accept": "application/json, text/plain, /", "Content-Type": "multipart/form-data" },
      })
      .then(res => {
        console.log(res.data);
        var dataInfromacion = res.data;
        setdataInfromacion(dataInfromacion);
      })
  };
  useEffect(() => {
    panel()
  }, []);
  return (
    <>
      <SafeAreaView >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={panel} />
          }>
          <View>
            <View style={styles.targets}>
              <Text style={styles.h1}>{saludar} {userInfo.data.nombre}</Text>
            </View>
          </View>
          <View style={styles.container}>
            <Spinner visible={isLoading} />
            <View style={{ flex: 3, flexDirection: 'row', }}>
              <View style={styles.column}>
                <View style={styles.col}>
                  <View style={{ flex: 3, backgroundColor: '#ffffff', paddingTop: 20, borderRadius: 20, padding: 20 }}>
                    <FontAwesome5 name="users" size={22} color="green" style={styles.icons} />
                    <Text style={styles.p}>Alumnos: {dataInfromacion.alumnos}</Text>
                  </View>
                </View>
                <View style={styles.col}>
                  <View style={{ flex: 3, backgroundColor: '#ffffff', paddingTop: 20, borderRadius: 20, padding: 20 }}>
                    <Ionicons name="md-refresh-circle" size={22} color="green" style={styles.icons} />
                    <Text style={styles.p}>Materiales: {dataInfromacion.materiales}</Text>
                  </View>
                </View>
                <View style={styles.col}>
                  <View style={{ flex: 3, backgroundColor: '#ffffff', paddingTop: 20, borderRadius: 20, padding: 20 }}>
                    <Ionicons name="md-refresh-circle" size={22} color="green" style={styles.icons} />
                    <Text style={styles.p}>Prestamos: {dataInfromacion.prestamos}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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

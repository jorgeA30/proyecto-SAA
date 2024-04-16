import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, SafeAreaView, ScrollView, RefreshControl, Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../config';
import Ionicons from '@expo/vector-icons/Ionicons';
import Carousel, { PaginationLight } from 'react-native-x-carousel';
import * as Notifications from "expo-notifications";
import Constants from 'expo-constants';

export const HomeScreen = () => {
  const { userInfo, isLoading, logout } = useContext(AuthContext);
  const [Alumno, setAlumno] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [carouselImages, setCarouselImages] = useState([]);
  const [loadingCarouselImages, setLoadingCarouselImages] = useState(true);

  useEffect(() => {
    registerForPushNotificationsAsync();
    fetchCarouselImages();
    panel();

    // Agregar listener para las notificaciones recibidas
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      handleNotification(notification);
    });

    // Retornar una función de limpieza para remover el listener cuando el componente se desmonte
    return () => {
      notificationListener.remove();
    };
  }, []);
  const registerForPushNotificationsAsync = async () => {
    try {
      if (!Constants.isDevice) {
        alert('Must use physical device for Push Notifications');
        return;
      }
      
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }

      const tokenObject = await Notifications.getExpoPushTokenAsync({
        experienceId: '@yourusername/yourappname',
        deviceId: Constants.installationId,
        userId: userInfo.id,
      });
      const expoPushToken = tokenObject.data;
      console.log('TOKEN', expoPushToken);
      await saveToken(expoPushToken); // Espera a que saveToken se complete
    } catch (error) {
      console.error('Error obtaining push token:', error);
    }
  }

  const handleNotification = (notification) => {
    const data = notification.request.content.data;
    Alert.alert(
      notification.request.content.title,
      notification.request.content.body,
      [
        { text: 'Cerrar', onPress: () => console.log('Closed') },
      ],
      { cancelable: false }
    );
  };


  const fetchCarouselImages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/peticiones/scrape-images`);
      setCarouselImages(response.data);
      setLoadingCarouselImages(false);
    } catch (error) {
      console.error('Error al obtener imágenes del carousel:', error);
    }
  };

  const saveToken = async (expoPushToken) => {
    try {
      const response = await axios.post(`${BASE_URL}/peticiones/alumno/token/notification/save`, {
        headers: { "Accept": "application/json, text/plain, /", "Content-Type": "multipart/form-data" },
        matricula: userInfo.matricula,
        token: expoPushToken
      });
      console.log('Respuesta del servidor:', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un estado de error
        console.error('Error de respuesta del servidor:', error.response.data);
        return { error: error.response.data };
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor:', error.request);
        return { error: 'No se recibió respuesta del servidor' };
      } else {
        // Ocurrió un error durante la configuración de la solicitud
        console.error('Error durante la configuración de la solicitud:', error.message);
        return { error: 'Error durante la configuración de la solicitud' };
      }
    }
  };
  

  const panel = () => {
    axios
      .post(`${BASE_URL}/alumno/panel`, {
        timeout: 2000,
        headers: { "Accept": "application/json, text/plain, /", "Content-Type": "multipart/form-data" },
        token: userInfo.token,
      }, 60000)
      .then(res => {
        console.log(res.data);
        var AlumnoData = res.data;
        setAlumno(AlumnoData);
      })
  };

  useEffect(() => {
    panel();
    fetchCarouselImages();
  }, []);

  const DATA = carouselImages.map(imageUrl => ({
    coverImageUri: `https://utvt.edomex.gob.mx/${imageUrl}`,
    cornerLabelColor: 'green',
    cornerLabelText: 'UTVT',
  }));

  const renderItem = data => (
    <View key={data.coverImageUri} style={styles.cardContainer}>
      <View style={styles.cardWrapper}>
        <Image style={styles.card} source={{ uri: data.coverImageUri }} />
        <View style={[styles.cornerLabel, { backgroundColor: data.cornerLabelColor }]}>
          <Text style={styles.cornerLabelText}>{data.cornerLabelText}</Text>
        </View>
      </View>
    </View>
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <>
      <SafeAreaView >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={panel, fetchCarouselImages} />
          }>
          <View style={{ paddingTop: 10 }} textContent={'Cargando...'}
                        textStyle={{ color: '#FFF' }}>
            <View style={styles.container}>
              {loadingCarouselImages ? ( // Mostrar el spinner mientras se cargan las imágenes
                <Spinner visible={true} />
              ) : (
                <Carousel
                  pagination={PaginationLight}
                  renderItem={renderItem}
                  data={DATA}
                  loop
                  autoplay
                />
              )}
            </View>
          </View>
          <View style={styles.container}>
            <Spinner visible={isLoading} />
            <View style={{ flex: 3, flexDirection: 'row', }}>
              <View style={styles.column}>
                <View style={styles.col}>
                  <View style={{ flex: 3, backgroundColor: '#ffffff', paddingTop: 20, borderRadius: 20, padding: 20 }}>
                    <Ionicons name="md-checkmark-circle" size={22} color="green" style={styles.icons} />
                    <Text style={styles.p}>Prestamos Activos:{Alumno.prestamosActivos}</Text>
                  </View>
                </View>
                <View style={styles.col}>
                  <View style={{ flex: 3, backgroundColor: '#ffffff', paddingTop: 20, borderRadius: 20, padding: 20 }}>
                    <Ionicons name="md-refresh-circle" size={22} color="green" style={styles.icons} />
                    <Text style={styles.p}>Prestamos Devueltos:{Alumno.prestamosDevueltos}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f2f7',
  },
  targets: {
    padding: 30,
    backgroundColor: 'white',
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
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  card: {
    width: 360,
    height: 80,
  },
  cornerLabel: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 8,
  },
  cornerLabelText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2,
  },
});

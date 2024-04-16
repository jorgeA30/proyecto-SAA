import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export const HomeScreenChofer = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [isLocationEnabled, setLocationEnabled] = useState(false);
  const [stops, setStops] = useState([
    { id: 1, title: 'Parada 1', coordinates: [-99.64135624393437, 19.28165451145221] },
    { id: 2, title: 'Parada 2', coordinates: [-99.63217390710778, 19.284527342079123] },
    { id: 3, title: 'Parada 3', coordinates: [-99.61065015646203, 19.287217676105403] },
    { id: 4, title: 'Parada 4', coordinates: [-99.59438589159055, 19.286808932264414] },
    { id: 5, title: 'Parada 5', coordinates: [-99.57370049447698, 19.28624409743481] },
    { id: 6, title: 'Parada 6', coordinates: [-99.55618751216198, 19.285769135963836] },
    { id: 7, title: 'Parada 7', coordinates: [-99.52887229771248, 19.2850762714248] },
    { id: 8, title: 'Parada 8', coordinates: [-99.51184783694012, 19.2851666223549] },
    { id: 9, title: 'Parada 9', coordinates: [-99.4759264593618, 19.342074129820688] }
  ]);

  const toggleLocation = async () => {
    if (!isLocationEnabled) {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const id = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 10 },
        location => {
          setLocation(location);
        }
      );

      setWatchId(id);
      setLocationEnabled(true);
    } else {
      if (watchId) {
        Location.clearWatchAsync(watchId);
      }
      setLocationEnabled(false);
    }
  };

  useEffect(() => {
    return () => {
      if (watchId) {
        Location.clearWatchAsync(watchId);
      }
    };
  }, []);

  const openMapsApp = async () => {
    try {
      // Realizar acción para iniciar el viaje (por ejemplo, enviar una solicitud al servidor)
      // Aquí puedes reemplazar 'URL_DEL_SERVIDOR/accion_iniciar_viaje' con la URL de tu servidor y proporcionar cualquier dato necesario
      // await fetch('URL_DEL_SERVIDOR/accion_iniciar_viaje', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ /* datos necesarios para iniciar el viaje */ }),
      // });

      // Una vez que se haya iniciado el viaje, abrir Google Maps con las paradas
      let url = 'https://www.google.com/maps/dir/';
      stops.forEach(stop => {
        url += `${stop.coordinates[1]},${stop.coordinates[0]}/`;
      });
      Linking.openURL(url);
    } catch (error) {
      console.error('Error al iniciar el viaje:', error);
      // Manejar cualquier error que ocurra al iniciar el viaje
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleLocation} style={styles.button}>
        <Text style={styles.buttonText}>{isLocationEnabled ? 'Desactivar ubicación' : 'Activar ubicación'}</Text>
      </TouchableOpacity>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {stops.map(stop => (
            <Marker
              key={stop.id}
              coordinate={{
                latitude: stop.coordinates[1],
                longitude: stop.coordinates[0],
              }}
              title={stop.title}
            />
          ))}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Bus"
            image={require('./../../../assets/camion.png')} // Reemplaza esto con la ruta a tu icono de bus
          />
        </MapView>
      )}
      {errorMsg && <Text>{errorMsg}</Text>}
      <TouchableOpacity onPress={openMapsApp} style={styles.button}>
        <Text style={styles.buttonText}>Iniciar viaje y ver paradas en Google Maps</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '70%',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

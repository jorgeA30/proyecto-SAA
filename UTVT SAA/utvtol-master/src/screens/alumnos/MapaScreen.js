import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

export const MapaScreen = () => {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [permissionsGranted, setPermissionsGranted] = useState(false); // Estado para verificar permisos

  const ApiKey = "pk.eyJ1IjoiZWR3aW5mdiIsImEiOiJjbHR4Znpqb2MwNjdhMmxvYWw2bmRpdmFuIn0.SsfxPwjognvykdTq9DE3UA";

  useEffect(() => {
    // Función para solicitar permiso de ubicación
    const requestLocationPermission = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          setPermissionsGranted(true); // Actualizar estado si se conceden permisos
        } else {
          Alert.alert('Permisos insuficientes', 'La aplicación necesita permiso para acceder a la ubicación', [{ text: 'OK' }]);
        }
      } catch (error) {
        console.error('Error al solicitar permisos de ubicación:', error);
      }
    };

    // Solicitar permiso de ubicación al cargar el componente
    requestLocationPermission();

    // Lista de coordenadas de los puntos a visitar
    const coords = [
      [-99.64135624393437, 19.28165451145221], // Punto de parada 1
      [-99.63217390710778, 19.284527342079123], // Punto de parada 2
      [-99.61065015646203, 19.287217676105403], // Punto de parada 3
      [-99.59438589159055, 19.286808932264414], // Punto de parada 4
      [-99.57370049447698, 19.28624409743481], // Punto de parada 5
      [-99.55618751216198, 19.285769135963836], // Punto de parada 6
      [-99.52887229771248, 19.2850762714248], // Punto de parada 7
      [-99.51184783694012, 19.2851666223549], // Punto de parada 8
      [-99.4759264593618, 19.342074129820688] // Punto de parada 9
    ];
    setCoordinates(coords);

    if (permissionsGranted) {
      // Calcular la ruta utilizando la API de direcciones de Mapbox
      fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${coords.join(';')}?steps=true&geometries=geojson&access_token=${ApiKey}`)
        .then(response => response.json())
        .then(data => {
          const route = data.routes[0].geometry.coordinates.map(coord => ({
            latitude: coord[1],
            longitude: coord[0]
          }));
          setRouteCoordinates(route);
        })
        .catch(error => {
          console.error('Error al obtener la ruta:', error);
        });
    }
  }, [permissionsGranted]); // Ejecutar efecto cuando se actualiza el estado de los permisos

  return (
    <View style={{ flex: 1 }}>
      {permissionsGranted ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 19.28165451145221, // Latitud del primer punto de parada
            longitude: -99.64135624393437, // Longitud del primer punto de parada
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
          }}
        >
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={5}
              strokeColor="#3887be"
            />
          )}
          {coordinates.map((coord, index) => (
            <Marker
              key={`marker-${index}`}
              coordinate={{ latitude: coord[1], longitude: coord[0] }}
              title={`Cuervo Parada ${index + 1}`}
            />
          ))}
          {/* Marker para el chofer */}
          <Marker
            coordinate={{ latitude: 19.28165451145221, longitude: -99.64135624393437 }} // Coordenadas del chofer
            title="Chofer"
            image={require('./../../../assets/camion.png')} // Ruta de la imagen del icono del chofer
          />
        </MapView>
      ) : (
        <Text>Esperando permisos de ubicación...</Text>
      )}
    </View>
  );
};

import React, { Component, useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, Touchable, View, SafeAreaView, ScrollView, RefreshControl, Image, TextInput, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL, APIKEY, BASE_URL_IMAGENES } from '../../config';
import Spinner from 'react-native-loading-spinner-overlay';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

export const ProfileScreen = () => {
  const { userInfo, isLoading } = useContext(AuthContext);
  const [profileAlumno, setProfileAlumno] = useState([]);
  const [profileCarrera, setProfileCarrera] = useState([]);
  const [nombre, setNombre] = useState([]);
  const [apellidos, setApellidos] = useState([]);
  const [matricula, setmatricula] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [imageResult, setImage] = useState(null);
  const [nombreImagen, setNombreImagen] = useState([]);
  const [TypeImagen, setTypeImagen] = useState([]);
  const [localUri, setlocalUri] = useState([]);
  console.log(userInfo.token);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        let { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
          alert('¡Se requiere permiso para acceder al carrete de la cámara!');
          return;
        }
      }
    })();
  }, []);
  const pickImageAsync = async () => {
    // TODO: remove this by fixing requestCameraPermissionsAsync on web
    let result = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    let localUri = result.assets[0].uri;
    setlocalUri(localUri);
    let nombreArchivo = localUri.split('/').pop();
    setNombreImagen(nombreArchivo);
    let fileType = localUri.substring(localUri.lastIndexOf(".") + 1);
    setTypeImagen(fileType);
  }


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [profilePeticion]);

  const sendPictureToServer = (localUri, nombreImagen, TypeImagen, nombre, apellidos) => {
    let formData = new FormData();
    formData.append("photo", {
      uri: localUri,
      name: `${nombreImagen}`,
      type: `image/${TypeImagen}`,
    });
    axios
      .post(`${BASE_URL}/alumno/profile/profileSave?token=${userInfo.token}&nombre=${nombre}&apellidos${apellidos}`, formData, {
        headers: { "Accept": "application/json, text/plain, /", "Content-Type": "multipart/form-data", 'Authorization': `Bearer ${userInfo.msg}` },
        nombre: nombre,
      }, {
        headers: { Authorization: `Bearer ${userInfo.msg}` },
      },).then(res => {
        console.log(res.data);
      }).catch(e => {
        console.log(`profile error ${e}`);
      });
  }

  const profilePeticion = () => {
    axios
      .get(`${BASE_URL}/alumnos/${userInfo.matricula}?token=${APIKEY}&remember_token=${userInfo.remember_token}`, {
        headers: { "Accept": "application/json, text/plain, /", "Content-Type": "multipart/form-data" },
      })
      .then(res => {
        console.log(res.data);
        var ProfileData = res.data.alumno;
        var ProfileDataCarrera = res.data.carrera;
        setProfileAlumno(ProfileData);
        setProfileCarrera(ProfileDataCarrera);
        setmatricula('' + profile.matricula + '');
        console.log(matricula);
      })
  };
  useEffect(() => {
    profilePeticion()
  }, [])

  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={profilePeticion} />
          }>
          {/* <View>
            <View style={styles.targets}>
              <Text style={styles.h1}>Tu Perfil</Text>
            </View>
          </View> */}
          <View style={styles.container}>
            <Spinner visible={isLoading} />
            <View style={{ flex: 3, flexDirection: 'row', }}>
              <View style={styles.column}>
                <View style={styles.col}>
                  <View style={{ flex: 3, backgroundColor: '#ffffff', paddingTop: 20, borderRadius: 20, padding: 20 }}>
                    <View style={{ paddingLeft: 105 }}>
                      <Image style={styles.imageProfile} source={{ uri: `${BASE_URL_IMAGENES}` +'/'+ profileAlumno.imagen, }} />
                    </View>
                    <View style={{ padding: 20 }}><Button title='select' onPress={pickImageAsync} color="green" /></View>
                    <Text>Nombre</Text>
                    <TextInput style={styles.input}
                      placeholder={profileAlumno.nombre} onChangeText={text => setNombre(text)} editable={false} />
                    <Text>Apellidos</Text>
                    <TextInput style={styles.input}
                      placeholder={profileAlumno.apellidos} onChangeText={text => setApellidos(text)} editable={false} />
                    <Text>Matricula</Text>
                    <TextInput style={styles.input}
                      placeholder="" value="" editable={false} />
                    <Text>Status</Text>
                    <TextInput style={styles.input} value={profileAlumno.activa === true ? 'Activo' : 'Baja'}
                      placeholder="" editable={false} />
                    <Text>Carrera</Text>
                    <TextInput style={styles.input} value={profileCarrera.nombre}
                      placeholder="" editable={false} />
                    <Text>Correo Electronico</Text>
                    <TextInput style={styles.input} value={profileAlumno.Correo}
                      placeholder="" editable={false} />
                    <Button color="green" title="Guardar perfil" onPress={() => { saveProfileData(nombre, apellidos); sendPictureToServer(localUri, nombreImagen, TypeImagen, nombre, apellidos) }} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView >
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 2,
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
    textAlign: 'center',
  },
  containerDatable: {
    flex: 4,
    width: '100%',
    alignSelf: 'center'
  },
  col: {
    flex: 3,
    flexDirection: 'row-reverse',
    paddingTop: 10,
    padding: 30,
  },
  imageProfile: {
    width: 100,
    height: 100,
    borderRadius: 35
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 5,
    paddingHorizontal: 14,
  },
  column: {
    flex: 3,
    flexDirection: 'column',
  }
});
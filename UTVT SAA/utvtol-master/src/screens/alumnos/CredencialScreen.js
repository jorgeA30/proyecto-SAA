import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, RefreshControl, Image, Pressable, Modal, Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { BASE_URL, APIKEY, BASE_URL_IMAGENES } from '../../config';
import { AuthContext } from '../../context/AuthContext';
import headerC from '../../img/headerC.png';
import { FontAwesome5 } from '@expo/vector-icons';

export const CredencialScreen = () => {
    const { userInfo, isLoading } = useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false);
    const [profileAlumno, setProfileAlumno] = useState([]);
    const [profileCarrera, setProfileCarrera] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false); // Estado para controlar el loading de la petición
    const remember_token = userInfo ? userInfo.remember_token : '';
    const matricula = userInfo ? userInfo.matricula : '';

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const profilePeticion = () => {
        setLoadingProfile(true);
        if (matricula && remember_token) {
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
                    setLoadingProfile(false);
                })
                .catch(error => {
                    console.error("Error fetching profile data: ", error);
                });
        }
    };

    useEffect(() => {
        profilePeticion();
    }, []);

    return (
        <SafeAreaView>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={profilePeticion} />}
            >
                {/* <View>
                    <View style={styles.targets}>
                        <Text style={styles.h1}>Tu Credencial</Text>
                    </View>
                </View> */}
                <View style={styles.container}>
                    <Spinner
                        visible={loadingProfile || isLoading}
                        textContent={'Cargando...'}
                        textStyle={{ color: '#FFF' }}
                    />
                    <View style={{ flex: 3, flexDirection: 'row' }}>
                        <View style={styles.column}>
                            <View style={styles.header}>
                                <View style={styles.col2}>
                                    <Image source={headerC} style={{ maxWidth: 325, maxHeight: 70 }} />
                                </View>
                                <View style={{ paddingLeft: 120, padding: 20 }}>
                                    {profileAlumno && profileAlumno.imagen && <Image style={styles.imageProfile} source={{ uri: `${BASE_URL_IMAGENES}` +'/'+ profileAlumno.imagen }} />}
                                </View>

                                {profileAlumno && profileAlumno && (
                                    <>
                                        <Text style={{ textAlign: 'center' }}>{profileAlumno.nombre} {profileAlumno.apellidos}</Text>
                                        <Text style={{ textAlign: 'center' }}>{profileAlumno.matricula}</Text>
                                        <Text style={{ textAlign: 'center' }}>{profileCarrera.nombre && profileCarrera.nombre}</Text>
                                    </>
                                )}

                                <View style={styles.centeredView}>
                                    <Modal
                                        animationType="slide"
                                        transparent={true}
                                        visible={modalVisible}
                                        onRequestClose={() => {
                                            Alert.alert('Modal has been closed.');
                                            setModalVisible(!modalVisible);
                                        }}>
                                        <View style={styles.contenidoModal}>
                                            <View style={styles.modalView}>
                                                {profileAlumno && profileAlumno.token && <Image style={styles.imageProfileModal} source={{ uri: 'https://utvt.alwaysdata.net/uploads/QRAlumno/QR_' + profileAlumno.token + '.png' }} />}
                                                <Pressable
                                                    style={[styles.button, styles.buttonClose]}
                                                    onPress={() => setModalVisible(!modalVisible)}>
                                                    <Text style={styles.textStyle}>Cerrar</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </Modal>
                                </View>
                                <View style={{ paddingTop: 10 }}>
                                    <Pressable
                                        style={[styles.button, styles.buttonOpen]}
                                        onPress={() => setModalVisible(true)}>
                                        <Text style={styles.textStyle}><FontAwesome5 name="qrcode" size={22} color="#ffffff" /> Ver Codigo QR</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f2f7',
    },
    contenidoModal: {
        paddingTop: 156,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    imageProfile: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    imageProfileModal: {
        width: 150,
        height: 150,
        borderRadius: 50,
    },
    targets: {
        padding: 30,
        backgroundColor: 'white',
    },
    h1: {
        fontSize: 20,
        textAlign: 'center',
    },
    col: {
        flex: 3,
        flexDirection: 'row-reverse',
        paddingTop: 10,
        padding: 30,
    },
    column: {
        flex: 3,
        flexDirection: 'column',
        padding: 20,
    },
    col2: {
        flex: 1,
        flexDirection: 'row-reverse',
        padding: 0
    },
    header: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 20
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: 'green',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    spinnerText: {
        color: '#FFF',
    },
});


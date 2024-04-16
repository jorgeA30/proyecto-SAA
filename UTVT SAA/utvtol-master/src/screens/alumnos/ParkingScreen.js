import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, SafeAreaView, ScrollView, RefreshControl, Image, Pressable, Modal, StatusBar, Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';
import headerC from '../../img/headerC.png';
import { FontAwesome5 } from '@expo/vector-icons';

export const ParkingScreen = () => {
    const { userInfo, isLoading } = useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false);
    const [profile, setProfile] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false); // Estado para controlar el loading de la petición

    const token = "SNn8W0sUiALhTvxHLLsxiwiJJT%252FWD1b4nRx-MhT%253FU149C0206MMTYAPdmmc8Tl";
    const matricula = userInfo?.matricula || '';
    const remember_token = userInfo?.remember_token || '';

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, [ParkingScreen]);

    const profilePeticion = async () => {
        setLoadingProfile(true); // Mostrar el spinner de carga al iniciar la petición
        try {
            const response = await axios.get(`${BASE_URL}/alumnos/${matricula}?token=${token}&remember_token=${remember_token}`, {
                headers: { "Accept": "application/json, text/plain, /", "Content-Type": "multipart/form-data" },
            });
            setProfile(response.data);
        } catch (error) {
            console.error('Error al obtener el perfil del alumno:', error);
            Alert.alert('Error', 'No se pudo obtener el perfil del alumno');
        } finally {
            setLoadingProfile(false); // Ocultar el spinner de carga al completar la petición
            setRefreshing(false); // Desactivar el indicador de refresco
        }
    };

    useEffect(() => {
        profilePeticion();
    }, []);

    return (
        <>
            {/* <StatusBar backgroundColor="#cb3e4c" /> */}
            <SafeAreaView>
                <ScrollView
                    contentContainerStyle={styles.scrollView}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    <View>
                        <View style={styles.targets}>
                            <Text style={{ textAlign: 'center', color: 'white', padding: 10, fontSize: 20 }}>Acceso: Alumno</Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <Spinner
                            visible={loadingProfile || isLoading}
                            textContent={'Cargando...'}
                            textStyle={{ color: '#FFF' }}
                        />
                        <View style={{ flex: 3, flexDirection: 'row', }}>
                            <View style={styles.column}>
                                <View style={styles.header}>
                                    <View style={{ paddingLeft: 89, padding: 20 }}>
                                        <Image style={styles.imageProfile} source={{ uri: profile?.imagen || '' }} />
                                    </View>

                                    <Text style={{ textAlign: 'center' }}>No. {profile?.alumno?.matricula || ''}</Text>
                                    <Text style={{ textAlign: 'center', fontSize: 20 }}>Acceso <Text style={{ fontWeight: 'bold', color: 'red' }}>A</Text></Text>
                                    <Text style={{ textAlign: 'center' }}>Nombre: {profile?.alumno?.nombre} {profile?.alumno?.apellidos}</Text>
                                    <Text style={{ textAlign: 'center' }}>Carrera: {profile?.carrera?.nombre}</Text>
                                    <Text style={{ textAlign: 'center', color: 'white', padding: 10, backgroundColor: '#cb3e4c' }}>Estacionamiento</Text>
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
                                                    <Image style={styles.imageProfileModal} source={{ uri: 'https://utvt.alwaysdata.net/uploads/QRAlumno/QR_' + profile?.token + '.png', }} />
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
        </>
    )
}

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
        backgroundColor: '#cb3e4c',
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
        backgroundColor: '#cb3e4c',
    },
    buttonClose: {
        backgroundColor: '#cb3e4c',
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
});

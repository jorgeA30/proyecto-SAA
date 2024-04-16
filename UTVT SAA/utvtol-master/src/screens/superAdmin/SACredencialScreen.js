import React, { Component, useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, Touchable, View, SafeAreaView, ScrollView, RefreshControl, Image, TextInput, Pressable, Modal } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';
import headerC from '../../img/headerC.png';
import { FontAwesome5 } from '@expo/vector-icons';

export const SACredencialScreen = () => {
    const { userInfo, isLoading } = useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false);
    const [profile, setProfile] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, [SACredencialScreen]);
    //console.log(userInfo.data);
    
    const profilePeticion = () => {
        console.log(userInfo.data);
        axios
            .post(`${BASE_URL}/admin/profile`, {
                headers: { "Accept": "application/json, text/plain, /", "Content-Type": "multipart/form-data" },
                token: userInfo.data.matricula,
            })
            .then(res => {
                console.log(res.data);
                var ProfileData = res.data;
                setProfile(ProfileData);
            }).catch(e => {
                console.log("Error: ",e);
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
                    <View>
                        <View style={styles.targets}>
                            <Text style={styles.h1}>Tu Credencial</Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <Spinner visible={isLoading} />
                        <View style={{ flex: 3, flexDirection: 'row', }}>
                            <View style={styles.column}>
                                <View style={styles.header}>
                                    <View style={styles.col2} >
                                        <Image source={headerC} style={{ maxWidth: 290, maxHeight: 70, }} />
                                    </View>
                                    <View style={{ paddingLeft: 89, padding: 20 }}>
                                        <Image style={styles.imageProfile} source={{ uri: 'https://utvt.alwaysdata.net/uploads/temp_user/' + profile.img, }} />
                                    </View>

                                    <Text style={{ textAlign: 'center' }}>{profile.nombre} {profile.apellidos}</Text>
                                    <Text style={{ textAlign: 'center' }}>{profile.matricula}</Text>
                                    <Text style={{ textAlign: 'center' }}>{profile.nombreCarrera}</Text>
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
                                                    <Image style={styles.imageProfileModal} source={{ uri: 'https://utvt.alwaysdata.net/uploads/QRAlumno/QR_' + profile.token + '.png', }} />
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
});
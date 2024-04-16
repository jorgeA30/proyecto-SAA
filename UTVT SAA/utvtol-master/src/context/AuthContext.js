import { Text, StyleSheet, View, Alert } from 'react-native';
import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, APIKEY } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);

    const login = (matricula, password) => {
        setIsLoading(true);

        axios
            .post(`${BASE_URL}/auth/login`, {
                headers: { "Accept": "application/json, text/plain, /", "Content-Type": "multipart/form-data" },
                apiKey: APIKEY,
                matricula: matricula,
                password: password
            })
            .then(res => {
                let userInfo = res.data;
                console.log(userInfo.success);
                setUserInfo(userInfo.success);
                AsyncStorage.setItem('userInfo', JSON.stringify(userInfo.success));
                setIsLoading(false);
                if (userInfo.remember_token != "" || userInfo.remember_token != null) {
                    Alert.alert("Inicio de sesion", "Has iniciado correctamente session");
                }
            })
            .catch(e => {
                console.log(`login error ${e}`);
                setIsLoading(false);
                Alert.alert('Error en el inicio de sesión', e.response ? e.response.data.error : 'Por favor, inténtalo de nuevo más tarde.');
            });
    }

    const logout = () => {
        setIsLoading(true);
        axios
            .post(`${BASE_URL}/auth/logout`, {
                headers: { "Accept": "application/json, text/plain, /", "Content-Type": "multipart/form-data" },
                "remember_token": userInfo.remember_token,
                "apiKey": APIKEY
            })
            .then(res => {
                if (res.status === 200) {
                    Alert.alert(res.data.message);
                } else {
                    Alert.alert(res.data.error || 'Error al cerrar sesión');
                }
                AsyncStorage.removeItem('userInfo');
                setUserInfo({});
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error al cerrar sesión:', error.response || error);
                Alert.alert('Error al cerrar sesión');
                setIsLoading(false);
            });
        //   AsyncStorage.removeItem('userInfo');
        // setUserInfo({});
    };


    const isLoggedIn = async () => {
        try {
            setSplashLoading(true);

            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);

            if (userInfo) {
                setUserInfo(userInfo);
            }

            setSplashLoading(false);
        } catch (e) {
            setSplashLoading(false);
            console.log(`is logged in error ${e}`);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userInfo,
                splashLoading,
                login,
                logout,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
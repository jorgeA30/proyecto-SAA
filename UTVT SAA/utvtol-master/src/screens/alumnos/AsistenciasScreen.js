import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, RefreshControl, Image, Pressable, Modal, Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { BASE_URL, APIKEY, BASE_URL_IMAGENES } from '../../config';
import { AuthContext } from '../../context/AuthContext';

export const CredencialScreen = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Función para obtener datos de la API
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/endpoint`, {
                headers: {
                    'Authorization': `Bearer ${APIKEY}`
                }
            });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Función para actualizar datos cuando se detecte un cambio en la base de datos
    const handleDatabaseChange = () => {
        // Lógica para detectar cambios en la base de datos y llamar fetchData()
    };

    // Función para manejar el pull-to-refresh
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData().then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        fetchData(); // Llama a fetchData al montar el componente
        // Configura el listener para detectar cambios en la base de datos
        // Por ejemplo:
        // const databaseListener = database.on('change', handleDatabaseChange);

        return () => {
            // Limpia el listener cuando se desmonta el componente
            // Por ejemplo:
            // databaseListener.off('change', handleDatabaseChange);
        };
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {loading ? (
                    <Spinner
                        visible={loading}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerText}
                    />
                ) : (
                    data.map((item, index) => (
                        <View key={index} style={styles.itemContainer}>
                            {/* Renderiza tus datos aquí */}
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemContainer: {
        marginBottom: 10,
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
    },
    spinnerText: {
        color: '#fff',
    },
});





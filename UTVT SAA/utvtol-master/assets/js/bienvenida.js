import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button, StyleSheet, Text, View, Image, SafeAreaView, ScrollView, RefreshControl, Dimensions, Alert } from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';
import app from '../../src/style/app';

export const bienvenida = () => {
    const { userInfo } = useContext(AuthContext);
    var myDate = new Date();
    var hrs = myDate.getHours();
    var nombre = userInfo.nombre;

    var saludar;

    if (hrs < 12)
        saludar = 'Buenos días';
    else if (hrs >= 12 && hrs <= 18)
        saludar = 'Buenas tardes';
    else if (hrs >= 18 && hrs <= 24)
        saludar = 'Buenas noches';


    return (
        <>
            <Text style={app.h1}>{ saludar } { nombre }</Text>
        </>
    )
}

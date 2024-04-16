import * as React from 'react';
import { View, Text, TouchableOpacity, Image, Button, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthContext } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import s from '../style/style';
import Icon from "react-native-vector-icons/FontAwesome"
import { FontAwesome5 } from '@expo/vector-icons';
//JS
import { bienvenida } from '../../assets/js/bienvenida';
//screens
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { PrestamosScreen } from '../screens/alumnos/PrestamosScreen';
import { ProfileScreen } from '../screens/alumnos/ProfileScreen';
import { CredencialScreen } from '../screens/alumnos/CredencialScreen';
import { ParkingScreen } from '../screens/alumnos/ParkingScreen';
import { SAHomeScreen } from '../screens/superAdmin/SAHomeScreen';
import { SAPrestamosScreen } from '../screens/superAdmin/SAPrestamosScreen';
import { SACredencialScreen } from '../screens/superAdmin/SACredencialScreen';
import { SAProfileScreen } from '../screens/superAdmin/SAProfileScreen';
import { NotificationView } from '../screens/alumnos/NotificationView';
import { MapaScreen } from '../screens/alumnos/MapaScreen';
import { HomeScreenChofer } from '../screens/chofer/HomeScreen';
import { BASE_URL_IMAGENES } from '../config';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export const DrawerNavigation = () => {
  const { userInfo, splashLoading, logout } = React.useContext(AuthContext);
  function DrawerMenu(props) {
    return (
      <TouchableOpacity onPress={props.navigation}>
        <View style={s.menuContainer}>
          <View style={s.iconoContainer}>
            <Icon size={17} name={props.iconName} />
          </View>
          <View style={s.tituloContainer}>
            <Text style={s.tituloTxt}>{props.titleName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  const Menu = (props) => {
    return (
      <View style={s.container}>
        <View style={s.bgContainer}>
          <TouchableOpacity>
            <View style={s.userContainer}>
              {userInfo.idRol === 1 ? (
                <Image style={s.userImagen} source={{ uri: `${BASE_URL_IMAGENES}` +'/'+ userInfo.imagen }} />
              ) : (
                <Image style={s.userImagen} source={{ uri: `${BASE_URL_IMAGENES}` +'/'+ userInfo.img }} />
              )}

            </View>
            <View style={s.userNombre}>
              <Text style={s.userTitulo} >{userInfo.nombre} {userInfo.apellidos}</Text>
            </View>
          </TouchableOpacity>
        </View>
        {splashLoading ? (
          <><DrawerMenu name="Splash Screen" component={SplashScreen} options={{ headerShown: false }} /></>
        ) : userInfo.idRol === 1 ? (
          <>
            <DrawerMenu iconName='home' titleName='Home' navigation={() => props.navigation.navigate('Home')} options={{ headerShown: false }} />
            <DrawerMenu iconName='refresh' titleName="Prestamos" navigation={() => props.navigation.navigate('Prestamos')} options={{ headerShown: false }} />
            <DrawerMenu iconName='address-card' titleName="Credencial" navigation={() => props.navigation.navigate('Credencial')} options={{ headerShown: false }} />
            {/* <DrawerMenu iconName='address-card' titleName="Corbatin" navigation={() => props.navigation.navigate('Parking')} options={{ headerShown: false }} /> */}
            <DrawerMenu iconName='user' titleName='Perfil' navigation={() => props.navigation.navigate('Perfil')} />
            <DrawerMenu iconName='bell' titleName='Notificationes' navigation={() => props.navigation.navigate('Notificationes')} />
            <DrawerMenu iconName='map' titleName='Mapa' navigation={() => props.navigation.navigate('Mapa')} />
          </>
        ) : userInfo.idRol === 2 ? (
          <DrawerMenu name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : userInfo.idRol === 3 ? (
          <DrawerMenu name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : userInfo.idRol === 4 ? (
          <>
            <DrawerMenu iconName='home' titleName='Home' navigation={() => props.navigation.navigate('HomeSuperAdmin')} options={{ headerShown: false }} />
            <DrawerMenu iconName='refresh' titleName='Prestamos' navigation={() => props.navigation.navigate('SAPrestamosScreen')} options={{ headerShown: false }} />
            <DrawerMenu iconName='address-card' titleName='Credencial' navigation={() => props.navigation.navigate('SACredencialScreen')} options={{ headerShown: false }} />
            <DrawerMenu iconName='user-circle' titleName='Perfil' navigation={() => props.navigation.navigate('SAProfileScreen')} options={{ headerShown: false }} />
          </>
        ) : userInfo.idRol === 8 ? (
          <>
            <DrawerMenu iconName='home' titleName='Home' navigation={() => props.navigation.navigate('HomeScreenChofer')} options={{ headerShown: false }} />
          </>
        ) : userInfo.idRol === 5 ? (
          <DrawerMenu name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <DrawerMenu name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
        <View style={s.bgContainer}>
        </View>
        <View style={s.footer}>
          <TouchableOpacity>
            <Pressable onPress={logout}>
              <Text style={s.boton} ><FontAwesome5 name="door-open" size={22} color="green" style={s.icons} />Salir</Text>
            </Pressable>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <Drawer.Navigator  drawerLabel={() => null} drawerContent={(props) => <Menu {...props} />} >
      {splashLoading ? (
        <><Drawer.Screen name="Splash Screen" component={SplashScreen} options={{ headerShown: false }} /></>
      ) : userInfo.idRol === 1 && userInfo ? (
        <>
          <Drawer.Screen name="Home" component={HomeScreen} options={{ headerShown: true, headerTitle: bienvenida }} />
          <Drawer.Screen name="Prestamos" component={PrestamosScreen} options={{ headerShown: true, headerTitle: "Prestamos" }} />
          <Drawer.Screen name="Credencial" component={CredencialScreen} options={{ headerShown: true, headerTitle: "Credencial" }} />
          {/* <Drawer.Screen name="Parking" component={ParkingScreen} options={{ headerShown: true, headerTitle: "Tu Corbatin" }} /> */}
          <Drawer.Screen name="Perfil" component={ProfileScreen} options={{ headerShown: true, headerTitle: "Perfil" }} />
          <Drawer.Screen name="Notificationes" component={NotificationView} options={{ headerShown: true, headerTitle: "Notificationes" }} />
          <Drawer.Screen name="Mapa" component={MapaScreen} options={{ headerShown: true, headerTitle: "Mapa" }} />
        </>
      ) : userInfo.idRol === 2 && userInfo ? (
        <>
          <Drawer.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="Prestamos" component={PrestamosScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="Credencial" component={CredencialScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="Perfil" component={ProfileScreen} options={{ headerShown: false }} />
        </>
      ) : userInfo.idRol === 3 && userInfo ? (
        <>
          <Drawer.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="Prestamos" component={PrestamosScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="Credencial" component={CredencialScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="Perfil" component={ProfileScreen} options={{ headerShown: false }} />
        </>
      ) : userInfo.idRol === 4 && userInfo ? (
        <>
          <Drawer.Screen name="HomeSuperAdmin" component={SAHomeScreen} options={{ headerShown: true, headerTitle: 'Home' }} />
          <Drawer.Screen name="SAPrestamosScreen" component={SAPrestamosScreen} options={{ headerShown: true, headerTitle: 'Prestamos' }} />
          <Drawer.Screen name="SACredencialScreen" component={SACredencialScreen} options={{ headerShown: true, headerTitle: 'Credencial' }} />
          <Drawer.Screen name="SAProfileScreen" component={SAProfileScreen} options={{ headerShown: true, headerTitle: 'Perfil' }} />
        </>
      ) : userInfo.idRol === 5 && userInfo ? (
        <>
          <Drawer.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="Prestamos" component={PrestamosScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="Credencial" component={CredencialScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="Perfil" component={ProfileScreen} options={{ headerShown: false }} />
        </>
      ) : userInfo.idRol === 8 && userInfo ? (
        <>
          <Drawer.Screen name="Home" component={HomeScreenChofer} options={{ headerShown: true }} />
        </>
      ) : userInfo.msg ? ( 
        <Drawer.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) :(
        <Drawer.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Drawer.Navigator>
  );
}

export const Navigation = () => {
  const { userInfo, splashLoading } = React.useContext(AuthContext);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {splashLoading ? (
          <Stack.Screen name="Splash Screen" component={SplashScreen} options={{ headerShown: false }} />
        ) : userInfo.remember_token ? (
          <Stack.Screen name="Home" component={DrawerNavigation} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}



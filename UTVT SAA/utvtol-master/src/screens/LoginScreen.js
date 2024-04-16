import {
  StyleSheet,
  View,
  TextInput,
  Button,
  ImageBackground,
  Image,
  Text,
} from 'react-native';
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
// import { getToken, onMessage } from 'firebase/messaging';
// import { messaging } from '../messages/messaging';

const image = {
  uri: 'https://vectorvisual.com.mx/wp-content/uploads/2021/02/w2_19814_2-1024x682.jpg',
};

export const LoginScreen = () => {
  const [matricula, setMatricula] = useState(null);
  const [password, setPassword] = useState(null);
  const { isLoading, login } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.container2}>
          <View style={styles.wrapper}>
            <View style={styles.wrapper2}>
              <Image
                source={require('../img/logo2.png')}
                style={{ maxWidth: 200, height: 99 }}
              />
            </View>
            <Text>Matricula</Text>
            <TextInput
              style={styles.input}
              value={matricula}
              placeholder="Ingresa tu matricula"
              onChangeText={text => setMatricula(text)}
            />
            <Text>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              placeholder="Ingresa tu Contraseña"
              onChangeText={text => setPassword(text)}
              secureTextEntry
            />

            <Button color="green" title="Ingresar" onPress={() => { login(matricula, password) }} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  container2: {
    flex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  wrapper: {
    width: '70%',
    paddingVertical: 20,
    backgroundColor: 'white',
    paddingRight: 20,
    paddingLeft: 20,
  },
  wrapper2: {
    paddingLeft: 5,
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 5,
    paddingHorizontal: 14,
  },
});

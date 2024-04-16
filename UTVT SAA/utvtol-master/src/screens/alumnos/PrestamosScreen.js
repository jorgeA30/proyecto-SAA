import React, { Component, useContext, useEffect, useState } from 'react';
import { Button, appheet, Text, FlatList, Touchable, View, SafeAreaView, Spinner, ScrollView, RefreshControl, Pressable, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { FontAwesome5 } from '@expo/vector-icons';
import app from '../../style/app';
import { TextInput } from 'react-native-gesture-handler';
import crearPrestamo from '../../../assets/components/crearPrestamo';


export const PrestamosScreen = () => {
  const { userInfo, isLoading } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedValueM, setSelectedValueM] = useState('');
  const [newCantidad, setNewCantidad] = useState('');
  const [prestamos2, setPrestamos2] = useState([]);
  const [data, setData] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [Prestamos, setPrestamos] = useState([]);
  const [cant, setCant] = useState(0);
  const [editedRowId, setEditedRowId] = useState(null);
  const [cantidad, setCantidad] = useState(null);
  const [cantidadToEdit, setCantidadToEdit] = useState(null);

  const editarCantidad = (row, cantidad) => {
    setEditedRowId(row);
    setCantidadToEdit(cantidad);
    setShowModal(true);
  };

  const saveCantidad = () => {
    if (editedRowId !== null) {
      const updatedPrestamos = prestamos2.map((prestamo) => {
        if (prestamo.id === editedRowId) {
          prestamo.cantidad = parseFloat(newCantidad);
        }
        return prestamo;
      });
      setPrestamos2(updatedPrestamos);
      setShowModal(false);
      setEditedRowId(null);
      setNewCantidad('');
    }
  };
  //Listar en el modal la lista de materiales
  const agregar = () => {
    console.log('Ya ingresaste a agregar')
    const selectedMaterial = selectedValueM; // Obtén el valor seleccionado de material de alguna manera
    const selectedUsuario = ''; // Obtén el valor seleccionado de usuario de alguna manera
    const selectedActivo = ''; // Obtén el valor seleccionado de activo de alguna manera
    const selectedStatus = ''; // Obtén el valor seleccionado de status de alguna manera
    // Json = json.push({'Material': materiales, "cantidad": cantidad})
    // const json = 
    // console.log("JSON ARRAY: ",Json);
    const nuevoPrestamo = {
      id: cant,
      idMaterial: selectedMaterial,
      cantidad: cantidad,
    };

    console.log("Nuevo Prestamo: ", nuevoPrestamo)

    setPrestamos2([...prestamos2, nuevoPrestamo]);
    setCant(cant + 1);
    console.log(prestamos2);
  };

  const eliminar = (row) => {
    const updatedPrestamos = prestamos2.filter((prestamo) => prestamo.id !== row);
    setPrestamos2(updatedPrestamos);
  };

  const guardar = () => {
    console.log(prestamos2);
  };

  // REFRESCAR LA VISTA

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [PrestamosView]);
  //VER LOS PRESTAMOS QUE A SOLICITADO EL ALUMNO
  const PrestamosView = () => {
    axios
      .post(`${BASE_URL}/alumno/prestamos`, {
        headers: { "Accept": "application/json, text/plain, /", "Content-Type": "multipart/form-data" },
        token: userInfo.token,
      })
      .then(res => {
        //-console.log(res.data);
        var PrestamoData = res.data;
        setPrestamos(PrestamoData);
      })
  };
  //EXTRAER LOS MATERIALES DESDE LA BASE DATOS CONSULTANDO MEDIANTE LA API
  const getMateriales = () => {
    axios
      .get(`${BASE_URL}/peticiones/materiales`, {
        timeout: 2000,
        headers: { "Accept": "application/json, text/plain, /", "Content-Type": "multipart/form-data" },
      })
      .then(res => {
        console.log(res.data);
        var materiales = res.data;
        setMateriales(materiales);
      })
  };
  const fetchData = () => {
    setIsRefreshing(true); // Marcar como refrescante
    setTimeout(() => {
      // Simular la obtención de nuevos datos
      const newData = [...data, prestamos2];
      setData(newData);
      setIsRefreshing(false); // Finalizar la actualización
    }, 1000);
  };

  useEffect(() => {
    PrestamosView();
    getMateriales();
    fetchData();
  }, [])


  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={app.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={PrestamosView, getMateriales} />
          }>
          {/* <View>
            <View style={app.targets}>
              <Text style={app.h1_screens}>Tus Prestamos</Text>
            </View>
          </View> */}
          <View style={app.container}>
            <View style={{ flex: 3, flexDirection: 'row', }}>
              <View style={app.column}>
                <View style={app.col}>
                  <View style={{ flex: 3, backgroundColor: '#ffffff', paddingTop: 20, borderRadius: 20, padding: 20 }}>
                    <View style={app.tableHeader}>
                      <Text style={app.headerText}>Num de proceso</Text>
                      <Text style={app.headerText}>Estado</Text>
                      <Text style={app.headerText}>Action</Text>
                    </View>
                    {Prestamos.map(item => (
                      <View style={app.tableRow} key={item.id}>
                        <Text style={app.rowText}>{item.Nproceso}</Text>
                        <Text style={app.rowText}>{item.status === 1 ? 'Prestado' : 'Devuelto'}</Text>
                        <TouchableOpacity
                          style={app.button}
                          onPress={() => alert(`Button clicked for Item ${item.Nproceso}`)}
                        >
                          <Text style={app.buttonText}><FontAwesome5 name="file-pdf" size={22} color="#ffffff" /></Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={app.col}>
                  <View style={{ flex: 3, backgroundColor: '#ffffff', paddingTop: 0, borderRadius: 20, padding: 20 }}>
                    <View style={app.centeredView}>

                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                          Alert.alert('Modal has been closed.');
                          setModalVisible(!modalVisible);
                        }}>
                        <View style={app.contenidoModal}>
                          <View style={app.modalView}>
                            {/* CONTENIDO DE MODAL */}
                            <Text>Material</Text>
                            <Picker
                              style={app.picker} itemStyle={app.pickerItem}
                              selectedValue={selectedValueM}
                              onValueChange={(itemValue) => setSelectedValueM(itemValue)}
                            >
                              <Picker.Item label="Selecciona un valor" value="Selecciona un valor" />
                              {materiales.map((item) => (
                                <Picker.Item label={item.nombreProducto} value={item.codigo} />
                              ))}
                            </Picker>
                            <Text>Cantidad</Text>
                            <TextInput
                              style={app.input}
                              value={cantidad}
                              placeholder="Ingresa la cantidad a solicitar"
                              onChangeText={text => setCantidad(text)}
                            />
                            <Pressable
                              style={[app.button2, app.buttonClose]}
                              onPress={() => setModalVisible(!modalVisible)}>
                              <Text style={app.textStyle}>Cerrar</Text>
                            </Pressable>
                            <Button title="Agregar prestamo" onPress={agregar} />
                            {/* Aquí puedes mostrar la lista de prestamos */}
                            <Button color="green" title="Solicitar Prestamo" onPress={guardar} />
                            <View style={{ padding: 20, with: 20 }}>
                              <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={fetchData} />}>
                                <FlatList
                                  data={prestamos2}
                                  keyExtractor={(item) => item.id.toString()}
                                  renderItem={({ item }) => (
                                    <>
                                      <View>
                                        <Text>ID: {item.id}</Text>
                                        <Text>Status: Prestado</Text>
                                        <Text>ID de Material: {item.idMaterial}</Text>
                                        <Text>Cantidad: {item.cantidad}</Text>
                                        <Text>Alumno: {userInfo.data.nombre} {userInfo.data.apellidos}</Text>
                                        <Button
                                          color="red"
                                          title="Eliminar"
                                          onPress={() => eliminar(item.id)}
                                        />
                                        <Button
                                          title="Editar Cantidad"
                                          onPress={() => {
                                            setShowModal(true);
                                            editarCantidad(item.id); // Establece la cantidad actual como valor inicial
                                          }}
                                        // onPress={() => editarCantidad(item.id)}
                                        />
                                      </View>
                                      <Modal
                                        visible={showModal}
                                        animationType="slide"
                                        transparent={true}
                                        onRequestClose={() => setShowModal(false)}
                                      >
                                        <View>
                                          <Text>Editar Cantidad</Text>
                                          <TextInput
                                            value={newCantidad}
                                            onChangeText={(text) => setNewCantidad(text)}
                                            keyboardType="numeric"
                                          />
                                          <Button
                                            title="Guardar"
                                            onPress={saveCantidad}
                                          />
                                          <Button
                                            title="Cancelar"
                                            onPress={() => setShowModal(false)}
                                          />
                                        </View>
                                      </Modal>
                                    </>
                                  )}
                                />
                              </ScrollView>
                            </View>
                          </View>
                        </View>
                      </Modal>
                    </View>
                    <View style={{ paddingTop: 0 }}>
                      <Pressable
                        style={[app.button, app.buttonOpen]}
                        onPress={() => setModalVisible(true)}>
                        <Text style={app.textStyle}>Solicitar Prestamo</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
                <View style={app.col}>
                  <View style={{ flex: 3, backgroundColor: '#ffffff', paddingTop: 0, borderRadius: 20, padding: 20 }}>
                    <View style={app.centeredView}>

                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView >
    </>
  );
}
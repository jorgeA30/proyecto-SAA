import React, { useState } from 'react';
import { View, Text, TextInput, Picker, Button, ScrollView } from 'react-native';

function App() {
  const [status, setStatus] = useState('');
  const [fechaPrestamo, setFechaPrestamo] = useState('');
  const [material, setMaterial] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [usuario, setUsuario] = useState('');
  const [activo, setActivo] = useState('');
  const [prestamos, setPrestamos] = useState([]);
  let cant = 0;

  const agregar = () => {
    const selectedMaterial = ''; // Obtén el valor seleccionado de material de alguna manera
    const selectedUsuario = ''; // Obtén el valor seleccionado de usuario de alguna manera
    const selectedActivo = ''; // Obtén el valor seleccionado de activo de alguna manera
    const selectedStatus = ''; // Obtén el valor seleccionado de status de alguna manera

    const nuevoPrestamo = {
      id: cant,
      status: selectedStatus,
      fechaPrestamo: fechaPrestamo,
      idMaterial: selectedMaterial,
      cantidad: cantidad,
      alumno: selectedUsuario,
      activo: selectedActivo,
    };

    setPrestamos([...prestamos, nuevoPrestamo]);
    cant++;
  };

  const eliminar = (row) => {
    const updatedPrestamos = prestamos.filter((prestamo) => prestamo.id !== row);
    setPrestamos(updatedPrestamos);
  };

  const guardar = () => {
    // Envía los datos a tu servidor aquí
  };
  
  const editarCantidad = (row) => {
    const canti = parseFloat(prompt("Nueva Cantidad"));
    const updatedPrestamos = prestamos.map((prestamo) => {
      if (prestamo.id === row) {
        prestamo.cantidad = canti;
      }
      return prestamo;
    });
    setPrestamos(updatedPrestamos);
  };

  return (
    <ScrollView>
      <View>
        <Text>Status</Text>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
        >
          <Picker.Item label="Selecciona un status" value="0" />
          <Picker.Item label="Prestado" value="1" />
          <Picker.Item label="Devuelto" value="2" />
        </Picker>
      </View>
      <View>
        <Text>Fecha de Prestamo</Text>
        <TextInput
          value={fechaPrestamo}
          onChangeText={(text) => setFechaPrestamo(text)}
        />
      </View>
      <View>
        <Text>Material</Text>
        {/* Aquí puedes mostrar la lista de materiales */}
      </View>
      <View>
        <Text>Cantidad</Text>
        <TextInput
          value={cantidad}
          onChangeText={(text) => setCantidad(text)}
          keyboardType="numeric"
        />
      </View>
      <View>
        <Text>Alumno</Text>
        {/* Aquí puedes mostrar la lista de alumnos */}
      </View>
      <View>
        <Text>Activo</Text>
        <Picker
          selectedValue={activo}
          onValueChange={(itemValue) => setActivo(itemValue)}
        >
          <Picker.Item label="Si" value="1" />
          <Picker.Item label="No" value="2" />
        </Picker>
      </View>
      <Button title="Agregar prestamo" onPress={agregar} />
      {/* Aquí puedes mostrar la lista de prestamos */}
      <Button title="Guardar" onPress={guardar} />
    </ScrollView>
  );
}

export default App;

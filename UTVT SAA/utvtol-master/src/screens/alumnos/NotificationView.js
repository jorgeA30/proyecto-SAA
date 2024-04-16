import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, FlatList, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

export const NotificationView = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(handleNotification);

    return () => {
      subscription.remove();
    };
  }, []);

  function handleNotification(notification) {
    setNotifications((prevNotifications) => [...prevNotifications, notification]);
  }

  return (
    <SafeAreaView>
      {/* <View>
        <View style={styles.targets}>
          <Text style={styles.h1}>Notificaciones</Text>
        </View>
      </View> */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.request.identifier}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>ID: {item.request.identifier}</Text>
            <Text>Título: {item.request.content.title}</Text>
            <Text>Cuerpo: {item.request.content.body}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f2f7',
    },
    welcome: {
        fontSize: 18,
        marginBottom: 8,
    },
    targets: {
        padding: 30,
        backgroundColor: 'white',
    },
    footer: {
        flex: 2,
    },
    h1: {
        fontSize: 20,
        textAlign: 'center',
    },
    containerDatable: {
        flex: 4,
        width: '100%',
        alignSelf: 'center',
        paddingTop: 20
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    body: {
        fontSize: 16,
    },
});

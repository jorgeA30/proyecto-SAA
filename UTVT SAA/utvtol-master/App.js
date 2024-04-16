import React from 'react';
import { StatusBar } from 'react-native';
import { Navigation } from './src/components/Navigation';
import { AuthProvider } from './src/context/AuthContext';
import  Footer  from './assets/js/Footer';

export const App = () => {
  return (
    <AuthProvider>
      <StatusBar backgroundColor="#027e3a" />
      <Navigation />
      <Footer />
    </AuthProvider>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Link, useRouter } from 'expo-router';
import axiosInstance from '../../axiosConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Login() {
  const router = useRouter();
  const [logoutPopup, setlogoutPopup] = useState(false);
  const [pharmacy, setpharmacy] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [pharmacydetails, setpharmacydetails] = useState();
  const [Wholesaler, setWholesaler] = useState([]);


  const handledetails = async (pharmacy: String) => {
    try {
      const [pharmacyResponse, wholesalersResponse] = await Promise.all([
        axiosInstance.get(`/pharmacies/${pharmacy}/full`),
        axiosInstance.get(`/pharmacies/${pharmacy}/wholesalers`)
      ]);

      setpharmacydetails(pharmacyResponse.data);
      setWholesaler(wholesalersResponse.data);
      setModalVisible(true);
    } catch (error) {
      console.error('Error showing details', error);
    }
  };
  useEffect(() => {
    getPharmacy();
  }, []);

  const getPharmacy = async () => {
    try {
      const response = await axiosInstance.get('/pharmacies/management');
      setpharmacy(response.data);
    } catch (error) {}
    };

    const handleLogout = async () => {
      try {
        await SecureStore.deleteItemAsync('userToken');
        router.replace('/login');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };
    const handleCancel = () => {
      setlogoutPopup(false);
    };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    <View style={styles.container}>
      <Text style={styles.title}>Please choose a pharmacy:</Text>
      <ScrollView>
      {pharmacy.map((pharmacy, index) => (
        <TouchableOpacity onPress={() => router.replace(`/home/${pharmacy.pharmacyId}`) } style={styles.requestBox}>

            <Text style={styles.title1}>{pharmacy.doingBusinessAs}</Text>
            <Text style=
            {{color: 'grey'}}>Number of Return Requests: {pharmacy.numberOfReturns}</Text>

            <LinearGradient
            colors={[ 'lightblue', '#0096FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.detailsbtn}>
            <TouchableOpacity onPress={() => {handledetails(pharmacy.pharmacyId)}}>
              <Text style={{color: 'white', fontSize: 13}}>details</Text>
            </TouchableOpacity>
            </LinearGradient>
        </TouchableOpacity>
      ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {pharmacydetails && 
            <View style={styles.detailspopup}>
              <View style={{alignItems: 'center'}}>
              <Text style={styles.title}>{pharmacydetails.pharmacy.doingBusinessAs}</Text>
              </View>
              <Text style={styles.popuptext}>Company Type: {pharmacydetails.pharmacy.companyType}</Text>
              <Text style={styles.popuptext}>Pharmacy Address: {pharmacydetails.pharmacyCompanyAddressInfo.address1}</Text>
              <Text style={styles.popuptext}>Pharmacy Phone: {pharmacydetails.pharmacyContactInfo.phone}</Text>
            </View>}

            {Wholesaler.map((Wholesaler, index) => (
          <View key={index} >
            <Text style={styles.popuptext}>Wholeseler {index+1}</Text>
            <Text style={styles.popuptext}>Name: {Wholesaler.name}</Text>
          </View>
        ))}

            {/* Cancel Button */}
            <View style={{alignItems: 'center', marginTop: 10}}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
       {/* Log Out Button */}
       <View style={styles.center}>
      <TouchableOpacity style={styles.logoutbtn} onPress={ () => {setlogoutPopup(true);}}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
      </View>

        {/* Logout Popup */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutPopup}
        onRequestClose={() => {
          setlogoutPopup(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            {/* Input for Service */}
            <Text style={{fontSize: 20, textAlign: 'center'}}>Are you sure you want to logout?</Text>
            
            <View style={styles.buttons}>
            {/* Cancel Button */}
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitBtn} onPress={ () => router.replace('/login')}>
                <Text style={styles.buttonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  requestBox: {
    backgroundColor: '#FFC6BD',
    padding: 30,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center'
  },
  title: {
    fontSize: 25,
    marginBottom: 20,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#0096FF'
  },
  title1: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'white'
  },
  logoutbtn: {
    backgroundColor: 'red',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
    bottom: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  center:{
    alignItems: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  cancelBtn: {
    backgroundColor: 'grey',
    borderRadius: 10,
    height: 40,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    marginRight: 10,
  },
  submitBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons:{
    flexDirection: 'row', // Arrange children horizontally
    marginTop: 20,  
    justifyContent: 'center',
  }, 
  detailsbtn:{
    width: 60,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    right: 20,
    position: 'absolute'
  },
  
  detailstitle:{
    textAlign: 'center', 
    fontSize: 20, 
    fontWeight: 'bold', 
    margin: 10,
    color: ''
  },
  popuptext:{
    marginBottom: 10,
    textAlign: 'left'
  }

});

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useLocalSearchParams} from 'expo-router';
import axiosInstance from '../../../axiosConfig';
import { SelectList } from 'react-native-dropdown-select-list';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  const router = useRouter();
  const [createPopup, setcreatePopup] = useState(false);
  const [logoutPopup, setlogoutPopup] = useState(false);
  const [serviceType, setServiceType] = useState('');
  const [wholesalerId, setWholesalerId] = useState('');
  const [returnRequests, setReturnRequests] = useState([]);
  const data = [
    {key:'1',value:'FULL_SERVICE'},
    {key:'2',value:'EXPRESS_SERVICE'},
  ];
  const { pharmacy } = useLocalSearchParams<{ pharmacy: string }>();
  const fetchReturnRequests = async () => {
    try {
      const response = await axiosInstance.get(`/pharmacies/${pharmacy}/returnrequests`);
      const returnRequests = response.data.content.map(item => item.returnRequest);
      setReturnRequests(returnRequests);
    } catch (error) {
      console.error('Error fetching return requests:', error);
    }
  };

  useEffect(() => {
    if (pharmacy) {
      fetchReturnRequests();
    }
  }, [pharmacy]);
    
    const handleCreateReturnRequest = () => {
      setcreatePopup(true);
      };

      
      const handleSubmitReturnRequest = async () => {
        try {
      const response = await axiosInstance.post(`/pharmacies/${pharmacy}/returnrequests`, { serviceType, wholesalerId });
      // Assuming the response contains the new return request
      const newRequest = response.data;
      setReturnRequests([...returnRequests, newRequest]);
    } catch (error) {
      console.error('Error creating return request:', error);
    }

    setcreatePopup(false);
    setServiceType('');
    setWholesalerId('');
  };

  const handleCancel = () => {
    setcreatePopup(false);
    setServiceType('');
    setWholesalerId('');
  };
  const firstRequest = returnRequests.length > 0 ? returnRequests[0] : null;


 
  return (
    <View style={styles.container}>
      {/* PHARMACY NAME */}
    {firstRequest && (
        <Text
        style={{fontSize: 20, fontWeight: 'bold', color: '#0096FF'}}
        >{firstRequest.pharmacy.doingBusinessAs}</Text>
      )}
      {/* Left Arrow Button */}
      <TouchableOpacity style={styles.arrowButton} onPress={() => router.replace('/home')}>
        <Text style={styles.arrowText}>←</Text>
      </TouchableOpacity>

      {/* Create Return Request Button */}
      <LinearGradient
      colors={[ 'lightblue', '#0096FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.mainbtn}>
      <TouchableOpacity  onPress={handleCreateReturnRequest}>
        <Text style={styles.buttonText}>+ Create Return Request</Text>
      </TouchableOpacity>
      </LinearGradient>

      {/* Popup Create Return Request */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={createPopup}
        onRequestClose={() => {
          setcreatePopup(false);
        }}
      >
         <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            {/* Input for Service */}
            <Text style={styles.text}>Service Type</Text>
            <SelectList 
                setSelected={(val) => setServiceType(val)} 
                data={data} 
                save="value"
            />

            {/* Input for Wholesaler ID */}
            <Text style={styles.text}>Wholesaler ID</Text>
            <TextInput
              style={styles.modalInput}
              value={wholesalerId}
              onChangeText={setWholesalerId}
              placeholder="Enter Wholesaler ID"
            />

          <View style={styles.buttons}>
            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitReturnRequest}>
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Display Return Requests */}
      <ScrollView style={styles.requestsContainer}>
        {returnRequests.map((request, index) => (
          <TouchableOpacity key={index} style={styles.requestBox} onPress={ () => router.replace(`/home/${pharmacy}/returnreq/${request.id}`)}>
            <Text style={styles.title}>Return Request {index+1}</Text>
            <Text style={{color: 'grey'}}>Service Type: {request.serviceType}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Log Out Button */}
      <View style={{alignItems: 'center'}}>
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

            <Text style={{fontSize: 20, textAlign: 'center'}}>Are you sure you want to logout?</Text>
            
            <View style={styles.buttons}>
            {/* Cancel Button */}
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setlogoutPopup(false) }>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainbtn: {
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
  },
  modalPicker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  modalInput: {
    height: 50,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  submitBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: 'grey',
    borderRadius: 10,
    padding: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  requestsContainer: {
    flex: 1,
    width: '100%',
    marginTop: 20,
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
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'white'
  },
  arrowButton: {
    position: 'absolute',
    top: 5,
    left: 20,
    padding: 10,
    zIndex: 1
  },
  arrowText: {
    fontSize: 24,
    color: '#0096FF',
  },
  buttons:{
    flexDirection: 'row', // Arrange children horizontally
    marginTop: 20,  
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10, 
    marginTop: 20,
  }
});

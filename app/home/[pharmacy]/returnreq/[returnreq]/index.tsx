import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import axiosInstance from '../../../../../axiosConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

export default function Login() {
  const router = useRouter();
  const { returnreq } = useLocalSearchParams<{ returnreq: string }>();
  const { pharmacy } = useLocalSearchParams<{ pharmacy: string }>();
  const [request, setrequest] = useState();
  const [items, setitems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [ndc, setNdc] = useState('');
  const [description, setDescription] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [packageSize, setPackageSize] = useState('');
  const [requestType, setRequestType] = useState('');
  const [name, setName] = useState('');
  const [strength, setStrength] = useState('');
  const [dosage, setDosage] = useState('');
  const [fullQuantity, setFullQuantity] = useState('');
  const [partialQuantity, setPartialQuantity] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [status, setStatus] = useState('');
  const [lotNumber, setLotNumber] = useState('');

  useEffect(() => {
    getReturnRequest();
    getItemsReturnRequest();
}, [pharmacy, returnreq]);
  const getReturnRequest = async () => {
    try {
      console.log(pharmacy, returnreq);
      const response = await axiosInstance.get(`/pharmacies/${pharmacy}/returnrequests/${returnreq}`);
      console.log(response.data);
      setrequest(response.data);
    } catch (error) {}
    };
    const getItemsReturnRequest = async () => {
        try {
          console.log(pharmacy, returnreq);
          const response = await axiosInstance.get(`/pharmacies/${pharmacy}/returnrequests/${returnreq}/items`);
          console.log(response.data);
          setitems(response.data);
        } catch (error) {}
        };
        
        const deleteItem = async(itemId: String) => {
            // Your delete logic here
            try {
                await axiosInstance.delete(`/pharmacies/${pharmacy}/returnrequests/${returnreq}/items/${itemId}`);
                setitems(items.filter(item => item.id !== itemId));
              } catch (error) {}
              
            console.log('Item deleted:', itemId);
          };
        const renderRightActions = (progress, dragX, itemId) => {
            return (
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(itemId)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            );
          };

          const handleSubmitReturnRequest = async() => {
            try {
                const response = await axiosInstance.post(`/pharmacies/${pharmacy}/returnrequests/${returnreq}/items`,{
                    ndc, description, manufacturer, packageSize, requestType, name, strength, dosage, fullQuantity, partialQuantity, expirationDate, status, lotNumber
                });
                console.log(response.data);
                setitems([...items, response.data]);
            } catch (error) {

            }
          }
  

  return (
    <View style={styles.container}>

        {/* TITLE */}
        <View style={{alignItems: 'center'}}>
            <Text 
            style={{fontSize: 25, fontWeight: 'bold', color: '#0096FF', marginBottom: 20}}
            > Return Request
            </Text>
        </View>

      {/* Left Arrow Button */}
      <TouchableOpacity style={styles.arrowButton} onPress={() => router.replace(`/home/${pharmacy}`)}>
        <Text style={styles.arrowText}>←</Text>
      </TouchableOpacity>

          {/* information about return request */}
          {request && 
          <View>
            <Text style={styles.info}>Creation Date: {request.createdAt}</Text>
            <Text style={styles.info}>Pharmacy Name: {request.pharmacy.doingBusinessAs}</Text>
            <Text style={styles.info}>Service Type: {request.serviceType}</Text>
          </View>
          }

          {/* ITEMS */}
          <Text style={{fontSize: 25, fontWeight: 'bold', marginBottom:10, color: '#0096FF' }}>Items:</Text>
          <ScrollView>
            <View>
            {items.length > 0 && items.map((item, index) => (      <GestureHandlerRootView>
      <Swipeable renderRightActions={(progress: any, dragX: any) => renderRightActions(progress, dragX, item.id)}>
            <TouchableOpacity key={index} style={styles.item} onPress={() => {router.replace(`/home/${pharmacy}/returnreq/${returnreq}/${item.id}`)}}>
                <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom:10, color: 'white' }}>{item.name}</Text>
                <Text style={styles.desc}>Description: {item.description}</Text>
                <Text style={styles.desc}>Package Size: {item.packageSize}</Text>
                <Text style={styles.desc}>Strength: {item.strength}</Text>
                <Text style={styles.desc}>Expiration Date: {item.expirationDate}</Text>
                <Text style={styles.desc}>Status: {item.status}</Text>
            </TouchableOpacity>
        </Swipeable>
        </GestureHandlerRootView>
        ))}
            </View>
          </ScrollView>
      {/* <Text style={styles.title}>test</Text> */}

      <TouchableOpacity onPress={() => {setModalVisible(true)}}>
    <LinearGradient 
    colors={[ 'lightblue', '#0096FF']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.mainbtn}>
        <Text style={{fontSize: 20, color: 'white', marginBottom: 10}}>+ Add Item</Text>
      </LinearGradient>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(false);
        }}
      >
            <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{fontSize: 25, fontWeight: 'bold', color: '#0096FF', marginBottom: 20}}>Add Item</Text>
            <ScrollView>
          <Text style={styles.label}>NDC</Text>
      <TextInput
        style={styles.input}
        value={ndc}
        onChangeText={setNdc}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Manufacturer</Text>
      <TextInput
        style={styles.input}
        value={manufacturer}
        onChangeText={setManufacturer}
      />

      <Text style={styles.label}>Package Size</Text>
      <TextInput
        style={styles.input}
        value={packageSize}
        onChangeText={setPackageSize}
      />

      <Text style={styles.label}>Request Type</Text>
      <TextInput
        style={styles.input}
        value={requestType}
        onChangeText={setRequestType}
      />

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Strength</Text>
      <TextInput
        style={styles.input}
        value={strength}
        onChangeText={setStrength}
      />

      <Text style={styles.label}>Dosage</Text>
      <TextInput
        style={styles.input}
        value={dosage}
        onChangeText={setDosage}
      />

      <Text style={styles.label}>Full Quantity</Text>
      <TextInput
        style={styles.input}
        value={fullQuantity}
        onChangeText={setFullQuantity}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Partial Quantity</Text>
      <TextInput
        style={styles.input}
        value={partialQuantity}
        onChangeText={setPartialQuantity}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Expiration Date</Text>
      <TextInput
        style={styles.input}
        value={expirationDate}
        onChangeText={setExpirationDate}
      />

      <Text style={styles.label}>Status</Text>
      <TextInput
        style={styles.input}
        value={status}
        onChangeText={setStatus}
      />

      <Text style={styles.label}>Lot Number</Text>
      <TextInput
        style={styles.input}
        value={lotNumber}
        onChangeText={setLotNumber}
      />

            {/* Cancel Button */}
            </ScrollView>
            <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitReturnRequest}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  requestBox: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 20
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
  item: {
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
deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: 200,
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
    height: '80%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
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
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  info: {
    marginBottom: 10,
    marginLeft: 20,
  },
  mainbtn: {
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  desc:{
    marginBottom: 5,
    color: 'grey',
  },
  buttons:{
    flexDirection: 'row', // Arrange children horizontally
    marginTop: 20,  
    justifyContent: 'center',
  }, 

});

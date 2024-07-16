import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import axiosInstance from '../../../../../axiosConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Item() {
  const router = useRouter();
  const { returnreq } = useLocalSearchParams<{ returnreq: string }>();
  const { pharmacy } = useLocalSearchParams<{ pharmacy: string }>();
  const { item } = useLocalSearchParams<{ item: string }>();
  const [itemdetails, setItemDetails] = useState({
    ndc: '',
    description: '',
    manufacturer: '',
    packageSize: '',
    requestType: '',
    name: '',
    strength: '',
    dosage: '',
    fullQuantity: '',
    partialQuantity: '',
    expirationDate: '',
    itemStatus: '',
    lotNumber: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getReturnRequest();
  }, [pharmacy, returnreq, item]);

  const getReturnRequest = async () => {
    try {
      const response = await axiosInstance.get(`/pharmacies/${pharmacy}/returnrequests/${returnreq}/items/${item}`);
      console.log(response.data);
      setItemDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch item details:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.put(`/pharmacies/${pharmacy}/returnrequests/${returnreq}/items/${item}`, {
        ndc: itemdetails.ndc,
        description: itemdetails.description,
        manufacturer: itemdetails.manufacturer,
        packageSize: itemdetails.packageSize,
        requestType: itemdetails.requestType,
        name: itemdetails.name,
        strength: itemdetails.strength,
        dosage: itemdetails.dosage,
        fullQuantity: itemdetails.fullQuantity,
        partialQuantity: itemdetails.partialQuantity,
        expirationDate: itemdetails.expirationDate,
        status: itemdetails.itemStatus,
        lotNumber: itemdetails.lotNumber
      });
      setIsEditing(false); // Switch back to view mode
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Left Arrow Button */}
      <TouchableOpacity style={styles.arrowButton} onPress={() => router.replace(`/home/${pharmacy}/returnreq/${returnreq}`)}>
        <Text style={styles.arrowText}>←</Text>
      </TouchableOpacity>

      {itemdetails && (
        <View>
        <View style={{alignItems: 'center'}}>
            <Text 
            style={{fontSize: 25, fontWeight: 'bold', color: '#0096FF', marginBottom: 20}}
            > {itemdetails.name} Details
            </Text>
        </View>
        <ScrollView style={styles.detailsContainer}>
          <Text style={styles.desc}>ID: {itemdetails.id}</Text>
          <Text style={styles.desc}>Created At: {itemdetails.createdAt}</Text>
          <Text style={styles.desc}>Updated At: {itemdetails.updatedAt}</Text>

            
       
            <>
              <Text style={styles.label}>NDC</Text>
              <Text>{itemdetails.ndc}</Text>

              {isEditing ? (
              <>
                  <Text style={styles.label}>Description</Text>
                  <TextInput style={styles.input} value={itemdetails.description} onChangeText={(value) => setItemDetails({ ...itemdetails, description: value })} />
                  
              </>
            ) : (
              <>
                <Text style={styles.label}>Description</Text>
                <Text>{itemdetails.description}</Text>
              </>
            )}
              <Text style={styles.label}>Manufacturer</Text>
              <Text>{itemdetails.manufacturer}</Text>

              <Text style={styles.label}>Package Size</Text>
              <Text>{itemdetails.packageSize}</Text>

              <Text style={styles.label}>Request Type</Text>
              <Text>{itemdetails.requestType}</Text>

              <Text style={styles.label}>Strength</Text>
              <Text>{itemdetails.strength}</Text>

              <Text style={styles.label}>Dosage</Text>
              <Text>{itemdetails.dosage}</Text>

              <Text style={styles.label}>Full Quantity</Text>
              <Text>{itemdetails.fullQuantity}</Text>

              <Text style={styles.label}>Partial Quantity</Text>
              <Text>{itemdetails.partialQuantity}</Text>

              <Text style={styles.label}>Expiration Date</Text>
              <Text>{itemdetails.expirationDate}</Text>

              <Text style={styles.label}>Status</Text>
              <Text>{itemdetails.itemStatus}</Text>

              <Text style={styles.label}>Lot Number</Text>
              <Text>{itemdetails.lotNumber}</Text>


              {isEditing ? (
              <>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
               
              </>
            ) : (
              <>
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <LinearGradient colors={[ 'lightblue', '#0096FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.mainbtn}>
                <Text style={styles.editButtonText}>Edit</Text>
                </LinearGradient>
              </TouchableOpacity>
               
              </>
            )}
            </>
        </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  arrowButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  arrowText: {
    fontSize: 24,
    color: '#0096FF',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  desc:{
    marginBottom: 5,
    color: 'grey',
  },
  mainbtn: {
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

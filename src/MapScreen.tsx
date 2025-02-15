import {Alert, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import MapView, {Marker} from 'react-native-maps';

const MAP_API_KEY = 'AIzaSyCou66m-iQv3uTp2LxwTh-n29CHHsknHqo';
const SEARCH_RADIUS = 3000;

const MapScreen = () => {
  const [region, setRegion] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const result = await check(permission);

    if (result === RESULTS.GRANTED) {
      getCurrentLocation();
    } else {
      await requestLocationPermission();
    }
  };

  const requestLocationPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    try {
      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        console.log('✅ Location permission granted');
        getCurrentLocation();
      } else {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to show nearby hospitals.',
        );
      }
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        fetchNearbyHospitals(latitude, longitude);
      },
      error => Alert.alert('Error', error.message),
      {enableHighAccuracy: false, timeout: 10000, maximumAge: 1000},
    );
  };

  const fetchNearbyHospitals = async (latitude, longitude) => {
    try {
      console.log('🔎 Fetching hospitals for:', latitude, longitude);
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${SEARCH_RADIUS}&type=hospital&key=${MAP_API_KEY}`,
      );

      if (response.data.status !== 'OK') {
        return;
      }
      setHospitals(response.data.results);
    } catch (error) {}
  };

  if (!region) return null;

  return (
    <MapView
      style={{flex: 1}}
      region={region}
      showsUserLocation={true}
      followsUserLocation={true}>
      {hospitals.map((hospital, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: hospital.geometry.location.lat,
            longitude: hospital.geometry.location.lng,
          }}
          title={hospital.name}
          description={hospital.vicinity}
        />
      ))}
    </MapView>
  );
};

export default MapScreen;

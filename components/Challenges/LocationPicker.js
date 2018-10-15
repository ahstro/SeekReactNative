// @flow

import React from "react";
import { TouchableHighlight, Text, View } from "react-native";
import MapView from "react-native-maps";

import styles from "../../styles/locationPicker";

type Props = {
  navigation: any
}

const LocationPicker = ( { navigation }: Props ) => {
  const { location, latitude, longitude } = navigation.state.params;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Looking for species in a 50 mile radius around this point:
      </Text>
      <Text style={styles.locationText}>{location}</Text>
      <View style={styles.mapContainer}>
        <MapView
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
      </View>
      <TouchableHighlight style={styles.button}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableHighlight>
    </View>
  );
};

export default LocationPicker;

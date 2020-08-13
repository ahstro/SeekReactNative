// @flow
import React, { useState, useCallback, useEffect, useContext } from "react";
import { View } from "react-native";
import { Circle } from "react-native-svg";
import { XAxis, LineChart } from "react-native-svg-charts";
import inatjs from "inaturalistjs";
import { useIsFocused } from "@react-navigation/native";

import { colors } from "../../../styles/global";
import styles from "../../../styles/species/speciesChart";
import SpeciesDetailCard from "../../UIComponents/SpeciesDetailCard";
import { capitalizeNames } from "../../../utility/helpers";
import { createShortMonthsList } from "../../../utility/dateHelpers";
import createUserAgent from "../../../utility/userAgent";
import { SpeciesDetailContext } from "../../UserContext";
import { useLocationPermission } from "../../../utility/customHooks";
import { fetchTruncatedUserLocation } from "../../../utility/locationHelpers";

type Props = {
  +id: ?number
};

const SpeciesChart = ( { id }: Props ) => {
  const { localSeasonality } = useContext( SpeciesDetailContext );
  const granted = useLocationPermission();

  const isFocused = useIsFocused();
  const allMonths = createShortMonthsList();
  const [data, setData] = useState( [] );
  const [latLng, setLatLng] = useState( {} );

  const getGeolocation = useCallback( () => {
    fetchTruncatedUserLocation().then( ( { latitude, longitude } ) => {
      setLatLng( { latitude, longitude } );
    } ).catch( ( errorCode ) => console.log( errorCode, "error fetching geolocation" ) );
  }, [] );

  const fetchHistogram = useCallback( () => {
    const params = {
      date_field: "observed",
      interval: "month_of_year",
      taxon_id: id
    };

    if ( localSeasonality ) {
      // $FlowFixMe
      params.lat = latLng.latitude;
      // $FlowFixMe
      params.lng = latLng.longitude;
      // $FlowFixMe
      params.radius = 50;
    }

    const options = { user_agent: createUserAgent() };

    inatjs.observations.histogram( params, options ).then( ( { results } ) => {
      const countsByMonth = results.month_of_year;
      const obsByMonth = [];

      for ( let i = 1; i <= 12; i += 1 ) {
        obsByMonth.push( {
          month: i,
          count: countsByMonth[i]
        } );
      }
      setData( obsByMonth );
    } ).catch( ( err ) => {
      console.log( err, ": couldn't fetch histogram" );
    } );
  }, [id, localSeasonality, latLng] );

  useEffect( () => { getGeolocation(); }, [granted, getGeolocation] );

  useEffect( () => {
    if ( isFocused ) {
      fetchHistogram();
    }
  }, [id, fetchHistogram, isFocused] );

  const formatXAxis = ( index ) => capitalizeNames( allMonths[index] );

  // $FlowFixMe
  const Decorator = ( { x, y } ) => data.map( ( value ) => (
    <Circle
      key={`circle-${value.month}`}
      cx={x( value.month )}
      cy={y( value.count )}
      fill={colors.seekiNatGreen}
      r={4}
    />
  ) );

  return (
    <SpeciesDetailCard text="species_detail.monthly_obs" hide={!id || data.length === 0}>
      {data.length > 0 && (
        <View style={styles.container}>
          <View style={styles.chartRow}>
            <LineChart
              contentInset={styles.chartInset}
              data={data}
              style={styles.chart}
              svg={{ stroke: colors.seekForestGreen }}
              xAccessor={( { item } ) => item.month}
              yAccessor={( { item } ) => item.count}
            >
              <Decorator />
            </LineChart>
            <XAxis
              contentInset={styles.xAxisWidth}
              data={data}
              formatLabel={value => formatXAxis( value - 1 )}
              style={styles.xAxis}
              svg={{
                fontSize: 18,
                fill: colors.seekTeal
              }}
              xAccessor={( { item } ) => item.month}
            />
          </View>
        </View>
      )}
    </SpeciesDetailCard>
  );
};

export default SpeciesChart;

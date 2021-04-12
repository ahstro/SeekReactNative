// @flow

import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import type { Node } from "react";

import i18n from "../../../i18n";
import styles from "../../../styles/camera/arCamera";
import icons from "../../../assets/icons";
import rankDict from "../../../utility/dictionaries/rankDict";
import { getTaxonCommonName } from "../../../utility/commonNamesHelpers";
import GreenRectangle from "../../UIComponents/GreenRectangle";
import { colors } from "../../../styles/global";
import { useFetchUserSettings } from "../../../utility/customHooks";

type Props = {
  +ranks: Object
}

const ARCameraHeader = ( { ranks }: Props ): Node => {
  const rankToRender = Object.keys( ranks )[0] || null;
  const [commonName, setCommonName] = useState( null );
  const { scientificNames } = useFetchUserSettings( );
  const showScientificName = scientificNames || !commonName;

  let id = null;

  if ( rankToRender && !scientificNames ) {
    id = ranks[rankToRender][0].taxon_id;
  } else {
    id = null;
  }

  const rankList = ["kingdom", "phylum", "class", "order", "family", "genus", "species"];

  useEffect( () => {
    if ( id ) { // only update when id changes to avoid camera stutter on Android
      getTaxonCommonName( id ).then( ( name ) => {
        setCommonName( name );
      } );
    }
  }, [id] );

  return (
    <View style={styles.header}>
      {( ranks && rankToRender ) && (
        <>
          <View style={styles.greenButton}>
            <GreenRectangle text={i18n.t( rankDict[rankToRender] )} letterSpacing={0.94} color={colors.seekGreen} />
          </View>
          <Text style={[styles.predictions, showScientificName && styles.scientificName]}>
            {showScientificName ? ranks[rankToRender][0].name : commonName}
          </Text>
          <View style={styles.row}>
            {rankList.map( ( rank, index ) => (
              <Image
                key={rank}
                source={rankToRender && rankList.includes( rankToRender, index )
                  ? icons.greenDot
                  : icons.whiteDot}
                style={styles.dots}
              />
            ) )}
          </View>
        </>
      )}
    </View>
  );
};

export default ARCameraHeader;

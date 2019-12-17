// @flow

import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import i18n from "../../i18n";
import styles from "../../styles/results/flagModal";
import icons from "../../assets/icons";

type Props = {
  +toggleFlagModal: Function,
  +deleteObservation: Function,
  +userImage: string,
  +speciesSeenImage: string,
  +speciesText: string,
  +seenDate: string
};

const FlagModal = ( {
  toggleFlagModal,
  deleteObservation,
  userImage,
  speciesSeenImage,
  speciesText,
  seenDate
}: Props ) => {
  const gradientColorDark = "#404040";
  const gradientColorLight = "#5e5e5e";

  return (
    <View style={styles.innerContainer}>
      <LinearGradient
        colors={[gradientColorDark, gradientColorLight]}
        style={styles.flagHeader}
      >
        <View style={styles.flagTextContainer}>
          <Text style={[styles.buttonText, styles.paddingSmall]}>
            {i18n.t( "results.flag" ).toLocaleUpperCase()}
          </Text>
          <TouchableOpacity
            hitSlop={styles.touchable}
            onPress={() => toggleFlagModal()}
            style={styles.flagBackButton}
          >
            <Image source={icons.closeWhite} />
          </TouchableOpacity>
        </View>
        <View style={[styles.imageContainer, styles.flagButtonContainer]}>
          <Image
            source={{ uri: userImage }}
            style={styles.flagImageCell}
          />
          {speciesSeenImage ? (
            <Image
              source={{ uri: speciesSeenImage }}
              style={styles.flagImageCell}
            />
          ) : null}
        </View>
      </LinearGradient>
      <View style={styles.flagContainer}>
        <View style={styles.marginLarge} />
        <Text style={styles.speciesText}>{speciesText}</Text>
        <Text style={styles.text}>{i18n.t( "results.incorrect" )}</Text>
        <View style={styles.marginSmall} />
        <TouchableOpacity
          onPress={() => {
            if ( seenDate ) {
              toggleFlagModal( true );
            } else {
              deleteObservation();
              toggleFlagModal( true );
            }
          }}
          style={styles.largeFlagButton}
        >
          <Text style={[styles.buttonText, styles.largeButtonHeight]}>
            {seenDate
              ? i18n.t( "results.yes_resighted" ).toLocaleUpperCase()
              : i18n.t( "results.yes" ).toLocaleUpperCase()}
          </Text>
        </TouchableOpacity>
        <View style={styles.marginSmall} />
        <TouchableOpacity
          onPress={() => toggleFlagModal()}
          style={[styles.flagButton, { backgroundColor: gradientColorLight }]}
        >
          <Text style={styles.buttonText}>
            {i18n.t( "results.no" ).toLocaleUpperCase()}
          </Text>
        </TouchableOpacity>
        <View style={styles.marginMedium} />
      </View>
    </View>
  );
};

export default FlagModal;

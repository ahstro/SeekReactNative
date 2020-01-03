// @flow

import React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground
} from "react-native";
import ProgressCircle from "react-native-progress-circle";
import { withNavigation } from "react-navigation";

import i18n from "../../i18n";
import styles from "../../styles/modals/challengeUnearnedModal";
import BannerHeader from "../Achievements/BannerHeader";
import badgeImages from "../../assets/badges";
import { checkIfChallengeAvailable, formatMonthDayYear } from "../../utility/dateHelpers";
import { setChallengeIndex } from "../../utility/challengeHelpers";
import { colors } from "../../styles/global";
import circleStyles from "../../styles/badges/progressCircle";
import BackButton from "../UIComponents/ModalBackButton";
import GreenButton from "../UIComponents/GreenButton";
import GreenText from "../UIComponents/GreenText";
import { setRoute } from "../../utility/helpers";

type Props = {
  +closeModal: Function,
  +challenge: Object,
  +navigation: any
};

const ChallengeUnearnedModal = ( { closeModal, challenge, navigation }: Props ) => (
  <>
    <View style={styles.innerContainer}>
      <View style={styles.center}>
        <BannerHeader
          modal
          text={`${i18n.t( "challenges.op" ).toLocaleUpperCase()} ${i18n.t( "challenges.badge" ).toLocaleUpperCase()}`}
        />
        {challenge.started && challenge.percentComplete !== 100 ? (
          <ImageBackground
            imageStyle={styles.imageStyle}
            source={badgeImages[challenge.unearnedIconName]}
            style={[styles.image, circleStyles.center]}
          >
            <ProgressCircle
              bgColor={colors.white}
              borderWidth={3}
              color={colors.seekiNatGreen}
              outerCircleStyle={circleStyles.circleStyle}
              percent={challenge.percentComplete}
              radius={113 / 2}
              shadowColor={colors.circleGray}
            >
              <Text style={circleStyles.circleText}>
                {challenge.percentComplete}
                {" %"}
              </Text>
            </ProgressCircle>
          </ImageBackground>
        ) : (
          <Image
            source={badgeImages[challenge.unearnedIconName]}
            style={[styles.image, styles.imageStyle]}
          />
        )}
      </View>
      <View style={styles.margins}>
        <GreenText
          center
          text="badges.to_earn"
        />
      </View>
      <Text style={styles.nameText}>
        {i18n.t( "challenges.how_to", { month: i18n.t( challenge.month ).split( " " )[0] } )}
      </Text>
      {checkIfChallengeAvailable( challenge.availableDate ) ? (
        <View style={styles.container}>
          <GreenButton
            handlePress={() => {
              setChallengeIndex( challenge.index );
              setRoute( "Achievements" );
              navigation.navigate( "ChallengeDetails" );
              closeModal();
            }}
            text="notifications.view_challenges"
          />
        </View>
      ) : (
        <Text style={[styles.italicText, styles.centerSelf]}>
          {i18n.t( "challenges.released", { date: formatMonthDayYear( challenge.availableDate ) } )}
        </Text>
      )}
    </View>
    <BackButton closeModal={closeModal} />
  </>
);

export default withNavigation( ChallengeUnearnedModal );
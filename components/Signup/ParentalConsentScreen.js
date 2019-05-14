// @flow

import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  SafeAreaView
} from "react-native";
import jwt from "react-native-jwt-io";

import config from "../../config";
import i18n from "../../i18n";
import styles from "../../styles/signup/signup";
import GreenHeader from "../GreenHeader";

type Props = {
  navigation: any
}

class ParentalConsentScreen extends Component<Props> {
  constructor() {
    super();

    this.state = {
      email: "",
      error: false
    };
  }

  setError() {
    this.setState( { error: true } );
  }

  createJwtToken() {
    const claims = {
      application: "SeekRN",
      exp: new Date().getTime() / 1000 + 300
    };

    const token = jwt.encode( claims, config.jwtSecret, "HS512" );
    return token;
  }

  shareEmailWithiNat() {
    const { email } = this.state;

    const token = this.createJwtToken();

    const params = {
      email
    };

    const headers = {
      "Content-Type": "application/json"
    };

    if ( token ) {
      headers.Authorization = `Authorization: ${token}`;
    }

    const site = "https://www.inaturalist.org";

    fetch( `${site}/users/parental_consent`, {
      method: "POST",
      body: JSON.stringify( params ),
      headers
    } )
      .then( ( responseJson ) => {
        const { status } = responseJson;
        if ( status === 200 ) {
          this.submit();
        }
      } ).catch( () => {
        this.setError();
      } );
  }

  submit() {
    const { navigation } = this.props;
    navigation.navigate( "ParentCheckEmail" );
  }

  render() {
    const { navigation } = this.props;
    const { email } = this.state;

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeViewTop} />
        <SafeAreaView style={styles.safeView}>
          <GreenHeader navigation={navigation} header={i18n.t( "login.sign_up" )} />
          <View style={styles.innerContainer}>
            <View style={styles.margin} />
            <Text style={styles.header}>
              {i18n.t( "inat_signup.enter_email" )}
            </Text>
            <Text style={[styles.text, styles.keyboardText]}>
              {i18n.t( "inat_signup.under_13" )}
            </Text>
            <View style={styles.margin} />
            <View style={styles.leftTextContainer}>
              <Text style={styles.leftText}>
                {i18n.t( "inat_signup.parent_email" ).toLocaleUpperCase()}
              </Text>
            </View>
            <TextInput
              style={styles.inputField}
              onChangeText={ value => this.setState( { email: value } )}
              value={email}
              placeholder="email address"
              textContentType="emailAddress"
              keyboardType={Platform.OS === "android" ? "visible-password" : "email-address"} // adding this to turn off autosuggestions on Android
              autoFocus
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.greenButton, styles.greenButtonMargin]}
              onPress={() => this.shareEmailWithiNat()}
            >
              <Text style={styles.buttonText}>
                {i18n.t( "inat_signup.submit" ).toLocaleUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default ParentalConsentScreen;

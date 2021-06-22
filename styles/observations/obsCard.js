// @flow

import { StyleSheet } from "react-native";

import { row, dimensions } from "../global";

import type { ViewStyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";

const viewStyles: { [string]: ViewStyleProp } = StyleSheet.create( {
  card: {
    paddingHorizontal: 24,
    width: dimensions.width + 73 + 24
  },
  deleteButton: {
    justifyContent: "center",
    marginLeft: dimensions.width - 327 + 1, // width - touchable area of species card
    paddingRight: 24,
    width: 72
  },
  animatedView: {
    position: "absolute",
    top: 0,
    left: 0
  },
  row
} );

export default viewStyles;

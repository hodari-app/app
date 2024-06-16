import React from 'react';
import {StyleSheet, View} from 'react-native';

function Empty({children}) {
  return <View style={styles.emptyList}>{children}</View>;
}

const styles = StyleSheet.create({
  emptyList: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 200,
  },
});

export default Empty;

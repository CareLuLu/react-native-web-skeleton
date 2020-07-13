import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View } from 'react-native';
import { StylePropType } from 'react-native-web-ui-components';

const styles = StyleSheet.create({
  empty: {},
  defaults: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
    width: '100%',
  },
});

const Layout = ({ style, children }) => (
  <View style={[styles.defaults, style]}>
    {children}
  </View>
);

Layout.propTypes = {
  style: StylePropType,
  children: PropTypes.node,
};

Layout.defaultProps = {
  style: styles.empty,
  children: null,
};

export default Layout;

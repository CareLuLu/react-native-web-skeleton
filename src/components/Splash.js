import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform } from 'react-native';
import { View } from 'react-native-web-ui-components';
import { useScreen } from 'react-native-web-ui-components/Screen';

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E73CA',
    flexDirection: 'column',
  },
});

const Splash = ({ children }) => {
  const screen = useScreen();

  const backgroundStyle = {};
  if (Platform.OS === 'web') {
    backgroundStyle.width = '100vw';
    backgroundStyle.height = '100vh';
  } else {
    backgroundStyle.width = screen.width;
    backgroundStyle.height = screen.height;
  }

  return (
    <View style={[styles.background, backgroundStyle]}>
      {children}
    </View>
  );
};

Splash.propTypes = {
  children: PropTypes.node,
};

Splash.defaultProps = {
  children: null,
};

export default Splash;

import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-web-ui-components';
import { FOOTER_DISCLAIMER } from '../config';

const styles = StyleSheet.create({
  disclaimer: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    lineHeight: 40,
  },
});

const Footer = () => {
  if (!FOOTER_DISCLAIMER) {
    return null;
  }
  return (
    <Text type="lightGray" style={styles.disclaimer}>
      {FOOTER_DISCLAIMER}
    </Text>
  );
};

export default Footer;

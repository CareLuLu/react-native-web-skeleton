import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Helmet,
  title,
  style,
  link,
} from 'react-native-web-ui-components/Helmet';
import { URL, NAME } from '../../config';

export const styles = StyleSheet.create({
  h2: {
    paddingTop: 40,
  },
  introduction: {
    fontWeight: 'bold',
    paddingTop: 20,
  },
  paddingTop: {
    paddingTop: 10,
  },
});

export const Head = () => (
  <Helmet>
    <title>{`About - ${NAME}`}</title>
    <link rel="canonical" href={`${URL}/about`} />
    <style>
      {''}
    </style>
  </Helmet>
);

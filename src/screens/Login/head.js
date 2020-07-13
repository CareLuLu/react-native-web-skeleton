import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Helmet,
  title,
  style,
  link,
} from 'react-native-web-ui-components/Helmet';
import { URL, NAME } from '../../config';

export const styles = StyleSheet.create({});

export const Head = () => (
  <Helmet>
    <title>{`Login - ${NAME}`}</title>
    <link rel="canonical" href={`${URL}/login`} />
    <style>
      {''}
    </style>
  </Helmet>
);

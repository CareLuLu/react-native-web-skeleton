import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Helmet,
  title,
  style,
  link,
  meta,
} from 'react-native-web-ui-components/Helmet';
import { URL, NAME } from '../../config';

export const styles = StyleSheet.create({});

export const Head = () => (
  <Helmet>
    <title>{`Page Not Found - ${NAME}`}</title>
    <link rel="canonical" href={`${URL}/404`} />
    <meta name="robots" content="noindex" />
    <style>
      {''}
    </style>
  </Helmet>
);

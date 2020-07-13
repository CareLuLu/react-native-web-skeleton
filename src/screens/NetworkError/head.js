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
    <title>{`Network Error - ${NAME}`}</title>
    <link rel="canonical" href={`${URL}/network-error`} />
    <meta name="robots" content="noindex" />
    <style>
      {''}
    </style>
  </Helmet>
);

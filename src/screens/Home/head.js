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
  h1: {
    textAlign: 'left',
  },
  seeOnGithubButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  leftColumn: {
    justifyContent: 'center',
  },
  rightColumn: {
    justifyContent: 'center',
  },
  imageDisclaimer: {
    paddingTop: 10,
    fontSize: 12,
    textAlign: 'center',
  },
});

export const Head = () => (
  <Helmet>
    <title>{`Home - ${NAME}`}</title>
    <link rel="canonical" href={URL} />
    <style>
      {`
        [data-class~="Home__rightColumn"] [data-class~="image-outer-wrapper"],
        [data-class~="Home__rightColumn"] [data-class~="image-wrapper"],
        [data-class~="Home__rightColumn"] amp-img {
          max-width: 100%;
        }
        @media (max-width: 991px) {
          [data-class~="Home__leftColumn"],
          [data-class~="Home__rightColumn"] {
            max-height: calc(100vw * 0.7676583493);
          }
          [data-class~="Home__rightColumn"] [data-class~="image-outer-wrapper"],
          [data-class~="Home__rightColumn"] [data-class~="image-wrapper"],
          [data-class~="Home__rightColumn"] amp-img {
            max-height: calc(100vw * 0.7676583493);
          }
        }
      `}
    </style>
  </Helmet>
);

import React from 'react';
import { Platform } from 'react-native';
import {
  Helmet,
  title,
  style,
  meta,
} from 'react-native-web-ui-components/Helmet';

export const styles = {
  background: {
    width: '100%',
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
    backgroundColor: '#FFFFFF',
  },
};

export const Head = () => (
  <Helmet>
    <title>BaseApp</title>
    <meta name="keywords" content="" />
    <meta name="description" content="" />
    <style>
      {`
        * {
          box-sizing: border-box;
        }
        #sidebar {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          visibility: hidden;
          transition: visibility .3s ease-out 0s;
        }
        #sidebar:target {
          z-index: 1000;
          visibility: visible;
        }
        #sidebar [data-class~="AmpSidebar__overlay"] {
          opacity: 0;
          visibility: hidden;
          position: absolute;
          top: 0;
          left: 0;
          background-color: rgba(0, 0, 0, 0.3);
          display: flex;
          height: 100%;
          width: 100%;
          transition: opacity 0.3s ease-out 0s, visibility 0.3s ease-out 0s;
        }
        #sidebar:target [data-class~="AmpSidebar__overlay"] {
          opacity: 1;
          visibility: visible;
        }
        #sidebar [data-class~="AmpSidebar__content"] {
          transition: -webkit-transform 0.3s ease-out 0s;
          will-change: transform;
          transform: translateX(-100%);
          box-shadow: rgba(0, 0, 0, 0.15) 2px 2px 4px;
          width: 80%;
        }
        #sidebar:target [data-class~="AmpSidebar__content"] {
          transform: translateX(0%);
        }
      `}
    </style>
  </Helmet>
);

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native-web-ui-components';
import { Helmet, style } from 'react-native-web-ui-components/Helmet';

const PageLoading = ({ history, location }) => {
  const [visible, setVisible] = useState(true);
  const [animated, setAnimated] = useState(false);
  const [pathname, setPathname] = useState(location.pathname);

  useEffect(() => {
    if (!animated) {
      setAnimated(true);
      setTimeout(() => setVisible(false), 400);
    }
  }, [animated, setAnimated]);

  if (pathname !== location.pathname && history.action !== 'REPLACE') {
    setTimeout(() => {
      setAnimated(false);
      setVisible(true);
      setPathname(location.pathname);
    });
  }

  return (
    <>
      <Helmet>
        <style>
          {`
            [data-class~="PageLoading__progress"] {
              z-index: 10;
              position: absolute;
              top: 0;
              left: 0;
              height: 3px;
              background-color: #0404f5;
              transition: width ease 0.4s;
              ${animated && visible ? 'width: 100%;' : 'width: 0;'}
            }
          `}
        </style>
      </Helmet>
      {visible ? <View className="PageLoading__progress" /> : null}
    </>
  );
};

PageLoading.propTypes = {
  location: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

export default PageLoading;

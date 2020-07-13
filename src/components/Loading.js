import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { View, Text, StylePropType } from 'react-native-web-ui-components';
import { useScreen } from 'react-native-web-ui-components/Screen';
import Overlay from './Overlay';

const styles = StyleSheet.create({
  loadingContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOuterContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const getScrollTop = ({
  screen,
  scrollTop,
  overlayHeight,
  overlayPageY = 0,
}) => {
  if (scrollTop === null || scrollTop === undefined) {
    return null;
  }

  const overlayHeightAdjusted = overlayHeight === undefined || overlayHeight === null
    ? screen.height
    : overlayHeight;

  // The overlay is off the screen (up)
  if (scrollTop >= overlayPageY + overlayHeightAdjusted) {
    return null;
  }
  // The overlay is off the screen (down)
  if (scrollTop + screen.height <= overlayPageY) {
    return null;
  }

  const topBoundary = Math.max(overlayPageY, scrollTop);
  const bottomBoundary = Math.min(overlayPageY + overlayHeightAdjusted, scrollTop + screen.height);

  const visibleOverlaySize = bottomBoundary - topBoundary;
  if (visibleOverlaySize < 2 * 120) {
    return null;
  }

  const offset = overlayPageY < scrollTop ? (scrollTop - overlayPageY) : 0;
  const top = Math.floor(offset + ((visibleOverlaySize - 120) / 2));

  return {
    top,
    position: 'absolute',
  };
};

const LoadingBox = ({ style, useScrollTop, ...props }) => {
  const screen = useScreen();
  const scrollTop = useScrollTop();
  const scrollTopStyle = getScrollTop({
    ...props,
    screen,
    scrollTop: scrollTop && scrollTop.current,
  });
  return (
    <View style={[styles.loadingOuterContainer, scrollTopStyle, style]}>
      <View style={styles.loadingContainer}>
        <Text auto>Loading...</Text>
      </View>
    </View>
  );
};

LoadingBox.propTypes = {
  style: StylePropType,
  useScrollTop: PropTypes.func,
};

LoadingBox.defaultProps = {
  style: null,
  useScrollTop: () => ({}),
};

const Loading = props => (
  <Overlay {...props}>
    {params => <LoadingBox {...props} {...params} />}
  </Overlay>
);

export default Loading;

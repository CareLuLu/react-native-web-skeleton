import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import {
  Text,
  View,
  Box,
  BoxHeader,
  BoxItem,
  StylePropType,
} from 'react-native-web-ui-components';
import { useScreen } from 'react-native-web-ui-components/Screen';
import Overlay from './Overlay';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  box: {
    elevation: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    borderWidth: 0,
    borderRadius: 2,
  },
  boxItem: {
    borderTopWidth: 0,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  boxItemXs: {
    minWidth: '100%',
    minHeight: 70,
  },
  boxItemNoHeader: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  header: {
    justifyContent: 'center',
    paddingLeft: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#E9ECEF',
    borderWidth: 0,
    borderTopRightRadius: 2,
    borderTopLeftRadius: 2,
    borderBottomWidth: 1,
    height: 53,
    minWidth: '100%',
    paddingTop: 6,
  },
  text: {
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 15,
  },
});

const getScrollTop = ({
  screen,
  scrollTop,
  height,
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
  if (visibleOverlaySize < 2 * height) {
    return null;
  }

  const offset = overlayPageY < scrollTop ? (scrollTop - overlayPageY) : 0;
  const top = Math.floor(offset + ((visibleOverlaySize - height) / 2));

  return {
    top,
    position: 'absolute',
  };
};

const PopupBox = ({
  children,
  header,
  headerStyle,
  width,
  title,
  boxItemStyle,
  useScrollTop,
  ...props
}) => {
  const [height, setHeight] = useState(200);
  const screen = useScreen();
  const scrollTop = useScrollTop();

  const onLayout = (event) => {
    setHeight(event.nativeEvent.layout.height);
  };

  const style = getScrollTop({
    ...props,
    screen,
    height,
    scrollTop: scrollTop && scrollTop.current,
  });

  return (
    <View onLayout={onLayout} style={[styles.wrapper, style]}>
      <Box
        xs={screen.type === 'xs' ? 12 : width}
        absolute={screen.type !== 'xs'}
        style={styles.box}
        onLayout={onLayout}
      >
        {header ? (
          <BoxHeader style={[styles.header, headerStyle]}>
            <Text>{title}</Text>
          </BoxHeader>
        ) : null}
        <BoxItem
          style={[
            styles.boxItem,
            screen.type === 'xs' ? styles.boxItemXs : null,
            header ? null : styles.boxItemNoHeader,
            boxItemStyle,
          ]}
        >
          {children}
        </BoxItem>
      </Box>
    </View>
  );
};

PopupBox.propTypes = {
  children: PropTypes.node,
  header: PropTypes.bool,
  title: PropTypes.string,
  width: PropTypes.number,
  headerStyle: StylePropType,
  boxItemStyle: StylePropType,
  useScrollTop: PropTypes.func,
};

PopupBox.defaultProps = {
  children: null,
  header: true,
  title: null,
  width: 400,
  headerStyle: null,
  boxItemStyle: null,
  useScrollTop: () => ({}),
};

const Popup = props => (
  <Overlay {...props}>
    {params => <PopupBox {...props} {...params} />}
  </Overlay>
);

export default Popup;


import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform } from 'react-native';
import { View, StylePropType } from 'react-native-web-ui-components';
import { isSSR } from 'react-native-web-ui-components/utils';
import useSafeSetState from '../utils/useSafeSetState';

const styles = StyleSheet.create({
  placeholder: {
    minHeight: 180,
  },
  overlay: {
    backgroundColor: 'rgba(100, 100, 100, 0.7)',
    position: 'absolute',
    zIndex: 100,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

const Overlay = ({ style, children, useScrollTop }) => {
  const view = useRef();
  const [id] = useState(`Overlay__${Math.random().toString(36).substr(2, 9)}`);
  const scrollTop = useScrollTop();

  // After measuring, the component may no longer be mounted.
  const [overlayHeight, setOverlayHeight] = useSafeSetState(0);
  const [overlayPageY, setOverlayPageY] = useSafeSetState(0);

  const onRef = (ref) => {
    view.current = ref;
  };
  const onLayout = () => {
    if (!isSSR()) {
      if (Platform.OS === 'web') {
        const element = document.querySelector(`[data-class~="${id}"]`);
        if (element) {
          const rect = element.getBoundingClientRect();
          const offset = scrollTop && scrollTop.ref ? scrollTop.ref.current : 0;
          setOverlayPageY(rect.top + offset);
          setOverlayHeight(rect.height);
        }
      } else {
        view.current.measure((x, y, width, height, pageX, pageY) => {
          setOverlayPageY(pageY);
          setOverlayHeight(height);
        });
      }
    }
  };

  return (
    <View
      className={id}
      onRef={onRef}
      onLayout={onLayout}
      style={[styles.overlay, style]}
    >
      {typeof children === 'function' ? children({ overlayHeight, overlayPageY }) : children}
    </View>
  );
};

Overlay.propTypes = {
  style: StylePropType,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  useScrollTop: PropTypes.func,
};

Overlay.defaultProps = {
  style: null,
  children: null,
  useScrollTop: () => ({}),
};

export default Overlay;

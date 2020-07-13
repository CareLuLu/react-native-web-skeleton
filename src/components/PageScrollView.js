import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { ScrollView as RNScrollView } from 'react-native-web-ui-components';
import useSafeSetState from '../utils/useSafeSetState';

export const scrollTopRef = {
  current: 0,
};

const ScrollTop = React.createContext({
  ref: scrollTopRef,
  current: scrollTopRef.current,
});

export const { Provider } = ScrollTop;

export const { Consumer } = ScrollTop;

export const withScrollTop = () => Component => props => (
  <ScrollTop.Consumer>
    {scrollTop => <Component {...props} scrollTop={scrollTop} />}
  </ScrollTop.Consumer>
);

export const useScrollTop = () => useContext(ScrollTop);

const PageScrollView = (props) => {
  const { onScroll } = props;

  const constructed = useRef();
  if (!constructed.current) {
    scrollTopRef.current = 0;
    constructed.current = true;
  }

  const [scrollTop, setScrollTop] = useSafeSetState(0);

  const wrappedOnScroll = (event) => {
    scrollTopRef.current = event.nativeEvent.contentOffset.y;
    setScrollTop(event.nativeEvent.contentOffset.y);
    onScroll(event);
  };

  return (
    <Provider value={{ ref: scrollTopRef, current: scrollTop }}>
      <RNScrollView
        {...props}
        onScroll={wrappedOnScroll}
        scrollEventThrottle={16}
      />
    </Provider>
  );
};

PageScrollView.propTypes = {
  onScroll: PropTypes.func,
};

PageScrollView.defaultProps = {
  onScroll: noop,
};

export default PageScrollView;

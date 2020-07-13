import React, { useContext, useRef, useEffect } from 'react';
import { Screen, ScrollView as RNScrollView } from 'react-native-web-ui-components';
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
  const constructed = useRef();
  if (!constructed.current) {
    scrollTopRef.current = 0;
    constructed.current = true;
  }

  const [scrollTop, setScrollTop] = useSafeSetState(0);

  const scrollView = useRef();
  const onScroll = () => {
    if (scrollView.current && scrollView.current.removeEventListener) {
      const nextScrollTop = scrollView.current.scrollTop();
      scrollTopRef.current = nextScrollTop;
      setScrollTop(nextScrollTop);
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setTimeout(() => {
        scrollView.current = Screen.getScrollElement();
        if (scrollView.current) {
          scrollView.current.addEventListener(onScroll);
        }
      }, 100);
    }
    return () => {
      if (typeof document !== 'undefined') {
        if (scrollView.current && scrollView.current.removeEventListener) {
          scrollView.current.removeEventListener(onScroll);
        }
        scrollView.current = null;
      }
    };
  });

  return (
    <Provider value={{ ref: scrollTopRef, current: scrollTop }}>
      <RNScrollView
        {...props}
        scrollEventThrottle={16}
      />
    </Provider>
  );
};

export default PageScrollView;

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { get, noop, cloneDeep } from 'lodash';
import { useQuery } from '@apollo/client';
import { renderRoutes } from 'react-router-config';
import { Container, Sidebar } from 'react-native-web-ui-components';
import { isSSR } from 'react-native-web-ui-components/utils';
import { useScreen } from 'react-native-web-ui-components/Screen';
import { useAmp } from 'react-native-web-ui-components/Amp';
import USER_CURRENT from '../../graphql/userCurrent';
import { POLLING_INTERVAL } from '../../config';
import scrollTo from '../../utils/scrollTo';
import { trackPageView, trackCallToAction } from '../../utils/analytics';
import { INITIAL_USER_CURRENT_DATA } from '../../utils/apollo';
import getLocationUrl from '../../utils/getLocationUrl';
import getItemHash from '../../utils/getItemHash';
import storage from '../../utils/storage';
import { Provider as ReRenderProvider } from '../../utils/reRender';
import SideMenu from '../../components/SideMenu';
import PageLoading from '../../components/PageLoading';
import PageScrollView, { useScrollTop } from '../../components/PageScrollView';
import { Head, styles } from './head';

/* eslint jsx-a11y/anchor-is-valid: 0 */

const networkErrorRegex = /network error/i;

const getData = ({ data, error }) => {
  const nextData = data || {};
  if (!data || !data.me) {
    nextData.me = cloneDeep(INITIAL_USER_CURRENT_DATA.me);
    nextData.me.mock = !error;
  }
  if (!data || !data.profile) {
    nextData.profile = cloneDeep(INITIAL_USER_CURRENT_DATA.profile);
  }
  return { user: nextData.me, profile: nextData.profile };
};

let sidebarEdgeHitWidth;
let lastPage;
let unlisten;
let open;

if (Platform.OS === 'web' && !isSSR()) {
  lastPage = window.location.pathname;
  sidebarEdgeHitWidth = 0;
} else {
  lastPage = '/';
  sidebarEdgeHitWidth = 120;
}

const listen = ({ history, setLeftOpen }) => {
  if (!unlisten) {
    unlisten = history.listen((location, action) => {
      if (open) {
        setTimeout(() => setLeftOpen(false));
      }
      if (Platform.OS === 'web' && action !== 'REPLACE' && action !== 'POP') {
        setTimeout(() => scrollTo(0, 0));
      }
      if (!isSSR()) {
        // Track page view.
        const page = location.pathname;

        if (lastPage !== page) {
          lastPage = page;
          storage.set('page', page).then(() => trackPageView({
            entry: {
              label: page,
            },
          })).catch(noop);

          // Track signup click.
          if (action === 'PUSH' && page === '/signup') {
            trackCallToAction({
              entry: {
                label: 'SIGN UP',
                action: 'CLICK',
              },
            });
          }

          // Track login click
          if (action === 'PUSH' && page === '/login') {
            trackCallToAction({
              entry: {
                label: 'LOG IN',
                action: 'CLICK',
              },
            });
          }
        }
      }
    });
  }
};

const AmpSidebar = ({ leftComponent }) => (
  <div id="sidebar" data-class="AmpSidebar__container">
    <a href="#" data-class="AmpSidebar__overlay">&nbsp;</a>
    <div data-class="AmpSidebar__content">
      {leftComponent}
    </div>
  </div>
);

AmpSidebar.propTypes = {
  leftComponent: PropTypes.node.isRequired,
};

const RootContent = memo((props) => {
  const amp = useAmp();

  const {
    route,
    reRender,
    setLeftOpen,
  } = props;

  const leftComponent = <SideMenu {...props} />;

  return (
    <>
      {amp ? <AmpSidebar leftComponent={leftComponent} /> : null}
      <Head />
      <Sidebar
        {...props}
        leftOnChange={setLeftOpen}
        leftComponent={leftComponent}
        edgeHitWidth={sidebarEdgeHitWidth}
      >
        <Container style={styles.background}>
          {Platform.OS === 'web' && !window.FIRST_PAGE && !isSSR() ? <PageLoading {...props} /> : null}
          <ReRenderProvider value={reRender}>
            <PageScrollView>
              {renderRoutes(route.routes, { ...props, useScrollTop })}
            </PageScrollView>
          </ReRenderProvider>
        </Container>
      </Sidebar>
    </>
  );
}, (prevProps, nextProps) => (
  prevProps.leftOpen === nextProps.leftOpen
  && getLocationUrl(prevProps.location) === getLocationUrl(nextProps.location)
  && getItemHash(prevProps.user) === getItemHash(nextProps.user)
  && get(prevProps, 'user.mock') === get(nextProps, 'user.mock')
));

RootContent.displayName = 'RootContent';

RootContent.propTypes = {
  route: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
  reRender: PropTypes.func.isRequired,
  setLeftOpen: PropTypes.func.isRequired,
};

const Root = (props) => {
  const { history } = props;

  const onClose = () => {
    if (Platform.OS === 'web' && window.FIRST_PAGE === window.location.href) {
      history.push('/');
    } else {
      try {
        history.goBack();
      } catch (err) {
        history.replace('/');
      }
    }
  };

  const [, setTimestamp] = useState(Date.now());
  const reRender = () => setTimestamp(Date.now());

  const screen = useScreen();

  const [leftOpen, setLeftOpen] = useState(false);
  const openLeft = () => setLeftOpen(true);

  const { loading, refetch, ...result } = useQuery(USER_CURRENT, {
    suspend: true,
    pollInterval: isSSR() ? 0 : POLLING_INTERVAL,
    fetchPolicy: 'cache-and-network',
  });

  const { error, networkStatus } = result;
  let nextError = null;
  if (networkStatus === 8 || error) {
    nextError = error ? error.message : 'Unknown error. Please restart the application.';
    if (nextError && networkErrorRegex.test(nextError)) {
      nextError = 'Network error. Please check your internet connection.';
    }
  }

  const params = {
    ...props,
    ...getData(result),
    refetch,
    reRender,
    screen,
    onClose,
    leftOpen,
    openLeft,
    setLeftOpen,
    networkStatus,
    error: nextError,
  };

  // Listen for page changes
  open = leftOpen;
  listen(params);

  return <RootContent {...params} />;
};

Root.propTypes = {
  history: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
  queryParams: PropTypes.shape().isRequired,
};

export default Root;

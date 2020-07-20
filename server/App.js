import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from '@apollo/client';
import { UIProvider, Router, Switch } from 'react-native-web-ui-components';
import ClientContext from '../src/utils/apollo/Context';
import EntryScreen from '../src/screens';
import routes from '../src/screens/routes';
import theme from '../src/theme';

/* eslint react/forbid-prop-types: 0 */

const App = (props) => {
  const { client, context, url } = props;
  return (
    <ApolloProvider client={client}>
      <ClientContext.Provider value={client}>
        <Router location={url} context={context}>
          <Switch gestureEnabled={false}>
            <UIProvider amp={routes.isAmp(url.split('#')[0].split('?')[0])} theme={theme}>
              <EntryScreen {...props} />
            </UIProvider>
          </Switch>
        </Router>
      </ClientContext.Provider>
    </ApolloProvider>
  );
};

App.propTypes = {
  url: PropTypes.string.isRequired,
  client: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
};

export default App;

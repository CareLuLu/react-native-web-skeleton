import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { ApolloProvider } from '@apollo/client';
import { UIProvider } from 'react-native-web-ui-components';
import ClientContext from '../src/utils/apollo/Context';
import EntryScreen from '../src/screens';
import routes from '../src/screens/routes';
import theme from '../src/theme';
import Router from '../src/components/Router';
import Switch from '../src/components/Switch';

/* eslint react/forbid-prop-types: 0 */

const Theme = (props) => {
  const history = useHistory();

  const { url } = props;

  return (
    <UIProvider
      history={history}
      theme={theme}
      amp={routes.isAmp(url.split('#')[0].split('?')[0])}
    >
      <EntryScreen {...props} />
    </UIProvider>
  );
};

Theme.propTypes = {
  url: PropTypes.string.isRequired,
};

const App = (props) => {
  const { client, context, url } = props;

  return (
    <ApolloProvider client={client}>
      <ClientContext.Provider value={client}>
        <Router location={url} context={context}>
          <Switch gestureEnabled={false}>
            <Theme {...props} />
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

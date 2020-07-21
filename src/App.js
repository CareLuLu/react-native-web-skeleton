import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { UIProvider } from 'react-native-web-ui-components';
import createClient from './utils/apollo/createClient';
import ClientContext from './utils/apollo/Context';
import createHistory from './utils/createHistory';
import EntryScreen from './screens';
import theme from './theme';
import Router from './components/Router';
import Switch from './components/Switch';

const client = createClient();
const history = createHistory();

const App = props => (
  <ApolloProvider client={client}>
    <ClientContext.Provider value={client}>
      <Router history={history}>
        <Switch history={history} gestureEnabled={false}>
          <UIProvider theme={theme} history={history}>
            <EntryScreen {...props} />
          </UIProvider>
        </Switch>
      </Router>
    </ClientContext.Provider>
  </ApolloProvider>
);

export default App;

import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { UIProvider, Router, Switch } from 'react-native-web-ui-components';
import createClient from './src/utils/apollo/createClient';
import ClientContext from './src/utils/apollo/Context';
import createHistory from './src/utils/createHistory';
import EntryScreen from './src/screens';
import theme from './src/theme';

const client = createClient();
const history = createHistory();

const App = props => (
  <ApolloProvider client={client}>
    <ClientContext.Provider value={client}>
      <Router history={history}>
        <Switch gestureEnabled={false}>
          <UIProvider theme={theme}>
            <EntryScreen {...props} />
          </UIProvider>
        </Switch>
      </Router>
    </ClientContext.Provider>
  </ApolloProvider>
);

export default App;

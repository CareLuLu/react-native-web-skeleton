import React from 'react';
import Context from './Context';

const withClient = () => Component => props => (
  <Context.Consumer>
    {client => <Component {...props} client={client} />}
  </Context.Consumer>
);

export default withClient;

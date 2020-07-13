import React, { useContext } from 'react';

const ReRender = React.createContext(() => {});

export const { Provider } = ReRender;
export const { Consumer } = ReRender;

export const useReRender = () => useContext(ReRender);

export const withReRender = () => Component => props => (
  <ReRender.Consumer>
    {reRender => <Component {...props} reRender={reRender} />}
  </ReRender.Consumer>
);

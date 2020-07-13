import React, { useState } from 'react';
import PropTypes from 'prop-types';
import storage from '../../utils/storage';
import { useClient } from '../../utils/apollo';
import { waitFor, waitTime } from '../../utils/wait';
import useLoginRedirect from '../../utils/useLoginRedirect';
import Splash from '../../components/Splash';

const Logout = ({ refetch, ...props }) => {
  const client = useClient();
  const redirect = useLoginRedirect(props);
  const [status, setStatus] = useState('SIGNED_IN');

  if (status === 'SIGNED_IN') {
    setTimeout(async () => {
      setStatus('SIGNING_OUT');
      await storage.set('jwt', '');
      await client.clearStore();
      await waitTime(1000);
      await refetch();
      await waitFor(() => !!Object.keys(client.getCacheData()).length);
      await waitTime(100);
      redirect();
    });
  }
  return <Splash />;
};

Logout.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default Logout;

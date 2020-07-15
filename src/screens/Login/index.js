import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Text, MainContainer } from 'react-native-web-ui-components';
import useLoginRedirect from '../../utils/useLoginRedirect';
import getUrl from '../../utils/getUrl';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LimitedContainer from '../../components/LimitedContainer';
import LoginForm from '../../components/modals/Login';
import { Head } from './head';

const Login = (props) => {
  const { user } = props;

  const redirect = useLoginRedirect(props);

  // We don't want to redirect the user before
  // they see the success message.
  const allowed = useRef(false);
  const onBeforeSubmit = () => {
    allowed.current = true;
  };

  if (!allowed.current && user.role !== 'VISITOR') {
    return <Redirect replace to={getUrl('/')} />;
  }

  return (
    <MainContainer>
      <Head />
      <Header {...props} />
      <LimitedContainer>
        <Text>
          Please input your login and password.
        </Text>
        <LoginForm
          {...props}
          onBeforeSubmit={onBeforeSubmit}
          onAfterSuccess={redirect}
        />
      </LimitedContainer>
      <Footer />
    </MainContainer>
  );
};

Login.propTypes = {
  user: PropTypes.shape().isRequired,
};

export default Login;

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Text, MainContainer } from 'react-native-web-ui-components';
import { SIGNUP_DISCLAIMER } from '../../config';
import useLoginRedirect from '../../utils/useLoginRedirect';
import getUrl from '../../utils/getUrl';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LimitedContainer from '../../components/LimitedContainer';
import SignupForm from '../../components/modals/Signup';
import { Head } from './head';

const Signup = (props) => {
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
          {SIGNUP_DISCLAIMER}
        </Text>
        <SignupForm
          {...props}
          onBeforeSubmit={onBeforeSubmit}
          onAfterSuccess={redirect}
        />
      </LimitedContainer>
      <Footer />
    </MainContainer>
  );
};

Signup.propTypes = {
  user: PropTypes.shape().isRequired,
};

export default Signup;

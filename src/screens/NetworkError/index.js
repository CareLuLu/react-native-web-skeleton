import React from 'react';
import {
  Link,
  Text,
  Title,
  MainContainer,
} from 'react-native-web-ui-components';
import getUrl from '../../utils/getUrl';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LimitedContainer from '../../components/LimitedContainer';
import { Head } from './head';

const NetworkError = props => (
  <MainContainer>
    <Head />
    <Header {...props} />
    <LimitedContainer>
      <Title id="NetworkError" type="gray" level={1}>
        Oops! You seem to be offline, please check your connection and try again.
      </Title>
      <Text>
        Once your connection is back up,&nbsp;
        <Link to={getUrl('/')}>
          click here
        </Link>
        &nbsp; to go back to the home page.
      </Text>
    </LimitedContainer>
    <Footer />
  </MainContainer>
);

export default NetworkError;

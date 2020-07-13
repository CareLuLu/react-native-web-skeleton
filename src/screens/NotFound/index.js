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

const NotFound = props => (
  <MainContainer>
    <Head />
    <Header {...props} />
    <LimitedContainer>
      <Title id="NotFound" type="gray" level={1}>
        Oops! This page cannot be found.
      </Title>
      <Text>
        <Link to={getUrl('/')}>
          Click here
        </Link>
        &nbsp; to go back to the home page.
      </Text>
    </LimitedContainer>
    <Footer />
  </MainContainer>
);

export default NotFound;

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

const UnknownError = props => (
  <MainContainer>
    <Head />
    <Header {...props} />
    <LimitedContainer>
      <Title id="UnknownError" type="gray" level={1}>
        Oops! An unexpected error has occurred...
      </Title>
      <Text>
        Please try again in a few minutes.&nbsp;
        <Link to={getUrl('/')}>
          Click here
        </Link>
        &nbsp; to go back to the home page.
      </Text>
    </LimitedContainer>
    <Footer />
  </MainContainer>
);

export default UnknownError;

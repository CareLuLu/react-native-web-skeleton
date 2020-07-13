import React from 'react';
import {
  Link,
  Text,
  Title,
  Image,
  Button,
  Column,
  MainContainer,
} from 'react-native-web-ui-components';
import { useScreen } from 'react-native-web-ui-components/Screen';
import resource from '../../utils/resource';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LimitedContainer from '../../components/LimitedContainer';
import { Head, styles } from './head';

const Home = (props) => {
  const screen = useScreen();

  const mobileDemoStyle = {
    width: 521,
    height: 391,
  };
  if (screen.width * 0.95 < 521) {
    mobileDemoStyle.width = screen.width * 0.95;
    mobileDemoStyle.height = 391 * (screen.width * 0.95) / 521;
  }

  const height = mobileDemoStyle.height + 30;

  return (
    <MainContainer>
      <Head />
      <Header {...props} />
      <LimitedContainer>
        <Column
          xs={12}
          md={6}
          style={[styles.leftColumn, { height }]}
          className="Home__leftColumn"
        >
          <Title id="Home" type="gray" level={1} style={styles.h1}>
            Write once, run anywhere!
          </Title>
          <Text>
            This page was generated with&nbsp;
            <Link to="https://github.com/CareLuLu/react-native-web-skeleton">
              React Native Web Skeleton!
            </Link>
            &nbsp;This is a multiplatform production ready app coded for Android,
            iOS, Mobile Web Responsiveness, Web Client-side Rendering (CSR), Server-side
            Rendering (SSR) and Google Accelerated Mobile Pages (AMP).
          </Text>
          <Button
            style={styles.seeOnGithubButton}
            to="https://github.com/CareLuLu/react-native-web-skeleton"
          >
            See on Github!
          </Button>
        </Column>
        <Column
          xs={12}
          md={6}
          style={[styles.rightColumn, { height }]}
          className="Home__rightColumn"
        >
          <Image
            fixed
            style={mobileDemoStyle}
            source={{
              uri: resource('https://divin2sy6ce0b.cloudfront.net/images/iphone-demo.gif'),
            }}
          />
          <Link type="lightGray" to="https://www.ramotion.com/" style={styles.imageDisclaimer}>
            Image: Ramotion
          </Link>
        </Column>
      </LimitedContainer>
      <Footer />
    </MainContainer>
  );
};

export default Home;

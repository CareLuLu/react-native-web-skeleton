import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import {
  Text,
  Row,
  View,
  Column,
  NavLink,
  Button,
  Container,
} from 'react-native-web-ui-components';
import { useAmp } from 'react-native-web-ui-components/Amp';
import { useScreen } from 'react-native-web-ui-components/Screen';
import { Helmet, style } from 'react-native-web-ui-components/Helmet';
import { URL, API_URL } from '../config';
import getMenu from '../utils/getMenu';
import getUrl from '../utils/getUrl';
import Mustache from './Mustache';

const styles = StyleSheet.create({
  row: {
    paddingTop: Platform.OS === 'web' ? 20 : 35,
    justifyContent: 'center',
  },
  leftColumn: {
    height: 50,
    justifyContent: 'center',
  },
  rightColumn: {
    height: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  menuItem: {
    paddingRight: 15,
  },
  logo: {
    fontSize: 20,
  },
});

const Buttons = ({ user }) => {
  if (user.role === 'VISITOR') {
    return (
      <>
        <Button small to={getUrl('/login')}>
          Log In
        </Button>
        <Button small to={getUrl('/signup')}>
          Sign Up
        </Button>
      </>
    );
  }
  return (
    <Button small to={getUrl('/logout')}>
      Logout
    </Button>
  );
};

Buttons.propTypes = {
  user: PropTypes.shape().isRequired,
};

const AmpButtons = () => (
  <amp-list
    width="150"
    height="32"
    layout="fixed"
    credentials="include"
    src={`${API_URL}/webhook/reactNativeWebSkeleton?host=${encodeURIComponent(URL)}&url=AMPDOC_URL&_=RANDOM`}
  >
    <Mustache>
      {`
        <div data-class="Header__buttonRow">
          <div data-class="button Header__button Header__buttonSmall">
            <a href="#sidebar" rel="nofollow" data-class="Header__buttonLink">
              Menu
            </a>
          </div>
          {{#options}}
            <div data-class="button Header__button Header__buttonLarge">
              <a href="{{url}}" data-class="Header__buttonLink">
                {{label}}
              </a>
            </div>
          {{/options}}
        </div>
      `}
    </Mustache>
    <div placeholder="" />
    <div data-class="Header__placeholder">
      <div data-class="Header__buttonRow">
        <div data-class="button Header__button Header__buttonSmall">
          <a href="#sidebar" data-class="Header__buttonLink">
            Menu
          </a>
        </div>
        <div data-class="button Header__button Header__buttonLarge">
          <a href="/login" data-class="Header__buttonLink">
            Log In
          </a>
        </div>
        <div data-class="button Header__button Header__buttonLarge">
          <a href="/signup" data-class="Header__buttonLink">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  </amp-list>
);

const Header = ({ user, openLeft }) => {
  const amp = useAmp();
  const screen = useScreen();

  return (
    <Row style={styles.row} className="Header__row">
      <Helmet>
        <style>
          {`
            [data-class~="Header__row"] amp-list {
              display: flex;
              flex-direction: row;
              min-height: 32px;
              max-height: 32px;
              max-width: max-content;
            }
            [data-class~="Header__row"] [data-class~="Header__placeholder"],
            [data-class~="Header__row"] [role="list"] {
              display: flex;
              min-height: 32px;
              position: relative;
              max-width: max-content;
            }
            [data-class~="Header__row"] [placeholder] {
              display: none;
            }
            [data-class~="Header__row"] [placeholder].amp-hidden + [data-class~="Header__placeholder"] {
              display: none;
            }
            [data-class~="Header__buttonRow"] {
              display: flex;
              flex-direction: row;
              min-width: max-content;
            }
            [data-class~="Header__button"] {
              overflow: hidden;
              align-self: flex-start;
              background-color: rgb(14, 115, 202);
              border-radius: 2px;
              border-width: 0px;
              border-bottom: 2px solid rgb(4, 4, 245);
              margin-right: 5px;
              margin-bottom: 5px;
            }
            [data-class~="Header__buttonLink"] {
              color: #FFFFFF;
              font-size: 13px;
              padding: 5px 10px;
              line-height: 20px;
              background-color: #0404f5;
              cursor: pointer;
              font-family: "Lucida Sans Unicode", "Lucida Grande", Arial, Helvetica, clean, sans-serif;
            }
            @media (max-width: 991px) {
              [data-class~="Header_navLink"] {
                display: none;
              }
              [data-class~="Header__buttonLarge"] {
                display: none;
              }
            }
            @media (min-width: 992px) {
              [data-class~="Header__buttonSmall"] {
                display: none;
              }
            }
          `}
        </style>
      </Helmet>
      <Container type="limited">
        <Column xs={6} style={styles.leftColumn}>
          <Text type="navy" auto style={styles.logo}>
            RNW Skeleton
          </Text>
        </Column>
        <Column xs={6} style={styles.rightColumn}>
          <View style={styles.menuRow}>
            {screen.reduced ? (
              <Button small onPress={openLeft}>
                Menu
              </Button>
            ) : (
              <>
                {getMenu().map(item => (
                  <NavLink
                    auto
                    exact
                    key={item.label}
                    type="lightGray"
                    activeType="gray"
                    className="Header_navLink"
                    style={styles.menuItem}
                    to={getUrl(item.url)}
                  >
                    {item.label}
                  </NavLink>
                ))}
                {amp ? (
                  <AmpButtons />
                ) : (
                  <Buttons user={user} />
                )}
              </>
            )}
          </View>
        </Column>
      </Container>
    </Row>
  );
};

Header.propTypes = {
  user: PropTypes.shape().isRequired,
  openLeft: PropTypes.func.isRequired,
};

export default Header;

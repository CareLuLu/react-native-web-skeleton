import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import {
  View,
  Row,
  Text,
  Column,
  NavLink,
  Image,
  ScrollView,
} from 'react-native-web-ui-components';
import resource from '../utils/resource';
import getMenu from '../utils/getMenu';
import Layout from './Layout';

const styles = StyleSheet.create({
  background: {
    paddingTop: Platform.OS === 'web' ? 25 : 55,
    borderColor: '#545454',
    backgroundColor: 'rgba(84,84,84,0.9)',
  },
  centeredColumn: {
    alignItems: 'center',
  },
  centeredTopColumn: {
    alignItems: 'center',
    paddingBottom: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  nameText: {
    fontSize: 18,
  },
  outerSeparatorColumn: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 15,
    paddingBottom: 15,
  },
  innerSeparatorColumn: {
    borderBottomColor: '#BFBFBF',
    borderBottomWidth: 1,
  },
  menuItemOuterColumn: {
    paddingLeft: 30,
    paddingRight: 2,
  },
  menuItemInnerColumn: {
    paddingLeft: 15,
  },
  menuItem: {
    fontSize: 16,
    lineHeight: 28,
  },
  subMenuItem: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  scrollView: {
    backgroundColor: 'transparent',
    width: '100%',
  },
});

const SideMenu = ({ user }) => {
  const source = {
    uri: resource(user.image || 'https://divin2sy6ce0b.cloudfront.net/images/greyProfileFinal2.png'),
  };

  return (
    <Layout style={styles.background}>
      <Row>
        <Column xs={12} style={styles.centeredTopColumn}>
          <View style={styles.imageWrapper}>
            <Image
              fixed
              alt="Profile Picture"
              className="circle"
              style={styles.image}
              source={source}
            />
          </View>
        </Column>
        {user.fullName ? (
          <Column xs={12} style={styles.centeredColumn}>
            <Text auto type="white" style={styles.nameText}>{user.fullName}</Text>
          </Column>
        ) : null}
        {user.email ? (
          <Column xs={12} style={styles.centeredColumn}>
            <Text auto type="white">{user.email}</Text>
          </Column>
        ) : null}
        {user.phone ? (
          <Column xs={12} style={styles.centeredColumn}>
            <Text auto type="white">{user.phone}</Text>
          </Column>
        ) : null}
        <Column xs={12} style={styles.outerSeparatorColumn}>
          <Column xs={12} style={styles.innerSeparatorColumn} />
        </Column>
      </Row>
      <ScrollView style={styles.scrollView}>
        {getMenu(user).map(item => (
          <Column key={item.label} xs={12} style={styles.menuItemOuterColumn}>
            <NavLink
              exact
              type="white"
              activeType="navySidemenu"
              style={styles.menuItem}
              to={item.url}
            >
              {item.label}
            </NavLink>
          </Column>
        ))}
      </ScrollView>
    </Layout>
  );
};

SideMenu.propTypes = {
  user: PropTypes.shape().isRequired,
};

export default SideMenu;

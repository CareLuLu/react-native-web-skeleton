import { StyleSheet } from 'react-native';

const theme = {
  Button: {
    // These properties can be overwritten by defining them on the
    // button itself.
    small: true,
    auto: true,
    flat: false,
    type: 'navy',
    radius: true,
  },
  MainContainer: {
    style: StyleSheet.create({
      mainContainer: {
        justifyContent: 'space-between',
      },
    }).mainContainer,
  },
  Link: {
    type: 'navy',
  },
  Text: {
    // Instead of being overwritten by the prop style defined on the
    // text itself, the style property is the only property that is
    // prepended to the component prop.
    //
    // Example:
    // <Text style={{ fontSize: 20 }}>
    //   Something!
    // </Text>
    //
    // In this example, Text will have the following style:
    // [
    //   {
    //     lineHeight: 28
    //   },
    //   {
    //     fontSize: 20,
    //   }
    // ]
    type: 'gray',
    style: StyleSheet.create({
      text: {
        lineHeight: 28,
      },
    }).text,
  },
  Title: {
    style: StyleSheet.create({
      title: {
        fontSize: 30,
        paddingTop: 20,
        paddingBottom: 20,
      },
    }).title,
  },
  colors: {
    text: 'gray',
    primary: 'navy',
    gray: StyleSheet.create({
      background: { backgroundColor: '#1B2733' },
      border: { borderColor: '#1B2733' },
      text: { color: '#1B2733' },
    }),
    lightGray: StyleSheet.create({
      background: { backgroundColor: '#637282' },
      border: { borderColor: '#637282' },
      text: { color: '#637282' },
    }),
    navy: StyleSheet.create({
      background: { backgroundColor: '#0404f5' },
      border: { borderColor: '#0404f5' },
      text: { color: '#0404f5' },
    }),
    navySidemenu: StyleSheet.create({
      background: { backgroundColor: '#0404f5' },
      border: { borderColor: '#0404f5' },
      text: { color: '#0000a0' },
    }),
  },
};

export default theme;

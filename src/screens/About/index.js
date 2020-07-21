import React from 'react';
import {
  Link,
  Text,
  Title,
  MainContainer,
} from 'react-native-web-ui-components';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LimitedContainer from '../../components/LimitedContainer';
import { Head, styles } from './head';

const About = props => (
  <MainContainer>
    <Head />
    <Header {...props} />
    <LimitedContainer>
      <Title id="About" type="gray" level={1}>
        About
      </Title>
      <Text>
        Although this project was initially developed for&nbsp;
        <Link to="https://www.carelulu.com">
          CareLuLu&#39;s website
        </Link>
        , we want to make it easier for small companies to change the world!
        We help parents and child care providers and hope this can give you a head
        start to help the lives of others like we do :)
      </Text>
      <Title id="Dependencies" type="gray" level={2} style={styles.h2}>
        Dependencies
      </Title>
      <Text style={styles.introduction}>
        Kudos for all the maintainers of the libraries listed (and not listed) below!
      </Text>
      <Text style={styles.paddingTop}>
        <Link to="https://nodejs.org/en/about/">
          Node.js
        </Link>
        : as an asynchronous event-driven JavaScript runtime, Node is designed to build
        scalable network applications. Many connections can be handled concurrently.
      </Text>
      <Text style={styles.paddingTop}>
        <Link to="https://koajs.com/">
          Koajs
        </Link>
        : is a new web framework designed by the team behind Express, which aims to be a smaller,
        more expressive, and more robust foundation for web applications and APIs. By leveraging
        async functions, Koa allows you to ditch callbacks and greatly increase error-handling.
        Koa does not bundle any middleware within its core, and it provides an elegant suite of
        methods that make writing servers fast and enjoyable.
      </Text>
      <Text style={styles.paddingTop}>
        <Link to="https://babeljs.io/">
          Babeljs
        </Link>
        : is a toolchain that is mainly used to convert ECMAScript 2015+ code into a
        backwards compatible version of JavaScript in current and older browsers or environments.
      </Text>
      <Text style={styles.paddingTop}>
        <Link to="https://nodejs.org/en/about/">
          React
        </Link>
        : makes it painless to create interactive UIs. Design simple views for each state
        in your application, and React will efficiently update and render just the right
        components when your data changes.
      </Text>
      <Text style={styles.paddingTop}>
        <Link to="https://reactnative.dev/">
          React Native
        </Link>
        : combines the best parts of native development with React, a
        best-in-class JavaScript library for building user interfaces.
      </Text>
      <Text style={styles.paddingTop}>
        <Link to="https://github.com/necolas/react-native-web">
          React Native Web
        </Link>
        : makes it possible to run React Native components and APIs on the web using React DOM.
        It provides native-quality interactions, support for multiple input modes (touch, mouse,
        keyboard), optimized vendor-prefixed styles, built-in support for RTL layout, built-in
        accessibility, and integrates with React Dev Tools.
      </Text>
      <Text style={styles.paddingTop}>
        <Link to="https://expo.io/">
          Expo
        </Link>
        : with Expo tools, services, and React, you can build, deploy, and quickly iterate on native
        Android, iOS, and web apps from the same JavaScript codebase.
      </Text>
      <Text style={styles.paddingTop}>
        <Link to="https://reactrouter.com/">
          React Router
        </Link>
        : Components are the heart of React&#39;s powerful, declarative programming model.
        React Router is a collection of navigational components that compose declaratively
        with your application. Whether you want to have bookmarkable URLs for your web app
        or a composable way to navigate in React Native, React Router works wherever React
        is rendering--so take your pick!
      </Text>
      <Text style={styles.paddingTop}>
        <Link to="https://github.com/CareLuLu/react-native-web-ui-components">
          React Native Web UI Components
        </Link>
        : React Native Web UI Components is a library of customized React Native/React Native
        Web components for mobile and web UI.
      </Text>
      <Text style={styles.paddingTop}>
        <Link to="https://github.com/CareLuLu/react-native-web-ui-components">
          React Native Web Jsonschema Form
        </Link>
        : Render customizable forms using JSON schema for responsive websites and Expo apps
        (both iOS and Android). This library was inpired on react-jsonschema-form but was
        built with React Native and React Native Web in mind.
      </Text>
      <Text style={styles.paddingTop}>
        <Link to="https://www.apollographql.com/">
          Apollo GraphQL
        </Link>
        : is the industry-standard GraphQL implementation, providing the data graph layer
        that connects modern apps to the cloud.
      </Text>
      <Text style={styles.paddingTop}>
        <Link to="https://loadable-components.com/">
          Loadable Components
        </Link>
        : React.lazy is the recommended solution for Code Splitting. It uses Suspense
        and it is maintained by React. If you are already using React.lazy and if
        you are good with it, you don&#39;t need @loadable/component. If you feel
        limited or if you need SSR, then @loadable/component is the solution.
      </Text>
      <Text style={styles.paddingTop}>
        <Link to="https://github.com/esxjs/esx">
          ESX
        </Link>
        : For a simplified example of esx in action, check out esx-demo. esx is designed
        to be a high speed SSR template engine for React. It can be used with absolutely
        no code base changes.
      </Text>
    </LimitedContainer>
    <Footer />
  </MainContainer>
);

export default About;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Button, Center, Text } from 'react-native-web-ui-components';
import { noop } from 'lodash';
import Popup from './Popup';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 15,
  },
});

const Alert = ({
  children,
  visible,
  onOk,
  okLabel,
  ...props
}) => {
  const [isVisible, setVisible] = useState(visible);
  const hide = () => {
    setVisible(false);
    onOk();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Popup {...props} width={400}>
      {typeof children === 'string' ? (
        <Text style={styles.text}>
          {children}
        </Text>
      ) : children}
      <Center>
        <Button
          auto
          radius
          type="navy"
          flat={false}
          onPress={hide}
        >
          {okLabel}
        </Button>
      </Center>
    </Popup>
  );
};

Alert.propTypes = {
  children: PropTypes.node,
  onOk: PropTypes.func,
  visible: PropTypes.bool,
  okLabel: PropTypes.string,
  title: PropTypes.string,
};

Alert.defaultProps = {
  children: null,
  onOk: noop,
  visible: true,
  okLabel: 'Ok',
  title: 'Alert',
};

export default Alert;

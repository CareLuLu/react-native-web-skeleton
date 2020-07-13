import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import gql from 'graphql-tag';
import FormRN from 'react-native-web-jsonschema-form';
import { Center, Button } from 'react-native-web-ui-components';
import { useAmp } from 'react-native-web-ui-components/Amp';
import { noop, map, isPlainObject } from 'lodash';
import { URL } from '../config';
import USER_CURRENT from '../graphql/userCurrent';
import USER_CURRENT_FIELDS from '../graphql/userCurrentFields';
import { useClient } from '../utils/apollo';
import { humanize } from '../utils/string';
import useSafeSetState from '../utils/useSafeSetState';
import Loading from './Loading';
import Alert from './Alert';

const toPayload = values => JSON.stringify(values).replace(/"([^"]+)":/g, '$1:');

const toErrorSchema = (error) => {
  let errorSchema = {};
  if (isPlainObject(error)) {
    errorSchema = error;
  } else if (!error.graphQLErrors || !error.graphQLErrors.length) {
    errorSchema = {
      Error: [error.message],
    };
  } else if (error.graphQLErrors[0].code !== 'ERROR_INVALID_INPUT') {
    errorSchema = {
      Error: [error.graphQLErrors[0].message],
    };
  } else {
    errorSchema = error.graphQLErrors[0].state || {
      Error: [error.message],
    };
  }
  return errorSchema;
};

const getMutation = ({ values, controller, action }) => gql`
  mutation ${controller}_${action} {
    ${controller} {
      ${action}(with: ${toPayload(values)}) {
        code
        message
      }
    }
    me(with: {}) {
      ...userCurrentFields
    }
    profile(with: {})
  }
  ${USER_CURRENT_FIELDS}
`;

const mutate = ({ client, mutation }) => client.mutate({
  mutation,
  update: (cache, params) => {
    const { data } = params;
    if (data && data.me) {
      const { me, profile } = data;
      cache.writeQuery({
        query: USER_CURRENT,
        data: { me, profile },
      });
    }
  },
});

const Form = ({
  alt,
  location,
  action,
  controller,
  onClose,
  onBeforeSubmit,
  onAfterSuccess,
  schema,
  uiSchema,
  formData,
  ...props
}) => {
  const amp = useAmp();
  const client = useClient();
  const [loading, setLoading] = useSafeSetState(false);
  const [exception, setException] = useSafeSetState(null);
  const [message, setMessage] = useSafeSetState(null);

  if (amp) {
    return (
      <Center>
        <Button to={`${URL}${location.pathname.replace('/amp', '')}${location.search}${location.hash}`}>
          {alt || humanize(action)}
        </Button>
      </Center>
    );
  }

  const onSubmit = async (event) => {
    await onBeforeSubmit(event);

    setLoading(true);

    const { values } = event.params;
    const mutation = getMutation({
      values,
      controller,
      action,
    });

    return mutate({ client, mutation }).catch((err) => {
      throw toErrorSchema(err);
    });
  };

  const onSuccess = (event) => {
    const { response } = event.params;
    setLoading(false);
    setMessage(response.data[controller][action].message);
  };

  const onError = (event) => {
    const { exceptions } = event.params;
    const exceptionsMessages = map(
      exceptions,
      messages => messages.join(', '),
    );
    setLoading(false);
    if (exceptionsMessages.length) {
      setException(exceptionsMessages.join('\n'));
    }
  };

  const onErrorOk = () => setException(null);

  return (
    <>
      <FormRN
        formData={formData}
        schema={schema}
        uiSchema={uiSchema}
        onCancel={onClose}
        onError={onError}
        onSuccess={onSuccess}
        onSubmit={onSubmit}
      />
      {loading ? <Loading {...props} /> : null}
      {exception ? (
        <Alert {...props} onOk={onErrorOk}>
          {exception}
        </Alert>
      ) : null}
      {message ? (
        <Alert {...props} onOk={onAfterSuccess || onClose}>
          {message}
        </Alert>
      ) : null}
    </>
  );
};

Form.propTypes = {
  location: PropTypes.shape().isRequired,
  action: PropTypes.string.isRequired,
  controller: PropTypes.string.isRequired,
  schema: PropTypes.shape().isRequired,
  uiSchema: PropTypes.shape(),
  formData: PropTypes.shape(),
  onClose: PropTypes.func,
  onBeforeSubmit: PropTypes.func,
  onAfterSuccess: PropTypes.func,
  alt: PropTypes.string,
};

Form.defaultProps = {
  uiSchema: {},
  formData: {},
  onClose: noop,
  onBeforeSubmit: noop,
  onAfterSuccess: null,
  alt: null,
};

export default withRouter(Form);

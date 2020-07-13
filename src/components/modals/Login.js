import React from 'react';
import Form from '../Form';

const schema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
};

const Login = props => (
  <Form
    {...props}
    action="authenticate"
    controller="user"
    schema={schema}
  />
);

export default Login;

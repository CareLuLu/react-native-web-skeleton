import React from 'react';
import Form from '../Form';

const schema = {
  type: 'object',
  properties: {
    fullName: { type: 'string' },
    username: { type: 'string' },
    password: { type: 'string' },
  },
};

const Signup = props => (
  <Form
    {...props}
    action="signup"
    controller="parent"
    schema={schema}
  />
);

export default Signup;

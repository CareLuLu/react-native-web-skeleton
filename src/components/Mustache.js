import React from 'react';
import PropTypes from 'prop-types';

/* eslint react/no-danger: 0 */

const Mustache = ({ children, ...props }) => (
  <template {...props} type="amp-mustache" dangerouslySetInnerHTML={{ __html: children }} />
);

Mustache.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Mustache;

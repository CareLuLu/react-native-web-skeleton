export { default as Context } from './Context';
export { default as createClient } from './createClient';
export { default as useClient } from './useClient';
export { default as useComposed } from './useComposed';
export { default as withClient } from './withClient';

export const INITIAL_USER_CURRENT_DATA = {
  me: {
    __typename: 'user',
    id: 3,
    firstName: null,
    lastName: null,
    fullName: '',
    phone: null,
    mobile: null,
    email: null,
    image: null,
    role: 'VISITOR',
    updatedAt: '2020-01-01T00:00:00.000Z',
    mock: true,
  },
  profile: {
    __typename: 'profile',
    id: 3,
    params: { userId: 3 },
    placeholder: 'Menu',
    menu: [
      { key: 'Home', label: 'Home' },
      { key: 'Login', label: 'Login' },
      { key: 'Signup', label: 'Sign Up' },
      { key: 'ContactUs', label: 'Contact Us' },
    ],
  },
};

export const INITIAL_STATE = {
  ROOT_QUERY: {
    'profile({"with":{}})': {
      type: 'json',
      json: INITIAL_USER_CURRENT_DATA.profile,
    },
    'me({"with":{}})': {
      type: 'id',
      generated: false,
      id: `user:${INITIAL_USER_CURRENT_DATA.me.id}`,
      typename: 'user',
    },
  },
};
INITIAL_STATE[`user:${INITIAL_USER_CURRENT_DATA.me.id}`] = INITIAL_USER_CURRENT_DATA.me;

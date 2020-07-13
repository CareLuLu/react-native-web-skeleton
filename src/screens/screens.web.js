import loadable from '@loadable/component';

export const Root = loadable(() => import('./Root'));
export const NotFound = loadable(() => import('./NotFound'));
export const NetworkError = loadable(() => import('./NetworkError'));
export const UnknownError = loadable(() => import('./UnknownError'));
export const Home = loadable(() => import('./Home'));
export const About = loadable(() => import('./About'));
export const Login = loadable(() => import('./Login'));
export const Signup = loadable(() => import('./Signup'));
export const Logout = loadable(() => import('./Logout'));

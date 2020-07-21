import { Router, StaticRouter } from 'react-router-dom';
import { isSSR } from 'react-native-web-ui-components/utils';

const SSR_MODE = isSSR();

export default SSR_MODE ? StaticRouter : Router;

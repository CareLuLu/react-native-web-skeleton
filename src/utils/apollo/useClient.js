import { useContext } from 'react';
import Context from './Context';

const useClient = () => useContext(Context);

export default useClient;

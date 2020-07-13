import { useState, useRef, useEffect } from 'react';

const useSafeSetSatet = (initialValue) => {
  const queue = useRef([]);
  const mounted = useRef(false);

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    mounted.current = true;
    while (queue.current.length) {
      setValue(queue.current.shift());
    }

    return () => {
      mounted.current = false;
    };
  }, []);

  const setValueIfMounted = (nextValue) => {
    if (!mounted.current) {
      queue.current.push(nextValue);
      return false;
    }
    setValue(nextValue);
    return true;
  };

  return [value, setValueIfMounted];
};

export default useSafeSetSatet;

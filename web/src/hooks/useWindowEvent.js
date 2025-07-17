import { useEffect } from 'react';

export default function useWindowEvent(type, listener, options) {
  useEffect(() => {
    window.addEventListener(type, listener, options);
    return () => window.removeEventListener(type, listener, options);
  }, [type, listener]);
}

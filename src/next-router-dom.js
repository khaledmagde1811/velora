import { useMemo } from 'react';
import { useRouter } from 'next/router';

export const useNavigate = () => {
  const router = useRouter();

  return (to) => {
    if (typeof to === 'number') {
      if (to < 0) return router.back();
      if (to > 0) return router.forward();
      return;
    }
    return router.push(to);
  };
};

export const useLocation = () => {
  const router = useRouter();
  const asPath = router.asPath || '';
  const [pathname, search] = asPath.split('?');

  return useMemo(
    () => ({
      pathname: pathname || '',
      search: search ? `?${search}` : '',
    }),
    [asPath]
  );
};

export const useParams = () => {
  const router = useRouter();
  return router.query;
};

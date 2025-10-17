export const useNavigate = () => {
  return (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.hash = path;
    }
  };
};

export const useCurrentRoute = () => {
  if (typeof window === 'undefined') {
    return '/';
  }
  const hash = window.location.hash.slice(1) || '/';
  return hash;
};

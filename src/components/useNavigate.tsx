export const useNavigate = () => {
  return (path: string) => {
    window.location.hash = path;
  };
};

export const useCurrentRoute = () => {
  const hash = window.location.hash.slice(1) || '/';
  return hash;
};

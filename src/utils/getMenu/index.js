import getUrl from '../getUrl';

const getMenu = (user) => {
  const menu = [
    {
      label: 'Home',
      url: getUrl('/'),
    },
    {
      label: 'About',
      url: getUrl('/about'),
    },
  ];
  if (user) {
    if (user.role === 'VISITOR') {
      menu.push({
        label: 'Log In',
        url: getUrl('/login'),
      });
      menu.push({
        label: 'Sign Up',
        url: getUrl('/signup'),
      });
    } else {
      menu.push({
        label: 'Logout',
        url: getUrl('/logout'),
      });
    }
  }
  return menu;
};

export default getMenu;

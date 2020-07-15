const getMenu = (user) => {
  const menu = [
    {
      label: 'Home',
      url: '/',
    },
    {
      label: 'About',
      url: '/about',
    },
  ];
  if (user) {
    if (user.role === 'VISITOR') {
      menu.push({
        label: 'Log In',
        url: '/login',
      });
      menu.push({
        label: 'Sign Up',
        url: '/signup',
      });
    } else {
      menu.push({
        label: 'Logout',
        url: '/logout',
      });
    }
  }
  return menu;
};

export default getMenu;

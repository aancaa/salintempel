import { FiHome } from 'react-icons/fi';
import { MdOutlineFavoriteBorder } from 'react-icons/md';
import { HiOutlineDocumentText } from 'react-icons/hi';
import NavigationMenuItem from './NavigationMenuItem';
import { useLocation } from 'react-router-dom';

const NavigationMenu = () => {
  const location = useLocation();
  const links = [
    {
      text: 'Favorite',
      url: '/favorite',
      icon: <MdOutlineFavoriteBorder />,
    },
    {
      text: 'Home',
      url: '/',
      icon: <FiHome />,
    },
    {
      text: 'My SalinTempel',
      url: '/my-salintempel',
      icon: <HiOutlineDocumentText />,
    },
  ];
  return (
    <nav className="fixed bottom-0 mx-auto flex w-full max-w-md justify-between px-14 pb-3">
      {links.map((item, index) => (
        <NavigationMenuItem
          key={index}
          {...item}
          // eslint-disable-next-line no-restricted-globals
          isActive={location.pathname === item.url}
        />
      ))}
    </nav>
  );
};

export default NavigationMenu;

import React from 'react';
import { Segment, Menu, MenuItemProps } from 'semantic-ui-react';

interface NavbarProps {
  activeItem: string;
  name: string | undefined;
  onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: MenuItemProps) => void;
}

const Navbar = ({ activeItem, name, onClick }: NavbarProps) => (
  <Segment inverted>
    <Menu inverted secondary>
      <Menu.Item
        onClick={onClick}
        name='home'
        active={activeItem == 'home'}
      >
        Home
        </Menu.Item>
      <Menu.Item
        onClick={onClick}
        name='orgApp'
        active={activeItem == 'orgApp'}
      >
        Organization Applications
        </Menu.Item>
      <Menu.Menu position='right'>
        <Menu.Item>
          {name}
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  </Segment>
);

export default Navbar;

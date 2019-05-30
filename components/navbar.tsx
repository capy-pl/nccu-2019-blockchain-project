import React from 'react';
import { Segment, Menu, MenuItemProps, Dropdown } from 'semantic-ui-react';
import Router from 'next/router';
import { clearCurrentEthAddress } from '../modules/helper';

interface NavbarProps {
  activeItem: string;
  name: string | undefined;
  isAdmin: boolean;
  onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: MenuItemProps) => void;
}

function logOut() {
  Router.push('/');
  clearCurrentEthAddress();
}

const Navbar = ({ activeItem, name, onClick, isAdmin }: NavbarProps) => (
  <Segment inverted>
    <Menu inverted secondary>
      <Menu.Item
        onClick={onClick}
        name='home'
        active={activeItem == 'home'}
      >
        Home
        </Menu.Item>
        {
        isAdmin ? 
        <Menu.Item
          onClick={onClick}
          name='orgApp'
          active={activeItem == 'orgApp'}
        >
          Organization Applications
        </Menu.Item> : ''
        }
      <Menu.Menu position='right'>
        <Dropdown item text={name}>
          <Dropdown.Menu>
            <Dropdown.Item onClick={logOut}>
              Log out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>

    </Menu>
  </Segment>
);

export default Navbar;

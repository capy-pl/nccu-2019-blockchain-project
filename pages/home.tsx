import React from 'react';
import User from '../modules/user';
import { getCurrentEthAddress } from '../modules/helper';
import { Container, Loader, Dimmer, MenuItemProps} from 'semantic-ui-react';
import Page from '../components/page';
import Navbar from '../components/navbar';

interface HomeInterface {
  activeItem: string;
  loading: boolean;
  user: User | undefined;
}

class Home extends React.Component<{}, HomeInterface> {
  constructor(props: any) {
    super(props);
    this.state = {
      activeItem: 'home',
      loading: true,
      user: undefined
    };
    this.onClick = this.onClick.bind(this);
  }

  public async componentDidMount() {
    const address = getCurrentEthAddress() as string;
    const user = new User(address);
    await user.load();
    this.setState({
      loading: false,
      user,
    })
  }

  onClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: MenuItemProps) {
    const { name } = data;
    if (name)
    this.setState({
      activeItem: name,
    });
  }

  render() {
    if (!this.state.user || this.state.loading) {
      return (
        <div>
          <Container>
            <Dimmer active>
              <Loader size='huge'>Loading...</Loader>
            </Dimmer>
          </Container>
        </div>
      );
    }

    return (<Page>
      <Navbar onClick={this.onClick} name={this.state.user.name} activeItem={this.state.activeItem}/>
    </Page>);
  }
}

export default Home;
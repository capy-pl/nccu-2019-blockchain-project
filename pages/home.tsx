import React from 'react';
import User from '../modules/user';
import { getCurrentEthAddress } from '../modules/helper';
import {
  Container,
  Loader,
  Dimmer,
  MenuItemProps,
  Segment,
} from 'semantic-ui-react';
import Page from '../components/page';
import Navbar from '../components/navbar';
import CertificationItem from '../components/certificationItem';
import AddCertificationModal from '../components/addCertificationModal';
import { Certification } from '../modules/library';

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
    this.onSubmit = this.onSubmit.bind(this);
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

  public onClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: MenuItemProps) {
    const { name } = data;
    if (name)
    this.setState({
      activeItem: name,
    });
  }
  
  public async onSubmit(certification: Certification): Promise<void> {
    if (this.state.user) {
      try {
        await this.state.user.contract.addCertification(certification.title, certification.value, certification.validFrom, certification.validTo, true, certification.orgName);
        await this.state.user.load();
        this.forceUpdate();
      } catch(err) {
        console.error(err);
      }
    }
  }

  public getCertificationItemList() {
    if (this.state.user) {
      return this.state.user.certificationList.map(certification => <CertificationItem key={certification.applicationIndex.toNumber()} certification={certification} />)
    } else {
      return;
    }
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
    const certificationList = this.getCertificationItemList();
    return (<Page>
      <Navbar onClick={this.onClick} name={this.state.user.name} activeItem={this.state.activeItem}/>
      <Segment>
        <AddCertificationModal onSubmit={this.onSubmit} />
        { certificationList }
      </Segment>
    </Page>);
  }
}

export default Home;
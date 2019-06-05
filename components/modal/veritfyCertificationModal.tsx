import React, { Component } from 'react'
import {
  Button,
  Icon,
  Modal
} from 'semantic-ui-react'
import {
  BN,
  CertificationResponse
} from '../../modules/library';

interface verifyCertificationModalState {
  open: boolean;
  loading: boolean;
}

interface verifyCertificationModalProps {
  mode: 'verify' | 'reject';
  certification: CertificationResponse;
  onConfirm: (mode: 'verify' | 'reject', index: BN, orgName: string) => Promise<void>;
}

export default class VerifyCertificationModal extends Component<verifyCertificationModalProps, verifyCertificationModalState> {
  constructor(props: verifyCertificationModalProps) {
    super(props);
    this.state = {
      open: false,
      loading: false,
    }
    this.confirm = this.confirm.bind(this);
  }

  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    if (!this.state.loading) this.setState({ open: false });
  }

  public getButton() {
    if (this.props.mode == 'verify') {
      return <Button style={{ width: '100%', height: '100%'}} color='green' onClick={this.handleOpen}>Verify</Button>
    } else {
      return <Button style={{ width: '100%', height: '100%' }} color='red' onClick={this.handleOpen}>Reject</Button>
    }
  }

  public async confirm(): Promise<void> {
    this.setState({
      loading: true,
    });
    this.props.onConfirm(this.props.mode, this.props.certification.applicationIndex, this.props.certification.orgName);
  }

  render() {
    return (
      <div>
        { this.getButton() }
          <Modal
            closeOnDimmerClick={false}
            open={this.state.open}
            onClose={this.handleClose}
            basic
            size='small'
          >
          <Modal.Content>
            <h3>Are you sure you want to { this.props.mode } this certification?</h3>
          </Modal.Content>
          <Modal.Actions>
            <Button loading={this.state.loading} color='green' onClick={this.confirm} inverted>
              <Icon name='checkmark' /> Confirm
            </Button>
            <Button loading={this.state.loading} color='red' onClick={this.handleClose} inverted>
              <Icon name='x' /> Close
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}
import React, { ChangeEvent } from 'react';
import {
  Button,
  Form,
  Modal,
  Message
} from 'semantic-ui-react';
import { UserBriefInfo } from '../../modules/library';

export interface IssueCertificationModalState {
  id: string;
  title: string;
  value: string;
  orgName: string;
  validFrom: number;
  validTo: number;
  open: boolean;
  loading: boolean;
  error: boolean;
}

interface IssueCertificationModalProps {
  onSubmit: (form: IssueCertificationModalState) => Promise<void>;
  members: UserBriefInfo[];
}

interface FieldChangeProps {
  name: 'title' | 'value' | 'orgName';
  value: string;
}

export default class IssueCertificationModal extends React.Component<IssueCertificationModalProps, IssueCertificationModalState> {
  constructor(props: IssueCertificationModalProps) {
    super(props);
    this.state = {
      title: '',
      value: '',
      orgName: '',
      id: '',
      validFrom: 0,
      validTo: 0,
      open: false,
      loading: false,
      error: false
    };
    this.onChange = this.onChange.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  public onChange(event: ChangeEvent<HTMLFormElement>, { name, value }: FieldChangeProps) {
    this.setState({
    ...this.state,
      [name]: value
    });
  }

  public onClose() {
    if (!this.state.loading) {
      this.setState({
        open: false
      });
      this.clear();
    }
  }

  public onOpen() {
    this.setState({
      open: true
    });
  }

  public clear() {
    this.setState({
      title: '',
      value: '',
      orgName: '',
      id: '',
    });
  }

  public async onSubmit(): Promise<void> {
    if (!this.state.loading) {
      this.setState({
        loading: true,
      });
        this.props.onSubmit(this.state)
          .then(() => {
            this.clear();
            this.setState({
              open: false,
              loading: false,
            });
          })
          .catch(err => {
            this.setState({
              loading: false,
              error: true
            });
          }) 
    }
  }

  public render() {
    return (
      <div>
        <Button
          color='blue'
          onClick={this.onOpen}
        >Issue Certification</Button>
      <Modal
      open={this.state.open}
      centered={false}
      >
        <Modal.Header>Issue New Certification</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form
              loading={this.state.loading}
              error={this.state.error}
            >
              <Form.Input label='Title' placeholder='title' name='title' value={this.state.title} onChange={this.onChange} />
              <Form.Input label='Description' placeholder='description' name='value' value={this.state.value} onChange={this.onChange} />
              <Form.Select label='Target' options={this.props.members.map(member => ({ text: member.name, value: member.id }))} name='id' onChange={this.onChange} />

              <Message
                error
                header='Error'
                content='Please check your network connection.'
              />
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button primary loading={this.state.loading} onClick={this.onSubmit}>Add</Button>
          <Button primary negative loading={this.state.loading} onClick={this.onClose}>Close</Button>
        </Modal.Actions>
      </Modal>
      </div>
    )
  }
}

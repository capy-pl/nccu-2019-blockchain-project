import React from 'react';
import MemberCertificationContract from '../modules/library';

class Index extends React.Component {
  public componentDidMount() {
    const customWindow = window as any;
    customWindow['MemberCertificationContract'] = MemberCertificationContract;
  }

  public render() {
    return (
      <div>
        <p>Hello Next.js</p>
      </div>
    )
  }
}
export default Index

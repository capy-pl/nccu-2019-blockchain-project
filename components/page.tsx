import React from 'react';
import Meta from './meta';

const Page = ({ children }: React.Props<{}>) => (
  <React.Fragment>
    <Meta />
    {
      children
    }
  </React.Fragment>
);

export default Page;

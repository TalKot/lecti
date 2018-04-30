//todo - change this file
import React from 'react'
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'

const LoaderText = () => (
  <div>
    <Segment>
      <Dimmer active inverted>
        <Loader size='large'>Loading</Loader>
      </Dimmer>
      <Image src='/assets/images/wireframe/paragraph.png' />
    </Segment>
  </div>
)

export default LoaderText

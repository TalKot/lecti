import React from 'react'
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'

const LoaderText = () => (
  <div>
    <Segment>
      <Dimmer active inverted>
        <Loader size='large'>Loading</Loader>
      </Dimmer>
    </Segment>
  </div>
)

export default LoaderText

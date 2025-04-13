import React from 'react';
import ServiceImage from './ServiceImage';

/**
 * Legacy compatibility component for DirectServiceImage
 * This forwards to the new ServiceImage component
 * 
 * @deprecated Use ServiceImage instead
 */
const DirectServiceImage = (props) => {
  // Just forward all props to the new component
  return <ServiceImage {...props} />;
};

export default DirectServiceImage; 
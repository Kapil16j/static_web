import React, { useEffect, useRef } from 'react';

const Widget = ({ snippet, evaluateDelay }) => {
  const widgetRef = useRef(null);

  useEffect(() => {
    if (widgetRef.current) {
      const scriptTags = widgetRef.current.getElementsByTagName('script');
  
      // Iterate through script tags
      for (let i = 0; i < scriptTags.length; i++) {
        const scriptTag = scriptTags[i];
        
        if (scriptTag.type === 'application/json') {
          const jsonContent = JSON.parse(scriptTag.textContent);
          // Handle JSON data if needed
        } else {
          const newScriptTag = document.createElement('script');
          
          // Copy attributes from original script tag
          if (scriptTag.src) {
            newScriptTag.src = scriptTag.src;
          } else {
            newScriptTag.innerHTML = scriptTag.innerHTML;
          }
  
          // Append the new script tag after a delay
          setTimeout(() => {
            widgetRef.current.appendChild(newScriptTag);
          }, evaluateDelay);
        }
      }
    }
  }, [snippet, evaluateDelay]);
  

  return (
    <div
      ref={widgetRef}
      dangerouslySetInnerHTML={{ __html: snippet }}
    />
  );
};

export default Widget;

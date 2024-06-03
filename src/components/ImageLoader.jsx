import React, { useState, useEffect } from 'react';

export default function PrizeImgaeLoader({ src }) {
    const [imageExists, setImageExists] = useState(false);
  
    useEffect(() => {
      if (src) {
        if (src.startsWith('http')) {
          fetch(src)
            .then(response => {
              if (response.ok) {
                setImageExists(true);
              } else {
                setImageExists(false);
              }
            })
            .catch(() => setImageExists(false));
        } else {
          const img = new Image();
          img.onload = () => setImageExists(true);
          img.onerror = () => setImageExists(false);
          img.src = require(`${src}`);
        }
      }
    }, [src]);
  
    return (
      <>
        {imageExists && (
          <img
            className='rounded-5 w-100'
            src={src.startsWith('http') ? src : require(`${src}`)}
            alt="Prize Image"
          />
        )}
        {!imageExists && src && (<img
            className='rounded-5 w-100 img-not-found'
            src={require(`../images/money-bag.png`)}
            alt="Prize Image"
          />
        )}
      </>
    );
  }
  
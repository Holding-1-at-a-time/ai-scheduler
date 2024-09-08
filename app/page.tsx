import React from 'react';

const Page = () => {
  const handleClick = () => {
    throw new Error('Sentry Frontend Error');
  };

  return (
    <div>
      <p>Page</p>
      <button type="button" onClick={handleClick}>
        Throw error
      </button>
    </div>
  );
};

export default Page;

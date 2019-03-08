import React from 'react';

const PageContext = React.createContext({
  onPageChange: () => (null),
  onPerPageChange: () => (null),
  perPage: 5,
  currentPage: 1,
  pagesCount: 4,
  totalItems: 20,
});

export default PageContext;

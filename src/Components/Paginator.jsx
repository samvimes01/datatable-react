/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Paginator.css';

import PageContext from './PageContext';

const Paginator = (props) => {
  const {
    selector,
    info,
  } = props;

  const getStartItem = (currentPage, perPage) => (
    (currentPage - 1) * perPage
  );

  const getEndItem = (currentPage, perPage, totalItems) => {
    const startIndex = getStartItem(currentPage, perPage);
    return Math.min(startIndex + perPage, totalItems);
  };

  const getPages = (pagesCount) => {
    const pages = [];

    for (let i = 1; i <= pagesCount; i++) {
      pages.push(i);
    }

    return pages;
  };

  const getCorrectPage = (page, pagesCount) => (
    Math.min(
      Math.max(1, page), pagesCount,
    )
  );

  const getPrevPage = (currentPage, pagesCount) => (
    getCorrectPage(currentPage - 1, pagesCount)
  );

  const getNextPage = (currentPage, pagesCount) => (
    getCorrectPage(currentPage + 1, pagesCount)
  );

  return (
    <PageContext.Consumer>
      {({
        onPageChange,
        onPerPageChange,
        perPage,
        currentPage,
        pagesCount,
        totalItems,
      }) => (
        <div className="paginator">
          {selector
            ? (
              <select value={perPage} onChange={event => onPerPageChange(+event.target.value)}>
                {[3, 5, 10, 20].map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )
            : ''
          }

          <button type="button" className="paginator__page-button" onClick={() => onPageChange(getPrevPage(currentPage, pagesCount))}>{'<-'}</button>
          {getPages(pagesCount).map(page => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(getCorrectPage(page, pagesCount))}
              className={(page === currentPage) ? 'paginator__page-button paginator__page-button--current' : 'paginator__page-button'}
            >
              { page }
            </button>
          ))}
          <button type="button" className="paginator__page-button" onClick={() => onPageChange(getNextPage(currentPage, pagesCount))}>{'->'}</button>

          {info
            ? (
              <span data-element="page-info" className="paginator__page-info">
                  Show {getStartItem(currentPage, perPage) + 1} to {getEndItem(currentPage, perPage, totalItems)} phones from {totalItems}
              </span>
            )
            : ''
          }
        </div>
      )}
    </PageContext.Consumer>
  );
};

Paginator.propTypes = {
  selector: PropTypes.bool,
  info: PropTypes.bool,
};
Paginator.defaultProps = {
  selector: false,
  info: false,
};

export default Paginator;

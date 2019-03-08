import React from 'react';
import PropTypes from 'prop-types';

const setColumnClass = (key, notSortable, sortInfo) => {
  const { sortKey, sortOrder } = sortInfo;
  let className = '';
  if (sortOrder && sortKey === key) {
    className = sortOrder;
  } else if (notSortable) {
    className = 'unsorted';
  }
  return className;
};

const DatatableHeader = ({
  isAllSelected,
  columns,
  onAllSelect,
  sortInfo,
  onSortItems,
}) => (
  <thead>
    <tr>
      <th>
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={onAllSelect}
        />
      </th>
      {Object.entries(columns).map(([key, config]) => (
        <th
          key={key}
          className={setColumnClass(key, config.isSortable, sortInfo)}
          onClick={() => onSortItems(config.isSortable ? key : '')}
        >
          {config.title}
        </th>
      ))}
    </tr>
  </thead>
);

DatatableHeader.propTypes = {
  isAllSelected: PropTypes.bool,
  columns: PropTypes.shape({
    title: PropTypes.string,
    isSortable: PropTypes.bool,
    isSearchable: PropTypes.bool,
  }).isRequired,
  onAllSelect: PropTypes.func.isRequired,
  onSortItems: PropTypes.func.isRequired,
  sortInfo: PropTypes.shape({
    sortKey: PropTypes.string,
    sortOrder: PropTypes.string,
  }),
};
DatatableHeader.defaultProps = {
  isAllSelected: false,
  sortInfo: { sortKey: '', sortOrder: 'asc' },
};

export default DatatableHeader;

/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

const DatatableItem = ({
  selectedItemsIds,
  isEditing,
  columns,
  item,
  onSelectItem,
  onEditItem,
}) => (
  <tr>
    <td>
      <input
        type="checkbox"
        checked={selectedItemsIds.includes(item.id)}
        onChange={() => onSelectItem(item.id)}
      />
    </td>
    {Object.keys(columns).map((col, i) => {
      let value = item[col];
      if (isEditing.id === item.id && isEditing.col === col) {
        value = isEditing.innerJSX;
      }
      return (
      // eslint-disable-next-line react/no-array-index-key
        <td key={i} onDoubleClick={() => onEditItem(item.id, col, item[col])}>
          {value}
        </td>
      );
    })}
  </tr>
);

DatatableItem.propTypes = {
  selectedItemsIds: PropTypes.array,
  isEditing: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      id: PropTypes.string,
      col: PropTypes.object,
      innerJSX: PropTypes.object,
    }),
  ]),

  columns: PropTypes.shape({
    title: PropTypes.string,
    isSortable: PropTypes.bool,
    isSearchable: PropTypes.bool,
  }).isRequired,

  onSelectItem: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
};

DatatableItem.defaultProps = {
  selectedItemsIds: [],
  isEditing: false,
};

export default DatatableItem;

/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Filter from './Filter';
import Paginator from './Paginator';
import PageContext from './PageContext';
import DatatableHeader from './DtHeader';
import DatatableItem from './TbItem';

import '../styles/Datatable.css';

export default class Datatable extends Component {
  static defaultProps = {
    items: [],
  }

  state = {
    currentPage: 1,
    selectedItemsIds: [],
    isAllSelected: false,
    perPage: 5,
    currentQuery: '',
    sortKey: '',
    sortOrder: 'asc',
    isEditing: false,
  }

  editCache = '';

  getData() {
    const { currentQuery, sortKey, sortOrder } = this.state;
    const { items, columnConfig } = this.props;

    return items
      .filter(this._filterItemsCallback(currentQuery, columnConfig))
      .sort(this._sortCallback(sortKey, sortOrder));
  }

  getSelected() {
    const { selectedItemsIds } = this.state;
    if (!selectedItemsIds) {
      return null;
    }

    return this.getData().filter(item => selectedItemsIds.includes(item.id));
  }

  _selectAllItems = () => {
    this.setState(({ isAllSelected }) => {
      const renderedItems = this.getData();
      const selectedItemsIds = isAllSelected ? [] : renderedItems.map(item => item.id);
      return {
        isAllSelected: !isAllSelected,
        selectedItemsIds,
      };
    });
  }

  _selectItem = (itemId) => {
    const renderedItems = this.getData();
    const { selectedItemsIds } = this.state;
    // filter all ids except itemId
    const newSelectedItemsIds = selectedItemsIds
      .filter(id => id !== itemId);

    const prevSelectedAmount = selectedItemsIds.length;
    // if itemId was not in selected list - include it
    if (newSelectedItemsIds.length === prevSelectedAmount) {
      newSelectedItemsIds.push(itemId);
    }

    const isAllSelected = renderedItems.length === newSelectedItemsIds.length;

    this.setState({
      isAllSelected,
      selectedItemsIds: newSelectedItemsIds,
    });
  }

  _sortCallback = (sortBy, order) => {
    if (order === 'desc') {
      return (a, b) => {
        switch (typeof a[sortBy]) {
          case 'number':
            return b[sortBy] - a[sortBy];

          case 'string':
            return b[sortBy].localeCompare(a[sortBy]);

          default:
            return 1;
        }
      };
    }
    return (a, b) => {
      switch (typeof a[sortBy]) {
        case 'number':
          return a[sortBy] - b[sortBy];

        case 'string':
          return a[sortBy].localeCompare(b[sortBy]);

        default:
          return 1;
      }
    };
  }

  _sortItems = (sortBy) => {
    this.setState((prevState) => {
      let order;
      if (prevState.sortOrder === 'asc') {
        order = 'desc';
      } else {
        order = 'asc';
      }

      return {
        sortKey: sortBy,
        sortOrder: order,
      };
    });
  }

  _filterItemsCallback = (query, config) => (item) => {
    const regexp = new RegExp(query, 'i');
    // eslint-disable-next-line no-restricted-syntax
    for (const entry of Object.entries(config)) {
      const key = entry[0];
      const colConfig = entry[1];

      if (colConfig.isSearchable && regexp.test(item[key])) {
        return true;
      }
    }
    return false;
  }

  handleFilterChange = (query) => {
    this.setState({
      currentQuery: query,
      currentPage: 1,
      isAllSelected: false,
      selectedItemsIds: [],
    });
  }

  handlePageChange = (currentPage) => {
    this.setState({ currentPage });
  }

  handlePerPageChange = (perPage) => {
    this.setState({
      perPage,
      currentPage: 1,
    });
  }

  cancelEdit = () => {
    this.editCache = '';
    this.setState({ isEditing: false });
  }

  saveEdit = (itemId, col) => {
    this.setState((prevState) => {
      // const newRenderedItems = [...prevState.renderedItems];
      // const editableItemIndex = prevState.renderedItems.findIndex(el => el.id === itemId);

      // newRenderedItems[editableItemIndex][col] = this.editCache;
      // куда сохранять данные???
      this.editCache = '';
      return {
        isEditing: false,
      };
    });
  }

  changeEdit = ({ target }) => {
    this.editCache = target.value;
  }

  editItem = (itemId, col, text) => {
    if (this.state.isEditing) {
      return;
    }

    this.editCache = text;

    const innerJSX = (
      <form className="edititem">
        <button id="x" type="button" onClick={this.cancelEdit}>x</button>
        <textarea
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          defaultValue={text}
          onChange={this.changeEdit}
          onKeyDown={event => (event.keyCode === 13 ? this.saveEdit(itemId, col) : null)}
          onBlur={() => this.saveEdit(itemId, col)}
        />
      </form>
    );

    this.setState({
      isEditing: {
        id: itemId,
        col,
        innerJSX,
      },
    });
  }

  render() {
    const {
      selectedItemsIds,
      currentQuery,
      perPage,
      currentPage,
      isAllSelected,
      isEditing,
      sortKey,
      sortOrder,
    } = this.state;

    const { columnConfig } = this.props;

    const renderedItems = this.getData();

    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;

    const visibleItems = renderedItems.slice(startIndex, endIndex);

    const itemProps = {
      selectedItemsIds,
      isEditing,
      columns: columnConfig,
      onSelectItem: this._selectItem,
      onEditItem: this.editItem,
    };

    const headerProps = {
      columns: columnConfig,
      isAllSelected,
      onAllSelect: this._selectAllItems,
      onSortItems: this._sortItems,
      sortInfo: { sortKey, sortOrder },
    };

    const pagesCount = Math.ceil(renderedItems.length / perPage);

    const context = {
      onPageChange: this.handlePageChange,
      onPerPageChange: this.handlePerPageChange,
      perPage,
      currentPage,
      pagesCount,
      totalItems: renderedItems.length,
    };

    return (
      <>
        <Filter query={currentQuery} onChange={this.handleFilterChange} />
        <PageContext.Provider value={context}>
          <Paginator selector />

          <table className="tabledata">
            <DatatableHeader {...headerProps} />
            <tbody>
              {visibleItems.map(item => <DatatableItem key={item.id} item={item} {...itemProps} />)}
            </tbody>
          </table>

          <Paginator info />
        </PageContext.Provider>
      </>
    );
  }
}
Datatable.contextType = PageContext;


Datatable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    age: PropTypes.number,
    id: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    name: PropTypes.string,
    snippet: PropTypes.string,
  })),
  columnConfig: PropTypes.shape({
    title: PropTypes.string,
    isSortable: PropTypes.bool,
    isSearchable: PropTypes.bool,
  }).isRequired,
};

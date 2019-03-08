import React, { Component } from 'react';
import { hot } from 'react-hot-loader';


import logo from './logo.svg';
import './styles/App.css';
import Datatable from './Components/Datatable';

class App extends Component {
  state = {
    phones: [],
    isLoading: true,
  }

  componentDidMount() {
    fetch('https://samvimes01.github.io/phoneapp/phones/phones.json')
      .then(data => data.json())
      .then(phones => this.setState({ phones, isLoading: false }));
  }

  render() {
    const { phones, isLoading } = this.state;
    return (
      <div className="app">
        <header className="app-header">
          <img src={logo} className="app-logo" alt="logo" />
          <p>
            {'Datatable react app'}
          </p>
        </header>
        <main className="app-main">
          {/* После получения данных в componentDidMount не рендерится с новыми phones.
              Вопрос -можно обойти без использования isLoading ? */}
          {isLoading
            ? 'Loading...'
            : (
              <Datatable
                items={phones}
                columnConfig={{
                  name: {
                    title: 'Название',
                    isSortable: true,
                    isSearchable: true,
                  },
                  age: {
                    title: 'Возраст',
                    isSortable: true,
                  },
                  snippet: {
                    title: 'Описание',
                    isSearchable: true,
                  },
                }}
              />
            )
          }

        </main>
      </div>
    );
  }
}

export default hot(module)(App);

"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class App extends React.Component {
  constructor() {
    super();

    _defineProperty(this, "test", async () => {
      try {
        let response = await fetch('https://jsonplaceholder.typicode.com/posts');
        response = await response.json();
        console.log(response);
      } catch (err) {
        console.error(err);
      }
    });

    this.state = {
      test: 'test'
    };
  }

  render() {
    return React.createElement("div", null, React.createElement("h2", null, "sdfij"), React.createElement("button", {
      onClick: this.test
    }, "etst"));
  }

}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));

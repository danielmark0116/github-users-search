class App extends React.Component {
  constructor() {
    super();
    this.state = {
      test: 'test'
    };
  }

  test = async () => {
    try {
      let response = await fetch('https://jsonplaceholder.typicode.com/posts');
      response = await response.json();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return (
      <div>
        <h2>sdfij</h2>
        <button onClick={this.test}>etst</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

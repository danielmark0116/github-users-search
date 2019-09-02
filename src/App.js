class Error extends React.Component {
  render() {
    return <p>Upps, something went wrong here...</p>;
  }
}

class User extends React.Component {
  static propType = {
    user: PropTypes.object.isRequired
  };

  static defaultProps = {
    user: {}
  };

  get userItem() {
    const { user } = this.props;
    return (
      <li>
        <img src={user.avatar_url} alt={`${user.login}'s profile picture`} />
        <h2>{user.login}</h2>
        <a href={user.url} target="_blank">
          See {user.login}'s profile on GitHub
        </a>
      </li>
    );
  }

  render() {
    return this.userItem;
  }
}

class Users extends React.Component {
  static propTypes = {
    users: PropTypes.array.isRequired,
    notFound: PropTypes.bool.isRequired
  };

  static defaultProps = {
    users: [],
    notFound: false
  };

  get usersList() {
    const { users } = this.props;
    return users.map((user, i) => (
      <div key={i}>
        <User user={user}></User>
      </div>
    ));
  }

  render() {
    const { notFound } = this.props;
    if (notFound) return <h2>not found</h2>;
    return <div>{this.usersList}</div>;
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      loading: false,
      fetchResults: null,
      fetchedUsers: [],
      notFound: false,
      error: false,
      inputAlert: false
    };
  }

  handleInput = e => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submitForm = e => {
    e.preventDefault();
    const { name } = this.state;
    if (name.length > 1) {
      this.fetchUsers(name);
      this.setState({
        inputAlert: false
      });
    } else {
      this.setState({
        inputAlert: true
      });
    }
  };

  fetchUsers = async name => {
    const url = `ahttps://api.github.com/search/users?q=${name}`;

    this.setState({
      notFound: false,
      loading: true,
      error: false
    });

    try {
      let response = await fetch(url);
      response = await response.json();

      this.setState(
        {
          fetchResults: response,
          fetchedUsers: response.items,
          loading: false
        },
        () => {
          if (this.state.fetchResults.total_count === 0) {
            this.setState({
              notFound: true
            });
          }
        }
      );
    } catch (err) {
      console.error(err);

      this.setState({
        loading: false,
        error: true
      });
    }
  };

  render() {
    const { fetchedUsers, notFound, loading, inputAlert, error } = this.state;

    return (
      <div>
        <form onSubmit={this.submitForm}>
          <input
            type="text"
            name="name"
            placeholder="Type in the GitHub user name"
            autoComplete="off"
            onChange={this.handleInput}
          />
          {inputAlert && <small>Type in at least 2 characters or more</small>}
          {!notFound && !error && !loading && fetchedUsers.length === 0 && (
            <p>Type in the name and hit enter</p>
          )}
        </form>

        {loading && 'Loading'}
        {error && <Error></Error>}
        {!error && !loading && (
          <Users notFound={notFound} users={fetchedUsers} error={error}></Users>
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

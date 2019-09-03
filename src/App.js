class Header extends React.Component {
  static propTypes = {
    pic: PropTypes.string.isRequired
  };

  render() {
    return (
      <section>
        <div className="container">
          <div className="header">
            <div className="logo">
              <img src={this.props.pic} alt="" />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

class SearchBar extends React.Component {
  static propTypes = {
    submitForm: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    handleInput: PropTypes.func.isRequired,
    inputAlert: PropTypes.bool.isRequired,
    notFound: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    fetchedUsers: PropTypes.array.isRequired,
    ico: PropTypes.string.isRequired
  };

  render() {
    const {
      submitForm,
      name,
      handleInput,
      inputAlert,
      notFound,
      error,
      loading,
      fetchedUsers,
      ico
    } = this.props;

    return (
      <section>
        <div className="container">
          <form onSubmit={submitForm} className="custom-form">
            <div className="input-group">
              <div className="input-ico">
                <img src={ico} alt="" />
              </div>
              <div className="input-field">
                <input
                  type="text"
                  name="name"
                  placeholder="Type in the GitHub user name"
                  value={name}
                  autoComplete="off"
                  onChange={handleInput}
                />
              </div>
            </div>
            {inputAlert && <small>Type in at least 2 characters or more</small>}
            {!notFound &&
              !error &&
              !loading &&
              !inputAlert &&
              fetchedUsers.length === 0 && (
                <small>Type in the name and hit enter</small>
              )}
          </form>
        </div>
      </section>
    );
  }
}

class Error extends React.Component {
  render() {
    return <p>Upps, something went wrong here...</p>;
  }
}

class User extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    itemNo: PropTypes.number.isRequired
  };

  static defaultProps = {
    user: {}
  };

  get userItem() {
    const { user, itemNo } = this.props;
    return (
      <div>
        <img src={user.avatar_url} alt={`${user.login}'s profile picture`} />
        <h2>{user.login}</h2>
        <a href={user.url} target="_blank">
          See {user.login}'s profile on GitHub
        </a>
      </div>
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

  mouseMove = (num, e) => {
    const element = document.querySelectorAll(`.card-${num}`);
    // console.log(e.target);
    // console.log(window.innerWidth / 2 - e.clientX);
    const t1 = new TimelineMax();

    t1.to(element, 1, { y: -20 });
  };

  mouseLeave = (num, e) => {
    const element = document.querySelectorAll(`.card-${num}`);
    const t1 = new TimelineMax();

    t1.to(element, 1, { y: 0 });
  };

  get usersList() {
    const { users } = this.props;
    return users.map((user, i) => (
      <li
        className={`card card-${i}`}
        key={i}
        style={{ top: `${i * 200}px` }}
        onMouseMove={e => {
          this.mouseMove(i, e);
        }}
        onMouseLeave={e => {
          this.mouseLeave(i, e);
        }}
      >
        <User user={user} itemNo={i}></User>
      </li>
    ));
  }

  render() {
    const { notFound } = this.props;
    if (notFound) return <h2>not found</h2>;
    return <ul className="cards">{this.usersList}</ul>;
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      name: 'dev',
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
    const url = `https://api.github.com/search/users?q=${name}`;

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
      <main>
        <Header pic={'assets/logo.svg'}></Header>
        <SearchBar
          handleInput={this.handleInput}
          name={this.state.name}
          submitForm={this.submitForm}
          inputAlert={inputAlert}
          notFound={notFound}
          error={error}
          loading={loading}
          fetchedUsers={fetchedUsers}
          ico={'assets/search.svg'}
        />
        {/* <form onSubmit={this.submitForm}>
          <input
            type="text"
            name="name"
            placeholder="Type in the GitHub user name"
            value={this.state.name}
            autoComplete="off"
            onChange={this.handleInput}
          />
          {inputAlert && <small>Type in at least 2 characters or more</small>}
          {!notFound && !error && !loading && fetchedUsers.length === 0 && (
            <p>Type in the name and hit enter</p>
          )}
        </form> */}

        {loading && 'Loading'}
        {error && <Error></Error>}
        {!error && !loading && (
          <Users notFound={notFound} users={fetchedUsers} error={error}></Users>
        )}
      </main>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

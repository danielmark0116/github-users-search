class Loading extends React.Component {
  render() {
    return (
      <section className="loader">
        <p>Loading...</p>
      </section>
    );
  }
}

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
      <div className="card-content">
        <div className="ico">
          <img
            src={
              itemNo % 2 === 0
                ? 'assets/person-blue.svg'
                : 'assets/person-white.svg'
            }
            alt=""
          />
        </div>
        <div className="name">
          <p>{user.login}</p>
        </div>
        <div className="hint">
          <p>Hover for more info</p>
          <a
            href={user.html_url}
            className={`link link-${itemNo}`}
            target="_blank"
          >
            <button>link to github</button>
          </a>
        </div>
        <div className="short-info">
          <p>Score: {user.score}</p>
        </div>
        <div className="profile-pic">
          <img
            className={`profile-pic-${itemNo}`}
            src={user.avatar_url}
            alt={`${user.login}'s profile picture`}
          />
        </div>
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

  mouseEnter = (num, e) => {
    const element = document.querySelectorAll(`.card-${num}`);
    const elementsPic = document.querySelectorAll(`.profile-pic-${num}`);
    const cards = document.querySelector(`.cards`);
    const t1 = new TimelineMax();
    const t2 = new TimelineMax();
    const t3 = new TimelineMax();

    t1.set(element, {
      transformPerspective: 400,
      transformOrigin: 'center center'
    });

    t2.to(cards, 0.5, { scale: 0.98 });
    t1.to(element, 0.5, {
      scale: 1.1,
      x: 0,
      y: -20,
      ease: Back.easeOut.config(1.7)
    });
    t3.to(elementsPic, 0.4, {
      scale: 1.7,
      transformOrigin: 'center right',
      ease: Back.easeOut.config(2)
    });
  };

  mouseMove = (num, e) => {
    const element = document.querySelectorAll(`.card-${num}`);
    const t1 = new TimelineMax();
    let rotationValue = (window.innerWidth / 2 - e.screenX) * 0.003;

    t1.set(element, {
      transformPerspective: 400,
      transformOrigin: 'center center'
    });

    t1.to(element, 0.5, { rotationY: rotationValue });
  };

  mouseLeave = (num, e) => {
    const element = document.querySelectorAll(`.card-${num}`);
    const cards = document.querySelector(`.cards`);
    const elementsPic = document.querySelectorAll(`.profile-pic-${num}`);
    const t1 = new TimelineMax();
    const t2 = new TimelineMax();
    const t3 = new TimelineMax();

    t1.to(element, 0.75, {
      scale: 1,
      y: 0,
      x: 0,
      rotationY: 0,
      ease: Bounce.easeOut
    });
    t2.to(cards, 0.5, { scale: 1 });
    t3.to(elementsPic, 0.4, { scale: 1 });
  };

  get usersList() {
    const { users } = this.props;
    return users.map((user, i) => (
      <li
        className={`card card-${i}`}
        key={i}
        style={{ top: `${i * 90}px` }}
        onMouseEnter={e => {
          this.mouseEnter(i, e);
        }}
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
    return (
      <div className="container my-4">
        <h2>Results:</h2>
        <ul className="cards">{this.usersList}</ul>
      </div>
    );
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
        {loading && <Loading />}
        {error && <Error></Error>}
        {fetchedUsers.length > 0 && !error && !loading && (
          <Users notFound={notFound} users={fetchedUsers} error={error}></Users>
        )}
      </main>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

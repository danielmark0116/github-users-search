"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Error extends React.Component {
  render() {
    return React.createElement("p", null, "Upps, something went wrong here...");
  }

}

class User extends React.Component {
  get userItem() {
    const {
      user,
      itemNo
    } = this.props;
    return React.createElement("div", null, React.createElement("img", {
      src: user.avatar_url,
      alt: `${user.login}'s profile picture`
    }), React.createElement("h2", null, user.login), React.createElement("a", {
      href: user.url,
      target: "_blank"
    }, "See ", user.login, "'s profile on GitHub"));
  }

  render() {
    return this.userItem;
  }

}

_defineProperty(User, "propType", {
  user: PropTypes.object.isRequired,
  itemNo: PropTypes.number.isRequired
});

_defineProperty(User, "defaultProps", {
  user: {}
});

class Users extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "mouseMove", (num, e) => {
      const element = document.querySelectorAll(`.card-${num}`); // console.log(e.target);
      // console.log(window.innerWidth / 2 - e.clientX);

      const t1 = new TimelineMax();
      t1.to(element, 1, {
        y: -20
      });
    });

    _defineProperty(this, "mouseLeave", (num, e) => {
      const element = document.querySelectorAll(`.card-${num}`);
      const t1 = new TimelineMax();
      t1.to(element, 1, {
        y: 0
      });
    });
  }

  get usersList() {
    const {
      users
    } = this.props;
    return users.map((user, i) => React.createElement("li", {
      className: `card card-${i}`,
      key: i,
      style: {
        top: `${i * 200}px`
      },
      onMouseMove: e => {
        this.mouseMove(i, e);
      },
      onMouseLeave: e => {
        this.mouseLeave(i, e);
      }
    }, React.createElement(User, {
      user: user,
      itemNo: i
    })));
  }

  render() {
    const {
      notFound
    } = this.props;
    if (notFound) return React.createElement("h2", null, "not found");
    return React.createElement("ul", {
      className: "cards"
    }, this.usersList);
  }

}

_defineProperty(Users, "propTypes", {
  users: PropTypes.array.isRequired,
  notFound: PropTypes.bool.isRequired
});

_defineProperty(Users, "defaultProps", {
  users: [],
  notFound: false
});

class App extends React.Component {
  constructor() {
    super();

    _defineProperty(this, "handleInput", e => {
      e.preventDefault();
      this.setState({
        [e.target.name]: e.target.value
      });
    });

    _defineProperty(this, "submitForm", e => {
      e.preventDefault();
      const {
        name
      } = this.state;

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
    });

    _defineProperty(this, "fetchUsers", async name => {
      const url = `https://api.github.com/search/users?q=${name}`;
      this.setState({
        notFound: false,
        loading: true,
        error: false
      });

      try {
        let response = await fetch(url);
        response = await response.json();
        this.setState({
          fetchResults: response,
          fetchedUsers: response.items,
          loading: false
        }, () => {
          if (this.state.fetchResults.total_count === 0) {
            this.setState({
              notFound: true
            });
          }
        });
      } catch (err) {
        console.error(err);
        this.setState({
          loading: false,
          error: true
        });
      }
    });

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

  render() {
    const {
      fetchedUsers,
      notFound,
      loading,
      inputAlert,
      error
    } = this.state;
    return React.createElement("div", null, React.createElement("form", {
      onSubmit: this.submitForm
    }, React.createElement("input", {
      type: "text",
      name: "name",
      placeholder: "Type in the GitHub user name",
      value: this.state.name,
      autoComplete: "off",
      onChange: this.handleInput
    }), inputAlert && React.createElement("small", null, "Type in at least 2 characters or more"), !notFound && !error && !loading && fetchedUsers.length === 0 && React.createElement("p", null, "Type in the name and hit enter")), loading && 'Loading', error && React.createElement(Error, null), !error && !loading && React.createElement(Users, {
      notFound: notFound,
      users: fetchedUsers,
      error: error
    }));
  }

}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));

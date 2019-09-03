"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Loading extends React.Component {
  render() {
    return React.createElement("section", {
      className: "loader"
    }, React.createElement("p", null, "Loading..."));
  }

}

class Header extends React.Component {
  render() {
    return React.createElement("section", null, React.createElement("div", {
      className: "container"
    }, React.createElement("div", {
      className: "header"
    }, React.createElement("div", {
      className: "logo"
    }, React.createElement("img", {
      src: this.props.pic,
      alt: ""
    })))));
  }

}

_defineProperty(Header, "propTypes", {
  pic: PropTypes.string.isRequired
});

class SearchBar extends React.Component {
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
    return React.createElement("section", null, React.createElement("div", {
      className: "container"
    }, React.createElement("form", {
      onSubmit: submitForm,
      className: "custom-form"
    }, React.createElement("div", {
      className: "input-group"
    }, React.createElement("div", {
      className: "input-ico"
    }, React.createElement("img", {
      src: ico,
      alt: ""
    })), React.createElement("div", {
      className: "input-field"
    }, React.createElement("input", {
      type: "text",
      name: "name",
      placeholder: "Type in the GitHub user name",
      value: name,
      autoComplete: "off",
      onChange: handleInput
    }))), inputAlert && React.createElement("small", null, "Type in at least 2 characters or more"), !notFound && !error && !loading && !inputAlert && fetchedUsers.length === 0 && React.createElement("small", null, "Type in the name and hit enter"))));
  }

}

_defineProperty(SearchBar, "propTypes", {
  submitForm: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  handleInput: PropTypes.func.isRequired,
  inputAlert: PropTypes.bool.isRequired,
  notFound: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  fetchedUsers: PropTypes.array.isRequired,
  ico: PropTypes.string.isRequired
});

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
    return React.createElement("div", {
      className: "card-content"
    }, React.createElement("div", {
      className: "ico"
    }, React.createElement("img", {
      src: itemNo % 2 === 0 ? 'assets/person-blue.svg' : 'assets/person-white.svg',
      alt: ""
    })), React.createElement("div", {
      className: "name"
    }, React.createElement("p", null, user.login)), React.createElement("div", {
      className: "hint"
    }, React.createElement("p", null, "Hover for more info"), React.createElement("a", {
      href: user.html_url,
      className: `link link-${itemNo}`,
      target: "_blank"
    }, React.createElement("button", null, "link to github"))), React.createElement("div", {
      className: "short-info"
    }, React.createElement("p", null, "Score: ", user.score)), React.createElement("div", {
      className: "profile-pic"
    }, React.createElement("img", {
      className: `profile-pic-${itemNo}`,
      src: user.avatar_url,
      alt: `${user.login}'s profile picture`
    })));
  }

  render() {
    return this.userItem;
  }

}

_defineProperty(User, "propTypes", {
  user: PropTypes.object.isRequired,
  itemNo: PropTypes.number.isRequired
});

_defineProperty(User, "defaultProps", {
  user: {}
});

class Users extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "mouseEnter", (num, e) => {
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
      t2.to(cards, 0.5, {
        scale: 0.98
      });
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
    });

    _defineProperty(this, "mouseMove", (num, e) => {
      const element = document.querySelectorAll(`.card-${num}`);
      const t1 = new TimelineMax();
      let rotationValue = (window.innerWidth / 2 - e.screenX) * 0.003;
      t1.set(element, {
        transformPerspective: 400,
        transformOrigin: 'center center'
      });
      t1.to(element, 0.5, {
        rotationY: rotationValue
      });
    });

    _defineProperty(this, "mouseLeave", (num, e) => {
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
      t2.to(cards, 0.5, {
        scale: 1
      });
      t3.to(elementsPic, 0.4, {
        scale: 1
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
        top: `${i * 90}px`
      },
      onMouseEnter: e => {
        this.mouseEnter(i, e);
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
    return React.createElement("div", {
      className: "container my-4"
    }, React.createElement("h2", null, "Results:"), React.createElement("ul", {
      className: "cards"
    }, this.usersList));
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
      name: '',
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
    return React.createElement("main", null, React.createElement(Header, {
      pic: 'assets/logo.svg'
    }), React.createElement(SearchBar, {
      handleInput: this.handleInput,
      name: this.state.name,
      submitForm: this.submitForm,
      inputAlert: inputAlert,
      notFound: notFound,
      error: error,
      loading: loading,
      fetchedUsers: fetchedUsers,
      ico: 'assets/search.svg'
    }), loading && React.createElement(Loading, null), error && React.createElement(Error, null), fetchedUsers.length > 0 && !error && !loading && React.createElement(Users, {
      notFound: notFound,
      users: fetchedUsers,
      error: error
    }));
  }

}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));

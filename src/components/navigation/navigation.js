import React from "react";
import logo from "../images/memrii_logo.png";
import * as DropSearch from "../dropsearch/dropsearch";
import * as mem from "../memriioserver";
import * as ur from "../userrolls";
import NewMemoryModal from "../memorymodal/newmemorymodal";
import "./navigation.scss";

class Navigation extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    searchwords: "",
    userClouds: null,
    selectedClouds: null,
    showPersonalMemoryOptions: false,
    personalMemoryunsharedOnly: false,
    showNewPostModal: false,
  };

  //---------------------------------------------------------------------------------

  handleSignOut = () => {
    this.state = {
      searchwords: "",
      userClouds: null,
      selectedClouds: null,
      showPersonalMemoryOptions: false,
      personalMemoryunsharedOnly: false,
    };
    console.log("handleSignout.userClouds ", this.state);
    this.props.setCloudsLoaded(false);
    this.props.onRouteChange("signin");
  };

  //---------------------------------------------------------------------------------

  componentDidMount = () => {
    console.log("NAV.mount");
    console.log("");
  };

  componentDidUpdate = () => {
    console.log("NAV.update : ", this.props.user);
    console.log("");
  };

  //---------------------------------------------------------------------------------

  onSearchBoxChange = (event) => {
    let text = event.target.value.toLowerCase();
    let tmparray = [];

    console.log("navigation-onSearchBoxChange : " + text.split(" "));

    if (event.target.value !== "") {
      tmparray = text.split(" ");
    }
    this.setState({ searchwords: tmparray }, this.showMemories);
  };

  //---------------------------------------------------------------------------------

  handleChangeSearchClouds = (clouds, userid) => {
    let cloudstring = "";
    clouds.map((cloud) => {
      cloudstring += cloud.value + ",";
    });
    if (cloudstring) {
      cloudstring = cloudstring.slice(0, cloudstring.length - 1);
    }

    mem.updatedUserClouds(userid, cloudstring);

    this.setState({ selectedClouds: clouds }, this.showMemories);
  };

  //---------------------------------------------------------------------------------

  showMemories = () => {
    let selected = this.state.selectedClouds;
    let searchwords = this.state.searchwords;
    let cloudids = [];

    if (selected)
      cloudids = selected.map((cloud) => {
        return parseInt(cloud.value);
      });
    console.log("showMemories ", cloudids);

    if (cloudids.length === 0) {
      console.log("showMemories calling loadMemories(null)");
      this.props.loadMemories(null);
    } else if (selected.length === 1 && selected[0].value === 0) {
      // personal only
      console.log("personal only " + selected[0].value);
      if (this.state.personalMemoryunsharedOnly) {
        // personal only - unshared only

        console.log(
          "personal : unshared " + this.props.userid + " " + searchwords
        );
        mem
          .getMemories_PersonalOnly_Unshared(this.props.userid, searchwords)
          .then(
            (memories) => {
              this.props.loadMemories(memories);
            },
            (error) => {
              this.props.loadMemories(null);
            }
          );
      } else {
        // personal only - bth shared and undshared

        console.log("personal : all " + this.props.userid + " " + searchwords);
        mem.getMemories_PersonalOnly_All(this.props.userid, searchwords).then(
          (memories) => {
            this.props.loadMemories(memories);
          },
          (error) => {
            this.props.loadMemories(null);
          }
        );
      }
    } else if (cloudids.includes(0)) {
      // personal cloud + other clouds
      console.log("personal cloud + other clouds  : cloudids " + cloudids);

      if (searchwords.length > 0) {
        // clouds + searchwords

        console.log(
          "personal cloud + other clouds with searchwords " +
            this.props.userid +
            " " +
            searchwords +
            " " +
            cloudids
        );
        mem
          .getMemories_User_Words_Clouds(
            this.props.userid,
            searchwords,
            cloudids
          )
          .then(
            (memories) => {
              this.props.loadMemories(memories);
            },
            (error) => {
              this.props.loadMemories(null);
            }
          );
      } else {
        // clouds but no search words

        console.log(
          "personal cloud + other clouds no searchwords " +
            this.props.userid +
            " : " +
            cloudids
        );
        mem.getMemories_User_Clouds(this.props.userid, cloudids).then(
          (memories) => {
            this.props.loadMemories(memories);
          },
          (error) => {
            this.props.loadMemories(null);
          }
        );
      }
    } else {
      if (searchwords.length > 0) {
        // clouds + searchwords

        console.log(
          "other clouds only with searchwords : " +
            searchwords +
            " cloudids : " +
            cloudids
        );
        mem.getMemories_Words_Clouds(cloudids, searchwords).then(
          (memories) => {
            this.props.loadMemories(memories);
          },
          (error) => {
            this.props.loadMemories(null);
          }
        );
      } else {
        // clouds but no search words

        console.log("other clouds only no searchwords : cloud ids" + cloudids);
        mem.getMemories_Clouds(cloudids).then(
          (memories) => {
            this.props.loadMemories(memories);
          },
          (error) => {
            this.props.loadMemories(null);
          }
        );
      }
    }
  };

  //---------------------------------------------------------------------------------

  render() {
    const { userSignedin, currentRoute } = this.props;
    console.log("Nav.render ", this.state.userClouds);
    if (userSignedin()) {
      if (currentRoute === "home") {
        return this.renderStandardNav();
      } else if (currentRoute === "displayMemory") {
        return null;
      } else if (currentRoute === "admin") {
        return this.renderAdminNav();
      }
    } else {
      return this.renderSignInNav();
    }
  }

  //---------------------------------------------------------------------------------

  loadUserClouds = (userid) => {
    let temp = [];
    console.log("loadUserClouds Testing ", userid);
    if (userid)
      mem.getUserClouds(userid, (clouds) => {
        clouds.push({
          id: 0,
          name: "Personal",
        });
        clouds.reverse();
        clouds.map((cloud) => {
          if (this.props.startingClouds.includes(parseInt(cloud.id)))
            temp.push({ value: cloud.id, name: cloud.name });
        });

        this.setState({ userClouds: clouds, selectedClouds: temp }, () => {
          this.props.setCloudsLoaded(true);
          this.showMemories();
        });
      });
  };

  //---------------------------------------------------------------------------------

  handleAdminClick = () => {
    this.props.onRouteChange("admin");
  };

  //---------------------------------------------------------------------------------

  handleRunTest = () => {
    console.log("this does nothing anymore");
  };
  //-------------------------------------------------------------------------------

  handleShowNewMemory = () => {
    this.setState({ showNewPostModal: !this.state.showNewPostModal });
  };

  //-------------------------------------------------------------------------------

  handleUploadInProgress = () => {
    console.log("hide newmemory modal");
    this.setState({ showNewPostModal: !this.state.showNewPostModal });
  };
  //-------------------------------------------------------------------------------

  handleNewPost = (memory) => {
    this.props.onNewMemory(memory);
  };

  //---------------------------------------------------------------------------------

  handleCancelNewPost = () => {
    this.setState({ showNewPostModal: !this.state.showNewPostModal });
  };

  //---------------------------------------------------------------------------------

  renderStandardNav = () => {
    const { onRouteChange, userid } = this.props;
    let cloudbox = null;
    let adminButton = null;
    let selected = this.state.selectedClouds;

    if (ur.showAdminOnNavBar(userid)) {
      adminButton = (        
          <a
            className="linkText"
            onClick={this.handleAdminClick}
            href="#admin"
            title="Administration"
          >
            Admin
          </a>        
      );
    }
    console.log("renderStandardNav.userClouds ", this.state.userClouds);
    if (this.props.cloudsLoaded) {
      cloudbox = DropSearch.cloudDropSearch(
        null,
        this.state.userClouds,
        selected,
        true,
        false,
        this.handleChangeSearchClouds,
        userid
      );
    } else {
      this.loadUserClouds(userid);
    }

    return (
      <nav>
        <div className="container">
          <div className="nav-left">
            <ul>
              <li className="floatLeft">
                <img src={logo} className="logo" alt="memriio"></img>
              </li>
            </ul>
          </div>
          <div className="nav-center">
            <ul>

              <li className='nav-searchbox'>            
                <input
                  onChange={this.onSearchBoxChange}   
                  className="searchBox"
                  type="text"
                  aria-describedby="name-desc"
                ></input>
              </li>

              <li className='nav-cloudbox'>
                {cloudbox}
              </li>

            </ul>
          </div>
          <div className="nav-right floatRight">
            <ul>
              <li className="floatRight">
                <a
                  className="linkText"
                  onClick={this.handleShowNewMemory}
                  href="#newpost"
                  title="New"
                >
                  New
                </a>
              </li>
              <li className="floatRight">
                {adminButton}
              </li>
              <li className="floatRight">
                <a
                  onClick={this.handleSignOut}
                  className="linkText"
                  href="#"
                  title="Log Out"
                >
                  Sign Out
                </a>
              </li>
            </ul>
          </div>
        </div>
        <NewMemoryModal
          key={"memmodal" + 42}
          userid={this.props.userid}
          userClouds={this.state.userClouds}
          show={this.state.showNewPostModal}
          onCancelNewMemory={this.handleCancelNewPost}
          onAddNewMemory={this.handleNewPost}
          onUploading={this.handleUploadInProgress}
        ></NewMemoryModal>
      </nav>
    );
  };

  //---------------------------------------------------------------------------------

  renderSignInNav = () => {
    const onRouteChange = this.props.onRouteChange;
    return (
      <nav className="navBar">
        <ul>
          <li className="floatRight">
            <a
              onClick={() => onRouteChange("signin")}
              className="linkText"
              href="#"
              title="Log "
            >
              Sign In
            </a>
          </li>

          <li className="floatLeft">
            <img src={logo} className="logo" alt="memriio"></img>
          </li>
        </ul>
      </nav>
    );
  };

  //---------------------------------------------------------------------------------

  renderAdminNav = () => {
    const onRouteChange = this.props.onRouteChange;
    return (
      <nav className="navBar ">
        <div className="logocell" href="#" title="Home">
          <img src={logo} className="logo" alt="memriio"></img>
        </div>
        <div className="dtc v-mid w-75 tr">
          <a
            onClick={() => onRouteChange("home")}
            className="linkText"
            href="#"
            title="Home "
          >
            Home
          </a>
        </div>
      </nav>
    );
  };

  //---------------------------------------------------------------------------------
}

export default Navigation;

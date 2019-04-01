import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import TextfieldGroup from "../common/TextfieldGroup";

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInput: false,
      handle: "",
      compnay: "",
      website: "",
      location: "",
      status: "",
      skills: "",
      githubusername: "",
      bio: "",
      twitter: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      instagram: "",
      errors: {}
    };
  }

  render() {
    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Create Your Profile</h1>
              <p className="lead text-center">
                Let's Get Some Info to Create Your Profile
              </p>
              <small className="d-block pb-3">* = required fields</small>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateTpProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(mapStateTpProps)(CreateProfile);

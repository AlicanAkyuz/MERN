import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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
    return <div />;
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

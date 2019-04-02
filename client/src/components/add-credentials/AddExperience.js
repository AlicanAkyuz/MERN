import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import TextfieldGroup from "../common/TextfieldGroup";
import TextareaFieldGroup from "../common/TextareaFieldGroup";

class AddExperience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: "",
      title: "",
      location: "",
      from: "",
      to: "",
      current: false,
      description: "",
      errors: {},
      disabled: false
    };
  }
  render() {
    return <div />;
  }
}

AddExperience.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateTpProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateTpProps,
  { createProfile }
)(withRouter(AddExperience));

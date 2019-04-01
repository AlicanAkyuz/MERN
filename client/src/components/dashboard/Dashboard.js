import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profileActions";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }
  render() {
    return <div>Hey</div>;
  }
}

const mapStateTpProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateTpProps,
  { getCurrentProfile }
)(Dashboard);

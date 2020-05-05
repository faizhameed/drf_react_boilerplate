import React, { PureComponent } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";

class Feature extends PureComponent {
  componentWillMount() {
    this.props.fetchFeature();
  }

  render() {
    if (!this.props.features) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <p>{JSON.stringify(this.props.features)}</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { features: state.features.homePageFeatures };
};

export default connect(mapStateToProps, actions)(Feature);

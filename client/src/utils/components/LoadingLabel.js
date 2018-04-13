// @flow
import * as React from 'react';

type PropTypes = {};
class LoadingLabel extends React.Component<PropTypes> {
    render() {
        return (
            <div className="alert alert-info" role="alert">
                Loading data...
            </div>
        );
    }
}

export default LoadingLabel;

// @flow
import * as React from 'react';
import {apiUrls} from './_data';
import Tools from 'src/utils/helpers/Tools';

type Props = {};
type State = {};

export default class Footer extends React.Component<Props, State> {
    static defaultProps = {};
    state: State = {};
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row" style={styles.footer}>
                    <div className="col-md-6">
                        © Bản quyền thông tin thuộc <a href="ape.vnsc.org.vn">ape.vnsc.org.vn</a>
                    </div>
                    <div className="col-md-6" />
                </div>
            </div>
        );
    }
}

const styles = {
    footer: {
        backgroundColor: 'rgb(38, 38, 38)',
        padding: '5px 0',
        color: 'white'
    },
};

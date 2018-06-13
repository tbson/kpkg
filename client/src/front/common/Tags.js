// @flow
import * as React from 'react';
import {apiUrls} from './_data';
// $FlowFixMe: do not complain about importing node_modules
import {Link} from 'react-router-dom';
import Tools from 'src/utils/helpers/Tools';

type Props = {
    list: Array<{id: number, title: string, uid: string}>,
};
type State = {};

export default class Tags extends React.Component<Props, State> {
    static defaultProps = {};
    state: State = {};
    constructor(props: Props) {
        super(props);
    }

    render() {
        const {list} = this.props;
        if (!list || !list.length) return null;
        return (
            <div className="tags-container">
                <ol className="breadcrumb">
                    {list.map(item => (
                        <li className="breadcrumb-item" key={item.id}>
                            <Link to={['/tag', item.id, item.uid].join('/')}>{item.title}</Link>
                        </li>
                    ))}
                </ol>
            </div>
        );
    }
}

const styles = {};

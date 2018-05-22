// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import Select from 'react-select';
// $FlowFixMe: do not complain about importing node_modules
import 'react-select/dist/react-select.css';
import type {DropdownItemType} from 'src/utils/types/CommonTypes';

type Props = {
    options: Array<DropdownItemType>,
    multi: boolean,
    delimiter: string,
    name: string,
    defaultValue: any,
};

type States = {
    value: string,
};

class SelectInput extends React.Component<Props, States> {
    state = {
        value: '',
    };
    static defaultProps = {
        options: [],
        multi: false,
        delimiter: ',',
        defaultValue: '',
    };

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        const {defaultValue, options} = this.props;
        this.setState({
            // value: defaultValue ? defaultValue : (options.length ? options[0].value : '')
            value: defaultValue ? defaultValue : ''
        });
    }

    handleChange = (result:any) => {
        if (result.length) {
            const value = result.map(item => item.value).join(this.props.delimiter);
            this.setState({value});
        } else {
            this.setState({value: result.value});
        }
    };

    render() {
        return (
            <div>
                <input type="hidden" name={this.props.name} defaultValue={this.state.value} />
                <Select
                    multi={this.props.multi}
                    delimiter={this.props.multi ? ',' : ''}
                    name={this.props.name}
                    value={this.state.value}
                    onChange={this.handleChange}
                    options={this.props.options}
                />
            </div>
        );
    }
}

const styles = {};
export default SelectInput;

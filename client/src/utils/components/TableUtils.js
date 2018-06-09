// @flow
import * as React from 'react';

type SearchInputPropTypes = {
    show: boolean,
    onSearch: Function,
};

export class SearchInput extends React.Component<SearchInputPropTypes> {
    static defaultProps = {
        show: true,
    };

    render() {
        if (!this.props.show) return null;
        return (
            <form onSubmit={this.props.onSearch}>
                <div className="input-group mb-3">
                    <input type="text" name="search" className="form-control" placeholder="Search..." />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary">
                            <span className="oi oi-check" />
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

type PaginationPropTypes = {
    next: ?string,
    prev: ?string,
    onNavigate: Function,
};
export class Pagination extends React.Component<PaginationPropTypes> {
    renderPrev(prev: ?string) {
        if (!prev) return null;
        return (
            <button className="btn btn-primary btn-sm" onClick={() => this.props.onNavigate(prev)}>
                <span className="oi oi-chevron-left pointer" />
                &nbsp; Prev
            </button>
        );
    }

    renderNext(next: ?string) {
        if (!next) return null;
        return [
            <span key="1">&nbsp;&nbsp;&nbsp;</span>,
            <button className="btn btn-primary btn-sm" key="2" onClick={() => this.props.onNavigate(next)}>
                Next &nbsp;
                <span className="oi oi-chevron-right pointer" />
            </button>,
        ];
    }

    render() {
        return (
            <div>
                {this.renderPrev(this.props.prev)}
                {this.renderNext(this.props.next)}
            </div>
        );
    }
}

type FrontPaginationPropTypes = {
    next: ?string,
    prev: ?string,
    onNavigate: Function,
};
export class FrontPagination extends React.Component<FrontPaginationPropTypes> {
    renderPrev(prev: ?string) {
        if (!prev) return null;
        return (
            <a className="pointer" onClick={() => this.props.onNavigate(prev)}>
                <span className="oi oi-chevron-top pointer" />
            </a>
        );
    }

    renderNext(next: ?string) {
        if (!next) return null;
        return [
            <a className="pointer" onClick={() => this.props.onNavigate(next)}>
                <span className="oi oi-chevron-bottom" />
            </a>,
        ];
    }

    render() {
        if (!this.props.prev && !this.props.next) return null;
        return (
            <div className="container-fluid">
                <div className="row" style={styles.footer}>
                    <div className="col-xl-12">
                        {this.renderPrev(this.props.prev)}
                        {this.renderNext(this.props.next)}
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    footer: {
        backgroundColor: 'rgb(38, 38, 38)',
        padding: '5px 0',
        color: 'white',
        textAlign: 'center',
    },
};

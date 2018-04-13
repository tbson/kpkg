// @flow
import * as React from 'react';

type SearchInputPropTypes = {
    onSearch: Function,
};

export class SearchInput extends React.Component<SearchInputPropTypes> {
    render() {
        return (
            <form onSubmit={this.props.onSearch}>
                <div className="input-group mb-3">
                    <input type="text" name="searchStr" className="form-control" placeholder="Search..." />
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

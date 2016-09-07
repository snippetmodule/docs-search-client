import * as React from 'react';
import { Link } from 'react-router';
import { getSearchResult } from '../../redux/reducers/searchdocs';
const { connect } = require('react-redux');

let classNames = require('classnames/bind');
let css = require('./style.css');
let cx = classNames.bind(css);

@connect(
  null,
  dispatch => ({
    getSearchResult: (input: string) => dispatch(getSearchResult(dispatch, input)),
  })
)
class Header extends React.Component<any, void> {
  private stripscript(s: string): string {
    let pattern = new RegExp('[`~!@#$^&*()=|{}\:\;,\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：\“。，、？]');
    let rs = '';
    for (let i = 0; i < s.length; i++) {
      rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
  }
  private handleChange(event) {
    let input: string = event.target.value;
    input = this.stripscript(input);
    this.props.getSearchResult(input);
    event.stopPropagation();
    event.preventDefault();
  }
  public render() {
    return (
      <div className={cx('content') }>
        <form className="left _search" role="search">
          <input type="search" className="_search-input" placeholder="搜索…" maxLength="30"  autoFocus="autofocus"
            onChange={this.handleChange.bind(this) } />
          <button type="reset" className="_search-clear" title="Clear search">Clear search</button>
          <div className="_search-tag"></div>
        </form>
        <div style={{ padding: '.65rem 0 0 0' }}>
          <a className="homeLink" to= "/" >Docs中文网</a>
        </div>
        <div className="right">
          <Link className="rightA" to= "/" >docs</Link>
          <Link className="rightA" to= "about" >about</Link>
          <Link className="rightA" to= "counter" >counter</Link>
          <Link className="rightA" to= "stars" >stars</Link>
        </div>
      </div>
    );
  }
}

export { Header }

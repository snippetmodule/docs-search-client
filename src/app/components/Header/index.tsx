import * as React from 'react';
import { Link } from 'react-router';
import { getSearchResult } from '../../redux/reducers/searchdocs';
const { connect } = require('react-redux');

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
    const s = require('./style.css');
    return (
      <div className={s.content}>
        <form  className={s.left} role="search">
          <input className={s.searchInput} type="search" onChange={this.handleChange.bind(this) }/>
          <div></div>
        </form>
        <div className={s.right}>
          <Link className={s.rightA} to= "/" >docs</Link>
          <Link className={s.rightA} to= "about" >about</Link>
          <Link className={s.rightA} to= "counter" >counter</Link>
          <Link className={s.rightA} to= "stars" >stars</Link>
        </div>
      </div>
    );
  }
}

export { Header }

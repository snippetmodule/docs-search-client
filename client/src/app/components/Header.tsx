import * as React from 'react';
import { Link } from 'react-router';
import { getSearchResult } from '../redux/reducers/searchdocs';
const { connect } = require('react-redux');

@connect(
  null,
  dispatch => ({
    getSearchResult: (input: string) => dispatch(getSearchResult(dispatch, input)),
  })
)
class Header extends React.Component<any, void> {
  private mCleanBtnRef: HTMLElement;
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
    if (input) {
      this.mCleanBtnRef.style.display = 'block';
    }else{
      this.mCleanBtnRef.style.display = 'none';
    }
  }
  public render() {
    return (
      <header className="_header" role="banner">
        <button type="button" className="_mobile-btn _back-btn">Back</button>
        <button type="button" className="_mobile-btn _forward-btn">Forward</button>
        <button type="button" className="_mobile-btn _menu-btn">Menu</button>
        <button type="button" className="_mobile-btn _home-btn">Home</button>
        <form className="_search" role="search">
          <input type="search" className="_search-input" placeholder="Search…"
            autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck="false"
            maxLength="30" aria-label="Search" autoFocus="autofocus"
            onChange={this.handleChange.bind(this) }/>
          <button ref={ref => this.mCleanBtnRef = ref} type="reset" className="_search-clear" title="Clear search">Clear search</button>
          <div className="_search-tag"></div>
        </form>
        <h1 className="_logo">
          <Link to="/" className="_nav-link" title="Offline API Documentation Browser">Docs中文网</Link>
        </h1>
        <nav className="_nav" role="navigation">
          <Link to="/" className="_nav-link">Offline</Link>
          <Link to="/about" className="_nav-link">About</Link>
          <Link to="/counter" className="_nav-link">counter</Link>
          <Link to="/stars" className="_nav-link">stars</Link>
        </nav>
      </header>
    );
  }
}

export { Header }

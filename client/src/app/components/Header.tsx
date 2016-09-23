import * as React from 'react';
import { Link } from 'react-router';
import { getSearchResult } from '../redux/reducers/searchdocs';
import { getSearchTag, keyEnterHandler } from '../containers/App/left';
import * as AppConfig from '../config';
const { connect } = require('react-redux');

@connect(
  null,
  dispatch => ({
    getSearchResult: (input: string) => dispatch(getSearchResult(dispatch, input)),
  })
)
class Header extends React.Component<any, void> {
  private mCleanBtnRef: HTMLElement;
  private mSearchTagRef: HTMLElement;
  private mInputRef: HTMLInputElement;
  private stripscript(s: string): string {
    let pattern = new RegExp('[`~!@#$^&*()=|{}\:\;,\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：\“。，、？]');
    let rs = '';
    for (let i = 0; i < s.length; i++) {
      rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
  }
  public componentWillMount() {
    document.onkeydown = this.handerTabKey.bind(this);
  }
  public componentWillUnmount() {
    document.onkeydown = null;
  }
  private handerTabKey(event: KeyboardEvent) {
    let keyCode = event.keyCode || event.which;

    if (keyCode === 9) {
      let searchTag = getSearchTag();
      event.preventDefault();
      if (searchTag) {
        this.mSearchTagRef.style.display = 'block';
        this.mSearchTagRef.innerText = searchTag.name;
        this.mInputRef.style.paddingLeft = this.mSearchTagRef.clientWidth + 8 + 'px';
        this.mInputRef.value = '';
        this.mInputRef.placeholder = '';
        AppConfig.default.selectedPath = '/docs/' + searchTag.slug + '/';
        AppConfig.default.docs.init(searchTag.slug).then(() => {
          this.props.getSearchResult('');
        });
      }
    } else if (keyCode === 8 || keyCode === 46) { // backspace 和 delete
      if (!this.mInputRef.value && this.mSearchTagRef.innerText) {
        this.mSearchTagRef.innerText = '';
        this.mInputRef.style.paddingLeft = '1.75rem';
        this.mInputRef.placeholder = 'Search…';
        AppConfig.default.selectedPath = '';
        AppConfig.default.docs.init('').then(() => {
          this.props.getSearchResult('');
        });
      }
    } else if (keyCode === 13) { // 回车
      event.preventDefault();
      event.stopPropagation();
      if (document.activeElement.className === this.mInputRef.className) {
        keyEnterHandler();
      }
    }
  }
  private handleCleanBtn(event) {
    this.mInputRef.value = '';
    this.handleChange(event);
  }
  private handleChange(event) {
    let input: string = event.target.value;
    input = this.stripscript(input);
    this.props.getSearchResult(input);
    event.stopPropagation();
    event.preventDefault();
    if (input) {
      this.mCleanBtnRef.style.display = 'block';
    } else {
      this.mCleanBtnRef.style.display = 'none';
    }
  }
  public render() {
    return (
      <header className="_header" role="banner">
        <form className="_search" role="search">
          <input ref={ref => this.mInputRef = ref} type="search" className="_search-input" placeholder="Search…"
            autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false}
            maxLength={30} aria-label="Search" autoFocus={true}
            onChange={this.handleChange.bind(this)} />
          <button ref={ref => this.mCleanBtnRef = ref} onClick={this.handleCleanBtn.bind(this)} type="reset" className="_search-clear" title="Clear search">Clear search</button>
          <div ref={ref => this.mSearchTagRef = ref} className="_search-tag"></div>
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

export {  Header }

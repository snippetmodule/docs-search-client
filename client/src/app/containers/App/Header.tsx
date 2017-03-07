import * as React from 'react';
import { Link } from 'react-router';
import * as AppConfig from '../../config';

export interface IHeaderProps {
  doSearch: (searchKey: string) => any;
  getSearchTag: () => { name: string, slug: string };
  keyEnterHandler: () => any;
}
class Header extends React.Component<IHeaderProps, void> {
  private mCleanBtnRef: HTMLElement;
  private mSearchTagRef: HTMLElement;
  private mInputRef: HTMLInputElement;

  private stripscript(s: string): string {
    const pattern = new RegExp('[`~!@#$^&*()=|{}\:\;,\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：\“。，、？]');
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
    const keyCode = event.keyCode || event.which;

    if (keyCode === 9) {
      const searchTag = this.props.getSearchTag();
      event.preventDefault();
      if (searchTag) {
        this.mSearchTagRef.style.display = 'block';
        this.mSearchTagRef.innerText = searchTag.name;
        this.mInputRef.style.paddingLeft = this.mSearchTagRef.clientWidth + 8 + 'px';
        this.mInputRef.value = '';
        this.mInputRef.placeholder = '';
        AppConfig.default.selectedPath = '/docs/' + searchTag.slug + '/';
        AppConfig.default.docs.init(searchTag.slug).then(() => {
          this.props.doSearch('');
        });
      }
    } else if (keyCode === 8 || keyCode === 46) { // backspace 和 delete
      if (!this.mInputRef.value && this.mSearchTagRef.innerText) {
        this.mSearchTagRef.innerText = '';
        this.mInputRef.style.paddingLeft = '1.75rem';
        this.mInputRef.placeholder = 'Search…';
        AppConfig.default.selectedPath = '';
        AppConfig.default.docs.init('').then(() => {
          this.props.doSearch('');
        });
      }
    } else if (keyCode === 13) { // 回车
      event.preventDefault();
      event.stopPropagation();
      if (document.activeElement.className === this.mInputRef.className) {
        this.props.keyEnterHandler();
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
    this.props.doSearch(input);
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
          <input ref={(ref) => this.mInputRef = ref} type="search" className="_search-input" placeholder="Search…"
            autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false}
            maxLength={30} aria-label="Search" autoFocus={true}
            onChange={this.handleChange.bind(this)} />
          <button ref={(ref) => this.mCleanBtnRef = ref} onClick={this.handleCleanBtn.bind(this)} type="reset" className="_search-clear" title="Clear search">Clear search</button>
          <div ref={(ref) => this.mSearchTagRef = ref} className="_search-tag"></div>
        </form>
        <h1 className="_logo">
          <Link to="/" className="_nav-link" title="Offline API Documentation Browser">Docs中文网</Link>
        </h1>
        {AppConfig.default.htmlConfig.isDevelopment ?
          <nav className="_nav" role="navigation">
            <Link to="/" className="_nav-link">Offline</Link>
            <Link to="/about" className="_nav-link">About</Link>
          </nav> :
          <nav className="_nav" role="navigation">
            <Link to="/about" className="_nav-link">About</Link>
          </nav>}
      </header>
    );
  }
}

export { Header }

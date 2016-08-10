import * as React from 'react';
import { Link } from 'react-router';

interface IHeaderProps {
  getSearchResult: (input: string) => void;
}

class Header extends React.Component<IHeaderProps, void> {

  private handleChange(event) {
    let input = event.target.value;
    this.props.getSearchResult(input);
    event.stopPropagation();
    event.preventDefault();
  }
  public render() {
    const s = require('./style.css');
    return (
      <div className={s.content}>
        <form  className={s.left} role="search">
          <input type="search" onChange={this.handleChange.bind(this) }/>
          <button type="reset" >Clear search</button>
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

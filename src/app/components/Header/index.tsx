import * as React from 'react';
import { Link } from 'react-router';

class Header extends React.Component<any, any> {
  // onclick: (event) => {

  // },
  public render() {
    const s = require('./style.css');
    return (
      <div className={s.content}>
        <form  className={s.left} role="search">
            <input type="search"/>
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

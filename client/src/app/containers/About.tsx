import * as React from 'react';

class About extends React.Component<any, any> {
  public render() {
    return (
      <div className="_container" role="document">
        <div className="_content">
          <div className="_static">
            <h1 className="_lined-heading">API文档库</h1>
            <p>DevDocs中文网是API文档库，拥有超过60种API文档，旨在解放程序员的生产力，让开发变得更简单，更高效。以后再也不用翻墙找帮助文档了，因为你想找的，这里都有！</p>
            <ul>
              <li>Dev Docs是一款开源软件（<a href="https://github.com/Thibaut/devdocs">访问Github</a>），由<a href="http://thibaut.me">Thibaut Courouble</a>创作。请为原作者点赞。</li>
              <li>本网站基于DevDocs二次开发，旨在为中国用户提供更优质的服务。</li>
              <li>本站为非营利性网站，内容源于网络，如有侵权，请联系我们。</li>
            </ul>
            <p className="_note _note-green">如果本文档对您有帮助，请分享给更多人。您也可以<a href="#">资助我们</a>，帮助我们把网站做得更好。</p><br />
          </div>
        </div>
      </div>
    );
  }
}

export { About }

import * as React from 'react';
const s = require('./style.css');

class Home extends React.Component<any, any> {
  public render() {
    return (
      <div className="_container" role="document">
        <div className={s._intro}>
          <div className={s._intromessage}>
            <h2 className={s._introtitle}>欢迎使用DevDocs！</h2>
            <p>DevDocs包含了超过60种API文档，是程序员的必备法宝。下面是几点使用技巧：</p>
            <ol className={s._introlist}>
              <li>您可以点击左下角的
                <a className={s._introlink} data-pick-docs="">选择文档</a>修改被启用的文档。</li>
              <li>支持快捷键操作—<a href="/help#shortcuts">查看全部快捷键</a></li>
              <li>搜索支持模糊匹配，比如搜索"background-clip"只需输入"bgcp"</li>
              <li>输入文档名称按"Tab"键，可以搜索此文档内的内容。比如要搜索PHP中的array_push，则先输入"PHP"，按Tab，然后再输入"array_push"</li>
              <li>如果本文档对您有帮助，请分享给更多的人。您也可以<a href="#">资助我们</a>，帮助我们努力完善更多内容</li>
            </ol>
            <p>Happy coding!</p>
          </div>
        </div>
      </div>
    );
  }
}

export { Home }

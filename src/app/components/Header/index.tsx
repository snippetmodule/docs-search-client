import * as React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import { Form, FormGroup, FormControl, Button} from 'react-bootstrap';
import { IndexLinkContainer } from 'react-router-bootstrap';

class Header extends React.Component<any, any> {
  // onclick: (event) => {

  // },
  public render() {
    const s = require('./style.css');
    return (
      <Navbar className={s.nav}>
        <Navbar.Header>
          <Navbar.Brand>
            <Form inline>
              <FormGroup controlId="formInlineName">
                <FormControl type="text" placeholder="请输入搜索关键字" />
              </FormGroup>
              {' '}
              <Button type="submit">
                搜索
              </Button>
            </Form>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="about">Link</NavItem>
            <NavItem eventKey={2} href="about">Link</NavItem>
            <NavDropdown eventKey={3} title="测试" id="basic-nav-dropdown">
              <IndexLinkContainer to="/">
                <MenuItem eventKey={3.1}>Home</MenuItem>
              </IndexLinkContainer>
              <IndexLinkContainer to="about">
                <MenuItem eventKey={3.2} >About</MenuItem>
              </IndexLinkContainer>
              <IndexLinkContainer to="counter">
                <MenuItem eventKey={3.3}>Counter</MenuItem>
              </IndexLinkContainer>
              <MenuItem divider />
              <IndexLinkContainer to="stars">
                <MenuItem eventKey={3.3}>Stars</MenuItem>
              </IndexLinkContainer>
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href="about">Link Right</NavItem>
            <NavItem eventKey={2} href="about">Link Right</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export { Header }

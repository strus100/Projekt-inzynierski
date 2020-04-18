import React, {Component} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Menu from "./Menu"
import Chat from "./Chat"
import Footer from "./Footer"

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChangeMenu = this.handleChangeMenu.bind(this);
    this.handleChangeChat = this.handleChangeChat.bind(this);
    this.state = { checkedMenu: false, checkedChat: false };
  }

  handleChangeMenu() {
    this.setState({
      checkedMenu: !this.state.checkedMenu,
      checkedChat: this.state.checkedChat
    })
  }

  handleChangeChat() {
    this.setState({
      checkedMenu: this.state.checkedMenu,
      checkedChat: !this.state.checkedChat
    })
  }

  render(){
    return (
        <div>
          <Menu {...this.props} state={this.state}/>
          <Chat {...this.props} state={this.state}/>
          <Footer {...this.props} state={this.state} handleChangeMenu={this.handleChangeMenu} handleChangeChat={this.handleChangeChat}/>
        </div>
    );
  }
}

export default App;
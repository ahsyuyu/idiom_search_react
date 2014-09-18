/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */


var api=Require("api");
var results=Require("results");
var main = React.createClass({
  getInitialState: function() {
    return {bar: "world", res: [], tofind:[], field:[]};
  },
  dosearch: function() {
    var tofind=this.refs.tofind.getDOMNode().value;
    var res=api.search(tofind);
    this.setState({res:res, tofind:tofind, field:"key"});
  },
  dosearchDef: function() {
    var tofind=this.refs.tofind.getDOMNode().value;
    var res=api.searchDef(tofind);
    this.setState({res:res, tofind:tofind, field:"def"});
  },
  render: function() {
    return (
      <div>
        <input ref="tofind" defaultValue="花"></input>
        <button onClick={this.dosearch}>Search</button>
        <button onClick={this.dosearchDef}>Search Def</button>
        <results res={this.state.res} tofind={this.state.tofind} field={this.state.field}/>
      </div>
    );
  }
});
module.exports=main;
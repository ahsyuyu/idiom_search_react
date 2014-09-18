/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var main=Require("main");
var results = React.createClass({
  getInitialState: function() {
    return {bar: "world"}
  },
  renderItem: function(item){
    var field=this.props.field;
    console.log(item[field]);
    var tofind=this.props.tofind;
    var key=item.key.replace(tofind,function(tofind){return "<span class='tofind'>"+tofind+"</span>"});
    var def=item.def.replace(tofind,function(tofind){return "<span class='tofind'>"+tofind+"</span>"});

    return <div><span dangerouslySetInnerHTML={{__html: key}}></span> <br/>
    <span dangerouslySetInnerHTML={{__html: def}}/></div>
    //return <div>{item}</div>;
  },
  render: function() {
    return (
      <div>
        {this.props.res.map(this.renderItem)}
      </div>
    );
  }
});
module.exports=results;
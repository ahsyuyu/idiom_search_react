//var othercomponent=Require("other"); 
//new module filename must be added to scripts section of ./component.js and export here
var api = {
 search: require("./search"),
 searchDef: require("./searchDef")
}

module.exports=api;
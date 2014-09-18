var dataset=Require("dataset"); 
var search=function(tofind){
	return dataset.idioms.filter(function(item){
		return item.key.indexOf(tofind)>-1;
	})
	/*return [ 
	  "走馬看花",
	  "花花世界",
	  "花好月圓"
	]*/
}; 

module.exports=search;
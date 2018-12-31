
String.prototype.rightOf = function(search)
{
  var index = this.indexOf(search);

  if (index > -1)
    return this.substring(index+search.length, this.length);
  else 
    return "";
}

String.prototype.rightRightOf = function(souschaine)
{ 
  var index = this.lastIndexOf(souschaine);
  if (index > -1)
    return this.substr(index+souschaine.length);  
  else 
    return "";
}


String.prototype.stripAccents = function() {
  
    var translate_re = /[àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ]/g;
    var translate = 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY';
    return (this.replace(translate_re, function(match){
        return translate.substr(translate_re.source.indexOf(match)-1, 1); })
    );
};

String.prototype.contains = function(it) { 
  return this.indexOf(it) > -1; 
};

String.prototype.leftOf = function(souschaine)
{
 var index = this.indexOf(souschaine,0);
 if (index >=0)
 return this.substring(0, index)
 else
 return '';
}
String.prototype.startsWith = function(s, caseInsensistive){
  if ((arguments.length == 2) && (caseInsensistive === true))
    return this.toLowerCase().indexOf(s) == 0;
  else
    return this.indexOf(s) == 0;
};
String.prototype.removeEnd = function(s, caseInsensistive){
    if (arguments.length == 1)
      var caseInsensistive = false;

    if (this.endsWith(s, caseInsensistive))
      return this.substring(0, this.length - s.length);
    else
      return this.toString();  
  
};
String.prototype.endsWith = function(s, caseInsensistive){

  if ((arguments.length == 2) && (caseInsensistive === true))
    var indx = this.toLowerCase().lastIndexOf(s.toLowerCase());
  else
    var indx = this.lastIndexOf(s);   
  
   return ((indx>=0) && (indx == (this.length - s.length)));
};
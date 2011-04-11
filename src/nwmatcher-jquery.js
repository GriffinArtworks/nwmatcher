/*
 * Copyright (C) 2007-2011 Diego Perini
 * All rights reserved.
 *
 * this is just a small example to show
 * how an extension for NWMatcher could be
 * adapted to handle special jQuery selectors
 *
 * Child Selectors
 * :even, :odd, :eq, :lt, :gt, :first, :last, :nth
 *
 * Pseudo Selectors
 * :has, :button, :header, :input, :checkbox, :radio, :file, :image
 * :password, :reset, :submit, :text, :hidden, :visible, :parent
 *
 */

// for structural pseudo-classes extensions
NW.Dom.registerSelector(
  'jquery:child',
  /^\:(first|last|even|odd|nth|eq|gt|lt)(?:\(([^()]*)\))?(.*)/,
  function(match, source) {

  var status = true,
  // do not change this, it is searched & replaced
  ACCEPT_NODE = 'f&&f(c[k]);r[r.length]=c[k];continue main;';

  switch (match[1]) {
    case 'even':
      source = source.replace(ACCEPT_NODE, 'if((x=x^1)==1){' + ACCEPT_NODE + '}');
      break;
    case 'odd':
      source = source.replace(ACCEPT_NODE, 'if((x=x^1)==0){' + ACCEPT_NODE + '}');
      break;
    case 'eq':
      source = source.replace(ACCEPT_NODE, 'if(x++==' + match[2] + '){' + ACCEPT_NODE + '}');
      break;
    case 'lt':
      source = source.replace(ACCEPT_NODE, 'if(x++<' + match[2] + '){' + ACCEPT_NODE + '}');
      break;
    case 'gt':
      source = source.replace(ACCEPT_NODE, 'if(x++>' + match[2] + '){' + ACCEPT_NODE + '}');
      break;
    case 'first':
      source = 'n=h.getElementsByTagName(e.nodeName);if(n.length&&n[0]===e){' + source + '}';
      break;
    case 'last':
      source = 'n=h.getElementsByTagName(e.nodeName);if(n.length&&n[n.length-1]===e){' + source + '}';
      break;
    case 'nth':
      source = 'n=h.getElementsByTagName(e.nodeName);if(n.length&&n[' + match[2] + ']===e){' + source + '}';
      break;
    default:
      status = false;
      break;
  }

  // compiler will add this to "source"
  return {
    'source': source,
    'status': status
  };

});


// for element pseudo-classes extensions
NW.Dom.registerSelector(
  'jquery:pseudo',
  /^\:(has|checkbox|file|image|password|radio|reset|submit|text|button|input|header|hidden|visible|parent)(?:\((["']*)([^'"()]*)\2\))?(.*)/,
  function(match, source) {

  var status = true,
  // do not change this, it is searched & replaced
  ACCEPT_NODE = 'f&&f(c[k]);r[r.length]=c[k];continue main;';

  switch(match[1]) {
    case 'has':
      source = source.replace(ACCEPT_NODE, 'if(e.getElementsByTagName("' + match[3] + '")[0]){' + ACCEPT_NODE + '}');
      break;
    case 'checkbox':
    case 'file':
    case 'image':
    case 'password':
    case 'radio':
    case 'reset':
    case 'submit':
    case 'text':
      // :checkbox, :file, :image, :password, :radio, :reset, :submit, :text, ... ;-)
      source = 'if(e.type&&e.type=="' + match[1] + '"){' + source + '}';
      break;
    case 'button':
    case 'input':
      source = 'if(e.type||/button/i.test(e.nodeName)){' + source + '}';
      break;
    case 'header':
      source = 'if(/h[1-6]/i.test(e.nodeName)){' + source + '}';
      break;
    case 'hidden':
      source = 'if(e.type=="hidden"||e.style.display=="none"||e.style.visibility=="hidden"){' + source + '}';
      break;
    case 'visible':
      source = 'if(e.type!="hidden"&&e.style.display!="none"&&e.style.visibility!="hidden"){' + source + '}';
      break;
    case 'parent':
      source += 'if(e.firstChild){' + source + '}';
      break;
    default:
      status = false;
      break;
  }

  // compiler will add this to "source"
  return {
    'source': source,
    'status': status
  };

});

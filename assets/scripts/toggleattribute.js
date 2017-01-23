define('toggleAttribute', ['jquery'], function ($) {
  'use strict';

  return function (attributeName, $element) {
    if ( $($element).attr( attributeName ) === 'true' ) {
      $($element).attr( attributeName, 'false');
    } else {
      $($element).attr( attributeName, 'true');
    }
  };

});

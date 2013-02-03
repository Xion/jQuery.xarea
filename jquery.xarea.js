/**
 * jQuery plugin for vertically -expanding <textarea>
 * @author Karol Kuczmarski "Xion"
 * @note Contains ideas from http://stackoverflow.com/a/2032642/434799
 */


(function($) {
    
    $.fn.extend({
        xarea: function() {
            return this.filter('textarea').each(function() {
                var $this = $(this);
                var markup = setupMarkup($this);
                var autosize = setupAutosize(markup);
                autosize();
            });
        }
    });
    
    var setupMarkup = function($textarea) {
        var $container = $('<div/>');
        $container.css('position', 'relative');
        
        // create "mimic" <div> where the text will layout
        var $mimic = $('<div/>');
        $mimic.css({
            fontFamily:     $textarea.css('font-family'),
            fontSize:       $textarea.css('font-size'),
            fontWeight:     $textarea.css('font-weight'),
            lineHeight:     $textarea.css('line-height')
        });
        setCss($mimic, 'box-sizing', 'border-box');
        $mimic.css('min-height', $textarea.outerHeight());
        $mimic.css('margin', $textarea.css('margin'));
        $mimic.css('padding', $textarea.css('padding'));
        $mimic.css('padding-bottom', '0.7em');
        $mimic.css('border', $textarea.css('border'));
        $mimic.css('width', '100%');
        $mimic.css('visibility', 'hidden'); // not display:none as we want the layouting
        
        // adjust the textarea
        setCss($textarea, 'box-sizing', 'border-box');
        $textarea.css({
            width:      '100%',
            height:     '100%',
            overflow:   'hidden',
            position:   'absolute'
        });
        
        // replace it with container
        $container.insertAfter($textarea);
        $textarea.detach().appendTo($container);
        $mimic.appendTo($container);
        
        return {
            $container: $container,
            $mimic:     $mimic,
            $textarea:  $textarea
        };
    };
    
    var setupAutosize = function(markup) {
        markup.$textarea.css('resize', 'none'); // no manual sizing
        
        var autosize = function() {
            var text = htmlEscape(markup.$textarea.val());
            markup.$mimic.html(text);
        };
        markup.$textarea.on('change keydown keyup', autosize);
        return autosize;
    };
    
    /* Utility functions */
   
   var setCss = function($elem, style, value) {
       $elem.css(style, value);
       var VENDOR_PREFIXES = ['moz', 'webkit', 'ms', 'o'];
       for (var i = 0; i < VENDOR_PREFIXES.length; ++i) {
           var _style = '-' + VENDOR_PREFIXES[i] + '-' + style;
           $elem.css(_style, value);
       }
   };
   
   var htmlEscape = function(str) {
       return str.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/\n$/, '<br/>&nbsp;')
                 .replace(/\n/g, '<br/>')
                 .replace(/ {2,}/g, function(spaces) {
                     return repeat('&nbsp;', spaces.length - 1) + ' ';
                 });
   };
   
   var repeat = function(str, count) {
       return new Array(count + 1).join(str);
   };
   
})(jQuery);

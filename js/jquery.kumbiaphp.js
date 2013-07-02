/**
 * KumbiaPHP web & app Framework
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://wiki.kumbiaphp.com/Licencia
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@kumbiaphp.com so we can send you a copy immediately.
 *
 * Plugin para jQuery que incluye los callbacks basicos para los Helpers
 *
 * @copyright  Copyright (c) 2005-2012 Kumbia Team (http://www.kumbiaphp.com)
 * @license	http://wiki.kumbiaphp.com/Licencia	 New BSD License
 */
(function($) {
	/**
	 * Objeto KumbiaPHP
	 *
	 */
	$.KumbiaPHP = {
		/**
		 * Ruta al directorio public en el servidor
		 *
		 * @var String
		 */
		publicPath : null,

		/**
		 * Plugins cargados
		 *
		 * @var Array
		 */
		plugin: [],

		/**
		 * Muestra mensaje de confirmacion
		 *
		 * @param Object event
		 */
		cConfirm: function(event) {
			var este=$(this);
			if(!confirm(este.data('msg'))) {
				event.preventDefault();
			}
		},

		/**
		 * Aplica un efecto a un elemento
		 *
		 * @param String fx
		 */
		cFx: function(fx) {
			return function(event) {
				event.preventDefault();
				var este=$(this),
					rel = $('#'+este.data('to'));
				rel[fx]();
			}
		},

		/**
		 * Carga con AJAX
		 *
		 * @param Object event
		 */
		cRemote: function(event) {
			var este=$(this), rel = $('#'+este.data('to'));
			event.preventDefault();
			rel.load(this.href);
		},

		/**
		 * Carga con AJAX y Confirmacion
		 *
		 * @param Object event
		 */
		cRemoteConfirm: function(event) {
			var este=$(this), rel = $('#'+este.data('to'));
			event.preventDefault();
			if(confirm(este.data('msg'))) {
				rel.load(this.href);
			}
		},

		/**
		 * Enviar formularios de manera asincronica, via POST
		 * Y los carga en un contenedor
		 */
		cFRemote: function(event){
			event.preventDefault();
			var este = $(this), button = $('[type=submit]', este);
			button.attr('disabled', 'disabled');
			var url = este.attr('action'),
				div = este.data('to'),
				capa = $('#'+div),
				info = este.serialize();
			$.ajax({
                type: 'POST',
                url: url,
                data: info,
                success: function(data, status){
                    capa.html(data)
                    .hide().removeClass('error')
                    .show('slow', function(){
                        $('html, body').animate({
                            scrollTop: capa.offset().top - offset
                        },'fast');
                    });
                    button.attr('disabled', null);
                },
                error:function(obj, status, error){
                    capa.html(obj.response)
						.addClass('error');
                    button.attr('disabled', null);
                    $('body').animate({scrollTop: capa.offset().top},'fast');
                },
                dataType: 'html'
            });
		},

		/**
		 * Carga con AJAX al cambiar select
		 *
		 * @param Object event
		 */
		cUpdaterSelect: function(event) {
            var $t = $(this),$u= $('#' + $t.data('update'))
				url = $t.data('url');
            $u.empty();
            $.get(url, {'id':$t.val()}, function(d){
				for(i in d){
					var a = $('<option />').text(d[i]).val(i);
					$u.append(a);
				}
			}, 'json');
		},

		/**
		 * Enlaza a las clases por defecto
		 *
		 */
		bind : function() {
            // Enlace y boton con confirmacion
			$("a.js-confirm, input.js-confirm").on('click', this.cConfirm);

            // Enlace ajax
			$("a.js-remote").on('click', this.cRemote);

            // Enlace ajax con confirmacion
			$("a.js-remote-confirm").on('click', this.cRemoteConfirm);

            // Efecto show
			$("a.js-show").on('click', this.cFx('show'));

            // Efecto hide
			$("a.js-hide").on('click', this.cFx('hide'));

            // Efecto toggle
			$("a.js-toggle").on('click', this.cFx('toggle'));

            // Efecto fadeIn
			$("a.js-fade-in").on('click', this.cFx('fadeIn'));

            // Efecto fadeOut
			$("a.js-fade-out").on('click', this.cFx('fadeOut'));

            // Formulario ajax
			$("form.js-remote").on('submit', this.cFRemote);

            // Lista desplegable que actualiza con ajax
            $("select.js-remote").on('change', this.cUpdaterSelect);

		},

        /**
         * Implementa la autocarga de plugins, estos deben seguir
         * una convención para que pueda funcionar correctamente
         */
        autoload: function(){
            var elem = $("[class*='jp-']");
            $.each(elem, function(i, val){
                var este = $(this); //apunta al elemento con clase jp-*
                var classes = este.attr('class').split(' ');
                for (i in classes){
                    if(classes[i].substr(0, 3) == 'jp-'){
                        if($.inArray(classes[i].substr(3),$.KumbiaPHP.plugin) != -1)
                            continue;
                        $.KumbiaPHP.plugin.push(classes[i].substr(3))
                    }
                }
            });
            var head = $('head');
            for(i in $.KumbiaPHP.plugin){
                $.ajaxSetup({ cache: true});
                head.append('<link href="' + $.KumbiaPHP.publicPath + 'css/' + $.KumbiaPHP.plugin[i] + '.css" type="text/css" rel="stylesheet"/>');
				$.getScript($.KumbiaPHP.publicPath + 'javascript/jquery/jquery.' + $.KumbiaPHP.plugin[i] + '.js', function(data, text){});
            }
		},

		/**
		 * Inicializa el plugin
		 *
		 */
		initialize: function() {
			try{
				/* Esto apesta, mejor usar un atributo, se mantiene la vieja
				 * forma por compatibilidad
				 * Obtiene el publicPath, restando los caracteres que sobran
				de la ruta, respecto a la ruta de ubicacion del plugin de KumbiaPHP
				javascript/jquery/jquery.kumbiaphp.js"*/
				var script = $('script:last-child'), src = script.attr('src');
				this.publicPath =  script.data('path') || src.substr(0, src.length - 37);
			}catch(e){}
			// Enlaza a las clases por defecto
			$(function(){
				$.KumbiaPHP.bind();
				$.KumbiaPHP.autoload();
			});
		}
	}

	// Inicializa el plugin
	$.KumbiaPHP.initialize();
})(window.jQuery || window.Zepto);

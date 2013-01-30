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
 * @copyright  Copyright (c) 2005-2010 Kumbia Team (http://www.kumbiaphp.com)
 * @license	http://wiki.kumbiaphp.com/Licencia	 New BSD License
 */


/**
 * Se agregan los parametros "window", y "undefined",
 * el primero para rendimiento, el segundo por seguridad,
 * actualemnte no se usa pero es una buena practica en la creación del scope
 */
(function($, window, undefined) {
	/**
	 * Objeto KumbiaPHP
	 * Pasa a ser un objeto de este Scope, ya no pasa a ser parte
	 * de jQuery, esto mejora el rendimiento y el consumo de memoria
	 */
	 
	var KDebug = {
		isDebug:false,
		log: function(e){
			/*No emite mensajes en producción*/
			if(!this.isDebug)
				return;
			/*Permite emitir mensajes ya sea a la consola
			 * o usando alert en caso de no estar disponible
			 */
			var c = console || {debug:function(a){alert(a)}}
			console.debug(e);
		}
	}
	
	var KumbiaPHP = {
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
		cConfirm: function(e) {
			/*Usa ahora data-msg para el mensaje*/
			if(!confirm($(this).data('msg'))) {
				e.preventDefault();
			}
		},

		/**
		 * Aplica un efecto a un elemento
		 *
		 * @param String fx
		 */
		cFx: function(fx) {
			return function(e) {
				var obj =$(this).data('div');
				e.preventDefault();
				console.debug(obj);
				(($("#"+obj))[fx])();
			}
		},

		/**
		 * Carga con AJAX
		 *
		 * @param Object event
		 */
		cRemote: function(e) {
			var obj =$(this).data('div');
			e.preventDefault();
			$('#'+obj).load(this.href);
		},

		/**
		 * Carga con AJAX y Confirmacion
		 *
		 * @param Object event
		 */
		cRemoteConfirm: function(e) {
			var $this = $(this);
			e.preventDefault();
			var obj =$this.data('div');
			if(confirm($this.data('msg'))) {
				$('#'+obj).load(this.href);
			}
		},

		/**
		 * Enviar formularios de manera asincronica, via POST
		 * Y los carga en un contenedor
		 */
		cFRemote: function(e){
			e.preventDefault();
			var $t = $(this), button = $('[type=submit]', $t);
			button.attr('disabled', 'disabled');
			var url = $t.attr('action'), div = $t.data('div'), capa = $('#'+div);
			capa.html($t.data('load'));
			$.ajax({
				type: 'POST',
				url: url,
				data: $t.serialize(),
				success: function(data, status){
					capa.html(data)
						.hide()
						.show('slow');
					button.attr('disabled', null);
				},
				error:function(){
					capa.html($t.data('error'))
						.addClass('error');
					button.attr('disabled', null);
				},
				dataType: 'html'
			});
		},

		/**
		 * Carga con AJAX al cambiar select
		 *
		 * @param Object event
		 */
		cUpdaterSelect: function(e) {
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
		 * El uso de clases no es correcto se usará en su defecto
		 * data-kumbia para enlazar comportamientos
		 * El uso de live es deprecate, se usará ".on()"
		 */
		bind : function() {
            // Enlace y boton con confirmacion
			$("body").on('click','a.js-confirm, input.js-confirm', this.cConfirm)
				.on('click', 'a[:kumbia~="remote"]', this.cRemote) /*Enlace ajax*/
				.on('click', "a.js-remote-confirm", this.cRemoteConfirm) /*Enlace ajax con confirmacion*/
				.on('click', "a.js-show",this.cFx('show'))/*Efecto show*/
				.on('click', "a.js-hide", this.cFx('hide')) /*Efecto hide*/
				.on('click', "a.js-toggle", this.cFx('toggle'))
				.on('click', "a.js-fade-in", this.cFx('fadeIn'))
				.on('click', "a.js-fade-out", this.cFx('fadeOut'))
				.on('submit', 'form[:kumbia~="remote"]', this.cFRemote)
				.on('change', 'select[:kumbia~="remote"]', this.cUpdaterSelect)/*Lista desplegable que actualiza con ajax*/
		},

        /**
         * Se remueve temporalmente la autocarga de plugins, para discutir
         * como aprovechar la nueva API de jQuery 1.7 (Asynchronous Module Definition )
         * una convención para que pueda funcionar correctamente
         */

		/**
		 * Inicializa el plugin
		 *
		 */
		initialize: function() {
			/**
			 * // Obtiene el publicPath, restando los caracteres que sobran
			// de la ruta, respecto a la ruta de ubicacion del plugin de KumbiaPHP
			// "javascript/jquery/jquery.kumbiaphp.js"
			var src = $('script:last').attr('src');
			this.publicPath = src.substr(0, src.length - 37);
			console.log(src);
			console.debug(this.publicPath);
			**/
			/*El codigo anterior es algo susectible ante los cambios
			 * de nombre, mejor que se lea el
			 * Public Path desde el atributo "data-path"
			 * Ese atributo se recomienda generarlo con un helper
			 * 
			 */
			var j =$('script:last');
			//Asigan el valor del depurado
			KDebug.isDebug = !!(j.data('debug')); 	
			
			this.publicPath = j.data('data-path');
			if(this.publicPath == undefined)
				KDebug.log('No se cargó el PublicPath');
			// Enlaza a las clases por defecto
			$(function(){
				KumbiaPHP.bind();
			});
		}
	}

	// Inicializa el plugin
	KumbiaPHP.initialize();
	/*Permite usar el depurador fuera del scope*/
	window.KDebug = KDebug;
})(jQuery, window);

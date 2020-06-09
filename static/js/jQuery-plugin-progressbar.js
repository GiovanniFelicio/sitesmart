;
(function ($) {
	$.fn.loading = function () {
		var DEFAULTS = {
			backgroundColor: '#b3cef6',
			progressColor: '#4b86db',
			percent: 75,
			duration: 2000
		};	
		
		$(this).each(function () {
			var $target  = $(this);

			var opts = {
				backgroundColor: $target.data('color') ? $target.data('color').split(',')[0] : DEFAULTS.backgroundColor,
				progressColor: $target.data('color') ? $target.data('color').split(',')[1] : DEFAULTS.progressColor,
				percent: $target.data('percent') ? $target.data('percent') : DEFAULTS.percent,
				duration: $target.data('duration') ? $target.data('duration') : DEFAULTS.duration
			};
	
			$target.append('<div class="background"></div><div class="rotate"></div><div class="left"></div><div class="right"></div><div class=""><span>' + opts.percent + '%</span></div>');
			if (opts.percent <= 35) {
				opts.progressColor = '#f60000';
			}
			else if (opts.percent <= 45) {
				opts.progressColor = '#ff7b00';
			}
			else if (opts.percent <= 55) {
				opts.progressColor = '#ffb700';
			}
			else if (opts.percent <= 65) {
				opts.progressColor = '#f2ff00';
			}
			else if (opts.percent <= 75) {
				opts.progressColor = '#aeff00';
			}
			$target.find('.background').css('background-color', opts.backgroundColor);
			$target.find('.left').css('background-color', opts.backgroundColor);
			$target.find('.rotate').css('background-color', opts.progressColor);
			$target.find('.right').css('background-color', opts.progressColor);
	
			var $rotate = $target.find('.rotate');
			setTimeout(function () {	
				$rotate.css({
					'transition': 'transform ' + opts.duration + 'ms linear',
					'transform': 'rotate(' + opts.percent * 3.6 + 'deg)'
				});
			},1);		
			
			if (opts.percent > 50) {
				var animationRight = 'toggle ' + (opts.duration / opts.percent * 50) + 'ms step-end';
				var animationLeft = 'toggle ' + (opts.duration / opts.percent * 50) + 'ms step-start';  
				$target.find('.right').css({
					animation: animationRight,
					opacity: 1
				});
				$target.find('.left').css({
					animation: animationLeft,
					opacity: 0
				});
			}

		});
	}
})(jQuery);
;(function() {
  'use strict';

  var $ = window.jQuery;
  var alertify = window.alertify;
  // iPad and iPod detection
  // var isiPad = function() {
  //   return (navigator.platform.indexOf('iPad') != -1);
  // };

  // var isiPhone = function() {
  //   return (
  //     (navigator.platform.indexOf('iPhone') !== -1) ||
  //     (navigator.platform.indexOf('iPod') !== -1)
  //  );
  // };

  // Parallax
  var parallax = function() {
    $(window).stellar();
  };
  // Burger Menu
  var burgerMenu = function() {
    $('body').on('click', '.js-fh5co-nav-toggle', function(event) {
      event.preventDefault();
      if ($('#navbar').is(':visible')) {
        $(this).removeClass('active');
      } else {
        $(this).addClass('active');
      }
    });
  };
  var goToTop = function() {
    $('.js-gotop').on('click', function(event) {
      event.preventDefault();
      $('html, body').animate({
        scrollTop: $('html').offset().top
      }, 500);
      return false;
    });
  };
  // Page Nav
  var clickMenu = function() {
    $('#navbar a:not([class="external"])').click(function(event) {
      var section = $(this).data('nav-section');
      var navbar = $('#navbar');

      if ($('[data-section="' + section + '"]').length) {
        $('html, body').animate({
          scrollTop: $('[data-section="' + section + '"]').offset().top
        }, 1300);
      }

      if (navbar.is(':visible')) {
        navbar.removeClass('in');
        navbar.attr('aria-expanded', 'false');
        $('.js-fh5co-nav-toggle').removeClass('active');
      }

      event.preventDefault();
      return false;
    });
  };

  // Reflect scrolling in navigation
  var navActive = function(section) {
    var $el = $('#navbar > ul');
    $el.find('li').removeClass('active');
    $el.each(function() {
      $(this).find('a[data-nav-section="' + section + '"]').closest('li').addClass('active');
    });
  };

  var navigationSection = function() {
    var $section = $('section[data-section]');
    $section.waypoint(function(direction) {
      if (direction === 'down') {
        navActive($(this.element).data('section'));
      }
    }, {
      offset: '150px'
    });

    $section.waypoint(function(direction) {
      if (direction === 'up') {
        navActive($(this.element).data('section'));
      }
    }, {
      offset: function() { return -$(this.element).height() + 155; }
    });
  };

  // Window Scroll
  var windowScroll = function() {
    $(window).scroll(function(event) {
      var header = $('#fh5co-header');
      var scrlTop = $(this).scrollTop();

      if (scrlTop > 500 && scrlTop <= 2000) {
        header.addClass('navbar-fixed-top fh5co-animated slideInDown');
      } else if (scrlTop <= 500) {
        if (header.hasClass('navbar-fixed-top')) {
          header.addClass('navbar-fixed-top fh5co-animated slideOutUp');
          setTimeout(function() {
            header.removeClass('navbar-fixed-top fh5co-animated slideInDown slideOutUp');
          }, 100);
        }
      }
    });
  };

  // Animations
  // Datacenter
  var datacenterAnimate = function() {
    animeThis('#smart-datacenter');
  };

  var produtosAnimate = function() {
    animeThis('#smart-produtos');
  };

  var designAnimate = function() {
    animeThis('#smart-design');
  };

  var pojetosMecAnimate = function() {
    animeThis('#smart-projetosmec');
  };

  var pojetosHarAnimate = function() {
    animeThis('#smart-projetoshar');
  };

  var sistemasEmbAnimate = function() {
    animeThis('#smart-sistemasemb');
  };

  var integracoesAnimate = function() {
    animeThisItem('#smart-integracoes', 'to-animate-right', 'fadeInRight', 500);
    animeThis('#smart-integracoes');
  };

  var implementacoesProcAnimate = function() {
    animeThis('#smart-implementacaoproc');
  };

  var quemSomosAnimate = function() {
    animeThis('#smart-quemsomos');
  };

  var opensourceAnimate = function() {
    animeThisItem('#smart-opensource', 'to-animate-left', 'fadeInLeft', 500);
    animeThisItem('#smart-opensource', 'to-animate-right', 'fadeInRight', 500);
    animeThis('#smart-opensource');
  };

  var animeHospedagem = function() {
    animeThisItem('#smart-hospedagem', 'img-dominio-frente', 'fadeInRight', 500);
    animeThisItem('#smart-hospedagem', 'img-dominio-atras', 'fadeInLeft', 1000);
    animeThis('#smart-hospedagem');
  };

  var backupAnimation = function() {
    animeThis('#smart-backup');
  };

  var clientsAnimation = function() {
    animeThis('#smart-clientes');
  };

  var parceirosAnimation = function() {
    animeThis('#smart-parceiros');
  };

  // Home

  var homeAnimate = function() {
    if ($('#fh5co-home').length > 0) {
      $('#fh5co-home').waypoint(function(direction) {
        if (direction === 'down' && !$(this.element).hasClass('animated')) {
          setTimeout(function() {
            $('#fh5co-home .to-animate').each(function(k) {
              var el = $(this);
              setTimeout(function() {
                el.addClass('fadeInUp animated');
              }, k * 200, 'easeInOutExpo');
            });
          }, 200);
          $(this.element).addClass('animated');
        }
      }, {
        offset: '80%'
      });
    }
  };

  var introAnimate = function() {
    if ($('#fh5co-intro').length > 0) {
      $('#fh5co-intro').waypoint(function(direction) {
        if (direction === 'down' && !$(this.element).hasClass('animated')) {
          setTimeout(function() {
            $('#fh5co-intro .to-animate').each(function(k) {
              var el = $(this);

              setTimeout(function() {
                el.addClass('fadeInRight animated');
              }, k * 200, 'easeInOutExpo');
            });
          }, 1000);

          $(this.element).addClass('animated');
        }
      }, { offset: '80%' });
    }
  };

  var workAnimate = function() {
    if ($('#fh5co-work').length > 0) {
      $('#fh5co-work').waypoint(function(direction) {
        if (direction === 'down' && !$(this.element).hasClass('animated')) {
          setTimeout(function() {
            $('#fh5co-work .to-animate').each(function(k) {
              var el = $(this);
              setTimeout(function() {
                el.addClass('fadeInUp animated');
              }, k * 200, 'easeInOutExpo');
            });
          }, 200);

          $(this.element).addClass('animated');
        }
      }, {
        offset: '80%'
      });
    }
  };

  var testimonialAnimate = function() {
    var testimonial = $('#fh5co-testimonials');
    if (testimonial.length > 0) {
      testimonial.waypoint(function(direction) {
        if (direction === 'down' && !$(this.element).hasClass('animated')) {
          var sec = testimonial.find('.to-animate').length;
          sec = parseInt((sec * 200) - 400);
          setTimeout(function() {
            testimonial.find('.to-animate').each(function(k) {
              var el = $(this);
              setTimeout(function() {
                el.addClass('fadeInUp animated');
              }, k * 200, 'easeInOutExpo');
            });
          }, 200);

          setTimeout(function() {
            testimonial.find('.to-animate-2').each(function(k) {
              var el = $(this);

              setTimeout(function() {
                el.addClass('fadeInDown animated');
              }, k * 200, 'easeInOutExpo');
            });
          }, sec);
          $(this.element).addClass('animated');
        }
      }, { offset: '80%' });
    }
  };

  var servicesAnimate = function() {
    var services = $('#fh5co-services');
    if (services.length > 0) {
      services.waypoint(function(direction) {
        if (direction === 'down' && !$(this.element).hasClass('animated')) {
          var sec = services.find('.to-animate').length;
          sec = parseInt((sec * 200) + 400);

          setTimeout(function() {
            services.find('.to-animate').each(function(k) {
              var el = $(this);

              setTimeout(function() {
                el.addClass('fadeInUp animated');
              }, k * 200, 'easeInOutExpo');
            });
          }, 200);

          setTimeout(function() {
            services.find('.to-animate-2').each(function(k) {
              var el = $(this);

              setTimeout(function() {
                el.addClass('bounceIn animated');
              }, k * 200, 'easeInOutExpo');
            });
          }, sec);

          $(this.element).addClass('animated');
        }
      }, { offset: '80%' });
    }
  };

  function animeThis(ani) {
    var services = $(ani);
    if (services.length > 0) {
      services.waypoint(function(direction) {
        if (direction === 'down' && !$(this.element).hasClass('animated')) {
          var sec = services.find('.to-animate').length;
          sec = parseInt((sec * 200) + 400);

          setTimeout(function() {
            services.find('.to-animate').each(function(k) {
              var el = $(this);

              setTimeout(function() {
                el.addClass('fadeInUp animated');
              }, k * 200, 'easeInOutExpo');
            });
          }, 200);

          setTimeout(function() {
            services.find('.to-animate-2').each(function(k) {
              var el = $(this);

              setTimeout(function() {
                el.addClass('bounceIn animated');
              }, k * 200, 'easeInOutExpo');
            });
          }, sec);
          $(this.element).addClass('animated');
        }
      }, { offset: '80%' });
    }
  }

  function animeThisItem(element, cssClass, animation, duration) {
    var toAnimate = $(element);
    if (!cssClass) {
      cssClass = '.to-animate';
    }

    if (!duration || isNaN(duration)) {
      duration = toAnimate.find(cssClass).length;
      duration = parseInt((3 * 200) + 400);
    }

    if (toAnimate.length > 0) {
      toAnimate.waypoint(function(direction) {
        if (direction === 'down' && !$(this.element).hasClass('animated')) {
          setTimeout(function() {
            toAnimate.find('.' + cssClass).each(function(k) {
              var el = $(this);

              setTimeout(function() {
                el.addClass(animation + ' animated');
              }, k * 200, 'easeInOutExpo');
            });
          }, duration);
        }
      }, { offset: '80%' });
    }
  }

  var AnimeIt = function() {
    animeThis('#smart-email');
  };

  var AnimeSmartCOntato = function() {
    animeThis('#smart-contact');
  };

  var aboutAnimate = function() {
    var about = $('#fh5co-about');
    if (about.length > 0) {
      about.waypoint(function(direction) {
        if (direction === 'down' && !$(this.element).hasClass('animated')) {
          setTimeout(function() {
            about.find('.to-animate').each(function(k) {
              var el = $(this);

              setTimeout(function() {
                el.addClass('fadeInUp animated');
              }, k * 200, 'easeInOutExpo');
            });
          }, 200);
          $(this.element).addClass('animated');
        }
      }, { offset: '80%' });
    }
  };

  var countersAnimate = function() {
    var counters = $('#fh5co-counters');
    if (counters.length > 0) {
      counters.waypoint(function(direction) {
        if (direction === 'down' && !$(this.element).hasClass('animated')) {
          var sec = counters.find('.to-animate').length;
          sec = parseInt((sec * 200) + 400);

          setTimeout(function() {
            counters.find('.to-animate').each(function(k) {
              var el = $(this);

              setTimeout(function() {
                el.addClass('fadeInUp animated');
              }, k * 200, 'easeInOutExpo');
            });
          }, 200);
          setTimeout(function() {
            counters.find('.js-counter').countTo({
              formatter: function(value, options) {
                return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value.toFixed(options.decimals));
              }
            });
          }, 400);

          setTimeout(function() {
            counters.find('.to-animate-2').each(function(k) {
              var el = $(this);

              setTimeout(function() {
                el.addClass('bounceIn animated');
              }, k * 200, 'easeInOutExpo');
            });
          }, sec);
          $(this.element).addClass('animated');
        }
      }, { offset: '80%' });
    }
  };

  var contactAnimate = function() {
    var contact = $('#fh5co-contact');
    if (contact.length > 0) {
      contact.waypoint(function(direction) {
        if (direction === 'down' && !$(this.element).hasClass('animated')) {
          setTimeout(function() {
            contact.find('.to-animate').each(function(k) {
              var el = $(this);

              setTimeout(function() {
                el.addClass('fadeInUp animated');
              }, k * 200, 'easeInOutExpo');
            });
          }, 200);
          $(this.element).addClass('animated');
        }
      }, { offset: '80%' });
    }
  };

  // Document on load.
  $(function() {
    parallax();

    burgerMenu();

    clickMenu();

    windowScroll();

    navigationSection();

    goToTop();

    // Animations
    contactAnimate();
    homeAnimate();
    introAnimate();
    workAnimate();

    testimonialAnimate();
    servicesAnimate();
    aboutAnimate();
    countersAnimate();
    AnimeIt();
    datacenterAnimate();
    opensourceAnimate();
    animeHospedagem();
    backupAnimation();
    AnimeSmartCOntato();
    quemSomosAnimate();
    clientsAnimation();
    parceirosAnimation();
    datacenterAnimate();

    /** animações da página products */
    produtosAnimate();
    designAnimate();
    pojetosMecAnimate();
    pojetosHarAnimate();
    sistemasEmbAnimate();
    integracoesAnimate();
    implementacoesProcAnimate();
  });

  $('.slider-clientes').slick({
    slidesToShow: 3,
    dots: true,
    arrows: false,
    infinite: true,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          autoplay: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          infinite: false
        }
      }
      // // You can unslick at a given breakpoint now by adding:
      // // settings: 'unslick'
      // // instead of a settings object
    ]
  });
  // $('#sendMailTo').click(function() {
  //   $.post('contato/contato.php',
  //   $('#formularioContato').serialize()).done(function(data) {
  //     if (data) {
  //       alertify.success('Seu email foi envido :)');
  //     } else {
  //       alertify.error('Desculpe, seu email não pode ser enviado ...');
  //     }
  //   });
  // });
}());

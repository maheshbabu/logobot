"use strict";

(function() {
  var FONTS = [
    {
      'name': 'Serif',
      'fonts': [
        'Comfortaa',
        'EB Garamond',
        'Gabriela',
        'Kelly Slab',
        'Kurale',
        'Lora',
        'Merriweather',
        'Noto Serif',
        'PT Serif',
        'Playfair Display',
        'Podkova',
        'Poiret One',
        'Roboto Slab',
        'Vollkorn',
        'Yeseva One',
      ],
    },
    {
      'name': 'Sans Serif',
      'fonts': [
        'Fira Sans',
        'Jura',
        'Marmelad',
        'Open Sans',
        'Oswald',
        'Philosopher',
        'Play',
        'PT Sans',
        'Roboto',
        'Roboto Condensed',
        'Rubik Mono One',
        'Rubik',
        'Russo One',
        'Source Sans Pro',
        'Tenor Sans',
        'Ubuntu',
        'Yanone Kaffeesatz',
      ]
    },
    {
      'name': 'Cursive',
      'fonts': [
        'Bad Script',
        'Berkshire Swash',
        'Cookie',
        'Fondamento',
        'Great Vibes',
        'Kaushan Script',
        'Neucha',
        'Pacifico',
        'Permanent Marker',
        'Petit Formal Script',
        'Sacramento',
        'Satisfy',
      ]
    },
    {
      'name': 'Monospace',
      'fonts': [
        'Anonymous Pro',
        'Fira Mono',
        'PT Mono',
        'Press Start 2P',
        'Roboto Mono',
        'Ubuntu Mono',
      ]
    }
  ]

  // taken from Underscore.js 1.8.3
  var debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = Date.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = Date.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  var $VM = new Vue({
    el: '#main',
    components: {
      'colorpicker': VueColor.Chrome
    },
    data: function() {
      return {
        title: {
          text: 'YourBrand',
          font: 'Satisfy',
          size: 38,
          color: '#4688c8',
          bold: true,
          italic: false,
        },
        subtitle: {
          text: '',
          font: 'Open Sans',
          size: 16,
          color: '#666666',
          bold: false,
          italic: false,
          distance: 5,
        },
        icon: {
          id: null,
          content: null,
          size: 50,
          distance: 5,
        },
        align: 'left',
        fonts: FONTS,
        advanced: false,
        iconsets: [],
      }
    },
    mounted: function() {
      var $vm = this
      $vm.setFont('title', $vm.title.font, function() {
        $vm.setFont('subtitle', $vm.subtitle.font, function() {
          $('.logo-entity').css({opacity: 1})
        })
      })
      $(window).on('resize', function() { $vm.alignLogo() })
    },
    updated: function() {
      this.alignLogo()
    },
    watch: {
      'title.font': function(newVal, oldVal) {
        this.setFont('title', newVal)
      },
      'subtitle.font': function(newVal, oldVal) {
        this.setFont('subtitle', newVal)
      }
    },
    methods: {
      searchLogo: debounce(function($event) {
        var term = $event.target.value
        var $vm = this

        if (!term) {
          this.iconsets = []
          return
        }
        $.get('https://api.icons8.com/api/iconsets/v3/search?amount=20&term=' + term, function(data) {
          if (data.success) {
            $vm.iconsets = data.result.search
          }
        })
      }, 300),
      alignLogo: function() {
        var rect = function(rect) {
          return {x: 0, y: 0, w: rect.width, h: rect.height}
        }
        var container = rect(this.$refs.preview.getBoundingClientRect())
        var title = rect(this.$refs.title.getBoundingClientRect())
        var subtitle = rect(this.$refs.subtitle.getBoundingClientRect())
        var logo = rect(this.icon.content ? {width: parseInt(this.icon.size), height: parseInt(this.icon.size)} : {width: 0, height: 0})

        var logoDistance = this.icon.content ? parseInt(this.icon.distance) : 0
        var subtitleDistance = this.subtitle.text ? parseInt(this.subtitle.distance) : 0

        if (this.align == 'left') {
          var mW = Math.max(title.w, subtitle.w) + logo.w
          logo.x = (container.w - mW - logoDistance) / 2
          logo.y = (container.h - logo.h) / 2
          title.x = subtitle.x = logo.x + logo.w + logoDistance
          title.y = subtitle.y = (container.h - title.h - subtitle.h - subtitleDistance) / 2
          subtitle.x = title.x
          subtitle.y = title.y + title.h + subtitleDistance
        } else if (this.align == 'right') {
          var mW = Math.max(title.w, subtitle.w) + logo.w
          logo.x = (container.w + mW) / 2 - logo.w
          logo.y = (container.h - logo.h) / 2
          title.x = logo.x - logoDistance - title.w
          title.y = subtitle.y = (container.h - title.h - subtitle.h - subtitleDistance) / 2
          subtitle.x = logo.x - logoDistance - subtitle.w
          subtitle.y = title.y + title.h + subtitleDistance
        } else if (this.align == 'top') {
          logo.x = (container.w - logo.w) / 2
          logo.y = (container.h - logo.h - title.h - subtitle.h - logoDistance - subtitleDistance) / 2
          title.x = (container.w - title.w) / 2
          title.y = logo.y + logo.h + logoDistance
          subtitle.x = (container.w - subtitle.w) / 2
          subtitle.y = title.y + title.h + subtitleDistance
        } else if (this.align == 'bottom') {
          title.x = (container.w - title.w) / 2
          title.y = (container.h - logo.h - title.h - subtitle.h - logoDistance - subtitleDistance) / 2
          subtitle.x = (container.w - subtitle.w) / 2
          subtitle.y = title.y + title.h + subtitleDistance
          logo.x = (container.w - logo.w) / 2
          logo.y = subtitle.y + subtitle.h + logoDistance
        }

        $('#g-logo').attr('transform', 'translate(' + logo.x + ', ' + logo.y + ') scale(1)')
        $('#g-logo svg').attr({width: logo.w + 'px', height: logo.h + 'px'})
        $('#g-title').attr('transform', 'translate(' + title.x + ', ' + title.y + ') scale(1)')
        $('#g-subtitle').attr('transform', 'translate(' + subtitle.x + ', ' + subtitle.y + ') scale(1)')
      },
      setIcon: function(icon) {
        this.icon.id = icon.id
        this.icon.original = icon.svg
        this.icon.content = icon.svg
      },
      setFont: function(id, font) {
        var $vm = this
        var link = document.createElement('link')
        link.id = 'font-' + id
        link.rel = 'stylesheet'
        link.href = 'https://fonts.googleapis.com/css?family=' + font.replace(/ /g, '+')
        var $link = $(link)
        $link.on('load', function() {
          FontFaceOnload(font, {
            success: function() {
              $vm.alignLogo()
            },
            error: function() {
              console.log('failed to load font', font)
            }})
        })
        $('body')
          .find('#font-' + id).remove().end()
          .append($link)
      },
      render: function() {
        var svg = this.$refs.preview.innerHTML
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')

        canvas.width = 500
        canvas.height = 500
        ctx.drawSvg(svg, 0, 0, 500, 500)
        var png = canvas.toDataURL()
        this.$refs.download.href = png
      }
    }
  })
})()

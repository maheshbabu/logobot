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

  var setFont = function(id, font, callback) {
    var link = document.createElement('link')
    link.id = 'font-' + id
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css?family=' + font.replace(/ /g, '+')
    var $link = $(link)
    $link.on('load', function() {
      FontFaceOnload(font, {
        success: function() {
          if (callback) callback()
          calculateTransforms($VM)
        },
        error: function() {
          console.log('failed to load font', font)
        }})
    })
    $('body')
      .find('#font-' + id).remove().end()
      .append($link)
  }

  var calculateTransforms = function($vm) {
    var previewSize = $vm.$refs.preview.getBoundingClientRect()
    var titleSize = $vm.$refs.title.getBoundingClientRect()
    var subtitleSize = $vm.$refs.subtitle.getBoundingClientRect()
    var logoSize = $vm.logoSize
    var align = $vm.align

    var logoDistance = $vm.logo.file ? parseInt($vm.logo.distance) : 0
    var subtitleDistance = $vm.subtitle.text ? parseInt($vm.subtitle.distance) : 0

    if (align == 'left') {
      var maxWidth = Math.max(titleSize.width, subtitleSize.width) + logoSize.width
      var logoX = (previewSize.width - maxWidth - logoDistance) / 2
      var logoY = (previewSize.height - logoSize.height) / 2
      var titleX = logoX + logoSize.width + logoDistance
      var titleY = (previewSize.height - titleSize.height - subtitleSize.height - subtitleDistance) / 2
      var subtitleX = titleX
      var subtitleY = titleY + titleSize.height + subtitleDistance
    } else if (align == 'center') {
      var logoX = (previewSize.width - logoSize.width) / 2
      var logoY = (previewSize.height - logoSize.height - titleSize.height - subtitleSize.height - logoDistance - subtitleDistance) / 2
      var titleX = (previewSize.width - titleSize.width) / 2
      var titleY = logoY + logoSize.height + logoDistance
      var subtitleX = (previewSize.width - subtitleSize.width) / 2
      var subtitleY = titleY + titleSize.height + subtitleDistance
    }

    $('#g-logo').attr('transform', 'translate(' + logoX + ', ' + logoY + ') scale(1)')
    $('#g-title').attr('transform', 'translate(' + titleX + ', ' + titleY + ') scale(1)')
    $('#g-subtitle').attr('transform', 'translate(' + subtitleX + ', ' + subtitleY + ') scale(1)')
  }

  var $VM = new Vue({
    el: '#main',
    components: {
      'colorpicker': VueColor.Chrome
    },
    data: function() {
      return {
        title: {
          text: 'YourBrand',
          font: 'Berkshire Swash',
          size: 66,
          color: '#F44E3B',
          bold: true,
          italic: false,
        },
        subtitle: {
          text: 'and slogan (maybe)',
          font: 'Open Sans',
          size: 16,
          color: '#666666',
          bold: false,
          italic: false,
          distance: 5,
        },
        logo: {
          file: null,
          image: null,
          size: 50,
          distance: 5,
        },
        align: 'center',
        fonts: FONTS,
        advanced: false,
      }
    },
    computed: {
      logoSize: function() {
        var logo = this.logo
        var s = parseInt(logo.size)
        var w = logo.width
        var h = logo.height
        if (!w || !h) return {width: 0, height: 0}
        if (w / h > 1) return {width: s, height: h * (s / w)}
        else return {width: w * (s / h), height: s}
      }
    },
    mounted: function() {
      var $vm = this
      setFont('title', $vm.title.font, debounce(function() {
        setFont('subtitle', $vm.subtitle.font, debounce(function() {
          $('.logo-entity').css({opacity: 1})
        }, 200))
      }, 200))
      $(window).on('resize', calculateTransforms.bind(null, this))
    },
    updated: function() {
      calculateTransforms(this)
    },
    watch: {
      'title.font': function(newVal, oldVal) {
        setFont('title', newVal)
      },
      'subtitle.font': function(newVal, oldVal) {
        setFont('subtitle', newVal)
      }
    },
    methods: {
      onImageChange: function(e) {
        var $vm = this
        var files = e.target.files || e.dataTransfer.files

        if (!files.length) return

        this.logo.file = files[0]

        var reader = new FileReader()
        reader.addEventListener('load', function() {
          $vm.logo.image = reader.result
          var image = new Image()
          image.src = reader.result
          image.onload = function() {
            Vue.set($vm.logo, 'width', image.width)
            Vue.set($vm.logo, 'height', image.height)
          }
        })
        reader.readAsDataURL(this.logo.file)
      },
      randomLogo: function() {
        var logo = bot.randomlogo()
        Object.assign(this.title, logo.title)
        Object.assign(this.subtitle, logo.subtitle)
        this.align = logo.align
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

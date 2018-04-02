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
        align: 'left',
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
      alignLogo: function() {
        var rect = function(rect) {
          return {x: 0, y: 0, w: rect.width, h: rect.height}
        }
        var container = rect(this.$refs.preview.getBoundingClientRect())
        var title = rect(this.$refs.title.getBoundingClientRect())
        var subtitle = rect(this.$refs.subtitle.getBoundingClientRect())
        var logo = rect(this.logoSize)

        var logoDistance = this.logo.file ? parseInt(this.logo.distance) : 0
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
          logo.x = (container.w * 2 - mW) / 2
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
        $('#g-title').attr('transform', 'translate(' + title.x + ', ' + title.y + ') scale(1)')
        $('#g-subtitle').attr('transform', 'translate(' + subtitle.x + ', ' + subtitle.y + ') scale(1)')
        return
        var logoSize = this.logoSize
        var align = this.align


        var title = {x: 0, y: 0, w: titleSize.width, h: titleSize.height}
        var subtitle = {x: 0, y: 0}
        var logo = {x: 0, y: 0}

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
      },
      setFont: function(id, font, callback) {
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

"use strict";

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
      'Roboto',
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
      'Fondamento',
      'Neucha',
      'Pacifico',
      'Permanent Marker',
      'Petit Formal Script',
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

var setFont = function(id, font) {
  var link = '<link id="font-' + id + '" rel="stylesheet" href="https://fonts.googleapis.com/css?family=' + font + '">'
  $('body')
    .find('#font-' + id).remove().end()
    .append($(link))
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

new Vue({
  el: '#main',
  components: {
    'colorpicker': VueColor.Compact
  },
  data: function() {
    return {
      title: {
        text: 'Alibaba',
        font: 'Berkshire Swash',
        size: 66,
        color: '#F44E3B',
        bold: true,
        italic: false,
      },
      subtitle: {
        text: 'We Sell Everything',
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
    setFont('title', this.title.font)
    setFont('subtitle', this.subtitle.font)
    calculateTransforms(this)
    setTimeout(calculateTransforms.bind(null, this), 300)
    $(window).on('resize', calculateTransforms.bind(null, this))
  },
  updated: function() {
    setTimeout(calculateTransforms.bind(null, this), 300)
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
          console.log('onload')
          Vue.set($vm.logo, 'width', image.width)
          Vue.set($vm.logo, 'height', image.height)
        }
      })
      reader.readAsDataURL(this.logo.file)
    }
  }
})

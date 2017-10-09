var FONTS = [
  {
    'name': 'Serif',
    'fonts': [
      'Merriweather',
    ],
  },
  {
    'name': 'Sans-serif',
    'fonts': [
      'Open Sans',
    ]
  },
  {
    'name': 'Cursive',
    'fonts': [
      'Pacifico',
      'Permanent Marker',
      'Berkshire Swash',
      'Petit Formal Script',
      'Fondamento',
    ]
  },
  {
    'name': 'Monospace',
    'fonts': [
      'Roboto Mono',
    ]
  }
]

setFont = function(id, font) {
  var link = '<link id="font-' + id + '" rel="stylesheet" href="https://fonts.googleapis.com/css?family=' + font + '">'
  $('body')
    .find('#font-' + id).remove().end()
    .append($(link))
}

var calculateTransforms = function($vm) {
  var previewSize = $vm.$refs.preview.getBoundingClientRect()
  var titleSize = $vm.$refs.title.getBoundingClientRect()
  var subtitleSize = $vm.$refs.subtitle.getBoundingClientRect()

  var align = $vm.align

  if (align == 'left') {
    var maxWidth = Math.max(titleSize.width, subtitleSize.width)
    var titleX = (previewSize.width - maxWidth) / 2
    var titleY = previewSize.height / 2 - (titleSize.height + subtitleSize.height) / 2
    var subtitleX = titleX
    var subtitleY = titleY + titleSize.height
  } else if (align == 'center') {
    var titleX = (previewSize.width - titleSize.width) / 2
    var titleY = previewSize.height / 2 - (titleSize.height + subtitleSize.height) / 2
    var subtitleX = (previewSize.width - subtitleSize.width) / 2
    var subtitleY = titleY + titleSize.height
  }

  $('#g-title').attr('transform', 'translate(' + titleX + ', ' + titleY + ') scale(1)')
  $('#g-subtitle').attr('transform', 'translate(' + subtitleX + ', ' + subtitleY + ') scale(1)')
}

new Vue({
  el: '#main',
  data: function() {
    return {
      title: {
        text: 'Alibaba',
        font: 'Berkshire Swash',
        size: 66,
        color: '#ec4343',
        bold: true,
        italic: false,
      },
      subtitle: {
        text: 'We Sell Everything',
        font: 'Open Sans',
        size: 16,
        color: '#444444',
        bold: false,
        italic: false
      },
      fonts: FONTS,
      align: 'center',
    }
  },
  mounted: function() {
    setFont('title', this.title.font)
    setFont('subtitle', this.subtitle.font)
    calculateTransforms(this)
    setTimeout(calculateTransforms.bind(null, this), 300)
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
})

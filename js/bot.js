'use strict';

(function() {

  var rand = function(min, max) {
    return Math.random() * (max - min) + min
  }
  var randint = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  var choice = function(elements) {
    return elements[randint(0, elements.length - 1)]
  }

  var themes = {
    sports: function() {
      return {
        title: {
          text: choice([
            'US Sports', 'Lynx', 'Runner', 'Tigers', 'Progressive',
            'IA Games', 'X-Athletics', 'Naik', 'Xtreme Sports',
            'Stake Horse', 'Jump', 'A Sports', 'ExtremeRun', 'FitX',
          ]),
          font: choice([
            'Roboto Mono', 'Open Sans', 'Oswald', 'Play', 'Jura',
            'Kelly Slab', 'Roboto Slab',
          ]),
          size: randint(50, 85),
          // red or blue/pruple
          color: tinycolor({
            h: choice([randint(0, 9), randint(200, 278)]),
            s: rand(0.6, 0.95),
            l: 0.5
          }).toHexString(),
          bold: Math.random() > 0.3,
          italic: false,
        },
        subtitle: {
          text: '',
          font: '',
          size: 15,
          color: '',
          bold: false,
          italic: false,
        },
        align: 'center',
      }
    },
  }

  this.bot = {
    utils: {
      rand: rand,
      randint: randint,
      choice: choice,
    },
    themes: themes,
    randomlogo: function() {
      return themes[choice(Object.keys(themes))]()
    }
  }
}.call(window))

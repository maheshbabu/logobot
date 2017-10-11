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
    florist: function() {
      return {
        title: {
          text: choice([
            'Alice\'s', 'Fresh Cuts', 'Mary\'s', 'Lucy\'s Flowers', 'Bloom',
            'flowerstory', 'dream seeds', 'Jenny\'s', 'Sara May', 'FLORALLY',
            'Amanda\'s', 'Tulip', 'Pretty Pots', 'Iris', 'Bella Rosa',
          ]),
          font: choice([
            'Bad Script', 'Petit Formal Script', 'Pacifico', 'Satisfy',
            'Kaushan Script', 'Cookie', 'Great Vibes', 'Sacramento',
          ]),
          size: randint(50, 60),
          // green/cyan/blue or purple/red
          color: tinycolor({
            h: choice([randint(120, 190), randint(280, 360)]),
            s: rand(0.7, 0.99),
            l: 0.5,
          }),
          bold: Math.random() > 0.5,
          italic: false,
        },
        subtitle: {
          text: '',
          font: 'Open Sans',
          size: 15,
          color: '',
          bold: false,
          italic: false,
        },
        align: 'center',
      }
    },
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
          font: 'Open Sans',
          size: 15,
          color: '',
          bold: false,
          italic: false,
        },
        align: 'center',
      }
    },
    simpsons: function() {
      var partial = choice([{
        title: {
          text: 'SPRINGFIELD HISTORICAL SOCIETY',
          font: 'PT Serif',
        },
        subtitle: {
          text: 'WHERE THE DEAD COME ALIVE! (Metaphorically)',
          font: 'PT Sans',
          size: 21,
        }
      }, {
        title: {
          text: 'ANIMAL ASSISTANTS',
          font: 'Roboto Condensed',
          size: 50,
          color: '#4551E2',
          bold: true,
        },
        subtitle: {
          text: '"AS FELT IN BRAILLE WEEKLY"',
          font: 'Roboto',
          size: 33,
          italic: true,
        }
      }, {
        title: {
          text: 'PAY & PARK & PAY',
          font: 'Roboto Condensed',
          size: 60,
          color: '#5E67DC',
          bold: true,
        }
      }, {
        title: {
          text: 'SPRINGFIELD DOG TRACK',
          font: 'Roboto Condensed',
          size: 50,
          bold: true,
        },
        subtitle: {
          text: '"THINK OF THEM AS LITTLE HORSES"',
          font: 'Roboto Condensed',
          size: 35,
        }
      }, {
        title: {
          text: 'U.S. AIR FORCE BASE',
          font: 'Roboto Condensed',
          size: 50,
          bold: true,
          color: '#111111',
        },
        subtitle: {
          text: 'NOT AFFILIATED WITH U.S. AIR',
          font: 'Roboto Condensed',
          size: 24,
        }
      }])

      var result = {
        title: {
          text: '', font: 'Open Sans',
          size: 32, color: '#666666', bold: false, italic: false
        },
        subtitle: {
          text: '', font: 'Open Sans',
          size: 16, color: '#666666', bold: false, italic: false
        },
        align: 'center',
      }
      Object.assign(result.title, partial.title)
      Object.assign(result.subtitle, partial.subtitle)
      return result
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
      // todo: change later
      if (Math.random() <= 0.2) {
        return themes.simpsons()
      } else {
        return themes[Math.random() >= 0.5 ? 'florist' : 'sports']()
      }
    }
  }
}.call(window))

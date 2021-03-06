describe('Array', function () {
  var array

  it('parses a matrix array correctly to string', function() {
    array = new SVG.Array([ .343,  .669, .119, 0,   0
                          , .249, -.626, .130, 0,   0
                          , .172,  .334, .111, 0,   0
                          , .000,  .000, .000, 1,  -0 ])

    expect(array + '').toBe('0.343 0.669 0.119 0 0 0.249 -0.626 0.13 0 0 0.172 0.334 0.111 0 0 0 0 0 1 0')
  })
  describe('reverse()', function() {
    it('reverses the array', function() {
      array = new SVG.Array([1 ,2 ,3, 4, 5]).reverse()
      expect(array.value).toEqual([5, 4, 3, 2, 1])
    })
    it('returns itself', function() {
      array = new SVG.Array()
      expect(array.reverse()).toBe(array)
    })
  })
})


describe('PointArray', function () {
  it('parses a string to a point array', function() {
    var array = new SVG.PointArray('0,1 -.05,7.95 1000.0001,-200.222')

    expect(array.valueOf()).toEqual([[0, 1], [-0.05, 7.95], [1000.0001, -200.222]])
  })
  it('parses a points array correctly to string', function() {
    var array = new SVG.PointArray([[0,.15], [-100,-3.141592654], [50,100]])

    expect(array + '').toBe('0,0.15 -100,-3.141592654 50,100')
  })
  it('parses points with space delimitered x/y coordinates', function() {
    var array = new SVG.PointArray('221.08 191.79 0.46 191.79 0.46 63.92 63.8 0.46 284.46 0.46 284.46 128.37 221.08 191.79')

    expect(array + '').toBe('221.08,191.79 0.46,191.79 0.46,63.92 63.8,0.46 284.46,0.46 284.46,128.37 221.08,191.79')
  })
  it('parses points with redundant spaces at the end', function() {
    var array = new SVG.PointArray('2176.6,1708.8 2176.4,1755.8 2245.8,1801.5 2297,1787.8  ')

    expect(array + '').toBe('2176.6,1708.8 2176.4,1755.8 2245.8,1801.5 2297,1787.8')
  })
  it('parses points with space delimitered x/y coordinates - even with leading or trailing space', function() {
    var array = new SVG.PointArray('  1 2 3 4  ')

    expect(array + '').toBe('1,2 3,4')
  })
  it('parses odd number of points with space delimitered x/y coordinates and silently remove the odd point', function() {
    // this  is according to spec: https://svgwg.org/svg2-draft/shapes.html#DataTypePoints

    var array = new SVG.PointArray('1 2 3')

    expect(array + '').toBe('1,2')
  })
})

describe('PathArray', function () {
  var p1, p2, p3

  beforeEach(function() {
    p1 = new SVG.PathArray('m10 10 h 80 v 80 h -80 l 300 400 z')
    p2 = new SVG.PathArray('m10 80 c 40 10 65 10 95 80 s 150 150 180 80 t 300 300 q 52 10 95 80 z')
    p3 = new SVG.PathArray('m80 80 A 45 45, 0, 0, 0, 125 125 L 125 80 z')
    p4 = new SVG.PathArray('M215.458,245.23c0,0,77.403,0,94.274,0S405,216.451,405,138.054S329.581,15,287.9,15c-41.68,0-139.924,0-170.688,0C86.45,15,15,60.65,15,134.084c0,73.434,96.259,112.137,114.122,112.137C146.984,246.221,215.458,245.23,215.458,245.23z')

  })

  it('converts to absolute values', function() {
    expect(p1.toString()).toBe('M10 10H90V90H10L310 490Z ')
    expect(p2.toString()).toBe('M10 80C50 90 75 90 105 160S255 310 285 240T585 540Q637 550 680 620Z ')
    expect(p3.toString()).toBe('M80 80A45 45 0 0 0 125 125L125 80Z ')
    expect(p4.toString()).toBe('M215.458 245.23C215.458 245.23 292.861 245.23 309.73199999999997 245.23S405 216.451 405 138.054S329.581 15 287.9 15C246.21999999999997 15 147.97599999999997 15 117.21199999999999 15C86.45 15 15 60.65 15 134.084C15 207.518 111.259 246.221 129.122 246.221C146.984 246.221 215.458 245.23 215.458 245.23Z ')

  })

  describe('move()', function() {
    it('moves all points in a straight path', function() {
      expect(p1.move(100,200).toString()).toBe('M100 200H180V280H100L400 680Z ')
    })
    it('moves all points in a curved path', function() {
      expect(p2.move(100,200).toString()).toBe('M100 200C140 210 165 210 195 280S345 430 375 360T675 660Q727 670 770 740Z ')
    })
    it('moves all points in a arc path', function() {
      expect(p3.move(100,200).toString()).toBe('M100 200A45 45 0 0 0 145 245L145 200Z ')
    })
  })

  describe('size()', function() {
    it('resizes all points in a straight path', function() {
      expect(p1.size(600,200).toString()).toBe('M10 10H170V43.333333333333336H10L610 210Z ')
    })
    it('resizes all points in a curved path', function() {
      expect(p2.size(600,200).toString()).toBe('M10 80C45.82089552238806 83.70370370370371 68.2089552238806 83.70370370370371 95.07462686567165 109.62962962962963S229.40298507462686 165.1851851851852 256.2686567164179 139.25925925925927T524.9253731343283 250.37037037037038Q571.4925373134329 254.07407407407408 610 280Z ')
    })
    it('resizes all points in a arc path', function() {
      var expected = [
        ['M', 80, 80],
        ['A', 600, 200, 0, 0, 0, 680, 280],
        ['L', 680, 80],
        ['Z']
      ]

      var toBeTested = p3.size(600,200).value
      for(var i in toBeTested) {
        expect(toBeTested[i].shift().toUpperCase()).toBe(expected[i].shift().toUpperCase())
        for(var j in toBeTested[i]) {
          expect(toBeTested[i][j]).toBeCloseTo(expected[i][j])
        }
      }
    })
  })

  describe('equalCommands()', function() {
    it('return true if the passed path array use the same commands', function() {
      var pathArray1 = new SVG.PathArray('m -1500,-478 a 292,195 0 0 1 262,205 l -565,319 c 0,0 -134,-374 51,-251 185,122 251,-273 251,-273 z')
        , pathArray2 = new SVG.PathArray('m  -680, 527 a 292,195 0 0 1 262,205 l -565,319 c 0,0 -134,-374 51,-251 185,122 251,-273 251,-273 z')

      expect(pathArray1.equalCommands(pathArray2)).toBe(true)
    })
    it('return false if the passed path array does not use the same commands', function() {
      var pathArray1 = new SVG.PathArray('m -1500,-478 a 292,195 0 0 1 262,205   l -565,319 c 0,0 -134,-374 51,-251 185,122 251,-273 251,-273 z')
        , pathArray2 = new SVG.PathArray('m - 663, 521 c 147,178 118,-25 245,210 l -565,319 c 0,0 -134,-374 51,-251 185,122 268,-278 268,-278 z')

      expect(pathArray1.equalCommands(pathArray2)).toBe(false)
    })
  })

  describe('morph()', function() {
    it('should set the attribute destination to the passed path array when it have the same comands as this path array', function() {
      var pathArray1 = new SVG.PathArray('m -1500,-478 a 292,195 0 0 1 262,205 l -565,319 c 0,0 -134,-374 51,-251 185,122 251,-273 251,-273 z')
        , pathArray2 = new SVG.PathArray('m  -680, 527 a 292,195 0 0 1 262,205 l -565,319 c 0,0 -134,-374 51,-251 185,122 251,-273 251,-273 z')

      pathArray1.morph(pathArray2)
      expect(pathArray1.destination).toEqual(pathArray2)
    })
    it('should set the attribute destination to null when the passed path array does not have the same comands as this path array', function() {
      var pathArray1 = new SVG.PathArray('m -1500,-478 a 292,195 0 0 1 262,205   l -565,319 c 0,0 -134,-374 51,-251 185,122 251,-273 251,-273 z')
        , pathArray2 = new SVG.PathArray('m - 663, 521 c 147,178 118,-25 245,210 l -565,319 c 0,0 -134,-374 51,-251 185,122 268,-278 268,-278 z')

      pathArray1.morph(pathArray2)
      expect(pathArray1.destination).toBeNull()
    })
  })

  describe('at()', function() {
    it('returns a morphed path array at a given position', function() {
      var pathArray1 = new SVG.PathArray("M  63 25 A 15 15 0 0 1  73 40 A 15 15 0 0 1  61 53 C  49 36  50 59  50 59 L  33 55 Z")
        , pathArray2 = new SVG.PathArray("M 132 40 A 15 15 0 0 1 141 54 A 15 15 0 0 1 130 67 C 118 51 119 73 119 73 L 103 69 Z")
        , morphedPathArray = pathArray1.morph(pathArray2).at(0.5)
        , sourceArray = pathArray1.value, destinationArray = pathArray1.destination.value
        , morphedArray = morphedPathArray.value
        , i, il, j, jl

      expect(morphedArray.length).toBe(sourceArray.length)

      // For all the commands
      for(i = 0, il = sourceArray.length; i < il; i++) {
        // Expect the current command to be the same
        expect(morphedArray[i][0]).toBe(sourceArray[i][0])
        expect(morphedArray[i].length).toBe(sourceArray[i].length)

        // For all the parameters of the current command
        for(j = 1, jl = sourceArray[i].length; j < jl; j++) {
          expect(morphedArray[i][j]).toBe((sourceArray[i][j] + destinationArray[i][j]) / 2)
        }
      }
    })
    it('should interpolate flags and booleans as fractions between zero and one, with any non-zero value considered to be a value of one/true', function() {
      // Only the Elliptical arc command use flags, it has the following form:
      // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
      var pathArray1 = new SVG.PathArray('M  13 13 A 25 37 0 0 1  43 25')
        , pathArray2 = new SVG.PathArray('M 101 55 A 25 37 0 1 0 130 67')
        , morphedPathArray

      pathArray1.morph(pathArray2)

      // The morphedPathArray.value contain 2 commands: [['M', ...], ['A', ...]]
      // Elliptical arc command in a path array followed by corresponding indexes:
      // ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
      //   0    1   2        3                 4             5      6  7
      morphedPathArray = pathArray1.at(0)
      expect(morphedPathArray.value[1][4]).toBe(0)
      expect(morphedPathArray.value[1][5]).toBe(1)

      morphedPathArray = pathArray1.at(0.5)
      expect(morphedPathArray.value[1][4]).toBe(1)
      expect(morphedPathArray.value[1][5]).toBe(1)

      morphedPathArray = pathArray1.at(1)
      expect(morphedPathArray.value[1][4]).toBe(1)
      expect(morphedPathArray.value[1][5]).toBe(0)
    })
    it('return itself if the destination attribute is null', function(){
      var pathArray = new SVG.PathArray('M  13 13 A 25 37 0 0 1  43 25')
      pathArray.destination = null
      expect(pathArray.at(0.45)).toBe(pathArray)
    })
  })

})

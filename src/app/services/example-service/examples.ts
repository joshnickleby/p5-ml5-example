import {P5Sketch} from '../../shared/interfaces'
import {Runnable} from '../../shared/types'
import {P5Boid, P5Container, P5Flock, P5Liquid, P5Mover, P5Particle, P5ParticleSystem} from '../../shared/classes'
import {HorizAlign, LocationMode} from '../../shared/interfaces/p5/p5-sketch'
import {π, τ} from '../../shared/constants/p5.constants'

// example object called by the example service
export const examples = {
  basic: {
    main: {
      name: 'Basic',
      buttons: [
        {link: ['basic', 'circle'], icon: 'new', name: 'Circle'},
        {link: ['basic', 'mouseMoveCircle'], icon: 'new', name: 'Mouse Move Circle'}
      ]
    },
    circle: () => new P5Container((s: P5Sketch) => {
      s.setup = setupBasic(s, 'Circle')
      s.draw = () => {
        s.background(200)
        s.ellipse(50, 50, 80, 80)
      }
    }, 'example-display'),
    mouseMoveCircle: () => new P5Container((s: P5Sketch) => {
      s.setup = setupBasic(s, 'Mouse Move Circle')
      s.draw = () => {
        s.fill(s.mouseIsPressed ? 0 : 255)
        s.ellipse(s.mouseX, s.mouseY, 80, 80)
      }
    }, 'example-display')
  },
  structure: {
    main: {
      name: 'Structure',
      buttons: [
        {link: ['structure', 'coordinates'], icon: 'new', name: 'Coordinates'},
        {link: ['structure', 'widthAndHeight'], icon: 'new', name: 'Width & Height'},
        {link: ['structure', 'setupAndDraw'], icon: 'new', name: 'Setup & Draw'},
        {link: ['structure', 'noLoop'], icon: 'new', name: 'No Loop'},
        {link: ['structure', 'loop'], icon: 'new', name: 'Loop'},
        {link: ['structure', 'redraw'], icon: 'new', name: 'Redraw'},
        {link: ['structure', 'functions'], icon: 'new', name: 'Functions'},
        {link: ['structure', 'recursion'], icon: 'new', name: 'Recursion'},
        {link: ['structure', 'createGraphics'], icon: 'new', name: 'Create Graphics'}
      ]
    },
    coordinates: () => new P5Container((s: P5Sketch) => {
      s.setup = () => setupStructure(s, 'Coordinates')

      s.draw = () => {
        const {width, height} = s

        s.background(0)
        s.noFill()

        s.stroke(255)
        s.strokeWeight(5)
        s.point(width * 0.5, height * 0.5)
        s.point(width * 0.5, height * 0.25)

        s.strokeWeight(1)
        s.stroke(0, 153, 255)
        s.line(0, height * 0.33, width, height * 0.33)

        s.stroke(255, 153, 0)
        s.rect(width * 0.25, height * 0.1, width * 0.5, height * 0.8)
      }

    }, 'example-display'),
    widthAndHeight: () => new P5Container((s: P5Sketch) => {
      s.setup = () => setupStructure(s, 'Width & Height')

      s.draw = () => {
        s.background(127)
        s.noStroke()

        for (let i = 0; i < s.height; i += 20) {
          s.fill(129, 206, 15)
          s.rect(0, i, s.width, 10)
          s.fill(255)
          s.rect(i, 0, 10, s.height)
        }
      }
    }, 'example-display'),
    setupAndDraw: () => new P5Container((s: P5Sketch) => {
      let y = 100

      s.setup = () => {
        setupStructure(s, 'Setup & Draw')
        s.stroke(255)
        s.frameRate(30)
      }

      s.draw = () => {
        y = createStructureLine(s, y)
      }
    }, 'example-display'),
    noLoop: () => new P5Container((s: P5Sketch) => {
      let y

      s.setup = () => {
        setupStructure(s, 'No Loop')
        s.stroke(255)
        s.noLoop()

        y = s.height * 0.5
      }

      s.draw = () => createStructureLine(s, y)
    }, 'example-display'),
    loop: () => new P5Container((s: P5Sketch) => {
      let y = 100

      s.setup = () => {
        setupStructure(s, 'Loop')
        s.stroke(255)
        s.frameRate(30)
      }

      s.draw = () => {
        y = createStructureLine(s, y)
      }
    }, 'example-display'),
    redraw: () => new P5Container((s: P5Sketch) => {
      let y

      s.setup = () => {
        setupStructure(s, 'Redraw')
        s.stroke(255)
        s.noLoop()
        y = s.height * 0.5
      }

      s.draw = () => {
        y = createStructureLine(s, y, 4)
      }

      s.mousePressed = () => {
        s.redraw(8)
      }
    }, 'example-display'),
    functions: () => new P5Container((s: P5Sketch) => {
      s.setup = () => {
        setupStructure(s, 'Functions')
        s.background(51)
        s.noStroke()
        s.noLoop()
      }

      s.draw = () => {
        const {width, height} = s

        drawTarget(width * 0.25, height * 0.4, 200, 4)
        drawTarget(width * 0.5, height * 0.5, 300, 10)
        drawTarget(width * 0.75, height * 0.3, 120, 6)
      }

      const drawTarget = (x, y, size, num) => {
        const grayValues = 255 / num
        const steps = size / num
        for (let i = 0; i < num; i++) {
          s.fill(i * grayValues)

          const wh = size - i * steps

          s.ellipse(x, y, wh, wh)
        }
      }
    }, 'example-display'),
    recursion: () => new P5Container((s: P5Sketch) => {
      s.setup = () => {
        s.createCanvas(720, 560)
        s.noStroke()
        s.noLoop()
      }

      s.draw = () => drawCircle(s.width / 2, 280, 6)

      const drawCircle = (x, radius, level) => {
        const tt = (126 * level) / 4.0
        const doubleR = radius * 2
        const halfR = radius / 2

        s.fill(tt)
        s.ellipse(x, s.height / 2, doubleR, doubleR)
        if (level > 1) {
          level -= 1
          drawCircle(x - halfR, halfR, level)
          drawCircle(x + halfR, halfR, level)
        }
      }
    }, 'example-display'),
    createGraphics: () => new P5Container((s: P5Sketch) => {
      let pg: P5Sketch

      s.setup = () => {
        s.createCanvas(710, 400)
        pg = s.createGraphics(400, 250)
      }

      s.draw = () => {
        const {mouseX, mouseY} = s

        const wh = 60

        s.fill(0, 12)
        s.rect(0, 0, s.width, s.height)
        s.fill(255)
        s.noStroke()
        s.ellipse(mouseX, mouseY, wh, wh)

        pg.background(51)
        pg.noFill()
        pg.stroke(255)
        pg.ellipse(mouseX - 150, mouseY - 75, wh, wh)

        s.image(pg, 150, 75)
      }
    }, 'example-display')
  },
  simulate: {
    main: {
      name: 'Simulate',
      buttons: [
        {link: ['simulate', 'forces'], icon: 'new', name: 'Forces'},
        {link: ['simulate', 'particleSystem'], icon: 'new', name: 'Particle System'},
        {link: ['simulate', 'flock'], icon: 'new', name: 'Flock'},
        {link: ['simulate', 'wolframCA'], icon: 'new', name: 'Wolfram CA'},
        {link: ['simulate', 'gameOfLife'], icon: 'new', name: 'Game of Life'},
        {link: ['simulate', 'multipleParticleSystems'], icon: 'new', name: 'Multiple Particle Systems'},
        {link: ['simulate', 'spirograph'], icon: 'new', name: 'Spirograph'},
        {link: ['simulate', 'lSystems'], icon: 'new', name: 'L-Systems'},
        {link: ['simulate', 'spring'], icon: 'new', name: 'Spring'},
        {link: ['simulate', 'recursiveTree'], icon: 'new', name: 'Recursive Tree'},
        {link: ['simulate', 'mandelbrotSet'], icon: 'new', name: 'The Mandelbrot Set'},
        {link: ['simulate', 'particles'], icon: 'new', name: 'Particles'}
      ]
    },
    forces: () => new P5Container((s: P5Sketch) => {
      const movers = []

      let liquid

      s.setup = () => {
        setupCanvas(s, 'Forces', 640, 360)
        s.createCanvas(640, 360)
        s.reset()
        liquid = new P5Liquid(s, 0, s.height / 2, s.width, s.height / 2, 0.1)
        console.groupCollapsed('new liquid')
        console.log(liquid)
        console.groupEnd()
      }

      s.draw = () => {
        s.background(127)

        liquid.display()

        movers.forEach(mover => {
          if (liquid.contains(mover)) {
            const dragForce = liquid.calculateDrag(mover)

            mover.applyForce(dragForce)
          }

          const gravity = s.createVector(0, 0.1 * mover.mass)

          mover.applyForce(gravity)

          mover.update()
          mover.display()
          mover.checkEdges()
        })
      }

      s.mousePressed = () => s.reset()

      s.reset = () => {
        for (let i = 0; i < 9; i++) {
          movers[i] = new P5Mover(s, s.random(0.5, 3), 40 + i * 70, 0)
        }
        console.groupCollapsed('movers')
        console.log(movers)
        console.groupEnd()
      }

    }, 'example-display'),
    particleSystem: () => new P5Container((s: P5Sketch) => {
      let system: P5ParticleSystem

      s.setup = () => {
        setupCanvas(s, 'Particle System', 720, 400)
        system = new P5ParticleSystem(s, s.createVector(s.width / 2, 50))
      }

      s.draw = () => {
        s.background(51)
        system.addParticle()
        system.run()
      }
    }, 'example-display'),
    flock: () => new P5Container((s: P5Sketch) => {
      let flock: P5Flock

      s.setup = () => {
        setupCanvas(s, 'Flock', 640, 360)

        s.createP('Drag the mouse to generate new boids.')

        flock = new P5Flock()

        for (let i = 0; i < 100; i++) {
          const b = new P5Boid(s, s.width / 2, s.height / 2)
          flock.addBoid(b)
        }
      }

      s.draw = () => {
        s.background(51)
        flock.run()
      }

      s.mouseDragged = () => {
        flock.addBoid(new P5Boid(s, s.mouseX, s.mouseY))
      }
    }, 'example-display'),
    wolframCA: () => new P5Container((s: P5Sketch) => {
      const w = 10

      // an array of 1s and 0s
      let cells: number[]

      // we arbitrarily start with just the middle cell having a state of "1"
      let generation = 0

      // an array to store the ruleset, for example {0,1,1,0,1,1,0,1}
      const ruleset = [0, 1, 0, 1, 1, 0, 1, 0]

      s.setup = () => {
        setupCanvas(s, 'Wolfram CA', 640, 400)

        cells = Array(s.floor(s.width / w))

        for (let i = 0; i < cells.length; i++) {
          cells[i] = 0
        }

        cells[cells.length / 2] = 1
      }

      s.draw = () => {
        cells.forEach((cell, i) => {
          if (cell === 1) {
            s.fill(200)
          } else {
            s.fill(51)
            s.noStroke()
            s.rect(i * w, generation * w, w, w)
          }
        })

        if (generation < s.height / w) {
          generate()
        }
      }

      const generate = () => {
        // first create an empty array for the new values
        const nextGen = Array(cells.length)

        // for every spot, determine new state by examining the current state and neighbor states
        // ignore edges that only have one neighbor
        for (let i = 1; i < cells.length - 1; i++) {
          const left = cells[i - 1]    // left neighbor state
          const current = cells[i]        // current state
          const right = cells[i + 1]    // right neighbor state

          nextGen[i] = rules(left, current, right)  // compute the next generation state based on ruleset
        }

        // the current generation is the new generation
        cells = nextGen
        generation++
      }

      const rules = (a: number, b: number, c: number) => {
        const boolCheck = (ea: number, eb: number, ec: number) => a === ea && b === eb && c === ec

        return boolCheck(1, 1, 1) ? ruleset[0] :
          boolCheck(1, 1, 0) ? ruleset[1] :
            boolCheck(1, 0, 1) ? ruleset[2] :
              boolCheck(1, 0, 0) ? ruleset[3] :
                boolCheck(0, 1, 1) ? ruleset[4] :
                  boolCheck(0, 1, 0) ? ruleset[5] :
                    boolCheck(0, 0, 1) ? ruleset[6] :
                      boolCheck(0, 0, 0) ? ruleset[7] : 0
      }
    }, 'example-display'),
    gameOfLife: () => new P5Container((s: P5Sketch) => {
      let w
      let columns
      let rows
      let board
      let next

      s.setup = () => {
        setupCanvas(s, 'Game of Life', 720, 400)
        w = 20

        columns = s.floor(s.width / w)
        rows = s.floor(s.height / w)

        board = new Array(columns)

        for (let i = 0; i < columns; i++) {
          board[i] = new Array(rows)
        }

        // going to use multiple 2D arrays and swap them
        next = new Array(columns)
        for (let i = 0; i < columns; i++) {
          next[i] = new Array(rows)
        }

        init()
      }

      s.draw = () => {
        s.background(255)
        generate()

        for (let i = 0; i < columns; i++) {
          for (let j = 0; j < rows; j++) {
            const position = board[i][j]

            s.fill(position === 1 ? 0 : 255)

            s.stroke(0)
            s.rect(i * w, j * w, w - 1, w - 1)
          }
        }
      }

      s.mousePressed = () => {
        init()
      }

      // fill board randomly
      const init = () => {
        for (let i = 0; i < columns; i++) {
          for (let j = 0; j < rows; j++) {
            // line the edges with 0s else fill it randomly
            board[i][j] = (i * j === 0 || i === columns - 1 || j === rows - 1) ? 0 : s.floor(s.random(2))

            next[i][j] = 0
          }
        }
      }

      // the process of creating the new generation
      const generate = () => {
        // loop through every spot in our 2D array and check spots neighbors
        for (let x = 1; x < columns - 1; x++) {
          for (let y = 1; y < rows - 1; y++) {
            // add up all the states in a 3x3 surrounding grid
            let neighbors = 0

            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                neighbors += board[x + i][y + j]
              }
            }

            // a little trick to subtract the current cell's state since we added it in the above loop
            neighbors -= board[x][y]

            // rules of life
            const position = board[x][y]

            // loneliness | overpopulation | reproduction | statis
            next[x][y] = (position === 1 && neighbors < 2) ? 0 :
              (position === 1 && neighbors > 3) ? 0 :
                (position === 0 && neighbors === 3) ? 1 : board[x][y]
          }
        }

        // swap
        const temp = board
        board = next
        next = temp
      }

    }, 'example-display'),
    multipleParticleSystems: () => new P5Container((s: P5Sketch) => {
      const systems: P5ParticleSystem[] = []

      s.setup = () => {
        setupCanvas(s, 'Multiple Particle Systems', 710, 400)
      }

      s.draw = () => {
        s.background(51)
        s.background(0)

        systems.forEach(system => {
          system.run()
          system.addParticle(false)
        })

        if (systems.length === 0) {
          s.fill(255)
          s.textAlign(HorizAlign.CENTER)
          s.textSize(32)

          s.text('click mouse to add particle systems', s.width / 2, s.height / 2)
        }
      }

      s.mousePressed = () => {
        const p = new P5ParticleSystem(s, s.createVector(s.mouseX, s.mouseY))
        systems.push(p)
      }
    }, 'example-display'),
    spirograph: () => new P5Container((s: P5Sketch) => {
      const numberOfSines = 100
      const sines = new Array(numberOfSines)
      let centralRad

      // play with these to get a sense of what's going on:
      const fund = 0.005    // the speed of the central sine
      const ratio = 1       // what multiplier for speed is each additional sine?
      const alpha = 50      // how opaque is the tracing system

      let trace = false

      s.setup = () => {
        setupCanvas(s, 'Spirograph', 710, 400)

        centralRad = s.height / 4
        s.background(204)

        for (let i = 0; i < sines.length; i++) {
          sines[i] = π // start everyone facing north
        }
      }

      s.draw = () => {
        if (!trace) {
          s.background(204)     // clear screen if showing geometry
          s.stroke(0, 255)      // black pen
          s.noFill()
        }

        // main action
        s.push()      // start the transformation matrix
        s.translate(s.width / 2, s.height / 2)    // move to the middle of the screen

        sines.forEach((sine, i) => {
          let eRad = 0    // radius for small "point" within circle... this is the 'pen' when tracing
          // setup for tracing
          if (trace) {
            s.stroke(0, 0, 255 * (s.float(i) / sines.length), alpha)    // blue
            s.fill(0, 0, 255, alpha / 2)
            eRad = 5.0 * (1.0 - s.float(i) / sines.length)  // pen relates to the sign size
          }

          const radius = centralRad / (i + 1)
          s.rotate(sine)

          if (!trace) {
            s.ellipse(0, 0, radius * 2, radius * 2)
          }

          s.push() // go up one level
          s.translate(0, radius) // move to sine edge

          if (!trace) {
            s.ellipse(0, 0, 5, 5)
          }

          if (trace) {
            s.ellipse(0, 0, eRad, eRad)
          }

          s.pop() // go down one level
          s.translate(0, radius) // move into position for next sine

          sines[i] = (sine + (fund + (fund * i * ratio))) % τ   // update angle based on fundamental
        })

        s.pop()   // pop down final transformation
      }

      s.keyReleased = () => {
        if (s.key === ' ') {
          trace = !trace
          s.background(255)
        }
      }

    }, 'example-display'),
    lSystems: () => new P5Container((s: P5Sketch) => {
      // TURTLE STUFF
      let x                 // turtle x position
      let y                 // turtle y position
      let currentAngle = 0  // which way turtle is pointed
      const step = 20       // how much the turtle moves with each 'F'
      const angle = 90      // how much the turtle turns with a '-' or '+'

      // LINDENMAYER STUFF (L-SYSTEMS)
      let theString = 'A'   // "axiom" or start of the string
      const numLoops = 5    // how many iterations to pre-compute
      const rules = [
        ['A', '-BF+AFA+FB-'],
        ['B', '+AF-BFB-FA+']
      ]

      let whereInString = 0 // where in the L-system are we?

      s.setup = () => {
        setupCanvas(s, 'L-Systems', 710, 400)
        s.background(255)
        s.stroke(0, 0, 0, 255)

        // start the x and y position at lower-left corner
        x = 0
        y = s.height - 1

        // compute the L-system
        for (let i = 0; i < numLoops; i++) {
          theString = lindenMayer(theString)
        }
      }

      s.draw = () => {
        // draw the current character in the string
        drawTurtle(theString[whereInString])

        // increment the point for where we're reading the string
        // wrap around at the end
        whereInString++
        if (whereInString > theString.length - 1) {
          whereInString = 0
        }
      }

      const lindenMayer = (str: string) => {
        let outputString = ''

        for (const char of str) {
          let isMatch = 0

          for (const rule of rules) {
            if (char === rule[0]) {
              outputString += rule[1]       // write substitution
              isMatch = 1                   // we have a match, so don't copy over the symbol
              break
            }
          }

          // if nothing matches, just copy the symbol over
          if (isMatch === 0) {
            outputString += char
          }
        }

        return outputString
      }

      const drawTurtle = (key: string) => {
        // F = forward | + = left | - = right
        if (key === 'F') {
          // polar to cartesian based on step and current angle
          const x1 = x + step * s.cos(s.radians(currentAngle))
          const y1 = y + step * s.sin(s.radians(currentAngle))
          s.line(x, y, x1, y1)

          // update turtle's position
          x = x1
          y = y1
        } else if (key === '+') {
          currentAngle += angle
        } else if (key === '-') {
          currentAngle -= angle
        }

        // give me some random color values
        const r = s.random(128, 255)
        const g = s.random(0, 192)
        const b = s.random(0, 50)
        const a = s.random(50, 100)

        // pick a gaussian (D&D) distribution for the radius
        const radius = (s.random(0, 15) + s.random(0, 15) + s.random(0, 15)) / 3

        // draw the stuff
        s.fill(r, g, b, a)
        s.ellipse(x, y, radius, radius)
      }
    }, 'example-display'),
    spring: () => new P5Container((s: P5Sketch) => {
      const springHeight = 32
      const maxHeight = 200
      const minHeight = 100

      let left
      let right

      let over = false
      let move = false

      const mass = 0.8
      const constant = 0.2
      const damping = 0.92
      const rest = 150

      let position = rest
      let velocity = 0.0
      let acceleration = 0
      let force = 0

      s.setup = () => {
        setupCanvas(s, 'Spring', 710, 400)
        s.rectMode(LocationMode.CORNERS)
        s.noStroke()

        console.log(s.width)

        left = s.width / 2 - 100
        right = s.width / 2 + 100
      }

      s.draw = () => {
        s.background(102)
        updateSpring()
        drawSpring()
      }

      s.mousePressed = () => {
        if (over) {
          move = true
        }
      }

      s.mouseReleased = () => {
        move = false
      }

      const drawSpring = () => {
        const positionAndHeight = position + springHeight

        // draw base
        s.fill(0.2)
        const baseWidth = 0.5 * position - 8
        s.rect(s.width / 2 - baseWidth, positionAndHeight, s.width / 2 + baseWidth, s.height)

        // set color and draw top bar
        const sub = (over || move) as unknown as number * 51

        s.fill(255 - sub)

        s.rect(left, position, right, positionAndHeight)
      }

      const updateSpring = () => {
        if (!move) {
          force = -constant * (position - rest)   // f=-ky
          acceleration = force / mass                    // f=ma == a=f/m
          velocity = damping * (velocity + acceleration)
          position += velocity
        }

        if (s.abs(velocity) < 0.1) {
          velocity = 0.0
        }

        // test if mouse if over the top bar
        over = s.mouseX > left && s.mouseX < right && s.mouseY > position && s.mouseY < position + springHeight

        // set and constrain the position of top bar
        if (move) {
          position = s.mouseY - springHeight / 2
          position = s.constrain(position, minHeight, maxHeight)
        }
      }

    }, 'example-display'),
    recursiveTree: () => new P5Container((s: P5Sketch) => {
      let theta: number

      s.setup = () => setupCanvas(s, 'Recursive Tree', 710, 400)

      s.draw = () => {
        s.background(0)
        s.frameRate(30)
        s.stroke(255)

        // let's pick an angle - to 90 degrees based on the mouse position
        const a = (s.mouseX / s.width) * 90
        // convert it to radians
        theta = s.radians(a)
        // start the tree from the bottom of the screen
        s.translate(s.width / 2, s.height)
        // draw a line 120 pixels
        s.line(0, 0, 0, -120)
        // move to the end of that line
        s.translate(0, -120)
        // start the recursion
        branch(120)
      }

      const branch = (h: number) => {
        // each branch will be 2/3rds the size of the previous one
        h *= 0.66

        const buildBranch = (t: number) => {
          s.push()                          // save the current state of transformation
          s.rotate(t)
          s.line(0, 0, 0, -h)   // draw branch
          s.translate(0, -h)                // move to the end of the branch
          branch(h)                         // recursive call 2 more branches
          s.pop()                           // returns up the stack
        }

        // all recursive functions must have an exit condition!!
        // here, ours is when the length of the branch is 2 pixels or less
        if (h > 2) {
          // right branch
          buildBranch(theta)
          // left branch
          buildBranch(-theta)
        }
      }
    }, 'example-display'),
    mandelbrotSet: () => new P5Container((s: P5Sketch) => {

      s.setup = () => {
        setupCanvas(s, 'The Mandelbrot Set', 710, 400)
        s.pixelDensity(1)
        s.noLoop()
      }

      s.draw = () => {
        s.background(0)

        // establish a range of values on the complex plane
        // a different range will allow us to "zoom" in our out on the fractal

        // it all starts with the width, try higher or lower values
        const w = 4
        const h = (w * s.height) / s.width

        // start at negative half the width and height
        const xMin = -w / 2
        const yMin = -h / 2

        // make sure we can write to the pixels[] array
        // only need to do this once since we don't do any other drawing
        s.loadPixels()

        // maximum number of iterations for each point on the complex plane
        const maxIterations = 100

        // x goes from xMin to xMax
        const xMax = xMin + w
        // w goes from yMin to yMax
        const yMax = yMin + h

        // calculate amount we increment x, y for each pixel
        const dx = (xMax - xMin) / s.width
        const dy = (yMax - yMin) / s.height

        // start y
        let y = yMin
        for (let j = 0; j < s.width; j++) {
          // start x
          let x = xMin
          for (let i = 0; i < s.width; i++) {
            // now we test, as we iterate z = z^2 + cm does z tend towards i
            let a = x
            let b = y
            let n = 0

            while (n < maxIterations) {
              const aa = a * a
              const bb = b * b
              const twoAB = 2.0 * a * b
              a = aa - bb + x
              b = twoAB + y

              // bail function
              if (s.dist(aa, bb, 0, 0) > 16) {
                break;
              }

              n++
            }

            // we color each pixel based on how long it takes to get to infinity
            // if we never got there, let's pick the color black
            const pix: number = (i + j * s.width) * 4
            const norm = s.map(n, 0, maxIterations, 0, 1)
            let bright = s.map(s.sqrt(norm), 0, 1, 0, 255)

            if (n === maxIterations) {
              bright = 0
            } else {
              s.pixels[pix] = bright
              s.pixels[pix + 1] = bright
              s.pixels[pix + 2] = bright
              s.pixels[pix + 3] = 255
            }

            x += dx
          }

          y += dy
        }

        s.updatePixels()
      }
    }, 'example-display'),
    particles: () => new P5Container((s: P5Sketch) => {
      const particles: P5Particle[] = []

      s.setup = () => {
        s.createCanvas(720, 400)

        for (let i = 0; i < s.width / 10; i++) {
          const options = {
            position: s.createVector(s.random(0, s.width), s.random(0, s.height)),
            radii: s.random(1, 8),
            speed: s.createVector(s.random(-2, 2), s.random(-1, 1.5)),
            fill: 'rgba(200,169,169,0.5)'
          }

          particles.push(new P5Particle(s, options))
        }
      }

      s.draw = () => {
        s.background('#0f0f0f')
        particles.forEach((particle, i) => {
          particle.display()
          particle.move()
          particle.joinParticles(particles.slice(i))
        })
      }

    }, 'example-display'),
    template: () => new P5Container((s: P5Sketch) => {

    }, 'example-display')
  }
}


function setupBasic(s: P5Sketch, title: string): Runnable {
  return () => {
    s.createElement('h3', title)
    s.createCanvas(400, 400)
  }
}

function setupStructure(s: P5Sketch, title: string) {
  s.createElement('h3', title)
  s.createCanvas(720, 400)
}

function setupCanvas(s: P5Sketch, title: string, width: number, height: number) {
  s.createElement('h3', title)
  s.createCanvas(width, height)
}

function createStructureLine(s: P5Sketch, y: number, decrease: number = 1): number {
  s.background(0)

  y -= decrease

  if (y < 0) {
    y = s.height
  }

  s.line(0, y, s.width, y)

  return y
}

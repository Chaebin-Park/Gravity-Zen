import { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import './App.css'

const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Common, Body, Events } = Matter

type InteractionMode = 'spawn' | 'explode' | 'magnet'

function App() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef(Engine.create({ enableSleeping: false }))
  
  const [gravity, setGravity] = useState(1)
  const [shapeType, setShapeType] = useState<'circle' | 'rectangle' | 'random'>('random')
  const [mode, setMode] = useState<InteractionMode>('spawn')
  
  const shapeTypeRef = useRef(shapeType)
  const modeRef = useRef(mode)
  const mousePosRef = useRef({ x: 0, y: 0 })
  const isMouseDownRef = useRef(false)

  useEffect(() => {
    shapeTypeRef.current = shapeType
    modeRef.current = mode
  }, [shapeType, mode])

  useEffect(() => {
    if (!sceneRef.current) return

    const cw = window.innerWidth
    const ch = window.innerHeight

    const render = Render.create({
      element: sceneRef.current,
      engine: engineRef.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio,
      }
    })

    // 벽 생성 (더 두껍게)
    const thickness = 100
    const walls = [
      Bodies.rectangle(cw / 2, ch + thickness / 2, cw * 2, thickness, { isStatic: true, render: { fillStyle: '#1e293b' } }),
      Bodies.rectangle(-thickness / 2, ch / 2, thickness, ch * 2, { isStatic: true, render: { fillStyle: '#1e293b' } }),
      Bodies.rectangle(cw + thickness / 2, ch / 2, thickness, ch * 2, { isStatic: true, render: { fillStyle: '#1e293b' } }),
      Bodies.rectangle(cw / 2, -thickness / 2, cw * 2, thickness, { isStatic: true, render: { fillStyle: '#1e293b' } })
    ]
    Composite.add(engineRef.current.world, walls)

    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engineRef.current, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    })
    Composite.add(engineRef.current.world, mouseConstraint)
    render.mouse = mouse

    // 자석 효과를 위한 매 프레임 업데이트 이벤트
    Events.on(engineRef.current, 'beforeUpdate', () => {
      if (modeRef.current === 'magnet' && isMouseDownRef.current) {
        const bodies = Composite.allBodies(engineRef.current.world)
        bodies.forEach(body => {
          if (!body.isStatic) {
            const forceMagnitude = 0.005 * body.mass
            const dx = mousePosRef.current.x - body.position.x
            const dy = mousePosRef.current.y - body.position.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const force = {
              x: (dx / distance) * forceMagnitude,
              y: (dy / distance) * forceMagnitude
            }
            Body.applyForce(body, body.position, force)
          }
        })
      }
    })

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDownRef.current = true
      mousePosRef.current = { x: e.clientX, y: e.clientY }

      if (mouseConstraint.body) return

      const x = e.clientX
      const y = e.clientY

      if (modeRef.current === 'spawn') {
        const size = Common.random(20, 45)
        const colors = ['#00d2ff', '#9d50bb', '#ff4757', '#2ed573', '#eccc68', '#70a1ff']
        const color = Common.choose(colors)
        const currentType = shapeTypeRef.current === 'random' ? (Math.random() > 0.5 ? 'circle' : 'rectangle') : shapeTypeRef.current

        const body = currentType === 'circle' 
          ? Bodies.circle(x, y, size, { restitution: 0.7, render: { fillStyle: color, strokeStyle: 'white', lineWidth: 1 } })
          : Bodies.rectangle(x, y, size * 1.8, size * 1.8, { restitution: 0.5, render: { fillStyle: color, strokeStyle: 'white', lineWidth: 1 } })
        
        Composite.add(engineRef.current.world, body)
      } else if (modeRef.current === 'explode') {
        // 폭발 효과
        const bodies = Composite.allBodies(engineRef.current.world)
        bodies.forEach(body => {
          if (!body.isStatic) {
            const dx = body.position.x - x
            const dy = body.position.y - y
            const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1)
            const forceMagnitude = (1000 / (distance * distance)) * body.mass
            Body.applyForce(body, body.position, {
              x: (dx / distance) * forceMagnitude,
              y: (dy / distance) * forceMagnitude
            })
          }
        })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseUp = () => {
      isMouseDownRef.current = false
    }

    render.canvas.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    Render.run(render)
    const runner = Runner.create()
    Runner.run(runner, engineRef.current)

    return () => {
      Render.stop(render)
      Runner.stop(runner)
      Engine.clear(engineRef.current)
      render.canvas.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      render.canvas.remove()
    }
  }, [])

  useEffect(() => {
    engineRef.current.gravity.y = gravity
    const allBodies = Composite.allBodies(engineRef.current.world)
    allBodies.forEach(body => {
      if (!body.isStatic) {
        body.isSleeping = false
        body.frictionAir = gravity === 0 ? 0.01 : 0.05
      }
    })
  }, [gravity])

  return (
    <div className="canvas-container" ref={sceneRef}>
      <div className="ui-overlay">
        <h1>Gravity Zen Garden</h1>
        <div className="status-pills">
          <span className="pill">Mode: {mode.toUpperCase()}</span>
          <span className="pill">Gravity: {gravity === 0 ? 'ZERO' : gravity > 0 ? 'NORMAL' : 'INVERTED'}</span>
        </div>
      </div>

      <div className="controls vertical-controls">
        <div className="control-group">
          <label>Interactions</label>
          <button className={mode === 'spawn' ? 'active' : ''} onClick={() => setMode('spawn')}>Spawn ✨</button>
          <button className={mode === 'explode' ? 'active' : ''} onClick={() => setMode('explode')}>Explode 💥</button>
          <button className={mode === 'magnet' ? 'active' : ''} onClick={() => setMode('magnet')}>Magnet 🧲</button>
        </div>

        <div className="control-group">
          <label>Shapes</label>
          <button className={shapeType === 'circle' ? 'active' : ''} onClick={() => setShapeType('circle')}>Circle</button>
          <button className={shapeType === 'rectangle' ? 'active' : ''} onClick={() => setShapeType('rectangle')}>Box</button>
          <button className={shapeType === 'random' ? 'active' : ''} onClick={() => setShapeType('random')}>Mixed</button>
        </div>

        <div className="control-group">
          <label>Physics</label>
          <button className={gravity === 0 ? 'active' : ''} onClick={() => setGravity(prev => prev === 0 ? 1 : 0)}>Zero G</button>
          <button className={gravity === -1 ? 'active' : ''} onClick={() => setGravity(prev => prev === -1 ? 1 : -1)}>Invert G</button>
          <button onClick={() => Composite.remove(engineRef.current.world, Composite.allBodies(engineRef.current.world).filter(b => !b.isStatic))} style={{ color: '#ff4757' }}>Clear All</button>
        </div>
      </div>
    </div>
  )
}

export default App

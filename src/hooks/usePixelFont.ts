import { useEffect } from 'react'

// ─── Pixel font bitmap (5×7) ─────────────────────────────────────────────────
const PIXEL_FONT: Record<string, number[][]> = {
  P: [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0]],
  R: [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,1,0,0],[1,0,0,1,0],[1,0,0,0,1]],
  I: [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,1]],
  Y: [[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  A: [[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
  T: [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  N: [[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
}

const PALETTES = [
  { name: 'RED',    color: '#ff3b00', glow: 'rgba(255,59,0,0.6)' },
  { name: 'BLUE',   color: '#0047ff', glow: 'rgba(0,71,255,0.6)' },
  { name: 'GREEN',  color: '#00c853', glow: 'rgba(0,200,83,0.6)' },
  { name: 'YELLOW', color: '#ffd600', glow: 'rgba(255,214,0,0.6)' },
  { name: 'PURPLE', color: '#a855f7', glow: 'rgba(168,85,247,0.6)' },
  { name: 'PAPER',  color: '#f5f2ec', glow: 'rgba(245,242,236,0.5)' },
]

const RAIN_COLORS = ['#ff3b00', '#0047ff', '#00c853', '#ffd600', '#a855f7']
const LETTERS = ['P', 'R', 'I', 'Y', 'A', 'T', 'N', 'A']

interface RainCol {
  x: number; y: number; speed: number
  color: string; opacity: number; len: number
}

export function usePixelFont(
  paletteId: string,
  wordId: string,
  canvasId: string
) {
  useEffect(() => {
    let activeColor = PALETTES[0]
    let animId: number

    function spawnParticles(x: number, y: number, count: number) {
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div')
        p.className = 'particle'
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
        const dist  = 40 + Math.random() * 80
        p.style.left = (x - 4) + 'px'
        p.style.top  = (y - 4) + 'px'
        p.style.background = activeColor.color
        p.style.setProperty('--dx', (Math.cos(angle) * dist) + 'px')
        p.style.setProperty('--dy', (Math.sin(angle) * dist) + 'px')
        p.style.animationDuration = (0.5 + Math.random() * 0.4) + 's'
        document.body.appendChild(p)
        p.addEventListener('animationend', () => p.remove())
      }
    }

    function scatterColumn(inner: HTMLElement) {
      const blocks = inner.querySelectorAll('.px-block')
      blocks.forEach(b => {
        const el = b as HTMLElement
        el.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1), opacity 0.4s ease'
        el.style.transform  = `translate(${(Math.random()-.5)*120}px,${(Math.random()-.5)*80-20}px) rotate(${(Math.random()-.5)*360}deg) scale(0)`
        el.style.opacity    = '0'
      })
      setTimeout(() => {
        blocks.forEach((b, i) => {
          const el = b as HTMLElement
          el.style.transition = `transform 0.5s ${i * 0.008}s cubic-bezier(0.23,1,0.32,1), opacity 0.3s ${i * 0.008}s ease`
          el.style.transform  = ''
          el.style.opacity    = '1'
        })
      }, 480)
    }

    // ── palette ──
    const paletteRow = document.getElementById(paletteId)
    if (paletteRow) {
      paletteRow.innerHTML = ''
      PALETTES.forEach((pal, i) => {
        const sw = document.createElement('div')
        sw.className = `pal-swatch${i === 0 ? ' active' : ''}`
        sw.style.background = pal.color
        sw.title = pal.name
        sw.addEventListener('click', () => {
          document.querySelectorAll('.pal-swatch').forEach(s => s.classList.remove('active'))
          sw.classList.add('active')
          activeColor = pal
          document.querySelectorAll('.px-block.lit').forEach(b => {
            ;(b as HTMLElement).style.background = activeColor.color
            ;(b as HTMLElement).style.boxShadow  = `0 0 4px 1px ${activeColor.glow}`
          })
        })
        paletteRow.appendChild(sw)
      })
    }

    // ── letter columns ──
    const word = document.getElementById(wordId)
    if (word) {
      word.innerHTML = ''
      LETTERS.forEach((ch, li) => {
        const col = document.createElement('div')
        col.className = 'letter-col'
        col.style.animationDelay = `${0.4 + li * 0.07}s`

        const inner = document.createElement('div')
        inner.style.cssText = [
          'display:grid',
          'grid-template-columns:repeat(5,var(--px))',
          'grid-template-rows:repeat(7,var(--px))',
          'gap:2px',
        ].join(';')

        PIXEL_FONT[ch].forEach((row, ri) => {
          row.forEach((bit, ci) => {
            const b = document.createElement('div')
            b.className = `px-block${bit ? ' lit' : ''}`
            b.style.gridRow    = String(ri + 1)
            b.style.gridColumn = String(ci + 1)
            if (bit) {
              b.style.background = activeColor.color
              b.style.boxShadow  = `0 0 4px 1px ${activeColor.glow}`
            }
            b.addEventListener('click', (e) => {
              e.stopPropagation()
              b.classList.toggle('lit')
              if (b.classList.contains('lit')) {
                b.style.background = activeColor.color
                b.style.boxShadow  = `0 0 4px 1px ${activeColor.glow}`
              } else {
                b.style.background = ''
                b.style.boxShadow  = ''
              }
              spawnParticles((e as MouseEvent).clientX, (e as MouseEvent).clientY, 4)
            })
            inner.appendChild(b)
          })
        })

        const label = document.createElement('div')
        label.className = 'letter-label'
        label.textContent = ch

        col.addEventListener('mouseenter', () => {
          inner.querySelectorAll('.px-block.lit').forEach(b => {
            ;(b as HTMLElement).style.boxShadow = `0 0 8px 2px ${activeColor.glow}`
            ;(b as HTMLElement).style.transform = 'scale(1.05)'
          })
        })
        col.addEventListener('mouseleave', () => {
          inner.querySelectorAll('.px-block.lit').forEach(b => {
            ;(b as HTMLElement).style.boxShadow = `0 0 4px 1px ${activeColor.glow}`
            ;(b as HTMLElement).style.transform = ''
          })
        })
        col.addEventListener('click', (e) => {
          spawnParticles((e as MouseEvent).clientX, (e as MouseEvent).clientY, 14)
          scatterColumn(inner)
        })

        col.appendChild(inner)
        col.appendChild(label)
        word.appendChild(col)
      })
    }

    // ── canvas rain ──
    const bgCanvas = document.getElementById(canvasId) as HTMLCanvasElement | null
    const ctx = bgCanvas?.getContext('2d') ?? null
    const PX = 6
    let rainCols: RainCol[] = []

    function resizeBg() {
      if (!bgCanvas) return
      bgCanvas.width  = bgCanvas.parentElement?.clientWidth  ?? window.innerWidth
      bgCanvas.height = bgCanvas.parentElement?.clientHeight ?? window.innerHeight
      const n = Math.ceil(bgCanvas.width / (PX + 2))
      rainCols = Array.from({ length: n }, (_, i) => ({
        x: i * (PX + 2),
        y: -Math.random() * bgCanvas.height,
        speed:   0.3 + Math.random() * 0.8,
        color:   RAIN_COLORS[Math.floor(Math.random() * RAIN_COLORS.length)],
        opacity: 0.04 + Math.random() * 0.06,
        len:     4 + Math.floor(Math.random() * 8),
      }))
    }

    function drawBg() {
      if (!bgCanvas || !ctx) return
      ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height)
      rainCols.forEach(col => {
        for (let i = 0; i < col.len; i++) {
          ctx.fillStyle   = col.color
          ctx.globalAlpha = col.opacity * (1 - i / col.len)
          ctx.fillRect(col.x, col.y - i * (PX + 2), PX, PX)
        }
        ctx.globalAlpha = 1
        col.y += col.speed
        if (col.y - col.len * (PX + 2) > bgCanvas.height) {
          col.y       = -PX
          col.x       = Math.floor(Math.random() * Math.ceil(bgCanvas.width / (PX + 2))) * (PX + 2)
          col.speed   = 0.3 + Math.random() * 0.8
          col.color   = RAIN_COLORS[Math.floor(Math.random() * RAIN_COLORS.length)]
          col.opacity = 0.04 + Math.random() * 0.06
        }
      })
      animId = requestAnimationFrame(drawBg)
    }

    if (bgCanvas && ctx) {
      resizeBg()
      animId = requestAnimationFrame(drawBg)
    }

    // ── tooltip ──
    const tooltip = document.createElement('div')
    tooltip.className = 'px-tooltip'
    document.body.appendChild(tooltip)

    const onMouseMove = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.classList.contains('px-block')) {
        tooltip.textContent = t.classList.contains('lit') ? '● LIT' : '○ OFF'
        tooltip.style.left    = (e.clientX + 14) + 'px'
        tooltip.style.top     = (e.clientY - 6)  + 'px'
        tooltip.style.opacity = '1'
        tooltip.style.color   = t.classList.contains('lit') ? activeColor.color : '#7a7060'
      } else {
        tooltip.style.opacity = '0'
      }
    }
    document.addEventListener('mousemove', onMouseMove)

    const onResize = () => resizeBg()
    window.addEventListener('resize', onResize)

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      const k = e.key.toUpperCase()
      const idx = LETTERS.indexOf(k)
      if (idx !== -1) {
        const cols = document.querySelectorAll('.letter-col')
        const col  = cols[idx] as HTMLElement | undefined
        if (col) {
          const rect  = col.getBoundingClientRect()
          const inner = col.querySelector('div') as HTMLElement | null
          spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 10)
          if (inner) scatterColumn(inner)
        }
      }
      if (e.key === ' ') {
        e.preventDefault()
        document.querySelectorAll<HTMLElement>('.letter-col').forEach((col, i) => {
          setTimeout(() => {
            const rect  = col.getBoundingClientRect()
            const inner = col.querySelector('div') as HTMLElement | null
            spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 6)
            if (inner) scatterColumn(inner)
          }, i * 60)
        })
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('keydown', onKeyDown)
      tooltip.remove()
      if (paletteRow) paletteRow.innerHTML = ''
      if (word) word.innerHTML = ''
    }
  }, [paletteId, wordId, canvasId])
}

import { LINES } from "./lines"

export default class Game {
  typed: string
  el_typed: HTMLElement

  remaining: string
  el_remaining: HTMLElement

  el_cursor: HTMLElement

  current: number = -1

  inputs: string[]

  start: number
  elapsed: number

  chars: number
  el_chars: HTMLElement

  errors: number
  el_errors: HTMLElement

  cpm: number = 0
  acc: number = 0

  constructor() {
    this.el_typed = document.querySelector("#app .typed")
    this.el_remaining = document.querySelector("#app .remaining")
    this.el_cursor = document.querySelector("#app .cursor")
    this.el_chars = document.querySelector("#overlay .cpm")
    this.el_errors = document.querySelector("#overlay .errors")

    this.restart()

    window.addEventListener("keypress", (e) => {
      this.inputs.push(e.key)
    })

    window.requestAnimationFrame((ts) => this.loop(ts))
  }

  restart() {
    this.chars = 0
    this.errors = 0

    this.next_text()
  }

  next_text() {
    this.current = (this.current + 1) % 3
    this.typed = ""
    this.remaining = LINES[this.current]
    this.inputs = []
  }

  loop(ts: number) {
    this.update(ts)
    this.render(ts)

    window.requestAnimationFrame((ts) => this.loop(ts))
  }

  update(ts: number) {
    if (this.start) this.elapsed = ts - this.start

    if (this.inputs.length > 0) {
      if (!this.start) this.start = ts

      const next = this.remaining.charAt(0)
      const key = this.inputs.shift()

      if (next === key) {
        this.chars += 1

        this.remaining = this.remaining.substring(1)
        this.typed = this.typed + next
      } else {
        this.errors += 1
      }

      this.cpm = this.chars / (this.elapsed / 1000 / 60)
      this.acc = this.errors > this.chars ? 0 : 1 - this.errors / this.chars
    }

    if (this.remaining.length == 0) this.next_text()
  }

  render(ts: number) {
    this.el_typed.innerHTML = this.typed
    this.el_cursor.innerHTML = this.handle_space(this.remaining[0])
    this.el_remaining.innerHTML = this.remaining.substring(1)

    this.el_chars.innerHTML = `${Math.floor(this.cpm)} CPM,`
    this.el_errors.innerHTML = `Accuracy: ${Math.floor(this.acc * 100)}%`
  }

  handle_space(str: string) {
    if (str == " ") return "&#32;"
    return str
  }
}

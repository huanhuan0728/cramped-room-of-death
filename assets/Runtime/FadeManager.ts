import { sp, RenderRoot2D, game } from 'cc'
import Singleton from '../Base/singleton'
import { DEFAULT_DURATION, DrawManager } from '../Scripts/UI/DrawManager'
import { createUINode } from '../Utils'
export class FadeManager extends Singleton {
  static get Instance() {
    return super.GetInstance<FadeManager>()
  }

  private _fader: DrawManager = null

  get fader() {
    if (this._fader !== null) {
      return this._fader
    }

    const root = createUINode()
    root.addComponent(RenderRoot2D)

    const fadeNode = createUINode()
    fadeNode.setParent(root)
    this._fader = fadeNode.addComponent(DrawManager)
    this._fader.init() // 调用DrawManager的init方法
    game.addPersistRootNode(root)

    return this._fader
  }

  fadeIn(duration: number = DEFAULT_DURATION) {
    return this.fader.fadeIn(duration)
  }

  fadeOut(duration: number = DEFAULT_DURATION) {
    return this.fader.fadeOut(duration)
  }

  mask() {
    return this.fader.mask()
  }
}

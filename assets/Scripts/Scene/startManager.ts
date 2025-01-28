import { _decorator, Component, Node, Event, director, Scene } from 'cc'
import { EventManager } from '../../Runtime/EventManager'
import { CONTROLLER_ENUM, EVENT_ENUM, SCENCE_ENUM } from '../../Enums'
import { FadeManager } from '../../Runtime/FadeManager'
const { ccclass, property } = _decorator

@ccclass('startManager')
export class startManager extends Component {
  protected onLoad(): void {
    FadeManager.Instance.fadeOut(1000)
    this.node.once(Node.EventType.TOUCH_END, this.handlestart, this)
  }
  async handlestart() {
    await FadeManager.Instance.fadeIn(300)
    director.loadScene(SCENCE_ENUM.Battle)
  }
}

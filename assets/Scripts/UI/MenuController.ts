import { _decorator, Component, Node, Event } from 'cc'
import { EventManager } from '../../Runtime/EventManager'
import { CONTROLLER_ENUM, EVENT_ENUM } from '../../Enums'
const { ccclass, property } = _decorator

@ccclass('MenuController')
export class MenuController extends Component {
  handleUndo() {
    EventManager.Instance.emit(EVENT_ENUM.REVOKE_BACK)
  }
  handleOut() {
    EventManager.Instance.emit(EVENT_ENUM.OUT_BATTLE)
  }
  handleRestart() {
    EventManager.Instance.emit(EVENT_ENUM.RESTART_LEVEL)
  }
}

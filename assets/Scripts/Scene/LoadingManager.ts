import { _decorator, Component, Node, Event, director, Scene, resources, ProgressBar } from 'cc'
import { EventManager } from '../../Runtime/EventManager'
import { CONTROLLER_ENUM, EVENT_ENUM, SCENCE_ENUM } from '../../Enums'
import { FadeManager } from '../../Runtime/FadeManager'
const { ccclass, property } = _decorator

@ccclass('LoadingManager')
export class LoadingManager extends Component {
  @property(ProgressBar)
  bar: ProgressBar = null

  protected onLoad(): void {
    resources.preloadDir(
      'texture/ctrl',
      (cur, total) => {
        this.bar.progress = cur / total
      },
      () => {
        director.loadScene(SCENCE_ENUM.Start)
      },
    )
  }
}

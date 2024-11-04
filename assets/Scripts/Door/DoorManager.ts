import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, Vec3, resources, SpriteFrame, math} from 'cc';
import { EventManager } from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import { EnityManager } from '../../Base/EnityManager';
import { DoorStateMachine } from './DoorStateMachine';
import { DataManager } from '../../Runtime/dataManager';
const { ccclass, property } = _decorator;


@ccclass('DoorManager')
export class DoorManager extends EnityManager {

  async init(){

    this.fsm = this.addComponent(DoorStateMachine);
    await this.fsm.init();
    super.init({
      x:7,
      y:8,
      type:ENTITY_TYPE_ENUM.DOOR,
      direction:DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE
    })
    EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN, this.onOpen, this);



  }
  onOpen(){

    if(DataManager.Instance.enemies.every(enemy=>enemy.state === ENTITY_STATE_ENUM.DEATH) &&
     this.state !== ENTITY_STATE_ENUM.DEATH
    ){

      this.state = ENTITY_STATE_ENUM.DEATH
      console.log(this.state)
    }
  }


  onDestroy(){
    super.onDestroy();
    EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN, this.onOpen);

  }


}

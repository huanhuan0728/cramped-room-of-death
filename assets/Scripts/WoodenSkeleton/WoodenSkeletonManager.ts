import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, Vec3, resources, SpriteFrame, math} from 'cc';
import { EventManager } from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import { EnityManager } from '../../Base/EnityManager';
import { DataManager } from '../../Runtime/dataManager';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
import { EnemyManager } from '../../Base/EnemyManager';
const { ccclass, property } = _decorator;


@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EnemyManager {

  async init(params){

    this.fsm = this.addComponent(WoodenSkeletonStateMachine);
    await this.fsm.init();
    super.init(params)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this);

  }

  onDestroy(){
      super.onDestroy();
      EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack);
  }


  onAttack(){

    if(this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player){
      return
    }

    const {x:playerX, y:playerY, state:playerState } = DataManager.Instance.player


    if(((this.x === playerX && Math.abs(this.y - playerY) <= 1) ||
        (this.y === playerY && Math.abs(this.x - playerX) <= 1)) &&
        playerState !== ENTITY_STATE_ENUM.DEATH &&
        playerState !== ENTITY_STATE_ENUM.AIRDEATH)
        {
        this.state = ENTITY_STATE_ENUM.ATTACK;
        EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH);

    }else{
      this.state = ENTITY_STATE_ENUM.IDLE;
    }
  }


}

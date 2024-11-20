import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, Vec3, resources, SpriteFrame, math} from 'cc';
import { EventManager } from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import { EnityManager } from '../../Base/EnityManager';
import { DataManager } from '../../Runtime/dataManager';
import { BurstStateMachine } from './BurstStateMachine';
import { TILE_HIGHT, TILE_WIDTH } from '../Tile/TileManager';
const { ccclass, property } = _decorator;


@ccclass('WoodenSkeletonManager')
export class BurstManager extends EnityManager {

  async init(params){

    this.fsm = this.addComponent(BurstStateMachine);
    await this.fsm.init();
    super.init(params)
    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 1, TILE_HIGHT * 1)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst, this);

  }

  onDestroy(){
      super.onDestroy();
      EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst);
  }

  update(){
    this.node.setPosition((this.x) * TILE_WIDTH, -(this.y) * TILE_HIGHT);
  }


  onBurst(){

    if(this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player){
      return
    }

    const {x:playerX, y:playerY} = DataManager.Instance.player

    if(this.x === playerX && this.y === playerY && this.state === ENTITY_STATE_ENUM.IDLE){
      this.state = ENTITY_STATE_ENUM.ATTACK
    }else if(this.state === ENTITY_STATE_ENUM.ATTACK){
      this.state = ENTITY_STATE_ENUM.DEATH
      if(this.x === playerX && this.y === playerX){
        EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.AIRDEATH)
      }
    }
  }



}

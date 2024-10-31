import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, Vec3, resources, SpriteFrame, math} from 'cc';
import { EventManager } from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import { EnityManager } from '../../Base/EnityManager';
import { DataManager } from '../../Runtime/dataManager';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
const { ccclass, property } = _decorator;


@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EnityManager {

  async init(){

    this.fsm = this.addComponent(WoodenSkeletonStateMachine);
    await this.fsm.init();
    super.init({
      x:7,
      y:7,
      type:ENTITY_TYPE_ENUM.PLAYER,
      direction:DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE
    })
    EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this);
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this);
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this);
    EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDead, this)


    this.onChangeDirection(true);
  }

  onDestroy(){
      super.onDestroy();
      EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection);
      EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection);
      EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack);
      EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY,this.onDead)
  }

  onChangeDirection(isInit = false){
    if(this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player){
      return
    }

    const player = DataManager.Instance.player;
    if (!player || typeof player.x === 'undefined' || typeof player.y === 'undefined') {
        console.warn("Player position is undefined");
        return;
    }
    const {x:playerX, y:playerY} = DataManager.Instance.player

    const disX = Math.abs(this.x - playerX);
    const disY = Math.abs(this.y - playerY);

    if(disX === disY && !isInit){
      return
    }

    if(playerX >= this.x && playerY <= this.y){
        this.direction =disY > disX ? DIRECTION_ENUM.TOP:DIRECTION_ENUM.RIGHT;
    }else if(playerX <= this.x && playerY <= this.y){
      this.direction =disY > disX ? DIRECTION_ENUM.TOP:DIRECTION_ENUM.LEFT;
    }else if(playerX <= this.x && playerY >= this.y){
      this.direction =disY > disX ? DIRECTION_ENUM.BOTTOM:DIRECTION_ENUM.LEFT;
    }else if(playerX >= this.x && playerY >= this.y){
      this.direction =disY > disX ? DIRECTION_ENUM.BOTTOM:DIRECTION_ENUM.RIGHT;
    }
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

  onDead(id: string){

    console.log(`onDead called with id: ${id}`);
    console.log(`Current instance id: ${this.id}`);
    console.log(`Current state: ${this.state}`);

    if(this.state === ENTITY_STATE_ENUM.DEATH){
      return
    }

    if(this.id === id){
      this.state = ENTITY_STATE_ENUM.DEATH
    }


  }

}

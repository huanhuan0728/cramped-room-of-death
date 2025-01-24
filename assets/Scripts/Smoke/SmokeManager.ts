import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, Vec3, resources, SpriteFrame, math} from 'cc';
import { EventManager } from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import { EnityManager } from '../../Base/EnityManager';
import { DataManager } from '../../Runtime/dataManager';
import { IEntity } from '../../Levels';
import { SmokeStateMachine } from './SmokeStateMachine';
const { ccclass, property } = _decorator;


@ccclass('SmokeManager')
export class SmokeManager extends EnityManager {

  async init(params:IEntity){

    this.fsm = this.addComponent(SmokeStateMachine);
    await this.fsm.init();
    // console.log('SmokeManager -> init -> this.fsm', this.fsm);
    super.init(params)
    // EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN, this.onOpen, this);

  }



}

import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, Vec3, resources, SpriteFrame, math} from 'cc';
import { EventManager } from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import { EnityManager } from '../../Base/EnityManager';
import { DataManager } from '../../Runtime/dataManager';
import { EnemyManager } from '../../Base/EnemyManager';
import { IronSkeletonStateMachine } from './IronSkeletonStateMachine';
const { ccclass, property } = _decorator;


@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends EnemyManager {

  async init(params){

    this.fsm = this.addComponent(IronSkeletonStateMachine);
    await this.fsm.init();
    super.init(params)

  }



}

import { _decorator, Component, Node, Event, AnimationClip, Animation, SpriteFrame} from 'cc';
import { EventManager } from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM, SPIKE_TYPE_MAP_ENUM_TOTAL_COUNT } from '../../Enums';
import State from '../../Base/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import { EnityManager } from '../../Base/EnityManager';
import SpikesOneStateMachine from './SpikesOneStateMachine';


const { ccclass, property } = _decorator;



@ccclass('SpikeStateMachine')
export class SpikeStateMachine extends StateMachine {

  async init(){
    this.animationComponent = this.addComponent(Animation);

    this.initParams();
    this.initStateMachine();
    this.initAnimationEvent();

    await Promise.all(this.waitingList);

  }

  initParams(){
    this.params.set(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT,getInitParamsTrigger());
  }

  initStateMachine(){
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_ONE, new SpikesOneStateMachine(this));
  }

  initAnimationEvent(){
  //   this.animationComponent.on(Animation.EventType.FINISHED,()=>{
  //     const name = this.animationComponent.defaultClip.name;
  //     const whiteList = ['attack'];  //v名字里包含有turn和block，之后都会让它回到idle状态
  //     if(whiteList.some(v=>name.includes(v))){
  //       this.node.getComponent(EnityManager).state = ENTITY_STATE_ENUM.IDLE;
  //     }
  //   })
  }

  run(){
    const value = this.getParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT);
    switch(this.currentState){
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE):
        if(value === SPIKE_TYPE_MAP_ENUM_TOTAL_COUNT.SPIKES_ONE){
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE);
        }else{
          this.currentState = this.currentState;
        }
        break;

      default:
        this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
    }
  }
}




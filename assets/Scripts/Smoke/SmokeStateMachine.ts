import { _decorator, Component, Node, Event, AnimationClip, Animation, SpriteFrame} from 'cc';
import { EventManager } from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import State from '../../Base/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import { EnityManager } from '../../Base/EnityManager';
import IdleSubstateMachine from './idleSubStateMachine';
import DeathSubStateMachine from './DeathSubStateMachine';


const { ccclass, property } = _decorator;



@ccclass('SmokeStateMachine')
export class SmokeStateMachine extends StateMachine {

  async init(){

    this.animationComponent = this.addComponent(Animation);
    this.initParams();
    this.initStateMachine();
    this.initAnimationEvent();


    await Promise.all(this.waitingList);

  }

  initParams(){
    this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsNumber());
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())

  }

  initStateMachine(){
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubstateMachine(this));
    console.log('SmokeStateMachine -> initStateMachine -> this.stateMachines', this.stateMachines);
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this));
    console.log('SmokeStateMachine -> initStateMachine -> this.stateMachines', this.stateMachines);
  }

  initAnimationEvent(){
    this.animationComponent.on(Animation.EventType.FINISHED,()=>{
      const name = this.animationComponent.defaultClip.name;
      const whiteList = ['idle'];  //v名字里包含有turn和block，之后都会让它回到idle状态
      if(whiteList.some(v=>name.includes(v))){
        this.node.getComponent(EnityManager).state = ENTITY_STATE_ENUM.DEATH;
      }
    })
  }

  run(){
    // console.error('Invalid currentState or missing run method in currentState:', this.currentState);
    switch(this.currentState){
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
        if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        }else if(this.params.get(PARAMS_NAME_ENUM.DEATH).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        }else{
          this.currentState = this.currentState;
        }
        break;

      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }


}




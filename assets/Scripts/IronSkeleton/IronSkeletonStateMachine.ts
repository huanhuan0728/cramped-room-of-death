import { _decorator, Component, Node, Event, AnimationClip, Animation, SpriteFrame} from 'cc';
import { EventManager } from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import State from '../../Base/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import { EnityManager } from '../../Base/EnityManager';
import IdleSubstateMachine from './IdleSubstateMachine';
import DeathSubStateMachine from './DeathSubStateMachine';


const { ccclass, property } = _decorator;



@ccclass('IronSkeletonStateMachine')
export class IronSkeletonStateMachine extends StateMachine {

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
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this));
  }

  initAnimationEvent(){
  }

  run(){
    console.error('Invalid currentState or missing run method in currentState:', this.currentState);
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


  // run() {
  //   // Retrieve the state machine objects
  //   const idleState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
  //   const deathState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH);

  //   // Update current state based on parameters
  //   if (this.params.get(PARAMS_NAME_ENUM.IDLE)?.value) {
  //     this.currentState = idleState;
  //   } else if (this.params.get(PARAMS_NAME_ENUM.DEATH)?.value) {
  //     this.currentState = deathState;
  //   }

  //   // Ensure currentState is valid and has a `run` method
  //   if (this.currentState && typeof this.currentState.run === 'function') {
  //     this.currentState.run();
  //   } else {
  //     console.error('Invalid currentState or missing run method in currentState:', this.currentState);
  //   }
  // }

}




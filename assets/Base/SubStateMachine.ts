import { _decorator, Component, Node, Event, AnimationClip, Animation, SpriteFrame} from 'cc';
import { FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from 'db://assets/Enums';
import State from './State';
import { StateMachine } from './StateMachine';
const { ccclass, property } = _decorator;

export abstract class SubStateMachine {
  private _currentState: State = null;
  stateMachines:Map<string,State> = new Map();

  constructor(public fsm:StateMachine){

  }

  get currentState(){
    return this._currentState;
  }


  set currentState(newState){
    this._currentState = newState;
    this._currentState.run();
  }

  abstract run(): void


}




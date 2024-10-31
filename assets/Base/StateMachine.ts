import { _decorator, Component, Node, Event, AnimationClip, Animation, SpriteFrame} from 'cc';
import { FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from 'db://assets/Enums';
import State from './State';
import { SubStateMachine } from './SubStateMachine';
const { ccclass, property } = _decorator;

type ParamsValueType = boolean | number;

export interface IParamsValue{
  type:FSM_PARAMS_TYPE_ENUM;
  value:ParamsValueType
}

export const getInitParamsTrigger = () =>{
  return {
    type:FSM_PARAMS_TYPE_ENUM.TRIGGER,
    value:false
  }
}

export const getInitParamsNumber = () =>{
  return {
    type:FSM_PARAMS_TYPE_ENUM.NUMBER,
    value:0
  }
}

@ccclass('StateMachine')
export abstract class StateMachine extends Component {
  private _currentState: State | SubStateMachine = null;
  params:Map<string,IParamsValue> = new Map();
  stateMachines:Map<string,State | SubStateMachine> = new Map();
  animationComponent:Animation
  waitingList:Array<Promise<SpriteFrame[]>> = []

  getParams(paramasName:string){
    if(this.params.has(paramasName)){
      return this.params.get(paramasName).value
    }
  }

  setParams(paramasName:string, value:ParamsValueType){
    if(this.params.has(paramasName)){
      this.params.get(paramasName).value = value;
      this.run();
      this.resetTrigger();
    }

  }

  get currentState(){
    return this._currentState;
  }

  resetTrigger(){
    for(const[_, value] of this.params){
      if(value.type === FSM_PARAMS_TYPE_ENUM.TRIGGER){
        value.value = false;
      }
    }
  }

  set currentState(newState){
    this._currentState = newState;
    this._currentState.run();
  }

  abstract init(): void
  abstract run(): void


}




import { _decorator, Component, Node, Event, AnimationClip, Animation, SpriteFrame} from 'cc';
import { EventManager } from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import State from '../../Base/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import IdleSubstateMachine from './IdleSubstateMachine';
import TurnLeftSubStainMachine from './TurnLeftSubStainMachine';
import BlockFrontSubstateMachine from './BlockFrontSubstateMachine';
import { EnityManager } from '../../Base/EnityManager';
import BlockTurnLeftSubStateMachine from './BlockTurnLeftSubStateMachine';
import TurnRightSubStainMachine from './TurnRightSubStateMachine';
import BlockTurnRightSubStateMachine from './BlockTurnRightSubStateMachine';
import BlockBackSubstateMachine from './BlockBackSubStateMachine';
import BlockLeftSubStateMachine from './BlockLeftSubStateMachine';
import BlockRightSubStateMachine from './BlockRightSubStateMachine';
import DeadSubStateMachine from './DeadSubStateMachine';
import AttackSubStateMachine from './AttackSubStateMachine';
import AIrDeadSubStateMachine from './AirDeathSubstateMachine';

const { ccclass, property } = _decorator;



@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {

  async init(){
    this.animationComponent = this.addComponent(Animation);

    this.initParams();
    this.initStateMachine();
    this.initAnimationEvent();

    await Promise.all(this.waitingList);

  }

  initParams(){
    this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber());
    this.params.set(PARAMS_NAME_ENUM.TURNLEFT,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.TURNRIGHT,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.BLOCKFRONT,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.BLOCKBACK,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.BLOCKLEFT,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.BLOCKRIGHT,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.DEATH,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.AIRDEATH,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.ATTACK,getInitParamsTrigger());

  }

  initStateMachine(){
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubstateMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT, new TurnLeftSubStainMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.TURNRIGHT, new TurnRightSubStainMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKFRONT, new BlockFrontSubstateMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKBACK, new BlockBackSubstateMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKLEFT, new BlockLeftSubStateMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKRIGHT, new BlockRightSubStateMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT, new BlockTurnLeftSubStateMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT, new BlockTurnRightSubStateMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeadSubStateMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.AIRDEATH, new AIrDeadSubStateMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new AttackSubStateMachine(this));
  }

  initAnimationEvent(){
    this.animationComponent.on(Animation.EventType.FINISHED,()=>{
      const name = this.animationComponent.defaultClip.name;
      const whiteList = ['turn', 'block', 'attack'];  //v名字里包含有turn和block，之后都会让它回到idle状态
      if(whiteList.some(v=>name.includes(v))){
        this.node.getComponent(EnityManager).state = ENTITY_STATE_ENUM.IDLE;
      }
    })
  }

  run(){
    switch(this.currentState){
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKBACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKRIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
      case this.stateMachines.get(PARAMS_NAME_ENUM.AIRDEATH):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):

        if(this.params.get(PARAMS_NAME_ENUM.BLOCKFRONT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT)
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKBACK).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKBACK)
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKLEFT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKLEFT)
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKRIGHT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKRIGHT)
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT)
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT)
        }else if(this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
        }else if(this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT)
        }else if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        }else if(this.params.get(PARAMS_NAME_ENUM.DEATH).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        }else if(this.params.get(PARAMS_NAME_ENUM.AIRDEATH).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.AIRDEATH)
        }else if(this.params.get(PARAMS_NAME_ENUM.ATTACK).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
        }else{
          this.currentState = this.currentState;
        }
        break;

      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}




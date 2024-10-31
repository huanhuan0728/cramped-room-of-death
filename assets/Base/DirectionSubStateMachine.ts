import { AnimationClip } from "cc";
import { StateMachine } from "db://assets/Base/StateMachine";
import { SubStateMachine } from "db://assets/Base/SubStateMachine";
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from "db://assets/Enums";
import State from "db://assets/Base/State";

export default class DirectionSubStateMachine extends SubStateMachine{


  run(): void {
    const value = this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION)
    this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
  }

}

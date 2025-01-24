import { AnimationClip } from "cc";
import { StateMachine } from "../../Base/StateMachine";
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM, SPIKE_COUNT_ENUM, SPIKE_COUNT_MAP_NUMBER_ENUM } from "../../Enums";
import State from "../../Base/State";
import DirectionSubStateMachine from "../../Base/DirectionSubStateMachine";
import { SubStateMachine } from "../../Base/SubStateMachine";

const BASE_URL = 'texture/spikes/spikesone'

export default class SpikesSubStateMachine extends SubStateMachine{
  run(){
    // const value = this.fsm.getParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT);
    // this.currentState = this.stateMachines.get(SPIKE_COUNT_MAP_NUMBER_ENUM[value as number]);
    const value = this.fsm.getParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT) as number | undefined;
    if (value !== undefined) {
      this.currentState = this.stateMachines.get(SPIKE_COUNT_MAP_NUMBER_ENUM[value]);
    }

  }
}

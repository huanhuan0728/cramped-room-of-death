import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, Vec3, resources, SpriteFrame} from 'cc';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM, SPIKE_TYPE_MAP_ENUM_TOTAL_COUNT_ENUM } from 'db://assets/Enums';
import { randomByLength } from '../../Utils';
import { StateMachine } from '../../Base/StateMachine';
import { ISpikes } from '../../Levels';
import { TILE_HIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { SpikeStateMachine } from './SpikeStateMachine';


const { ccclass, property } = _decorator;


@ccclass('SpikesManager')
export class SpikesManager extends Component {
  id:string = randomByLength(12)
  x:number = 0;
  y:number = 0;


  fsm:StateMachine;
  private _count:number;
  private _totalCount: number;
  type: ENTITY_TYPE_ENUM;

  get count(){
    return this._count;
  }

  set count(newCount){
    this._count = newCount;
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, newCount);
  }

  get totalCount(){
    return this._totalCount;
  }

  //这段开始UI和数据分离
  set totalCount(newCount){
    this._totalCount = newCount;
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, newCount);
  }


  async init(params: ISpikes){
    const sprite = this.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    const transform = this.getComponent(UITransform);
    transform.setContentSize(TILE_WIDTH * 4, TILE_HIGHT * 4);

    this.fsm = this.addComponent(SpikeStateMachine);
    await this.fsm.init();

    this.x = params.x;
    this.y = params.y;
    this.type = params.type;
    this.totalCount = SPIKE_TYPE_MAP_ENUM_TOTAL_COUNT_ENUM[this.type];
    this.count = params.count;
  }

  update(){
    this.node.setPosition((this.x - 1.5) * TILE_WIDTH, -(this.y - 1.5) * TILE_HIGHT);
  }

  onDestroy(){

  }



}


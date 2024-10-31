import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, Vec3, resources, SpriteFrame} from 'cc';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from 'db://assets/Enums';

import { IEntity } from '../Levels';
import { TILE_HIGHT, TILE_WIDTH } from '../Scripts/Tile/TileManager';
import { StateMachine } from './StateMachine';
import { randomByLength } from '../Utils';
const { ccclass, property } = _decorator;


@ccclass('EnityManager')
export class EnityManager extends Component {
  id:string = randomByLength(12)
  x:number = 0;
  y:number = 0;
  fsm:StateMachine;

  private _direction:DIRECTION_ENUM;
  private _state:ENTITY_STATE_ENUM;
  private type: ENTITY_TYPE_ENUM;

  get direction(){
    return this._direction;
  }

  set direction(newDirection){
    this._direction = newDirection;
    this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[this._direction]);
  }

  get state(){
    return this._state;
  }

  //这段开始UI和数据分离
  set state(newState){
    this._state = newState;
    this.fsm.setParams(this._state, true)
  }


  async init(params: IEntity){
    const sprite = this.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    const transform = this.getComponent(UITransform);
    transform.setContentSize(TILE_WIDTH * 4, TILE_HIGHT * 4);

    this.x = params.x;
    this.y = params.y;
    this.type = params.type;
    this.direction = params.direction;
    this.state = params.state;

  }

  update(){
    this.node.setPosition((this.x - 1.5) * TILE_WIDTH, -(this.y - 1.5) * TILE_HIGHT);
  }

  onDestroy(){

  }



}


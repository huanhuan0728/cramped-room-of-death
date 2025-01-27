import { _decorator, Component, Node, Event, Graphics, view, Color,game, BlockInputEvents, UITransform} from 'cc';
import { EventManager } from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, EVENT_ENUM } from '../../Enums';
const { ccclass, property } = _decorator;

const SCREEN_WIDTH = view.getVisibleSize().width;
const SCREEN_HEIGHT = view.getVisibleSize().height;
enum FADE_STATE_ENUM{
  FADE_IN = 'FADE_IN',
  FADE_OUT = 'FADE_OUT',
  IDLE = 'IDLE'
}
export const DEFAULT_DURATION = 200;

@ccclass('DrawManager')
export class DrawManager extends Component {
  private ctx:Graphics;
  private state:FADE_STATE_ENUM = FADE_STATE_ENUM.IDLE;
  private oldTime:number = 0;
  private duration:number = 0;
  private fadeResolve:(value:PromiseLike<void>)=>void;
  private block:BlockInputEvents;



  init(){
    this.block = this.addComponent(BlockInputEvents);
    this.ctx = this.addComponent(Graphics);
    const transform = this.node.getComponent(UITransform);  //设置UITransform组件的各种属性
    transform.setAnchorPoint(0.5, 0.5);
    transform.setContentSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.setAlpha(1);
  }

  setAlpha(percent:number){
    this.ctx.clear();
    this.ctx.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.ctx.fillColor = new Color(0, 0, 0, 255*percent);
    this.ctx.fill();
    this.block.enabled = percent === 1;
  }

  protected update(dt: number): void {
    const percent = (game.totalTime - this.oldTime) / this.duration;
    // console.log('DrawManager -> update -> percent', percent);
      switch (this.state){
        case FADE_STATE_ENUM.FADE_IN:
          if(percent < 1){
            this.setAlpha(percent);
          }else{
            this.setAlpha(1);
            this.state = FADE_STATE_ENUM.IDLE;
            this.fadeResolve(null);
          }
          break;
        case FADE_STATE_ENUM.FADE_OUT:
          if(percent < 1){
            this.setAlpha(1 - percent);
          }else{
            this.setAlpha(0);
            this.state = FADE_STATE_ENUM.IDLE;
            this.fadeResolve(null);

          }
          break;
        case FADE_STATE_ENUM.IDLE:
          break;
      }
  }

  fadeIn(duration:number = DEFAULT_DURATION){
    this.setAlpha(0);
    this.duration = duration
    this.oldTime = game.totalTime;
    this.state = FADE_STATE_ENUM.FADE_IN;

    return new Promise((resolve)=>{ //这里是啥
      this.fadeResolve = resolve;
    })
  }

  fadeOut(duration:number = DEFAULT_DURATION){
    this.setAlpha(1);
    this.duration = duration
    this.oldTime = game.totalTime;
    this.state = FADE_STATE_ENUM.FADE_OUT;
    return new Promise((resolve)=>{
      this.fadeResolve = resolve;
    })
  }

}


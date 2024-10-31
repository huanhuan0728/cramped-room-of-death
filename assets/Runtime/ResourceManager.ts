import { resources, SpriteFrame } from "cc";
import Singleton from "../Base/singleton";
import { ITile } from "../Levels";
export class ResourceManager extends Singleton{

  static get Instance(){
    return super.GetInstance<ResourceManager>()
  }

  //  官方文档中的是回调函数的写法，这里把它封装起来
  loadDir(path:string, type: typeof SpriteFrame = SpriteFrame){
    return new Promise<SpriteFrame[]>((resolve, reject)=>{
        resources.loadDir(path, SpriteFrame, function (err, assets) {
            if (err){
                reject(err);
                return;
            }

            resolve(assets);
            // ...
        });
    })
}


}



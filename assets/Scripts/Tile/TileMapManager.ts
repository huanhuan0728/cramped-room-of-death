import { _decorator, Component, Layers, Node, random, resources, Sprite, SpriteFrame, UITransform } from 'cc';
import { TileManager } from './TileManager';
import { createUINode, randomByRange } from '../../Utils';
import { DataManager} from '../../Runtime/dataManager';
import { ResourceManager } from '../../Runtime/ResourceManager';
const { ccclass, property } = _decorator;


@ccclass('TileMapManager')
export class TileMapManager extends Component {
    async init(){
        const spriteFrames =  await ResourceManager.Instance.loadDir("texture/tile/tile");
        const {mapInfo} = DataManager.Instance;
        DataManager.Instance.tileInfo = [];
        for(let i = 0; i < mapInfo.length; i++){
            const column = mapInfo[i];
            DataManager.Instance.tileInfo[i] = [];
            for(let j = 0; j < column.length; j++){
                const item = column[j];
                if(item.src === null || item.type === null){
                    continue;
                }

                let number = item.src;
                if((number === 1 || number === 5 || number === 9) && i %2 == 0 && j % 2 == 0){
                    number += randomByRange(0,4);
                }

                const imgSrc = `tile (${number})`;   //定义图片路径
                const node = createUINode();
                const spriteFrame = spriteFrames.find(v => v.name === imgSrc) || spriteFrames[5];
                const tileManager = node.addComponent(TileManager);
                const type = item.type
                tileManager.init(type, spriteFrame,i, j);
                DataManager.Instance.tileInfo[i][j] = tileManager;
                node.setParent(this.node);
            }
        }

    }

}


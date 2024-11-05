import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../../Utils';
import Levels, { ILevel } from '../../Levels';
import { DataManager} from '../../Runtime/dataManager';
import { TILE_HIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { EventManager } from '../../Runtime/EventManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enums';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
import { DoorManager } from '../Door/DoorManager';
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    level: ILevel;
    stage: Node;

    protected onLoad(): void {
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
    }

    protected onDestroy(): void {
        EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)

    }

    start() {
        this.generateStage;
        this.initLevel();
    }

    initLevel(){
        const level = Levels[`level${DataManager.Instance.levelIndex}`];
        if(level){
            this.clearLevel();

            this.level = level;

            DataManager.Instance.mapInfo = this.level.mapInfo;
            DataManager.Instance.mapRowCount = this.level.mapInfo.length;
            DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length   || 0;

            this.generateTileMap();
            this.generateEnemies();
            this.generatePlayer();
            this.generateDoor();

        }
    }

    nextLevel(){
        DataManager.Instance.levelIndex++;
        this.initLevel();
    }

    clearLevel(){
        if (this.stage) {
            this.stage.destroyAllChildren();
        }
        DataManager.Instance.reset();
    }


    generateStage(){
        this.stage = createUINode();
        this.stage.setParent(this.node);

    }

    async generateTileMap(){
        this.stage = createUINode();
        this.stage.setParent(this.node);

        const tileMap = createUINode();
        tileMap.setParent(this.stage);
        const tileMapManager =  tileMap.addComponent(TileMapManager);
        await tileMapManager.init();

        this.adaptPos();
    }

    async generatePlayer(){
        const player = createUINode();
        player.setParent(this.stage);
        const playerManager = player.addComponent(PlayerManager);
        await playerManager.init({
            x:2,
            y:8,
            type:ENTITY_TYPE_ENUM.PLAYER,
            direction:DIRECTION_ENUM.TOP,
            state: ENTITY_STATE_ENUM.IDLE
          });
        DataManager.Instance.player = playerManager;
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true)
    }

    async generateEnemies(){

        const enemy1 = createUINode();
        enemy1.setParent(this.stage);
        const woodenSkeletonManager = enemy1.addComponent(WoodenSkeletonManager);
        await woodenSkeletonManager.init({
            x:2,
            y:4,
            type:ENTITY_TYPE_ENUM.SKELETON_WOODEN,
            direction:DIRECTION_ENUM.TOP,
            state: ENTITY_STATE_ENUM.IDLE
          });
        DataManager.Instance.enemies.push(woodenSkeletonManager);

        const enemy2 = createUINode();
        enemy2.setParent(this.stage);
        const ironSkeletonManager = enemy2.addComponent(IronSkeletonManager);
        await ironSkeletonManager.init({
            x:2,
            y:2,
            type:ENTITY_TYPE_ENUM.SKELETON_WOODEN,
            direction:DIRECTION_ENUM.TOP,
            state: ENTITY_STATE_ENUM.IDLE
          });
        DataManager.Instance.enemies.push(ironSkeletonManager);
    }

    async generateDoor(){
        const door = createUINode();
        door.setParent(this.stage);
        const doorManager = door.addComponent(DoorManager);
        await doorManager.init();
        DataManager.Instance.door = doorManager;
    }

    adaptPos(){
        const {mapRowCount, mapColumnCount} = DataManager.Instance;
        const disX = TILE_WIDTH * mapRowCount / 2;
        const disY = TILE_HIGHT * mapColumnCount / 2 + 80;

        this.stage.setPosition(-disX, disY);
    }



}



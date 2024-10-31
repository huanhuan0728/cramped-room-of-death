import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../../Utils';
import Levels, { ILevel } from '../../Levels';
import { DataManager} from '../../Runtime/dataManager';
import { TILE_HIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { EventManager } from '../../Runtime/EventManager';
import { EVENT_ENUM } from '../../Enums';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
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
        await playerManager.init();
        DataManager.Instance.player = playerManager;
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true)
    }

    async generateEnemies(){
        const enemy = createUINode();
        enemy.setParent(this.stage);
        const woodenSkeletonManager = enemy.addComponent(WoodenSkeletonManager);
        await woodenSkeletonManager.init();
        DataManager.Instance.enemies.push(woodenSkeletonManager);
    }

    adaptPos(){
        const {mapRowCount, mapColumnCount} = DataManager.Instance;
        const disX = TILE_WIDTH * mapRowCount / 2;
        const disY = TILE_HIGHT * mapColumnCount / 2 + 80;

        this.stage.setPosition(-disX, disY);
    }

}



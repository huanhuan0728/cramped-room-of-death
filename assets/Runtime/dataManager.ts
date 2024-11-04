import Singleton from "../Base/singleton";
import { ITile } from "../Levels";
import { DoorManager } from "../Scripts/Door/DoorManager";
import { PlayerManager } from "../Scripts/Player/PlayerManager";
import { TileManager } from "../Scripts/Tile/TileManager";
import { WoodenSkeletonManager } from "../Scripts/WoodenSkeleton/WoodenSkeletonManager";
export class DataManager extends Singleton{

  static get Instance(){
    return super.GetInstance<DataManager>()
  }


  mapInfo: Array<Array<ITile>>;
  tileInfo:Array<Array<TileManager>>;
  mapRowCount: number = 0;
  mapColumnCount: number = 0;
  levelIndex:number = 1;
  player:PlayerManager
  door:DoorManager
  enemies:WoodenSkeletonManager[]


  reset(){
    this.mapInfo = [];
    this.tileInfo = [];
    this.enemies = [];
    this.door = null;
    this.mapRowCount = 0;
    this.mapColumnCount = 0;
    this.player = null;
  }

}


import { _decorator, Component, Node } from 'cc'
import { TileMapManager } from '../Tile/TileMapManager'
import { createUINode } from '../../Utils'
import Levels, { ILevel } from '../../Levels'
import { DataManager, IRecord } from '../../Runtime/dataManager'
import { TILE_HIGHT, TILE_WIDTH } from '../Tile/TileManager'
import { EventManager } from '../../Runtime/EventManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enums'
import { PlayerManager } from '../Player/PlayerManager'
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager'
import { DoorManager } from '../Door/DoorManager'
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager'
import { SmokeManager } from '../Smoke/SmokeManager'
import { FadeManager } from '../../Runtime/FadeManager'
import { ShakeManager } from '../UI/Shakemanager'
const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  private level: ILevel
  private stage: Node
  private smokeLayer: Node

  protected onLoad(): void {
    DataManager.Instance.levelIndex = 1
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this)
    EventManager.Instance.on(EVENT_ENUM.SHOW_SOMKE, this.generateSomke, this)
  }

  protected onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
  }

  start() {
    this.generateStage()
    console.log(this.stage.getComponent(ShakeManager) ? 'ShakeManager 已添加' : 'ShakeManager 未添加')
    this.initLevel()
  }

  async initLevel() {
    const level = Levels[`level${DataManager.Instance.levelIndex}`]
    if (level) {
      await FadeManager.Instance.fadeIn()
      this.clearLevel()

      this.level = level

      DataManager.Instance.mapInfo = this.level.mapInfo
      DataManager.Instance.mapRowCount = this.level.mapInfo.length
      DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0

      await Promise.all([
        this.generateTileMap(),
        this.generateDoor(),
        // this.generateBursts(),
        // this.generateSpikes(),
        // this.generateSmokeLayer(),
        this.generateEnemies(),
        this.generatePlayer(),
      ])
      await FadeManager.Instance.fadeOut()
    }
  }

  nextLevel() {
    DataManager.Instance.levelIndex++
    this.initLevel()
  }

  clearLevel() {
    if (this.stage) {
      this.stage.destroyAllChildren()
    }
    DataManager.Instance.reset()
  }

  generateStage() {
    this.stage = createUINode()
    this.stage.setParent(this.node)
    this.stage.addComponent(ShakeManager)

    // 遍历子节点检查
    const found = this.node.children.indexOf(this.stage) !== -1
    console.log(found ? 'stage 成功加入子节点' : 'stage 未加入子节点')
  }

  async generateTileMap() {
    this.stage = createUINode()
    this.stage.setParent(this.node)

    const tileMap = createUINode()
    tileMap.setParent(this.stage)
    const tileMapManager = tileMap.addComponent(TileMapManager)
    await tileMapManager.init()

    this.adaptPos()
  }

  async generatePlayer() {
    const player = createUINode()
    player.setParent(this.stage)
    const playerManager = player.addComponent(PlayerManager)
    await playerManager.init(this.level.player)
    DataManager.Instance.player = playerManager
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true)
  }

  async generateEnemies() {
    const promise = []
    for (let i = 0; i < this.level.enemies.length; i++) {
      const enemy = this.level.enemies[i]
      const node = createUINode()
      node.setParent(this.stage)
      const Manager = enemy.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN ? WoodenSkeletonManager : IronSkeletonManager
      const manager = node.addComponent(Manager)
      promise.push(manager.init(enemy)) // push进promise数组
      DataManager.Instance.enemies.push(manager) // 推入数据中心
    }

    await Promise.all(promise)
  }

  async generateDoor() {
    const door = createUINode()
    door.setParent(this.stage)
    const doorManager = door.addComponent(DoorManager)
    await doorManager.init(this.level.door)
    DataManager.Instance.door = doorManager
  }

  async generateBursts() {
    const promise = []
    for (let i = 0; i < this.level.bursts.length; i++) {
      const burst = this.level.enemies[i]
      const node = createUINode()
      node.setParent(this.stage)
      const Manager = burst.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN ? WoodenSkeletonManager : IronSkeletonManager
      const manager = node.addComponent(Manager)
      promise.push(manager.init(burst)) // push进promise数组
      DataManager.Instance.enemies.push(manager) // 推入数据中心
    }

    await Promise.all(promise)
  }

  async generateSpikes() {
    const promise = []
    for (let i = 0; i < this.level.spikes.length; i++) {
      const spikes = this.level.enemies[i]
      const node = createUINode()
      node.setParent(this.stage)
      const Manager = spikes.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN ? WoodenSkeletonManager : IronSkeletonManager
      const manager = node.addComponent(Manager)
      promise.push(manager.init(spikes)) // push进promise数组
      DataManager.Instance.enemies.push(manager) // 推入数据中心
    }

    await Promise.all(promise)
  }

  async generateSomke(x: number, y: number, type: DIRECTION_ENUM) {
    const somke = createUINode()
    somke.setParent(this.stage)
    const somkeManager = somke.addComponent(SmokeManager)
    await somkeManager.init({
      x,
      y,
      direction: type,
      state: ENTITY_STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.SMOKE,
    })

    DataManager.Instance.smoke.push(somkeManager)
  }

  async generateSmokeLayer() {
    this.smokeLayer = createUINode()
    this.smokeLayer.setParent(this.stage)
  }

  adaptPos() {
    const { mapRowCount, mapColumnCount } = DataManager.Instance
    const disX = (TILE_WIDTH * mapRowCount) / 2
    const disY = (TILE_HIGHT * mapColumnCount) / 2 + 80
    // this.stage.getComponent(ShakeManager).stop();
    if (this.stage.getComponent(ShakeManager)) {
      this.stage.getComponent(ShakeManager).stop()
    } else {
      console.log('this.stage.getComponent(ShakeManager)', this.stage.getComponent(ShakeManager))
    }
    this.stage.setPosition(-disX, disY)
  }

  record() {
    const item: IRecord = {
      player: {
        x: DataManager.Instance.player.x,
        y: DataManager.Instance.player.y,
        direction: DataManager.Instance.player.direction,
        state: DataManager.Instance.player.state,
        type: DataManager.Instance.player.type,
      },
      door: {
        x: DataManager.Instance.door.x,
        y: DataManager.Instance.door.y,
        direction: DataManager.Instance.door.direction,
        state: DataManager.Instance.door.state,
        type: DataManager.Instance.door.type,
      },
      enemies: DataManager.Instance.enemies.map(({ x, y, direction, state, type }) => ({
        x,
        y,
        direction,
        state,
        type,
      })),
      bursts: DataManager.Instance.burst.map(({ x, y, direction, state, type }) => ({
        x,
        y,
        direction,
        state,
        type,
      })),
      spikes: DataManager.Instance.spikes.map(({ x, y, count, type }) => ({
        x,
        y,
        count,
        type,
      })),
    }
    DataManager.Instance.records.push(item)
  }

  revoke() {
    const item = DataManager.Instance.records.pop()
    if (item) {
      DataManager.Instance.player.x = DataManager.Instance.player.targetX = item.player.x
      DataManager.Instance.player.y = DataManager.Instance.player.targetY = item.player.y
      DataManager.Instance.player.direction = item.player.direction
      DataManager.Instance.player.state = item.player.state
      DataManager.Instance.player.type = item.player.type

      DataManager.Instance.door.x = item.door.x
      DataManager.Instance.door.y = item.door.y
      DataManager.Instance.door.direction = item.door.direction
      DataManager.Instance.door.state = item.door.state

      for (let i = 0; i < DataManager.Instance.enemies.length; i++) {
        const enemy = item.enemies[i]
        DataManager.Instance.enemies[i].x = enemy.x
        DataManager.Instance.enemies[i].y = enemy.y
        DataManager.Instance.enemies[i].direction = enemy.direction
        DataManager.Instance.enemies[i].state = enemy.state
        DataManager.Instance.enemies[i].type = enemy.type
      }

      for (let i = 0; i < DataManager.Instance.burst.length; i++) {
        const burst = item.bursts[i]
        DataManager.Instance.burst[i].x = burst.x
        DataManager.Instance.burst[i].y = burst.y
        DataManager.Instance.burst[i].direction = burst.direction
        DataManager.Instance.burst[i].state = burst.state
        DataManager.Instance.burst[i].type = burst.type
      }

      for (let i = 0; i < DataManager.Instance.spikes.length; i++) {
        const one = item.spikes[i]
        DataManager.Instance.spikes[i].x = one.x
        DataManager.Instance.spikes[i].y = one.y
        DataManager.Instance.spikes[i].count = one.count
        DataManager.Instance.spikes[i].type = one.type
      }
    }
  }

  checkArrived() {
    const { x: playerX, y: playerY } = DataManager.Instance.player
    const { x: doorX, y: doorY, state: doorState } = DataManager.Instance.door
    if (playerX === doorX && playerY === doorY && doorState === ENTITY_STATE_ENUM.DEATH) {
      EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
    }
  }
}

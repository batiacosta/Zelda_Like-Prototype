import { PLAYER_ANIMATION_KEYS } from '../../common/assets';
import { Position } from '../../common/types';
import { isArcadePhysicsBody } from '../../common/utils';
import { ControlsComponent } from '../../components/game-object/controls-component';
import { InputComponent } from '../../components/input/input-component';
export type PlayerConfig = {
  scene: Phaser.Scene;
  position: Position;
  assetKey: string;
  frame?: number;
  controls: InputComponent;
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  #controlsComponent: ControlsComponent;
  constructor(config: PlayerConfig) {
    const { scene, position, assetKey, frame } = config;
    const { x, y } = position;
    super(scene, x, y, assetKey, frame || 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.#controlsComponent = new ControlsComponent(this, config.controls);
    this.play({ key: PLAYER_ANIMATION_KEYS.IDLE_DOWN, repeat: -1 }); // -1 to repeat indefinitly

    config.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this); // Listen the event emmited in scene Update and excecute this.update()
    config.scene.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => {
        // Once Phaser fires SHUTDOWN
        config.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this); // Unsubscribe from scenes UPDATE events
      },
      this,
    );
  }

  update(): void {
    const controls = this.#controlsComponent.controls;
    if (controls.isUpDown) {
      this.play({ key: PLAYER_ANIMATION_KEYS.IDLE_UP, repeat: -1 }, true);
    } else if (controls.isDownDown) {
      this.play({ key: PLAYER_ANIMATION_KEYS.IDLE_DOWN, repeat: -1 }, true);
    }

    if (controls.isLeftDown) {
      this.setFlipX(true);
      this.play({ key: PLAYER_ANIMATION_KEYS.IDLE_SIDE, repeat: -1 }, true);
    } else if (controls.isRightDown) {
      this.setFlipX(false);
      this.play({ key: PLAYER_ANIMATION_KEYS.IDLE_SIDE, repeat: -1 }, true);
    }
  }

  #updateVelocity(isX: boolean, value: number): void {
    if (!isArcadePhysicsBody(this.body)) {
      return;
    }
    if (isX) {
      this.body.velocity.x = value;
      return;
    }
    this.body.velocity.y = value;
  }
}

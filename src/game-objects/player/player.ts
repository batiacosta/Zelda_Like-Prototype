import { Direction, Position } from '../../common/types';
import { PLAYER_SPEED } from '../../components/config';
import { ControlsComponent } from '../../components/game-object/controls-component';
import { DirectionSomponent as DirectionComponent } from '../../components/game-object/direction_component';
import { SpeedComponent } from '../../components/game-object/speed-component';
import { InputComponent } from '../../components/input/input-component';
import { StateMachine } from '../../components/state-machine/state-machine';
import { CHARACTER_STATES } from '../../components/state-machine/states/character/character-states';
import { IdleState } from '../../components/state-machine/states/character/idle-state';
import { MoveState } from '../../components/state-machine/states/character/move-state';
export type PlayerConfig = {
  scene: Phaser.Scene;
  position: Position;
  assetKey: string;
  frame?: number;
  controls: InputComponent;
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  #controlsComponent: ControlsComponent;
  #stateMachine: StateMachine;
  #speedComponent: SpeedComponent;
  #directionComponent: DirectionComponent;

  constructor(config: PlayerConfig) {
    const { scene, position, assetKey, frame } = config;
    const { x, y } = position;
    super(scene, x, y, assetKey, frame || 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.#controlsComponent = new ControlsComponent(this, config.controls);
    this.#speedComponent = new SpeedComponent(this, PLAYER_SPEED);
    this.#stateMachine = new StateMachine('player');
    this.#stateMachine.addState(new IdleState(this));
    this.#stateMachine.addState(new MoveState(this));
    this.#stateMachine.setState(CHARACTER_STATES.IDLE_STATE);
    this.#directionComponent = new DirectionComponent(this);

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

  get controls(): InputComponent {
    return this.#controlsComponent.controls;
  }
  get speed(): number {
    return this.#speedComponent.speed;
  }

  get direction(): Direction {
    return this.#directionComponent.direction;
  }
  set direction(direction: Direction) {
    this.#directionComponent.direction = direction;
  }

  update(): void {
    this.#stateMachine.update();
  }
}

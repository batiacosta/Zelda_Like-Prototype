import Phaser from 'phaser';
import { InputComponent } from './input-component';

export class KeyboardComponent extends InputComponent {
  #cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  #attackKey: Phaser.Input.Keyboard.Key;
  #actionKey: Phaser.Input.Keyboard.Key;
  #enterKey: Phaser.Input.Keyboard.Key;
  constructor(keyboardPlugin: Phaser.Input.Keyboard.KeyboardPlugin) {
    super();
    this.#cursorKeys = keyboardPlugin.createCursorKeys(); // returns basic keys for movement actions
    this.#attackKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.#actionKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.#enterKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  get isUpDown(): boolean {
    return this.#cursorKeys.up.isDown;
  }

  get isUpJustDown(): boolean {
    // For UI navigation when Up is not hold but just pressed
    return Phaser.Input.Keyboard.JustDown(this.#cursorKeys.up);
  }

  get isDownDown(): boolean {
    return this.#cursorKeys.down.isDown;
  }

  get isJustDownDown(): boolean {
    // For UI navigation when Up is not hold but just pressed
    return Phaser.Input.Keyboard.JustDown(this.#cursorKeys.up);
  }

  get isLeftDown(): boolean {
    return this.#cursorKeys.left.isDown;
  }

  get isRightDown(): boolean {
    return this.#cursorKeys.right.isDown;
  }

  get isAttackKeyJustDown(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.#attackKey);
  }

  get isActionKeyJustDown(): boolean {
    return Phaser.Input.Keyboard.JustUp(this.#actionKey);
  }

  get isSelectKeyJustDown(): boolean {
    return this.#cursorKeys.shift.isDown;
  }

  get isEnterKeyJustDown(): boolean {
    return Phaser.Input.Keyboard.JustUp(this.#enterKey);
  }
}

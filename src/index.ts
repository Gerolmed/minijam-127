import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/Game';
import {HUDScene} from "./scenes/HUDScene";
import {MainMenuScene} from "./scenes/MainMenuScene";
import {PressToStart} from "./scenes/PressToStart";
import {DeathTransition} from "./scenes/DeathTransition";

new Phaser.Game(
  Object.assign(config, {
    scene: [PressToStart, MainMenuScene, GameScene, HUDScene, DeathTransition]
  })
);

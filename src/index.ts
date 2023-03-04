import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/Game';
import {HUDScene} from "./scenes/HUDScene";
import {MainMenuScene} from "./scenes/MainMenuScene";

new Phaser.Game(
  Object.assign(config, {
    scene: [MainMenuScene, GameScene, HUDScene]
  })
);

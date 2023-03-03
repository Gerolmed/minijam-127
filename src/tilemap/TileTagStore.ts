import {TilesetDef} from "../types/Tilemap";

export class TileTagStore {


    private tagToTile = new Map<string, number[]>();
    private tileToTags = new Map<number, string[]>();

    constructor(tilesets: TilesetDef[]) {
        tilesets.forEach(tileset => {
            tileset.enumTags.forEach(tag => {
                this.tagToTile.set(tag.enumValueId, tag.tileIds);

                tag.tileIds.forEach(tile => {
                    const tags = this.tileToTags.has(tile)? this.tileToTags.get(tile)! : [];
                    tags.push(tag.enumValueId);
                    this.tileToTags.set(tile, tags);
                })
            })
        })
    }

    getTags(tile: number): string[] {
        return this.tileToTags.get(tile) || [];
    }

    getTiles(tag: string): number[] {
        return this.tagToTile.get(tag) || [];
    }

}

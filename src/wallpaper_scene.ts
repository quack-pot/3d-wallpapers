import * as THREE from 'three';

export default abstract class WallpaperScene {
    public abstract get scene(): THREE.Scene;
    public abstract get camera(): THREE.PerspectiveCamera;
    public abstract get renderer(): THREE.WebGLRenderer;

    public abstract update(deltaTime: number): void;
    public abstract render(): void;
}
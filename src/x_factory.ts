import * as THREE from 'three';
import WallpaperScene from "./wallpaper_scene";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class XFactory extends WallpaperScene {
    private _scene = new THREE.Scene();
    private _camera = new THREE.PerspectiveCamera(
        70, // FOV
        1.0, // Aspect (Set Dynamically)
        0.1, // Near Plane
        1000, // Far Plane
    );

    private _renderer = new THREE.WebGLRenderer({ antialias: true });

    private _skyboxLoader = new THREE.CubeTextureLoader();
    private _modelLoader = new GLTFLoader();

    private _currentModel: THREE.Object3D = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
        }),
    );

    private _accumulatedTime: number = 0.0;
    
    constructor() {
        super();

        this._camera.position.setZ(5.0);

        this._scene.add(new THREE.AmbientLight(0xffffff, 1.0));
        this._scene.add(this._currentModel);

        // this._loadSky("assets/spongebob_bfbb/textures/");
        this._loadModel("assets/spongebob_bfbb/scene.gltf");
    }

    public get scene(): THREE.Scene { return this._scene; }
    public get camera(): THREE.PerspectiveCamera { return this._camera; }
    public get renderer(): THREE.WebGLRenderer { return this._renderer }

    private _loadSky(textureFolderPath: string) {
        this._skyboxLoader.setPath(textureFolderPath);

        const textureCube = this._skyboxLoader.load([
            "x0.png", "x3.png",
            "top.png", "bottom.png",
            "x1.png", "x2.png",
            ],
            undefined,
            undefined,
            (err) => console.error(`${textureFolderPath}:`, err),
        );

        this._scene.background = textureCube;
    }

    private _loadModel(modelPath: string) {
        this._modelLoader.load(
            modelPath,
            (model) => {
                this._scene.remove(this._currentModel);
                this._currentModel = model.scene;
                this._scene.add(this._currentModel);
            },
            (xhr) => console.log(`${modelPath}: ${(100.0 * xhr.loaded / xhr.total).toFixed(2)}% Loaded`),
            (err) => console.error(`${modelPath}:`, err),
        );
    }

    public override update(deltaTime: number) {
        this._accumulatedTime += deltaTime;

        this._currentModel.position.y = Math.sin(this._accumulatedTime) * 0.25;
        this._currentModel.rotation.y += 2.0 * deltaTime;

        this._camera.position.x = Math.cos(this._accumulatedTime) * 5.0;
        this._camera.position.z = Math.sin(this._accumulatedTime) * 5.0;
        this._camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    public render(): void {
        this._renderer.render(this._scene, this._camera);
    }
}
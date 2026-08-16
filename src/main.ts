import XFactory from './x_factory';
import WallpaperScene from './wallpaper_scene';

enum Wallpaper {
    X_FACTORY,
}

class App {
    private _wallpaper: WallpaperScene;

    private _lastTime: number;

    constructor(wallpaper: Wallpaper) {
        switch (wallpaper) {
            case Wallpaper.X_FACTORY:
            default: {
                this._wallpaper = new XFactory();
                break;
            }
        }

        document.body.appendChild(this._wallpaper.renderer.domElement)

        window.addEventListener("resize", this._handleWindowResize.bind(this));
        this._handleWindowResize();

        this._lastTime = Date.now() * 0.001;
        requestAnimationFrame(this._animate.bind(this));
    }

    private _handleWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspect = height > 0 ? width / height : 0;

        this._wallpaper.camera.aspect = aspect;
        this._wallpaper.camera.updateProjectionMatrix();

        this._wallpaper.renderer.setSize(width, height);
    }

    private _animate() {
        const currentTime = Date.now() * 0.001;
        const deltaTime = currentTime - this._lastTime;
        this._lastTime = currentTime;

        this._wallpaper.update(deltaTime);
        this._wallpaper.render();

        requestAnimationFrame(this._animate.bind(this));
    }
}

// Scene set here
new App(Wallpaper.X_FACTORY);
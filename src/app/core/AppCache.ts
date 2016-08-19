
import {EventEmitter} from 'fbemitter';


class AppCache extends EventEmitter {

    constructor(private mCache: ApplicationCache, private notifyUpdate = true) {
        super();
        this.mCache = applicationCache;
        if (this.mCache.status === this.mCache.UPDATEREADY) {
            this.onUpdateReady();
        }
        this.mCache.addEventListener('progress', this.onProgress.bind(this));
        this.mCache.addEventListener('updateready', this.onUpdateReady.bind(this));
        // this.onUpdateReady = bind(this.onUpdateReady, this);
        // this.onProgress = bind(this.onProgress, this);
        // this.cache = applicationCache;
        // this.notifyUpdate = true;
        // if (this.cache.status === this.cache.UPDATEREADY) {
        //     this.onUpdateReady();
        // }
        // $.on(this.cache, 'progress', this.onProgress);
        // $.on(this.cache, 'updateready', this.onUpdateReady);
    }
    public isEnabled() {
        return applicationCache && applicationCache.status !== applicationCache.UNCACHED;
    }
    public update = function () {
        this.notifyUpdate = true;
        this.cache.update();
    };

    public updateInBackground = function () {
        this.update();
    };

    public reload = function () {
        this.mCache.addEventListener('updateready noupdate error', function () {
            return window.location.pathname = '/';
        });
        this.updateInBackground();
    };

    private onProgress = function (event) {
        this.emit('progress', event);
    };

    private onUpdateReady = function () {
        if (this.notifyUpdate) {
            this.emit('updateready');
        }
    };
};

export {AppCache}






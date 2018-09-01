import User from '../helpers/getUser';
import getQueryParams from "../helpers/getQueryParams";

export default class Router {
    static routes = {};
    static data = {};

    static defaultRoute = null;
    static doAlways = [];

    static addRoute(_path, handler, checker=() => {}, uri) {
        const isMultiplePath = _path instanceof Array;
        const __path = isMultiplePath ? _path[0] : _path
        const __pathPushState = __path.slice(1, __path.length)

        this.routes[__path] = () => {
            const redirect = checker(this.data);
            if (redirect) return Router.navigate(redirect);
            const queryParams = getQueryParams(window.location.search)
            history.pushState('', __pathPushState, uri || __path);
            handler(this.data, queryParams);
        }

        if (isMultiplePath) {
            for (let path of _path.slice(1, _path.length)) {
                this.routes[path] = this.routes[_path[0]];
            }
        }
    }

    static addDoAlways(f) {
        this.doAlways.push(f);
    }

    static navigate(_path='/') {
        this.data = User();

        if (!this.routes[_path]) {
            this.defaultRoute(this.data);
        } else {
            this.routes[_path](this.data);
        }

        if (this.doAlways.length) {
            for (let f of this.doAlways) {
                f();
            }
        }
    }
}

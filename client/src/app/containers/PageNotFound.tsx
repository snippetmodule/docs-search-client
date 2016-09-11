import * as React from 'react';

class PageNotFound extends React.Component<any, any> {
    public render() {
        return (
        <main className ="_content" role="main" tabIndex="-1">
                <div className="_page _page-error">
                    <div className="_error">
                        <h1 className="_error-title"> The page failed to load. </h1>
                        <p className="_error-text"> It may be missing from the server (try reloading the app) or you could be offline.<br/>
                        If you keep seeing this, you're likely behind a proxy or firewall that blocks cross-domain requests. </p>
                        <p className="_error-links">
                            <a href="#" data-behavior="back" className="_error-link">Go back</a> ·
                            <a href="/#/dom_events/checking" target="_top" className="_error-link">Reload</a> ·
                            <a href="#" className="_error-link" data-retry="">Retry</a>
                        </p>
                    </div>
                </div>
        </main>
        );
    }
}

export {PageNotFound}
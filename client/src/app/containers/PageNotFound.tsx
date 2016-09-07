import * as React from 'react';

class PageNotFound extends React.Component<any, any> {
    public render() {
        return (
            <div class="_page _page-error">
                <div class="_error">
                    <h1 class="_error-title"> The page failed to load. </h1>
                    <p class="_error-text"> It may be missing from the server (try reloading the app) or you could be offline.<br />
                                If you keep seeing this, you're likely behind a proxy or firewall that blocks cross-domain requests. 
                    </p>
                    <p class="_error-links" >
                        <a href="#" data-behavior="back" class="_error-link"> Go back</a> ·
                        <a href="/#/apache_http_server/logs" target="_top" class="_error-link">Reload</a> ·
                        <a href="#" class="_error-link" data-retry="">Retry</a>
                    </p>
                </div>
            </div>
        );
    }
}

export {PageNotFound}
declare global {
    interface Window {
        FB: any;
        fbAsyncInit: () => void;
    }
}

export function initializeFacebook() {
    window.fbAsyncInit = function () {
        window.FB.init({
            appId: import.meta.env.VITE_FACEBOOK_APP_ID,
            cookie: true,
            xfbml: false,
            version: "v23.0",
        });
    };
}
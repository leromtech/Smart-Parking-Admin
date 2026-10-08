let echoPromise = null;

// Lazily create window.Echo once; resolves to the Echo instance.
export const initEcho = () => {
  if (!echoPromise) {
    echoPromise = Promise.all([import("pusher-js"), import("laravel-echo")])
      .then(([PusherModule, EchoModule]) => {
        window.Pusher = PusherModule.default;
        const Echo = EchoModule.default;
        window.Echo = new Echo({
          broadcaster: "reverb",
          key: import.meta.env.VITE_REVERB_APP_KEY,
          wsHost: import.meta.env.VITE_REVERB_HOST,
          wsPort: import.meta.env.VITE_REVERB_PORT,
          forceTLS: false,
          enabledTransports: ["ws"],
        });
        return window.Echo;
      })
      .catch((error) => {
        echoPromise = null;
        throw error;
      });
  }
  return echoPromise;
};

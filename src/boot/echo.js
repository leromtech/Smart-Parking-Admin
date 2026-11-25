import api from "./api";

let echoPromise = null;

// Zone channels are private, so each subscription is authorised against the
// API's broadcasting/auth route. Going through the shared axios client sends
// the token current at subscribe time, not the one present when Echo started.
const authorizer = (channel) => ({
  authorize: (socketId, callback) => {
    api
      .post("broadcasting/auth", { socket_id: socketId, channel_name: channel.name })
      .then((response) => callback(null, response.data))
      .catch((error) => callback(error));
  },
});

// Lazily create window.Echo once; resolves to the Echo instance.
export const initEcho = () => {
  if (!echoPromise) {
    echoPromise = Promise.all([import("pusher-js"), import("laravel-echo")])
      .then(([PusherModule, EchoModule]) => {
        window.Pusher = PusherModule.default;
        const Echo = EchoModule.default;
        const useTls = (import.meta.env.VITE_REVERB_SCHEME ?? "http") === "https";
        window.Echo = new Echo({
          broadcaster: "reverb",
          key: import.meta.env.VITE_REVERB_APP_KEY,
          wsHost: import.meta.env.VITE_REVERB_HOST,
          wsPort: import.meta.env.VITE_REVERB_PORT,
          wssPort: import.meta.env.VITE_REVERB_PORT,
          forceTLS: useTls,
          enabledTransports: ["ws", "wss"],
          authorizer,
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

// Reexport the native module. On web, it will be resolved to ListenerModule.web.ts
// and on native platforms to ListenerModule.ts
export { default } from './src/ListenerModule';
export { default as ListenerView } from './src/ListenerView';
export * from './src/Listener.types';

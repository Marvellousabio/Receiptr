// global.d.ts

// This declares that any import ending in .css is valid.
declare module '*.css' {
  // We use `any` here because we don't expect the imported value to be used.
  // It's a "side-effect" import.
  const content: any;
  export default content;
}
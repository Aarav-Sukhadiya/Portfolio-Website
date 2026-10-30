// Drafting grid shared by the backgrounds: solid 1px white lines every `size` px.
// The layer that uses it sets the faintness through its own opacity.
export function blueprintGrid(size) {
  return {
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)',
    backgroundSize: `${size}px ${size}px`,
  };
}

/**
 * Genesis illustration layer.
 *
 * Three section-scoped canvases, each owning its own renderer and disposing it
 * on unmount. Nothing here touches page-level grounds or the existing copy —
 * every section keeps the ground, layout and words it already had.
 */
export { HeroMachine } from './HeroMachine';
export { ScaleField } from './ScaleField';
export { GenesisFigure } from './GenesisFigure';

/**
 * Genesis illustration layer.
 *
 * `GenesisField` is one canvas spanning Approach and Scale; `HeroMachine` and
 * `GenesisFigure` are section-scoped. Each owns its renderer and disposes it
 * on unmount. Nothing here touches page-level grounds or the existing copy.
 */
export { GenesisField } from './GenesisField';
export { HeroMachine } from './HeroMachine';
export { GenesisFigure } from './GenesisFigure';

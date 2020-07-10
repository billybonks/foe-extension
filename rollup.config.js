import typescript from '@rollup/plugin-typescript';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import multi from '@rollup/plugin-multi-entry';

export default {
  input: [
    'src/index.ts',
    'src/ui/great-builing-progression-list/window.svelte',
    'src/ui/great-builing-progression-list/table'
  ],
  plugins: [
    typescript({
      exclude: 'node_modules/**',
    }),
    resolve(),
    svelte({
      include: 'src/ui/**/*.svelte',
      customElement: true,
    }),
    multi()
  ],

  output: {
    name: 'foe',
    file: 'dist/build.js',
    format: 'amd',
    amd: {
      define: 'enifed',
      id: 'foe',
    },
    sourcemap: true,
  },
};

# Shape experiment

The Shapes experiment at `#/shapes` contains 23 SVG silhouettes using the names
in the supplied Material references. They are symmetric reconstructions, not an
exact port of Material's official 35-shape library. It uses the reusable Shape,
ShapeGallery, and ShapeBrowser components. Geometry lives in
`src/lib/shapes.ts`; visual size and palette tokens live in `src/index.css`.

Each silhouette has a stable name and a closed path in the same 100-by-100
coordinate space. Regular polygons and repeated radial curves keep the cookie,
sunny, and clover forms balanced. Slanted has 180-degree rotational symmetry;
Fan, Oval, and Pill have diagonal reflection symmetry. Other forms have vertical
reflection symmetry, with additional radial symmetry where appropriate. Shapes
retain their reference orientations rather than forcing every form into the
same symmetry axis. Fixed thumbnail and label rows prevent wrapped names from
moving the shape upward.

Selecting a gallery tile automatically morphs the current preview into that
shape. The canvas contains only the preview on the left and a bounded,
scrollable three-column gallery on the right. The shared Scroller owns inertia,
scrollbars, and edge fades; its viewport is flush with the top and bottom canvas
edges on desktop. Narrow screens stack the preview above the gallery, preserving
three columns and the flush bottom edge. A shared canvas toolbar provides one
duration slider (200-3000ms); endpoint and playback controls remain removed.
This experiment does not change product component shapes.

## Material references

- [Overview and principles](https://m3.material.io/styles/shape/overview-principles):
  use abstract forms intentionally; shape need not have a fixed semantic meaning.
- [Corner radius scale](https://m3.material.io/styles/shape/corner-radius-scale):
  rounded rectangles and expressive silhouettes are different parts of the system.
- [Shape morph](https://m3.material.io/styles/shape/shape-morph): Material documents
  a platform-specific morph API and explicitly states that web is not available.

## Morph implementation

Flubber normalizes and interpolates different SVG path commands. The useShapeMorph
hook creates an interpolator on selection, starting from the currently displayed
path so interrupted animations do not snap to a previous endpoint. It owns
cancellable requestAnimationFrame playback and the unitless millisecond token
`--shape-morph-duration` (1200ms default), with toolbar overrides and range/step
tokens in the same CSS source. Reduced motion immediately displays the chosen
shape. This is a web experiment, not the Material morph API.

`tests/shapes.spec.ts` checks rendered symmetry, nonempty bounds, consistent
thumbnail positioning, label containment, three-column scrolling, automatic
morphing, rapid selection, shared scroll fades, edge alignment, duration changes,
and reduced motion on desktop and mobile.
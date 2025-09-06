export type BoardHandle = {
  /**
   * Exporta el SVG como PNG.
   * @param name Nombre base del archivo (sin extensión)
   * @param includeBG Si true, incluye la imagen/fondo completo en el rasterizado.
   */
  exportPNG: (name?: string, includeBG?: boolean) => void;
  /**
   * Exporta el SVG como PDF.
   * @param name Nombre base del archivo (sin extensión)
   * @param includeBG Si true, incluye la imagen/fondo completo en el rasterizado.
   */
  exportPDF: (name?: string, includeBG?: boolean) => void;
};
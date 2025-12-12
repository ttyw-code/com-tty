export enum Namespace {
  HTML = 'http://www.w3.org/1999/xhtml',
  SVG = 'http://www.w3.org/2000/svg',
  MATHML = 'http://www.w3.org/1998/Math/MathML',
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options?: ElementCreationOptions & { is?: string },
): HTMLElementTagNameMap[K] {
  return document.createElement(tagName, options)
}

export function createElementSVG<K extends keyof SVGElementTagNameMap>(
  tagName: K,
  options?: ElementCreationOptions & { is?: string },
): SVGElementTagNameMap[K] {
  return document.createElementNS(
    Namespace.SVG,
    tagName,
    options,
  ) as SVGElementTagNameMap[K]
}

export function createElementMathML<K extends keyof MathMLElementTagNameMap>(
  tagName: K,
  options?: ElementCreationOptions & { is?: string },
): MathMLElementTagNameMap[K] {
  return document.createElementNS(
    Namespace.MATHML,
    tagName,
    options,
  ) as MathMLElementTagNameMap[K]
}

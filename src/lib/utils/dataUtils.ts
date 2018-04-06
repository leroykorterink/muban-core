import cleanElement from './cleanElement';
import initComponents from './initComponents';

export function renderItem<T extends Element = HTMLElement>(
  container: HTMLElement,
  template: (data?: any) => string,
  data: any,
  append: boolean = false,
): T {
  return render<T>(container, append, () => template(data))[0];
}

export function renderItems<T extends Element = HTMLElement>(
  container: HTMLElement,
  template: (data?: any) => string,
  data: Array<any>,
  append: boolean = false,
) {
  return render<T>(container, append, () => data.reduce((html, d) => html + template(d), ''));
}

function render<T extends Element = HTMLElement>(
  container: HTMLElement,
  append: boolean,
  getHtml: () => string,
): Array<T> {
  if (!append) {
    // dispose all created component instances
    cleanElement(container);
    while (container.children.length) {
      container.removeChild(container.children[0]);
    }
  }

  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  div.innerHTML = getHtml();

  const children = <Array<T>>Array.from(div.children);
  for (const child of children) {
    fragment.appendChild(child);
  }

  container.appendChild(fragment);

  if (append) {
    // only init the newly added component(s)
    for (const child of children) {
      // TODO: Element (T) cannot be cast to HTMLElement (from initComponents)
      initComponents(<HTMLElement>(<any>child));
    }
  } else {
    // initialize new components for the new element
    initComponents(container);
  }

  return children;
}

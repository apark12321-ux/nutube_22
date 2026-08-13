export const SITE_DISPLAY_NAME = '나우크리에이터랩';
export const SITE_ENGLISH_NAME = 'Now Creator Lab';

const replaceText = (value: string) =>
  value
    .replace(/후미디어/g, SITE_DISPLAY_NAME)
    .replace(/WHOMEDIA/gi, SITE_ENGLISH_NAME)
    .replace(/NuTube/g, SITE_DISPLAY_NAME)
    .replace(/nutube/gi, SITE_ENGLISH_NAME);

const walkTextNodes = (root: Node) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node = walker.nextNode();

  while (node) {
    nodes.push(node as Text);
    node = walker.nextNode();
  }

  nodes.forEach((textNode) => {
    const next = replaceText(textNode.nodeValue || '');
    if (next !== textNode.nodeValue) textNode.nodeValue = next;
  });
};

const replaceAttributes = () => {
  const selectors = ['title', 'meta[content]', 'link[title]', '[aria-label]', '[title]', '[alt]'];
  document.querySelectorAll(selectors.join(',')).forEach((element) => {
    ['content', 'title', 'aria-label', 'alt'].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (!value) return;
      const next = replaceText(value);
      if (next !== value) element.setAttribute(attribute, next);
    });
  });

  document.title = replaceText(document.title);
};

export const applyBrandDisplayName = () => {
  if (typeof document === 'undefined') return;

  const apply = () => {
    walkTextNodes(document.body);
    replaceAttributes();
  };

  apply();

  const observer = new MutationObserver(() => apply());
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
};


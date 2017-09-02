import parse5 from 'parse5';

function traverse(parent, node, handler) {
  handler(parent, node);
  if (node.childNodes) {
    node.childNodes.forEach(n => traverse(node, n, handler));
  }
}

export default function convertHTML(html: string) {
  const varMap = new Map();

  const ast = parse5.parse(html);
  traverse(null, ast, (parent, node) => {
    switch (node.nodeName) {
      case 'var': {
        // OEH a variable!
        const attr = node.attrs.find(s => s.name === 'name');
        if (!attr) {
          throw new Error('There is a var with no name');
        }

        const { value: name } = attr;

        if (node.childNodes[0]) {
          varMap.set(name, node.childNodes[0].value);
        } else {
          // No value, delete from registry
          varMap.delete(name);
        }

        parent.childNodes = parent.childNodes.filter(n => n !== node);
      }
      case 'sum': {
        const vars = node.childNodes
          .map(n => n.nodeName)
          .filter(n => n !== '#text');

        const total = vars.reduce(
          (total, varName) => parseInt(varMap.get(varName), 10) + total,
          0
        );

        node.nodeName = 'div';
        node.tagName = 'div';

        node.childNodes = [
          {
            nodeName: '#text',
            value: '' + total,
          },
        ];
      }
    }
  });

  return parse5.serialize(ast);
}

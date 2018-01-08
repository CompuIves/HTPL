import parse5 from 'parse5';

function traverse(parent, node, handler) {
  handler(parent, node);
  if (node.childNodes) {
    node.childNodes.forEach(n => traverse(node, n, handler));
  }
}

let varMap;

function tagToValue(node) {
  switch (node.nodeName) {
    case 'sum': {
      const vars = node.childNodes.map(n => tagToValue(n)).filter(x => x);

      const total = vars.reduce(
        (total, varVal) => parseInt(varVal, 10) + total,
        0
      );

      return total;
    }
    case 'min': {
      const vars = node.childNodes.map(n => tagToValue(n)).filter(x => x);

      const min = Math.min(...vars);

      return min;
    }
    case 'max': {
      const vars = node.childNodes.map(n => tagToValue(n)).filter(x => x);

      const max = Math.max(...vars);

      return max;
    }
    case 'product': {
      const vars = node.childNodes.map(n => tagToValue(n)).filter(x => );

      const product = vars.reduce(
        (product, value) => parseInt(value, 10) * product,
        0
      );

      return product;
    }
    case 'var': {
      const attr = node.attrs.find(s => s.name === 'name');
      if (!attr) {
        throw new Error('There is a var with no name');
      }

      const { value: name } = attr;

      return varMap.get(name);
    }
    case '#text': {
      return node.value ? node.value.replace('\n', '').trim() : null;
    }
    default: {
      return node.childNodes.map(n => tagToValue(n)).filter(x => x)[0];
    }
  }
}

export default function convertHTML(html: string) {
  varMap = new Map();

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

        const firstChildNode = node.childNodes
          .map(x => tagToValue(x))
          .filter(x => x)[0];

        if (firstChildNode) {
          varMap.set(name, firstChildNode);
        }

        parent.childNodes = parent.childNodes.filter(n => n !== node);
      }
      case 'min':
      case 'max':
      case 'sum': {
        const total = tagToValue(node);

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
  console.log(varMap);
  return parse5
    .serialize(ast)
    .split('\n')
    .filter(x => x.trim())
    .join('\n');
}

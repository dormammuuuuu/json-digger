# JSONHelper

**JSONHelper** is a utility for efficiently traversing and manipulating nested JSON objects. It helps users search for nodes, retrieve parents, find siblings, and more, in hierarchical or tree-structured data. This is the modernization of `dabeng/json-digger`.

## Features

- **findNodeById**: Retrieve a node by its unique ID.
- **findOneNode**: Find the first node that satisfies specified conditions.
- **findNodes**: Retrieve all nodes that match the provided conditions.
- **findParent**: Get the parent node of a given node by its ID.
- **findSiblings**: Retrieve the sibling nodes of a given node.
- **findAncestors**: Get the ancestors of a node.
- **addChildren**: Add child nodes to a given node.
- **addSiblings**: Add sibling nodes to a given node.
- **addRoot**: Replace the root node.
- **updateNode**: Update a single node's information.
- **updateNodes**: Update multiple nodes' information.
- **removeNode**: Remove a node by its ID.
- **removeNodes**: Remove multiple nodes by their IDs or conditions.

## Installation

```bash
npm install json-helper
```

## Usage

```ts
import { JSONHelper } from 'json-helper';

const datasource = {
  pk: '1',
  name: 'Lao Lao',
  title: 'general manager',
  inferiors: [/* Nested children */]
};

const helper = JSONHelper({
  datasource,
  idProp: 'pk',
  childrenProp: 'inferiors'
});

const node = helper.findNodeById('1');  // Find node by ID
```

## Methods

### `findNodeById(id)`
Find a node by its ID.

```ts
const node = helper.findNodeById('1');
```

### `findOneNode(conditions)`
Find the first node that matches a set of conditions.

```ts
const node = helper.findOneNode({ name: 'Xiang Xiang' });
```

### `findNodes(conditions)`
Find all nodes matching the conditions.

```ts
const nodes = helper.findNodes({ title: /engineer/i });
```

### `findParent(id)`
Find the parent of a node by its ID.

```ts
const parent = helper.findParent('2');
```

### `findSiblings(id)`
Find the siblings of a node by its ID.

```ts
const siblings = helper.findSiblings('2');
```

### `findAncestors(id)`
Get the ancestors of a node.

```ts
const ancestors = helper.findAncestors('6');
```

### `addChildren(id, data)`
Add child nodes to a given node.

```ts
helper.addChildren('2', { pk: '11', name: 'New Child' });
```

### `addSiblings(id, data)`
Add sibling nodes to a given node.

```ts
helper.addSiblings('2', { pk: '11', name: 'New Sibling' });
```

### `addRoot(data)`
Replace the root node with new data.

```ts
helper.addRoot({ pk: '11', name: 'New Root' });
```

### `updateNode(data)`
Update the properties of a node.

```ts
helper.updateNode({ pk: '1', name: 'Updated Name' });
```

### `updateNodes(ids, data)`
Update multiple nodes' properties.

```ts
helper.updateNodes(['1', '2'], { title: 'New Title' });
```

### `removeNode(id)`
Remove a node by its ID.

```ts
helper.removeNode('2');
```

### `removeNodes(param)`
Remove multiple nodes based on IDs or conditions.

```ts
helper.removeNodes(['2', '3']);
```

## Running Tests

Run tests using the following command:

```bash
npm run test
```
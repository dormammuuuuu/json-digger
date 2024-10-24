interface Node {
  [key: string]: any;
  children?: Node[];
}

interface JSONHelperProps {
  datasource: Node;
  idProp: string;
  childrenProp: string;
}

export function JSONHelper({
  datasource,
  idProp,
  childrenProp,
}: JSONHelperProps) {
  const matchConditions = (obj: Node, conditions: Record<string, any>) => {
    let flag = true;

    Object.keys(conditions).some((item) => {
      const condition = conditions[item];
      if (
        typeof condition === 'string' ||
        typeof condition === 'number' ||
        typeof condition === 'boolean'
      ) {
        if (obj[item] !== condition) {
          flag = false;
          return true;
        }
      } else if (condition instanceof RegExp) {
        if (!condition.test(obj[item])) {
          flag = false;
          return true;
        }
      } else if (typeof condition === 'object') {
        Object.keys(condition).some((subitem) => {
          switch (subitem) {
            case '>':
              if (!(obj[item] > condition[subitem])) flag = false;
              break;
            case '<':
              if (!(obj[item] < condition[subitem])) flag = false;
              break;
            case '>=':
              if (!(obj[item] >= condition[subitem])) flag = false;
              break;
            case '<=':
              if (!(obj[item] <= condition[subitem])) flag = false;
              break;
            case '!==':
              if (!(obj[item] !== condition[subitem])) flag = false;
              break;
          }
          return !flag;
        });
      }
      return !flag;
    });

    return flag;
  };

  const findNodeById = (id: string | number): Node | null => {
    if (!id) return null;

    if (datasource[idProp] === id) return datasource;

    const recursiveFind = (nodes: Node[]): Node | null => {
      for (const node of nodes) {
        if (node[idProp] === id) return node;
        if (node[childrenProp]) {
          const found = recursiveFind(node[childrenProp]);
          if (found) return found;
        }
      }
      return null;
    };

    return recursiveFind(datasource[childrenProp] || []);
  };

  const findOneNode = (conditions: Record<string, any>): Node | null => {
    if (!conditions || !Object.keys(conditions).length) return null;

    if (matchConditions(datasource, conditions)) return datasource;

    const recursiveFind = (nodes: Node[]): Node | null => {
      for (const node of nodes) {
        if (matchConditions(node, conditions)) return node;
        if (node[childrenProp]) {
          const found = recursiveFind(node[childrenProp]);
          if (found) return found;
        }
      }
      return null;
    };

    return recursiveFind(datasource[childrenProp] || []);
  };

  const findNodes = (conditions: Record<string, any>): Node[] => {
    const nodes: Node[] = [];

    const recursiveFind = (obj: Node) => {
      if (matchConditions(obj, conditions)) nodes.push(obj);
      if (obj[childrenProp]) {
        for (const node of obj[childrenProp]) {
          recursiveFind(node);
        }
      }
    };

    recursiveFind(datasource);
    return nodes;
  };

  const findParent = (id: string | number): Node | null => {
    if (!id) return null;
    if (datasource[childrenProp]?.some((child: Node) => child[idProp] === id)) {
      return datasource;
    }
    const recursiveFind = (nodes: Node[]): Node | null => {
      for (const node of nodes) {
        if (node[childrenProp]?.some((child: Node) => child[idProp] === id))
          return node;
        if (node[childrenProp]) {
          const found = recursiveFind(node[childrenProp]);
          if (found) return found;
        }
      }
      return null;
    };
    return recursiveFind(datasource[childrenProp] || []);
  };

  const findSiblings = (id: string | number): Node[] => {
    if (!id || datasource[idProp] === id) return [];

    const parent = findParent(id);
    return parent
      ? parent[childrenProp]?.filter((node: Node) => node[idProp] !== id) || []
      : [];
  };

  const findAncestors = (id: string | number): Node[] => {
    if (!id || id === datasource[idProp]) return [];

    const ancestors: Node[] = [];
    const recursiveFind = (nodeId: string | number): Node[] => {
      const parent = findParent(nodeId);
      if (parent) {
        ancestors.push(parent);
        return recursiveFind(parent[idProp]);
      }
      return ancestors;
    };

    return recursiveFind(id);
  };

  const validateParams = (
    id: string | number,
    data: Node | Node[],
  ): boolean => {
    if (
      !id ||
      !data ||
      typeof data !== 'object' ||
      (Array.isArray(data) && !data.length)
    )
      return false;

    if (Array.isArray(data)) {
      return data.every(
        (item) => typeof item === 'object' && Object.keys(item).length,
      );
    }

    return Object.keys(data).length > 0;
  };

  const addChildren = (id: string | number, data: Node | Node[]): boolean => {
    if (!validateParams(id, data)) return false;

    const parent = findNodeById(id);
    if (!parent) return false;

    if (Array.isArray(data)) {
      parent[childrenProp]
        ? parent[childrenProp].push(...data)
        : (parent[childrenProp] = data);
    } else {
      parent[childrenProp]
        ? parent[childrenProp].push(data)
        : (parent[childrenProp] = [data]);
    }
    return true;
  };

  const addSiblings = (id: string | number, data: Node | Node[]): boolean => {
    if (!validateParams(id, data)) return false;

    const parent = findParent(id);
    if (!parent) return false;

    if (Array.isArray(data)) {
      parent[childrenProp]?.push(...data);
    } else {
      parent[childrenProp]?.push(data);
    }
    return true;
  };

  const addRoot = (data: Node): boolean => {
    if (!data || typeof data !== 'object' || !Object.keys(data).length)
      return false;

    datasource[childrenProp] = [{ ...datasource }];
    delete data[childrenProp];

    Object.keys(datasource)
      .filter((prop) => prop !== childrenProp)
      .forEach((prop) => {
        if (!data[prop]) delete datasource[prop];
      });

    Object.assign(datasource, data);
    return true;
  };

  const updateNode = (data: Node): boolean => {
    if (
      !data ||
      typeof data !== 'object' ||
      !Object.keys(data).length ||
      !data[idProp]
    )
      return false;

    const node = findNodeById(data[idProp]);
    if (node) {
      Object.assign(node, data);
      return true;
    }
    return false;
  };

  const updateNodes = (ids: (string | number)[], data: Node): boolean => {
    if (!ids.length || !validateParams(ids[0], data)) return false;

    return ids.every((id) => {
      data[idProp] = id;
      return updateNode(data);
    });
  };

  const removeNode = (id: string | number): boolean => {
    if (id === datasource[idProp]) return false;

    const parent = findParent(id);
    if (!parent) return false;

    const index = parent[childrenProp]?.findIndex(
      (child: Node) => child[idProp] === id,
    );
    if (index !== undefined && index > -1) {
      parent[childrenProp]?.splice(index, 1);
      return true;
    }
    return false;
  };

  const removeNodes = (
    param: string | number | (string | number)[] | Record<string, any>,
  ): boolean => {
    if (!param || (Array.isArray(param) && !param.length)) return false;

    if (typeof param === 'string' || typeof param === 'number') {
      return removeNode(param);
    } else if (Array.isArray(param)) {
      return param.every((id) => removeNode(id));
    } else {
      const nodes = findNodes(param);
      return nodes.every((node) => removeNode(node[idProp]));
    }
  };

  return {
    findNodeById,
    findOneNode,
    findNodes,
    findParent,
    findSiblings,
    findAncestors,
    addChildren,
    addSiblings,
    addRoot,
    updateNode,
    updateNodes,
    removeNode,
    removeNodes,
  };
}

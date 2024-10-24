import { JSONHelper } from '../src/index';

// Define the types for the datasource and helper variables
interface DataSource {
  pk: string;
  name: string;
  title: string;
  isShareholder: boolean;
  birthYear: number;
  inferiors?: DataSource[];
}

let datasource: DataSource;
let helper: ReturnType<typeof JSONHelper>;

describe('JSONHelper', () => {
  beforeEach(() => {
    datasource = {
      pk: '1',
      name: 'Lao Lao',
      title: 'general manager',
      isShareholder: true,
      birthYear: 1940,
      inferiors: [
        {
          pk: '2',
          name: 'Bo Miao',
          title: 'department manager',
          isShareholder: true,
          birthYear: 1960,
          inferiors: [
            {
              pk: '10',
              name: 'Ren Wu',
              title: 'principle engineer',
              isShareholder: false,
              birthYear: 1960,
            },
          ],
        },
        {
          pk: '3',
          name: 'Su Miao',
          title: 'department manager',
          isShareholder: true,
          birthYear: 1961,
          inferiors: [
            {
              pk: '4',
              name: 'Tie Hua',
              title: 'principle engineer',
              isShareholder: false,
              birthYear: 1961,
            },
            {
              pk: '5',
              name: 'Hei Hei',
              title: 'senior engineer',
              isShareholder: false,
              birthYear: 1980,
              inferiors: [
                {
                  pk: '6',
                  name: 'Pang Pang',
                  title: 'UE engineer',
                  isShareholder: false,
                  birthYear: 1984,
                },
                {
                  pk: '7',
                  name: 'Xiang Xiang',
                  title: 'QA engineer',
                  isShareholder: false,
                  birthYear: 2014,
                },
              ],
            },
          ],
        },
        {
          pk: '8',
          name: 'Hong Miao',
          title: 'department manager',
          isShareholder: true,
          birthYear: 1962,
        },
        {
          pk: '9',
          name: 'Chun Miao',
          title: 'department manager',
          isShareholder: true,
          birthYear: 1963,
        },
      ],
    };
    helper = JSONHelper({
      datasource,
      idProp: 'pk',
      childrenProp: 'inferiors',
    });
  });

  describe('#findNodeById()', () => {
    test('should return node "Lao Lao" when id is "1"', () => {
      const node = helper.findNodeById('1');
      expect(node?.name).toBe('Lao Lao');
    });

    test('should return node "Tie Hua" when id is "4"', () => {
      const node = helper.findNodeById('4');
      expect(node?.name).toBe('Tie Hua');
    });

    test('should return node "Pang Pang" when id is "6"', () => {
      const node = helper.findNodeById('6');
      expect(node?.name).toBe('Pang Pang');
    });

    test("should return null when the node with given id doesn't exist", () => {
      const node = helper.findNodeById('0');
      expect(node).toBeNull();
    });

    test("should return null when users don't provide valid parameters", () => {
      expect(helper.findNodeById(null as unknown as string)).toBeNull();
      expect(helper.findNodeById(undefined as unknown as string)).toBeNull();
      expect(helper.findNodeById('' as unknown as string)).toBeNull();
    });
  });

  describe('#findOneNode()', () => {
    test('should return root itself when using root node id to search', () => {
      const node = helper.findOneNode({ pk: '1' });
      expect(node).toEqual(datasource);
    });

    test('should return an employee whose name is "Xiang Xiang"', () => {
      const node = helper.findOneNode({ name: 'Xiang Xiang' });
      expect(node?.name).toBe('Xiang Xiang');
    });

    test('should return an employee who is born in 1980', () => {
      const node = helper.findOneNode({ birthYear: 1980 });
      expect(node?.birthYear).toBe(1980);
    });

    test('should return a shareholder node', () => {
      const node = helper.findOneNode({ isShareholder: true });
      expect(node?.isShareholder).toBe(true);
    });

    test("should return null when the node doesn't exist", () => {
      expect(helper.findOneNode({ name: 'Dan Dan' })).toBeNull();
      expect(helper.findOneNode({ birthYear: 2000 })).toBeNull();
      expect(helper.findOneNode({ title: /intern/i })).toBeNull();
    });
  });

  describe('#findNodes()', () => {
    test('should return nodes with the name "Xiang Xiang"', () => {
      const nodes = helper.findNodes({ name: 'Xiang Xiang' });
      expect(nodes.length).toBe(1);
      expect(nodes[0].name).toBe('Xiang Xiang');
    });

    test('should return 5 engineer nodes', () => {
      const nodes = helper.findNodes({ title: /engineer/i });
      expect(nodes.length).toBe(5);
    });

    test("should return [] when nodes don't exist", () => {
      const nodes = helper.findNodes({ name: 'Dan Dan' });
      expect(nodes).toEqual([]);
    });
  });

  describe('#findParent()', () => {
    test('should return node "Lao Lao" when id is "2"', () => {
      const node = helper.findParent('2');
      expect(node?.name).toBe('Lao Lao');
    });

    test("should return null when the parent node doesn't exist", () => {
      const node1 = helper.findParent('1');
      expect(node1).toBeNull();
    });
  });

  describe('#findSiblings()', () => {
    test('should return sibling nodes when searching for siblings', () => {
      const nodes = helper.findSiblings('2');
      expect(nodes.length).toBe(3);
      expect(nodes[nodes.length - 1].name).toBe('Chun Miao');
    });
  });
});

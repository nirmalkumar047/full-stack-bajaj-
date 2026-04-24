const { isValid } = require("../utils/validator");

exports.build = (data) => {
    let validEdges = new Set();
    let invalid_entries = [];
    let duplicate_edges = [];

    let graph = {};
    let parentOf = {};
    let nodes = new Set();

    // STEP 1: VALIDATION + BUILD GRAPH
    data.forEach(item => {
        item = item.trim();

        if (!isValid(item)) {
            invalid_entries.push(item);
            return;
        }

        if (validEdges.has(item)) {
            if (!duplicate_edges.includes(item)) {
                duplicate_edges.push(item);
            }
            return;
        }

        validEdges.add(item);

        let [p, c] = item.split("->");

        // DIAMOND CASE: only first parent allowed
        if (parentOf[c]) return;

        parentOf[c] = p;

        if (!graph[p]) graph[p] = [];
        graph[p].push(c);

        nodes.add(p);
        nodes.add(c);
    });

    let visitedGlobal = new Set();
    let hierarchies = [];
    let total_cycles = 0;

    function dfs(node, visitedPath) {
        if (visitedPath.has(node)) {
            return { cycle: true };
        }

        visitedPath.add(node);
        let tree = {};
        let depth = 1;

        if (graph[node]) {
            for (let child of graph[node]) {
                let res = dfs(child, new Set(visitedPath));
                if (res.cycle) return { cycle: true };

                tree[child] = res.tree;
                depth = Math.max(depth, res.depth + 1);
            }
        }

        return { tree, depth };
    }

    // STEP 2: FIND ROOTS
    let roots = [...nodes].filter(n => !parentOf[n]);

    // STEP 3: BUILD TREES FROM ROOTS
    roots.forEach(root => {
        if (visitedGlobal.has(root)) return;

        let res = dfs(root, new Set());

        if (res.cycle) {
            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });
            total_cycles++;
        } else {
            hierarchies.push({
                root,
                tree: { [root]: res.tree },
                depth: res.depth
            });
        }

        visitedGlobal.add(root);
    });

    // STEP 4: HANDLE CYCLES (NO ROOT CASE)
    nodes.forEach(node => {
        if (!visitedGlobal.has(node)) {
            // find cycle group
            let cycleNodes = [];
            let current = node;

            while (!cycleNodes.includes(current)) {
                cycleNodes.push(current);
                current = parentOf[current];
            }

            let root = [...cycleNodes].sort()[0];

            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });

            total_cycles++;

            cycleNodes.forEach(n => visitedGlobal.add(n));
        }
    });

    // STEP 5: SUMMARY
    let total_trees = hierarchies.filter(h => !h.has_cycle).length;

    let largest_tree_root = "";
    let maxDepth = 0;

    hierarchies.forEach(h => {
        if (!h.has_cycle) {
            if (
                h.depth > maxDepth ||
                (h.depth === maxDepth && h.root < largest_tree_root)
            ) {
                maxDepth = h.depth;
                largest_tree_root = h.root;
            }
        }
    });

    return {
        hierarchies,
        invalid_entries,
        duplicate_edges,
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root
        }
    };
};
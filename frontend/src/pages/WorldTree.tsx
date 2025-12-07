import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface TreeNode {
  name: string;
  id: string;
  parentId: string | null; // 親ノードのID（ルートの場合はnull）
  children?: TreeNode[]; // D3用の階層構造（buildHierarchyで構築）
  x?: number; // D3フォースシミュレーション用
  y?: number; // D3フォースシミュレーション用
  fx?: number | null; // 固定X座標
  fy?: number | null; // 固定Y座標
  depth?: number; // 深さ（ルートから0, 1, 2...）- 階層構築後に自動計算
}

const WorldTree = () => {
  const [isEditing, setIsEditing] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<TreeNode, undefined> | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [focusNodeId, setFocusNodeId] = useState<string>('root');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 900 });

  // ツリーデータ（フラット配列）
  const flatTreeData: TreeNode[] = [
    { id: 'root', name: '私は、大切な人たちと共に、誠実に生き、困難に立ち向かい、慈しみの感情に満ちていたい。', parentId: null },

    // Root の子（より具体的な方向性）
    { id: '1', name: '困難がやってきたとき、逃げずに正面から向き合う', parentId: 'root' },
    { id: '2', name: '仲間に対して、誠実で支えとなる存在でありたい', parentId: 'root' },
    { id: '3', name: '家族や友人を想いながら、感謝と愛情を持って接する', parentId: 'root' },

    // 1 の子（より具体的な態度）
    { id: '1-1', name: '恐れを感じても、それを認め、一歩ずつ前に進む', parentId: '1' },
    { id: '1-2', name: '失敗を恐れず、学びの機会として捉える', parentId: '1' },

    // 2 の子（より具体的な態度）
    { id: '2-1', name: '相手の話に真摯に耳を傾け、理解しようと努める', parentId: '2' },
    { id: '2-2', name: '自分の強みを活かして、チームに貢献する', parentId: '2' },

    // 3 の子（より具体的な態度）
    { id: '3-1', name: '日々の小さな喜びを共有し、共に成長する', parentId: '3' },

    // 1-1 の子（より具体的な実践方法）
    { id: '1-1-1', name: '朝、不安を感じたら深呼吸をして、今日できることを1つ決める', parentId: '1-1' },
    { id: '1-1-2', name: '困難な状況では、まず事実と感情を分けて整理する', parentId: '1-1' },

    // 1-2 の子（より具体的な実践方法）
    { id: '1-2-1', name: '失敗したときは、すぐに「ここから何を学べるか」を考える', parentId: '1-2' },

    // 2-1 の子（より具体的な実践方法）
    { id: '2-1-1', name: '会話中は相手の目を見て、遮らずに最後まで聞く', parentId: '2-1' },
    { id: '2-1-2', name: 'すぐに助言せず、まず相手の気持ちに共感する', parentId: '2-1' },

    // 2-2 の子（より具体的な実践方法）
    { id: '2-2-1', name: '技術的な知識を惜しみなく共有する', parentId: '2-2' },

    // 3-1 の子（より具体的な実践方法）
    { id: '3-1-1', name: '夕食時に「今日の良かったこと」を家族で1つずつ話す', parentId: '3-1' },
    { id: '3-1-2', name: '感謝の気持ちを言葉にして伝える', parentId: '3-1' },

    // 1-1-1 の子（より具体的な行動）
    { id: '1-1-1-1', name: '毎朝7時に5分間の瞑想を行い、今日の意図を設定する', parentId: '1-1-1' },
    { id: '1-1-1-2', name: '手帳に「今日の最も大切な1つ」を書き出す', parentId: '1-1-1' },

    // 1-1-2 の子（より具体的な行動）
    { id: '1-1-2-1', name: 'ノートに「起きた事実」と「自分の感情」を2列で書き出す', parentId: '1-1-2' },

    // 1-2-1 の子（より具体的な行動）
    { id: '1-2-1-1', name: '失敗ノートに「状況・原因・学び・次のアクション」を記録', parentId: '1-2-1' },
    { id: '1-2-1-2', name: '週1回、失敗ノートを見直し、パターンを見つける', parentId: '1-2-1' },

    // 2-1-1 の子（より具体的な行動）
    { id: '2-1-1-1', name: 'スマホは裏返しにして、視界から外す', parentId: '2-1-1' },
    { id: '2-1-1-2', name: '相手の話が終わったら、「〜ということですね」と要約して確認する', parentId: '2-1-1' },

    // 2-1-2 の子（より具体的な行動）
    { id: '2-1-2-1', name: '「大変だったね」「それは嬉しいね」など感情を言葉にする', parentId: '2-1-2' },

    // 2-2-1 の子（より具体的な行動）
    { id: '2-2-1-1', name: '週1回、学んだことをチームに15分で共有する時間を作る', parentId: '2-2-1' },
    { id: '2-2-1-2', name: '困っている人がいたら、30分以内にペアプログラミングを申し出る', parentId: '2-2-1' },

    // 3-1-1 の子（より具体的な行動）
    { id: '3-1-1-1', name: '毎晩19時の夕食で、スマホをしまい、順番に話す', parentId: '3-1-1' },
    { id: '3-1-1-2', name: '相手の話には「それいいね！」「すごいね！」と必ず肯定的な反応をする', parentId: '3-1-1' },

    // 3-1-2 の子（より具体的な行動）
    { id: '3-1-2-1', name: '週に1回、「ありがとう」と具体的な理由を添えて伝える', parentId: '3-1-2' },
    { id: '3-1-2-2', name: '月に1度、手書きのメッセージカードを渡す', parentId: '3-1-2' },
  ];

  // フラット配列から階層構造を構築し、深さを計算
  const buildHierarchy = (nodes: TreeNode[]): TreeNode => {
    // IDでマップを作成
    const nodeMap = new Map<string, TreeNode>();
    nodes.forEach(node => {
      nodeMap.set(node.id, { ...node, children: [], depth: 0 });
    });

    // 親子関係を構築
    let root: TreeNode | null = null;
    nodeMap.forEach(node => {
      if (node.parentId === null) {
        root = node;
        node.depth = 0;
      } else {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(node);
        }
      }
    });

    if (!root) {
      throw new Error('Root node not found');
    }

    // 深さを再帰的に計算
    const calculateDepth = (node: TreeNode, depth: number) => {
      node.depth = depth;
      if (node.children) {
        node.children.forEach(child => calculateDepth(child, depth + 1));
      }
    };
    calculateDepth(root, 0);

    return root;
  };

  // 階層構造を構築
  const treeData = buildHierarchy(flatTreeData);

  // ノードをIDで検索（フラット配列から検索）
  const findNodeById = (id: string): TreeNode | null => {
    return flatTreeData.find(node => node.id === id) || null;
  };

  // コンテナのサイズを監視
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: Math.max(rect.height, 900) });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // テキストを短縮する関数
  const truncateText = (text: string, maxLength: number = 10) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // フォーカスノードからの距離に応じたスタイル設定
  // 和の配色：墨色、深緑、木の色、和紙色などを使用
  const getNodeStyle = (distanceFromFocus: number, isFocus: boolean) => {
    // 距離に応じたスタイル（距離0=フォーカス、1=隣接、2=2ホップ先、...）
    const stylesByDistance = [
      { radius: 90, fill: '#2d3e3f', stroke: '#1a2425', strokeWidth: 4, textColor: '#f5f5dc', fontSize: 14, fontWeight: 'bold' }, // 墨色
      { radius: 70, fill: '#4a6b5e', stroke: '#3a5a4d', strokeWidth: 3, textColor: '#f5f5dc', fontSize: 12, fontWeight: '600' }, // 深緑
      { radius: 55, fill: '#8b9f8d', stroke: '#6b7f6d', strokeWidth: 2, textColor: '#1a2425', fontSize: 11, fontWeight: '500' }, // 若葉色
      { radius: 50, fill: '#d4c5b0', stroke: '#b4a590', strokeWidth: 2, textColor: '#2d3e3f', fontSize: 10, fontWeight: 'normal' }, // 木の色
      { radius: 45, fill: '#f5f5dc', stroke: '#d5d5bc', strokeWidth: 2, textColor: '#2d3e3f', fontSize: 9, fontWeight: 'normal' }, // 和紙色
    ];

    const style = stylesByDistance[Math.min(distanceFromFocus, 4)];

    if (isFocus) {
      return {
        ...style,
        strokeWidth: style.strokeWidth * 2,
        stroke: '#8b5a3c', // 朱色（控えめ）でフォーカスを強調
      };
    }

    return style;
  };

  // フォーカスノードからの距離を計算（BFS）
  const calculateDistanceFromFocus = (focusId: string): Map<string, number> => {
    const distances = new Map<string, number>();
    const queue: { id: string; distance: number }[] = [{ id: focusId, distance: 0 }];
    const visited = new Set<string>();

    // 隣接リストを構築（双方向）
    const adjacency = new Map<string, string[]>();
    flatTreeData.forEach(node => {
      if (!adjacency.has(node.id)) adjacency.set(node.id, []);
      if (node.parentId) {
        if (!adjacency.has(node.parentId)) adjacency.set(node.parentId, []);
        adjacency.get(node.id)!.push(node.parentId);
        adjacency.get(node.parentId)!.push(node.id);
      }
    });

    // BFSで距離を計算
    while (queue.length > 0) {
      const { id, distance } = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      distances.set(id, distance);

      const neighbors = adjacency.get(id) || [];
      neighbors.forEach(neighborId => {
        if (!visited.has(neighborId)) {
          queue.push({ id: neighborId, distance: distance + 1 });
        }
      });
    }

    return distances;
  };

  // フォーカス/ホバー時のスタイル更新用のuseEffect（シミュレーションは再実行しない）
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // フォーカスノードからの距離を計算
    const distances = calculateDistanceFromFocus(focusNodeId);

    // 円のスタイルを更新
    svg.selectAll<SVGCircleElement, any>('circle')
      .attr('r', (d: any) => {
        const isFocus = d.id === focusNodeId;
        const distance = distances.get(d.id) || 0;
        return getNodeStyle(distance, isFocus).radius;
      })
      .attr('fill', (d: any) => {
        const isFocus = d.id === focusNodeId;
        const distance = distances.get(d.id) || 0;
        return getNodeStyle(distance, isFocus).fill;
      })
      .attr('stroke', (d: any) => {
        const isFocus = d.id === focusNodeId;
        const isHovered = d.id === hoveredNodeId;
        const distance = distances.get(d.id) || 0;
        if (isHovered && !isFocus) {
          return '#5a7a6b'; // 深い緑
        }
        return getNodeStyle(distance, isFocus).stroke;
      })
      .attr('stroke-width', (d: any) => {
        const isFocus = d.id === focusNodeId;
        const isHovered = d.id === hoveredNodeId;
        const distance = distances.get(d.id) || 0;
        const baseWidth = getNodeStyle(distance, isFocus).strokeWidth;
        return isHovered ? baseWidth * 1.5 : baseWidth;
      });

    // アイコンの位置を更新
    svg.selectAll<SVGTextElement, any>('text')
      .filter(function() {
        // foreignObjectではないtextのみ（アイコン）
        const parent = this.parentNode;
        if (!parent) return false;
        return d3.select(parent as Element).select('foreignObject').empty() === false;
      })
      .attr('dy', (d: any) => {
        const isFocus = d.id === focusNodeId;
        const distance = distances.get(d.id) || 0;
        const r = getNodeStyle(distance, isFocus).radius;
        return -r - 10;
      });

    // foreignObjectのサイズと位置を更新
    svg.selectAll<SVGForeignObjectElement, any>('foreignObject')
      .attr('x', (d: any) => {
        const isFocus = d.id === focusNodeId;
        const distance = distances.get(d.id) || 0;
        const r = getNodeStyle(distance, isFocus).radius;
        return -r;
      })
      .attr('y', (d: any) => {
        const isFocus = d.id === focusNodeId;
        const distance = distances.get(d.id) || 0;
        const r = getNodeStyle(distance, isFocus).radius;
        return -r + 10;
      })
      .attr('width', (d: any) => {
        const isFocus = d.id === focusNodeId;
        const distance = distances.get(d.id) || 0;
        const r = getNodeStyle(distance, isFocus).radius;
        return r * 2;
      })
      .attr('height', (d: any) => {
        const isFocus = d.id === focusNodeId;
        const distance = distances.get(d.id) || 0;
        const r = getNodeStyle(distance, isFocus).radius;
        return r * 2;
      });

    // テキストのスタイルを更新
    svg.selectAll<HTMLDivElement, any>('foreignObject > div > div')
      .style('color', (d: any) => {
        const isFocus = d.id === focusNodeId;
        const distance = distances.get(d.id) || 0;
        return getNodeStyle(distance, isFocus).textColor;
      })
      .style('font-size', (d: any) => {
        const isFocus = d.id === focusNodeId;
        const distance = distances.get(d.id) || 0;
        const baseSize = getNodeStyle(distance, isFocus).fontSize;
        return `${baseSize}px`;
      })
      .style('font-weight', (d: any) => {
        const isFocus = d.id === focusNodeId;
        const distance = distances.get(d.id) || 0;
        return getNodeStyle(distance, isFocus).fontWeight;
      });
  }, [hoveredNodeId, focusNodeId]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = dimensions.width;
    const height = dimensions.height;

    // SVGをクリア
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .style('font-family', 'system-ui, sans-serif');

    // シャドウフィルターを定義
    const defs = svg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'drop-shadow')
      .attr('height', '130%');

    filter.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 3);

    filter.append('feOffset')
      .attr('dx', 0)
      .attr('dy', 2)
      .attr('result', 'offsetblur');

    filter.append('feComponentTransfer')
      .append('feFuncA')
      .attr('type', 'linear')
      .attr('slope', 0.3);

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    // ズーム機能
    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // 階層構造を使ってノードとリンクを生成
    const root = d3.hierarchy(treeData);
    const allNodes = root.descendants().map(d => ({
      ...d.data,
      hierarchyData: d
    }));
    const allLinks = root.links().map(d => ({
      source: d.source.data.id,
      target: d.target.data.id,
      depth: d.target.data.depth || 0
    }));

    // 親ノードのマップを作成
    const parentMap = new Map<string, any>();
    allLinks.forEach(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      parentMap.set(targetId, sourceId);
    });

    // 放射状配置を促進するカスタムフォース
    const radialForce = () => {
      allNodes.forEach((node: any) => {
        if (node.id === 'root') return;

        const parentId = parentMap.get(node.id);
        if (!parentId) return;

        const parent = allNodes.find(n => n.id === parentId);
        if (!parent || !parent.x || !parent.y) return;

        // 祖父母ノードを取得
        const grandparentId = parentMap.get(parentId);
        let directionX: number, directionY: number;

        if (grandparentId) {
          const grandparent = allNodes.find(n => n.id === grandparentId);
          if (grandparent && grandparent.x && grandparent.y) {
            // 祖父母→親の方向ベクトルを計算
            directionX = parent.x - grandparent.x;
            directionY = parent.y - grandparent.y;
          } else {
            // 祖父母が見つからない場合は、中心から親への方向を使用
            directionX = parent.x - width / 2;
            directionY = parent.y - height / 2;
          }
        } else {
          // 親がルートの場合、中心から放射状に配置
          directionX = parent.x - width / 2;
          directionY = parent.y - height / 2;
        }

        // 方向ベクトルを正規化
        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        if (length > 0) {
          directionX /= length;
          directionY /= length;

          // 深さに応じた距離を設定
          const desiredDistance = node.depth === 1 ? 200 : node.depth === 2 ? 150 : node.depth === 3 ? 120 : 100;

          // 理想的な位置を計算（親から方向ベクトル方向に配置）
          const idealX = parent.x + directionX * desiredDistance;
          const idealY = parent.y + directionY * desiredDistance;

          // 現在の位置と理想的な位置の差を計算し、力として適用
          const strength = 0.1; // 力の強さ（調整可能）
          node.vx = (node.vx || 0) + (idealX - (node.x || 0)) * strength;
          node.vy = (node.vy || 0) + (idealY - (node.y || 0)) * strength;
        }
      });
    };

    // rootノードの位置を中央に固定
    const rootNode = allNodes.find(n => n.id === 'root');
    if (rootNode) {
      rootNode.fx = width / 2;
      rootNode.fy = height / 2;
    }

    // 初期フォーカスノードからの距離を計算
    const initialDistances = calculateDistanceFromFocus(focusNodeId);

    // フォースシミュレーションの設定
    const simulation = d3.forceSimulation(allNodes as any)
      .force('link', d3.forceLink(allLinks)
        .id((d: any) => d.id)
        .distance(d => {
          const link = d as any;
          // 深さに応じた距離を設定
          return link.depth === 1 ? 200 : link.depth === 2 ? 150 : link.depth === 3 ? 120 : 100;
        })
      )
      .force('charge', d3.forceManyBody().strength(-500))
      .force('collision', d3.forceCollide().radius((d: any) => {
        // 最大半径を使用して衝突を計算（フォーカス時のサイズを考慮）
        const distance = initialDistances.get(d.id) || 0;
        const baseRadius = getNodeStyle(distance, false).radius;
        const focusRadius = getNodeStyle(distance, true).radius;
        return Math.max(baseRadius, focusRadius) + 10;
      }))
      .force('radial', radialForce); // 放射状配置フォースを追加

    simulationRef.current = simulation as any;

    // リンクを描画
    const link = g.append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.5)
      .selectAll('line')
      .data(allLinks)
      .join('line')
      .attr('stroke', (d) => {
        // 和の配色：墨色から緑系のグラデーション
        const colors = ['#3a4a4c', '#4a5a5c', '#5a6b6d', '#6a7b7d', '#7a8b8d'];
        return colors[Math.min(d.depth, 4)];
      })
      .attr('stroke-width', (d) => {
        return Math.max(4 - d.depth * 0.5, 1.5);
      });

    // ツールチップ用のdiv
    let tooltip = d3.select('body').select<HTMLDivElement>('.world-tree-tooltip');
    if (tooltip.empty()) {
      tooltip = d3.select('body')
        .append('div')
        .attr('class', 'world-tree-tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background-color', 'rgba(0, 0, 0, 0.9)')
        .style('color', 'white')
        .style('padding', '12px 16px')
        .style('border-radius', '8px')
        .style('font-size', '14px')
        .style('max-width', '300px')
        .style('word-wrap', 'break-word')
        .style('z-index', '1000')
        .style('pointer-events', 'none')
        .style('line-height', '1.5')
        .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.3)');
    }

    // ノードグループを作成
    const node = g.append('g')
      .selectAll('g')
      .data(allNodes)
      .join('g')
      .style('cursor', 'pointer')
      .on('click', (_event: any, d: any) => {
        setFocusNodeId(d.id);

        // ノードを中心に持ってくる
        const currentTransform = d3.zoomTransform(svg.node()!);
        const targetX = width / 2 - d.x * currentTransform.k;
        const targetY = height / 2 - d.y * currentTransform.k;

        svg.transition()
          .duration(750)
          .call(
            zoom.transform as any,
            d3.zoomIdentity
              .translate(targetX, targetY)
              .scale(currentTransform.k)
          );
      })
      .on('mouseover', (event: any, d: any) => {
        setHoveredNodeId(d.id);
        tooltip
          .style('visibility', 'visible')
          .html(`<div style="font-weight: 600;">${d.name}</div>`);
      })
      .on('mousemove', (event: any) => {
        tooltip
          .style('top', (event.pageY + 15) + 'px')
          .style('left', (event.pageX + 15) + 'px');
      })
      .on('mouseout', () => {
        setHoveredNodeId(null);
        tooltip.style('visibility', 'hidden');
      });

    // ノードの円を描画（初期スタイルのみ設定、後でuseEffectで更新）
    node.append('circle')
      .attr('r', (d: any) => {
        const distance = initialDistances.get(d.id) || 0;
        return getNodeStyle(distance, false).radius;
      })
      .attr('fill', (d: any) => {
        const distance = initialDistances.get(d.id) || 0;
        return getNodeStyle(distance, false).fill;
      })
      .attr('stroke', (d: any) => {
        const distance = initialDistances.get(d.id) || 0;
        return getNodeStyle(distance, false).stroke;
      })
      .attr('stroke-width', (d: any) => {
        const distance = initialDistances.get(d.id) || 0;
        return getNodeStyle(distance, false).strokeWidth;
      })
      .attr('filter', 'url(#drop-shadow)');

    // テキストを追加（短縮版）
    node.append('foreignObject')
      .attr('x', (d: any) => {
        const distance = initialDistances.get(d.id) || 0;
        const r = getNodeStyle(distance, false).radius;
        return -r;
      })
      .attr('y', (d: any) => {
        const distance = initialDistances.get(d.id) || 0;
        const r = getNodeStyle(distance, false).radius;
        return -r + 10;
      })
      .attr('width', (d: any) => {
        const distance = initialDistances.get(d.id) || 0;
        const r = getNodeStyle(distance, false).radius;
        return r * 2;
      })
      .attr('height', (d: any) => {
        const distance = initialDistances.get(d.id) || 0;
        const r = getNodeStyle(distance, false).radius;
        return r * 2;
      })
      .append('xhtml:div')
      .style('width', '100%')
      .style('height', '100%')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('justify-content', 'center')
      .style('text-align', 'center')
      .style('padding', '8px')
      .style('overflow', 'hidden')
      .append('div')
      .style('color', (d: any) => {
        const distance = initialDistances.get(d.id) || 0;
        return getNodeStyle(distance, false).textColor;
      })
      .style('font-size', (d: any) => {
        const distance = initialDistances.get(d.id) || 0;
        return `${getNodeStyle(distance, false).fontSize}px`;
      })
      .style('font-weight', (d: any) => {
        const distance = initialDistances.get(d.id) || 0;
        return getNodeStyle(distance, false).fontWeight;
      })
      .style('line-height', '1.3')
      .style('word-break', 'break-word')
      .style('pointer-events', 'none')
      .text((d: any) => truncateText(d.name, 10));

    // ドラッグ機能（rootノードは除外）
    const drag = d3.drag<SVGGElement, any>()
      .on('start', (event, d) => {
        if (d.id === 'root') return; // rootノードはドラッグ不可
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        if (d.id === 'root') return; // rootノードはドラッグ不可
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (d.id === 'root') return; // rootノードはドラッグ不可
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag as any);

    // シミュレーションの更新
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => {
          const sourceNode = allNodes.find(n => n.id === d.source.id || n.id === d.source);
          return sourceNode?.x || 0;
        })
        .attr('y1', (d: any) => {
          const sourceNode = allNodes.find(n => n.id === d.source.id || n.id === d.source);
          return sourceNode?.y || 0;
        })
        .attr('x2', (d: any) => {
          const targetNode = allNodes.find(n => n.id === d.target.id || n.id === d.target);
          return targetNode?.x || 0;
        })
        .attr('y2', (d: any) => {
          const targetNode = allNodes.find(n => n.id === d.target.id || n.id === d.target);
          return targetNode?.y || 0;
        });

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
      // ツールチップを削除
      d3.select('body').select('.world-tree-tooltip').remove();
    };
  }, [dimensions]);

  // ツリーの統計を計算
  const countNodes = (node: TreeNode): number => {
    let count = 1;
    if (node.children) {
      node.children.forEach(child => {
        count += countNodes(child);
      });
    }
    return count;
  };

  const calculateDepth = (node: TreeNode, depth = 0): number => {
    if (!node.children || node.children.length === 0) return depth;
    return Math.max(...node.children.map(child => calculateDepth(child, depth + 1)));
  };

  const countLeaves = (node: TreeNode): number => {
    if (!node.children || node.children.length === 0) return 1;
    return node.children.reduce((sum, child) => sum + countLeaves(child), 0);
  };

  const totalNodes = countNodes(treeData);
  const maxDepth = calculateDepth(treeData);
  const leafCount = countLeaves(treeData);

  const focusNode = findNodeById(focusNodeId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-50 rounded-2xl shadow-md p-8 border border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-stone-800">WorldTree</h2>
            <p className="text-stone-600 mt-2">大事なことを毎日思い出す</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-3 bg-emerald-700 text-stone-50 rounded-lg hover:bg-emerald-800 transition-colors font-medium"
          >
            {isEditing ? '完了' : '編集'}
          </button>
        </div>

        <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-sm text-emerald-900">
            <strong>💡 ヒント:</strong> ノードをドラッグして自由に配置できます。
            マウスホイールでズーム、背景をドラッグで移動できます。
            ノードにマウスを重ねると全文が表示され、クリックするとそのノードが中心に移動します。
          </p>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="bg-gradient-to-br from-stone-50/50 via-white to-emerald-50/30 rounded-2xl shadow-md p-8 border border-stone-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <span className="text-2xl">🌳</span>
            私の価値観ツリー
          </h3>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFocusNodeId('root')}
              className="px-4 py-2 bg-stone-100 border-2 border-stone-300 rounded-lg hover:bg-stone-200 transition-colors text-sm font-medium text-stone-700"
            >
              中心に戻る
            </button>
          </div>
        </div>

        {/* Current Focus Info */}
        {focusNode && (
          <div className="mb-4 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="text-xs text-amber-700 font-medium mb-1">フォーカス中</div>
                <div className="text-sm font-semibold text-amber-900">{focusNode.name}</div>
              </div>
            </div>
          </div>
        )}

        <div ref={containerRef} className="border-2 border-stone-300 rounded-xl bg-stone-50/30 overflow-hidden" style={{ height: '900px' }}>
          <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
        </div>

        {isEditing && (
          <div className="mt-8 pt-6 border-t border-stone-200">
            <button className="px-4 py-2 bg-emerald-700 text-stone-50 rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新しい枝を追加
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-stone-50 rounded-xl shadow-md p-6 text-center border border-stone-200">
          <div className="text-3xl font-bold text-emerald-700">{totalNodes}</div>
          <div className="text-sm text-stone-600 mt-1">全ノード数</div>
        </div>
        <div className="bg-stone-50 rounded-xl shadow-md p-6 text-center border border-stone-200">
          <div className="text-3xl font-bold text-emerald-700">{maxDepth + 1}</div>
          <div className="text-sm text-stone-600 mt-1">最大階層</div>
        </div>
        <div className="bg-stone-50 rounded-xl shadow-md p-6 text-center border border-stone-200">
          <div className="text-3xl font-bold text-emerald-700">{leafCount}</div>
          <div className="text-sm text-stone-600 mt-1">具体的な行動</div>
        </div>
      </div>

      {/* Reflection Questions */}
      <div className="bg-stone-50 rounded-2xl shadow-md p-8 border border-stone-200">
        <h3 className="text-xl font-bold text-stone-800 mb-4">深層の価値観に触れるための質問</h3>
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-stone-800 font-medium">今日、死を迎えるとしたら、あなたはどのような状態でありたいですか？</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-stone-800 font-medium">今日、世界が終わるとしたら、あなたは何をして過ごしますか？</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldTree;

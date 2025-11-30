import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface TreeNode {
  name: string;
  level: number;
  icon: string;
  children?: TreeNode[];
}

const WorldTree = () => {
  const [isEditing, setIsEditing] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });

  // ツリーデータ
  const treeData: TreeNode = {
    name: '私は、大切な人たちと共に、誠実に生き、困難に立ち向かい、慈しみの感情に満ちていたい。',
    level: 0,
    icon: '🌳',
    children: [
      {
        name: '困難がやってきたとき、逃げずに正面から向き合う',
        level: 1,
        icon: '🌿',
        children: [
          {
            name: '恐れを感じても、それを認め、一歩ずつ前に進む',
            level: 2,
            icon: '🍃',
            children: [
              {
                name: '朝、不安を感じたら深呼吸をして、今日できることを1つ決める',
                level: 3,
                icon: '🌱',
                children: [
                  {
                    name: '毎朝7時に5分間の瞑想を行い、今日の意図を設定する',
                    level: 4,
                    icon: '✨',
                  },
                  {
                    name: '手帳に「今日の最も大切な1つ」を書き出す',
                    level: 4,
                    icon: '✨',
                  },
                ],
              },
              {
                name: '困難な状況では、まず事実と感情を分けて整理する',
                level: 3,
                icon: '🌱',
                children: [
                  {
                    name: 'ノートに「起きた事実」と「自分の感情」を2列で書き出す',
                    level: 4,
                    icon: '✨',
                  },
                ],
              },
            ],
          },
          {
            name: '失敗を恐れず、学びの機会として捉える',
            level: 2,
            icon: '🍃',
            children: [
              {
                name: '失敗したときは、すぐに「ここから何を学べるか」を考える',
                level: 3,
                icon: '🌱',
                children: [
                  {
                    name: '失敗ノートに「状況・原因・学び・次のアクション」を記録',
                    level: 4,
                    icon: '✨',
                  },
                  {
                    name: '週1回、失敗ノートを見直し、パターンを見つける',
                    level: 4,
                    icon: '✨',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: '仲間に対して、誠実で支えとなる存在でありたい',
        level: 1,
        icon: '🌿',
        children: [
          {
            name: '相手の話に真摯に耳を傾け、理解しようと努める',
            level: 2,
            icon: '🍃',
            children: [
              {
                name: '会話中は相手の目を見て、遮らずに最後まで聞く',
                level: 3,
                icon: '🌱',
                children: [
                  {
                    name: 'スマホは裏返しにして、視界から外す',
                    level: 4,
                    icon: '✨',
                  },
                  {
                    name: '相手の話が終わったら、「〜ということですね」と要約して確認する',
                    level: 4,
                    icon: '✨',
                  },
                ],
              },
              {
                name: 'すぐに助言せず、まず相手の気持ちに共感する',
                level: 3,
                icon: '🌱',
                children: [
                  {
                    name: '「大変だったね」「それは嬉しいね」など感情を言葉にする',
                    level: 4,
                    icon: '✨',
                  },
                ],
              },
            ],
          },
          {
            name: '自分の強みを活かして、チームに貢献する',
            level: 2,
            icon: '🍃',
            children: [
              {
                name: '技術的な知識を惜しみなく共有する',
                level: 3,
                icon: '🌱',
                children: [
                  {
                    name: '週1回、学んだことをチームに15分で共有する時間を作る',
                    level: 4,
                    icon: '✨',
                  },
                  {
                    name: '困っている人がいたら、30分以内にペアプログラミングを申し出る',
                    level: 4,
                    icon: '✨',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: '家族や友人を想いながら、感謝と愛情を持って接する',
        level: 1,
        icon: '🌿',
        children: [
          {
            name: '日々の小さな喜びを共有し、共に成長する',
            level: 2,
            icon: '🍃',
            children: [
              {
                name: '夕食時に「今日の良かったこと」を家族で1つずつ話す',
                level: 3,
                icon: '🌱',
                children: [
                  {
                    name: '毎晩19時の夕食で、スマホをしまい、順番に話す',
                    level: 4,
                    icon: '✨',
                  },
                  {
                    name: '相手の話には「それいいね！」「すごいね！」と必ず肯定的な反応をする',
                    level: 4,
                    icon: '✨',
                  },
                ],
              },
              {
                name: '感謝の気持ちを言葉にして伝える',
                level: 3,
                icon: '🌱',
                children: [
                  {
                    name: '週に1回、「ありがとう」と具体的な理由を添えて伝える',
                    level: 4,
                    icon: '✨',
                  },
                  {
                    name: '月に1度、手書きのメッセージカードを渡す',
                    level: 4,
                    icon: '✨',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  // レベルに応じたスタイル設定
  const getNodeStyle = (level: number) => {
    const styles = [
      { radius: 80, fill: '#6366f1', stroke: '#4f46e5', strokeWidth: 4, textColor: '#ffffff', fontSize: 14, fontWeight: 'bold' },
      { radius: 60, fill: '#c7d2fe', stroke: '#818cf8', strokeWidth: 3, textColor: '#1e293b', fontSize: 12, fontWeight: '600' },
      { radius: 50, fill: '#ffffff', stroke: '#a5b4fc', strokeWidth: 2, textColor: '#334155', fontSize: 11, fontWeight: '500' },
      { radius: 45, fill: '#f0fdf4', stroke: '#86efac', strokeWidth: 2, textColor: '#374151', fontSize: 10, fontWeight: 'normal' },
      { radius: 40, fill: '#fffbeb', stroke: '#fcd34d', strokeWidth: 2, textColor: '#4b5563', fontSize: 9, fontWeight: 'normal' },
    ];
    return styles[level] || styles[4];
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const width = dimensions.width;
    const height = dimensions.height;
    const radius = Math.min(width, height) / 2 - 150;

    // SVGをクリア
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
      .style('font-family', 'system-ui, sans-serif');

    // ズーム機能
    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // ツリーレイアウトを作成
    const tree = d3.tree<TreeNode>()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    const root = d3.hierarchy(treeData);
    tree(root);

    // リンクを描画（親から子への線）
    g.append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.4)
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr('stroke', d => {
        const level = (d.target.data as TreeNode).level;
        const colors = ['#4f46e5', '#818cf8', '#a5b4fc', '#86efac', '#fcd34d'];
        return colors[Math.min(level, 4)];
      })
      .attr('stroke-width', d => {
        const level = (d.target.data as TreeNode).level;
        return Math.max(3 - level * 0.5, 1);
      })
      .attr('d', d3.linkRadial<any, d3.HierarchyPointNode<TreeNode>>()
        .angle(d => d.x)
        .radius(d => d.y));

    // ノードグループを作成
    const node = g.append('g')
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('transform', d => {
        const angle = d.x;
        const r = d.y;
        const x = r * Math.cos(angle - Math.PI / 2);
        const y = r * Math.sin(angle - Math.PI / 2);
        return `translate(${x},${y})`;
      });

    // ノードの円を描画
    node.append('circle')
      .attr('r', d => getNodeStyle((d.data as TreeNode).level).radius)
      .attr('fill', d => getNodeStyle((d.data as TreeNode).level).fill)
      .attr('stroke', d => getNodeStyle((d.data as TreeNode).level).stroke)
      .attr('stroke-width', d => getNodeStyle((d.data as TreeNode).level).strokeWidth)
      .attr('filter', 'url(#drop-shadow)');

    // アイコンを追加
    node.append('text')
      .attr('dy', -25)
      .attr('text-anchor', 'middle')
      .attr('font-size', d => {
        const level = (d.data as TreeNode).level;
        return level === 0 ? 32 : level === 1 ? 24 : level === 2 ? 20 : level === 3 ? 18 : 16;
      })
      .text(d => (d.data as TreeNode).icon);

    // テキストを追加
    node.append('foreignObject')
      .attr('x', d => -getNodeStyle((d.data as TreeNode).level).radius)
      .attr('y', d => -getNodeStyle((d.data as TreeNode).level).radius + 10)
      .attr('width', d => getNodeStyle((d.data as TreeNode).level).radius * 2)
      .attr('height', d => getNodeStyle((d.data as TreeNode).level).radius * 2)
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
      .style('color', d => getNodeStyle((d.data as TreeNode).level).textColor)
      .style('font-size', d => `${getNodeStyle((d.data as TreeNode).level).fontSize}px`)
      .style('font-weight', d => getNodeStyle((d.data as TreeNode).level).fontWeight)
      .style('line-height', '1.3')
      .style('word-break', 'break-word')
      .text(d => (d.data as TreeNode).name);

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

  }, [dimensions, treeData]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">WorldTree</h2>
            <p className="text-gray-600 mt-2">大事なことを毎日思い出す</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            {isEditing ? '完了' : '編集'}
          </button>
        </div>

        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <p className="text-sm text-indigo-900">
            <strong>💡 ヒント:</strong> ツリーはドラッグして移動、マウスホイールでズームできます。
            中心に根本の価値観があり、そこから放射状に枝が広がっています。
          </p>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 rounded-2xl shadow-md p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <span className="text-2xl">🌳</span>
          私の価値観ツリー
        </h3>

        <div className="border-2 border-gray-200 rounded-xl bg-white overflow-hidden">
          <svg ref={svgRef} style={{ width: '100%', height: '900px' }} />
        </div>

        {isEditing && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
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
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-indigo-600">{totalNodes}</div>
          <div className="text-sm text-gray-600 mt-1">全ノード数</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{maxDepth + 1}</div>
          <div className="text-sm text-gray-600 mt-1">最大階層</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-pink-600">{leafCount}</div>
          <div className="text-sm text-gray-600 mt-1">具体的な行動</div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">階層の意味</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
            <span className="text-2xl">🌳</span>
            <div>
              <div className="font-semibold text-gray-900">根本（中心）</div>
              <div className="text-xs text-gray-600">あなたの最も大切な価値観</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <span className="text-2xl">🌿</span>
            <div>
              <div className="font-semibold text-gray-900">主要な柱</div>
              <div className="text-xs text-gray-600">価値観を実現するための大きな方向性</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-2xl">🍃</span>
            <div>
              <div className="font-semibold text-gray-900">具体的な態度</div>
              <div className="text-xs text-gray-600">どのような態度で臨むか</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <span className="text-xl">🌱</span>
            <div>
              <div className="font-semibold text-gray-900">実践方法</div>
              <div className="text-xs text-gray-600">どのように実践するか</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
            <span className="text-base">✨</span>
            <div>
              <div className="font-semibold text-gray-900">具体的な行動</div>
              <div className="text-xs text-gray-600">今日からできる明確なアクション</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reflection Questions */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">深層の価値観に触れるための質問</h3>
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-purple-900 font-medium">今日、死を迎えるとしたら、あなたはどのような状態でありたいですか？</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-purple-900 font-medium">今日、世界が終わるとしたら、あなたは何をして過ごしますか？</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldTree;

import { useState } from 'react';

interface TreeNode {
  id: string;
  content: string;
  children: TreeNode[];
  expanded: boolean;
}

const WorldTree = () => {
  const [tree] = useState<TreeNode>({
    id: 'root',
    content: '私は、大切な人たちと共に、誠実に生き、困難に立ち向かい、慈しみの感情に満ちていたい。',
    expanded: true,
    children: [
      {
        id: '1',
        content: '困難がやってきたとき、逃げずに正面から向き合う',
        expanded: false,
        children: [
          {
            id: '1-1',
            content: '恐れを感じても、それを認め、一歩ずつ前に進む',
            expanded: false,
            children: [],
          },
          {
            id: '1-2',
            content: '失敗を恐れず、学びの機会として捉える',
            expanded: false,
            children: [],
          },
        ],
      },
      {
        id: '2',
        content: '仲間に対して、誠実で支えとなる存在でありたい',
        expanded: false,
        children: [
          {
            id: '2-1',
            content: '相手の話に真摯に耳を傾け、理解しようと努める',
            expanded: false,
            children: [],
          },
          {
            id: '2-2',
            content: '自分の強みを活かして、チームに貢献する',
            expanded: false,
            children: [],
          },
        ],
      },
      {
        id: '3',
        content: '家族や友人を想いながら、感謝と愛情を持って接する',
        expanded: false,
        children: [
          {
            id: '3-1',
            content: '日々の小さな喜びを共有し、共に成長する',
            expanded: false,
            children: [],
          },
        ],
      },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);

  const TreeNodeComponent = ({ node, level = 0 }: { node: TreeNode; level?: number }) => {
    const [expanded, setExpanded] = useState(node.expanded);

    return (
      <div className={`${level > 0 ? 'ml-6 mt-3' : ''}`}>
        <div
          className={`
            p-4 rounded-lg border-2 transition-all
            ${level === 0
              ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-300 shadow-md'
              : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm'}
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={`${level === 0 ? 'text-lg font-bold text-gray-900' : 'text-gray-800'}`}>
                {node.content}
              </p>
            </div>
            {node.children.length > 0 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-3 text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {expanded ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>

        {expanded && node.children.length > 0 && (
          <div className="mt-2 border-l-2 border-indigo-200 pl-2">
            {node.children.map((child) => (
              <TreeNodeComponent key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

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
            <strong>💡 ヒント:</strong> より鮮明に想像するために、大事なことを細かく分化発展させましょう。
            例えば、どのような苦難がやってきたときに、どのような態度でそれに立ち向かいたいのか。
          </p>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">私の価値観ツリー</h3>
        <TreeNodeComponent node={tree} />

        {isEditing && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              + 新しい枝を追加
            </button>
          </div>
        )}
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

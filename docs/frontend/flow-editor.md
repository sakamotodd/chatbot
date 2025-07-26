# フローエディタ画面 仕様書

## 概要
Instagramインスタントウィンキャンペーンのフローエディタに関するフロントエンド画面の詳細仕様。
ビジュアルフローエディタ、ドラッグ&ドロップ操作、ノード・エッジ管理、リアルタイムプレビュー機能を提供します。

## 関連バックエンドAPI
```
/api/in_instantwin_templates
/api/in_instantwin_nodes  
/api/in_instantwin_edges
/api/flow
```

---

## 画面一覧

### 1. フローエディタメイン画面

#### 画面パス
```
/flow-editor
/flow-editor/:templateId
/campaigns/:campaignId/flow-editor
/prizes/:prizeId/flow-editor
```

#### 画面説明
キャンペーンフローの視覚的な編集を行うメイン画面です。キャンバス、ツールパレット、プロパティパネルから構成されます。

#### コンポーネント構成
```tsx
// pages/flow-editor/index.tsx
const FlowEditorPage: React.FC = () => {
  const { templateId, campaignId, prizeId } = useParams();
  const searchParams = useSearchParams();
  
  return (
    <PageLayout 
      title="フローエディタ" 
      fullScreen={true}
      className="h-screen overflow-hidden"
    >
      <div className="flex h-full">
        {/* ツールパレット */}
        <div className="w-64 border-r border-gray-200 bg-gray-50">
          <NodePalette />
        </div>
        
        {/* メインキャンバス */}
        <div className="flex-1 relative">
          <FlowEditorToolbar />
          <FlowCanvas />
          <FlowMiniMap />
        </div>
        
        {/* プロパティパネル */}
        <div className="w-80 border-l border-gray-200 bg-white">
          <PropertyPanel />
        </div>
      </div>
      
      {/* モーダル */}
      <NodeEditModal />
      <EdgeEditModal />
      <FlowPreviewModal />
    </PageLayout>
  );
};
```

#### 主要機能

##### 1.1 フローキャンバス
```tsx
interface FlowCanvasProps {
  templateId?: number;
  readOnly?: boolean;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({ templateId, readOnly = false }) => {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPosition, setDragStartPosition] = useState<Position | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });

  // フローデータの読み込み
  const { data: flowData, isLoading } = useGetFlowDataQuery(templateId);
  
  useEffect(() => {
    if (flowData) {
      setNodes(flowData.nodes || []);
      setEdges(flowData.edges || []);
    }
  }, [flowData]);

  // ドラッグ&ドロップ処理
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    const nodeType = event.dataTransfer.getData('application/flow-node');
    if (!nodeType) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const position = {
      x: (event.clientX - rect.left - viewport.x) / viewport.zoom,
      y: (event.clientY - rect.top - viewport.y) / viewport.zoom
    };

    const newNode: FlowNode = {
      id: `node-${Date.now()}`,
      type: nodeType,
      position,
      data: getDefaultNodeData(nodeType),
      templateId: templateId || 0
    };

    setNodes(prev => [...prev, newNode]);
  }, [viewport, templateId]);

  // ノード選択処理
  const handleNodeClick = useCallback((nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (event.ctrlKey || event.metaKey) {
      // 複数選択
      setSelectedElements(prev => 
        prev.includes(nodeId) 
          ? prev.filter(id => id !== nodeId)
          : [...prev, nodeId]
      );
    } else {
      // 単一選択
      setSelectedElements([nodeId]);
    }
  }, []);

  // エッジ作成処理
  const handleNodeConnectorDrag = useCallback((
    sourceNodeId: string, 
    sourceHandle: string,
    event: React.MouseEvent
  ) => {
    // エッジ作成のドラッグ処理
    const handleMouseMove = (e: MouseEvent) => {
      // 一時的なエッジを表示
    };

    const handleMouseUp = (e: MouseEvent) => {
      // ドロップ先のノードを検出してエッジを作成
      const targetElement = document.elementFromPoint(e.clientX, e.clientY);
      const targetNodeId = targetElement?.closest('[data-node-id]')?.getAttribute('data-node-id');
      const targetHandle = targetElement?.closest('[data-handle]')?.getAttribute('data-handle');
      
      if (targetNodeId && targetHandle && targetNodeId !== sourceNodeId) {
        const newEdge: FlowEdge = {
          id: `edge-${Date.now()}`,
          source: sourceNodeId,
          target: targetNodeId,
          sourceHandle,
          targetHandle,
          data: {
            conditionType: 'auto',
            conditionValue: null
          }
        };
        
        setEdges(prev => [...prev, newEdge]);
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div 
      ref={canvasRef}
      className="relative w-full h-full bg-gray-100 overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => setSelectedElements([])}
    >
      {/* グリッド背景 */}
      <GridBackground viewport={viewport} />
      
      {/* SVG エッジレイヤー */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})` }}
      >
        {edges.map(edge => (
          <FlowEdge
            key={edge.id}
            edge={edge}
            nodes={nodes}
            selected={selectedElements.includes(edge.id)}
            onSelect={(id) => setSelectedElements([id])}
            onDelete={(id) => setEdges(prev => prev.filter(e => e.id !== id))}
          />
        ))}
      </svg>
      
      {/* ノードレイヤー */}
      <div 
        className="absolute inset-0"
        style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})` }}
      >
        {nodes.map(node => (
          <FlowNode
            key={node.id}
            node={node}
            selected={selectedElements.includes(node.id)}
            readOnly={readOnly}
            onSelect={handleNodeClick}
            onMove={(id, position) => {
              setNodes(prev => prev.map(n => 
                n.id === id ? { ...n, position } : n
              ));
            }}
            onConnectorDrag={handleNodeConnectorDrag}
            onEdit={(id) => {
              // ノード編集モーダルを開く
            }}
            onDelete={(id) => {
              setNodes(prev => prev.filter(n => n.id !== id));
              setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
            }}
          />
        ))}
      </div>
      
      {/* 選択範囲 */}
      <SelectionBox 
        viewport={viewport}
        onSelectionChange={setSelectedElements}
      />
      
      {/* ビューポート制御 */}
      <ViewportControls 
        viewport={viewport}
        onViewportChange={setViewport}
      />
    </div>
  );
};
```

##### 1.2 フローノードコンポーネント
```tsx
interface FlowNodeProps {
  node: FlowNode;
  selected: boolean;
  readOnly: boolean;
  onSelect: (nodeId: string, event: React.MouseEvent) => void;
  onMove: (nodeId: string, position: Position) => void;
  onConnectorDrag: (nodeId: string, handle: string, event: React.MouseEvent) => void;
  onEdit: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
}

const FlowNode: React.FC<FlowNodeProps> = ({
  node,
  selected,
  readOnly,
  onSelect,
  onMove,
  onConnectorDrag,
  onEdit,
  onDelete
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPosition, setDragStartPosition] = useState<Position | null>(null);
  
  const getNodeConfig = (type: string) => {
    const configs = {
      'first_trigger': {
        icon: <PlayIcon className="w-5 h-5" />,
        color: 'bg-green-500',
        label: '開始',
        inputs: 0,
        outputs: 1
      },
      'message': {
        icon: <MessageIcon className="w-5 h-5" />,
        color: 'bg-blue-500',
        label: 'メッセージ',
        inputs: 1,
        outputs: 1
      },
      'message_select_option': {
        icon: <ListIcon className="w-5 h-5" />,
        color: 'bg-purple-500',
        label: '選択肢',
        inputs: 1,
        outputs: 1
      },
      'lottery': {
        icon: <DiceIcon className="w-5 h-5" />,
        color: 'bg-yellow-500',
        label: '抽選',
        inputs: 1,
        outputs: 2
      },
      'lottery_message': {
        icon: <TrophyIcon className="w-5 h-5" />,
        color: 'bg-orange-500',
        label: '抽選結果',
        inputs: 1,
        outputs: 1
      }
    };
    
    return configs[type] || configs['message'];
  };

  const config = getNodeConfig(node.type);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (readOnly) return;
    
    setIsDragging(true);
    setDragStartPosition({
      x: event.clientX - node.position.x,
      y: event.clientY - node.position.y
    });
    
    onSelect(node.id, event);
  };

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !dragStartPosition) return;
    
    const newPosition = {
      x: event.clientX - dragStartPosition.x,
      y: event.clientY - dragStartPosition.y
    };
    
    onMove(node.id, newPosition);
  }, [isDragging, dragStartPosition, node.id, onMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStartPosition(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      data-node-id={node.id}
      className={`absolute bg-white rounded-lg shadow-lg border-2 transition-all cursor-move ${
        selected ? 'border-blue-500 shadow-blue-200' : 'border-gray-200'
      } ${isDragging ? 'shadow-xl' : ''}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        minWidth: 200,
        zIndex: selected ? 10 : 1
      }}
      onMouseDown={handleMouseDown}
    >
      {/* ノードヘッダー */}
      <div className={`px-4 py-2 rounded-t-md ${config.color} text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.icon}
            <span className="font-medium">{config.label}</span>
          </div>
          
          {!readOnly && (
            <div className="flex items-center gap-1">
              <button
                className="p-1 hover:bg-black/10 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(node.id);
                }}
              >
                <EditIcon className="w-4 h-4" />
              </button>
              <button
                className="p-1 hover:bg-black/10 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(node.id);
                }}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* ノードコンテンツ */}
      <div className="p-4">
        {node.data.message && (
          <div className="text-sm text-gray-700 mb-2 line-clamp-3">
            "{node.data.message.text}"
          </div>
        )}
        
        {node.data.selectOptions && node.data.selectOptions.length > 0 && (
          <div className="space-y-1">
            {node.data.selectOptions.slice(0, 3).map((option, index) => (
              <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {option.selectOption}
              </div>
            ))}
            {node.data.selectOptions.length > 3 && (
              <div className="text-xs text-gray-500">
                +{node.data.selectOptions.length - 3} more
              </div>
            )}
          </div>
        )}
        
        {node.type === 'lottery' && (
          <div className="text-xs text-gray-600">
            当選確率: {node.data.winningRate || 0}%
          </div>
        )}
      </div>
      
      {/* 入力コネクタ */}
      {config.inputs > 0 && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2">
          <div
            data-handle="input"
            className="w-4 h-4 bg-gray-400 rounded-full border-2 border-white cursor-crosshair hover:bg-blue-500"
          />
        </div>
      )}
      
      {/* 出力コネクタ */}
      {config.outputs > 0 && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2">
          {Array.from({ length: config.outputs }, (_, index) => (
            <div
              key={index}
              data-handle={`output-${index}`}
              className={`w-4 h-4 bg-gray-400 rounded-full border-2 border-white cursor-crosshair hover:bg-green-500 ${
                config.outputs > 1 ? 'mb-2' : ''
              }`}
              style={{
                top: config.outputs > 1 ? `${(index * 50) + 25}%` : '50%'
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                onConnectorDrag(node.id, `output-${index}`, e);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
```

##### 1.3 ノードパレット
```tsx
const NodePalette: React.FC = () => {
  const nodeTypes = [
    {
      type: 'first_trigger',
      label: '開始トリガー',
      icon: <PlayIcon className="w-6 h-6" />,
      color: 'bg-green-500',
      description: 'フローの開始ポイント'
    },
    {
      type: 'message',
      label: 'メッセージ',
      icon: <MessageIcon className="w-6 h-6" />,
      color: 'bg-blue-500',
      description: 'ユーザーへのメッセージ送信'
    },
    {
      type: 'message_select_option',
      label: '選択肢',
      icon: <ListIcon className="w-6 h-6" />,
      color: 'bg-purple-500',
      description: 'ユーザーの選択肢'
    },
    {
      type: 'lottery',
      label: '抽選',
      icon: <DiceIcon className="w-6 h-6" />,
      color: 'bg-yellow-500',
      description: '抽選処理の実行'
    },
    {
      type: 'lottery_message',
      label: '抽選結果',
      icon: <TrophyIcon className="w-6 h-6" />,
      color: 'bg-orange-500',
      description: '抽選結果メッセージ'
    }
  ];

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/flow-node', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">ノードパレット</h3>
        <p className="text-sm text-gray-600 mt-1">
          ドラッグしてキャンバスに配置
        </p>
      </div>
      
      <div className="p-4 space-y-3">
        {nodeTypes.map(nodeType => (
          <div
            key={nodeType.type}
            className="p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:shadow-md transition-shadow"
            draggable
            onDragStart={(e) => handleDragStart(e, nodeType.type)}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md ${nodeType.color} text-white`}>
                {nodeType.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{nodeType.label}</h4>
                <p className="text-xs text-gray-600">{nodeType.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* テンプレート */}
      <div className="p-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">テンプレート</h4>
        <div className="space-y-2">
          <button className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded">
            基本フロー
          </button>
          <button className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded">
            抽選付きフロー
          </button>
          <button className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded">
            アンケートフロー
          </button>
        </div>
      </div>
    </div>
  );
};
```

##### 1.4 プロパティパネル
```tsx
const PropertyPanel: React.FC = () => {
  const { selectedElements } = useFlowEditor();
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<FlowEdge | null>(null);

  const renderNodeProperties = (node: FlowNode) => {
    switch (node.type) {
      case 'message':
        return <MessageNodeProperties node={node} />;
      case 'message_select_option':
        return <SelectOptionProperties node={node} />;
      case 'lottery':
        return <LotteryNodeProperties node={node} />;
      default:
        return <DefaultNodeProperties node={node} />;
    }
  };

  const renderEdgeProperties = (edge: FlowEdge) => {
    return <EdgeProperties edge={edge} />;
  };

  if (selectedElements.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <CogIcon className="w-8 h-8 mx-auto mb-2" />
          <p>ノードまたはエッジを選択してください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">プロパティ</h3>
      </div>
      
      <div className="p-4">
        {selectedNode && renderNodeProperties(selectedNode)}
        {selectedEdge && renderEdgeProperties(selectedEdge)}
        
        {selectedElements.length > 1 && (
          <MultiSelectionProperties elements={selectedElements} />
        )}
      </div>
    </div>
  );
};

// メッセージノードのプロパティ
const MessageNodeProperties: React.FC<{ node: FlowNode }> = ({ node }) => {
  const { updateNode } = useFlowEditor();
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          メッセージタイプ
        </label>
        <Select
          value={node.data.message?.messageType || 'text'}
          onChange={(value) => updateNode(node.id, {
            ...node.data,
            message: { ...node.data.message, messageType: value }
          })}
        >
          <option value="text">テキスト</option>
          <option value="select">選択式</option>
          <option value="card">カード</option>
          <option value="image">画像</option>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          メッセージ内容
        </label>
        <TextArea
          value={node.data.message?.text || ''}
          onChange={(e) => updateNode(node.id, {
            ...node.data,
            message: { ...node.data.message, text: e.target.value }
          })}
          rows={4}
          placeholder="メッセージを入力してください..."
        />
      </div>
      
      {node.data.message?.messageType === 'select' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            選択肢
          </label>
          <SelectOptionEditor
            options={node.data.selectOptions || []}
            onChange={(options) => updateNode(node.id, {
              ...node.data,
              selectOptions: options
            })}
          />
        </div>
      )}
    </div>
  );
};
```

---

### 2. フロープレビュー画面

#### 画面説明
作成したフローをシミュレーション実行できるプレビュー機能です。

```tsx
const FlowPreviewModal: React.FC = () => {
  const { isPreviewOpen, closePreview } = useFlowEditor();
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<PreviewMessage[]>([]);
  const [userInput, setUserInput] = useState('');

  const handleUserInput = (input: string) => {
    // ユーザー入力をシミュレート
    const userMessage: PreviewMessage = {
      id: Date.now(),
      text: input,
      isFromUser: true,
      timestamp: new Date()
    };
    
    setConversationHistory(prev => [...prev, userMessage]);
    
    // 次のノードに遷移
    const nextNode = getNextNode(currentNodeId, input);
    if (nextNode) {
      const botMessage: PreviewMessage = {
        id: Date.now() + 1,
        text: nextNode.data.message?.text || '',
        isFromUser: false,
        timestamp: new Date(),
        selectOptions: nextNode.data.selectOptions
      };
      
      setConversationHistory(prev => [...prev, botMessage]);
      setCurrentNodeId(nextNode.id);
    }
  };

  return (
    <Modal
      isOpen={isPreviewOpen}
      onClose={closePreview}
      size="lg"
      title="フロープレビュー"
    >
      <div className="h-96 flex">
        {/* チャット画面 */}
        <div className="flex-1 border-r border-gray-200">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {conversationHistory.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
            
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="メッセージを入力..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleUserInput(userInput);
                      setUserInput('');
                    }
                  }}
                />
                <Button onClick={() => {
                  handleUserInput(userInput);
                  setUserInput('');
                }}>
                  送信
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* フロー状況 */}
        <div className="w-64 p-4 bg-gray-50">
          <h4 className="font-medium mb-3">現在の状況</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">現在のノード:</span>
              <div className="font-medium">{getCurrentNodeLabel(currentNodeId)}</div>
            </div>
            <div>
              <span className="text-gray-600">メッセージ数:</span>
              <div className="font-medium">{conversationHistory.length}</div>
            </div>
          </div>
          
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setConversationHistory([]);
                setCurrentNodeId(getStartNodeId());
              }}
            >
              リセット
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
```

---

## 共通仕様

### 状態管理
```tsx
// store/slices/flowEditorSlice.ts
interface FlowEditorState {
  currentTemplate: Template | null;
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedElements: string[];
  viewport: Viewport;
  isDragging: boolean;
  isPreviewOpen: boolean;
  clipboard: {
    nodes: FlowNode[];
    edges: FlowEdge[];
  };
}

export const flowEditorSlice = createSlice({
  name: 'flowEditor',
  initialState,
  reducers: {
    setFlowData: (state, action) => {
      state.nodes = action.payload.nodes;
      state.edges = action.payload.edges;
    },
    addNode: (state, action) => {
      state.nodes.push(action.payload);
    },
    updateNode: (state, action) => {
      const { id, data } = action.payload;
      const node = state.nodes.find(n => n.id === id);
      if (node) {
        node.data = { ...node.data, ...data };
      }
    },
    deleteNode: (state, action) => {
      const nodeId = action.payload;
      state.nodes = state.nodes.filter(n => n.id !== nodeId);
      state.edges = state.edges.filter(e => e.source !== nodeId && e.target !== nodeId);
    },
    addEdge: (state, action) => {
      state.edges.push(action.payload);
    },
    updateEdge: (state, action) => {
      const { id, data } = action.payload;
      const edge = state.edges.find(e => e.id === id);
      if (edge) {
        edge.data = { ...edge.data, ...data };
      }
    },
    setSelectedElements: (state, action) => {
      state.selectedElements = action.payload;
    },
    setViewport: (state, action) => {
      state.viewport = action.payload;
    }
  }
});
```

### 型定義
```tsx
// types/flowEditor.ts
export interface FlowNode {
  id: string;
  type: string;
  position: Position;
  data: NodeData;
  templateId: number;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  data: EdgeData;
}

export interface NodeData {
  message?: {
    id?: number;
    text: string;
    messageType: 'text' | 'select' | 'card' | 'image';
  };
  selectOptions?: SelectOption[];
  winningRate?: number;
  lotterySettings?: LotterySettings;
}

export interface EdgeData {
  conditionType: 'auto' | 'select_option' | 'text_match' | 'regex_match';
  conditionValue?: string;
  label?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}
```

### カスタムフック
```tsx
// hooks/useFlowEditor.ts
export const useFlowEditor = () => {
  const dispatch = useAppDispatch();
  const flowEditor = useAppSelector(state => state.flowEditor);
  
  const addNode = useCallback((node: FlowNode) => {
    dispatch(flowEditorSlice.actions.addNode(node));
  }, [dispatch]);
  
  const updateNode = useCallback((id: string, data: Partial<NodeData>) => {
    dispatch(flowEditorSlice.actions.updateNode({ id, data }));
  }, [dispatch]);
  
  const deleteNode = useCallback((id: string) => {
    dispatch(flowEditorSlice.actions.deleteNode(id));
  }, [dispatch]);
  
  const addEdge = useCallback((edge: FlowEdge) => {
    dispatch(flowEditorSlice.actions.addEdge(edge));
  }, [dispatch]);
  
  const saveFlow = useCallback(async () => {
    // フローデータをバックエンドに保存
    try {
      await saveFlowDataMutation({
        templateId: flowEditor.currentTemplate?.id,
        nodes: flowEditor.nodes,
        edges: flowEditor.edges
      }).unwrap();
      
      showToast('フローを保存しました', 'success');
    } catch (error) {
      showToast('保存に失敗しました', 'error');
    }
  }, [flowEditor]);
  
  return {
    ...flowEditor,
    addNode,
    updateNode,
    deleteNode,
    addEdge,
    saveFlow
  };
};

// hooks/useKeyboardShortcuts.ts
export const useKeyboardShortcuts = () => {
  const { selectedElements, deleteNode, deleteEdge } = useFlowEditor();
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Delete キー
      if (event.key === 'Delete' || event.key === 'Backspace') {
        selectedElements.forEach(elementId => {
          if (elementId.startsWith('node-')) {
            deleteNode(elementId);
          } else if (elementId.startsWith('edge-')) {
            deleteEdge(elementId);
          }
        });
      }
      
      // Ctrl+C (コピー)
      if (event.ctrlKey && event.key === 'c') {
        // 選択された要素をクリップボードにコピー
      }
      
      // Ctrl+V (ペースト)
      if (event.ctrlKey && event.key === 'v') {
        // クリップボードから要素をペースト
      }
      
      // Ctrl+Z (アンドゥ)
      if (event.ctrlKey && event.key === 'z') {
        // アンドゥ操作
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElements, deleteNode, deleteEdge]);
};
```

### ユーティリティ関数
```tsx
// utils/flowUtils.ts
export const getNodeBounds = (nodes: FlowNode[]) => {
  if (nodes.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
  
  const minX = Math.min(...nodes.map(n => n.position.x));
  const minY = Math.min(...nodes.map(n => n.position.y));
  const maxX = Math.max(...nodes.map(n => n.position.x + 200)); // ノード幅を考慮
  const maxY = Math.max(...nodes.map(n => n.position.y + 100)); // ノード高さを考慮
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
};

export const autoLayout = (nodes: FlowNode[], edges: FlowEdge[]): FlowNode[] => {
  // 自動レイアウトアルゴリズム（階層レイアウト）
  const layoutNodes = [...nodes];
  const visited = new Set();
  const levels: string[][] = [];
  
  // 開始ノードを見つける
  const startNode = nodes.find(n => n.type === 'first_trigger');
  if (!startNode) return nodes;
  
  // 幅優先探索でレベル分け
  const queue = [{ nodeId: startNode.id, level: 0 }];
  visited.add(startNode.id);
  
  while (queue.length > 0) {
    const { nodeId, level } = queue.shift()!;
    
    if (!levels[level]) levels[level] = [];
    levels[level].push(nodeId);
    
    // 次のノードを探す
    const outgoingEdges = edges.filter(e => e.source === nodeId);
    outgoingEdges.forEach(edge => {
      if (!visited.has(edge.target)) {
        visited.add(edge.target);
        queue.push({ nodeId: edge.target, level: level + 1 });
      }
    });
  }
  
  // レイアウト適用
  levels.forEach((levelNodes, levelIndex) => {
    levelNodes.forEach((nodeId, nodeIndex) => {
      const node = layoutNodes.find(n => n.id === nodeId);
      if (node) {
        node.position = {
          x: nodeIndex * 250 + 100,
          y: levelIndex * 150 + 100
        };
      }
    });
  });
  
  return layoutNodes;
};

export const validateFlow = (nodes: FlowNode[], edges: FlowEdge[]): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // 開始ノードの存在チェック
  const startNodes = nodes.filter(n => n.type === 'first_trigger');
  if (startNodes.length === 0) {
    errors.push('開始ノードが必要です');
  } else if (startNodes.length > 1) {
    errors.push('開始ノードは1つまでです');
  }
  
  // 孤立ノードのチェック
  nodes.forEach(node => {
    const hasIncoming = edges.some(e => e.target === node.id);
    const hasOutgoing = edges.some(e => e.source === node.id);
    
    if (!hasIncoming && node.type !== 'first_trigger') {
      warnings.push(`ノード「${node.id}」への接続がありません`);
    }
    
    if (!hasOutgoing && node.type !== 'end') {
      warnings.push(`ノード「${node.id}」からの接続がありません`);
    }
  });
  
  // メッセージノードの内容チェック
  nodes.forEach(node => {
    if (node.type === 'message' && !node.data.message?.text) {
      errors.push(`メッセージノード「${node.id}」にメッセージが設定されていません`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
```
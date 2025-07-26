# 会話・チャット画面 仕様書

## 概要
Instagramインスタントウィンキャンペーンの会話・チャット管理に関するフロントエンド画面の詳細仕様。
リアルタイムチャット表示、会話履歴管理、フロー進行状況、ユーザー情報表示機能を提供します。

## 関連バックエンドAPI
```
/api/in_instantwin_conversations
```

---

## 画面一覧

### 1. 会話一覧画面

#### 画面パス
```
/conversations
/campaigns/:campaignId/conversations
/prizes/:prizeId/conversations
```

#### 画面説明
進行中・完了した会話セッションの一覧を表示し、検索・フィルタ・リアルタイム更新機能を提供します。

#### コンポーネント構成
```tsx
// pages/conversations/index.tsx
const ConversationsPage: React.FC = () => {
  const { campaignId, prizeId } = useParams();
  
  return (
    <PageLayout title="会話管理">
      <ConversationFilters campaignId={campaignId} prizeId={prizeId} />
      <ConversationStats />
      <ConversationList />
      <Pagination />
    </PageLayout>
  );
};
```

#### 主要機能

##### 1.1 フィルタ機能
```tsx
interface ConversationFilters {
  campaignId?: number;
  prizeId?: number;
  status?: 'active' | 'completed' | 'ended';
  instagramUserId?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  hasLottery?: boolean;
  isWinner?: boolean;
}

const ConversationFilters: React.FC<{ campaignId?: number; prizeId?: number }> = ({ 
  campaignId, 
  prizeId 
}) => {
  const [filters, setFilters] = useState<ConversationFilters>({ campaignId, prizeId });
  const { data: campaigns } = useGetCampaignsQuery({});
  const { data: prizes } = useGetPrizesQuery({ campaignId: filters.campaignId });
  
  return (
    <FilterPanel>
      {!campaignId && (
        <FormField label="キャンペーン">
          <Select 
            value={filters.campaignId}
            onChange={(campaignId) => setFilters({...filters, campaignId})}
          >
            <option value="">全キャンペーン</option>
            {campaigns?.map(campaign => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.title}
              </option>
            ))}
          </Select>
        </FormField>
      )}
      
      {!prizeId && (
        <FormField label="プライズ">
          <Select 
            value={filters.prizeId}
            onChange={(prizeId) => setFilters({...filters, prizeId})}
            disabled={!filters.campaignId}
          >
            <option value="">全プライズ</option>
            {prizes?.map(prize => (
              <option key={prize.id} value={prize.id}>
                {prize.name}
              </option>
            ))}
          </Select>
        </FormField>
      )}
      
      <FormField label="ステータス">
        <Select 
          value={filters.status}
          onChange={(status) => setFilters({...filters, status})}
        >
          <option value="">全ステータス</option>
          <option value="active">進行中</option>
          <option value="completed">完了</option>
          <option value="ended">終了</option>
        </Select>
      </FormField>
      
      <SearchInput 
        placeholder="InstagramユーザーIDで検索..."
        value={filters.instagramUserId}
        onChange={(instagramUserId) => setFilters({...filters, instagramUserId})}
      />
      
      <DateRangeFilter 
        value={filters.dateRange}
        onChange={(dateRange) => setFilters({...filters, dateRange})}
        label="期間"
      />
      
      <div className="flex gap-4">
        <FormField label="抽選">
          <Toggle
            checked={filters.hasLottery}
            onChange={(hasLottery) => setFilters({...filters, hasLottery})}
            label="抽選実行済み"
          />
        </FormField>
        
        <FormField label="当選">
          <Toggle
            checked={filters.isWinner}
            onChange={(isWinner) => setFilters({...filters, isWinner})}
            label="当選者のみ"
            disabled={!filters.hasLottery}
          />
        </FormField>
      </div>
    </FilterPanel>
  );
};
```

##### 1.2 会話リストアイテム
```tsx
interface ConversationListItemProps {
  conversation: ConversationSummary;
  onClick: (id: number) => void;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({ 
  conversation, 
  onClick 
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">進行中</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">完了</Badge>;
      case 'ended':
        return <Badge className="bg-gray-100 text-gray-800">終了</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(conversation.id)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium">
              {conversation.instagramUserId.slice(-2).toUpperCase()}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                @{conversation.instagramUserId}
              </h4>
              <p className="text-sm text-gray-600">
                {conversation.campaignTitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(conversation.status)}
            {conversation.isWinner && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <TrophyIcon className="w-3 h-3 mr-1" />
                当選
              </Badge>
            )}
          </div>
        </div>
        
        {/* 最新メッセージプレビュー */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${
              conversation.lastMessage?.isFromUser ? 'bg-blue-500' : 'bg-gray-400'
            }`} />
            <small className="text-gray-500">
              {conversation.lastMessage?.isFromUser ? 'ユーザー' : 'Bot'}
            </small>
            <small className="text-gray-500">
              {formatRelativeTime(conversation.lastMessage?.timestamp)}
            </small>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2">
            {conversation.lastMessage?.text || '（メッセージなし）'}
          </p>
        </div>
        
        {/* 統計情報 */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">
              {conversation.totalMessages}
            </div>
            <div className="text-xs text-gray-600">メッセージ</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {conversation.currentStep}
            </div>
            <div className="text-xs text-gray-600">ステップ</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">
              {conversation.lotteryAttempts}
            </div>
            <div className="text-xs text-gray-600">抽選回数</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">
              {Math.round(conversation.sessionDurationMinutes)}分
            </div>
            <div className="text-xs text-gray-600">継続時間</div>
          </div>
        </div>
        
        {/* 現在の状態 */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              現在: {conversation.currentTemplateName}
            </span>
            <span className="text-xs text-gray-500">
              {formatDateTime(conversation.modified)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

##### 1.3 リアルタイム統計
```tsx
const ConversationStats: React.FC = () => {
  const { data: stats, isLoading } = useConversationStatsQuery();
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30秒
  
  // リアルタイム更新
  useEffect(() => {
    const interval = setInterval(() => {
      // stats を再取得
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (isLoading) return <StatsCardSkeleton />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatsCard
        title="進行中の会話"
        value={stats?.activeConversations || 0}
        icon={<ChatIcon className="w-6 h-6" />}
        color="blue"
        trend={{
          value: stats?.activeConversationsTrend || 0,
          label: "前時間比"
        }}
      />
      
      <StatsCard
        title="完了した会話"
        value={stats?.completedConversations || 0}
        icon={<CheckIcon className="w-6 h-6" />}
        color="green"
        trend={{
          value: stats?.completedConversationsTrend || 0,
          label: "前時間比"
        }}
      />
      
      <StatsCard
        title="今日の抽選実行"
        value={stats?.todayLotteryAttempts || 0}
        icon={<DiceIcon className="w-6 h-6" />}
        color="purple"
        trend={{
          value: stats?.lotteryAttemptsTrend || 0,
          label: "前日比"
        }}
      />
      
      <StatsCard
        title="今日の当選者"
        value={stats?.todayWinners || 0}
        icon={<TrophyIcon className="w-6 h-6" />}
        color="yellow"
        trend={{
          value: stats?.winnersTrend || 0,
          label: "前日比"
        }}
      />
    </div>
  );
};
```

---

### 2. 会話詳細・チャット画面

#### 画面パス
```
/conversations/:id
```

#### 画面説明
指定された会話のチャット形式表示、フロー進行状況、ユーザー情報を提供します。

#### コンポーネント構成
```tsx
// pages/conversations/[id]/index.tsx
const ConversationDetailPage: React.FC = () => {
  const { id } = useParams();
  const { conversation, isLoading } = useConversationDetail(id);

  if (isLoading) return <LoadingSpinner />;

  return (
    <PageLayout 
      title={`@${conversation.instagramUserId}`}
      breadcrumbs={[
        { label: '会話', href: '/conversations' },
        { label: `@${conversation.instagramUserId}` }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        <div className="lg:col-span-3">
          <ChatWindow conversationId={conversation.id} />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <UserInfo conversation={conversation} />
          <FlowProgress conversation={conversation} />
          <ConversationActions conversation={conversation} />
        </div>
      </div>
    </PageLayout>
  );
};
```

#### 主要機能

##### 2.1 チャットウィンドウ
```tsx
interface ChatWindowProps {
  conversationId: number;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId }) => {
  const { data: messages, isLoading } = useConversationHistoryQuery(conversationId);
  const [newMessage, setNewMessage] = useState('');
  const [sendMessage] = useSendMessageMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // リアルタイム更新（WebSocket接続）
  const { socket } = useWebSocket(`/conversations/${conversationId}`, {
    onMessage: (message) => {
      // 新しいメッセージを追加
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      await sendMessage({
        conversationId,
        messageText: newMessage,
        selectedOption: null
      }).unwrap();
      
      setNewMessage('');
    } catch (error) {
      showToast('メッセージの送信に失敗しました', 'error');
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">チャット履歴</h3>
          <div className="flex items-center gap-2">
            <ConnectionStatus isConnected={socket?.connected} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // 会話履歴を再取得
              }}
            >
              <RefreshIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <ChatSkeleton />
        ) : (
          <>
            {messages?.map((message, index) => (
              <MessageBubble
                key={`${message.id}-${index}`}
                message={message}
                isLastMessage={index === messages.length - 1}
                onSelectOption={handleSendMessage}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </CardContent>
      
      {/* メッセージ入力エリア（管理者用） */}
      <CardFooter className="flex-shrink-0 border-t">
        <div className="flex gap-2 w-full">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="メッセージを入力..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <SendIcon className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
```

##### 2.2 メッセージバブル
```tsx
interface MessageBubbleProps {
  message: ConversationMessage;
  isLastMessage: boolean;
  onSelectOption?: (option: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isLastMessage,
  onSelectOption 
}) => {
  const isFromUser = message.isFromUser;
  const isFirstTrigger = message.isFirstTrigger;
  const isLastTrigger = message.isLastTrigger;
  
  return (
    <div className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isFromUser ? 'order-2' : 'order-1'}`}>
        {/* アバター */}
        <div className={`flex items-end gap-2 ${isFromUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
            isFromUser 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
              : 'bg-gradient-to-r from-gray-500 to-gray-600'
          }`}>
            {isFromUser ? 'U' : 'B'}
          </div>
          
          <div className={`flex flex-col ${isFromUser ? 'items-end' : 'items-start'}`}>
            {/* メッセージバブル */}
            <div
              className={`px-4 py-2 rounded-2xl max-w-full ${
                isFromUser
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
              }`}
            >
              {/* 特殊メッセージ表示 */}
              {isFirstTrigger && (
                <div className="flex items-center gap-2 mb-2 text-sm opacity-75">
                  <PlayIcon className="w-4 h-4" />
                  <span>会話開始</span>
                </div>
              )}
              
              {isLastTrigger && (
                <div className="flex items-center gap-2 mb-2 text-sm opacity-75">
                  <StopIcon className="w-4 h-4" />
                  <span>会話終了</span>
                </div>
              )}
              
              {/* メッセージテキスト */}
              <p className="whitespace-pre-wrap">{message.messageText}</p>
              
              {/* 抽選結果表示 */}
              {message.lotteryResult && (
                <div className={`mt-2 p-2 rounded-lg ${
                  message.lotteryResult.isWin 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  <div className="flex items-center gap-2">
                    {message.lotteryResult.isWin ? (
                      <TrophyIcon className="w-4 h-4" />
                    ) : (
                      <XIcon className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {message.lotteryResult.isWin ? '当選！' : '落選'}
                    </span>
                    <span className="text-xs">
                      (確率: {message.lotteryResult.lotteryRate}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* 選択肢（ボットメッセージのみ） */}
            {!isFromUser && message.selectOptions && message.selectOptions.length > 0 && (
              <div className="mt-2 space-y-1">
                {message.selectOptions.map((option, index) => (
                  <button
                    key={option.id}
                    className="block px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => onSelectOption?.(option.selectOption)}
                    disabled={!isLastMessage}
                  >
                    {option.selectOption}
                  </button>
                ))}
              </div>
            )}
            
            {/* タイムスタンプ */}
            <div className="text-xs text-gray-500 mt-1">
              {formatTime(message.messageTimestamp)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

##### 2.3 フロー進行状況
```tsx
interface FlowProgressProps {
  conversation: ConversationDetail;
}

const FlowProgress: React.FC<FlowProgressProps> = ({ conversation }) => {
  const { data: templates } = useGetTemplatesQuery({ 
    prizeId: conversation.prizeId 
  });
  
  const currentTemplateIndex = templates?.findIndex(
    t => t.id === conversation.currentState.templateId
  ) || 0;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">フロー進行状況</h3>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* 進行バー */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                進行度
              </span>
              <span className="text-sm text-gray-600">
                {currentTemplateIndex + 1} / {templates?.length || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${((currentTemplateIndex + 1) / (templates?.length || 1)) * 100}%` 
                }}
              />
            </div>
          </div>
          
          {/* テンプレートステップ */}
          <div className="space-y-3">
            {templates?.map((template, index) => {
              const isCompleted = index < currentTemplateIndex;
              const isCurrent = index === currentTemplateIndex;
              const isPending = index > currentTemplateIndex;
              
              return (
                <div 
                  key={template.id}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    isCurrent ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCompleted 
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckIcon className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-medium ${
                      isCurrent ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-600'
                    }`}>
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getTemplateTypeLabel(template.type)}
                    </div>
                  </div>
                  
                  {isCurrent && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* 現在の状態詳細 */}
          <div className="pt-3 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">現在の状態</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">テンプレート:</span>
                <span className="font-medium">{conversation.currentState.templateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ノードタイプ:</span>
                <span className="font-medium">{conversation.currentState.currentNodeType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ステップ:</span>
                <span className="font-medium">
                  {conversation.currentState.sessionData?.step || 1}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

##### 2.4 ユーザー情報
```tsx
interface UserInfoProps {
  conversation: ConversationDetail;
}

const UserInfo: React.FC<UserInfoProps> = ({ conversation }) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">ユーザー情報</h3>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* ユーザー基本情報 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
              {conversation.instagramUserId.slice(-2).toUpperCase()}
            </div>
            <h4 className="font-medium text-gray-900">
              @{conversation.instagramUserId}
            </h4>
            <p className="text-sm text-gray-600">
              Instagram User
            </p>
          </div>
          
          {/* 会話統計 */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {conversation.summary.totalMessages}
              </div>
              <div className="text-xs text-gray-600">総メッセージ数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {conversation.summary.userMessages}
              </div>
              <div className="text-xs text-gray-600">ユーザーメッセージ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {conversation.summary.lotteryAttempts}
              </div>
              <div className="text-xs text-gray-600">抽選回数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {conversation.summary.lotteryWins}
              </div>
              <div className="text-xs text-gray-600">当選回数</div>
            </div>
          </div>
          
          {/* セッション情報 */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">セッション時間:</span>
              <span className="font-medium">
                {Math.round(conversation.summary.sessionDurationMinutes)}分
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">開始日時:</span>
              <span className="font-medium">
                {formatDateTime(conversation.messages[0]?.created)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">最終更新:</span>
              <span className="font-medium">
                {formatRelativeTime(conversation.currentState.modified)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">ステータス:</span>
              <Badge className={getStatusBadgeColor(conversation.summary.conversationStatus)}>
                {getStatusLabel(conversation.summary.conversationStatus)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 共通仕様

### 状態管理
```tsx
// store/slices/conversationsSlice.ts
interface ConversationsState {
  selectedConversation: ConversationDetail | null;
  filters: ConversationFilters;
  realTimeUpdates: {
    enabled: boolean;
    lastUpdate: Date | null;
    connected: boolean;
  };
}

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updateRealTimeStatus: (state, action) => {
      state.realTimeUpdates = { ...state.realTimeUpdates, ...action.payload };
    }
  }
});
```

### API連携
```tsx
// services/api/conversationApi.ts
export const conversationApi = createApi({
  reducerPath: 'conversationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Conversation', 'ConversationHistory'],
  endpoints: (builder) => ({
    getConversations: builder.query<ConversationsResponse, ConversationFilters>({
      query: (params) => ({
        url: '/in_instantwin_conversations',
        params
      }),
      providesTags: ['Conversation']
    }),
    getConversationDetail: builder.query<ConversationDetail, number>({
      query: (id) => `/in_instantwin_conversations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Conversation', id }]
    }),
    getConversationHistory: builder.query<ConversationHistory, number>({
      query: (id) => `/in_instantwin_conversations/${id}/history`,
      providesTags: (result, error, id) => [{ type: 'ConversationHistory', id }]
    }),
    sendMessage: builder.mutation<MessageResponse, SendMessageRequest>({
      query: ({ conversationId, ...body }) => ({
        url: `/in_instantwin_conversations/${conversationId}/messages`,
        method: 'POST',
        body
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'ConversationHistory', id: conversationId }
      ]
    }),
    getConversationStats: builder.query<ConversationStats, void>({
      query: () => '/in_instantwin_conversations/stats',
      providesTags: ['Conversation']
    })
  })
});
```

### 型定義
```tsx
// types/conversation.ts
export interface ConversationSummary {
  id: number;
  campaignId: number;
  campaignTitle: string;
  prizeId: number;
  prizeName: string;
  instagramUserId: string;
  status: 'active' | 'completed' | 'ended';
  totalMessages: number;
  currentStep: number;
  lotteryAttempts: number;
  isWinner: boolean;
  sessionDurationMinutes: number;
  currentTemplateName: string;
  lastMessage?: {
    text: string;
    isFromUser: boolean;
    timestamp: Date;
  };
  created: Date;
  modified: Date;
}

export interface ConversationMessage {
  id: number;
  messageText: string;
  messageTimestamp: Date;
  isFromUser: boolean;
  isFirstTrigger: boolean;
  isLastTrigger: boolean;
  selectOptions?: SelectOption[];
  lotteryResult?: {
    id: number;
    isWin: boolean;
    lotteryRate: number;
    created: Date;
  };
  sessionData: any;
  created: Date;
}

export interface ConversationDetail {
  id: number;
  campaignId: number;
  campaignTitle: string;
  prizeId: number;
  prizeName: string;
  instagramUserId: string;
  messages: ConversationMessage[];
  currentState: {
    currentNodeId: number;
    templateId: number;
    templateName: string;
    templateType: string;
    currentNodeType: string;
    sessionData: any;
    modified: Date;
  };
  lotteryHistory: LotteryRecord[];
  summary: {
    totalMessages: number;
    userMessages: number;
    botMessages: number;
    lotteryAttempts: number;
    lotteryWins: number;
    sessionDurationMinutes: number;
    currentTemplate: string;
    conversationStatus: string;
  };
}
```

### カスタムフック
```tsx
// hooks/useWebSocket.ts
export const useWebSocket = (url: string, options: WebSocketOptions) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}${url}`);
    
    ws.onopen = () => {
      setIsConnected(true);
      setSocket(ws);
    };
    
    ws.onclose = () => {
      setIsConnected(false);
      setSocket(null);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      options.onMessage?.(data);
    };
    
    return () => {
      ws.close();
    };
  }, [url]);
  
  return { socket, isConnected };
};

// hooks/useRealTimeChat.ts
export const useRealTimeChat = (conversationId: number) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  
  const { socket, isConnected } = useWebSocket(`/conversations/${conversationId}`, {
    onMessage: (data) => {
      if (data.type === 'new_message') {
        setMessages(prev => [...prev, data.message]);
      }
    }
  });
  
  return {
    messages,
    isConnected,
    sendMessage: (message: string) => {
      socket?.send(JSON.stringify({ type: 'send_message', message }));
    }
  };
};
```
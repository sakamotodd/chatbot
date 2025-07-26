# テンプレート管理画面 仕様書

## 概要
Instagramインスタントウィンキャンペーンのテンプレート管理に関するフロントエンド画面の詳細仕様。
テンプレートの作成、編集、一覧表示、ステップ順序管理、タイプ別設定機能を提供します。

## 関連バックエンドAPI
```
/api/in_instantwin_templates
```

---

## 画面一覧

### 1. テンプレート一覧画面

#### 画面パス
```
/templates
/campaigns/:campaignId/templates
/prizes/:prizeId/templates
```

#### 画面説明
登録されているテンプレートの一覧を表示し、キャンペーン・プライズ別フィルタ、タイプ別フィルタ機能を提供します。

#### コンポーネント構成
```tsx
// pages/templates/index.tsx
const TemplatesPage: React.FC = () => {
  const { campaignId, prizeId } = useParams();
  
  return (
    <PageLayout title="テンプレート管理">
      <TemplateFilters campaignId={campaignId} prizeId={prizeId} />
      <TemplateToolbar campaignId={campaignId} prizeId={prizeId} />
      <TemplateGrid />
      <Pagination />
    </PageLayout>
  );
};
```

#### 主要機能

##### 1.1 フィルタ機能
```tsx
interface TemplateFilters {
  campaignId?: number;
  prizeId?: number;
  templateType?: 'start' | 'tree' | 'message' | 'lottery_group' | 'end';
  searchText?: string;
}

const TemplateFilters: React.FC<{ campaignId?: number; prizeId?: number }> = ({ 
  campaignId, 
  prizeId 
}) => {
  const [filters, setFilters] = useState<TemplateFilters>({ campaignId, prizeId });
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
      
      <FormField label="テンプレートタイプ">
        <Select 
          value={filters.templateType}
          onChange={(templateType) => setFilters({...filters, templateType})}
        >
          <option value="">全タイプ</option>
          <option value="start">開始トリガー</option>
          <option value="tree">分岐処理</option>
          <option value="message">メッセージ</option>
          <option value="lottery_group">抽選グループ</option>
          <option value="end">終了トリガー</option>
        </Select>
      </FormField>
      
      <SearchInput 
        placeholder="テンプレート名で検索..."
        value={filters.searchText}
        onChange={(searchText) => setFilters({...filters, searchText})}
      />
    </FilterPanel>
  );
};
```

##### 1.2 テンプレートカード
```tsx
interface TemplateCardProps {
  template: Template;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onDuplicate: (id: number) => void;
  onReorder: (id: number, direction: 'up' | 'down') => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  onEdit, 
  onDelete, 
  onDuplicate,
  onReorder 
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'start': return <PlayIcon className="w-5 h-5" />;
      case 'tree': return <BranchIcon className="w-5 h-5" />;
      case 'message': return <MessageIcon className="w-5 h-5" />;
      case 'lottery_group': return <DiceIcon className="w-5 h-5" />;
      case 'end': return <StopIcon className="w-5 h-5" />;
      default: return <DocumentIcon className="w-5 h-5" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'start': return 'bg-green-100 text-green-800';
      case 'tree': return 'bg-blue-100 text-blue-800';
      case 'message': return 'bg-purple-100 text-purple-800';
      case 'lottery_group': return 'bg-yellow-100 text-yellow-800';
      case 'end': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-md ${getTypeBadgeColor(template.type)}`}>
              {getTypeIcon(template.type)}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{template.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getTypeBadgeColor(template.type)}>
                  {getTemplateTypeLabel(template.type)}
                </Badge>
                <span className="text-sm text-gray-500">
                  ステップ {template.stepOrder}
                </span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownItem onClick={() => onEdit(template.id)}>
              編集
            </DropdownItem>
            <DropdownItem onClick={() => onDuplicate(template.id)}>
              複製
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem 
              onClick={() => onReorder(template.id, 'up')}
              disabled={template.stepOrder === 1}
            >
              上に移動
            </DropdownItem>
            <DropdownItem 
              onClick={() => onReorder(template.id, 'down')}
              disabled={template.isLast}
            >
              下に移動
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem 
              onClick={() => onDelete(template.id)}
              destructive
            >
              削除
            </DropdownItem>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* テンプレート統計 */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {template.nodeCount || 0}
              </div>
              <div className="text-gray-600">ノード数</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {template.messageCount || 0}
              </div>
              <div className="text-gray-600">メッセージ数</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {template.edgeCount || 0}
              </div>
              <div className="text-gray-600">接続数</div>
            </div>
          </div>
          
          {/* プレビュー情報 */}
          {template.type === 'message' && template.previewMessage && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-700 line-clamp-2">
                "{template.previewMessage}"
              </p>
            </div>
          )}
          
          {template.type === 'lottery_group' && (
            <div className="bg-yellow-50 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <DiceIcon className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-700">
                  抽選処理テンプレート
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <div className="text-sm text-gray-500">
            更新: {formatRelativeTime(template.modified)}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateTo(`/templates/${template.id}`)}>
              詳細
            </Button>
            <Button 
              size="sm"
              onClick={() => onEdit(template.id)}>
              編集
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
```

---

### 2. テンプレート詳細画面

#### 画面パス
```
/templates/:id
```

#### 画面説明
指定されたテンプレートの詳細情報、関連ノード、メッセージ構成を表示します。

#### コンポーネント構成
```tsx
// pages/templates/[id]/index.tsx
const TemplateDetailPage: React.FC = () => {
  const { id } = useParams();
  const { template, isLoading } = useTemplateDetail(id);

  if (isLoading) return <LoadingSpinner />;

  return (
    <PageLayout 
      title={template.name}
      breadcrumbs={[
        { label: 'テンプレート', href: '/templates' },
        { label: template.name }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TemplateInfo template={template} />
          <TemplateNodes templateId={template.id} />
          <TemplateFlow templateId={template.id} />
        </div>
        
        <div className="lg:col-span-1">
          <TemplateActions template={template} />
          <TemplateStats templateId={template.id} />
          <RelatedTemplates prizeId={template.prizeId} currentId={template.id} />
        </div>
      </div>
    </PageLayout>
  );
};
```

#### 主要機能

##### 2.1 テンプレート情報表示
```tsx
interface TemplateInfoProps {
  template: Template;
}

const TemplateInfo: React.FC<TemplateInfoProps> = ({ template }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${getTypeBadgeColor(template.type)}`}>
              {getTypeIcon(template.type)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{template.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getTypeBadgeColor(template.type)}>
                  {getTemplateTypeLabel(template.type)}
                </Badge>
                <span className="text-sm text-gray-600">
                  ステップ順序: {template.stepOrder}
                </span>
              </div>
            </div>
          </div>
          <Link to={`/templates/${template.id}/edit`}>
            <Button variant="outline">
              <EditIcon className="w-4 h-4 mr-2" />
              編集
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* 基本情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem 
              label="プライズ" 
              value={template.prizeName}
              link={`/prizes/${template.prizeId}`}
            />
            <InfoItem 
              label="キャンペーン" 
              value={template.campaignTitle}
              link={`/campaigns/${template.campaignId}`}
            />
            <InfoItem 
              label="作成日" 
              value={formatDateTime(template.created)} 
            />
            <InfoItem 
              label="最終更新" 
              value={formatDateTime(template.modified)} 
            />
          </div>
          
          {/* テンプレート統計 */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">構成要素</h4>
            <div className="grid grid-cols-4 gap-4">
              <StatCard
                icon={<NodeIcon className="w-5 h-5" />}
                label="ノード数"
                value={template.nodeCount}
                color="blue"
              />
              <StatCard
                icon={<MessageIcon className="w-5 h-5" />}
                label="メッセージ数"
                value={template.messageCount}
                color="green"
              />
              <StatCard
                icon={<EdgeIcon className="w-5 h-5" />}
                label="接続数"
                value={template.edgeCount}
                color="purple"
              />
              <StatCard
                icon={<OptionIcon className="w-5 h-5" />}
                label="選択肢数"
                value={template.optionCount}
                color="orange"
              />
            </div>
          </div>
          
          {/* タイプ別詳細情報 */}
          {template.type === 'lottery_group' && (
            <div>
              <h4 className="font-medium text-gray-700 mb-3">抽選設定</h4>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem 
                    label="当選確率" 
                    value={`${template.lotterySettings?.winningRate || 0}%`}
                  />
                  <InfoItem 
                    label="日次制限" 
                    value={template.lotterySettings?.dailyLimit ? 
                      `${template.lotterySettings.dailyLimit}名/日` : '制限なし'}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
```

##### 2.2 テンプレートノード表示
```tsx
interface TemplateNodesProps {
  templateId: number;
}

const TemplateNodes: React.FC<TemplateNodesProps> = ({ templateId }) => {
  const { data: nodes, isLoading } = useGetTemplateNodesQuery(templateId);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">ノード構成</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigateTo(`/flow-editor?template=${templateId}`)}
          >
            <FlowIcon className="w-4 h-4 mr-2" />
            フローエディタで開く
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-4">
            {nodes?.map(node => (
              <NodeCard
                key={node.id}
                node={node}
                isSelected={selectedNode?.id === node.id}
                onClick={() => setSelectedNode(node)}
                onEdit={(id) => navigateTo(`/templates/${templateId}/nodes/${id}/edit`)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const NodeCard: React.FC<NodeCardProps> = ({ node, isSelected, onClick, onEdit }) => {
  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md ${getNodeTypeColor(node.type)}`}>
            {getNodeTypeIcon(node.type)}
          </div>
          <div>
            <h4 className="font-medium">{getNodeTypeLabel(node.type)}</h4>
            <p className="text-sm text-gray-600">ID: {node.id}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(node.id);
          }}
        >
          <EditIcon className="w-4 h-4" />
        </Button>
      </div>
      
      {/* ノード詳細情報 */}
      {node.message && (
        <div className="mt-3 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-700 line-clamp-2">
            "{node.message.text}"
          </p>
        </div>
      )}
      
      {/* 接続情報 */}
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span>入力: {node.incomingEdges || 0}</span>
        <span>出力: {node.outgoingEdges || 0}</span>
        {node.selectOptions && (
          <span>選択肢: {node.selectOptions.length}</span>
        )}
      </div>
    </div>
  );
};
```

---

### 3. テンプレート作成画面

#### 画面パス
```
/templates/create
/prizes/:prizeId/templates/create
```

#### 画面説明
新しいテンプレートを作成するためのフォーム画面です。

#### 主要機能

##### 3.1 テンプレートフォーム
```tsx
interface TemplateFormData {
  prizeId?: number;
  name: string;
  type: 'start' | 'tree' | 'message' | 'lottery_group' | 'end';
  stepOrder: number;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  mode,
  initialData,
  prizeId,
  onSubmit,
  onCancel
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<TemplateFormData>({
    defaultValues: initialData || {
      prizeId,
      name: '',
      type: 'message',
      stepOrder: 1
    },
    resolver: zodResolver(templateSchema)
  });

  const watchedType = watch('type');
  const watchedPrizeId = watch('prizeId');
  
  const { data: existingTemplates } = useGetTemplatesQuery({ 
    prizeId: watchedPrizeId 
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">基本情報</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {!prizeId && (
              <FormField
                label="プライズ"
                required
                error={errors.prizeId?.message}
              >
                <PrizeSelector
                  value={watchedPrizeId}
                  onChange={(prizeId) => setValue('prizeId', prizeId)}
                />
              </FormField>
            )}

            <FormField
              label="テンプレート名"
              required
              error={errors.name?.message}
            >
              <Input
                {...register('name')}
                placeholder="フォローチェック"
                maxLength={255}
              />
            </FormField>

            <FormField
              label="テンプレートタイプ"
              required
              error={errors.type?.message}
            >
              <TemplateTypeSelector
                value={watchedType}
                onChange={(type) => setValue('type', type)}
                existingTypes={existingTemplates?.map(t => t.type) || []}
              />
            </FormField>

            <FormField
              label="ステップ順序"
              required
              error={errors.stepOrder?.message}
            >
              <StepOrderSelector
                value={watch('stepOrder')}
                onChange={(stepOrder) => setValue('stepOrder', stepOrder)}
                existingOrders={existingTemplates?.map(t => t.stepOrder) || []}
                templateType={watchedType}
              />
            </FormField>
          </CardContent>
        </Card>

        {/* タイプ別設定 */}
        {watchedType && (
          <TemplateTypeConfig 
            templateType={watchedType}
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />
        )}
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          キャンセル
        </Button>
        <Button 
          type="submit" 
          loading={isSubmitting}
        >
          {mode === 'create' ? '作成' : '更新'}
        </Button>
      </div>
    </Form>
  );
};
```

##### 3.2 テンプレートタイプ選択
```tsx
interface TemplateTypeSelectorProps {
  value: string;
  onChange: (type: string) => void;
  existingTypes: string[];
}

const TemplateTypeSelector: React.FC<TemplateTypeSelectorProps> = ({
  value,
  onChange,
  existingTypes
}) => {
  const templateTypes = [
    {
      value: 'start',
      label: '開始トリガー',
      description: 'フローの開始ポイント',
      icon: <PlayIcon className="w-5 h-5" />,
      color: 'text-green-600 bg-green-100',
      unique: true
    },
    {
      value: 'tree',
      label: '分岐処理',
      description: '条件に基づく分岐処理',
      icon: <BranchIcon className="w-5 h-5" />,
      color: 'text-blue-600 bg-blue-100',
      unique: false
    },
    {
      value: 'message',
      label: 'メッセージ',
      description: 'ユーザーとの対話メッセージ',
      icon: <MessageIcon className="w-5 h-5" />,
      color: 'text-purple-600 bg-purple-100',
      unique: false
    },
    {
      value: 'lottery_group',
      label: '抽選グループ',
      description: '抽選処理とメッセージ',
      icon: <DiceIcon className="w-5 h-5" />,
      color: 'text-yellow-600 bg-yellow-100',
      unique: true
    },
    {
      value: 'end',
      label: '終了トリガー',
      description: 'フローの終了処理',
      icon: <StopIcon className="w-5 h-5" />,
      color: 'text-red-600 bg-red-100',
      unique: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templateTypes.map(type => {
        const isDisabled = type.unique && existingTypes.includes(type.value);
        
        return (
          <div
            key={type.value}
            className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
              value === type.value
                ? 'border-blue-500 bg-blue-50'
                : isDisabled
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => !isDisabled && onChange(type.value)}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-md ${type.color}`}>
                {type.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{type.label}</h4>
                <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                {isDisabled && (
                  <p className="text-xs text-red-600 mt-1">
                    既に作成済みです
                  </p>
                )}
              </div>
            </div>
            
            {value === type.value && (
              <div className="absolute top-2 right-2">
                <CheckIcon className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
```

##### 3.3 ステップ順序管理
```tsx
interface StepOrderSelectorProps {
  value: number;
  onChange: (order: number) => void;
  existingOrders: number[];
  templateType: string;
}

const StepOrderSelector: React.FC<StepOrderSelectorProps> = ({
  value,
  onChange,
  existingOrders,
  templateType
}) => {
  const getRecommendedOrder = (type: string) => {
    switch (type) {
      case 'start': return 1;
      case 'tree': return 2;
      case 'message': return 3;
      case 'lottery_group': return 4;
      case 'end': return 5;
      default: return Math.max(...existingOrders, 0) + 1;
    }
  };

  const recommendedOrder = getRecommendedOrder(templateType);
  const maxOrder = Math.max(...existingOrders, 0) + 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <NumberInput
          value={value}
          onChange={onChange}
          min={1}
          max={maxOrder}
          placeholder={recommendedOrder.toString()}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange(recommendedOrder)}
        >
          推奨値を使用 ({recommendedOrder})
        </Button>
      </div>
      
      {/* 既存のステップ順序表示 */}
      <div className="bg-gray-50 p-3 rounded-md">
        <h5 className="text-sm font-medium text-gray-700 mb-2">
          現在のステップ順序
        </h5>
        <div className="flex items-center gap-2 flex-wrap">
          {Array.from({ length: maxOrder }, (_, i) => i + 1).map(order => {
            const isExisting = existingOrders.includes(order);
            const isSelected = value === order;
            
            return (
              <button
                key={order}
                type="button"
                className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : isExisting
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => !isExisting && onChange(order)}
                disabled={isExisting}
              >
                {order}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
```

---

## 共通仕様

### 状態管理
```tsx
// store/slices/templatesSlice.ts
interface TemplatesState {
  selectedTemplate: Template | null;
  filters: TemplateFilters;
  flowEditor: {
    currentTemplate: Template | null;
    nodes: Node[];
    edges: Edge[];
    selectedNodeId: number | null;
  };
}

export const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setFlowEditorData: (state, action) => {
      state.flowEditor = { ...state.flowEditor, ...action.payload };
    }
  }
});
```

### API連携
```tsx
// services/api/templateApi.ts
export const templateApi = createApi({
  reducerPath: 'templateApi',
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
  tagTypes: ['Template', 'TemplateNode'],
  endpoints: (builder) => ({
    getTemplates: builder.query<TemplatesResponse, TemplateFilters>({
      query: (params) => ({
        url: '/in_instantwin_templates',
        params
      }),
      providesTags: ['Template']
    }),
    getTemplate: builder.query<Template, number>({
      query: (id) => `/in_instantwin_templates/${id}`,
      providesTags: (result, error, id) => [{ type: 'Template', id }]
    }),
    createTemplate: builder.mutation<Template, CreateTemplateRequest>({
      query: (body) => ({
        url: '/in_instantwin_templates',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Template']
    }),
    updateTemplate: builder.mutation<Template, UpdateTemplateRequest>({
      query: ({ id, ...body }) => ({
        url: `/in_instantwin_templates/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Template', id }]
    }),
    deleteTemplate: builder.mutation<void, number>({
      query: (id) => ({
        url: `/in_instantwin_templates/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Template']
    }),
    getTemplateNodes: builder.query<Node[], number>({
      query: (templateId) => `/in_instantwin_templates/${templateId}/nodes`,
      providesTags: (result, error, templateId) => [
        { type: 'TemplateNode', id: templateId }
      ]
    })
  })
});
```

### 型定義
```tsx
// types/template.ts
export interface Template {
  id: number;
  prizeId: number;
  prizeName: string;
  campaignId: number;
  campaignTitle: string;
  name: string;
  type: 'start' | 'tree' | 'message' | 'lottery_group' | 'end';
  stepOrder: number;
  nodeCount: number;
  messageCount: number;
  edgeCount: number;
  optionCount: number;
  previewMessage?: string;
  lotterySettings?: {
    winningRate: number;
    dailyLimit?: number;
  };
  created: Date;
  modified: Date;
}

export interface Node {
  id: number;
  templateId: number;
  prizeId: number;
  type: string;
  position?: { x: number; y: number };
  message?: {
    id: number;
    text: string;
    messageType: string;
  };
  selectOptions?: SelectOption[];
  incomingEdges: number;
  outgoingEdges: number;
}

export interface TemplateFilters {
  prizeId?: number;
  campaignId?: number;
  templateType?: string;
  searchText?: string;
  page?: number;
  limit?: number;
}
```

### カスタムフック
```tsx
// hooks/useTemplateValidation.ts
export const useTemplateValidation = (prizeId: number) => {
  const { data: existingTemplates } = useGetTemplatesQuery({ prizeId });
  
  const validateTemplateOrder = (type: string, order: number) => {
    const typeOrder = {
      start: 1,
      tree: 2, 
      message: 3,
      lottery_group: 4,
      end: 5
    };
    
    if (type in typeOrder && order !== typeOrder[type]) {
      return `${type}テンプレートの推奨順序は${typeOrder[type]}です`;
    }
    
    return null;
  };
  
  const validateUniqueType = (type: string) => {
    const uniqueTypes = ['start', 'lottery_group', 'end'];
    if (uniqueTypes.includes(type)) {
      const exists = existingTemplates?.some(t => t.type === type);
      if (exists) {
        return `${type}テンプレートは既に存在します`;
      }
    }
    
    return null;
  };
  
  return {
    validateTemplateOrder,
    validateUniqueType,
    existingTemplates: existingTemplates || []
  };
};
```

### バリデーション
```tsx
import { z } from 'zod';

export const templateSchema = z.object({
  name: z
    .string()
    .min(1, 'テンプレート名は必須です')
    .max(255, 'テンプレート名は255文字以内で入力してください'),
  type: z.enum(['start', 'tree', 'message', 'lottery_group', 'end']),
  stepOrder: z
    .number()
    .min(1, 'ステップ順序は1以上で入力してください')
    .max(100, 'ステップ順序は100以下で入力してください'),
  prizeId: z
    .number()
    .min(1, 'プライズIDは必須です')
});
```
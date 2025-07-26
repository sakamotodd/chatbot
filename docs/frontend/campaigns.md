# キャンペーン管理画面（メインダッシュボード）仕様書

## 概要
Instagramインスタントウィンキャンペーンのキャンペーン管理に関するフロントエンド画面の詳細仕様。
キャンペーンの作成、編集、一覧表示、詳細表示、分析機能を提供します。
**このキャンペーン一覧画面がアプリケーションのメインダッシュボードとして機能します。**

## 関連バックエンドAPI
```
/api/campaigns
```

---

## 画面一覧

### 1. キャンペーン一覧画面（メインダッシュボード）

#### 画面パス
```
/ (ルートパス - メインダッシュボード)
/campaigns (キャンペーン管理エイリアス)
```

#### 画面説明
登録されている全キャンペーンの一覧を表示し、検索・フィルタ・ソート機能を提供します。
**アプリケーションのメインダッシュボードとして、システム全体の概要情報も併せて表示します。**

#### コンポーネント構成
```tsx
// pages/campaigns/index.tsx
const CampaignsPage: React.FC = () => {
  return (
    <PageLayout title="キャンペーン管理 - ダッシュボード">
      <DashboardOverview />
      <CampaignFilters />
      <CampaignToolbar />
      <CampaignGrid />
      <Pagination />
    </PageLayout>
  );
};
```

#### ダッシュボード概要セクション
```tsx
// pages/campaigns/components/DashboardOverview.tsx
interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalConversations: number;
  totalPrizes: number;
  winningRate: number;
}

const DashboardOverview: React.FC = () => {
  const { data: stats } = useDashboardStats();
  
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatsCard
        title="総キャンペーン数"
        value={stats.totalCampaigns}
        icon={<CampaignIcon />}
        trend={{ value: 12, direction: 'up' }}
      />
      <StatsCard
        title="実行中キャンペーン"
        value={stats.activeCampaigns}
        icon={<ActiveIcon />}
        status="success"
      />
      <StatsCard
        title="総会話数"
        value={stats.totalConversations}
        icon={<ConversationIcon />}
        trend={{ value: 8, direction: 'up' }}
      />
      <StatsCard
        title="配布プライズ数"
        value={stats.totalPrizes}
        icon={<PrizeIcon />}
        trend={{ value: 15, direction: 'up' }}
      />
      <StatsCard
        title="平均当選率"
        value={`${stats.winningRate}%`}
        icon={<PercentageIcon />}
        status="warning"
      />
    </div>
  );
};
```

#### 主要機能

##### 1.1 フィルタ機能
```tsx
interface CampaignFilters {
  status?: 'draft' | 'active' | 'paused' | 'completed';
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  searchText?: string;
}

const CampaignFilters: React.FC = () => {
  const [filters, setFilters] = useState<CampaignFilters>({});
  
  return (
    <FilterPanel>
      <StatusFilter 
        value={filters.status} 
        onChange={(status) => setFilters({...filters, status})}
      />
      <DateRangeFilter 
        value={filters.dateRange}
        onChange={(dateRange) => setFilters({...filters, dateRange})}
      />
      <SearchInput 
        placeholder="キャンペーン名で検索..."
        value={filters.searchText}
        onChange={(searchText) => setFilters({...filters, searchText})}
      />
    </FilterPanel>
  );
};
```

##### 1.2 キャンペーンカード
```tsx
interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onDuplicate: (id: number) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ 
  campaign, 
  onEdit, 
  onDelete, 
  onDuplicate 
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{campaign.title}</h3>
            <StatusBadge status={campaign.status} />
          </div>
          <DropdownMenu>
            <DropdownItem onClick={() => onEdit(campaign.id)}>
              編集
            </DropdownItem>
            <DropdownItem onClick={() => onDuplicate(campaign.id)}>
              複製
            </DropdownItem>
            <DropdownItem 
              onClick={() => onDelete(campaign.id)}
              destructive
            >
              削除
            </DropdownItem>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 mb-4">{campaign.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">開始日:</span>
            <p>{formatDate(campaign.startDate)}</p>
          </div>
          <div>
            <span className="text-gray-500">終了日:</span>
            <p>{formatDate(campaign.endDate)}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <div className="text-sm text-gray-500">
            更新: {formatRelativeTime(campaign.modified)}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateTo(`/campaigns/${campaign.id}`)}
            >
              詳細
            </Button>
            <Button 
              size="sm"
              onClick={() => onEdit(campaign.id)}
            >
              編集
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
```

##### 1.3 API連携
```tsx
// hooks/useCampaigns.ts
export const useCampaigns = () => {
  const [filters, setFilters] = useState<CampaignFilters>({});
  const [pagination, setPagination] = useState({ page: 1, limit: 12 });
  
  const { 
    data: campaignsData, 
    isLoading, 
    error,
    refetch 
  } = useGetCampaignsQuery({
    ...filters,
    ...pagination
  });

  const [deleteCampaign] = useDeleteCampaignMutation();
  const [duplicateCampaign] = useDuplicateCampaignMutation();

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirmDialog({
      title: 'キャンペーンを削除しますか？',
      message: 'この操作は取り消せません。',
      confirmText: '削除',
      cancelText: 'キャンセル'
    });
    
    if (confirmed) {
      await deleteCampaign(id).unwrap();
      showToast('キャンペーンを削除しました', 'success');
    }
  };

  return {
    campaigns: campaignsData?.campaigns || [],
    pagination: campaignsData?.pagination,
    isLoading,
    error,
    filters,
    setFilters,
    handleDelete,
    refetch
  };
};
```

---

### 2. キャンペーン詳細画面

#### 画面パス
```
/campaigns/:id
```

#### 画面説明
指定されたキャンペーンの詳細情報、関連プライズ、統計データを表示します。

#### コンポーネント構成
```tsx
// pages/campaigns/[id]/index.tsx
const CampaignDetailPage: React.FC = () => {
  const { id } = useParams();
  const { campaign, isLoading } = useCampaignDetail(id);

  if (isLoading) return <LoadingSpinner />;

  return (
    <PageLayout 
      title={campaign.title}
      breadcrumbs={[
        { label: 'キャンペーン', href: '/campaigns' },
        { label: campaign.title }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CampaignInfo campaign={campaign} />
          <CampaignPrizes campaignId={campaign.id} />
          <CampaignAnalytics campaignId={campaign.id} />
        </div>
        
        <div className="lg:col-span-1">
          <CampaignActions campaign={campaign} />
          <CampaignTimeline campaignId={campaign.id} />
        </div>
      </div>
    </PageLayout>
  );
};
```

#### 主要機能

##### 2.1 キャンペーン情報表示
```tsx
interface CampaignInfoProps {
  campaign: Campaign;
}

const CampaignInfo: React.FC<CampaignInfoProps> = ({ campaign }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{campaign.title}</h2>
            <StatusBadge status={campaign.status} size="lg" />
          </div>
          <Link to={`/campaigns/${campaign.id}/edit`}>
            <Button variant="outline">
              <EditIcon className="w-4 h-4 mr-2" />
              編集
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700">説明</h4>
            <p className="text-gray-600">{campaign.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem 
              label="開始日時" 
              value={formatDateTime(campaign.startDate)} 
            />
            <InfoItem 
              label="終了日時" 
              value={formatDateTime(campaign.endDate)} 
            />
            <InfoItem 
              label="作成日" 
              value={formatDateTime(campaign.created)} 
            />
            <InfoItem 
              label="最終更新" 
              value={formatDateTime(campaign.modified)} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

##### 2.2 関連プライズ表示
```tsx
interface CampaignPrizesProps {
  campaignId: number;
}

const CampaignPrizes: React.FC<CampaignPrizesProps> = ({ campaignId }) => {
  const { data: prizes, isLoading } = useGetPrizesQuery({ campaignId });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">プライズ一覧</h3>
          <Link to={`/prizes/create?campaignId=${campaignId}`}>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              プライズ追加
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-4">
            {prizes?.map(prize => (
              <PrizeListItem 
                key={prize.id} 
                prize={prize}
                onEdit={(id) => navigateTo(`/prizes/${id}/edit`)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

---

### 3. キャンペーン作成画面

#### 画面パス
```
/campaigns/create
```

#### 画面説明
新しいキャンペーンを作成するためのフォーム画面です。

#### コンポーネント構成
```tsx
// pages/campaigns/create.tsx
const CampaignCreatePage: React.FC = () => {
  return (
    <PageLayout 
      title="キャンペーン作成"
      breadcrumbs={[
        { label: 'キャンペーン', href: '/campaigns' },
        { label: '新規作成' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <CampaignForm 
          mode="create"
          onSubmit={handleCreate}
          onCancel={() => navigateTo('/campaigns')}
        />
      </div>
    </PageLayout>
  );
};
```

#### 主要機能

##### 3.1 キャンペーンフォーム
```tsx
interface CampaignFormData {
  title: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate?: Date;
  endDate?: Date;
}

interface CampaignFormProps {
  mode: 'create' | 'edit';
  initialData?: Campaign;
  onSubmit: (data: CampaignFormData) => Promise<void>;
  onCancel: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CampaignFormData>({
    defaultValues: initialData || {
      title: '',
      description: '',
      status: 'draft'
    },
    resolver: zodResolver(campaignSchema)
  });

  const watchedEndDate = watch('endDate');
  const watchedStartDate = watch('startDate');

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">基本情報</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              label="キャンペーン名"
              required
              error={errors.title?.message}
            >
              <Input
                {...register('title')}
                placeholder="春のプレゼントキャンペーン"
                maxLength={255}
              />
            </FormField>

            <FormField
              label="説明"
              error={errors.description?.message}
            >
              <TextArea
                {...register('description')}
                placeholder="キャンペーンの詳細説明を入力してください"
                rows={4}
                maxLength={1000}
              />
            </FormField>

            <FormField
              label="ステータス"
              error={errors.status?.message}
            >
              <Select {...register('status')}>
                <option value="draft">下書き</option>
                <option value="active">公開中</option>
                <option value="paused">一時停止</option>
                <option value="completed">終了</option>
              </Select>
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">開催期間</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="開始日時"
                error={errors.startDate?.message}
              >
                <DateTimePicker
                  {...register('startDate')}
                  placeholder="開始日時を選択"
                />
              </FormField>

              <FormField
                label="終了日時"
                error={errors.endDate?.message}
              >
                <DateTimePicker
                  {...register('endDate')}
                  placeholder="終了日時を選択"
                  minDate={watchedStartDate}
                />
              </FormField>
            </div>

            {watchedStartDate && watchedEndDate && (
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-700">
                  開催期間: {calculateDuration(watchedStartDate, watchedEndDate)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
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

##### 3.2 バリデーション
```tsx
import { z } from 'zod';

export const campaignSchema = z.object({
  title: z
    .string()
    .min(1, 'キャンペーン名は必須です')
    .max(255, 'キャンペーン名は255文字以内で入力してください'),
  description: z
    .string()
    .max(1000, '説明は1000文字以内で入力してください')
    .optional(),
  status: z.enum(['draft', 'active', 'paused', 'completed']),
  startDate: z.date().optional(),
  endDate: z.date().optional()
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.endDate > data.startDate;
    }
    return true;
  },
  {
    message: '終了日時は開始日時より後の日時を設定してください',
    path: ['endDate']
  }
);
```

---

### 4. キャンペーン編集画面

#### 画面パス
```
/campaigns/:id/edit
```

#### 画面説明
既存キャンペーンの編集を行う画面です。作成画面と同じフォームコンポーネントを使用します。

#### コンポーネント構成
```tsx
// pages/campaigns/[id]/edit.tsx
const CampaignEditPage: React.FC = () => {
  const { id } = useParams();
  const { campaign, isLoading } = useCampaignDetail(id);
  const [updateCampaign] = useUpdateCampaignMutation();

  const handleUpdate = async (data: CampaignFormData) => {
    try {
      await updateCampaign({ id: Number(id), ...data }).unwrap();
      showToast('キャンペーンを更新しました', 'success');
      navigateTo(`/campaigns/${id}`);
    } catch (error) {
      showToast('更新に失敗しました', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <PageLayout 
      title="キャンペーン編集"
      breadcrumbs={[
        { label: 'キャンペーン', href: '/campaigns' },
        { label: campaign.title, href: `/campaigns/${id}` },
        { label: '編集' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <CampaignForm 
          mode="edit"
          initialData={campaign}
          onSubmit={handleUpdate}
          onCancel={() => navigateTo(`/campaigns/${id}`)}
        />
      </div>
    </PageLayout>
  );
};
```

---

## 共通仕様

### 状態管理
```tsx
// store/slices/campaignsSlice.ts
interface CampaignsState {
  selectedCampaign: Campaign | null;
  filters: CampaignFilters;
  sortConfig: SortConfig;
}

export const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    setSelectedCampaign: (state, action) => {
      state.selectedCampaign = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSortConfig: (state, action) => {
      state.sortConfig = action.payload;
    }
  }
});
```

### API連携
```tsx
// services/api/campaignApi.ts
export const campaignApi = createApi({
  reducerPath: 'campaignApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/campaigns',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Campaign'],
  endpoints: (builder) => ({
    getCampaigns: builder.query<CampaignsResponse, CampaignFilters>({
      query: (params) => ({
        url: '',
        params
      }),
      providesTags: ['Campaign']
    }),
    getCampaign: builder.query<Campaign, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Campaign', id }]
    }),
    createCampaign: builder.mutation<Campaign, CreateCampaignRequest>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Campaign']
    }),
    updateCampaign: builder.mutation<Campaign, UpdateCampaignRequest>({
      query: ({ id, ...body }) => ({
        url: `/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Campaign', id }]
    }),
    deleteCampaign: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Campaign']
    })
  })
});
```

### 型定義
```tsx
// types/campaign.ts
export interface Campaign {
  id: number;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate?: Date;
  endDate?: Date;
  created: Date;
  modified: Date;
}

export interface CampaignFilters {
  page?: number;
  limit?: number;
  status?: Campaign['status'];
  sort?: string;
  searchText?: string;
}

export interface CampaignsResponse {
  campaigns: Campaign[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    perPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### エラーハンドリング
```tsx
// utils/errorHandler.ts
export const handleApiError = (error: any) => {
  if (error.status === 401) {
    // 認証エラー
    store.dispatch(logout());
    navigateTo('/login');
  } else if (error.status === 403) {
    // 権限エラー
    showToast('アクセス権限がありません', 'error');
  } else if (error.status === 404) {
    // Not Found
    showToast('データが見つかりません', 'error');
  } else {
    // その他のエラー
    showToast('エラーが発生しました', 'error');
  }
};
```

---

## ダッシュボード機能

### ダッシュボード統計API
```tsx
// hooks/useDashboardStats.ts
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get<DashboardStats>('/api/dashboard/stats');
      return response.data;
    },
    refetchInterval: 30000, // 30秒ごとに更新
  });
};
```

### リアルタイム更新機能
```tsx
// hooks/useRealtimeDashboard.ts
export const useRealtimeDashboard = () => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'STATS_UPDATE') {
        // ダッシュボード統計の更新
        queryClient.invalidateQueries(['dashboard-stats']);
      } else if (data.type === 'CAMPAIGN_STATUS_CHANGE') {
        // キャンペーン状態変更の通知
        queryClient.invalidateQueries(['campaigns']);
        showToast(`キャンペーン「${data.campaignTitle}」の状態が変更されました`, 'info');
      }
    };
    
    return () => socket.close();
  }, [queryClient]);
};
```

### ダッシュボード専用コンポーネント
```tsx
// pages/campaigns/components/QuickActions.tsx
const QuickActions: React.FC = () => {
  return (
    <div className="mb-6 flex gap-4">
      <Button 
        variant="primary" 
        size="lg"
        onClick={() => navigate('/campaigns/create')}
        className="flex items-center gap-2"
      >
        <PlusIcon className="w-5 h-5" />
        新規キャンペーン作成
      </Button>
      <Button 
        variant="secondary"
        onClick={() => navigate('/templates')}
        className="flex items-center gap-2"
      >
        <TemplateIcon className="w-5 h-5" />
        テンプレート管理
      </Button>
      <Button 
        variant="secondary"
        onClick={() => navigate('/flow-editor')}
        className="flex items-center gap-2"
      >
        <FlowIcon className="w-5 h-5" />
        フローエディタ
      </Button>
    </div>
  );
};
```

### 最近のアクティビティセクション
```tsx
// pages/campaigns/components/RecentActivity.tsx
interface ActivityItem {
  id: string;
  type: 'campaign_created' | 'campaign_started' | 'prize_won' | 'conversation_started';
  title: string;
  description: string;
  timestamp: Date;
  userId?: string;
  campaignId?: number;
}

const RecentActivity: React.FC = () => {
  const { data: activities } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: () => api.get<ActivityItem[]>('/api/dashboard/recent-activity'),
  });
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="text-lg font-semibold">最近のアクティビティ</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities?.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
              <ActivityIcon type={activity.type} />
              <div className="flex-1">
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: ja })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
```

### システム状態監視
```tsx
// pages/campaigns/components/SystemStatus.tsx
const SystemStatus: React.FC = () => {
  const { data: systemHealth } = useQuery({
    queryKey: ['system-health'],
    queryFn: () => api.get('/api/dashboard/system-health'),
    refetchInterval: 60000, // 1分ごとに更新
  });
  
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ServerIcon className="w-5 h-5" />
          システム状態
        </h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <StatusIndicator 
            label="API サーバー"
            status={systemHealth?.apiServer || 'unknown'}
          />
          <StatusIndicator 
            label="データベース"
            status={systemHealth?.database || 'unknown'}
          />
          <StatusIndicator 
            label="WebSocket"
            status={systemHealth?.websocket || 'unknown'}
          />
          <StatusIndicator 
            label="外部API"
            status={systemHealth?.externalApi || 'unknown'}
          />
        </div>
      </CardContent>
    </Card>
  );
};
```

### 更新されたメインコンポーネント
```tsx
// pages/campaigns/index.tsx
const CampaignsPage: React.FC = () => {
  useRealtimeDashboard(); // リアルタイム更新機能を有効化
  
  return (
    <PageLayout title="キャンペーン管理 - ダッシュボード">
      <div className="space-y-6">
        {/* ダッシュボード概要統計 */}
        <DashboardOverview />
        
        {/* クイックアクション */}
        <QuickActions />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* メインコンテンツ: キャンペーン一覧 */}
          <div className="lg:col-span-2">
            <CampaignFilters />
            <CampaignToolbar />
            <CampaignGrid />
            <Pagination />
          </div>
          
          {/* サイドバー: 追加情報 */}
          <div className="space-y-6">
            <RecentActivity />
            <SystemStatus />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
```

---

### アクセシビリティ
- ARIA属性の適切な設定
- キーボードナビゲーション対応
- スクリーンリーダー対応
- 色のコントラスト比4.5:1以上確保
- フォーカス表示の明確化
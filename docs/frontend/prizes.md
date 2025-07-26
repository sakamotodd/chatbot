# プライズ管理画面 仕様書

## 概要
Instagramインスタントウィンキャンペーンのプライズ管理に関するフロントエンド画面の詳細仕様。
プライズの作成、編集、一覧表示、当選確率設定、抽選制限管理機能を提供します。

## 関連バックエンドAPI
```
/api/campaigns/:campaignId/in_instantwin_prizes
/api/in_instantwin_prizes
```

---

## 画面一覧

### 1. プライズ一覧画面

#### 画面パス
```
/prizes
/campaigns/:campaignId/prizes
```

#### 画面説明
登録されているプライズの一覧を表示し、キャンペーン別フィルタ、検索機能を提供します。

#### コンポーネント構成
```tsx
// pages/prizes/index.tsx
const PrizesPage: React.FC = () => {
  const { campaignId } = useParams();
  
  return (
    <PageLayout title="プライズ管理">
      <PrizeFilters campaignId={campaignId} />
      <PrizeToolbar campaignId={campaignId} />
      <PrizeGrid />
      <Pagination />
    </PageLayout>
  );
};
```

#### 主要機能

##### 1.1 フィルタ機能
```tsx
interface PrizeFilters {
  campaignId?: number;
  searchText?: string;
  winningRateRange?: {
    min: number;
    max: number;
  };
  isActive?: boolean;
}

const PrizeFilters: React.FC<{ campaignId?: number }> = ({ campaignId }) => {
  const [filters, setFilters] = useState<PrizeFilters>({ campaignId });
  const { data: campaigns } = useGetCampaignsQuery({});
  
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
      
      <SearchInput 
        placeholder="プライズ名で検索..."
        value={filters.searchText}
        onChange={(searchText) => setFilters({...filters, searchText})}
      />
      
      <FormField label="当選確率">
        <RangeSlider
          min={0}
          max={100}
          value={[
            filters.winningRateRange?.min || 0,
            filters.winningRateRange?.max || 100
          ]}
          onChange={([min, max]) => 
            setFilters({
              ...filters, 
              winningRateRange: { min, max }
            })
          }
          formatLabel={(value) => `${value}%`}
        />
      </FormField>
      
      <FormField label="ステータス">
        <Toggle
          checked={filters.isActive}
          onChange={(isActive) => setFilters({...filters, isActive})}
          label="アクティブのみ"
        />
      </FormField>
    </FilterPanel>
  );
};
```

##### 1.2 プライズカード
```tsx
interface PrizeCardProps {
  prize: Prize;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onDuplicate: (id: number) => void;
}

const PrizeCard: React.FC<PrizeCardProps> = ({ 
  prize, 
  onEdit, 
  onDelete, 
  onDuplicate 
}) => {
  const winningPercentage = (prize.sendWinnerCount / prize.winnerCount) * 100;
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{prize.name}</h3>
            <p className="text-sm text-gray-500">{prize.campaignTitle}</p>
          </div>
          <DropdownMenu>
            <DropdownItem onClick={() => onEdit(prize.id)}>
              編集
            </DropdownItem>
            <DropdownItem onClick={() => onDuplicate(prize.id)}>
              複製
            </DropdownItem>
            <DropdownItem 
              onClick={() => onDelete(prize.id)}
              destructive
            >
              削除
            </DropdownItem>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 mb-4">{prize.description}</p>
        
        <div className="space-y-3">
          {/* 当選状況 */}
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">当選状況</span>
              <span className="text-sm text-gray-600">
                {prize.sendWinnerCount} / {prize.winnerCount}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${winningPercentage}%` }}
              />
            </div>
          </div>
          
          {/* 統計情報 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">当選確率:</span>
              <p className="font-medium">{prize.winningRate}%</p>
            </div>
            <div>
              <span className="text-gray-500">日次制限:</span>
              <p className="font-medium">
                {prize.isDailyLottery ? `${prize.dailyWinnerCount}名/日` : '制限なし'}
              </p>
            </div>
          </div>
          
          {/* 抽選制限 */}
          {prize.lotteryCountPerMinute && (
            <div className="text-sm">
              <span className="text-gray-500">分間制限:</span>
              <span className="font-medium ml-1">
                {prize.lotteryCountPerMinute}回/分
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <div className="text-sm text-gray-500">
            更新: {formatRelativeTime(prize.modified)}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateTo(`/prizes/${prize.id}`)}
            >
              詳細
            </Button>
            <Button 
              size="sm"
              onClick={() => onEdit(prize.id)}
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

---

### 2. プライズ詳細画面

#### 画面パス
```
/prizes/:id
```

#### 画面説明
指定されたプライズの詳細情報、抽選履歴、関連テンプレートを表示します。

#### コンポーネント構成
```tsx
// pages/prizes/[id]/index.tsx
const PrizeDetailPage: React.FC = () => {
  const { id } = useParams();
  const { prize, isLoading } = usePrizeDetail(id);

  if (isLoading) return <LoadingSpinner />;

  return (
    <PageLayout 
      title={prize.name}
      breadcrumbs={[
        { label: 'プライズ', href: '/prizes' },
        { label: prize.name }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PrizeInfo prize={prize} />
          <PrizeTemplates prizeId={prize.id} />
          <LotteryHistory prizeId={prize.id} />
        </div>
        
        <div className="lg:col-span-1">
          <PrizeActions prize={prize} />
          <LotteryStats prizeId={prize.id} />
          <WinningRateChart prizeId={prize.id} />
        </div>
      </div>
    </PageLayout>
  );
};
```

#### 主要機能

##### 2.1 プライズ情報表示
```tsx
interface PrizeInfoProps {
  prize: Prize;
}

const PrizeInfo: React.FC<PrizeInfoProps> = ({ prize }) => {
  const winningPercentage = (prize.sendWinnerCount / prize.winnerCount) * 100;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{prize.name}</h2>
            <p className="text-gray-600">{prize.campaignTitle}</p>
          </div>
          <Link to={`/prizes/${prize.id}/edit`}>
            <Button variant="outline">
              <EditIcon className="w-4 h-4 mr-2" />
              編集
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">説明</h4>
            <p className="text-gray-600">{prize.description}</p>
          </div>
          
          {/* 当選状況表示 */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">当選状況</h4>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">
                  進捗状況
                </span>
                <span className="text-lg font-bold text-indigo-600">
                  {prize.sendWinnerCount} / {prize.winnerCount}
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-3 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${winningPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>0</span>
                <span>{winningPercentage.toFixed(1)}% 完了</span>
                <span>{prize.winnerCount}</span>
              </div>
            </div>
          </div>
          
          {/* 抽選設定 */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">抽選設定</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem 
                label="当選確率" 
                value={`${prize.winningRate}%`}
                highlight
              />
              <InfoItem 
                label="確率変更タイプ" 
                value={getWinningRateTypeLabel(prize.winningRateChangeType)}
              />
              {prize.isDailyLottery && (
                <>
                  <InfoItem 
                    label="日次当選者数" 
                    value={`${prize.dailyWinnerCount}名/日`}
                  />
                  <InfoItem 
                    label="分間抽選制限" 
                    value={prize.lotteryCountPerMinute ? 
                      `${prize.lotteryCountPerMinute}回/分` : '制限なし'}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

##### 2.2 抽選履歴表示
```tsx
interface LotteryHistoryProps {
  prizeId: number;
}

const LotteryHistory: React.FC<LotteryHistoryProps> = ({ prizeId }) => {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('24h');
  const { data: history, isLoading } = useLotteryHistoryQuery({ 
    prizeId, 
    period 
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">抽選履歴</h3>
          <Select value={period} onChange={setPeriod}>
            <option value="24h">過去24時間</option>
            <option value="7d">過去7日</option>
            <option value="30d">過去30日</option>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-4">
            {/* 期間統計 */}
            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {history?.totalAttempts || 0}
                </div>
                <div className="text-sm text-gray-600">総抽選回数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {history?.totalWins || 0}
                </div>
                <div className="text-sm text-gray-600">当選回数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {history?.winRate || 0}%
                </div>
                <div className="text-sm text-gray-600">実際の当選率</div>
              </div>
            </div>
            
            {/* 抽選記録リスト */}
            <div className="space-y-2">
              {history?.records?.map(record => (
                <div 
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-white border rounded-md hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      record.isWin ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <div>
                      <p className="font-medium">{record.userName}</p>
                      <p className="text-sm text-gray-500">
                        確率: {record.lotteryRate}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      record.isWin ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {record.isWin ? '当選' : '落選'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDateTime(record.created)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

---

### 3. プライズ作成画面

#### 画面パス
```
/prizes/create
/campaigns/:campaignId/prizes/create
```

#### 画面説明
新しいプライズを作成するためのフォーム画面です。

#### 主要機能

##### 3.1 プライズフォーム
```tsx
interface PrizeFormData {
  campaignId?: number;
  name: string;
  description: string;
  winnerCount: number;
  winningRate: number;
  winningRateChangeType: number;
  dailyWinnerCount?: number;
  isDailyLottery: boolean;
  lotteryCountPerMinute?: number;
}

const PrizeForm: React.FC<PrizeFormProps> = ({
  mode,
  initialData,
  campaignId,
  onSubmit,
  onCancel
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<PrizeFormData>({
    defaultValues: initialData || {
      campaignId,
      name: '',
      description: '',
      winnerCount: 1,
      winningRate: 10.0,
      winningRateChangeType: 1,
      isDailyLottery: false
    },
    resolver: zodResolver(prizeSchema)
  });

  const watchedIsDailyLottery = watch('isDailyLottery');
  const watchedWinningRate = watch('winningRate');
  const watchedWinnerCount = watch('winnerCount');

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">基本情報</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              label="プライズ名"
              required
              error={errors.name?.message}
            >
              <Input
                {...register('name')}
                placeholder="豪華賞品セット"
                maxLength={255}
              />
            </FormField>

            <FormField
              label="説明"
              error={errors.description?.message}
            >
              <TextArea
                {...register('description')}
                placeholder="プライズの詳細説明を入力してください"
                rows={3}
                maxLength={1000}
              />
            </FormField>

            <FormField
              label="当選者数"
              required
              error={errors.winnerCount?.message}
            >
              <NumberInput
                {...register('winnerCount', { valueAsNumber: true })}
                min={1}
                max={10000}
                placeholder="100"
              />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">抽選設定</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 当選確率設定 */}
            <div>
              <FormField
                label="当選確率"
                required
                error={errors.winningRate?.message}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Slider
                        value={[watchedWinningRate]}
                        onValueChange={([value]) => setValue('winningRate', value)}
                        max={100}
                        step={0.1}
                      />
                    </div>
                    <div className="w-20">
                      <NumberInput
                        {...register('winningRate', { valueAsNumber: true })}
                        min={0.1}
                        max={100}
                        step={0.1}
                        suffix="%"
                      />
                    </div>
                  </div>
                  
                  {/* 確率プレビュー */}
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-700">
                      予想当選者数: 約{Math.round((watchedWinningRate / 100) * 1000)}名
                      （1000回抽選の場合）
                    </p>
                  </div>
                </div>
              </FormField>

              <FormField
                label="確率変更タイプ"
                error={errors.winningRateChangeType?.message}
              >
                <Select {...register('winningRateChangeType', { valueAsNumber: true })}>
                  <option value={1}>固定確率</option>
                  <option value={2}>段階的減少</option>
                  <option value={3}>時間帯別変更</option>
                  <option value={4}>動的調整</option>
                </Select>
              </FormField>
            </div>

            {/* 日次制限設定 */}
            <div>
              <FormField label="日次制限">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register('isDailyLottery')}
                      id="isDailyLottery"
                      className="rounded"
                    />
                    <label htmlFor="isDailyLottery" className="text-sm">
                      1日あたりの当選者数を制限する
                    </label>
                  </div>
                  
                  {watchedIsDailyLottery && (
                    <FormField
                      label="日次当選者数"
                      error={errors.dailyWinnerCount?.message}
                    >
                      <NumberInput
                        {...register('dailyWinnerCount', { valueAsNumber: true })}
                        min={1}
                        max={watchedWinnerCount}
                        placeholder="10"
                        suffix="名/日"
                      />
                    </FormField>
                  )}
                </div>
              </FormField>
            </div>

            {/* 分間制限設定 */}
            <FormField
              label="分間抽選制限"
              error={errors.lotteryCountPerMinute?.message}
            >
              <NumberInput
                {...register('lotteryCountPerMinute', { valueAsNumber: true })}
                min={1}
                max={1000}
                placeholder="制限なしの場合は空白"
                suffix="回/分"
              />
            </FormField>
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

export const prizeSchema = z.object({
  name: z
    .string()
    .min(1, 'プライズ名は必須です')
    .max(255, 'プライズ名は255文字以内で入力してください'),
  description: z
    .string()
    .max(1000, '説明は1000文字以内で入力してください')
    .optional(),
  winnerCount: z
    .number()
    .min(1, '当選者数は1以上で入力してください')
    .max(10000, '当選者数は10000以下で入力してください'),
  winningRate: z
    .number()
    .min(0.1, '当選確率は0.1%以上で入力してください')
    .max(100, '当選確率は100%以下で入力してください'),
  winningRateChangeType: z
    .number()
    .min(1)
    .max(4),
  isDailyLottery: z.boolean(),
  dailyWinnerCount: z
    .number()
    .min(1)
    .optional(),
  lotteryCountPerMinute: z
    .number()
    .min(1)
    .optional()
}).refine(
  (data) => {
    if (data.isDailyLottery && !data.dailyWinnerCount) {
      return false;
    }
    if (data.isDailyLottery && data.dailyWinnerCount && data.dailyWinnerCount > data.winnerCount) {
      return false;
    }
    return true;
  },
  {
    message: '日次当選者数は総当選者数以下で設定してください',
    path: ['dailyWinnerCount']
  }
);
```

---

## 共通仕様

### 状態管理
```tsx
// store/slices/prizesSlice.ts
interface PrizesState {
  selectedPrize: Prize | null;
  filters: PrizeFilters;
  lotteryPreview: LotteryPreview | null;
}

export const prizesSlice = createSlice({
  name: 'prizes',
  initialState,
  reducers: {
    setSelectedPrize: (state, action) => {
      state.selectedPrize = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLotteryPreview: (state, action) => {
      state.lotteryPreview = action.payload;
    }
  }
});
```

### API連携
```tsx
// services/api/prizeApi.ts
export const prizeApi = createApi({
  reducerPath: 'prizeApi',
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
  tagTypes: ['Prize', 'LotteryHistory'],
  endpoints: (builder) => ({
    getPrizes: builder.query<PrizesResponse, PrizeFilters>({
      query: (params) => ({
        url: params.campaignId 
          ? `/campaigns/${params.campaignId}/in_instantwin_prizes`
          : '/in_instantwin_prizes',
        params: omit(params, ['campaignId'])
      }),
      providesTags: ['Prize']
    }),
    getPrize: builder.query<Prize, number>({
      query: (id) => `/in_instantwin_prizes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Prize', id }]
    }),
    createPrize: builder.mutation<Prize, CreatePrizeRequest>({
      query: ({ campaignId, ...body }) => ({
        url: `/campaigns/${campaignId}/in_instantwin_prizes`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Prize']
    }),
    updatePrize: builder.mutation<Prize, UpdatePrizeRequest>({
      query: ({ id, ...body }) => ({
        url: `/in_instantwin_prizes/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Prize', id }]
    }),
    deletePrize: builder.mutation<void, number>({
      query: (id) => ({
        url: `/in_instantwin_prizes/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Prize']
    }),
    getLotteryHistory: builder.query<LotteryHistory, LotteryHistoryQuery>({
      query: ({ prizeId, period }) => ({
        url: `/in_instantwin_prizes/${prizeId}/lottery-history`,
        params: { period }
      }),
      providesTags: (result, error, { prizeId }) => [
        { type: 'LotteryHistory', id: prizeId }
      ]
    })
  })
});
```

### 型定義
```tsx
// types/prize.ts
export interface Prize {
  id: number;
  campaignId: number;
  campaignTitle: string;
  name: string;
  description?: string;
  sendWinnerCount: number;
  winnerCount: number;
  winningRateChangeType: number;
  winningRate: number;
  dailyWinnerCount?: number;
  isDailyLottery: boolean;
  lotteryCountPerMinute?: number;
  lotteryCountPerMinuteUpdatedDatetime?: Date;
  created: Date;
  modified: Date;
}

export interface LotteryRecord {
  id: number;
  userName: string;
  isWin: boolean;
  lotteryRate: number;
  created: Date;
}

export interface LotteryHistory {
  totalAttempts: number;
  totalWins: number;
  winRate: number;
  records: LotteryRecord[];
}
```

### カスタムフック
```tsx
// hooks/useLotteryCalculation.ts
export const useLotteryCalculation = (prize: Prize) => {
  const calculateExpectedWins = (attempts: number) => {
    return Math.round((prize.winningRate / 100) * attempts);
  };

  const calculateOptimalRate = (targetWins: number, attempts: number) => {
    return (targetWins / attempts) * 100;
  };

  const getDailyLimit = () => {
    if (!prize.isDailyLottery) return null;
    
    const today = new Date();
    const todayWins = 0; // APIから取得
    const remaining = prize.dailyWinnerCount - todayWins;
    
    return {
      limit: prize.dailyWinnerCount,
      used: todayWins,
      remaining: Math.max(0, remaining)
    };
  };

  return {
    calculateExpectedWins,
    calculateOptimalRate,
    getDailyLimit
  };
};
```
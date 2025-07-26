# 共通コンポーネント仕様書

## 概要
Instagramインスタントウィンキャンペーンツールで使用される共通コンポーネントの詳細仕様。
UI基盤コンポーネント、ビジネスロジックコンポーネント、フォームコンポーネント、レイアウトコンポーネントを定義します。

---

## コンポーネント分類

### UI基盤コンポーネント (src/components/ui/)

#### 1. Button コンポーネント

##### 1.1 基本仕様
```tsx
// components/ui/Button/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  disabled,
  className,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Spinner className={cn('animate-spin', size === 'xs' ? 'w-3 h-3' : 'w-4 h-4', 'mr-2')} />
      )}
      {!loading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
};
```

##### 1.2 使用例
```tsx
// 基本的な使用例
<Button variant="primary" size="md">
  保存
</Button>

// ローディング状態
<Button loading={isSubmitting}>
  処理中...
</Button>

// アイコン付き
<Button leftIcon={<PlusIcon className="w-4 h-4" />}>
  新規作成
</Button>

// 破壊的アクション
<Button variant="destructive" onClick={handleDelete}>
  削除
</Button>
```

#### 2. Input コンポーネント

##### 2.1 基本仕様
```tsx
// components/ui/Input/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn(fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{leftIcon}</span>
          </div>
        )}
        
        <input
          id={inputId}
          className={cn(
            'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className="text-gray-400">{rightIcon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};
```

##### 2.2 特殊入力コンポーネント
```tsx
// NumberInput
const NumberInput: React.FC<NumberInputProps> = ({
  min,
  max,
  step = 1,
  suffix,
  prefix,
  onValueChange,
  ...props
}) => {
  return (
    <div className="relative">
      {prefix && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 text-sm">{prefix}</span>
        </div>
      )}
      
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        className={cn(
          prefix && 'pl-8',
          suffix && 'pr-12'
        )}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          onValueChange?.(isNaN(value) ? 0 : value);
        }}
        {...props}
      />
      
      {suffix && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 text-sm">{suffix}</span>
        </div>
      )}
    </div>
  );
};

// SearchInput
const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  onClear,
  debounceMs = 300,
  ...props
}) => {
  const [value, setValue] = useState('');
  
  const debouncedSearch = useMemo(
    () => debounce((term: string) => onSearch?.(term), debounceMs),
    [onSearch, debounceMs]
  );

  useEffect(() => {
    debouncedSearch(value);
  }, [value, debouncedSearch]);

  return (
    <Input
      leftIcon={<SearchIcon className="w-4 h-4" />}
      rightIcon={value && (
        <button
          type="button"
          onClick={() => {
            setValue('');
            onClear?.();
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
};
```

#### 3. Select コンポーネント

```tsx
// components/ui/Select/Select.tsx
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  placeholder?: string;
  options?: Array<{ value: string | number; label: string; disabled?: boolean }>;
  fullWidth?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helpText,
  placeholder,
  options,
  fullWidth = false,
  children,
  className,
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn(fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
            error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options ? (
            options.map(option => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))
          ) : (
            children
          )}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};
```

#### 4. Modal コンポーネント

```tsx
// components/ui/Modal/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  };

  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* オーバーレイ */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />

        {/* センタリング用の隠し要素 */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        {/* モーダルコンテンツ */}
        <div
          className={cn(
            'inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full',
            sizeClasses[size]
          )}
        >
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 transition-colors"
                onClick={onClose}
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
          )}
          
          <div className={title ? 'p-6' : 'p-6'}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
```

#### 5. Table コンポーネント

```tsx
// components/ui/Table/Table.tsx
interface Column<T> {
  key: keyof T;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  sortConfig?: { key: keyof T; direction: 'asc' | 'desc' };
  onSort?: (key: keyof T) => void;
  onRowClick?: (record: T, index: number) => void;
  rowKey: keyof T;
  emptyText?: string;
}

const Table = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  sortConfig,
  onSort,
  onRowClick,
  rowKey,
  emptyText = 'データがありません'
}: TableProps<T>) => {
  const handleSort = (key: keyof T) => {
    if (onSort) {
      onSort(key);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-10 rounded mb-2" />
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="bg-gray-100 h-16 rounded mb-2" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <TableIcon className="w-12 h-12 mx-auto mb-4" />
        <p>{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th
                key={String(column.key)}
                className={cn(
                  'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider',
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right',
                  column.sortable && 'cursor-pointer hover:bg-gray-100'
                )}
                style={{ width: column.width }}
                onClick={column.sortable ? () => handleSort(column.key) : undefined}
              >
                <div className="flex items-center gap-1">
                  {column.title}
                  {column.sortable && sortConfig?.key === column.key && (
                    <span className="text-blue-500">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((record, index) => (
            <tr
              key={String(record[rowKey])}
              className={cn(
                'hover:bg-gray-50',
                onRowClick && 'cursor-pointer'
              )}
              onClick={onRowClick ? () => onRowClick(record, index) : undefined}
            >
              {columns.map(column => (
                <td
                  key={String(column.key)}
                  className={cn(
                    'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                >
                  {column.render
                    ? column.render(record[column.key], record, index)
                    : String(record[column.key] || '')
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

### ビジネスロジックコンポーネント (src/components/business/)

#### 1. StatusBadge コンポーネント

```tsx
// components/business/StatusBadge/StatusBadge.tsx
interface StatusBadgeProps {
  status: 'draft' | 'active' | 'paused' | 'completed' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true
}) => {
  const getStatusConfig = (status: string) => {
    const configs = {
      draft: {
        label: '下書き',
        color: 'bg-gray-100 text-gray-800',
        icon: <DocumentIcon className="w-3 h-3" />
      },
      active: {
        label: '公開中',
        color: 'bg-green-100 text-green-800',
        icon: <PlayIcon className="w-3 h-3" />
      },
      paused: {
        label: '一時停止',
        color: 'bg-yellow-100 text-yellow-800',
        icon: <PauseIcon className="w-3 h-3" />
      },
      completed: {
        label: '完了',
        color: 'bg-blue-100 text-blue-800',
        icon: <CheckIcon className="w-3 h-3" />
      },
      error: {
        label: 'エラー',
        color: 'bg-red-100 text-red-800',
        icon: <ExclamationIcon className="w-3 h-3" />
      }
    };
    return configs[status] || configs.draft;
  };

  const config = getStatusConfig(status);
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-xs',
    lg: 'px-3 py-2 text-sm'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        config.color,
        sizeClasses[size]
      )}
    >
      {showIcon && config.icon}
      {config.label}
    </span>
  );
};
```

#### 2. WinningRateDisplay コンポーネント

```tsx
// components/business/WinningRateDisplay/WinningRateDisplay.tsx
interface WinningRateDisplayProps {
  rate: number;
  totalAttempts?: number;
  expectedWins?: number;
  showProgress?: boolean;
  actualWins?: number;
}

const WinningRateDisplay: React.FC<WinningRateDisplayProps> = ({
  rate,
  totalAttempts,
  expectedWins,
  showProgress = false,
  actualWins
}) => {
  const getColorByRate = (rate: number) => {
    if (rate >= 50) return 'text-red-600 bg-red-50';
    if (rate >= 20) return 'text-orange-600 bg-orange-50';
    if (rate >= 10) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const progressPercentage = actualWins && expectedWins 
    ? Math.min((actualWins / expectedWins) * 100, 100) 
    : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">当選確率</span>
        <span className={cn(
          'px-2 py-1 rounded-full text-sm font-bold',
          getColorByRate(rate)
        )}>
          {rate.toFixed(1)}%
        </span>
      </div>
      
      {totalAttempts && expectedWins && (
        <div className="text-xs text-gray-600">
          予想当選数: {expectedWins}名 / {totalAttempts}回
        </div>
      )}
      
      {showProgress && actualWins !== undefined && expectedWins && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>実際の進捗</span>
            <span>{actualWins} / {expectedWins}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={cn(
                'h-2 rounded-full transition-all duration-500',
                progressPercentage >= 100 ? 'bg-green-500' : 'bg-blue-500'
              )}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
```

#### 3. CampaignCard コンポーネント

```tsx
// components/business/CampaignCard/CampaignCard.tsx
interface CampaignCardProps {
  campaign: Campaign;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onDuplicate?: (id: number) => void;
  showActions?: boolean;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onEdit,
  onDelete,
  onDuplicate,
  showActions = true
}) => {
  const isActive = campaign.status === 'active';
  const isExpired = campaign.endDate && new Date(campaign.endDate) < new Date();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {campaign.title}
            </h3>
            <StatusBadge status={campaign.status} />
          </div>
          
          {showActions && (
            <DropdownMenu>
              <DropdownItem onClick={() => onEdit?.(campaign.id)}>
                <EditIcon className="w-4 h-4 mr-2" />
                編集
              </DropdownItem>
              <DropdownItem onClick={() => onDuplicate?.(campaign.id)}>
                <CopyIcon className="w-4 h-4 mr-2" />
                複製
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem
                onClick={() => onDelete?.(campaign.id)}
                destructive
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                削除
              </DropdownItem>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {campaign.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {campaign.description}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">開始日:</span>
            <p className="font-medium">
              {campaign.startDate 
                ? format(new Date(campaign.startDate), 'yyyy/MM/dd')
                : '未設定'
              }
            </p>
          </div>
          <div>
            <span className="text-gray-500">終了日:</span>
            <p className={cn(
              'font-medium',
              isExpired && 'text-red-600'
            )}>
              {campaign.endDate 
                ? format(new Date(campaign.endDate), 'yyyy/MM/dd')
                : '未設定'
              }
            </p>
          </div>
        </div>
        
        {isActive && campaign.endDate && (
          <div className="mt-3 p-2 bg-blue-50 rounded-md">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <ClockIcon className="w-4 h-4" />
              <span>
                {formatDistanceToNow(new Date(campaign.endDate))}後終了
              </span>
            </div>
          </div>
        )}
        
        {isExpired && (
          <div className="mt-3 p-2 bg-red-50 rounded-md">
            <div className="flex items-center gap-2 text-sm text-red-700">
              <ExclamationTriangleIcon className="w-4 h-4" />
              <span>キャンペーンが終了しています</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

---

### フォームコンポーネント (src/components/forms/)

#### 1. FormField コンポーネント

```tsx
// components/forms/FormField/FormField.tsx
interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  helpText,
  children,
  className
}) => {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {children}
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};
```

#### 2. DateRangePicker コンポーネント

```tsx
// components/forms/DateRangePicker/DateRangePicker.tsx
interface DateRangePickerProps {
  value: { startDate: Date | null; endDate: Date | null };
  onChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
  label?: string;
  error?: string;
  presets?: Array<{
    label: string;
    value: { startDate: Date; endDate: Date };
  }>;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  label,
  error,
  presets = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);

  const formatDateRange = () => {
    if (!value.startDate && !value.endDate) return '期間を選択';
    if (!value.endDate) return `${format(value.startDate!, 'yyyy/MM/dd')} -`;
    if (!value.startDate) return `- ${format(value.endDate, 'yyyy/MM/dd')}`;
    return `${format(value.startDate, 'yyyy/MM/dd')} - ${format(value.endDate, 'yyyy/MM/dd')}`;
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        className={cn(
          'w-full px-3 py-2 text-left border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500',
          error && 'border-red-300 focus:ring-red-500 focus:border-red-500'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span className={cn(
            'text-sm',
            (!value.startDate && !value.endDate) ? 'text-gray-500' : 'text-gray-900'
          )}>
            {formatDateRange()}
          </span>
          <CalendarIcon className="w-4 h-4 text-gray-400" />
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-4">
            {presets.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  よく使う期間
                </h4>
                <div className="space-y-1">
                  {presets.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full text-left px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      onClick={() => {
                        onChange(preset.value);
                        setIsOpen(false);
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <DateRangeCalendar
              startDate={value.startDate}
              endDate={value.endDate}
              focusedInput={focusedInput}
              onDatesChange={onChange}
              onFocusChange={setFocusedInput}
            />
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
```

---

### レイアウトコンポーネント (src/components/layout/)

#### 1. PageLayout コンポーネント

```tsx
// components/layout/PageLayout/PageLayout.tsx
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  fullScreen?: boolean;
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  fullScreen = false,
  children,
  className
}) => {
  return (
    <div className={cn(
      'min-h-screen bg-gray-50',
      fullScreen ? 'h-screen overflow-hidden' : '',
      className
    )}>
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className={cn(
          'px-4 sm:px-6 lg:px-8 py-4',
          !fullScreen && 'max-w-7xl mx-auto'
        )}>
          {breadcrumbs && (
            <nav className="mb-4">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                {breadcrumbs.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />
                    )}
                    {item.href ? (
                      <Link
                        to={item.href}
                        className="hover:text-gray-700 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-gray-900 font-medium">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
            
            {actions && (
              <div className="flex items-center gap-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <main className={cn(
        fullScreen 
          ? 'flex-1 overflow-hidden' 
          : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'
      )}>
        {children}
      </main>
    </div>
  );
};
```

#### 2. Card コンポーネント

```tsx
// components/layout/Card/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  hover = false
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        hover && 'hover:shadow-md transition-shadow',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('pb-4 border-b border-gray-100 mb-4', className)}>
    {children}
  </div>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={className}>
    {children}
  </div>
);

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('pt-4 border-t border-gray-100 mt-4', className)}>
    {children}
  </div>
);
```

---

## 使用ガイドライン

### 1. コンポーネント設計原則

- **単一責任の原則**: 各コンポーネントは1つの責任のみを持つ
- **再利用性**: 異なるコンテキストで使用できるよう汎用的に設計
- **拡張性**: Props で動作をカスタマイズ可能
- **アクセシビリティ**: ARIA属性とキーボード操作に対応

### 2. 命名規則

- **コンポーネント名**: PascalCase (例: `Button`, `FormField`)
- **Props名**: camelCase (例: `onClick`, `isLoading`)
- **CSS クラス名**: Tailwind CSS の規則に従う

### 3. TypeScript活用

- すべてのコンポーネントで型定義を必須とする
- Props は interface または type で定義
- ジェネリクス を活用して型安全性を向上

### 4. テスト戦略

- 各コンポーネントに対応するテストファイルを作成
- ユーザーインタラクションをテスト
- アクセシビリティテストを含める

### 5. ドキュメント

- Storybook を使用してコンポーネントカタログを作成
- 使用例とベストプラクティスを文書化
- Props の詳細説明を含める
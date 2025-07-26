export const validCampaignData = {
  title: 'テストキャンペーン',
  description: 'テスト用のキャンペーンです',
  status: 'draft',
  start_date: new Date('2024-01-01'),
  end_date: new Date('2024-12-31')
};

export const updateCampaignData = {
  title: '更新されたキャンペーン',
  description: '更新されたテスト用のキャンペーンです',
  status: 'active'
};

export const invalidCampaignData = {
  // title is missing (required field)
  description: 'タイトルが不足しているキャンペーン',
  status: 'invalid_status'
};
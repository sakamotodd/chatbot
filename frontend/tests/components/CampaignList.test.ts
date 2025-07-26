import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CampaignList from '@/pages/campaigns/CampaignList.vue';

describe('CampaignList.vue', () => {
  it('renders campaign list title', () => {
    const wrapper = mount(CampaignList);
    expect(wrapper.find('h1').text()).toBe('キャンペーン一覧');
  });

  it('renders campaign data correctly', () => {
    const wrapper = mount(CampaignList);
    
    // Check if table is rendered
    const table = wrapper.find('table');
    expect(table.exists()).toBe(true);

    // Check table headers
    const headers = wrapper.findAll('th');
    expect(headers[0].text()).toBe('キャンペーン名');
    expect(headers[1].text()).toBe('ステータス');
    expect(headers[2].text()).toBe('参加者数');
    expect(headers[3].text()).toBe('作成日');
  });

  it('displays mock campaign data', () => {
    const wrapper = mount(CampaignList);
    
    // Check if campaign rows are rendered
    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(3);

    // Check first campaign data
    const firstRow = rows[0];
    expect(firstRow.text()).toContain('春のプレゼントキャンペーン');
    expect(firstRow.text()).toContain('アクティブ');
    expect(firstRow.text()).toContain('1234');
  });

  it('applies correct status classes', () => {
    const wrapper = mount(CampaignList);
    
    const statusSpans = wrapper.findAll('.inline-flex.rounded-full');
    
    // Active status should have green background
    expect(statusSpans[0].classes()).toContain('bg-green-100');
    expect(statusSpans[0].classes()).toContain('text-green-800');
    
    // Draft status should have yellow background  
    expect(statusSpans[1].classes()).toContain('bg-yellow-100');
    expect(statusSpans[1].classes()).toContain('text-yellow-800');
    
    // Ended status should have gray background
    expect(statusSpans[2].classes()).toContain('bg-gray-100');
    expect(statusSpans[2].classes()).toContain('text-gray-800');
  });

  it('renders create campaign button', () => {
    const wrapper = mount(CampaignList);
    
    const createButton = wrapper.find('a[href="/campaigns/create"]');
    expect(createButton.exists()).toBe(true);
    expect(createButton.text()).toBe('新しいキャンペーンを作成');
  });

  it('renders action links for each campaign', () => {
    const wrapper = mount(CampaignList);
    
    const detailLinks = wrapper.findAll('a[href^="/campaigns/"][href$="/campaigns/1"]');
    const editLinks = wrapper.findAll('a[href^="/campaigns/"][href$="/edit"]');
    
    expect(detailLinks).toHaveLength(1);
    expect(editLinks).toHaveLength(3);
  });

  it('formats dates correctly', () => {
    const wrapper = mount(CampaignList);
    
    const dateElements = wrapper.findAll('tbody tr td:nth-child(4)');
    
    // Check if dates are formatted in Japanese locale
    expect(dateElements[0].text()).toMatch(/\d{4}\/\d{1,2}\/\d{1,2}/);
  });

  describe('Status utility functions', () => {
    it('returns correct status classes', async () => {
      const wrapper = mount(CampaignList);
      const vm = wrapper.vm as any;

      expect(vm.getStatusClass('active')).toBe('bg-green-100 text-green-800');
      expect(vm.getStatusClass('draft')).toBe('bg-yellow-100 text-yellow-800');
      expect(vm.getStatusClass('ended')).toBe('bg-gray-100 text-gray-800');
      expect(vm.getStatusClass('unknown')).toBe('bg-gray-100 text-gray-800');
    });

    it('returns correct status text', async () => {
      const wrapper = mount(CampaignList);
      const vm = wrapper.vm as any;

      expect(vm.getStatusText('active')).toBe('アクティブ');
      expect(vm.getStatusText('draft')).toBe('下書き');
      expect(vm.getStatusText('ended')).toBe('終了');
      expect(vm.getStatusText('unknown')).toBe('不明');
    });

    it('formats date correctly', async () => {
      const wrapper = mount(CampaignList);
      const vm = wrapper.vm as any;

      const testDate = '2024-01-15';
      const formatted = vm.formatDate(testDate);
      
      expect(formatted).toMatch(/\d{4}\/\d{1,2}\/\d{1,2}/);
    });
  });
});
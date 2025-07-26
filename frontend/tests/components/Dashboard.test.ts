import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Dashboard from '@/pages/Dashboard.vue';

describe('Dashboard.vue', () => {
  it('renders dashboard title', () => {
    const wrapper = mount(Dashboard);
    expect(wrapper.find('h3').text()).toBe('ダッシュボード');
  });

  it('renders welcome message', () => {
    const wrapper = mount(Dashboard);
    expect(wrapper.text()).toContain('Instagram インスタントウィンキャンペーンツールへようこそ');
  });

  describe('Stats Cards', () => {
    it('renders all three stat cards', () => {
      const wrapper = mount(Dashboard);
      const statCards = wrapper.findAll('.bg-white.overflow-hidden.shadow.rounded-lg');
      expect(statCards).toHaveLength(5); // 3 stats + 1 main card + 1 quick actions
    });

    it('displays active campaigns stat', () => {
      const wrapper = mount(Dashboard);
      expect(wrapper.text()).toContain('アクティブキャンペーン');
      expect(wrapper.text()).toContain('12');
    });

    it('displays total participants stat', () => {
      const wrapper = mount(Dashboard);
      expect(wrapper.text()).toContain('総参加者数');
      expect(wrapper.text()).toContain('1,234');
    });

    it('displays prizes awarded stat', () => {
      const wrapper = mount(Dashboard);
      expect(wrapper.text()).toContain('賞品提供数');
      expect(wrapper.text()).toContain('89');
    });

    it('has correct stat card icons', () => {
      const wrapper = mount(Dashboard);
      const iconContainers = wrapper.findAll('.w-8.h-8.rounded-md.flex.items-center.justify-center');
      
      expect(iconContainers[0].classes()).toContain('bg-indigo-500');
      expect(iconContainers[0].text()).toBe('C');
      
      expect(iconContainers[1].classes()).toContain('bg-green-500');
      expect(iconContainers[1].text()).toBe('P');
      
      expect(iconContainers[2].classes()).toContain('bg-yellow-500');
      expect(iconContainers[2].text()).toBe('🏆');
    });
  });

  describe('Quick Actions', () => {
    it('renders quick actions section', () => {
      const wrapper = mount(Dashboard);
      expect(wrapper.text()).toContain('クイックアクション');
    });

    it('renders create campaign quick action', () => {
      const wrapper = mount(Dashboard);
      const createAction = wrapper.find('a[href="/campaigns/create"]');
      
      expect(createAction.exists()).toBe(true);
      expect(createAction.text()).toContain('新しいキャンペーンを作成');
      expect(createAction.text()).toContain('新しいインスタントウィンキャンペーンを作成します');
    });

    it('renders manage campaigns quick action', () => {
      const wrapper = mount(Dashboard);
      const manageAction = wrapper.find('a[href="/campaigns"]');
      
      expect(manageAction.exists()).toBe(true);
      expect(manageAction.text()).toContain('キャンペーン管理');
      expect(manageAction.text()).toContain('既存のキャンペーンを管理・編集します');
    });

    it('has correct quick action styling', () => {
      const wrapper = mount(Dashboard);
      const quickActions = wrapper.findAll('.relative.group.bg-white.p-6');
      
      expect(quickActions).toHaveLength(2);
      
      // Check hover and focus classes
      quickActions.forEach(action => {
        expect(action.classes()).toContain('focus-within:ring-2');
        expect(action.classes()).toContain('hover:shadow-md');
        expect(action.classes()).toContain('transition-shadow');
      });
    });

    it('has correct icon styling for quick actions', () => {
      const wrapper = mount(Dashboard);
      const iconSpans = wrapper.findAll('.rounded-lg.inline-flex.p-3');
      
      expect(iconSpans[0].classes()).toContain('bg-indigo-50');
      expect(iconSpans[0].classes()).toContain('text-indigo-600');
      expect(iconSpans[0].text()).toBe('➕');
      
      expect(iconSpans[1].classes()).toContain('bg-green-50');
      expect(iconSpans[1].classes()).toContain('text-green-600');
      expect(iconSpans[1].text()).toBe('📊');
    });
  });

  describe('Layout and Styling', () => {
    it('has proper grid layout for stats', () => {
      const wrapper = mount(Dashboard);
      const statsGrid = wrapper.find('.grid.grid-cols-1.gap-5.sm\\:grid-cols-2.lg\\:grid-cols-3');
      expect(statsGrid.exists()).toBe(true);
    });

    it('has proper grid layout for quick actions', () => {
      const wrapper = mount(Dashboard);
      const actionsGrid = wrapper.find('.grid.grid-cols-1.gap-4.sm\\:grid-cols-2');
      expect(actionsGrid.exists()).toBe(true);
    });

    it('applies shadow and background styling correctly', () => {
      const wrapper = mount(Dashboard);
      const mainCard = wrapper.find('.bg-white.shadow');
      expect(mainCard.exists()).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      const wrapper = mount(Dashboard);
      const h3Elements = wrapper.findAll('h3');
      
      expect(h3Elements).toHaveLength(3); // Main title + 2 quick action titles
      expect(h3Elements[0].text()).toBe('ダッシュボード');
    });

    it('has proper aria attributes', () => {
      const wrapper = mount(Dashboard);
      const hiddenSpans = wrapper.findAll('span[aria-hidden="true"]');
      expect(hiddenSpans).toHaveLength(2); // One for each quick action
    });

    it('has descriptive text for screen readers', () => {
      const wrapper = mount(Dashboard);
      
      // Check that descriptive text exists for each quick action
      expect(wrapper.text()).toContain('新しいインスタントウィンキャンペーンを作成します');
      expect(wrapper.text()).toContain('既存のキャンペーンを管理・編集します');
    });
  });
});
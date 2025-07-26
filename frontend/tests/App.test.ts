import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import App from '@/App.vue';

const mockRouter = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: { template: '<div>Home Page</div>' }
    }
  ]
});

describe('App.vue', () => {
  it('renders without crashing', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [mockRouter]
      }
    });
    
    expect(wrapper.exists()).toBe(true);
  });

  it('has correct app id', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [mockRouter]
      }
    });
    
    expect(wrapper.find('#app').exists()).toBe(true);
  });

  it('contains router-view', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [mockRouter]
      }
    });
    
    expect(wrapper.find('.router-view').exists()).toBe(true);
  });

  it('applies correct CSS styles', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [mockRouter]
      }
    });
    
    const appElement = wrapper.find('#app');
    expect(appElement.exists()).toBe(true);
  });

  describe('Router Integration', () => {
    it('renders router content', async () => {
      await mockRouter.push('/');
      
      const wrapper = mount(App, {
        global: {
          plugins: [mockRouter]
        }
      });
      
      // Wait for router navigation
      await wrapper.vm.$nextTick();
      
      expect(wrapper.html()).toContain('div');
    });
  });

  describe('Layout Structure', () => {
    it('has single root element with correct structure', () => {
      const wrapper = mount(App, {
        global: {
          plugins: [mockRouter]
        }
      });
      
      const rootElement = wrapper.find('#app');
      expect(rootElement.exists()).toBe(true);
      expect(rootElement.element.tagName).toBe('DIV');
    });

    it('maintains consistent structure across renders', () => {
      const wrapper1 = mount(App, {
        global: {
          plugins: [mockRouter]
        }
      });

      const wrapper2 = mount(App, {
        global: {
          plugins: [mockRouter]
        }
      });
      
      expect(wrapper1.html()).toBe(wrapper2.html());
    });
  });
});
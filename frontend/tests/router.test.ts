import { describe, it, expect, beforeEach } from 'vitest';
import { createMemoryHistory } from 'vue-router';
import router from '@/router';

describe('Router Configuration', () => {
  beforeEach(() => {
    // Reset router history before each test
    router.push('/');
  });

  describe('Route Definitions', () => {
    it('should have correct route paths defined', () => {
      const routes = router.getRoutes();
      const routePaths = routes.map(route => route.path);

      expect(routePaths).toContain('/');
      expect(routePaths).toContain('/campaigns');
      expect(routePaths).toContain('/campaigns/create');
      expect(routePaths).toContain('/campaigns/:id');
      expect(routePaths).toContain('/campaigns/:id/edit');
      expect(routePaths).toContain('/:pathMatch(.*)*');
    });

    it('should have correct route names', () => {
      const routes = router.getRoutes();
      const routeNames = routes.map(route => route.name).filter(Boolean);

      expect(routeNames).toContain('Dashboard');
      expect(routeNames).toContain('CampaignList');
      expect(routeNames).toContain('CampaignCreate');
      expect(routeNames).toContain('CampaignDetail');
      expect(routeNames).toContain('CampaignEdit');
      expect(routeNames).toContain('NotFound');
    });
  });

  describe('Route Meta Information', () => {
    it('should have correct meta titles', () => {
      const routes = router.getRoutes();
      
      const dashboardRoute = routes.find(r => r.name === 'Dashboard');
      expect(dashboardRoute?.meta?.title).toBe('ダッシュボード');

      const campaignListRoute = routes.find(r => r.name === 'CampaignList');
      expect(campaignListRoute?.meta?.title).toBe('キャンペーン一覧');

      const campaignCreateRoute = routes.find(r => r.name === 'CampaignCreate');
      expect(campaignCreateRoute?.meta?.title).toBe('キャンペーン作成');

      const campaignDetailRoute = routes.find(r => r.name === 'CampaignDetail');
      expect(campaignDetailRoute?.meta?.title).toBe('キャンペーン詳細');

      const campaignEditRoute = routes.find(r => r.name === 'CampaignEdit');
      expect(campaignEditRoute?.meta?.title).toBe('キャンペーン編集');
    });

    it('should have correct breadcrumbs', () => {
      const routes = router.getRoutes();
      
      const campaignCreateRoute = routes.find(r => r.name === 'CampaignCreate');
      const breadcrumb = campaignCreateRoute?.meta?.breadcrumb as any[];
      
      expect(breadcrumb).toHaveLength(3);
      expect(breadcrumb[0]).toEqual({ name: 'ダッシュボード', path: '/' });
      expect(breadcrumb[1]).toEqual({ name: 'キャンペーン一覧', path: '/campaigns' });
      expect(breadcrumb[2]).toEqual({ name: 'キャンペーン作成', path: '/campaigns/create' });
    });
  });

  describe('Route Navigation', () => {
    it('should navigate to dashboard route', async () => {
      await router.push('/');
      expect(router.currentRoute.value.name).toBe('Dashboard');
      expect(router.currentRoute.value.path).toBe('/');
    });

    it('should navigate to campaign list route', async () => {
      await router.push('/campaigns');
      expect(router.currentRoute.value.name).toBe('CampaignList');
      expect(router.currentRoute.value.path).toBe('/campaigns');
    });

    it('should navigate to campaign create route', async () => {
      await router.push('/campaigns/create');
      expect(router.currentRoute.value.name).toBe('CampaignCreate');
      expect(router.currentRoute.value.path).toBe('/campaigns/create');
    });

    it('should navigate to campaign detail route with params', async () => {
      await router.push('/campaigns/123');
      expect(router.currentRoute.value.name).toBe('CampaignDetail');
      expect(router.currentRoute.value.path).toBe('/campaigns/123');
      expect(router.currentRoute.value.params.id).toBe('123');
    });

    it('should navigate to campaign edit route with params', async () => {
      await router.push('/campaigns/456/edit');
      expect(router.currentRoute.value.name).toBe('CampaignEdit');
      expect(router.currentRoute.value.path).toBe('/campaigns/456/edit');
      expect(router.currentRoute.value.params.id).toBe('456');
    });

    it('should navigate to 404 route for unknown paths', async () => {
      await router.push('/unknown-path');
      expect(router.currentRoute.value.name).toBe('NotFound');
    });
  });

  describe('Navigation Guards', () => {
    it('should set document title on route navigation', async () => {
      const originalTitle = document.title;
      
      await router.push('/');
      expect(document.title).toBe('ダッシュボード | Instagram CRM');

      await router.push('/campaigns');
      expect(document.title).toBe('キャンペーン一覧 | Instagram CRM');

      await router.push('/campaigns/create');
      expect(document.title).toBe('キャンペーン作成 | Instagram CRM');

      // Restore original title
      document.title = originalTitle;
    });

    it('should set default title for routes without meta title', async () => {
      const originalTitle = document.title;
      
      // Create a route without meta title
      const routeWithoutTitle = { path: '/test', name: 'Test' };
      router.addRoute(routeWithoutTitle);
      
      await router.push('/test');
      expect(document.title).toBe('Instagram CRM');

      // Restore original title
      document.title = originalTitle;
    });
  });

  describe('Route Matching', () => {
    it('should match exact paths correctly', () => {
      const dashboardMatch = router.resolve('/');
      expect(dashboardMatch.name).toBe('Dashboard');

      const campaignsMatch = router.resolve('/campaigns');
      expect(campaignsMatch.name).toBe('CampaignList');
    });

    it('should match parameterized routes correctly', () => {
      const detailMatch = router.resolve('/campaigns/123');
      expect(detailMatch.name).toBe('CampaignDetail');
      expect(detailMatch.params.id).toBe('123');

      const editMatch = router.resolve('/campaigns/456/edit');
      expect(editMatch.name).toBe('CampaignEdit');
      expect(editMatch.params.id).toBe('456');
    });

    it('should match catch-all route for unmatched paths', () => {
      const unmatchedRoute = router.resolve('/completely/unknown/path');
      expect(unmatchedRoute.name).toBe('NotFound');
    });
  });

  describe('Route Generation', () => {
    it('should generate correct URLs from route names', () => {
      const dashboardUrl = router.resolve({ name: 'Dashboard' });
      expect(dashboardUrl.path).toBe('/');

      const campaignListUrl = router.resolve({ name: 'CampaignList' });
      expect(campaignListUrl.path).toBe('/campaigns');

      const campaignDetailUrl = router.resolve({ 
        name: 'CampaignDetail', 
        params: { id: '789' } 
      });
      expect(campaignDetailUrl.path).toBe('/campaigns/789');
    });

    it('should handle route generation with parameters', () => {
      const editUrl = router.resolve({ 
        name: 'CampaignEdit', 
        params: { id: 'abc' } 
      });
      expect(editUrl.path).toBe('/campaigns/abc/edit');
    });
  });
});
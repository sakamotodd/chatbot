import { createRouter, createWebHistory } from 'vue-router';

// Import layouts
import MainLayout from '@layouts/MainLayout.vue';

// Import pages
import Dashboard from '@pages/Dashboard.vue';
import CampaignList from '@pages/campaigns/CampaignList.vue';
import CampaignDetail from '@pages/campaigns/CampaignDetail.vue';
import CampaignCreate from '@pages/campaigns/CampaignCreate.vue';
import CampaignEdit from '@pages/campaigns/CampaignEdit.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: 'ダッシュボード',
          breadcrumb: [{ name: 'ダッシュボード', path: '/' }],
        },
      },
      {
        path: '/campaigns',
        name: 'CampaignList',
        component: CampaignList,
        meta: {
          title: 'キャンペーン一覧',
          breadcrumb: [
            { name: 'ダッシュボード', path: '/' },
            { name: 'キャンペーン一覧', path: '/campaigns' },
          ],
        },
      },
      {
        path: '/campaigns/create',
        name: 'CampaignCreate',
        component: CampaignCreate,
        meta: {
          title: 'キャンペーン作成',
          breadcrumb: [
            { name: 'ダッシュボード', path: '/' },
            { name: 'キャンペーン一覧', path: '/campaigns' },
            { name: 'キャンペーン作成', path: '/campaigns/create' },
          ],
        },
      },
      {
        path: '/campaigns/:id',
        name: 'CampaignDetail',
        component: CampaignDetail,
        meta: {
          title: 'キャンペーン詳細',
          breadcrumb: [
            { name: 'ダッシュボード', path: '/' },
            { name: 'キャンペーン一覧', path: '/campaigns' },
            { name: 'キャンペーン詳細', path: '/campaigns/:id' },
          ],
        },
      },
      {
        path: '/campaigns/:id/edit',
        name: 'CampaignEdit',
        component: CampaignEdit,
        meta: {
          title: 'キャンペーン編集',
          breadcrumb: [
            { name: 'ダッシュボード', path: '/' },
            { name: 'キャンペーン一覧', path: '/campaigns' },
            { name: 'キャンペーン詳細', path: '/campaigns/:id' },
            { name: 'キャンペーン編集', path: '/campaigns/:id/edit' },
          ],
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@pages/NotFound.vue'),
    meta: {
      title: 'ページが見つかりません',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard
router.beforeEach((to, _from, next) => {
  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} | Instagram CRM`;
  } else {
    document.title = 'Instagram CRM';
  }

  next();
});

export default router;

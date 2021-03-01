import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/ys-admin',
        component: () => import('layouts/DashboardLayout.vue'),
        children: [
            { 
                path: '',
                name: 'admin',
                component: () => import('pages/Index.vue') 
            },
            {
                path: 'videos',
                name: 'admin-videos',
                component: () => import('pages/AdminVideoList.vue') 
            },
            {
                path: 'videos/:videoId',
                name: 'admin-video',
                component: () => import('pages/AdminVideo.vue') 
            },
        ],
    },
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('pages/Home.vue')
            }
        ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/Error404.vue'),
    },
];

export default routes;

import { IRoute } from 'umi-types'

/* 项目路由配置 (采用配置式路由) */
const routes: IRoute[] = [
  // 登录页面
  {
    path: '/login',
    component: './login',
  },
  // 认证页面
  {
    path: '/',
    Routes: ['./src/routes/LoginRouter'],
    routes: [
      // 默认去登录页面
      { path: '/', redirect: '/login' },
      // OⅠ-产线员工-worker
      {
        path: '/worker',
        component: '../layouts/WorkerLayout',
        Routes: ['./src/routes/WorkerRouter'],
        routes: [
          { path: '/worker', redirect: '/worker/tool' }, // 默认inedx为工夹具查询
          // 查询列表
          { path: '/worker/tool', component: './worker/tool', title: '工夹具查询' },
          // 夹具详情
          { path: '/worker/toolinfo', component: './worker/toolinfo', title: '夹具详情' },
          // 归还夹具
          { path: '/worker/restore', component: './worker/restore', title: '归还夹具' },
          { path: '*', redirect: '/worker/tool' }, // 未匹配到重定向去工夹具查询
        ],
      },
      // OⅡ-仓库管理员-storekeeper
      {
        path: '/storekeeper',
        component: '../layouts/StorekeeperLayout',
        Routes: ['./src/routes/StorekeeperRouter'],
        routes: [
          { path: '/storekeeper', redirect: '/storekeeper/tool' }, // 默认inedx为工夹具管理
          // 工夹具管理
          { path: '/storekeeper/tool', component: './storekeeper/tool', title: '工夹具管理' },
          // 提交采购
          { path: '/storekeeper/purchase', component: './storekeeper/purchase', title: '提交采购' },
          // 提交保修
          { path: '/storekeeper/repair', component: './storekeeper/repair', title: '提交报修' },
          // 提交报废
          { path: '/storekeeper/destory', component: './storekeeper/destory', title: '提交报废' },
          // 生产线管理
          { path: '/storekeeper/productionline', component: './storekeeper/productionline', title: '生产线管理' },
          { path: '*', redirect: '/storekeeper/tool' }, // 未匹配到重定向去工夹具管理
        ],
      },
      // Repairer-检修员-repairer
      {
        path: '/repairer',
        component: '../layouts/RepairerLayout',
        Routes: ['./src/routes/RepairerRouter'],
        routes: [
          { path: '/repairer', redirect: '/repairer/order' }, // 默认inedx为检修单
          // 检修单
          { path: '/repairer/order', component: './repairer/order', title: '检修单' },
          // 检修项管理
          { path: '/repairer/manager', component: './repairer/manager', title: '检修项管理' },
          { path: '*', redirect: '/repairer/order' }, // 未匹配到重定向去检修单
        ],
      },
      // Manager-WorkCell管理-manager
      {
        path: '/manager',
        component: '../layouts/ManagerLayout',
        Routes: ['./src/routes/ManagerRouter'],
        routes: [
          { path: '/manager', redirect: '/manager/order' }, // 默认inedx为处理申请
          // 检修单
          { path: '/manager/order', component: './manager/order', title: '处理申请' },
          // 历史记录
          { path: '/manager/history', component: './manager/history', title: '历史记录' },
          { path: '*', redirect: '/manager/order' }, // 未匹配到重定向去处理申请
        ],
      },
      // Supervisor-监管员-supervisor
      {
        path: '/supervisor',
        component: '../layouts/SupervisorLayout',
        Routes: ['./src/routes/SupervisorRouter'],
        routes: [
          { path: '/supervisor', redirect: '/supervisor/order' }, // 默认inedx为处理申请
          // 处理申请
          { path: '/supervisor/order', component: './supervisor/order', title: '处理申请' },
          // 夹具管理-新增类目
          { path: '/supervisor/manager/create', component: './supervisor/manager/create', title: '夹具管理-新增类目' },
          // 夹具管理-类目列表
          { path: '/supervisor/manager/list', component: './supervisor/manager/list', title: '夹具管理-类目列表' },
          // 历史记录
          { path: '/supervisor/history', component: './supervisor/history', title: '历史记录' },
          { path: '*', redirect: '/supervisor/order' }, // 未匹配到重定向去处理申请
        ],
      },
      // Admin-管理员-admin
      {
        path: '/admin',
        component: '../layouts/AdminLayout',
        Routes: ['./src/routes/AdminRouter'],
        routes: [
          { path: '/admin', redirect: '/admin/department' }, // 默认inedx为工作部门
          // 工作部门
          { path: '/admin/department', component: './admin/department', title: '工作部门' },
          // 权限管理
          { path: '/admin/authority', component: './admin/authority', title: '权限部门' },
          // 人员管理
          { path: '/admin/user', component: './admin/user', title: '人员管理' },
          { path: '*', redirect: '/admin/department' }, // 未匹配到重定向去工作部门
        ],
      },
      // 用户-demo展示页
      {
        path: '/user',
        component: '../layouts/UserLayout',
        Routes: ['./src/routes/UserRouter'],
        routes: [
          { path: '/user', redirect: '/user/page1' }, // 默认inedx为page1
          { path: '/user/page1', component: './user/page1', title: 'page1' },
          { path: '/user/page2', component: './user/page2', title: 'page2' },
          { path: '*', redirect: '/user/page1' }, // 未匹配到重定向去page1
        ],
      },
      // 404
      { component: '404', title: '页面走丢了...' },
    ],
  },
]

export default routes

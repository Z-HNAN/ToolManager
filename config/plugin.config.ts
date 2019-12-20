import { IPlugin } from 'umi-types'

/* umi插件配置 */
const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: false,
      dva: true,
      dynamicImport: false,
      title: 'antd-mobile-ts-seed',
      dll: false,
      routes: {
        exclude: [
          // /models\//,
          // /services\//,
          // /model\.(t|j)sx?$/,
          // /service\.(t|j)sx?$/,
          // /components\//,
        ],
      },
    },
  ],
]

export default plugins

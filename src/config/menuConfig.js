import {
  HomeOutlined /*首页*/,
  AppstoreOutlined /*商品*/,
  BarsOutlined /*品类管理*/,
  ToolOutlined /*商品管理*/,
  UserOutlined /*用户管理*/,
  SafetyCertificateOutlined /*角色管理*/,
  AreaChartOutlined /*图形图表*/,
  BarChartOutlined /*柱形图*/,
  LineChartOutlined /*折线图*/,
  PieChartOutlined /*饼图*/,
} from "@ant-design/icons";

const menuList = [
  {
    title: "首页",
    key: "/home",
    icon: <HomeOutlined />,
  },
  {
    title: "商品",
    key: "/products",
    icon: <AppstoreOutlined />,
    children: [
      {
        title: "品类管理",
        key: "/category",
        icon: <BarsOutlined />,
      },
      {
        title: "商品管理",
        key: "/product",
        icon: <ToolOutlined />,
      },
    ],
  },
  {
    title: "用户管理",
    key: "/user",
    icon: <UserOutlined />,
  },
  {
    title: "角色管理",
    key: "/role",
    icon: <SafetyCertificateOutlined />,
  },
  {
    title: "图形图表",
    key: "/charts",
    icon: <AreaChartOutlined />,
    children: [
      {
        title: "柱形图",
        key: "/charts/bar",
        icon: <BarChartOutlined />,
      },
      {
        title: "折线图",
        key: "/charts/line",
        icon: <LineChartOutlined />,
      },
      {
        title: "饼图",
        key: "/charts/pie",
        icon: <PieChartOutlined />,
      },
    ],
  },
];

export default menuList;

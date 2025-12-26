import type { Locale } from './interface';

const localeValues: Locale = {
  locale: 'zh-CN',
  loading: '加载中...',
  okText: '确定',
  cancelText: '取消',
  tipsTitle: '提示',
  justOkText: '知道了',
  emptyText: '暂无数据',

  // 分页
  prev_page: '上一页',
  next_page: '下一页',
  prev_5: '向前 5 页',
  next_5: '向后 5 页',
  prev_3: '向前 3 页',
  next_3: '向后 3 页',
  page_size: '条/页',
  total: '共',
  jump_to: '跳至',
  page: '页',
  items: '条结果',

  // 上传
  uploading: '文件上传中',
  removeFile: '删除文件',
  uploadError: '上传错误',
  previewFile: '预览文件',
  downloadFile: '下载文件',
  dragDescription: '点击或拖拽文件到此处上传',
  error_size: '文件 {{fileName}} 大小超出限制',
  error_type: '文件 {{fileName}} 格式错误',
  error_parse: '文件 {{fileName}} 解析失败',

  // 日期
  today: '今天',
  now: '此刻',
  backToToday: '返回今天',
  ok: '确定',
  clear: '清除',
  month: '月',
  year: '年',
  timeSelect: '选择时间',
  dateSelect: '选择日期',
  monthSelect: '选择月份',
  yearSelect: '选择年份',
  decadeSelect: '选择年代',
};

export default localeValues;

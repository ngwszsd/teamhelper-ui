export interface Locale {
  /** 语言标识，如 'zh-CN' 或 'en-US' */
  locale: string;
  /** 通用加载文案 */
  loading: string;
  /** 确定按钮文案 */
  okText: string;
  /** 取消按钮文案 */
  cancelText: string;
  /** 提示弹窗默认标题 */
  tipsTitle: string;
  /** 知道了按钮文案 */
  justOkText: string;
  /** 空状态描述 */
  emptyText: string;

  // 分页相关
  prev_page: string;
  next_page: string;
  prev_5: string;
  next_5: string;
  prev_3: string;
  next_3: string;
  page_size: string;
  total: string;
  jump_to: string;
  page: string;
  items: string;

  // 上传相关
  uploading: string;
  removeFile: string;
  uploadError: string;
  previewFile: string;
  downloadFile: string;
  dragDescription: string;
  error_size: string;
  error_type: string;
  error_parse: string;

  // 日历/日期相关
  today: string;
  now: string;
  backToToday: string;
  ok: string;
  clear: string;
  month: string;
  year: string;
  timeSelect: string;
  dateSelect: string;
  monthSelect: string;
  yearSelect: string;
  decadeSelect: string;
}

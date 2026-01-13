import type { Locale } from './interface';

const localeValues: Locale = {
  locale: 'en-US',
  loading: 'Loading...',
  okText: 'OK',
  cancelText: 'Cancel',
  tipsTitle: 'Tips',
  justOkText: 'OK',
  emptyText: 'No data',

  // Pagination
  prev_page: 'Previous Page',
  next_page: 'Next Page',
  prev_5: 'Previous 5 Pages',
  next_5: 'Next 5 Pages',
  prev_3: 'Previous 3 Pages',
  next_3: 'Next 3 Pages',
  page_size: ' / page',
  total: 'Total',
  jump_to: 'Go to',
  page: 'Page',
  items: 'items',

  // Upload
  uploading: 'Uploading...',
  removeFile: 'Remove file',
  uploadError: 'Upload error',
  previewFile: 'Preview file',
  downloadFile: 'Download file',
  dragDescription: 'Click or drag file to this area to upload',
  error_size: 'File {{fileName}} exceeds size limit',
  error_type: 'File {{fileName}} format error',
  error_parse: 'File {{fileName}} parse failed',
  preview: 'Preview',

  // Calendar
  today: 'Today',
  now: 'Now',
  backToToday: 'Back to today',
  ok: 'OK',
  clear: 'Clear',
  month: 'Month',
  year: 'Year',
  timeSelect: 'select time',
  dateSelect: 'select date',
  monthSelect: 'Choose a month',
  yearSelect: 'Choose a year',
  decadeSelect: 'Choose a decade',
  start_date: 'Start date',
  end_date: 'End date',

  // Tree/Select
  expand: 'Expand',
  collapse: 'Collapse',
  select_placeholder: 'Select',
  search_placeholder: 'Search',
  noMatch: 'No matching options',

  // Timeline
  pending: 'Pending...',
};

export default localeValues;

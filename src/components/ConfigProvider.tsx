import * as React from 'react';
import type { Locale } from '../locale/interface';
import zhCN from '../locale/zh_CN';

export interface ConfigProviderProps {
  children: React.ReactNode;
  locale?: Locale;
}

export const ConfigContext = React.createContext<{ locale: Locale }>({
  locale: zhCN,
});

export function ConfigProvider({
  children,
  locale = zhCN,
}: ConfigProviderProps) {
  return (
    <ConfigContext.Provider value={{ locale }}>
      {children}
    </ConfigContext.Provider>
  );
}

/**
 * 获取当前语言包对象
 */
export const useLocale = () => {
  const { locale } = React.useContext(ConfigContext);
  return locale;
};

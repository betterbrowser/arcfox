import { FC, useCallback, useLayoutEffect, useState } from "react";
import cn from "classnames";

type SidebarContentTabProps = {
  tab: browser.tabs.Tab;
};
const SidebarContentTab: FC<SidebarContentTabProps> = ({
  tab: { title, id, active },
}) => {
  const onClick = useCallback(() => {
    if (id) {
      browser.tabs.update(id, { active: true, highlighted: false });
    }
  }, [id]);
  return (
    <li
      onClick={onClick}
      className={cn({
        active: active,
      })}
    >
      {title}
    </li>
  );
};

const useTabs = () => {
  const [tabs, setTabs] = useState([] as browser.tabs.Tab[]);

  useLayoutEffect(() => {
    browser.tabs.query({ currentWindow: true }).then(setTabs);

    type OnUpdatedListener = Parameters<
      typeof browser.tabs.onUpdated.addListener
    >[0];
    const onUpdatedListener: OnUpdatedListener = (tabId, _changeInfo, tab) => {
      const newTabs = [...tabs];

      const tabIndex = newTabs.findIndex((tab) => tab.id === tabId);
      if (tabIndex === -1) return;

      newTabs[tabIndex] = tab;
      setTabs(newTabs);
    };

    type OnRemovedListener = Parameters<
      typeof browser.tabs.onRemoved.addListener
    >[0];
    const onRemovedListener: OnRemovedListener = (tabId) => {
      const newTabs = [...tabs];

      const tabIndex = newTabs.findIndex((tab) => tab.id === tabId);
      if (tabIndex === -1) return;

      delete newTabs[tabIndex];
      setTabs(newTabs);
    };

    browser.tabs.onUpdated.addListener(onUpdatedListener);
    browser.tabs.onRemoved.addListener(onRemovedListener);

    return () => {
      browser.tabs.onUpdated.removeListener(onUpdatedListener);
      browser.tabs.onRemoved.removeListener(onRemovedListener);
    };
  }, [tabs, setTabs]);

  return [tabs] as const;
};

export const SidebarContent: FC = () => {
  const [tabs] = useTabs();

  return (
    <div id="sidebar-content">
      <button id="new-tab-button">+ New Tab</button>
      <ul id="tab-list">
        {tabs.map((tab) => (
          <SidebarContentTab tab={tab} />
        ))}
      </ul>
    </div>
  );
};

import { UseComponentStyleResult } from "antd/es/theme/internal";
import { usePrefixCls } from "../_utils/usePrefixCls";

export type RenderNode = (classes: string[], prefixCls: string) => JSX.Element;

export interface UseElementWithStyleOptions {
  defaultPrefixCls: string;
  customizePrefixCls?: string;
  useStyle: (prefixCls: string) => UseComponentStyleResult;
  renderNode: RenderNode;
}

export const useElementWithStyle = ({
  defaultPrefixCls,
  customizePrefixCls,
  useStyle,
  renderNode,
}: UseElementWithStyleOptions) => {
  const { prefixCls, customCls } = usePrefixCls(
    defaultPrefixCls,
    customizePrefixCls
  );

  const [wrapSSR, hashId] = useStyle(prefixCls);

  return wrapSSR(renderNode([hashId, customCls], prefixCls));
};

export const genUseElementWithStyle = (
  defaultPrefixCls: UseElementWithStyleOptions["defaultPrefixCls"],
  useStyle: UseElementWithStyleOptions["useStyle"]
) => {
  const useElement = (
    customizePrefixCls: UseElementWithStyleOptions["customizePrefixCls"],
    renderNode: UseElementWithStyleOptions["renderNode"]
  ) => {
    return useElementWithStyle({
      defaultPrefixCls,
      customizePrefixCls,
      useStyle,
      renderNode,
    });
  };

  return useElement;
};

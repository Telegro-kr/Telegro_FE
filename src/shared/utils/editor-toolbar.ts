import type { CommandFn, EditorOptions } from '@toast-ui/editor';

type ToolbarButtonItem = {
  className: string;
  command: string;
  name: string;
  text: string;
  tooltip: string;
};

type ToolbarItem = string | ToolbarButtonItem;

type ToolbarGroups = ToolbarItem[][];

type EditorPlugin = NonNullable<EditorOptions['plugins']>[number];

type BlockNode = {
  attrs: {
    htmlAttrs?: Record<string, string> | null;
  };
  isTextblock?: boolean;
  marks?: unknown;
  type: {
    name: string;
  };
};

type EditorPluginInfo = {
  markdownCommands: Record<string, () => boolean>;
  toolbarItems: Array<{
    groupIndex: number;
    item: ToolbarButtonItem;
    itemIndex: number;
  }>;
  wysiwygCommands: Record<string, CommandFn>;
};

const TEXT_ALIGN_PATTERN = /(?:^|;)\s*text-align\s*:\s*[^;]+;?/gi;
const IMAGE_ALIGN_PATTERN =
  /(?:^|;)\s*(?:display\s*:\s*block|margin-left\s*:\s*auto|margin-right\s*:\s*auto|margin\s*:\s*0\s+auto(?:\s+0\s+auto)?|margin\s*:\s*0\s+0\s+0\s+auto|margin\s*:\s*0\s+auto\s+0\s+0)\s*;?/gi;

const ALIGNMENT_TOOLBAR_ITEMS: ToolbarButtonItem[] = [
  {
    name: 'alignLeft',
    tooltip: 'Left align',
    command: 'alignLeft',
    text: 'L',
    className: 'telegro-editor-align-button',
  },
  {
    name: 'alignCenter',
    tooltip: 'Center align',
    command: 'alignCenter',
    text: 'C',
    className: 'telegro-editor-align-button',
  },
  {
    name: 'alignRight',
    tooltip: 'Right align',
    command: 'alignRight',
    text: 'R',
    className: 'telegro-editor-align-button',
  },
];

const BASE_TOOLBAR_ITEMS: ToolbarGroups = [
  ['heading', 'bold', 'italic', 'strike'],
  ['hr', 'quote'],
  ['ul', 'ol', 'task', 'indent', 'outdent'],
  ['table', 'link', 'image'],
];

const isAlignableNode = (node: BlockNode) =>
  (node.isTextblock &&
    (node.type.name === 'paragraph' || node.type.name === 'heading')) ||
  node.type.name === 'image';

const setTextAlignStyle = (style: string | undefined, align: string) => {
  const styleWithoutAlign = (style ?? '').replace(TEXT_ALIGN_PATTERN, '').trim();
  const normalizedStyle = styleWithoutAlign.endsWith(';')
    ? styleWithoutAlign.slice(0, -1)
    : styleWithoutAlign;

  return normalizedStyle
    ? `${normalizedStyle}; text-align: ${align};`
    : `text-align: ${align};`;
};

const setImageAlignStyle = (
  style: string | undefined,
  align: 'left' | 'center' | 'right',
) => {
  const styleWithoutAlign = (style ?? '')
    .replace(TEXT_ALIGN_PATTERN, '')
    .replace(IMAGE_ALIGN_PATTERN, '')
    .trim();
  const normalizedStyle = styleWithoutAlign.endsWith(';')
    ? styleWithoutAlign.slice(0, -1)
    : styleWithoutAlign;

  const imageAlignStyle =
    align === 'center'
      ? 'display: block; margin-left: auto; margin-right: auto;'
      : align === 'right'
        ? 'display: block; margin-left: auto; margin-right: 0;'
        : 'display: block; margin-left: 0; margin-right: auto;';

  return normalizedStyle
    ? `${normalizedStyle}; ${imageAlignStyle}`
    : imageAlignStyle;
};

const createWysiwygAlignCommand =
  (align: 'left' | 'center' | 'right'): CommandFn =>
  (_, state, dispatch, view) => {
    const { $from, $to } = state.selection;
    const range = $from.blockRange($to);
    const transaction = state.tr;
    let hasChanges = false;

    if (!range) {
      return false;
    }

    state.doc.nodesBetween(range.start, range.end, (node, pos) => {
      const blockNode = node as unknown as BlockNode;

      if (!isAlignableNode(blockNode)) {
        return;
      }

      transaction.setNodeMarkup(
        pos,
        null,
        {
          ...blockNode.attrs,
          htmlAttrs: {
            ...(blockNode.attrs.htmlAttrs ?? {}),
            style:
              blockNode.type.name === 'image'
                ? setImageAlignStyle(blockNode.attrs.htmlAttrs?.style, align)
                : setTextAlignStyle(blockNode.attrs.htmlAttrs?.style, align),
          },
        },
        blockNode.marks,
      );
      hasChanges = true;
    });

    if (!hasChanges || typeof dispatch !== 'function') {
      return false;
    }

    dispatch(transaction);
    view.focus();
    return true;
  };

export const createEditorToolbarItems = (): ToolbarGroups =>
  BASE_TOOLBAR_ITEMS.map((group) => [...group]);

export const createEditorAlignmentPlugin = (): EditorPlugin => (): EditorPluginInfo => ({
  markdownCommands: {
    alignLeft: () => false,
    alignCenter: () => false,
    alignRight: () => false,
  },
  wysiwygCommands: {
    alignLeft: createWysiwygAlignCommand('left'),
    alignCenter: createWysiwygAlignCommand('center'),
    alignRight: createWysiwygAlignCommand('right'),
  },
  toolbarItems: ALIGNMENT_TOOLBAR_ITEMS.map((item, index) => ({
    groupIndex: 2,
    item,
    itemIndex: index,
  })),
});

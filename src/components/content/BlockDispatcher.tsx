import React from 'react';
import type { ContentBlock, ContentBlockProps } from './types';
import {
  ParagraphBlock,
  HeadingBlock,
  ListBlock,
  TodoBlock,
  ToggleBlock,
  CalloutBlock,
  QuoteBlock,
  DividerBlock,
  TableBlock,
  CodeBlock,
  ImageBlock,
  VideoBlock,
  BookmarkBlock,
  ChildPageBlock,
  UnknownBlock,
} from './blocks';

export interface BlockDispatcherProps extends ContentBlockProps<ContentBlock> {
  index?: number;
  fallbackComponent?: React.ComponentType<{ block: ContentBlock }>;
}

export const BlockDispatcher: React.FC<BlockDispatcherProps> = (props) => {
  const { block, fallbackComponent: CustomFallback } = props;

  if (!block || !block.type) {
    return null;
  }

  switch (block.type) {
    case 'paragraph':
      return <ParagraphBlock {...(props as ContentBlockProps<any>)} />;
    case 'heading_1':
    case 'heading_2':
    case 'heading_3':
      return <HeadingBlock {...(props as ContentBlockProps<any>)} />;
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return <ListBlock {...(props as ContentBlockProps<any>)} />;
    case 'to_do':
      return <TodoBlock {...(props as ContentBlockProps<any>)} />;
    case 'toggle':
      return <ToggleBlock {...(props as ContentBlockProps<any>)} />;
    case 'callout':
      return <CalloutBlock {...(props as ContentBlockProps<any>)} />;
    case 'quote':
      return <QuoteBlock {...(props as ContentBlockProps<any>)} />;
    case 'divider':
      return <DividerBlock {...(props as ContentBlockProps<any>)} />;
    case 'table':
      return <TableBlock {...(props as ContentBlockProps<any>)} />;
    case 'code':
      return <CodeBlock {...(props as ContentBlockProps<any>)} />;
    case 'image':
      return <ImageBlock {...(props as ContentBlockProps<any>)} />;
    case 'video':
      return <VideoBlock {...(props as ContentBlockProps<any>)} />;
    case 'bookmark':
      return <BookmarkBlock {...(props as ContentBlockProps<any>)} />;
    case 'child_page':
      return <ChildPageBlock {...(props as ContentBlockProps<any>)} />;
    case 'unknown':
    default:
      if (CustomFallback) {
        return <CustomFallback block={block} />;
      }
      return <UnknownBlock {...(props as ContentBlockProps<any>)} />;
  }
};

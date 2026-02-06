"use client";
import { Box } from "@chakra-ui/react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle, FontSize as FontSizeExtension, Color } from "@tiptap/extension-text-style";
import {
  RichTextEditor,
  Control,
} from "@/components/ui/rich-text-editor";
import { PanelContentProps } from "../../types";

export interface MemoContentState extends Record<string, unknown> {
  html: string;
}

export default function MemoPanelContent({
  contentState,
  onContentStateChange,
}: PanelContentProps<MemoContentState>) {
  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, FontSizeExtension, Color],
    content: contentState.html || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onContentStateChange({ html: editor.getHTML() });
    },
  });

  return (
    <Box
      flex={1}
      minH={0}
      display="flex"
      flexDirection="column"
      pointerEvents="auto"
      bg={{ base: "white", _dark: "gray.800" }}
      overflow="hidden"
    >
      <RichTextEditor.Root
        editor={editor}
        display="flex"
        flexDirection="column"
        flex={1}
        minH={0}
        borderWidth={0}
        rounded={0}
      >
        <RichTextEditor.Toolbar variant="fixed">
          <RichTextEditor.ControlGroup>
            <Control.FontSize />
          </RichTextEditor.ControlGroup>
          <RichTextEditor.ControlGroup>
            <Control.Bold />
            <Control.Italic />
            <Control.Underline />
            <Control.Strikethrough />
          </RichTextEditor.ControlGroup>
          <RichTextEditor.ControlGroup>
            <Control.BulletList />
            <Control.OrderedList />
          </RichTextEditor.ControlGroup>
        </RichTextEditor.Toolbar>
        <Box flex={1} minH={0} overflow="auto">
          <RichTextEditor.Content />
        </Box>
      </RichTextEditor.Root>
    </Box>
  );
}

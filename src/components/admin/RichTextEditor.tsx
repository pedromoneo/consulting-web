"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useEffect, useState } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    onImageUpload?: (file: File) => Promise<string>;
    className?: string;
}

const MenuButton = ({
    isActive = false,
    onClick,
    disabled = false,
    children,
    title
}: {
    isActive?: boolean;
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
}) => (
    <button
        onClick={(e) => { e.preventDefault(); onClick(); }}
        disabled={disabled}
        title={title}
        className={`
            p-1.5 rounded text-xs border transition-all flex items-center justify-center min-w-[24px] min-h-[24px]
            ${isActive
                ? 'bg-accent text-white border-accent'
                : 'bg-background hover:bg-surface border-border text-muted-foreground hover:text-foreground'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
    >
        {children}
    </button>
);

export default function RichTextEditor({ value, onChange, placeholder, onImageUpload, className = "" }: RichTextEditorProps) {
    const [isSourceMode, setIsSourceMode] = useState(false);
    const [sourceContent, setSourceContent] = useState(value);
    const [isUploading, setIsUploading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto my-4 border border-border',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-accent hover:underline cursor-pointer',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Start typing...',
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
            setSourceContent(html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose max-w-none focus:outline-none min-h-[200px] p-4 text-foreground',
            },
        },
        immediatelyRender: false,
    });

    // Update editor content if value changes externally (and not focused or source mode)
    useEffect(() => {
        if (editor && !editor.isFocused && !isSourceMode && value !== editor.getHTML()) {
            // Check if content is actually different to avoid loop
            if (editor.getHTML() !== value) {
                editor.commands.setContent(value);
            }
        }
    }, [value, editor, isSourceMode]);

    // Handle source mode toggle
    const toggleSourceMode = () => {
        if (isSourceMode) {
            // Switching back to visual
            editor?.commands.setContent(sourceContent);
            onChange(sourceContent);
        } else {
            // Switching to source
            setSourceContent(editor?.getHTML() || "");
        }
        setIsSourceMode(!isSourceMode);
    };

    const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSourceContent(e.target.value);
        onChange(e.target.value);
    };

    const addImage = useCallback(async () => {
        if (!onImageUpload) return;

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = async () => {
            if (input.files?.length) {
                const file = input.files[0];
                setIsUploading(true);
                try {
                    const url = await onImageUpload(file);
                    if (url && editor) {
                        editor.chain().focus().setImage({ src: url }).run();
                    }
                } catch (error) {
                    console.error("Failed to upload image", error);
                    alert("Failed to upload image");
                } finally {
                    setIsUploading(false);
                }
            }
        };

        input.click();
    }, [editor, onImageUpload]);

    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) return;

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) {
        return <div className="h-64 flex items-center justify-center border border-border rounded-lg bg-background text-muted">Loading editor...</div>;
    }

    return (
        <div className={`flex flex-col border border-border rounded-lg overflow-hidden bg-background ${className}`}>
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-surface/50">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    disabled={isSourceMode}
                    title="Bold"
                >
                    <span className="font-bold font-serif">B</span>
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    disabled={isSourceMode}
                    title="Italic"
                >
                    <span className="italic font-serif">I</span>
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    disabled={isSourceMode}
                    title="Strikethrough"
                >
                    <span className="line-through font-serif">S</span>
                </MenuButton>

                <div className="w-px h-4 bg-border mx-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    disabled={isSourceMode}
                    title="Heading 1"
                >
                    <span className="font-bold text-xs">H1</span>
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    disabled={isSourceMode}
                    title="Heading 2"
                >
                    <span className="font-bold text-xs">H2</span>
                </MenuButton>

                <div className="w-px h-4 bg-border mx-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    disabled={isSourceMode}
                    title="Bullet List"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    disabled={isSourceMode}
                    title="Ordered List"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="10" y1="6" x2="21" y2="6"></line>
                        <line x1="10" y1="12" x2="21" y2="12"></line>
                        <line x1="10" y1="18" x2="21" y2="18"></line>
                        <path d="M4 6h1v4"></path>
                        <path d="M4 10h2"></path>
                        <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                    </svg>
                </MenuButton>

                <div className="w-px h-4 bg-border mx-1" />

                <MenuButton
                    onClick={setLink}
                    isActive={editor.isActive('link')}
                    disabled={isSourceMode}
                    title="Link"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                </MenuButton>

                {onImageUpload && (
                    <MenuButton
                        onClick={addImage}
                        disabled={isSourceMode || isUploading}
                        title="Upload Image"
                    >
                        {isUploading ? (
                            <div className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
                        ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                        )}
                    </MenuButton>
                )}

                <div className="flex-1" />

                <MenuButton
                    onClick={toggleSourceMode}
                    isActive={isSourceMode}
                    title={isSourceMode ? "Switch to Visual Editor" : "Switch to HTML Source"}
                >
                    <span className="text-[10px] uppercase font-bold tracking-wider">{isSourceMode ? "Visual" : "HTML"}</span>
                </MenuButton>
            </div>

            {isSourceMode ? (
                <textarea
                    value={sourceContent}
                    onChange={handleSourceChange}
                    className="w-full h-64 p-4 font-mono text-sm bg-background text-foreground outline-none resize-y"
                    placeholder="HTML Source Code"
                />
            ) : (
                <EditorContent editor={editor} className="min-h-[200px]" />
            )}
        </div>
    );
}

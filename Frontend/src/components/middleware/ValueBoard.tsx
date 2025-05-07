import React, { useState, ReactNode, MouseEvent } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PlusIcon, GripVertical, Trash2, Type, CheckSquare, Image, Code, Table2, LucideIcon } from 'lucide-react';


interface ButtonProps {
  children: ReactNode;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const Button = ({ children, onClick, className }: ButtonProps) => (
  <button 
    className={`px-4 py-2 rounded-md flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors ${className || ''}`}
    onClick={onClick}
  >
    {children}
  </button>
);

interface IconButtonProps {
  icon: LucideIcon;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const IconButton = ({ icon: Icon, onClick, className }: IconButtonProps) => (
  <button 
    className={`p-2 rounded-md hover:bg-gray-200 transition-colors ${className || ''}`}
    onClick={onClick}
  >
    <Icon size={16} />
  </button>
);

// Define types for blocks
type BlockType = 'TEXT' | 'TODO' | 'IMAGE' | 'CODE' | 'TABLE';

interface BlockTypeInfo {
  label: string;
  icon: LucideIcon;
}

interface BaseBlock {
  id: string;
  type: BlockType;
  content?: string;
}

interface TextBlock extends BaseBlock {
  type: 'TEXT';
  content: string;
}

interface TodoBlock extends BaseBlock {
  type: 'TODO';
  content: string;
  checked: boolean;
}

interface ImageBlock extends BaseBlock {
  type: 'IMAGE';
  imageUrl?: string;
  caption?: string;
}

interface CodeBlock extends BaseBlock {
  type: 'CODE';
  content: string;
  language?: string;
}

interface TableBlock extends BaseBlock {
  type: 'TABLE';
  rows: string[][];
}

type Block = TextBlock | TodoBlock | ImageBlock | CodeBlock | TableBlock;

// Block types and their icons
const BLOCK_TYPES: Record<BlockType, BlockTypeInfo> = {
  TEXT: { label: 'Text', icon: Type },
  TODO: { label: 'To-do', icon: CheckSquare },
  IMAGE: { label: 'Image', icon: Image },
  CODE: { label: 'Code', icon: Code },
  TABLE: { label: 'Table', icon: Table2 },
};

interface SortableItemProps {
  id: string;
  block: Block;
  onRemove: (id: string) => void;
  onChange: (id: string, updatedBlock: Block) => void;
}

// SortableItem component that wraps each block
function SortableItem({ id, block, onRemove, onChange }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'TEXT':
        return (
          <textarea
            className="w-full p-2 outline-none resize-none bg-transparent border-none"
            value={block.content}
            placeholder="Type something..."
            onChange={(e) => onChange(id, { ...block, content: e.target.value })}
            rows={Math.max(1, (block.content?.split('\n').length || 0))}
          />
        );
      case 'TODO':
        return (
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={block.checked || false}
              onChange={(e) => onChange(id, { ...block, checked: e.target.checked })}
              className="h-4 w-4"
            />
            <input
              className="w-full p-2 outline-none bg-transparent border-none"
              value={block.content}
              placeholder="To-do item"
              onChange={(e) => onChange(id, { ...block, content: e.target.value })}
            />
          </div>
        );
      case 'IMAGE':
        return (
          <div className="flex flex-col gap-2">
            {block.imageUrl ? (
              <img src={block.imageUrl} alt="User uploaded" className="max-h-64 object-contain" />
            ) : (
              <div className="h-32 bg-gray-100 flex items-center justify-center rounded-md">
                <input
                  type="text"
                  className="w-full p-2 outline-none bg-transparent border-none"
                  value={block.imageUrl || ''}
                  placeholder="Paste image URL"
                  onChange={(e) => onChange(id, { ...block, imageUrl: e.target.value })}
                />
              </div>
            )}
            <input
              className="w-full p-2 outline-none bg-transparent border-none text-sm text-gray-500"
              value={block.caption || ''}
              placeholder="Add a caption..."
              onChange={(e) => onChange(id, { ...block, caption: e.target.value })}
            />
          </div>
        );
      case 'CODE':
        return (
          <div className="flex flex-col gap-2">
            <div className="px-2 py-1 bg-gray-100 text-xs rounded-t-md flex justify-between">
              <input
                className="bg-transparent border-none outline-none"
                value={block.language || ''}
                placeholder="Language"
                onChange={(e) => onChange(id, { ...block, language: e.target.value })}
              />
            </div>
            <textarea
              className="w-full p-2 outline-none resize-none bg-gray-50 font-mono text-sm"
              value={block.content}
              placeholder="Enter code..."
              onChange={(e) => onChange(id, { ...block, content: e.target.value })}
              rows={Math.max(3, (block.content?.split('\n').length || 0))}
            />
          </div>
        );
      case 'TABLE':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <tbody>
                {(block.rows || [['', '']]).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-200 p-1">
                        <input
                          className="w-full p-1 outline-none bg-transparent border-none"
                          value={cell}
                          onChange={(e) => {
                            const newRows = [...(block.rows || [['', '']])];
                            newRows[rowIndex][cellIndex] = e.target.value;
                            onChange(id, { ...block, rows: newRows });
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-2 mt-2">
              <button
                className="text-xs text-blue-500 hover:text-blue-700"
                onClick={() => {
                  const rows = [...(block.rows || [['', '']])];
                  rows.push(Array(rows[0]?.length || 2).fill(''));
                  onChange(id, { ...block, rows });
                }}
              >
                Add row
              </button>
              <button
                className="text-xs text-blue-500 hover:text-blue-700"
                onClick={() => {
                  const rows = [...(block.rows || [['', '']])];
                  rows.forEach(row => row.push(''));
                  onChange(id, { ...block, rows });
                }}
              >
                Add column
              </button>
            </div>
          </div>
        );
      default:
        return <div>Unknown block type</div>;
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="mb-2 group"
    >
      <div className="flex gap-2 p-2 rounded-md border border-transparent hover:border-gray-200 group-hover:bg-gray-50 transition-all">
        <div 
          className="cursor-grab flex items-center opacity-0 group-hover:opacity-100 transition-opacity" 
          {...attributes} 
          {...listeners}
        >
          <GripVertical size={16} className="text-gray-400" />
        </div>
        <div className="flex-grow">
          {renderBlockContent()}
        </div>
        <IconButton 
          icon={Trash2} 
          onClick={() => onRemove(id)} 
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
        />
      </div>
    </div>
  );
}

interface BlockTypeSelectorProps {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

// Block type selector component
function BlockTypeSelector({ onSelect, onClose }: BlockTypeSelectorProps) {
  return (
    <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-md shadow-lg border border-gray-200 z-10 w-64">
      <div className="text-xs text-gray-500 mb-2 px-2">BASIC BLOCKS</div>
      {Object.entries(BLOCK_TYPES).map(([type, { label, icon: Icon }]) => (
        <button
          key={type}
          className="flex items-center gap-2 p-2 w-full hover:bg-gray-100 rounded-md text-left transition-colors"
          onClick={() => {
            onSelect(type as BlockType);
            onClose();
          }}
        >
          <Icon size={16} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}


export default function TelosValues() {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'TEXT', content: 'Welcome to Telos, please add values you would like to keep track of below' },
    { id: '2', type: 'TODO', content: 'Try adding new blocks', checked: false },
    { id: '3', type: 'TEXT', content: 'Drag blocks to reorder them' },
  ]);
  
  const [showSelector, setShowSelector] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addBlock = (type: BlockType) => {
    const newBlockBase = {
      id: Date.now().toString(),
      type,
    };
    
    let newBlock: Block;
    
    // Create specific block types with their required properties
    switch (type) {
      case 'TEXT':
        newBlock = { ...newBlockBase, type: 'TEXT', content: '' };
        break;
      case 'TODO':
        newBlock = { ...newBlockBase, type: 'TODO', content: '', checked: false };
        break;
      case 'IMAGE':
        newBlock = { ...newBlockBase, type: 'IMAGE' };
        break;
      case 'CODE':
        newBlock = { ...newBlockBase, type: 'CODE', content: '' };
        break;
      case 'TABLE':
        newBlock = { ...newBlockBase, type: 'TABLE', rows: [['', ''], ['', '']] };
        break;
      default:
        // This should never happen due to TypeScript, but just in case
        newBlock = { ...newBlockBase, type: 'TEXT', content: '' };
    }
    
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };
  
  const updateBlock = (id: string, updatedBlock: Block) => {
    setBlocks(blocks.map(block => block.id === id ? updatedBlock : block));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Telos</h1>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          <div className="mb-8">
            {blocks.map(block => (
              <SortableItem 
                key={block.id} 
                id={block.id} 
                block={block}
                onRemove={removeBlock}
                onChange={updateBlock}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      <div className="relative">
        <Button 
          onClick={() => setShowSelector(!showSelector)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800"
        >
          <PlusIcon size={16} />
          Add a block
        </Button>
        
        {showSelector && (
          <BlockTypeSelector
            onSelect={addBlock}
            onClose={() => setShowSelector(false)}
          />
        )}
      </div>
    </div>
  );
}

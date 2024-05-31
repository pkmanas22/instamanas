import { useState } from "react";

export function GeneratePostCaption({ caption }: { caption: string | null }): React.ReactNode {

    const [isTruncated, setIsTruncated] = useState<boolean>(true);
  
    const toggleTruncate = () => {
      setIsTruncated(!isTruncated);
    };
  
    if (!caption) {
      return <div></div>;
    }
  
    const truncatedCaption = caption.length > 40 ? caption.slice(0, 40) + '...' : caption;
  
    return (
      <span className='text-gray-400'>
        {isTruncated ? truncatedCaption : caption}
        {caption.length > 40 && (
          <button onClick={toggleTruncate} className="text-blue-500 ml-2">
            {isTruncated ? 'Show more' : 'Show less'}
          </button>
        )}
      </span>
    );
  }
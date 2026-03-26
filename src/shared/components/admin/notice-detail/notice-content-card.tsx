import '@toast-ui/editor/dist/toastui-editor.css';

type NoticeContentCardProps = {
  content: string;
};

const NoticeContentCard = ({ content }: NoticeContentCardProps) => {
  if (content.trim().startsWith('<')) {
    return (
      <div
        className="toastui-editor-contents text-[1.14rem] leading-[2] tracking-[-0.02em] text-[#202124] md:text-[1.28rem] [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#D6DDFB] [&_blockquote]:bg-[#F7F9FF] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_br]:leading-[2] [&_h1]:mt-8 [&_h1]:text-[1.8rem] [&_h1]:font-semibold [&_h2]:mt-7 [&_h2]:text-[1.6rem] [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-[1.45rem] [&_h3]:font-semibold [&_h4]:mt-5 [&_h4]:text-[1.32rem] [&_h4]:font-semibold [&_h5]:mt-4 [&_h5]:text-[1.2rem] [&_h5]:font-semibold [&_img]:my-6 [&_img]:max-w-full [&_img]:rounded-[1.6rem] [&_img]:border [&_img]:border-[#ECECEC] [&_li]:ml-6 [&_li]:leading-[1.9] [&_li.task-list-item]:ml-0 [&_li.task-list-item]:list-none [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:min-h-[1.4rem] [&_p]:leading-[1.95] [&_strong]:font-semibold [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-[0.4rem] [&_tbody_tr:nth-child(even)]:bg-[#FAFAFA] [&_td]:border [&_td]:border-[#E6E6E6] [&_td]:px-4 [&_td]:py-3 [&_th]:border [&_th]:border-[#D9D9D9] [&_th]:bg-[#F7F9FF] [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-4"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  const paragraphs = content
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-8">
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${paragraph}-${index}`}
          className="text-[1.14rem] leading-[2] tracking-[-0.02em] text-[#202124] md:text-[1.28rem]"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default NoticeContentCard;

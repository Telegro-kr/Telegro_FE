type NoticeContentCardProps = {
  content: string;
};

const NoticeContentCard = ({ content }: NoticeContentCardProps) => {
  if (content.trim().startsWith('<')) {
    return (
      <div
        className="text-[1.14rem] leading-[2] tracking-[-0.02em] text-[#202124] md:text-[1.28rem] [&_h1]:text-[1.5rem] [&_h1]:font-semibold [&_h2]:text-[1.45rem] [&_h2]:font-semibold [&_h3]:text-[1.4rem] [&_h3]:font-semibold [&_h4]:text-[1.3rem] [&_h4]:font-semibold [&_h5]:text-[1.2rem] [&_h5]:font-semibold [&_p]:min-h-[1.4rem] [&_strong]:font-semibold"
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

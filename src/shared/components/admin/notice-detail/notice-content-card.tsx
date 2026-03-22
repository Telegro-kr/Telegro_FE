type NoticeContentCardProps = {
  paragraphs: string[];
};

const NoticeContentCard = ({ paragraphs }: NoticeContentCardProps) => {
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
